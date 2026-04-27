'use client';

import { useState } from 'react';
import { FINTECH_LAYERS } from '@/data/fintechCompanies';
import FintechCompanyPanel from './FintechCompanyPanel';

/* ═══════════════════════════════════════════════════════
   핀테크/금융 인프라 섹터 — 허브 & 스포크 다이어그램
   중심: AI 금융/데이터 인프라
   주변 4개: 결제 인프라 / 은행·신용 / 투자·자산관리 / 블록체인·크립토
═══════════════════════════════════════════════════════ */

// 허브 (중심)
const HUB = {
  id: 'ai_finance',
  label: 'AI 금융 / 데이터 인프라',
  icon: '🤖',
  color: { bg: '#1a100a', bd: '#f97316', bgA: '#2d1c0a', bdA: '#fb923c', tx: '#fb923c', txA: '#fdba74' },
  nodes: ['금융 데이터', 'AI 분석·레그테크', '시장 인텔리전스'],
};

// 스포크 (주변) — 시계방향 배치: 좌상 / 우상 / 우하 / 좌하
const SPOKES = [
  {
    id: 'payment',
    label: '결제 인프라',
    icon: '💳',
    color: { bg: '#0f1e30', bd: '#0ea5e9', bgA: '#0c2d4a', bdA: '#38bdf8', tx: '#38bdf8', txA: '#7dd3fc' },
    nodes: ['결제 네트워크', '결제 처리', 'BNPL/지갑'],
    // 좌상
    angle: 225,
  },
  {
    id: 'banking',
    label: '은행 / 신용 인프라',
    icon: '🏦',
    color: { bg: '#0a1f1a', bd: '#10b981', bgA: '#0d3026', bdA: '#34d399', tx: '#34d399', txA: '#6ee7b7' },
    nodes: ['네오뱅크', '디지털 대출', '인슈어테크'],
    // 우상
    angle: 315,
  },
  {
    id: 'investment',
    label: '투자 / 자산관리',
    icon: '📈',
    color: { bg: '#1a1a0a', bd: '#f59e0b', bgA: '#2d2a0a', bdA: '#fbbf24', tx: '#fbbf24', txA: '#fde68a' },
    nodes: ['리테일 브로커리지', '로보어드바이저', '거래소 인프라'],
    // 우하
    angle: 45,
  },
  {
    id: 'crypto',
    label: '블록체인 / 크립토',
    icon: '🔗',
    color: { bg: '#1a1030', bd: '#7c3aed', bgA: '#2d1a5e', bdA: '#a78bfa', tx: '#a78bfa', txA: '#c4b5fd' },
    nodes: ['크립토 거래소', '스테이블코인', 'DeFi 인프라'],
    // 좌하
    angle: 135,
  },
];

// SVG 레이아웃 상수
const SVG_W   = 680;
const SVG_H   = 460;
const CX      = SVG_W / 2;      // 중심 X
const CY      = SVG_H / 2;      // 중심 Y
const SPOKE_R = 168;             // 중심에서 스포크 노드까지 거리
const HUB_W   = 160;
const HUB_H   = 80;
const SPOKE_W = 148;
const SPOKE_H = 80;

// 각도 → (x, y) 변환
function polarToXY(angleDeg, r) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

