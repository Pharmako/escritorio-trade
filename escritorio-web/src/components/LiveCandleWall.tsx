import React, { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, Time } from 'lightweight-charts';
import { Activity, Wifi } from 'lucide-react';

interface SingleTickerWallProps {
  symbol: 'BTCUSDT' | 'ETHUSDT';
  label: string;
  accentColor: string;
}

const SingleCandleChart: React.FC<SingleTickerWallProps> = ({ symbol, label, accentColor }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  const [lastPrice, setLastPrice] = useState<number | null>(null);
  const [priceChangePct, setPriceChangePct] = useState<number>(0);
  const [wsConnected, setWsConnected] = useState<boolean>(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 145,
      layout: {
        background: { color: '#070b14' },
        textColor: '#94a3b8',
        fontSize: 10,
      },
      grid: {
        vertLines: { color: 'rgba(30, 41, 59, 0.45)' },
        horzLines: { color: 'rgba(30, 41, 59, 0.45)' },
      },
      rightPriceScale: {
        borderColor: 'rgba(51, 65, 85, 0.6)',
      },
      timeScale: {
        borderColor: 'rgba(51, 65, 85, 0.6)',
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: 0,
      },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderUpColor: '#10b981',
      borderDownColor: '#ef4444',
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });

    chartRef.current = chart;
    seriesRef.current = candleSeries;

    let isMounted = true;
    let ws: WebSocket | null = null;

    // 1. Busca histórico inicial de 5m da API pública da Binance
    const fetchInitialKlines = async () => {
      try {
        const res = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=5m&limit=60`
        );
        if (!res.ok) throw new Error('Falha REST Binance');
        const raw: any[] = await res.json();
        if (!isMounted) return;

        const formatted = raw.map((k) => ({
          time: Math.floor(Number(k[0]) / 1000) as Time,
          open: parseFloat(k[1]),
          high: parseFloat(k[2]),
          low: parseFloat(k[3]),
          close: parseFloat(k[4]),
        }));

        candleSeries.setData(formatted);
        chart.timeScale().fitContent();

        if (formatted.length > 1) {
          const firstOpen = formatted[0].open;
          const latestClose = formatted[formatted.length - 1].close;
          setLastPrice(latestClose);
          setPriceChangePct(((latestClose - firstOpen) / firstOpen) * 100);
        }
      } catch {
        // Fallback caso a rede bloqueie chamadas externas
        const basePrice = symbol === 'BTCUSDT' ? 88500 : 3120;
        const nowSec = Math.floor(Date.now() / 1000);
        const fallbackData = Array.from({ length: 45 }, (_, idx) => {
          const t = (nowSec - (45 - idx) * 300) as Time;
          const open = basePrice + Math.sin(idx * 0.4) * (basePrice * 0.004);
          const close = open + Math.cos(idx * 0.7) * (basePrice * 0.0025);
          const high = Math.max(open, close) + basePrice * 0.0012;
          const low = Math.min(open, close) - basePrice * 0.0012;
          return { time: t, open, high, low, close };
        });
        candleSeries.setData(fallbackData);
        setLastPrice(fallbackData[fallbackData.length - 1].close);
      }
    };

    fetchInitialKlines();

    // 2. Conecta no WebSocket Público da Binance (Candles de 5 minutos ao vivo)
    const streamName = `${symbol.toLowerCase()}@kline_5m`;
    try {
      ws = new WebSocket(`wss://stream.binance.com:9443/ws/${streamName}`);
      ws.onopen = () => {
        if (isMounted) setWsConnected(true);
      };
      ws.onmessage = (event) => {
        if (!isMounted || !seriesRef.current) return;
        try {
          const msg = JSON.parse(event.data);
          if (msg.k) {
            const k = msg.k;
            const candle = {
              time: Math.floor(Number(k.t) / 1000) as Time,
              open: parseFloat(k.o),
              high: parseFloat(k.h),
              low: parseFloat(k.l),
              close: parseFloat(k.c),
            };
            seriesRef.current.update(candle);
            setLastPrice(candle.close);
            const change = ((candle.close - candle.open) / candle.open) * 100;
            setPriceChangePct(change);
          }
        } catch {
          // ignore malformed frame
        }
      };
      ws.onclose = () => {
        if (isMounted) setWsConnected(false);
      };
    } catch {
      setWsConnected(false);
    }

    const handleResize = () => {
      if (containerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: containerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);
      if (ws) ws.close();
      chart.remove();
    };
  }, [symbol]);

  return (
    <div className="flex flex-col bg-slate-950/95 border border-slate-800 rounded-lg overflow-hidden shadow-inner">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${accentColor}`} />
          <span className="font-bold text-xs tracking-wider text-slate-200">{label}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
            5m LIVE
          </span>
        </div>

        <div className="flex items-center gap-2">
          {lastPrice !== null && (
            <span className="font-mono text-xs font-bold text-white">
              ${lastPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          )}
          <span
            className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-semibold ${
              priceChangePct >= 0
                ? 'bg-emerald-500/15 text-emerald-400'
                : 'bg-rose-500/15 text-rose-400'
            }`}
          >
            {priceChangePct >= 0 ? '+' : ''}
            {priceChangePct.toFixed(2)}%
          </span>
          <span
            title={wsConnected ? 'WebSocket Binance Conectado' : 'Modo Fallback'}
            className={`flex items-center gap-1 text-[10px] ${
              wsConnected ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            <Wifi className="w-3 h-3" />
          </span>
        </div>
      </div>

      <div ref={containerRef} className="w-full h-[145px]" />
    </div>
  );
};

export const LiveCandleWall: React.FC = () => {
  return (
    <div className="relative bg-slate-900/90 border-2 border-slate-700/80 rounded-xl p-2.5 shadow-2xl">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
            Telão da Parede do Fundo — Binance Futures 5m WebSocket Ao Vivo
          </span>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          Pares NFI X8: BTC/USDT:USDT &amp; ETH/USDT:USDT
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SingleCandleChart symbol="BTCUSDT" label="BTC / USDT" accentColor="bg-amber-400" />
        <SingleCandleChart symbol="ETHUSDT" label="ETH / USDT" accentColor="bg-sky-400" />
      </div>
    </div>
  );
};

