'use client';
import { useState } from 'react';
import { ALL_COMPONENTS } from '@/data/companies';
import CompanyPanel from './CompanyPanel';

/* ─── Zone definitions ─── */
// Layout constants
// Total: W=734, H=515
// Row1 (hyperscaler): h=56
// Row2 (facility row): y=58, h=400
//   Left column (energy): x=0, w=82
//   Inner left (power): x=84, w=68  gap=2 from energy border
//   Compute columns: x=154 ~ x=464  w=310  gap=2 from power
//     gpu:      y=60, h=112
//     memory:   y=174, h=96   gap=2
//     server:   y=272, h=90   gap=2
//     network row: y=364, h=92  gap=2
//       ai-network: x=154, w=186
//       optics:     x=342, w=124  gap=2
//   Right column (storage): x=466, w=186  gap=2 from optics edge(466)
//   Far right (cooling): x=654, w=78  gap=2
// Row3 (construction): y=460, h=55
const W = 734;
const GAP = 4;  // uniform gap between all zones

// Row1
const R1_Y = 0, R1_H = 58;
// Row2
const R2_Y = R1_Y + R1_H;          // 58
const R2_H = 400;
// Row3
const R3_Y = R2_Y + R2_H;          // 458
const R3_H = 515 - R3_Y;           // 57

// Row2 columns
const ENERGY_X = 0, ENERGY_W = 82;
const FAC_X = ENERGY_X + ENERGY_W, FAC_W = W - ENERGY_W;  // 82 ~ 734
const POWER_X = FAC_X + GAP / 2, POWER_W = 68;            // 84
const COMPUTE_X = POWER_X + POWER_W + GAP / 2;            // 154
const STORAGE_X = 466, STORAGE_W = 186;
const COOLING_X = STORAGE_X + STORAGE_W + GAP / 2;        // 654
const COOLING_W = W - COOLING_X;                           // 80
const COMPUTE_W = STORAGE_X - COMPUTE_X - GAP / 2;        // 310

// Compute sub-rows (within Row2, y offset from R2_Y)
const CY0 = R2_Y + GAP / 2;   // 60
const GPU_H = 112, MEM_H = 96, SRV_H = 90, NET_H = 94;
const MEM_Y = CY0 + GPU_H + GAP / 2;      // 174
const SRV_Y = MEM_Y + MEM_H + GAP / 2;   // 272
const NET_Y = SRV_Y + SRV_H + GAP / 2;   // 364
// Networking split
const AINET_W = 186, OPTICS_X = COMPUTE_X + AINET_W + GAP / 2;
const OPTICS_W = COMPUTE_W - AINET_W - GAP / 2;  // ~120

