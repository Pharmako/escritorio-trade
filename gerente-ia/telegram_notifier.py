from typing import Any, Dict
import httpx
from config import settings


async def send_telegram_report(
    report_text: str,
    mood_label: str,
    wallet_balance: float,
    daily_profit_usdt: float,
    daily_profit_pct: float,
) -> Dict[str, Any]:
    """
    Dispara o Relatório Executivo da Prancheta do Gerente diretamente para o Bot do Telegram
    usando TELEGRAM_BOT_TOKEN e TELEGRAM_CHAT_ID configurados no arquivo .env.
    """
    token = settings.TELEGRAM_BOT_TOKEN.strip()
    chat_id = settings.TELEGRAM_CHAT_ID.strip()

    header = (
        "📋 *RELATÓRIO EXECUTIVO — ESCRITÓRIO DE TRADE*\n"
        f"🤖 *Funcionário:* NostalgiaForInfinityX8 (Futuros Isolado)\n"
        f"🧠 *Humor Atual:* `{mood_label}`\n"
        f"💰 *Saldo Simulado:* `{wallet_balance:.2f} USDT`\n"
        f"📈 *Resultado Hoje:* `{daily_profit_usdt:+.2f} USDT ({daily_profit_pct:+.2f}%)`\n"
        "━━━━━━━━━━━━━━━━━━━━━━\n"
    )
    full_message = f"{header}{report_text}"

    if not token or token == "coloque_seu_bot_token_aqui" or not chat_id or chat_id == "coloque_seu_chat_id_aqui":
        return {
            "sent": False,
            "simulated": True,
            "message": "TELEGRAM_BOT_TOKEN ou TELEGRAM_CHAT_ID não configurados no .env. Disparo simulado com sucesso.",
            "preview": full_message,
        }

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": full_message,
        "parse_mode": "Markdown",
        "disable_web_page_preview": True,
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.post(url, json=payload)
        if resp.status_code != 200:
            # Tenta sem parse_mode caso haja caractere especial no texto da LLM
            payload.pop("parse_mode", None)
            resp = await client.post(url, json=payload)
        resp.raise_for_status()
        return {
            "sent": True,
            "simulated": False,
            "telegram_response": resp.json(),
        }

