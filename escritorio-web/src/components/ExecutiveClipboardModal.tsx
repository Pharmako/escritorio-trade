import React, { useState } from 'react';
import {
  ClipboardCheck,
  Send,
  UserCheck,
  ShieldAlert,
  TrendingUp,
  TrendingDown,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import { OfficeScenarioState } from '../types';

interface ExecutiveClipboardModalProps {
  isOpen: boolean;
  scenario: OfficeScenarioState;
  backendUrl: string;
  onReleaseManager: () => void;
}

export const ExecutiveClipboardModal: React.FC<ExecutiveClipboardModalProps> = ({
  isOpen,
  scenario,
  backendUrl,
  onReleaseManager,
}) => {
  const [sendingTelegram, setSendingTelegram] = useState(false);
  const [telegramFeedback, setTelegramFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendTelegram = async () => {
    setSendingTelegram(true);
    setTelegramFeedback(null);
    try {
      const res = await fetch(`${backendUrl}/api/telegram/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          report_text: scenario.executiveReport,
          mood_label: scenario.moodLabel,
          wallet_balance: scenario.walletBalance,
          daily_profit_usdt: scenario.dailyProfitUsdt,
          daily_profit_pct: scenario.dailyProfitPct,
        }),
      });
      if (!res.ok) throw new Error('Backend offline');
      const data = await res.json();
      if (data.sent) {
        setTelegramFeedback('✅ Relatório Executivo enviado com sucesso para o seu Telegram!');
      } else {
        setTelegramFeedback(
          '📲 Disparo validado pelo /gerente-ia (Configure TELEGRAM_BOT_TOKEN no .env para envio real).'
        );
      }
    } catch {
      setTelegramFeedback(
        '📲 [Modo Demonstração] Relatório formatado e pronto para envio via Bot do Telegram!'
      );
    } finally {
      setSendingTelegram(false);
    }
  };

  const moodBadgeClasses =
    scenario.mood === 'CONFIANTE'
      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
      : scenario.mood === 'RECEOSO'
      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
      : 'bg-rose-500/20 text-rose-300 border-rose-500/40';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn">
      {/* Moldura Estilo Prancheta Executiva */}
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-amber-600/60 rounded-2xl shadow-2xl overflow-hidden">
        {/* Clipe Metálico Superior da Prancheta */}
        <div className="bg-gradient-to-r from-amber-700/40 via-amber-500/30 to-amber-700/40 border-b border-amber-500/40 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-extrabold uppercase tracking-wider text-amber-200">
                Prancheta Executiva — Reunião na Sala do Chefe
              </h2>
              <p className="text-xs text-slate-300">
                Gerente de Risco sentado à sua frente reportando auditoria do Funcionário NFI X8
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${moodBadgeClasses}`}
          >
            {scenario.moodLabel}
          </span>
        </div>

        {/* Corpo da Prancheta */}
        <div className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          {/* 1. Cards de Saldo Simulado (Dry-Run) e Resultado do Dia */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3.5">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
                Saldo Simulado (Dry-Run)
              </span>
              <span className="text-xl font-black font-mono text-white mt-1 block">
                {scenario.walletBalance.toFixed(2)} USDT
              </span>
              <span className="text-[10px] text-slate-500">Banca Inicial: 1000.00 USDT</span>
            </div>

            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3.5">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
                Lucro / Prejuízo Hoje
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                {scenario.dailyProfitUsdt >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-rose-400" />
                )}
                <span
                  className={`text-lg font-black font-mono ${
                    scenario.dailyProfitUsdt >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {scenario.dailyProfitUsdt >= 0 ? '+' : ''}
                  {scenario.dailyProfitUsdt.toFixed(2)} USDT ({scenario.dailyProfitPct >= 0 ? '+' : ''}
                  {scenario.dailyProfitPct.toFixed(2)}%)
                </span>
              </div>
              <span className="text-[10px] text-slate-500">
                Sequência: {scenario.winStreak}W / {scenario.lossStreak}L
              </span>
            </div>

            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3.5">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
                Status de Risco / Lote
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                {scenario.freqtradeLocked ? (
                  <Lock className="w-4 h-4 text-rose-400" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
                <span className="text-sm font-bold text-slate-100">
                  Lote Permitido: {scenario.lotAllocationPct}%
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {scenario.freqtradeLocked
                  ? 'Bloqueado via /locks e /stopbuy'
                  : 'Operando Futuros Isolado'}
              </span>
            </div>
          </div>

          {/* 2. Parecer Sincero do Gerente de IA */}
          <div className="bg-slate-950 border border-amber-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              Parecer Executivo do Gerente de IA (SKILL.md)
            </div>
            <pre className="whitespace-pre-wrap font-sans text-sm text-slate-200 leading-relaxed">
              {scenario.executiveReport}
            </pre>
          </div>

          {/* 3. Histórico das Últimas Movimentações */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Histórico Recente de Operações (NostalgiaForInfinityX8)
            </h3>
            <div className="space-y-2">
              {scenario.recentTrades.map((t) => (
                <div
                  key={t.id}
                  className="flex flex-wrap items-center justify-between gap-2 bg-slate-950/80 border border-slate-800/90 rounded-lg px-3.5 py-2 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-200">{t.pair}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        t.side === 'LONG'
                          ? 'bg-emerald-500/15 text-emerald-300'
                          : 'bg-purple-500/15 text-purple-300'
                      }`}
                    >
                      {t.side}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      tag: <strong className="text-slate-300">{t.enterTag}</strong> → {t.exitReason}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`font-mono font-bold ${
                        t.profitPct >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {t.profitPct >= 0 ? '+' : ''}
                      {t.profitPct.toFixed(2)}% ({t.profitUsdt >= 0 ? '+' : ''}
                      {t.profitUsdt.toFixed(2)} USDT)
                    </span>
                    <span className="text-[11px] text-slate-500">{t.closedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {telegramFeedback && (
            <div className="p-3 rounded-lg bg-sky-500/15 border border-sky-500/40 text-xs text-sky-200 font-medium">
              {telegramFeedback}
            </div>
          )}
        </div>

        {/* Rodapé de Ações do Chefe */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleSendTelegram}
            disabled={sendingTelegram}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-sky-600/25 transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
            {sendingTelegram ? 'Enviando ao Telegram...' : 'Enviar Relatório no Telegram'}
          </button>

          <button
            onClick={onReleaseManager}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            Liberar Gerente (Voltar à Ronda)
          </button>
        </div>
      </div>
    </div>
  );
};