const ZONE_DEFS = [
  {
    id: 'hyperscaler',
    label: '☁️ 클라우드 플랫폼',
    layer: '☁️ 클라우드 / 하이퍼스케일러 레이어',
    role: 'AWS·Azure·GCP 등 퍼블릭 클라우드가 AI 인프라를 서비스로 제공. GPU 클러스터 운영·API 배포·사용량 과금까지 관리.',
    x: 0, y: R1_Y, w: W, h: R1_H,
    rx: 0,
    svgLabel: { x: W / 2, y: R1_Y + R1_H / 2 },
  },
  {
    id: 'energy',
    label: '⚡ 에너지 공급',
    layer: '🏭 물리 인프라 레이어',
    role: '원전·태양광·풍력 등 전력을 데이터센터에 직접 공급. AI 가속기의 전력 수요 급증으로 장기 PPA 계약이 핵심 이슈.',
    x: ENERGY_X, y: R2_Y, w: ENERGY_W, h: R2_H,
    rx: 0,
    svgLabel: { x: ENERGY_X + ENERGY_W / 2, y: R2_Y + R2_H / 2, rotate: -90 },
  },
  {
    id: 'facility',
    label: '🏢 데이터센터 시설',
    layer: '☁️ 클라우드 / 하이퍼스케일러 레이어',
    role: '코로케이션 부지·전력·냉각 인프라를 임대. 하이퍼스케일러와 기업이 직접 서버를 설치하거나 xScale 전용 캠퍼스 계약.',
    x: FAC_X, y: R2_Y, w: FAC_W, h: R2_H,
    rx: 0,
    fill: 'none',
    svgLabel: null,
  },
  {
    id: 'power',
    label: '🔋 전력 인프라',
    layer: '🔋 전력 & 냉각 레이어',
    role: 'UPS·PDU·변압기로 안정적인 전력을 랙까지 공급. 랙당 수십 kW에서 100 kW+ AI 고밀도 환경에 맞춰 800 VDC 배전 방식 확산.',
    x: POWER_X, y: R2_Y + GAP / 2, w: POWER_W, h: R2_H - GAP,
    rx: 4,
    svgLabel: { x: POWER_X + POWER_W / 2, y: R2_Y + R2_H / 2, rotate: -90 },
  },
  {
    id: 'gpu',
    label: '🖥️ AI 가속기/GPU',
    layer: '⚡ 컴퓨트 레이어',
    role: 'AI 모델 학습·추론의 핵심 연산 유닛. NVIDIA GPU·커스텀 ASIC(Broadcom·Marvell)이 수천 개씩 묶인 클러스터로 동작.',
    x: COMPUTE_X, y: CY0, w: COMPUTE_W, h: GPU_H,
    rx: 4,
    svgLabel: { x: COMPUTE_X + COMPUTE_W / 2, y: CY0 + GPU_H / 2 },
  },
  {
    id: 'memory',
    label: '💾 메모리 (HBM)',
    layer: '⚡ 컴퓨트 레이어',
    role: 'GPU 칩 위에 적층된 HBM이 초고속 데이터를 전달. 대형 모델 처리에 HBM 대역폭이 병목이 되므로 HBM4 세대 경쟁이 치열.',
    x: COMPUTE_X, y: MEM_Y, w: COMPUTE_W, h: MEM_H,
    rx: 4,
    svgLabel: { x: COMPUTE_X + COMPUTE_W / 2, y: MEM_Y + MEM_H / 2 },
  },
  {
    id: 'server',
    label: '🖧 서버',
    layer: '⚡ 컴퓨트 레이어',
    role: 'GPU·CPU·메모리를 묶는 AI 서버 섀시. ODM(Foxconn·Quanta)이 NVIDIA GB200 NVL 랙을 조립해 클라우드에 납품.',
    x: COMPUTE_X, y: SRV_Y, w: COMPUTE_W, h: SRV_H,
    rx: 4,
    svgLabel: { x: COMPUTE_X + COMPUTE_W / 2, y: SRV_Y + SRV_H / 2 },
  },
  {
    id: 'ai-network',
    label: '🔗 AI 네트워킹',
    layer: '🔗 네트워킹 레이어',
    role: 'GPU 수천 개를 InfiniBand·RoCE 이더넷으로 연결해 분산 학습 통신 병목을 최소화. Arista·NVIDIA Quantum이 핵심 장비.',
    x: COMPUTE_X, y: NET_Y, w: AINET_W, h: NET_H,
    rx: 4,
    svgLabel: { x: COMPUTE_X + AINET_W / 2, y: NET_Y + NET_H / 2 },
  },
  {
    id: 'optics',
    label: '💡 광트랜시버',
    layer: '🔗 네트워킹 레이어',
    role: '800G~1.6T 광모듈이 랙 간·데이터센터 간 초고속 광신호를 전송. CPO(Co-Packaged Optics) 기술로 전력 효율 대폭 향상.',
    x: OPTICS_X, y: NET_Y, w: OPTICS_W, h: NET_H,
    rx: 4,
    svgLabel: { x: OPTICS_X + OPTICS_W / 2, y: NET_Y + NET_H / 2 },
  },
  {
    id: 'storage',
    label: '🗄️ 스토리지',
    layer: '⚡ 컴퓨트 레이어',
    role: 'AI 학습 데이터셋·체크포인트·모델 가중치를 저장. 올플래시 NVMe(Pure·NetApp)와 고용량 HDD(Seagate·WD)가 병행.',
    x: STORAGE_X, y: R2_Y + GAP / 2, w: STORAGE_W, h: R2_H - GAP,
    rx: 4,
    svgLabel: { x: STORAGE_X + STORAGE_W / 2, y: R2_Y + R2_H / 2, rotate: -90 },
  },
  {
    id: 'cooling',
    label: '❄️ 냉각 시스템',
    layer: '🔋 전력 & 냉각 레이어',
    role: '100 kW+ 랙 발열을 직접 액냉·액침냉각으로 처리. 공냉 대비 PUE를 획기적으로 낮춰 데이터센터 운영비 절감.',
    x: COOLING_X, y: R2_Y + GAP / 2, w: COOLING_W, h: R2_H - GAP,
    rx: 4,
    svgLabel: { x: COOLING_X + COOLING_W / 2, y: R2_Y + R2_H / 2, rotate: -90 },
  },
  {
    id: 'construction',
    label: '🏗️ 건설/엔지니어링',
    layer: '🏭 물리 인프라 레이어',
    role: '데이터센터 부지 선정·설계·전기/기계 시공 전담. AI 붐으로 글로벌 착공 물량이 폭증해 수주 잔고가 사상 최고치.',
    x: FAC_X, y: R3_Y, w: FAC_W, h: R3_H,
    rx: 0,
    svgLabel: { x: FAC_X + FAC_W / 2, y: R3_Y + R3_H / 2 },
  },
];

