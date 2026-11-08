import { MoodType, OfficeScenarioState } from './types';

export const DEMO_SCENARIOS: Record<MoodType, OfficeScenarioState> = {
  CONFIANTE: {
    mood: 'CONFIANTE',
    moodLabel: 'CONFIANTE (Lote 100%)',
    walletBalance: 1024.8,
    dailyProfitUsdt: 24.8,
    dailyProfitPct: 2.48,
    winStreak: 3,
    lossStreak: 0,
    lotAllocationPct: 100,
    freqtradeLocked: false,
    employeeThought: 'RSI 5m sobrevendido + BTC 4h firme! Entrando limpo no dip 🚀🔥',
    managerSpeechAtWall: 'BTCUSDT e ETHUSDT respeitando suporte de 5m. Fluxo comprador limpo no telão!',
    managerSpeechAtDesk: 'Boa leitura, NFI X8! 3 gains seguidos (+2.48% hoje). Pode operar com 100% do lote!',
    executiveReport:
      '1. DIAGNÓSTICO DA OPERAÇÃO:\n' +
      'O Funcionário NFI X8 executou uma compra cirúrgica em BTC/USDT:USDT (sinal `long_nfi_dip_44`) após exaustão do RSI de 5 minutos em cima da Banda de Bollinger inferior, com saída no alvo dinâmico (`roi`) garantindo +1.15% (+11.50 USDT).\n\n' +
      '2. VEREDITO DO GERENTE (CONFIANTE — 3 Wins Seguidos):\n' +
      'Elogio técnico merecido! O robô esperou a confirmação do filtro macro de 4h antes de comprar o recuo e não segurou posição além do necessário.\n\n' +
      '3. RECOMENDAÇÃO DE RISCO:\n' +
      'Manter 100% do lote normal liberado em BTC/USDT:USDT e ETH/USDT:USDT. Sem travas ativas, mas sigo vigiando para evitar euforia.',
    recentTrades: [
      {
        id: 104,
        pair: 'BTC/USDT:USDT',
        side: 'LONG',
        profitPct: 1.15,
        profitUsdt: 11.5,
        enterTag: 'long_nfi_dip_44',
        exitReason: 'roi_table_step2',
        closedAt: 'Há 6 min',
      },
      {
        id: 103,
        pair: 'ETH/USDT:USDT',
        side: 'LONG',
        profitPct: 0.85,
        profitUsdt: 8.5,
        enterTag: 'long_nfi_ema_rebound_12',
        exitReason: 'exit_signal_rsi_high',
        closedAt: 'Há 28 min',
      },
      {
        id: 102,
        pair: 'BTC/USDT:USDT',
        side: 'SHORT',
        profitPct: 0.48,
        profitUsdt: 4.8,
        enterTag: 'short_nfi_overbought_201',
        exitReason: 'trailing_stop_loss',
        closedAt: 'Há 1h 15m',
      },
    ],
    performance: [
      { pair: 'BTC/USDT:USDT', profitPct: 1.63, tradesCount: 2 },
      { pair: 'ETH/USDT:USDT', profitPct: 0.85, tradesCount: 1 },
    ],
  },

  RECEOSO: {
    mood: 'RECEOSO',
    moodLabel: 'RECEOSO (Alerta Amarelo)',
    walletBalance: 991.4,
    dailyProfitUsdt: -8.6,
    dailyProfitPct: -0.86,
    winStreak: 0,
    lossStreak: 1,
    lotAllocationPct: 50,
    freqtradeLocked: false,
    employeeThought: 'Aquele pavio no ETH me pegou de surpresa... Vou filtrar melhor o próximo sinal 👀⚠️',
    managerSpeechAtWall: 'Volatilidade chata no 5m... Pavios longos varrendo liquidez em ETHUSDT.',
    managerSpeechAtDesk: 'Sinal amarelo, X8! Você acabou de tomar 1 loss no ETH. Nada de caçar fundo antes da hora!',
    executiveReport:
      '1. DIAGNÓSTICO DA OPERAÇÃO:\n' +
      'A última entrada em ETH/USDT:USDT (`long_nfi_rapid_19`) tentou antecipar um repique de sobrevenda no gráfico de 5m, mas o fluxo vendedor de 15m continuou pressionando e acionou saída defensiva (`exit_signal_stoploss_guard`) em -0.86% (-8.60 USDT).\n\n' +
      '2. VEREDITO DO GERENTE (RECEOSO — Alerta Amarelo):\n' +
      'Puxão de orelha leve no NFI X8: entrou apressado numa vela que ainda não tinha fechado absorção de volume. O prejuízo foi pequeno porque a defesa agiu rápido, mas acendeu o alerta amarelo.\n\n' +
      '3. RECOMENDAÇÃO DE RISCO:\n' +
      'Cautela máxima nas próximas entradas! Sugerida redução preventiva de exposição para 50% do lote até recuperar a leitura limpa do BTC/USDT:USDT.',
    recentTrades: [
      {
        id: 105,
        pair: 'ETH/USDT:USDT',
        side: 'LONG',
        profitPct: -0.86,
        profitUsdt: -8.6,
        enterTag: 'long_nfi_rapid_19',
        exitReason: 'exit_signal_stoploss_guard',
        closedAt: 'Há 3 min',
      },
      {
        id: 104,
        pair: 'BTC/USDT:USDT',
        side: 'LONG',
        profitPct: 0.62,
        profitUsdt: 6.2,
        enterTag: 'long_nfi_dip_44',
        exitReason: 'roi',
        closedAt: 'Há 45 min',
      },
    ],
    performance: [
      { pair: 'BTC/USDT:USDT', profitPct: 0.62, tradesCount: 1 },
      { pair: 'ETH/USDT:USDT', profitPct: -0.86, tradesCount: 1 },
    ],
  },

  TILTADO: {
    mood: 'TILTADO',
    moodLabel: 'TILTADO / DE CASTIGO NO CAFÉ',
    walletBalance: 974.2,
    dailyProfitUsdt: -25.8,
    dailyProfitPct: -2.58,
    winStreak: 0,
    lossStreak: 2,
    lotAllocationPct: 0,
    freqtradeLocked: true,
    employeeThought: 'Tomei 2 violinadas seguidas... Gerente travou meu terminal e me mandou pro café ☕😭',
    managerSpeechAtWall: 'Mercado em cascata de liquidação! Ainda bem que travei a mesa antes de entregar mais banca.',
    managerSpeechAtDesk: 'DE CASTIGO, X8! 2 losses seguidos e -2.58% no dia! Acionei /locks e /stopbuy. Vai tomar café!',
    executiveReport:
      '1. DIAGNÓSTICO DA OPERAÇÃO:\n' +
      'O Funcionário NFI X8 insistiu em comprar faca caindo duas vezes seguidas: primeiro em ETH/USDT:USDT (`long_nfi_dip_108`, -1.18%) e logo depois em BTC/USDT:USDT (`long_nfi_knife_catch_62`, -1.40%), acumulando -25.80 USDT (-2.58% da banca no dia).\n\n' +
      '2. VEREDITO DO GERENTE (TILTADO / DE CASTIGO):\n' +
      'PUXÃO DE ORELHA SEVERO! Operar contra rompimento de volume no 5m é inaceitável. O algoritmo entrou em espiral de tentativa de adivinhar fundo em meio a cascata de liquidação.\n\n' +
      '3. RECOMENDAÇÃO DE RISCO (AÇÃO AUTOMÁTICA EXECUTADA):\n' +
      'Acionei imediatamente o bloqueio temporário na API do Freqtrade (`POST /api/v1/locks` e `POST /api/v1/stopbuy` por 60 minutos) para proteger os 974.20 USDT restantes e mandei o Funcionário X8 para a máquina de café.',
    recentTrades: [
      {
        id: 106,
        pair: 'BTC/USDT:USDT',
        side: 'LONG',
        profitPct: -1.4,
        profitUsdt: -14.0,
        enterTag: 'long_nfi_knife_catch_62',
        exitReason: 'stop_loss_isolated',
        closedAt: 'Agora mesmo',
      },
      {
        id: 105,
        pair: 'ETH/USDT:USDT',
        side: 'LONG',
        profitPct: -1.18,
        profitUsdt: -11.8,
        enterTag: 'long_nfi_dip_108',
        exitReason: 'doom_protection_exit',
        closedAt: 'Há 14 min',
      },
    ],
    performance: [
      { pair: 'BTC/USDT:USDT', profitPct: -1.4, tradesCount: 1 },
      { pair: 'ETH/USDT:USDT', profitPct: -1.18, tradesCount: 1 },
    ],
  },
};

