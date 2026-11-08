from typing import Any, Dict, List
import httpx
from config import settings


def _explain_nfi_tag(enter_tag: str | None, exit_reason: str | None, is_short: bool = False) -> str:
    """Traduz as tags técnicas do NostalgiaForInfinityX8 em linguagem clara para o Chefe."""
    tag = (enter_tag or "sinal_padrao_nfi").strip()
    exit_r = (exit_reason or "em_aberto").strip()
    direction = "SHORT (Venda)" if is_short else "LONG (Compra)"

    tag_explanation = (
        f"A condição `{tag}` em {direction} buscou uma distorção de curto prazo no gráfico de 5m "
        "(exaustão de RSI combinada com afastamento das Bandas de Bollinger/EMA) validada pelo filtro macro de 15m/1h/4h."
    )
    if "14" in tag or "dip" in tag.lower():
        tag_explanation = (
            f"O sinal `{tag}` ({direction}) entrou comprando um 'dip' (queda rápida com sobrevenda no RSI de 5m) "
            "apostando em repique imediato até a média móvel."
        )
    elif "rapid" in tag.lower() or "scalp" in tag.lower():
        tag_explanation = (
            f"O sinal `{tag}` ({direction}) executou um scalp rápido de volatilidade em vela de exaustão."
        )

    exit_explanation = f"Saída acionada por `{exit_r}`."
    if "roi" in exit_r.lower():
        exit_explanation = "A saída ocorreu pela tabela dinâmica de ROI (alvo de lucro atingido no tempo esperado)."
    elif "stop_loss" in exit_r.lower() or "stoploss" in exit_r.lower():
        exit_explanation = "A saída foi forçada pelo Stop Loss / proteção de drawdown após o fluxo continuar contra a posição."
    elif "exit_signal" in exit_r.lower() or "sell" in exit_r.lower():
        exit_explanation = "O próprio algoritmo NFI X8 detectou perda de força compradora e fechou a posição preventivamente."

    return f"{tag_explanation} {exit_explanation}"


def _build_local_audit_fallback(
    mood_data: Dict[str, Any],
    wallet_balance: float,
    daily_profit_usdt: float,
    daily_profit_pct: float,
    latest_trade: Dict[str, Any] | None,
) -> str:
    """
    Gera parecer executivo sincero seguindo o SKILL.md quando nenhuma LLM_API_KEY estiver configurada
    ou em caso de indisponibilidade externa.
    """
    mood = mood_data.get("mood", "CONFIANTE")
    if latest_trade:
        pair = latest_trade.get("pair", "BTC/USDT:USDT")
        profit_pct = float(latest_trade.get("profit_ratio", 0.0) or 0.0) * 100.0
        profit_abs = float(latest_trade.get("profit_abs", 0.0) or 0.0)
        enter_tag = latest_trade.get("enter_tag", "nfi_x8_entry")
        exit_reason = latest_trade.get("exit_reason", "exit_signal")
        is_short = bool(latest_trade.get("is_short", False))
        tech_summary = _explain_nfi_tag(enter_tag, exit_reason, is_short)

        if profit_pct < 0:
            verdict = (
                f"PUXÃO DE ORELHA NO FUNCIONÁRIO X8: Entrou precipitado em {pair} ({profit_pct:+.2f}% / {profit_abs:+.2f} USDT). "
                "Tentou adivinhar fundo antes da vela de 15m confirmar absorção de volume e acabou violinado."
            )
        else:
            verdict = (
                f"ELOGIO TÉCNICO CONTIDO: Boa execução em {pair} ({profit_pct:+.2f}% / {profit_abs:+.2f} USDT). "
                "Aguardou a exaustão correta no 5m e colocou o dinheiro no bolso sem ganância."
            )
    else:
        tech_summary = "Nenhuma ordem encerrada recentemente; monitorando livro de ofertas em BTC/USDT:USDT e ETH/USDT:USDT."
        verdict = f"Funcionário X8 operando sob estado {mood} com saldo simulado de {wallet_balance:.2f} USDT ({daily_profit_usdt:+.2f} USDT / {daily_profit_pct:+.2f}% no dia)."

    return (
        f"1. DIAGNÓSTICO DA OPERAÇÃO:\n{tech_summary}\n\n"
        f"2. VEREDITO DO GERENTE ({mood}):\n{verdict}\n\n"
        f"3. RECOMENDAÇÃO DE RISCO:\n{mood_data.get('recommendation', 'Manter monitoramento rigoroso de margem isolada.')}"
    )


