import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

/**
 * 1. VISTA DA CIDADE AO FUNDO (Prédios 3D Low-Poly Cinzas com Janelinhas Iluminadas + Árvores Verdes Arredondadas)
 */
export const CityscapeBackground: React.FC = () => {
  const buildings = useMemo(() => {
    const list: Array<{
      x: number;
      z: number;
      w: number;
      d: number;
      h: number;
      color: string;
      windows: Array<{ wx: number; wy: number; lit: boolean; warm: boolean }>;
    }> = [];

    const shades = ['#334155', '#475569', '#3b4252', '#2e3440', '#434c5e', '#374151'];
    for (let i = 0; i < 34; i++) {
      const row = i < 18 ? 0 : 1;
      const x = -28 + (i % 18) * 3.3 + (row * 1.4 - 0.5);
      const z = row === 0 ? -13.5 - (i % 3) * 1.2 : -19.5 - (i % 4) * 1.5;
      const w = 2.0 + ((i * 7) % 12) * 0.12;
      const d = 2.0 + ((i * 5) % 10) * 0.12;
      const h = 7 + ((i * 13) % 18);
      const color = shades[i % shades.length];

      const windows: Array<{ wx: number; wy: number; lit: boolean; warm: boolean }> = [];
      const cols = 3;
      const floors = Math.floor(h / 1.1);
      for (let f = 1; f < floors; f++) {
        for (let c = 0; c < cols; c++) {
          const seed = (i * 31 + f * 17 + c * 13) % 10;
          windows.push({
            wx: (c - 1) * (w * 0.26),
            wy: -h / 2 + f * 1.05,
            lit: seed > 3,
            warm: seed % 2 === 0,
          });
        }
      }

      list.push({ x, z, w, d, h, color, windows });
    }
    return list;
  }, []);

  const trees = useMemo(() => {
    const pos: Array<{ x: number; z: number; scale: number }> = [];
    for (let i = 0; i < 24; i++) {
      pos.push({
        x: -23 + i * 2.05,
        z: -10.8 - (i % 2) * 0.9,
        scale: 0.85 + (i % 4) * 0.14,
      });
    }
    return pos;
  }, []);

  return (
    <group>
      {/* Calçada / Avenida externa atrás da parede de vidro */}
      <mesh position={[0, -0.15, -15]} receiveShadow>
        <boxGeometry args={[64, 0.2, 16]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>

      {/* Árvores Verdes Arredondadas na Base dos Prédios */}
      {trees.map((t, idx) => (
        <group key={`tree-${idx}`} position={[t.x, 0, t.z]} scale={t.scale}>
          {/* Tronco */}
          <mesh position={[0, 0.45, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.14, 0.9, 7]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} />
          </mesh>
          {/* Copa arredondada low-poly */}
          <mesh position={[0, 1.15, 0]} castShadow>
            <dodecahedronGeometry args={[0.62, 1]} />
            <meshStandardMaterial color="#22c55e" roughness={0.65} flatShading />
          </mesh>
          <mesh position={[0.25, 1.45, 0.15]} castShadow>
            <dodecahedronGeometry args={[0.42, 1]} />
            <meshStandardMaterial color="#4ade80" roughness={0.65} flatShading />
          </mesh>
        </group>
      ))}

      {/* Dezenas de Prédios 3D Low-Poly Cinzas com Janelinhas Iluminadas */}
      {buildings.map((b, idx) => (
        <group key={`bldg-${idx}`} position={[b.x, b.h / 2 - 2.2, b.z]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial color={b.color} roughness={0.75} flatShading />
          </mesh>

          {/* Janelinhas iluminadas na fachada frontal */}
          {b.windows.map((w, wIdx) =>
            w.lit ? (
              <mesh key={wIdx} position={[w.wx, w.wy, b.d / 2 + 0.02]}>
                <planeGeometry args={[b.w * 0.18, 0.45]} />
                <meshBasicMaterial color={w.warm ? '#fef08a' : '#bae6fd'} />
              </mesh>
            ) : null
          )}
        </group>
      ))}
    </group>
  );
};

/**
 * 2. PAREDE DE VIDRO DE PONTA A PONTA + PAINEL LUMINOSO LED + TELÃO 3D DE CANDLES
 */
interface BackGlassWallProps {
  btcPrice: number;
  ethPrice: number;
  btcChange: number;
  ethChange: number;
  onOpenCandleModal: () => void;
}

export const BackGlassWallAndTicker: React.FC<BackGlassWallProps> = ({
  btcPrice,
  ethPrice,
  btcChange,
  ethChange,
  onOpenCandleModal,
}) => {
  const mullions = [-11, -8.25, -5.5, -2.75, 0, 2.75, 5.5, 8.25, 11];

  return (
    <group position={[0, 0, -9]}>
      {/* Vidro Panorâmico de Ponta a Ponta */}
      <mesh position={[0, 2.4, 0]}>
        <boxGeometry args={[22.2, 4.8, 0.08]} />
        <meshPhysicalMaterial
          color="#bae6fd"
          transparent
          opacity={0.22}
          roughness={0.1}
          transmission={0.6}
        />
      </mesh>

      {/* Viga Superior e Inferior Preta */}
      <mesh position={[0, 4.8, 0]} castShadow>
        <boxGeometry args={[22.4, 0.18, 0.2]} />
        <meshStandardMaterial color="#0f172a" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.08, 0]} castShadow>
        <boxGeometry args={[22.4, 0.16, 0.2]} />
        <meshStandardMaterial color="#0f172a" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Colunas Verticais Pretas da Fachada de Vidro */}
      {mullions.map((x, idx) => (
        <mesh key={idx} position={[x, 2.4, 0]} castShadow>
          <boxGeometry args={[0.12, 4.8, 0.16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}

      {/* PAINEL LUMINOSO LED (TICKER 3D) ACIMA DAS SALAS DE FUNDO */}
      <group position={[0, 4.45, 0.22]}>
        <mesh castShadow>
          <boxGeometry args={[12.5, 0.65, 0.25]} />
          <meshStandardMaterial color="#020617" roughness={0.2} metalness={0.8} />
        </mesh>

        <Html position={[0, 0, 0.15]} transform distanceFactor={11} zIndexRange={[10, 0]}>
          <div
            onClick={onOpenCandleModal}
            className="cursor-pointer select-none bg-slate-950/95 border border-emerald-500/60 px-5 py-1.5 rounded-md shadow-lg flex items-center gap-6 whitespace-nowrap"
          >
            <span className="text-[11px] font-black tracking-widest text-amber-400 uppercase">
              BINANCE FUTURES LIVE
            </span>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-slate-300 font-bold">BTC/USDT:</span>
              <span className="text-white font-extrabold">
                ${btcPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={btcChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                ({btcChange >= 0 ? '+' : ''}
                {btcChange.toFixed(2)}%)
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-slate-300 font-bold">ETH/USDT:</span>
              <span className="text-white font-extrabold">
                ${ethPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={ethChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                ({ethChange >= 0 ? '+' : ''}
                {ethChange.toFixed(2)}%)
              </span>
            </div>
          </div>
        </Html>
      </group>

      {/* TELÃO 3D INTERATIVO DE CANDLES NA PAREDE DO FUNDO */}
      <group
        position={[-0.2, 2.75, 0.2]}
        onClick={(e) => {
          e.stopPropagation();
          onOpenCandleModal();
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
        }}
      >
        {/* Moldura 3D do Telão */}
        <mesh castShadow>
          <boxGeometry args={[5.4, 2.35, 0.16]} />
          <meshStandardMaterial color="#090d16" metalness={0.7} roughness={0.25} />
        </mesh>

        {/* Tela escura brilhante */}
        <mesh position={[0, 0, 0.09]}>
          <planeGeometry args={[5.15, 2.1]} />
          <meshBasicMaterial color="#060b14" />
        </mesh>

        {/* Barras de Candles 3D em Alto Relevo no Telão */}
        {[
          { x: -2.1, y: -0.3, h: 0.45, up: true },
          { x: -1.75, y: -0.1, h: 0.35, up: true },
          { x: -1.4, y: -0.2, h: 0.3, up: false },
          { x: -1.05, y: 0.0, h: 0.55, up: true },
          { x: -0.7, y: 0.15, h: 0.4, up: false },
          { x: -0.35, y: 0.1, h: 0.5, up: true },
          { x: 0.0, y: 0.3, h: 0.6, up: true },
          { x: 0.35, y: 0.2, h: 0.32, up: false },
          { x: 0.7, y: 0.35, h: 0.52, up: true },
          { x: 1.05, y: 0.5, h: 0.45, up: true },
          { x: 1.4, y: 0.42, h: 0.28, up: false },
          { x: 1.75, y: 0.62, h: 0.55, up: true },
          { x: 2.1, y: 0.72, h: 0.48, up: true },
        ].map((c, idx) => (
          <group key={idx} position={[c.x, c.y, 0.11]}>
            {/* Pavio */}
            <mesh>
              <boxGeometry args={[0.03, c.h + 0.3, 0.01]} />
              <meshBasicMaterial color={c.up ? '#10b981' : '#ef4444'} />
            </mesh>
            {/* Corpo da vela */}
            <mesh>
              <boxGeometry args={[0.18, c.h, 0.03]} />
              <meshBasicMaterial color={c.up ? '#10b981' : '#ef4444'} />
            </mesh>
          </group>
        ))}

        {/* Botão Flutuante no Telão convidando ao clique */}
        <Html position={[0, -0.78, 0.14]} center distanceFactor={14} zIndexRange={[10, 0]}>
          <button
            onClick={onOpenCandleModal}
            className="px-3 py-1 rounded-full bg-emerald-500/90 hover:bg-emerald-400 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-lg cursor-pointer whitespace-nowrap"
          >
            📈 Clique no Telão p/ Abrir Candles 5m Ao Vivo
          </button>
        </Html>
      </group>
    </group>
  );
};

/**
 * PLANTA DECORATIVA LOW-POLY
 */
export const PlantPot: React.FC<{ position: [number, number, number]; scale?: number }> = ({
  position,
  scale = 1,
}) => (
  <group position={position} scale={scale}>
    <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.24, 0.18, 0.5, 10]} />
      <meshStandardMaterial color="#f8fafc" roughness={0.6} />
    </mesh>
    <mesh position={[0, 0.72, 0]} castShadow>
      <dodecahedronGeometry args={[0.38, 1]} />
      <meshStandardMaterial color="#16a34a" roughness={0.6} flatShading />
    </mesh>
    <mesh position={[0.14, 0.98, 0.1]} castShadow>
      <dodecahedronGeometry args={[0.26, 1]} />
      <meshStandardMaterial color="#22c55e" roughness={0.6} flatShading />
    </mesh>
  </group>
);

/**
 * CACHORRINHO LOW-POLY DEITADO AO LADO DA MESA 1
 */
export const LowPolyDog: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const tailRef = useRef<THREE.Mesh | null>(null);

  useFrame(({ clock }) => {
    if (tailRef.current) {
      tailRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 7) * 0.35;
    }
  });

  return (
    <group position={position} rotation={[0, 0.5, 0]}>
      {/* Tapetinho do cachorro */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <cylinderGeometry args={[0.55, 0.55, 0.04, 16]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.9} />
      </mesh>
      {/* Corpo deitado */}
      <mesh position={[0, 0.18, 0]} castShadow>
        <boxGeometry args={[0.52, 0.24, 0.32]} />
        <meshStandardMaterial color="#d97706" roughness={0.7} flatShading />
      </mesh>
      {/* Cabeça */}
      <mesh position={[0.28, 0.32, 0]} castShadow>
        <boxGeometry args={[0.24, 0.22, 0.24]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.7} flatShading />
      </mesh>
      {/* Focinho */}
      <mesh position={[0.42, 0.28, 0]} castShadow>
        <boxGeometry args={[0.12, 0.1, 0.12]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.7} />
      </mesh>
      {/* Orelhas */}
      <mesh position={[0.24, 0.45, 0.1]} castShadow>
        <boxGeometry args={[0.08, 0.12, 0.06]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      <mesh position={[0.24, 0.45, -0.1]} castShadow>
        <boxGeometry args={[0.08, 0.12, 0.06]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      {/* Rabinho abanando */}
      <mesh ref={tailRef} position={[-0.28, 0.26, 0]} castShadow>
        <boxGeometry args={[0.16, 0.07, 0.07]} />
        <meshStandardMaterial color="#b45309" />
      </mesh>
    </group>
  );
};

/**
 * MESA DE ESCRITÓRIO BRANCA 3D COM MONITORES PRETOS E CADEIRA GIRATÓRIA COM RODINHAS
 */
interface WhiteOfficeDeskProps {
  position: [number, number, number];
  vacantLabel?: string;
  isActiveDesk?: boolean;
}

export const WhiteOfficeDesk: React.FC<WhiteOfficeDeskProps> = ({
  position,
  vacantLabel,
  isActiveDesk = false,
}) => {
  return (
    <group position={position}>
      {/* Tampo branco da mesa */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.08, 1.15]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.35} />
      </mesh>

      {/* Pés metálicos da mesa */}
      {[
        [-0.98, 0.37, -0.48],
        [0.98, 0.37, -0.48],
        [-0.98, 0.37, 0.48],
        [0.98, 0.37, 0.48],
      ].map((leg, idx) => (
        <mesh key={idx} position={leg as [number, number, number]} castShadow>
          <boxGeometry args={[0.07, 0.74, 0.07]} />
          <meshStandardMaterial color="#64748b" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}

      {/* Dois Monitores Pretos Widescreen */}
      {[-0.46, 0.46].map((mx, idx) => (
        <group key={idx} position={[mx, 1.12, -0.25]} rotation={[0, idx === 0 ? 0.15 : -0.15, 0]}>
          {/* Base e Haste */}
          <mesh position={[0, -0.25, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.22, 8]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          {/* Tela Preta */}
          <mesh castShadow>
            <boxGeometry args={[0.82, 0.48, 0.05]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} />
          </mesh>
          {/* Brilho do monitor (verde/azul na Mesa 1 ativa, standby nas vagas) */}
          <mesh position={[0, 0, 0.03]}>
            <planeGeometry args={[0.76, 0.42]} />
            <meshBasicMaterial color={isActiveDesk ? '#064e3b' : '#1e293b'} />
          </mesh>
        </group>
      ))}

      {/* Teclado e Mouse */}
      <mesh position={[0, 0.8, 0.18]} castShadow>
        <boxGeometry args={[0.48, 0.02, 0.16]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0.36, 0.8, 0.18]} castShadow>
        <boxGeometry args={[0.09, 0.02, 0.13]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Cadeira Giratória Cinza com Rodinhas */}
      <group position={[0, 0, 0.82]}>
        {/* Assento */}
        <mesh position={[0, 0.48, 0]} castShadow>
          <boxGeometry args={[0.56, 0.08, 0.54]} />
          <meshStandardMaterial color="#64748b" roughness={0.6} />
        </mesh>
        {/* Encosto */}
        <mesh position={[0, 0.84, 0.24]} castShadow>
          <boxGeometry args={[0.52, 0.64, 0.08]} />
          <meshStandardMaterial color="#475569" roughness={0.6} />
        </mesh>
        {/* Pistão central */}
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.42, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} />
        </mesh>
        {/* Estrela da base e rodinhas */}
        {[0, 1, 2, 3, 4].map((r) => {
          const angle = (r * Math.PI * 2) / 5;
          return (
            <mesh
              key={r}
              position={[Math.cos(angle) * 0.24, 0.05, Math.sin(angle) * 0.24]}
              castShadow
            >
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
          );
        })}
      </group>

      {/* Placa Flutuante para Mesas Vazias ("Vaga: Supertrend", "Vaga: Cluc", "Vaga: Multi MA") */}
      {vacantLabel && (
        <Html position={[0, 1.85, 0]} center distanceFactor={15} zIndexRange={[10, 0]}>
          <div className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-600/80 text-[10px] font-bold text-slate-300 shadow-md whitespace-nowrap">
            🔒 {vacantLabel}
          </div>
        </Html>
      )}
    </group>
  );
};

