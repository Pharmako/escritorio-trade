import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { OfficeScenarioState } from '../types';
import {
  BackGlassWallAndTicker,
  CityscapeBackground,
  LowPolyDog,
  PlantPot,
  WhiteOfficeDesk,
} from './OfficeProps3D';
import {
  BossVipRoom,
  ClaudeManager3D,
  ClaudeManagerRoom,
  CoffeeAndPingPongZone,
  EmployeeNfi3D,
} from './OfficeRooms3D';

interface OfficeScene3DProps {
  scenario: OfficeScenarioState;
  btcPrice: number;
  ethPrice: number;
  btcChange: number;
  ethChange: number;
  summonedToBoss: boolean;
  onSummonManager: () => void;
  onArrivedAtBossChair: () => void;
  onOpenCandleModal: () => void;
}

export const OfficeScene3D: React.FC<OfficeScene3DProps> = ({
  scenario,
  btcPrice,
  ethPrice,
  btcChange,
  ethChange,
  summonedToBoss,
  onSummonManager,
  onArrivedAtBossChair,
  onOpenCandleModal,
}) => {
  const managerSpeech = summonedToBoss
    ? 'Indo para a Sala VIP do Chefe apresentar a Prancheta Executiva!'
    : scenario.managerSpeechAtDesk;

  return (
    <div className="w-screen h-screen bg-slate-950 overflow-hidden">
      <Canvas shadows camera={{ position: [18, 18, 18], fov: 35 }}>
        {/* Cor de fundo do céu / crepúsculo urbano */}
        <color attach="background" args={['#0f172a']} />
        <fog attach="fog" args={['#0f172a', 34, 68]} />

        {/* Controles Orbitais Interativos (Girar, Zoom e Arrastar pelo Escritório 3D) */}
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          minDistance={9}
          maxDistance={44}
          maxPolarAngle={Math.PI / 2.1}
          target={[0, 0.8, 0]}
        />

        {/* Iluminação Realista com Sombras Suaves */}
        <ambientLight intensity={0.75} color="#f8fafc" />
        <hemisphereLight args={['#e0f2fe', '#1e293b', 0.65]} />
        <directionalLight
          castShadow
          position={[15, 24, 14]}
          intensity={1.55}
          color="#fffbeb"
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={1}
          shadow-camera-far={60}
          shadow-camera-left={-18}
          shadow-camera-right={18}
          shadow-camera-top={18}
          shadow-camera-bottom={-18}
          shadow-bias={-0.0005}
        />
        <pointLight position={[-6, 4.2, -5]} intensity={0.7} color="#fde68a" />
        <pointLight position={[6, 4.2, 4]} intensity={0.7} color="#bae6fd" />

        {/* ===================================================================
            1. VISTA DA CIDADE AO FUNDO + PAREDE DE VIDRO + TICKER LED + TELÃO 3D
           =================================================================== */}
        <CityscapeBackground />
        <BackGlassWallAndTicker
          btcPrice={btcPrice}
          ethPrice={ethPrice}
          btcChange={btcChange}
          ethChange={ethChange}
          onOpenCandleModal={onOpenCandleModal}
        />

        {/* ===================================================================
            2. BASE ARQUITETÔNICA DO ESCRITÓRIO (PISO PRINCIPAL BRANCO E AZUL)
           =================================================================== */}
        {/* Laje Estrutural do Escritório */}
        <mesh position={[0, -0.1, 0]} receiveShadow>
          <boxGeometry args={[22.4, 0.2, 18.0]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.5} />
        </mesh>

        {/* Faixas Azuis Modernas do Salão Principal de Operações */}
        <mesh position={[-3.8, 0.02, 2.8]} receiveShadow>
          <boxGeometry args={[14.2, 0.03, 11.2]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
        {/* Tapete / Corredor Azul Royal sob a Ilha de Operações */}
        <mesh position={[-3.8, 0.04, 2.5]} receiveShadow>
          <boxGeometry args={[11.8, 0.02, 8.2]} />
          <meshStandardMaterial color="#2563eb" roughness={0.7} />
        </mesh>
        <mesh position={[-3.8, 0.05, 2.5]} receiveShadow>
          <boxGeometry args={[10.8, 0.02, 7.2]} />
          <meshStandardMaterial color="#eff6ff" roughness={0.45} />
        </mesh>

        {/* Parede Baixa Lateral Esquerda */}
        <mesh position={[-11.1, 1.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 3.0, 18.0]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
        </mesh>

        {/* Etiqueta Flutuante 3D: "MESA DE OPERAÇÕES" */}
        <Html position={[-3.8, 2.75, -0.5]} center distanceFactor={16} zIndexRange={[10, 0]}>
          <div className="px-3.5 py-1 rounded-full bg-blue-600 text-white font-black text-xs tracking-wider uppercase shadow-xl border-2 border-blue-200 whitespace-nowrap">
            MESA DE OPERAÇÕES
          </div>
        </Html>

        {/* ===================================================================
            3. SALA "CLAUDE - GERENTE" (PISO DE MADEIRA - CANTO SUPERIOR ESQUERDO)
           =================================================================== */}
        <ClaudeManagerRoom />

        {/* ===================================================================
            4. COPA, BANCADA COM 4 BANQUETAS AMARELAS, CAFÉ E PING-PONG (SUPERIOR DIREITO)
           =================================================================== */}
        <CoffeeAndPingPongZone />

        {/* ===================================================================
            5. SALA VIP DO CHEFE (CANTO DIREITO)
           =================================================================== */}
        <BossVipRoom onSummonManager={onSummonManager} managerSeated={summonedToBoss} />

        {/* ===================================================================
            6. FILEIRAS DE MESAS BRANCAS DE OPERAÇÕES + CACHORRINHO LOW-POLY
           =================================================================== */}
        {/* Fileira 1: Mesa 1 (Ativa - Funcionário NFI X8) + Mesa 2 (Vaga: Supertrend) */}
        <WhiteOfficeDesk position={[-5.8, 0, -0.25]} isActiveDesk />
        <WhiteOfficeDesk position={[-1.6, 0, -0.25]} vacantLabel="Vaga: Supertrend" />

        {/* Cachorrinho Low-Poly deitado ao lado da Mesa 1 */}
        <LowPolyDog position={[-7.55, 0, 0.35]} />

        {/* Fileira 2: Mesa 3 (Vaga: Cluc) + Mesa 4 (Vaga: Multi MA) */}
        <WhiteOfficeDesk position={[-5.8, 0, 3.6]} vacantLabel="Vaga: Cluc" />
        <WhiteOfficeDesk position={[-1.6, 0, 3.6]} vacantLabel="Vaga: Multi MA" />

        {/* Plantas Decorativas no Salão Principal */}
        <PlantPot position={[-9.8, 0, 7.4]} scale={1.2} />
        <PlantPot position={[1.6, 0, 7.4]} scale={1.1} />

        {/* ===================================================================
            7. BONECOS 3D VIVOS COM MOVIMENTO FÍSICO (useFrame)
           =================================================================== */}
        {/* Funcionário NFI X8 (Sentado na Mesa 1 ou caminha até o Café/Ping-Pong quando Tiltado) */}
        <EmployeeNfi3D
          mood={scenario.mood}
          thought={scenario.employeeThought}
          lotAllocationPct={scenario.lotAllocationPct}
        />

        {/* Claude - Gerente (Sai da sala de madeira, fiscaliza Mesa 1 e senta na Sala VIP do Chefe) */}
        <ClaudeManager3D
          summonedToBoss={summonedToBoss}
          mood={scenario.mood}
          speechText={managerSpeech}
          onArrivedAtBossChair={onArrivedAtBossChair}
        />
      </Canvas>
    </div>
  );
};

