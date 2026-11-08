import React from 'react';
import { X, Tv } from 'lucide-react';
import { LiveCandleWall } from './LiveCandleWall';

interface LiveCandleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveCandleModal: React.FC<LiveCandleModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-5xl bg-slate-900 border-2 border-emerald-500/50 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Tv className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-black uppercase tracking-wider text-white">
              Telão 3D da Parede — Candles 5m Ao Vivo (Binance WebSocket)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 bg-slate-950">
          <LiveCandleWall />
        </div>
      </div>
    </div>
  );
};