async def generate_executive_audit(
    mood_data: Dict[str, Any],
    wallet_balance: float,
    daily_profit_usdt: float,
    daily_profit_pct: float,
    open_trades: List[Dict[str, Any]],
    closed_trades: List[Dict[str, Any]],
    performance: List[Dict[str, Any]],
    trigger_reason: str = "manual_report",
) -> Dict[str, Any]:
    """
    Chama o provedor de IA (Gemini / OpenAI / Anthropic) SOMENTE sob demanda
    (quando uma ordem fecha ou quando o Chefe convoca o Gerente na sala).
    """
    latest_trade = closed_trades[0] if closed_trades else (open_trades[0] if open_trades else None)
    skill_guidelines = settings.load_skill_guidelines()

    user_prompt = f"""
Gere o Parecer Executivo para a Prancheta do Chefe.
Motivo do acionamento: {trigger_reason}
Saldo Atual (Dry-Run): {wallet_balance:.2f} USDT
Resultado do Dia: {daily_profit_usdt:+.2f} USDT ({daily_profit_pct:+.2f}%)
Estado de Humor do Funcionário NFI X8: {mood_data.get('mood')} (Win Streak: {mood_data.get('win_streak')}, Loss Streak: {mood_data.get('loss_streak')})
Alocação de Lote Permitida: {mood_data.get('lot_allocation_pct')}%
Última Operação Relevante: {latest_trade}
Trades Abertos Agora: {len(open_trades)}
Performance por Par: {performance}

Siga rigorosamente a estrutura de 3 pontos do SKILL.md (Diagnóstico, Veredito sincero com puxão de orelha se errou ou elogio se acertou, e Recomendação de Risco). Seja direto, sem enrolação.
""".strip()

    api_key = settings.LLM_API_KEY.strip()
    if not api_key or api_key == "coloque_sua_api_key_aqui":
        return {
            "provider": "local_heuristic_auditor (sem gasto de token)",
            "trigger": trigger_reason,
            "report_text": _build_local_audit_fallback(
                mood_data, wallet_balance, daily_profit_usdt, daily_profit_pct, latest_trade
            ),
        }

    provider = settings.LLM_PROVIDER
    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            if provider == "gemini":
                url = (
                    f"https://generativelanguage.googleapis.com/v1beta/models/"
                    f"{settings.LLM_MODEL}:generateContent?key={api_key}"
                )
                payload = {
                    "system_instruction": {"parts": [{"text": skill_guidelines}]},
                    "contents": [{"role": "user", "parts": [{"text": user_prompt}]}],
                    "generationConfig": {"temperature": 0.4, "maxOutputTokens": 600},
                }
                resp = await client.post(url, json=payload)
                resp.raise_for_status()
                data = resp.json()
                text = (
                    data.get("candidates", [{}])[0]
                    .get("content", {})
                    .get("parts", [{}])[0]
                    .get("text", "")
                )
                if text:
                    return {"provider": f"gemini ({settings.LLM_MODEL})", "trigger": trigger_reason, "report_text": text.strip()}

            elif provider == "openai":
                url = "https://api.openai.com/v1/chat/completions"
                headers = {"Authorization": f"Bearer {api_key}"}
                payload = {
                    "model": settings.LLM_MODEL or "gpt-4o-mini",
                    "messages": [
                        {"role": "system", "content": skill_guidelines},
                        {"role": "user", "content": user_prompt},
                    ],
                    "temperature": 0.4,
                    "max_tokens": 600,
                }
                resp = await client.post(url, headers=headers, json=payload)
                resp.raise_for_status()
                data = resp.json()
                text = data["choices"][0]["message"]["content"]
                return {"provider": f"openai ({settings.LLM_MODEL})", "trigger": trigger_reason, "report_text": text.strip()}

            elif provider == "anthropic":
                url = "https://api.anthropic.com/v1/messages"
                headers = {
                    "x-api-key": api_key,
                    "anthropic-version": "2023-06-01",
                }
                payload = {
                    "model": settings.LLM_MODEL or "claude-3-5-haiku-latest",
                    "max_tokens": 600,
                    "system": skill_guidelines,
                    "messages": [{"role": "user", "content": user_prompt}],
                }
                resp = await client.post(url, headers=headers, json=payload)
                resp.raise_for_status()
                data = resp.json()
                text = data["content"][0]["text"]
                return {"provider": f"anthropic ({settings.LLM_MODEL})", "trigger": trigger_reason, "report_text": text.strip()}

    except Exception as exc:
        fallback = _build_local_audit_fallback(
            mood_data, wallet_balance, daily_profit_usdt, daily_profit_pct, latest_trade
        )
        return {
            "provider": f"fallback (erro LLM: {exc})",
            "trigger": trigger_reason,
            "report_text": fallback,
        }

    return {
        "provider": "local_heuristic_auditor",
        "trigger": trigger_reason,
        "report_text": _build_local_audit_fallback(
            mood_data, wallet_balance, daily_profit_usdt, daily_profit_pct, latest_trade
        ),
    }

