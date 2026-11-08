import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { MoodType } from '../types';
import { PlantPot } from './OfficeProps3D';

/**
 * SALA "CLAUDE - GERENTE" (Piso de Madeira - Canto Superior Esquerdo)
 */
export const ClaudeManagerRoom: React.FC = () => {
  return (
    <group position={[-7.2, 0, -5.8]}>
      {/* Piso de Madeira */}
      <mesh position={[0, 0.03, 0]} receiveShadow>
        <boxGeometry args={[7.4, 0.06, 6.2]} />
        <meshStandardMaterial color="#854d0e" roughness={0.65} />
      </mesh>

      {/* Divisória de Vidro Frontal (com porta de saída à direita) e Moldura Preta */}
      <mesh position={[-1.2, 1.5, 3.1]}>
        <boxGeometry args={[5.0, 3.0, 0.08]} />
        <meshPhysicalMaterial color="#bae6fd" transparent opacity={0.28} roughness={0.1} />
      </mesh>
      <mesh position={[-1.2, 3.0, 3.1]} castShadow>
        <boxGeometry args={[5.1, 0.12, 0.14]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[-3.68, 1.5, 3.1]} castShadow>
        <boxGeometry args={[0.12, 3.0, 0.14]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[1.3, 1.5, 3.1]} castShadow>
        <boxGeometry args={[0.12, 3.0, 0.14]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* Divisória de Vidro Lateral Direita com Moldura Preta */}
      <mesh position={[3.7, 1.5, 0]}>
        <boxGeometry args={[0.08, 3.0, 6.2]} />
        <meshPhysicalMaterial color="#bae6fd" transparent opacity={0.28} roughness={0.1} />
      </mesh>
      <mesh position={[3.7, 3.0, 0]} castShadow>
        <boxGeometry args={[0.14, 0.12, 6.2]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* Mesa Executiva de Madeira Escura do Gerente Claude */}
      <group position={[-0.6, 0, -0.6]}>
        <mesh position={[0, 0.76, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.3, 0.1, 1.15]} />
          <meshStandardMaterial color="#451a03" roughness={0.45} />
        </mesh>
        <mesh position={[-0.95, 0.38, 0]} castShadow>
          <boxGeometry args={[0.14, 0.74, 1.05]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0.95, 0.38, 0]} castShadow>
          <boxGeometry args={[0.14, 0.74, 1.05]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Notebook / Monitor na mesa do Claude */}
        <mesh position={[0, 1.05, -0.15]} castShadow>
          <boxGeometry args={[0.75, 0.46, 0.05]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* Cadeira Executiva do Claude */}
        <mesh position={[0, 0.5, -0.82]} castShadow>
          <boxGeometry args={[0.6, 0.1, 0.55]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0, 0.92, -1.06]} castShadow>
          <boxGeometry args={[0.58, 0.75, 0.1]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>

      <PlantPot position={[-2.9, 0, -2.2]} />

      {/* Etiqueta Flutuante 3D: "CLAUDE - GERENTE" */}
      <Html position={[0, 3.45, 0.5]} center distanceFactor={16} zIndexRange={[10, 0]}>
        <div className="px-3.5 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs tracking-wider uppercase shadow-xl border-2 border-amber-200 whitespace-nowrap">
          CLAUDE - GERENTE
        </div>
      </Html>
    </group>
  );
};

/**
 * COPA, BANCADA COM 4 BANQUETAS ALTAS AMARELAS, MÁQUINA DE CAFÉ EXPRESSO E MESA DE PING-PONG AZUL (Canto Superior Direito)
 */
