export type MoodType = 'CONFIANTE' | 'RECEOSO' | 'TILTADO';

export type ManagerWaypoint = 'POINT_A_WALL' | 'POINT_B_DESK1' | 'POINT_C_BOSS_CHAIR';

export interface TradeRecord {
  id: number;
  pair: string;
  side: 'LONG' | 'SHORT';
  profitPct: number;
  profitUsdt: number;
  enterTag: string;
  exitReason: string;
  closedAt: string;
  isOpen?: boolean;
}

export interface CoinPerformance {
  pair: string;
  profitPct: number;
  tradesCount: number;
}

export interface OfficeScenarioState {
  mood: MoodType;
  moodLabel: string;
  walletBalance: number;
  dailyProfitUsdt: number;
  dailyProfitPct: number;
  winStreak: number;
  lossStreak: number;
  lotAllocationPct: number;
  freqtradeLocked: boolean;
  employeeThought: string;
  managerSpeechAtWall: string;
  managerSpeechAtDesk: string;
  executiveReport: string;
  recentTrades: TradeRecord[];
  performance: CoinPerformance[];
}

