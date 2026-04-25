'use client';
import { useState } from 'react';
import { ALL_COMPONENTS } from '@/data/companies';
import CompanyPanel from './CompanyPanel';

/* ─── Zone definitions ─── */
// SVG 총 너비: 732 (= energy 88 + facility 644)
const W = 734;
const ZONE_DEFS = [
  {
    id: 'hyperscaler',
    label: '☁️ 클라우드 플랫폼',
    layer: '☁️ 클라우드 / 하이퍼스케일러 레이어',
    role: 'AWS·Azure·GCP 등 퍼블릭 클라우드가 AI 인프라를 서비스로 제공. GPU 클러스터 운영·API 배포·사용량 과금까지 관리.',
    x: 0, y: 0, w: W, h: 62,
    rx: 0,
    svgLabel: { x: W / 2, y: 34 },
  },
  {
    id: 'energy',
    label: '⚡ 에너지 공급',
    layer: '🏭 물리 인프라 레이어',
    role: '원전·태양광·풍력 등 전력을 데이터센터에 직접 공급. AI 가속기의 전력 수요 급증으로 장기 PPA 계약이 핵심 이슈.',
    x: 0, y: 62, w: 88, h: 398,
    rx: 0,
    svgLabel: { x: 44, y: 261, rotate: -90 },
  },
  {
    id: 'facility',
    label: '🏢 데이터센터 시설',
    layer: '☁️ 클라우드 / 하이퍼스케일러 레이어',
    role: '코로케이션 부지·전력·냉각 인프라를 임대. 하이퍼스케일러와 기업이 직접 서버를 설치하거나 xScale 전용 캠퍼스 계약.',
    x: 88, y: 62, w: 644, h: 398,
    rx: 0,
    fill: 'none',
    svgLabel: null,
  },
  {
    id: 'power',
    label: '🔋 전력 인프라',
    layer: '🔋 전력 & 냉각 레이어',
    role: 'UPS·PDU·변압기로 안정적인 전력을 랙까지 공급. 랙당 수십 kW에서 100 kW+ AI 고밀도 환경에 맞춰 800 VDC 배전 방식 확산.',
    x: 90, y: 64, w: 70, h: 394,
    rx: 4,
    svgLabel: { x: 125, y: 261, rotate: -90 },
  },
  {
    id: 'gpu',
    label: '🖥️ AI 가속기/GPU',
    layer: '⚡ 컴퓨트 레이어',
    role: 'AI 모델 학습·추론의 핵심 연산 유닛. NVIDIA GPU·커스텀 ASIC(Broadcom·Marvell)이 수천 개씩 묶인 클러스터로 동작.',
    x: 162, y: 64, w: 302, h: 110,
    rx: 4,
    svgLabel: { x: 313, y: 122 },
  },
  {
    id: 'memory',
    label: '💾 메모리 (HBM)',
    layer: '⚡ 컴퓨트 레이어',
    role: 'GPU 칩 위에 적층된 HBM이 초고속 데이터를 전달. 대형 모델 처리에 HBM 대역폭이 병목이 되므로 HBM4 세대 경쟁이 치열.',
    x: 162, y: 176, w: 302, h: 96,
    rx: 4,
    svgLabel: { x: 313, y: 227 },
  },
  {
    id: 'server',
    label: '🖧 서버',
    layer: '⚡ 컴퓨트 레이어',
    role: 'GPU·CPU·메모리를 묶는 AI 서버 섀시. ODM(Foxconn·Quanta)이 NVIDIA GB200 NVL 랙을 조립해 클라우드에 납품.',
    x: 162, y: 274, w: 302, h: 90,
    rx: 4,
    svgLabel: { x: 313, y: 322 },
  },
  {
    id: 'ai-network',
    label: '🔗 AI 네트워킹',
    layer: '🔗 네트워킹 레이어',
    role: 'GPU 수천 개를 InfiniBand·RoCE 이더넷으로 연결해 분산 학습 통신 병목을 최소화. Arista·NVIDIA Quantum이 핵심 장비.',
    x: 162, y: 366, w: 180, h: 92,
    rx: 4,
    svgLabel: { x: 252, y: 415 },
  },
  {
    id: 'optics',
    label: '💡 광트랜시버',
    layer: '🔗 네트워킹 레이어',
    role: '800G~1.6T 광모듈이 랙 간·데이터센터 간 초고속 광신호를 전송. CPO(Co-Packaged Optics) 기술로 전력 효율 대폭 향상.',
    x: 344, y: 366, w: 120, h: 92,
    rx: 4,
    svgLabel: { x: 404, y: 415 },
  },
  {
    id: 'storage',
    label: '🗄️ 스토리지',
    layer: '⚡ 컴퓨트 레이어',
    role: 'AI 학습 데이터셋·체크포인트·모델 가중치를 저장. 올플래시 NVMe(Pure·NetApp)와 고용량 HDD(Seagate·WD)가 병행.',
    x: 466, y: 64, w: 186, h: 394,
    rx: 4,
    svgLabel: { x: 559, y: 261, rotate: -90 },
  },
  {
    id: 'cooling',
    label: '❄️ 냉각 시스템',
    layer: '🔋 전력 & 냉각 레이어',
    role: '100 kW+ 랙 발열을 직접 액냉·액침냉각으로 처리. 공냉 대비 PUE를 획기적으로 낮춰 데이터센터 운영비 절감.',
    x: 654, y: 64, w: 78, h: 394,
    rx: 4,
    svgLabel: { x: 693, y: 261, rotate: -90 },
  },
  {
    id: 'construction',
    label: '🏗️ 건설/엔지니어링',
    layer: '🏭 물리 인프라 레이어',
    role: '데이터센터 부지 선정·설계·전기/기계 시공 전담. AI 붐으로 글로벌 착공 물량이 폭증해 수주 잔고가 사상 최고치.',
    x: 88, y: 460, w: 644, h: 55,
    rx: 0,
    svgLabel: { x: 88 + 644 / 2, y: 490 },
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

                  {z.id === 'gpu' && Array.from({ length: 12 }).map((_, i) => (
                    <rect key={i}
                      x={z.x + 10 + (i % 6) * 48} y={z.y + 20 + Math.floor(i / 6) * 50}
                      width={38} height={36} rx={4}
                      fill={isActive ? '#1f4a2a' : '#111f14'}
                      stroke={isActive ? '#4ade80' : '#16a34a'}
                      strokeWidth={0.8}
                    />
                  ))}

                  {z.id === 'memory' && Array.from({ length: 16 }).map((_, i) => (
                    <rect key={i}
                      x={z.x + 8 + (i % 8) * 36} y={z.y + 18 + Math.floor(i / 8) * 42}
                      width={28} height={32} rx={2}
                      fill={isActive ? '#0e2a4a' : '#080f1a'}
                      stroke={isActive ? '#38bdf8' : '#0369a1'}
                      strokeWidth={0.8}
                    />
                  ))}

                  {z.id === 'server' && Array.from({ length: 8 }).map((_, i) => (
                    <rect key={i}
                      x={z.x + 6 + (i % 4) * 72} y={z.y + 12 + Math.floor(i / 4) * 38}
                      width={62} height={28} rx={3}
                      fill={isActive ? '#1a0f30' : '#0d0818'}
                      stroke={isActive ? '#a78bfa' : '#7c3aed'}
                      strokeWidth={0.8}
                    />
                  ))}

                  {z.id === 'ai-network' && Array.from({ length: 6 }).map((_, i) => (
                    <g key={i} transform={`translate(${z.x + 10 + (i % 3) * 56}, ${z.y + 14 + Math.floor(i / 3) * 38})`}>
                      <rect width={46} height={26} rx={3}
                        fill={isActive ? '#0f2a14' : '#091409'}
                        stroke={isActive ? '#4ade80' : '#15803d'}
                        strokeWidth={0.8} />
                      {Array.from({ length: 8 }).map((_, p) => (
                        <circle key={p} cx={5 + p * 5} cy={13} r={1.5}
                          fill={isActive ? '#4ade80' : '#15803d'} opacity={0.7} />
                      ))}
                    </g>
                  ))}

                  {z.id === 'optics' && Array.from({ length: 4 }).map((_, i) => (
                    <g key={i} transform={`translate(${z.x + 8 + (i % 2) * 54}, ${z.y + 12 + Math.floor(i / 2) * 36})`}>
                      <rect width={46} height={26} rx={3}
                        fill={isActive ? '#2a1f00' : '#110c00'}
                        stroke={isActive ? '#facc15' : '#ca8a04'}
                        strokeWidth={0.8} />
                      <line x1={4} y1={13} x2={42} y2={13}
                        stroke={isActive ? '#facc15' : '#ca8a04'}
                        strokeWidth={1.5} strokeDasharray="3 2" />
                    </g>
                  ))}

                  {z.id === 'cooling' && Array.from({ length: 5 }).map((_, i) => (
                    <g key={i}>
                      <circle
                        cx={z.x + z.w / 2} cy={z.y + 44 + i * 70}
                        r={26} fill="none"
                        stroke={isActive ? '#22d3ee' : '#0891b2'}
                        strokeWidth={1.2}
                      />
                      <text
                        x={z.x + z.w / 2} y={z.y + 44 + i * 70}
                        textAnchor="middle" dominantBaseline="middle"
                        fontSize={30} className="spin-fan"
                        fill={isActive ? '#22d3ee' : '#0891b2'}
                      >✦</text>
                    </g>
                  ))}

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

            <text x={100} y={76} fontSize={8.5} fill="#334155" fontWeight="700" letterSpacing="1"
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