/* ─── Per-zone color themes ─── */
const ZONE_COLORS = {
  hyperscaler:  { bg: '#0c1a3a', bgA: '#1a306b', bd: '#2563eb', bdA: '#60a5fa', tx: '#93c5fd', txA: '#dbeafe' },
  energy:       { bg: '#1a1205', bgA: '#3b2800', bd: '#b45309', bdA: '#fbbf24', tx: '#fcd34d', txA: '#fef08a' },
  facility:     { bg: 'transparent', bgA: 'transparent', bd: '#475569', bdA: '#818cf8', tx: '#94a3b8', txA: '#c7d2fe' },
  power:        { bg: '#1a0f00', bgA: '#3d2200', bd: '#d97706', bdA: '#fbbf24', tx: '#fb923c', txA: '#fed7aa' },
  gpu:          { bg: '#0a1f0a', bgA: '#163a16', bd: '#16a34a', bdA: '#4ade80', tx: '#86efac', txA: '#dcfce7' },
  memory:       { bg: '#0f172a', bgA: '#1e3a5f', bd: '#0369a1', bdA: '#38bdf8', tx: '#7dd3fc', txA: '#e0f2fe' },
  server:       { bg: '#1a0a1a', bgA: '#3b1a3b', bd: '#7c3aed', bdA: '#a78bfa', tx: '#c4b5fd', txA: '#ede9fe' },
  'ai-network': { bg: '#0f1a0a', bgA: '#1f3a14', bd: '#15803d', bdA: '#4ade80', tx: '#86efac', txA: '#dcfce7' },
  optics:       { bg: '#1a1505', bgA: '#3a2d0a', bd: '#ca8a04', bdA: '#facc15', tx: '#fde68a', txA: '#fef9c3' },
  storage:      { bg: '#0f0a1a', bgA: '#231447', bd: '#6d28d9', bdA: '#c084fc', tx: '#d8b4fe', txA: '#f3e8ff' },
  cooling:      { bg: '#001a1a', bgA: '#003a3a', bd: '#0891b2', bdA: '#22d3ee', tx: '#67e8f9', txA: '#cffafe' },
  construction: { bg: '#1a0f0f', bgA: '#3a1a0f', bd: '#c2410c', bdA: '#fb923c', tx: '#fca5a5', txA: '#ffe4e6' },
};

function RackLines({ x, y, w, h, color }) {
  const lines = [];
  for (let i = y + 8; i < y + h - 4; i += 10) {
    lines.push(
      <rect key={i} x={x + 4} y={i} width={w - 8} height={5}
        rx={1} fill={color} opacity={0.18} />
    );
  }
  return <>{lines}</>;
}