export const CoffeeAndPingPongZone: React.FC = () => {
  return (
    <group position={[6.8, 0, -5.2]}>
      {/* Piso Claro da Área de Descanso */}
      <mesh position={[0, 0.03, 0]} receiveShadow>
        <boxGeometry args={[8.2, 0.06, 7.4]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.55} />
      </mesh>

      {/* Bancada de Madeira da Copa */}
      <group position={[-1.4, 0, -1.2]}>
        <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.4, 1.1, 0.85]} />
          <meshStandardMaterial color="#92400e" roughness={0.6} />
        </mesh>
        {/* Tampo superior de madeira clara */}
        <mesh position={[0, 1.12, 0.05]} castShadow receiveShadow>
          <boxGeometry args={[3.55, 0.08, 1.0]} />
          <meshStandardMaterial color="#d97706" roughness={0.45} />
        </mesh>

        {/* Máquina de Café Expresso Profissional */}
        <group position={[-0.95, 1.42, -0.05]}>
          <mesh castShadow>
            <boxGeometry args={[0.62, 0.54, 0.46]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.05, 0.24]}>
            <boxGeometry args={[0.45, 0.22, 0.04]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
          {/* Xícaras brancas */}
          <mesh position={[0.45, -0.18, 0.05]} castShadow>
            <cylinderGeometry args={[0.07, 0.06, 0.14, 10]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* 4 Banquetas Altas Amarelas */}
        {[-1.2, -0.4, 0.4, 1.2].map((bx, idx) => (
          <group key={idx} position={[bx, 0, 0.85]}>
            {/* Haste preta */}
            <mesh position={[0, 0.42, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.06, 0.84, 10]} />
              <meshStandardMaterial color="#0f172a" metalness={0.6} />
            </mesh>
            {/* Base redonda */}
            <mesh position={[0, 0.03, 0]} receiveShadow>
              <cylinderGeometry args={[0.24, 0.24, 0.05, 12]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
            {/* Assento Amarelo Vibrante */}
            <mesh position={[0, 0.86, 0]} castShadow>
              <cylinderGeometry args={[0.25, 0.23, 0.09, 14]} />
              <meshStandardMaterial color="#facc15" roughness={0.4} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Mesa de Ping-Pong Azul no Canto Direito */}
      <group position={[1.95, 0, 0.85]}>
        {/* Tampo Azul Oficial */}
        <mesh position={[0, 0.76, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.1, 0.08, 3.1]} />
          <meshStandardMaterial color="#1d4ed8" roughness={0.4} />
        </mesh>
        {/* Linhas Brancas Central e Bordas */}
        <mesh position={[0, 0.805, 0]}>
          <boxGeometry args={[0.03, 0.01, 3.06]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Rede Branca no Meio */}
        <mesh position={[0, 0.9, 0]} castShadow>
          <boxGeometry args={[2.2, 0.2, 0.03]} />
          <meshStandardMaterial color="#f8fafc" transparent opacity={0.85} />
        </mesh>
        {/* Pés da mesa de ping-pong */}
        {[
          [-0.85, 0.38, -1.25],
          [0.85, 0.38, -1.25],
          [-0.85, 0.38, 1.25],
          [0.85, 0.38, 1.25],
        ].map((leg, i) => (
          <mesh key={i} position={leg as [number, number, number]} castShadow>
            <boxGeometry args={[0.08, 0.75, 0.08]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        ))}
        {/* Duas raquetes e bolinha sobre a mesa */}
        <mesh position={[-0.45, 0.82, 0.95]} castShadow>
          <cylinderGeometry args={[0.14, 0.14, 0.03, 12]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        <mesh position={[0.45, 0.82, -0.95]} castShadow>
          <cylinderGeometry args={[0.14, 0.14, 0.03, 12]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0.1, 0.84, 0.3]} castShadow>
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Plantas Decorativas */}
      <PlantPot position={[3.3, 0, -2.9]} scale={1.15} />
      <PlantPot position={[-3.5, 0, -2.9]} scale={1.0} />
    </group>
  );
};

/**
 * SALA VIP DO CHEFE (Canto Direito / Inferior Direito)
 * Divisória de vidro, boneco 3D do Chefe sentado na cadeira presidencial e cadeira 3D vazia de frente para a mesa.
 */
interface BossVipRoomProps {
  onSummonManager: () => void;
  managerSeated: boolean;
}

export const BossVipRoom: React.FC<BossVipRoomProps> = ({ onSummonManager, managerSeated }) => {
  return (
    <group position={[6.8, 0, 4.0]}>
      {/* Piso & Tapete VIP Azul Marinho / Dourado */}
      <mesh position={[0, 0.03, 0]} receiveShadow>
        <boxGeometry args={[8.2, 0.06, 9.0]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>
      <mesh position={[0.4, 0.07, 0.2]} receiveShadow>
        <boxGeometry args={[5.4, 0.02, 5.8]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.85} />
      </mesh>

      {/* Divisória de Vidro Lateral Esquerda (com Porta Aberta no centro) */}
      <mesh position={[-4.1, 1.5, -2.6]}>
        <boxGeometry args={[0.08, 3.0, 3.6]} />
        <meshPhysicalMaterial color="#bae6fd" transparent opacity={0.28} roughness={0.1} />
      </mesh>
      <mesh position={[-4.1, 1.5, 2.6]}>
        <boxGeometry args={[0.08, 3.0, 3.6]} />
        <meshPhysicalMaterial color="#bae6fd" transparent opacity={0.28} roughness={0.1} />
      </mesh>
      <mesh position={[-4.1, 3.0, 0]} castShadow>
        <boxGeometry args={[0.14, 0.12, 9.0]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* Divisória de Vidro Superior separando da Copa */}
      <mesh position={[0, 1.5, -4.5]}>
        <boxGeometry args={[8.2, 3.0, 0.08]} />
        <meshPhysicalMaterial color="#bae6fd" transparent opacity={0.28} roughness={0.1} />
      </mesh>
      <mesh position={[0, 3.0, -4.5]} castShadow>
        <boxGeometry args={[8.2, 0.12, 0.14]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* Mesa Presidencial do Chefe */}
      <group position={[1.1, 0, 0]}>
        <mesh position={[0, 0.78, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.25, 0.1, 2.6]} />
          <meshStandardMaterial color="#451a03" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.39, -1.1]} castShadow>
          <boxGeometry args={[1.15, 0.76, 0.15]} />
          <meshStandardMaterial color="#27272a" />
        </mesh>
        <mesh position={[0, 0.39, 1.1]} castShadow>
          <boxGeometry args={[1.15, 0.76, 0.15]} />
          <meshStandardMaterial color="#27272a" />
        </mesh>

        {/* Monitor Ultrawide Dourado/Preto do Chefe */}
        <mesh position={[0.15, 1.1, 0]} rotation={[0, -Math.PI / 2, 0]} castShadow>
          <boxGeometry args={[1.1, 0.48, 0.05]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      </group>

      {/* Cadeira Presidencial + Boneco 3D do Chefe Sentado */}
      <group position={[2.25, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Cadeira Presidencial */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.7, 0.1, 0.65]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0, 1.05, -0.28]} castShadow>
          <boxGeometry args={[0.68, 1.0, 0.12]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>

        {/* Boneco 3D do Chefe (Terno Azul Escuro + Coroa/Crachá VIP) */}
        <mesh position={[0, 0.9, 0.05]} castShadow>
          <boxGeometry args={[0.48, 0.62, 0.3]} />
          <meshStandardMaterial color="#1d4ed8" roughness={0.5} />
        </mesh>
        <mesh position={[0, 1.42, 0.05]} castShadow>
          <boxGeometry args={[0.36, 0.36, 0.36]} />
          <meshStandardMaterial color="#fde68a" roughness={0.5} />
        </mesh>
        {/* Cabelo do Chefe */}
        <mesh position={[0, 1.63, 0.03]} castShadow>
          <boxGeometry args={[0.38, 0.1, 0.38]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>

      {/* CADEIRA 3D VAZIA POSICIONADA DE FRENTE PARA A MESA DO CHEFE */}
      <group
        position={[-0.25, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSummonManager();
        }}
      >
        <mesh position={[0, 0.48, 0]} castShadow>
          <boxGeometry args={[0.62, 0.09, 0.58]} />
          <meshStandardMaterial color={managerSeated ? '#f59e0b' : '#475569'} />
        </mesh>
        <mesh position={[0, 0.88, -0.25]} castShadow>
          <boxGeometry args={[0.58, 0.7, 0.09]} />
          <meshStandardMaterial color={managerSeated ? '#d97706' : '#334155'} />
        </mesh>
        <mesh position={[0, 0.24, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.44, 8]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      </group>

      <PlantPot position={[3.2, 0, -3.5]} scale={1.15} />
      <PlantPot position={[3.2, 0, 3.5]} scale={1.15} />

      {/* Etiqueta Flutuante 3D: "SALA VIP DO CHEFE" */}
      <Html position={[1.1, 2.8, 0]} center distanceFactor={16} zIndexRange={[10, 0]}>
        <div
          onClick={onSummonManager}
          className="cursor-pointer px-3 py-1 rounded-full bg-indigo-600/95 hover:bg-indigo-500 text-white font-black text-xs tracking-wider uppercase shadow-xl border border-amber-300 whitespace-nowrap"
        >
          👑 SALA VIP DO CHEFE {managerSeated ? '(Em Reunião)' : '(Clique p/ Chamar Gerente)'}
        </div>
      </Html>
    </group>
  );
};

/**
 * BONECO 3D DO "FUNCIONÁRIO NFI X8"
 * Sentado digitando na Mesa 1 quando Confiante/Receoso; quando TILTADO, levanta da cadeira
 * e caminha pelo chão até a bancada de café / mesa de ping-pong!
 */
interface EmployeeNfi3DProps {
  mood: MoodType;
  thought: string;
  lotAllocationPct: number;
}

export const EmployeeNfi3D: React.FC<EmployeeNfi3DProps> = ({
  mood,
  thought,
  lotAllocationPct,
}) => {
  const groupRef = useRef<THREE.Group | null>(null);
  const leftArmRef = useRef<THREE.Mesh | null>(null);
  const rightArmRef = useRef<THREE.Mesh | null>(null);
  const leftLegRef = useRef<THREE.Mesh | null>(null);
  const rightLegRef = useRef<THREE.Mesh | null>(null);

  // Posição na Mesa 1 vs Posição na Bancada de Café / Ping-Pong quando TILTADO
  const deskPos = new THREE.Vector3(-5.8, 0, 0.55);
  const coffeePos = new THREE.Vector3(5.4, 0, -4.05);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const target = mood === 'TILTADO' ? coffeePos : deskPos;
    const pos = groupRef.current.position;
    const dist = pos.distanceTo(target);

    if (dist > 0.08) {
      // Caminhando pelo chão!
      const dir = target.clone().sub(pos).normalize();
      pos.addScaledVector(dir, Math.min(dist, delta * 3.8));
      const targetAngle = Math.atan2(dir.x, dir.z);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetAngle,
        0.15
      );

      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = Math.sin(t * 10) * 0.5;
        rightLegRef.current.rotation.x = -Math.sin(t * 10) * 0.5;
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = -Math.sin(t * 10) * 0.4;
        rightArmRef.current.rotation.x = Math.sin(t * 10) * 0.4;
      }
    } else {
      // Chegou ao destino: sentado digitando na Mesa 1 (virado para -Z) ou em pé no café
      const finalAngle = mood === 'TILTADO' ? Math.PI : Math.PI;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        finalAngle,
        0.15
      );
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = mood === 'TILTADO' ? 0 : -Math.PI / 3;
        rightLegRef.current.rotation.x = mood === 'TILTADO' ? 0 : -Math.PI / 3;
      }
      if (leftArmRef.current && rightArmRef.current) {
        if (mood === 'TILTADO') {
          // Segurando caneca de café cabisbaixo
          leftArmRef.current.rotation.x = -0.5;
          rightArmRef.current.rotation.x = -0.8;
        } else {
          // Digitando rápido nos monitores!
          leftArmRef.current.rotation.x = -0.9 + Math.sin(t * 16) * 0.12;
          rightArmRef.current.rotation.x = -0.9 + Math.cos(t * 16) * 0.12;
        }
      }
    }
  });

  const shirtColor =
    mood === 'CONFIANTE' ? '#10b981' : mood === 'RECEOSO' ? '#f59e0b' : '#ef4444';

  const moodBarColor =
    mood === 'CONFIANTE'
      ? 'bg-emerald-400'
      : mood === 'RECEOSO'
      ? 'bg-amber-400'
      : 'bg-rose-500';

  const moodBarWidth =
    mood === 'CONFIANTE' ? 'w-full' : mood === 'RECEOSO' ? 'w-2/3' : 'w-1/4';

  return (
    <group ref={groupRef} position={[-5.8, 0, 0.55]} rotation={[0, Math.PI, 0]}>
      {/* Pernas */}
      <mesh ref={leftLegRef} position={[-0.11, 0.3, 0]} castShadow>
        <boxGeometry args={[0.14, 0.45, 0.16]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh ref={rightLegRef} position={[0.11, 0.3, 0]} castShadow>
        <boxGeometry args={[0.14, 0.45, 0.16]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Tronco */}
      <mesh position={[0, 0.78, 0]} castShadow>
        <boxGeometry args={[0.42, 0.55, 0.26]} />
        <meshStandardMaterial color={shirtColor} roughness={0.5} />
      </mesh>

      {/* Braços */}
      <mesh ref={leftArmRef} position={[-0.28, 0.78, 0]} castShadow>
        <boxGeometry args={[0.12, 0.46, 0.14]} />
        <meshStandardMaterial color={shirtColor} />
      </mesh>
      <mesh ref={rightArmRef} position={[0.28, 0.78, 0]} castShadow>
        <boxGeometry args={[0.12, 0.46, 0.14]} />
        <meshStandardMaterial color={shirtColor} />
      </mesh>

      {/* Cabeça Low-Poly */}
      <mesh position={[0, 1.26, 0]} castShadow>
        <boxGeometry args={[0.34, 0.34, 0.34]} />
        <meshStandardMaterial color="#fed7aa" roughness={0.5} />
      </mesh>
      {/* Headset Gamer de Trader */}
      <mesh position={[0, 1.45, 0]} castShadow>
        <boxGeometry args={[0.38, 0.08, 0.36]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* Etiqueta Flutuante 3D com Nome, Pensamento e Barra de Humor */}
      <Html position={[0, 2.15, 0]} center distanceFactor={15} zIndexRange={[10, 0]}>
        <div className="w-52 bg-slate-950/95 border border-slate-700 rounded-xl p-2 shadow-2xl text-left select-none pointer-events-none">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-black text-white">🤖 Funcionário NFI X8</span>
            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-slate-800 text-slate-200">
              {mood} ({lotAllocationPct}%)
            </span>
          </div>
          {/* Barra de Humor */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-1">
            <div className={`h-full ${moodBarColor} ${moodBarWidth} transition-all duration-500`} />
          </div>
          <p className="text-[10px] text-slate-300 leading-tight truncate" title={thought}>
            {thought}
          </p>
        </div>
      </Html>
    </group>
  );
};

/**
 * BONECO 3D DO "CLAUDE - GERENTE" COM MOVIMENTAÇÃO FÍSICA REAL (useFrame)
 * Sai da sala de madeira dele, caminha até a Mesa 1 do Funcionário NFI X8 para fiscalizar
 * e, quando chamado, caminha pelo escritório até a Sala VIP do Chefe e senta na cadeira vazia!
 */
interface ClaudeManager3DProps {
  summonedToBoss: boolean;
  mood: MoodType;
  speechText: string;
  onArrivedAtBossChair: () => void;
}

export const ClaudeManager3D: React.FC<ClaudeManager3DProps> = ({
  summonedToBoss,
  mood,
  speechText,
  onArrivedAtBossChair,
}) => {
  const groupRef = useRef<THREE.Group | null>(null);
  const leftLegRef = useRef<THREE.Mesh | null>(null);
  const rightLegRef = useRef<THREE.Mesh | null>(null);
  const leftArmRef = useRef<THREE.Mesh | null>(null);
  const rightArmRef = useRef<THREE.Mesh | null>(null);

  const [patrolIndex, setPatrolIndex] = useState<number>(0);
  const notifiedBossRef = useRef<boolean>(false);

  // Waypoints da ronda do Claude:
  // 0: Sala de Madeira "CLAUDE - GERENTE"
  // 1: Em frente ao Telão 3D
  // 2: Ao lado da Mesa 1 fiscalizando o Funcionário NFI X8 (ou na Copa se o X8 estiver Tiltado)
  const waypoints = [
    new THREE.Vector3(-5.8, 0, -4.5),
    new THREE.Vector3(-0.2, 0, -6.2),
    mood === 'TILTADO' ? new THREE.Vector3(3.8, 0, -3.8) : new THREE.Vector3(-4.1, 0, 0.6),
  ];

  // Cadeira Vazia na Sala VIP do Chefe
  const bossVisitorChairPos = new THREE.Vector3(6.55, 0, 4.0);

  // Alterna waypoint a cada 6.5s quando não está na sala do Chefe
  React.useEffect(() => {
    if (summonedToBoss) {
      notifiedBossRef.current = false;
      return;
    }
    const timer = setInterval(() => {
      setPatrolIndex((prev) => (prev + 1) % 3);
    }, 6500);
    return () => clearInterval(timer);
  }, [summonedToBoss]);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const target = summonedToBoss ? bossVisitorChairPos : waypoints[patrolIndex];
    const pos = groupRef.current.position;
    const dist = pos.distanceTo(target);

    if (dist > 0.1) {
      // Interpola posição X/Z suavemente e rotaciona o corpo na direção da caminhada
      const dir = target.clone().sub(pos).normalize();
      pos.addScaledVector(dir, Math.min(dist, delta * 4.2));
      const angle = Math.atan2(dir.x, dir.z);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, angle, 0.18);

      // Animação de caminhada das pernas e braços
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = Math.sin(t * 11) * 0.55;
        rightLegRef.current.rotation.x = -Math.sin(t * 11) * 0.55;
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = -Math.sin(t * 11) * 0.45;
        rightArmRef.current.rotation.x = Math.sin(t * 11) * 0.45;
      }
    } else {
      // Parado ou sentado na cadeira da Sala do Chefe
      const lookAngle = summonedToBoss ? Math.PI / 2 : patrolIndex === 1 ? Math.PI : -Math.PI / 2;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        lookAngle,
        0.15
      );

      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = summonedToBoss ? -Math.PI / 3 : 0;
        rightLegRef.current.rotation.x = summonedToBoss ? -Math.PI / 3 : 0;
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = 0;
        rightArmRef.current.rotation.x = -0.35; // Segurando prancheta
      }

      if (summonedToBoss && !notifiedBossRef.current) {
        notifiedBossRef.current = true;
        onArrivedAtBossChair();
      }
    }
  });

  return (
    <group ref={groupRef} position={[-5.8, 0, -4.5]}>
      {/* Pernas */}
      <mesh ref={leftLegRef} position={[-0.12, 0.32, 0]} castShadow>
        <boxGeometry args={[0.15, 0.48, 0.16]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh ref={rightLegRef} position={[0.12, 0.32, 0]} castShadow>
        <boxGeometry args={[0.15, 0.48, 0.16]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* Blazer Executivo Âmbar/Marrom do Gerente Claude */}
      <mesh position={[0, 0.82, 0]} castShadow>
        <boxGeometry args={[0.46, 0.58, 0.28]} />
        <meshStandardMaterial color="#d97706" roughness={0.45} />
      </mesh>

      {/* Braços */}
      <mesh ref={leftArmRef} position={[-0.31, 0.82, 0]} castShadow>
        <boxGeometry args={[0.13, 0.48, 0.15]} />
        <meshStandardMaterial color="#b45309" />
      </mesh>
      <mesh ref={rightArmRef} position={[0.31, 0.82, 0]} castShadow>
        <boxGeometry args={[0.13, 0.48, 0.15]} />
        <meshStandardMaterial color="#b45309" />
      </mesh>

      {/* Cabeça */}
      <mesh position={[0, 1.32, 0]} castShadow>
        <boxGeometry args={[0.36, 0.36, 0.36]} />
        <meshStandardMaterial color="#fed7aa" />
      </mesh>
      {/* Cabelo */}
      <mesh position={[0, 1.53, 0]} castShadow>
        <boxGeometry args={[0.38, 0.1, 0.38]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>

      {/* Balão de Fala 3D Acima da Cabeça do Claude - Gerente */}
      <Html position={[0, 2.28, 0]} center distanceFactor={15} zIndexRange={[10, 0]}>
        <div className="w-60 bg-amber-400 text-slate-950 rounded-xl px-3 py-2 shadow-2xl border-2 border-white select-none pointer-events-none">
          <div className="text-[9px] font-black uppercase tracking-wider text-amber-950 mb-0.5">
            📋 Claude — Gerente IA
          </div>
          <p className="text-[11px] font-bold leading-snug">“{speechText}”</p>
        </div>
      </Html>
    </group>
  );
};

