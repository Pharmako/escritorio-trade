import React, { useEffect, useState } from 'react';
import {
  BellRing,
  Radio,
  TrendingDown,
  TrendingUp,
  Tv,
  Wallet,
} from 'lucide-react';
import { OfficeScene3D } from './components/OfficeScene3D';
import { ExecutiveClipboardModal } from './components/ExecutiveClipboardModal';
import { LiveCandleModal } from './components/LiveCandleModal';
import { DEMO_SCENARIOS } from './mockData';
import { MoodType, OfficeScenarioState } from './types';

const BACKEND_URL =
  (import.meta as any).env?.VITE_GERENTE_API_URL ||
  `http://${typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1'}:8090`;

export const App: React.FC = () => {
  const [demoMode, setDemoMode] = useState<boolean>(false);
  const [backendConnected, setBackendConnected] = useState<boolean>(false);
  const [selectedMood, setSelectedMood] = useState<MoodType>('CONFIANTE');
  const [scenario, setScenario] = useState<OfficeScenarioState>(DEMO_SCENARIOS.CONFIANTE);

  // Estado de convocação do boneco 3D "Claude - Gerente" até a Sala VIP do Chefe
  const [summonedToBoss, setSummonedToBoss] = useState<boolean>(false);
  const [clipboardOpen, setClipboardOpen] = useState<boolean>(false);
  const [candleModalOpen, setCandleModalOpen] = useState<boolean>(false);

  // Preços ao vivo da Binance para o Painel Luminoso LED 3D na parede do fundo
  const [btcPrice, setBtcPrice] = useState<number>(88450.0);
  const [btcChange, setBtcChange] = useState<number>(1.84);
  const [ethPrice, setEthPrice] = useState<number>(3125.5);
  const [ethChange, setEthChange] = useState<number>(1.42);

  // WebSocket público da Binance para alimentar o Letreiro LED 3D em tempo real
  useEffect(() => {
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket(
        'wss://stream.binance.com:9443/stream?streams=btcusdt@miniTicker/ethusdt@miniTicker'
      );
      ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          const data = parsed?.data;
          if (!data) return;
          const close = parseFloat(data.c);
          const open = parseFloat(data.o);
          const pct = open > 0 ? ((close - open) / open) * 100 : 0;
          if (data.s === 'BTCUSDT') {
            setBtcPrice(close);
            setBtcChange(pct);
          } else if (data.s === 'ETHUSDT') {
            setEthPrice(close);
            setEthChange(pct);
          }
        } catch {
          // ignore
        }
      };
    } catch {
      // fallback estático se offline
    }
    return () => {
      if (ws) ws.close();
    };
  }, []);

  // Sincroniza humor no Modo Demonstração
  useEffect(() => {
    if (demoMode) {
      setScenario(DEMO_SCENARIOS[selectedMood]);
    }
  }, [selectedMood, demoMode]);

  // Polling leve ao microserviço /gerente-ia (Zero custo de token)
  useEffect(() => {
    if (demoMode) return;
    let active = true;
    const poll = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/office-state`);
        if (!res.ok) throw new Error('Offline');
        const data = await res.json();
        if (!active) return;

        if (data.connected && data.mood) {
          setBackendConnected(true);
          const moodKey: MoodType = data.mood.mood || 'CONFIANTE';
          const fallbackRef = DEMO_SCENARIOS[moodKey] || DEMO_SCENARIOS.CONFIANTE;
          const rawTrades = [
            ...(Array.isArray(data.open_trades) ? data.open_trades : []),
            ...(Array.isArray(data.closed_trades) ? data.closed_trades : []),
          ];
          const mappedTrades =
            rawTrades.length > 0
              ? rawTrades.slice(0, 6).map((t: any, idx: number) => ({
                  id: Number(t.trade_id || idx + 1),
                  pair: String(t.pair || 'BTC/USDT:USDT'),
                  side: (t.is_short ? 'SHORT' : 'LONG') as 'LONG' | 'SHORT',
                  profitPct: Number(((t.profit_ratio ?? 0) * 100).toFixed(2)),
                  profitUsdt: Number((t.profit_abs ?? 0).toFixed(2)),
                  enterTag: String(t.enter_tag || 'nfi_x8_entry'),
                  exitReason: String(t.exit_reason || (t.is_open ? 'em_aberto' : 'roi')),
                  closedAt: String(t.close_date || (t.is_open ? 'Aberto Agora' : 'Recente')),
                  isOpen: Boolean(t.is_open),
                }))
              : fallbackRef.recentTrades;

          setScenario({
            mood: moodKey,
            moodLabel: data.mood.label || fallbackRef.moodLabel,
            walletBalance: data.wallet_balance ?? 1000,
            dailyProfitUsdt: data.daily_profit_usdt ?? 0,
            dailyProfitPct: data.daily_profit_pct ?? 0,
            winStreak: data.mood.win_streak ?? 0,
            lossStreak: data.mood.loss_streak ?? 0,
            lotAllocationPct: data.mood.lot_allocation_pct ?? 100,
            freqtradeLocked: Boolean(data.mood.should_lock_freqtrade),
            employeeThought: data.mood.employee_thought || fallbackRef.employeeThought,
            managerSpeechAtWall: fallbackRef.managerSpeechAtWall,
            managerSpeechAtDesk: data.mood.manager_speech || fallbackRef.managerSpeechAtDesk,
            executiveReport: fallbackRef.executiveReport,
            recentTrades: mappedTrades,
            performance: fallbackRef.performance,
          });
        } else {
          setBackendConnected(false);
        }
      } catch {
        if (active) setBackendConnected(false);
      }
    };
    poll();
    const timer = setInterval(poll, 8000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [demoMode]);

  // Chama o boneco 3D "Claude - Gerente" para caminhar até a Sala VIP do Chefe
  const handleSummonManager = async (forcedMood?: MoodType) => {
    if (forcedMood && demoMode) {
      setSelectedMood(forcedMood);
      setScenario(DEMO_SCENARIOS[forcedMood]);
    }
    setSummonedToBoss(true);

    if (!demoMode) {
      try {
        const res = await fetch(`${BACKEND_URL}/api/report/generate`, { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          if (data.audit?.report_text) {
            setScenario((prev) => ({
              ...prev,
              executiveReport: data.audit.report_text,
            }));
          }
        }
      } catch {
        // Mantém parecer padrão se offline
      }
    }
  };

  // Quando o boneco 3D do Claude chega fisicamente na cadeira vazia da Sala VIP, abre o Modal
  const handleArrivedAtBossChair = () => {
    setClipboardOpen(true);
  };

  // Libera o Gerente para voltar à ronda 3D pelo escritório
  const handleReleaseManager = () => {
    setClipboardOpen(false);
    setSummonedToBoss(false);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 select-none">
      {/* =====================================================================
          HUD MINIMALISTA FLUTUANTE NO TOPO (90%+ DA TELA LIVRE PARA O 3D)
         ===================================================================== */}
      <header className="fixed top-3 left-1/2 -translate-x-1/2 z-30 w-[96%] max-w-6xl pointer-events-none">
        <div className="pointer-events-auto bg-slate-950/85 backdrop-blur-md border border-slate-700/80 rounded-2xl px-4 py-2.5 shadow-2xl flex flex-wrap items-center justify-between gap-3">
          {/* Saldo da Banca & Lucro do Dia */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-slate-400">Banca:</span>
              <strong className="font-mono text-xs sm:text-sm text-white">
                {scenario.walletBalance.toFixed(2)} USDT
              </strong>
            </div>

            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-xs sm:text-sm font-bold ${
                scenario.dailyProfitUsdt >= 0
                  ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/70 border-rose-500/40 text-rose-300'
              }`}
            >
              {scenario.dailyProfitUsdt >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>
                {scenario.dailyProfitUsdt >= 0 ? '+' : ''}
                {scenario.dailyProfitUsdt.toFixed(2)} USDT ({scenario.dailyProfitPct >= 0 ? '+' : ''}
                {scenario.dailyProfitPct.toFixed(2)}%)
              </span>
            </div>
          </div>

          {/* Botões para Testar o Humor do Funcionário NFI X8 em 3D */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-900/95 p-1 rounded-xl border border-slate-800 gap-1">
              <span className="text-[10px] text-slate-400 px-2 font-bold uppercase hidden lg:inline">
                Humor NFI X8:
              </span>
              <button
                onClick={() => {
                  setDemoMode(true);
                  setSelectedMood('CONFIANTE');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  scenario.mood === 'CONFIANTE'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                😎 Confiante
              </button>
              <button
                onClick={() => {
                  setDemoMode(true);
                  setSelectedMood('RECEOSO');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  scenario.mood === 'RECEOSO'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                😰 Receoso
              </button>
              <button
                onClick={() => {
                  setDemoMode(true);
                  setSelectedMood('TILTADO');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  scenario.mood === 'TILTADO'
                    ? 'bg-rose-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🤬 Tiltado (Vai pro Café)
              </button>
            </div>

            {/* Botão para abrir o Telão de Candles ao Vivo */}
            <button
              onClick={() => setCandleModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-emerald-300 transition cursor-pointer"
            >
              <Tv className="w-3.5 h-3.5" />
              Telão 5m
            </button>

            {/* Alternar Demo vs Backend /gerente-ia */}
            <button
              onClick={() => setDemoMode((prev) => !prev)}
              title="Alternar entre Modo Demonstração e API /gerente-ia"
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                demoMode
                  ? 'bg-slate-900 border-slate-700 text-amber-300'
                  : backendConnected
                  ? 'bg-emerald-950 border-emerald-500/50 text-emerald-300'
                  : 'bg-rose-950 border-rose-500/50 text-rose-300'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              {demoMode ? 'Demo' : backendConnected ? 'API Online' : 'API Offline'}
            </button>

            {/* Botão Chamar Gerente na Sala */}
            <button
              onClick={() => handleSummonManager()}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 transition cursor-pointer"
            >
              <BellRing className="w-3.5 h-3.5" />
              Chamar Gerente
            </button>
          </div>
        </div>
      </header>

      {/* Dica discreta de câmera no rodapé */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="bg-slate-950/75 backdrop-blur px-3.5 py-1 rounded-full border border-slate-800 text-[11px] text-slate-400">
          🖱️ Arraste com o botão esquerdo para girar a câmera • Scroll para Zoom • Botão direito para mover pelo Escritório 3D
        </div>
      </div>

      {/* =====================================================================
          CENÁRIO 3D LOW-POLY EM TELA CHEIA (THREE.JS / REACT THREE FIBER)
         ===================================================================== */}
      <OfficeScene3D
        scenario={scenario}
        btcPrice={btcPrice}
        ethPrice={ethPrice}
        btcChange={btcChange}
        ethChange={ethChange}
        summonedToBoss={summonedToBoss}
        onSummonManager={() => handleSummonManager()}
        onArrivedAtBossChair={handleArrivedAtBossChair}
        onOpenCandleModal={() => setCandleModalOpen(true)}
      />

      {/* MODAL DO TELÃO DE CANDLES AO VIVO DA BINANCE */}
      <LiveCandleModal isOpen={candleModalOpen} onClose={() => setCandleModalOpen(false)} />

      {/* MODAL DA PRANCHETA DE RELATÓRIO EXECUTIVO (QUANDO CLAUDE SENTA NA SALA DO CHEFE) */}
      <ExecutiveClipboardModal
        isOpen={clipboardOpen}
        scenario={scenario}
        backendUrl={BACKEND_URL}
        onReleaseManager={handleReleaseManager}
      />
    </div>
  );
};