export default function Illustration() {
  const [activeId, setActiveId] = useState(null);

  const toggle = (id) => setActiveId(prev => prev === id ? null : id);
  const activeComp = ALL_COMPONENTS.find(c => c.id === activeId);
  const activeZone = ZONE_DEFS.find(z => z.id === activeId);

  return (
    <div>
      <div className="illust-wrap">
        {/* ── SVG Canvas ── */}
        <div className="illust-svg">
          <svg viewBox={`0 0 ${W} 515`} xmlns="http://www.w3.org/2000/svg"
            aria-label="AI 데이터센터 구성도"
            style={{ display: 'block', width: '100%', borderRadius: 12, background: '#080f1f' }}>

            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.4" />
              </pattern>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            <rect width={W} height="515" fill="url(#grid)" />

            {ZONE_DEFS.map((z) => {
              const isActive = activeId === z.id;
              const c = ZONE_COLORS[z.id] || ZONE_COLORS.facility;
              const fillColor = z.fill === 'none' ? 'none' : (isActive ? c.bgA : c.bg);
              const strokeColor = isActive ? c.bdA : c.bd;
              const strokeWidth = isActive ? 2 : 1.2;

              return (
                <g key={z.id} onClick={() => toggle(z.id)} style={{ cursor: 'pointer' }}>
                  <rect
                    x={z.x + 0.6} y={z.y + 0.6}
                    width={z.w - 1.2} height={z.h - 1.2}
                    rx={z.rx ?? 4}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    style={{ transition: 'all 0.18s' }}
                  />

                  {['storage', 'power', 'energy'].includes(z.id) && (
                    <RackLines x={z.x + 2} y={z.y + 2} w={z.w - 4} h={z.h - 4}
                      color={isActive ? c.bdA : c.bd} />
                  )}

                  {z.id === 'gpu' && (() => {
                    // 2 rows × 6 cols chips, centered in zone with uniform 10px padding
                    const PAD = 10;
                    const cols = 6, rows = 2;
                    const chipW = Math.floor((z.w - PAD * 2 - (cols - 1) * 4) / cols);
                    const chipH = Math.floor((z.h - PAD * 2 - (rows - 1) * 6) / rows);
                    return Array.from({ length: cols * rows }).map((_, i) => {
                      const col = i % cols, row = Math.floor(i / cols);
                      return (
                        <rect key={i}
                          x={z.x + PAD + col * (chipW + 4)}
                          y={z.y + PAD + row * (chipH + 6)}
                          width={chipW} height={chipH} rx={4}
                          fill={isActive ? '#1f4a2a' : '#111f14'}
                          stroke={isActive ? '#4ade80' : '#16a34a'}
                          strokeWidth={0.8}
                        />
                      );
                    });
                  })()}

                  {z.id === 'memory' && (() => {
                    const PAD = 8;
                    const cols = 8, rows = 2;
                    const chipW = Math.floor((z.w - PAD * 2 - (cols - 1) * 3) / cols);
                    const chipH = Math.floor((z.h - PAD * 2 - (rows - 1) * 6) / rows);
                    return Array.from({ length: cols * rows }).map((_, i) => {
                      const col = i % cols, row = Math.floor(i / cols);
                      return (
                        <rect key={i}
                          x={z.x + PAD + col * (chipW + 3)}
                          y={z.y + PAD + row * (chipH + 6)}
                          width={chipW} height={chipH} rx={2}
                          fill={isActive ? '#0e2a4a' : '#080f1a'}
                          stroke={isActive ? '#38bdf8' : '#0369a1'}
                          strokeWidth={0.8}
                        />
                      );
                    });
                  })()}

                  {z.id === 'server' && (() => {
                    const PAD = 8;
                    const cols = 4, rows = 2;
                    const chipW = Math.floor((z.w - PAD * 2 - (cols - 1) * 6) / cols);
                    const chipH = Math.floor((z.h - PAD * 2 - (rows - 1) * 8) / rows);
                    return Array.from({ length: cols * rows }).map((_, i) => {
                      const col = i % cols, row = Math.floor(i / cols);
                      return (
                        <rect key={i}
                          x={z.x + PAD + col * (chipW + 6)}
                          y={z.y + PAD + row * (chipH + 8)}
                          width={chipW} height={chipH} rx={3}
                          fill={isActive ? '#1a0f30' : '#0d0818'}
                          stroke={isActive ? '#a78bfa' : '#7c3aed'}
                          strokeWidth={0.8}
                        />
                      );
                    });
                  })()}

                  {z.id === 'ai-network' && (() => {
                    const PAD = 8;
                    const cols = 3, rows = 2;
                    const bW = Math.floor((z.w - PAD * 2 - (cols - 1) * 5) / cols);
                    const bH = Math.floor((z.h - PAD * 2 - (rows - 1) * 6) / rows);
                    return Array.from({ length: cols * rows }).map((_, i) => {
                      const col = i % cols, row = Math.floor(i / cols);
                      const bx = z.x + PAD + col * (bW + 5);
                      const by = z.y + PAD + row * (bH + 6);
                      return (
                        <g key={i} transform={`translate(${bx}, ${by})`}>
                          <rect width={bW} height={bH} rx={3}
                            fill={isActive ? '#0f2a14' : '#091409'}
                            stroke={isActive ? '#4ade80' : '#15803d'}
                            strokeWidth={0.8} />
                          {Array.from({ length: 7 }).map((_, p) => (
                            <circle key={p} cx={5 + p * (bW - 8) / 6} cy={bH / 2} r={1.5}
                              fill={isActive ? '#4ade80' : '#15803d'} opacity={0.7} />
                          ))}
                        </g>
                      );
                    });
                  })()}

                  {z.id === 'optics' && (() => {
                    const PAD = 8;
                    const cols = 2, rows = 2;
                    const bW = Math.floor((z.w - PAD * 2 - (cols - 1) * 5) / cols);
                    const bH = Math.floor((z.h - PAD * 2 - (rows - 1) * 6) / rows);
                    return Array.from({ length: cols * rows }).map((_, i) => {
                      const col = i % cols, row = Math.floor(i / cols);
                      const bx = z.x + PAD + col * (bW + 5);
                      const by = z.y + PAD + row * (bH + 6);
                      return (
                        <g key={i} transform={`translate(${bx}, ${by})`}>
                          <rect width={bW} height={bH} rx={3}
                            fill={isActive ? '#2a1f00' : '#110c00'}
                            stroke={isActive ? '#facc15' : '#ca8a04'}
                            strokeWidth={0.8} />
                          <line x1={4} y1={bH / 2} x2={bW - 4} y2={bH / 2}
                            stroke={isActive ? '#facc15' : '#ca8a04'}
                            strokeWidth={1.5} strokeDasharray="3 2" />
                        </g>
                      );
                    });
                  })()}

                  {z.id === 'cooling' && (() => {
                    // 5 fans evenly distributed vertically
                    const count = 5;
                    const r = Math.min(Math.floor((z.w - 8) / 2), 26);
                    const totalH = z.h - 8;
                    const step = totalH / count;
                    return Array.from({ length: count }).map((_, i) => {
                      const cy = z.y + 4 + step * i + step / 2;
                      return (
                        <g key={i}>
                          <circle
                            cx={z.x + z.w / 2} cy={cy}
                            r={r} fill="none"
                            stroke={isActive ? '#22d3ee' : '#0891b2'}
                            strokeWidth={1.2}
                          />
                          <text
                            x={z.x + z.w / 2} y={cy}
                            textAnchor="middle" dominantBaseline="middle"
                            fontSize={r * 1.3} className="spin-fan"
                            fill={isActive ? '#22d3ee' : '#0891b2'}
                          >✦</text>
                        </g>
                      );
                    });
                  })()}

                  {isActive && z.fill !== 'none' && (
                    <rect
                      x={z.x + 0.6} y={z.y + 0.6}
                      width={z.w - 1.2} height={z.h - 1.2}
                      rx={z.rx ?? 4}
                      fill="none"
                      stroke={c.bdA}
                      strokeWidth={3}
                      opacity={0.45}
                      filter="url(#glow)"
                    />
                  )}

                  {z.svgLabel && (
                    <text
                      x={z.svgLabel.x}
                      y={z.svgLabel.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={z.id === 'hyperscaler' || z.id === 'construction' ? 12 : 10}
                      fontWeight="700"
                      fill={isActive ? c.txA : c.tx}
                      transform={
                        z.svgLabel.rotate
                          ? `rotate(${z.svgLabel.rotate}, ${z.svgLabel.x}, ${z.svgLabel.y})`
                          : undefined
                      }
                      style={{ pointerEvents: 'none', transition: 'fill 0.18s' }}
                      letterSpacing="0.3"
                    >
                      {z.label}
                    </text>
                  )}
                </g>
              );
            })}

            <text x={FAC_X + 8} y={R2_Y + 14} fontSize={8.5} fill="#334155" fontWeight="700" letterSpacing="1"
              style={{ pointerEvents: 'none' }}>
              DATA CENTER FACILITY
            </text>
          </svg>
        </div>

        {/* ── Right panel: zone list + description ── */}
        <div className="illust-panel">
          <div className="illust-panel-title">구성 요소 선택</div>
          {ZONE_DEFS.map((z) => {
            const isActive = activeId === z.id;
            const c = ZONE_COLORS[z.id] || ZONE_COLORS.facility;
            return (
              <div
                key={z.id}
                className={`illust-item${isActive ? ' active' : ''}`}
                onClick={() => toggle(z.id)}
                style={isActive
                  ? { borderColor: c.bdA, background: c.bgA !== 'transparent' ? c.bgA : undefined }
                  : {}}
              >
                <div className="illust-item-label" style={{ color: isActive ? c.txA : undefined }}>
                  {z.label}
                </div>
                {isActive && (
                  <div className="illust-item-body">
                    <div className="illust-item-layer">{z.layer}</div>
                    <div>{z.role}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Company Panel ── */}
      {activeComp && <CompanyPanel comp={activeComp} />}

      {!activeId && (
        <p className="hint-text" style={{ marginTop: 20 }}>
          ↑ 구성 요소를 클릭하면 레이어 설명과 Top 10 기업이 표시됩니다
        </p>
      )}
    </div>
  );
}