function FintechHubDiagram({ activeId, onSelect }) {
  return (
    <div style={{ width: '100%', maxWidth: SVG_W }}>
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', width: '100%', borderRadius: 12, background: '#04080f' }}
      >
        <defs>
          <pattern id="fintechgrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0f172a" strokeWidth="0.5" />
          </pattern>
          <filter id="fintechglow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="hubglow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* 배경 그리드 */}
        <rect width={SVG_W} height={SVG_H} fill="url(#fintechgrid)" />

        {/* 배경 원 (허브 주변 은은한 링) */}
        <circle cx={CX} cy={CY} r={SPOKE_R - 10} fill="none" stroke="#0f172a" strokeWidth="1" strokeDasharray="4,6" />
        <circle cx={CX} cy={CY} r={SPOKE_R + SPOKE_W / 2 + 16} fill="none" stroke="#0f172a" strokeWidth="0.5" strokeDasharray="2,8" />

        {/* 스포크 연결선 */}
        {SPOKES.map((spoke) => {
          const pos = polarToXY(spoke.angle, SPOKE_R);
          const isActive = activeId === spoke.id || activeId === HUB.id;
          const c = spoke.color;
          return (
            <line
              key={spoke.id + '-line'}
              x1={CX} y1={CY}
              x2={pos.x} y2={pos.y}
              stroke={isActive ? c.bd : '#1e3a5f'}
              strokeWidth={isActive ? 1.8 : 1}
              strokeDasharray={isActive ? 'none' : '5,4'}
              opacity={isActive ? 1 : 0.6}
            />
          );
        })}

        {/* 스포크 노드들 */}
        {SPOKES.map((spoke) => {
          const pos = polarToXY(spoke.angle, SPOKE_R);
          const isActive = activeId === spoke.id;
          const c = spoke.color;
          const nx = pos.x - SPOKE_W / 2;
          const ny = pos.y - SPOKE_H / 2;

          return (
            <g
              key={spoke.id}
              onClick={() => onSelect(spoke.id)}
              style={{ cursor: 'pointer' }}
              filter={isActive ? 'url(#fintechglow)' : undefined}
            >
              {/* 스포크 카드 */}
              <rect
                x={nx} y={ny}
                width={SPOKE_W} height={SPOKE_H}
                rx={10}
                fill={isActive ? c.bgA : c.bg}
                stroke={isActive ? c.bdA : c.bd}
                strokeWidth={isActive ? 1.8 : 1}
              />
              {/* 아이콘 */}
              <text
                x={pos.x} y={ny + 28}
                textAnchor="middle" fontSize={18}
                fontFamily="sans-serif"
              >{spoke.icon}</text>
              {/* 레이블 */}
              <text
                x={pos.x} y={ny + 48}
                textAnchor="middle" fontSize={10.5}
                fontWeight={isActive ? 700 : 500}
                fill={isActive ? c.txA : c.tx}
                fontFamily="sans-serif"
              >{spoke.label}</text>
              {/* 서브 태그 (첫 번째 노드) */}
              <text
                x={pos.x} y={ny + 63}
                textAnchor="middle" fontSize={8.5}
                fill={isActive ? c.txA : c.tx}
                opacity={0.7}
                fontFamily="sans-serif"
              >{spoke.nodes[0]} 외</text>
            </g>
          );
        })}

        {/* 허브 (중심) */}
        {(() => {
          const isActive = activeId === HUB.id;
          const c = HUB.color;
          return (
            <g
              onClick={() => onSelect(HUB.id)}
              style={{ cursor: 'pointer' }}
              filter={isActive ? 'url(#hubglow)' : undefined}
            >
              <rect
                x={CX - HUB_W / 2} y={CY - HUB_H / 2}
                width={HUB_W} height={HUB_H}
                rx={14}
                fill={isActive ? c.bgA : c.bg}
                stroke={isActive ? c.bdA : c.bd}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              <text
                x={CX} y={CY - 10}
                textAnchor="middle" fontSize={22}
                fontFamily="sans-serif"
              >{HUB.icon}</text>
              <text
                x={CX} y={CY + 12}
                textAnchor="middle" fontSize={11}
                fontWeight={700}
                fill={isActive ? c.txA : c.tx}
                fontFamily="sans-serif"
              >AI 금융 / 데이터</text>
              <text
                x={CX} y={CY + 26}
                textAnchor="middle" fontSize={9}
                fill={isActive ? c.txA : c.tx}
                opacity={0.7}
                fontFamily="sans-serif"
              >인프라</text>
            </g>
          );
        })()}

        {/* 하단 힌트 */}
        <text
          x={CX} y={SVG_H - 12}
          textAnchor="middle" fontSize={9.5}
          fill="#334155" fontFamily="sans-serif"
        >
          노드를 클릭하면 해당 섹터 기업 정보를 확인할 수 있습니다
        </text>
      </svg>
    </div>
  );
}

export default function FintechDashboard() {
  const [activeLayerId, setActiveLayerId] = useState(null);

  const handleLayerSelect = (layerId) => {
    setActiveLayerId(prev => prev === layerId ? null : layerId);
  };

  const activeLayer = activeLayerId
    ? FINTECH_LAYERS.find(l => l.id === activeLayerId)
    : null;

  return (
    <div>
      {/* ── SVG 밸류체인 다이어그램 ── */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <FintechHubDiagram activeId={activeLayerId} onSelect={handleLayerSelect} />
      </div>

      {/* ── 선택된 레이어 기업 패널 ── */}
      {activeLayer
        ? <FintechLayerMap key={activeLayerId} layerId={activeLayerId} />
        : <p className="hint-text">💳 노드를 클릭하면 해당 섹터의 주요 기업 상세 정보를 확인할 수 있습니다</p>
      }
    </div>
  );
}

/* ── 레이어 내 컴포넌트 카드 + 패널 ── */
function FintechLayerMap({ layerId }) {
  const [activeComp, setActiveComp] = useState(null);

  const layer = FINTECH_LAYERS.find(l => l.id === layerId);
  if (!layer) return null;

  const handleSelect = (comp) => {
    setActiveComp(prev => prev?.id === comp.id ? null : comp);
  };

  return (
    <div>
      <div className="layer-section">
        <div className="layer-label">{layer.layer}</div>
        <div className="comp-row">
          {layer.components.map(comp => (
            <div
              key={comp.id}
              className={`comp-card${activeComp?.id === comp.id ? ' active' : ''}`}
              onClick={() => handleSelect(comp)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && handleSelect(comp)}
            >
              <div className="comp-icon">{comp.icon}</div>
              <div className="comp-name">{comp.name}</div>
              <div className="comp-desc">{comp.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {activeComp && (
        <FintechCompanyPanel comp={activeComp} />
      )}
    </div>
  );
}
