from typing import Any, Dict, List


class MoodState:
    CONFIANTE = "CONFIANTE"
    RECEOSO = "RECEOSO"
    TILTADO = "TILTADO"


def calculate_streaks(closed_trades: List[Dict[str, Any]]) -> Dict[str, int]:
    """
    Calcula a sequência atual de vitórias (win_streak) ou derrotas (loss_streak)
    a partir dos últimos trades fechados (ordenados do mais antigo para o mais recente ou por close_timestamp).
    """
    if not closed_trades:
        return {"win_streak": 0, "loss_streak": 0}

    sorted_trades = sorted(
        closed_trades,
        key=lambda t: t.get("close_timestamp") or t.get("close_date") or 0,
        reverse=True,
    )

    win_streak = 0
    loss_streak = 0

    for idx, trade in enumerate(sorted_trades):
        profit_ratio = float(trade.get("profit_ratio", 0.0) or 0.0)
        profit_abs = float(trade.get("profit_abs", 0.0) or 0.0)
        is_win = profit_ratio > 0 or profit_abs > 0

        if idx == 0:
            if is_win:
                win_streak = 1
            else:
                loss_streak = 1
        else:
            if win_streak > 0 and is_win:
                win_streak += 1
            elif loss_streak > 0 and not is_win:
                loss_streak += 1
            else:
                break

    return {"win_streak": win_streak, "loss_streak": loss_streak}


def evaluate_employee_mood(
    closed_trades: List[Dict[str, Any]],
    daily_profit_pct: float,
    open_trades: List[Dict[str, Any]] | None = None,
) -> Dict[str, Any]:
    """
    Máquina de Estado de Humor Determinística (0 gasto de token de IA):
    - TILTADO / DE CASTIGO: 2 losses seguidos (loss_streak >= 2) OU perda diária > 2% (daily_profit_pct <= -2.0)
    - CONFIANTE: Win streak >= 2 OU lucro no dia > 1% (desde que não tenha acabado de tomar loss)
    - RECEOSO: 1 loss recente OU drawdown leve (lucro diário < 0% ou trade aberto sofrendo drawdown)
    """
    streaks = calculate_streaks(closed_trades)
    win_streak = streaks["win_streak"]
    loss_streak = streaks["loss_streak"]

    open_drawdown_pct = 0.0
    if open_trades:
        open_drawdown_pct = min(
            [float(t.get("profit_ratio", 0.0) or 0.0) * 100.0 for t in open_trades],
            default=0.0,
        )

    # 1. Regra TILTADO / DE CASTIGO (Prioridade máxima de proteção de banca)
    if loss_streak >= 2 or daily_profit_pct <= -2.0:
        trigger_reason = (
            f"{loss_streak} losses seguidos"
            if loss_streak >= 2
            else f"perda diária de {daily_profit_pct:.2f}% (limite -2.0%)"
        )
        return {
            "mood": MoodState.TILTADO,
            "label": "TILTADO / DE CASTIGO",
            "color": "red",
            "lot_allocation_pct": 0,
            "should_lock_freqtrade": True,
            "win_streak": win_streak,
            "loss_streak": loss_streak,
            "daily_profit_pct": round(daily_profit_pct, 2),
            "manager_speech": (
                f"Chega por agora, X8! Você acumulou {trigger_reason}. "
                "Acionei o /locks e /stopbuy na corretora. Vai tomar um café e esfriar a cabeça!"
            ),
            "employee_thought": "Tomei violinada dupla do mercado... Fui mandado pro café de castigo ☕😣",
            "recommendation": "Comportamento TILTADO detectado. Compras bloqueadas temporariamente via API (/locks e /stopbuy) para blindar os 1000 USDT da banca.",
        }

    # 2. Regra RECEOSO (1 loss recente ou drawdown leve)
    if loss_streak == 1 or daily_profit_pct < 0.0 or open_drawdown_pct <= -1.0:
        return {
            "mood": MoodState.RECEOSO,
            "label": "RECEOSO (Alerta Amarelo)",
            "color": "amber",
            "lot_allocation_pct": 50,
            "should_lock_freqtrade": False,
            "win_streak": win_streak,
            "loss_streak": loss_streak,
            "daily_profit_pct": round(daily_profit_pct, 2),
            "manager_speech": (
                "Sinal amarelo na mesa, X8! Nada de forçar entrada em pavio. "
                "Só entra se o BTC 4h e o RSI 5m estiverem perfeitamente alinhados!"
            ),
            "employee_thought": "Última vela me assustou... Filtrando sinais com cautela redobrada 👀⚠️",
            "recommendation": "Alerta amarelo: sugerida cautela máxima nas entradas e monitoramento curto de stop nas posições de BTC/USDT e ETH/USDT.",
        }

    # 3. Regra CONFIANTE (Win streak >= 2 ou lucro no dia > 1%, ou operação limpa e positiva)
    if win_streak >= 2 or daily_profit_pct > 1.0:
        return {
            "mood": MoodState.CONFIANTE,
            "label": "CONFIANTE",
            "color": "emerald",
            "lot_allocation_pct": 100,
            "should_lock_freqtrade": False,
            "win_streak": win_streak,
            "loss_streak": loss_streak,
            "daily_profit_pct": round(daily_profit_pct, 2),
            "manager_speech": (
                f"Excelente leitura de fluxo, NFI X8! ({win_streak} wins seguidos | {daily_profit_pct:+.2f}% hoje). "
                "Lote 100% liberado, mas mantenha a disciplina no stop!"
            ),
            "employee_thought": "Indicadores cravados no 5m! Buscando próximo dip limpo em BTC e ETH 🚀🔥",
            "recommendation": "Operador em alta performance técnica. Permitido 100% do lote normal sem restrições.",
        }

    # Estado padrão inicial (Estável / Confiante moderado)
    return {
        "mood": MoodState.CONFIANTE,
        "label": "CONFIANTE (Estável)",
        "color": "emerald",
        "lot_allocation_pct": 100,
        "should_lock_freqtrade": False,
        "win_streak": win_streak,
        "loss_streak": loss_streak,
        "daily_profit_pct": round(daily_profit_pct, 2),
        "manager_speech": "Banca protegida e parâmetros do NFI X8 calibrados. Operando com 100% do lote padrão.",
        "employee_thought": "Monitorando candles de 5m em BTC/USDT e ETH/USDT... 🤖📊",
        "recommendation": "Banca estável. Lote normal liberado seguindo regras estritas da estratégia NFI X8.",
    }

