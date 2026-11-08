from typing import Any, Dict, List
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from config import settings
from freqtrade_client import freqtrade_client
from mood_engine import evaluate_employee_mood
from llm_auditor import generate_executive_audit
from telegram_notifier import send_telegram_report

app = FastAPI(
    title="Gerente de IA — Escritório de Trade (Auditor NFI X8)",
    description=(
        "Microserviço de Gestão de Risco e Psicologia de Trade conectado à REST API do Freqtrade. "
        "Calcula humor sem gastar tokens e invoca LLM apenas sob demanda ou no fechamento de ordens."
    ),
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TelegramDispatchRequest(BaseModel):
    report_text: str
    mood_label: str = "CONFIANTE"
    wallet_balance: float = 1000.0
    daily_profit_usdt: float = 0.0
    daily_profit_pct: float = 0.0


class TradeClosedWebhookPayload(BaseModel):
    trade_id: int | None = None
    pair: str = "BTC/USDT:USDT"
    profit_ratio: float = 0.0
    profit_abs: float = 0.0
    enter_tag: str | None = "nfi_x8_signal"
    exit_reason: str | None = "roi"
    is_short: bool = False
    send_telegram: bool = True


async def _collect_freqtrade_telemetry() -> Dict[str, Any]:
    """
    Coleta em tempo real da REST API do Freqtrade (configurada em FREQTRADE_API_URL, porta 8081):
    - /status (trades abertos)
    - /profit (histórico de lucro)
    - /performance (performance por moeda)
    - /daily e /trades (para cálculo de streak e lucro diário)
    """
    open_trades = await freqtrade_client.get_open_trades()
    profit_summary = await freqtrade_client.get_profit()
    performance = await freqtrade_client.get_performance()
    closed_trades = await freqtrade_client.get_closed_trades(limit=15)
    daily_data = await freqtrade_client.get_daily(days=1)

    starting_balance = float(profit_summary.get("starting_balance", 1000.0) or 1000.0)
    total_profit_abs = float(profit_summary.get("profit_all_coin", 0.0) or 0.0)
    wallet_balance = starting_balance + total_profit_abs

    daily_rows = daily_data.get("data", []) if isinstance(daily_data, dict) else []
    daily_profit_usdt = float(daily_rows[0].get("abs_profit", 0.0)) if daily_rows else total_profit_abs
    daily_profit_pct = (daily_profit_usdt / starting_balance) * 100.0 if starting_balance > 0 else 0.0

    mood_data = evaluate_employee_mood(
        closed_trades=closed_trades,
        daily_profit_pct=daily_profit_pct,
        open_trades=open_trades,
    )

    # Se entrou em estado TILTADO, aciona automaticamente o bloqueio temporário (/locks e /stopbuy)
    punishment_action = None
    if mood_data["should_lock_freqtrade"]:
        punishment_action = await freqtrade_client.apply_punishment_lock(
            reason=f"Castigo Automático Gerente IA: {mood_data['label']}"
        )

    return {
        "connected": True,
        "freqtrade_url": settings.FREQTRADE_API_URL,
        "wallet_balance": round(wallet_balance, 2),
        "starting_balance": round(starting_balance, 2),
        "daily_profit_usdt": round(daily_profit_usdt, 2),
        "daily_profit_pct": round(daily_profit_pct, 2),
        "open_trades": open_trades,
        "closed_trades": closed_trades[:6],
        "performance": performance,
        "mood": mood_data,
        "punishment_action": punishment_action,
    }


@app.get("/api/health")
async def health_check() -> Dict[str, Any]:
    return {
        "status": "ok",
        "service": "gerente-ia",
        "freqtrade_api_url": settings.FREQTRADE_API_URL,
        "llm_provider": settings.LLM_PROVIDER,
    }


@app.get("/api/office-state")
async def get_office_state() -> Dict[str, Any]:
    """
    Endpoint de polling leve (ZERO gasto de token de IA).
    Retorna o humor do Funcionário NFI X8, trades abertos (/status), lucro (/profit)
    e performance por moeda (/performance).
    """
    try:
        return await _collect_freqtrade_telemetry()
    except Exception as exc:
        return {
            "connected": False,
            "freqtrade_url": settings.FREQTRADE_API_URL,
            "error": str(exc),
            "message": "Freqtrade API offline ou inacessível no momento. O frontend pode operar em Modo Demonstração.",
        }


@app.post("/api/report/generate")
async def generate_report(send_to_telegram: bool = False) -> Dict[str, Any]:
    """
    Acionado SOMENTE quando o Chefe chama o Gerente na sala ou quando solicita auditoria.
    Coleta os dados do Freqtrade e invoca a LLM econômica sob demanda.
    """
    try:
        telemetry = await _collect_freqtrade_telemetry()
    except Exception as exc:
        return {
            "connected": False,
            "error": f"Não foi possível conectar ao Freqtrade em {settings.FREQTRADE_API_URL}: {exc}",
        }

    audit = await generate_executive_audit(
        mood_data=telemetry["mood"],
        wallet_balance=telemetry["wallet_balance"],
        daily_profit_usdt=telemetry["daily_profit_usdt"],
        daily_profit_pct=telemetry["daily_profit_pct"],
        open_trades=telemetry["open_trades"],
        closed_trades=telemetry["closed_trades"],
        performance=telemetry["performance"],
        trigger_reason="manual_boss_request",
    )

    telegram_result = None
    if send_to_telegram:
        telegram_result = await send_telegram_report(
            report_text=audit["report_text"],
            mood_label=telemetry["mood"]["label"],
            wallet_balance=telemetry["wallet_balance"],
            daily_profit_usdt=telemetry["daily_profit_usdt"],
            daily_profit_pct=telemetry["daily_profit_pct"],
        )

    return {
        "telemetry": telemetry,
        "audit": audit,
        "telegram": telegram_result,
    }


@app.post("/api/webhook/trade-closed")
async def webhook_trade_closed(payload: TradeClosedWebhookPayload) -> Dict[str, Any]:
    """
    Recebe notificação automática quando uma ordem fecha no Freqtrade.
    Avalia a Máquina de Estado de Humor, aplica castigo (/locks + /stopbuy) se TILTADO,
    chama a LLM para auditar a operação e dispara para o Telegram.
    """
    try:
        telemetry = await _collect_freqtrade_telemetry()
    except Exception:
        # Caso o webhook chegue com dados diretos em ambiente isolado
        synthetic_trade = payload.model_dump()
        daily_pct = payload.profit_ratio * 100.0
        mood_data = evaluate_employee_mood([synthetic_trade], daily_pct, [])
        telemetry = {
            "wallet_balance": round(1000.0 + payload.profit_abs, 2),
            "daily_profit_usdt": round(payload.profit_abs, 2),
            "daily_profit_pct": round(daily_pct, 2),
            "open_trades": [],
            "closed_trades": [synthetic_trade],
            "performance": [{"pair": payload.pair, "profit_pct": round(daily_pct, 2)}],
            "mood": mood_data,
        }

    audit = await generate_executive_audit(
        mood_data=telemetry["mood"],
        wallet_balance=telemetry["wallet_balance"],
        daily_profit_usdt=telemetry["daily_profit_usdt"],
        daily_profit_pct=telemetry["daily_profit_pct"],
        open_trades=telemetry["open_trades"],
        closed_trades=telemetry["closed_trades"],
        performance=telemetry["performance"],
        trigger_reason=f"trade_closed ({payload.pair})",
    )

    telegram_result = None
    if payload.send_telegram:
        telegram_result = await send_telegram_report(
            report_text=audit["report_text"],
            mood_label=telemetry["mood"]["label"],
            wallet_balance=telemetry["wallet_balance"],
            daily_profit_usdt=telemetry["daily_profit_usdt"],
            daily_profit_pct=telemetry["daily_profit_pct"],
        )

    return {
        "status": "processed",
        "mood": telemetry["mood"],
        "audit": audit,
        "telegram": telegram_result,
    }


@app.post("/api/telegram/send")
async def dispatch_telegram(req: TelegramDispatchRequest) -> Dict[str, Any]:
    """Envia o relatório executivo visível na Prancheta do Chefe para o Bot do Telegram."""
    return await send_telegram_report(
        report_text=req.report_text,
        mood_label=req.mood_label,
        wallet_balance=req.wallet_balance,
        daily_profit_usdt=req.daily_profit_usdt,
        daily_profit_pct=req.daily_profit_pct,
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=True)

