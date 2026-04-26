'use client';

import { useState } from 'react';
import { FINTECH_LAYERS } from '@/data/fintechCompanies';
import FintechCompanyPanel from './FintechCompanyPanel';

/* ═══════════════════════════════════════════════════════
   핀테크/금융 인프라 섹터 밸류체인 다이어그램
   Layer 1 — 결제 인프라
   Layer 2 — 은행/신용 인프라
   Layer 3 — 투자/자산관리 인프라
   Layer 4 — 블록체인/크립토
   Layer 5 — AI 금융/데이터 인프라
═══════════════════════════════════════════════════════ */

const CHAIN_LAYERS = [
  {
    id: 'payment',
    label: '결제 인프라',
    icon: '💳',
    color: { bg: '#0f1e30', bd: '#0ea5e9', bgA: '#0c2d4a', bdA: '#38bdf8', tx: '#38bdf8', txA: '#7dd3fc' },
    nodes: ['결제 네트워크', '결제 처리', 'BNPL/지갑'],
  },
  {
    id: 'banking',
    label: '은행 / 신용 인프라',
    icon: '🏦',
    color: { bg: '#0a1f1a', bd: '#10b981', bgA: '#0d3026', bdA: '#34d399', tx: '#34d399', txA: '#6ee7b7' },
    nodes: ['네오뱅크', '디지털 대출', '인슈어테크'],
  },
  {
    id: 'investment',
    label: '투자 / 자산관리 인프라',
    icon: '📈',
    color: { bg: '#1a1a0a', bd: '#f59e0b', bgA: '#2d2a0a', bdA: '#fbbf24', tx: '#fbbf24', txA: '#fde68a' },
    nodes: ['리테일 브로커리지', '로보어드바이저', '거래소 인프라'],
  },
  {
    id: 'crypto',
    label: '블록체인 / 크립토',
    icon: '🔗',
    color: { bg: '#1a1030', bd: '#7c3aed', bgA: '#2d1a5e', bdA: '#a78bfa', tx: '#a78bfa', txA: '#c4b5fd' },
    nodes: ['크립토 거래소', '스테이블코인', 'DeFi 인프라'],
  },
  {
    id: 'ai_finance',
    label: 'AI 금융 / 데이터 인프라',
    icon: '🤖',
    color: { bg: '#1a100a', bd: '#f97316', bgA: '#2d1c0a', bdA: '#fb923c', tx: '#fb923c', txA: '#fdba74' },
    nodes: ['금융 데이터', 'AI 분석·레그테크', '시장 인텔리전스'],
  },
];

const SVG_W = 680;
const LAYER_H = 72;
const LAYER_GAP = 28;
const PAD_X = 24;
const PAD_Y = 16;
const NODE_W = 110;
const NODE_H = 28;
const TOTAL_H = PAD_Y + CHAIN_LAYERS.length * (LAYER_H + LAYER_GAP) - LAYER_GAP + PAD_Y;

function FintechChainDiagram({ activeId, onSelect }) {
  return (
    <div style={{ width: '100%', maxWidth: SVG_W }}>
      <svg
        viewBox={`0 0 ${SVG_W} ${TOTAL_H}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', width: '100%', borderRadius: 12, background: '#04080f' }}
      >
        <defs>
          <pattern id="fintechgrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0f172a" strokeWidth="0.5" />
          </pattern>
          <filter id="fintechglow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <marker id="fintechArrow" markerWidth="7" markerHeight="7" refX="4" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 z" fill="#1e3a5f" />
          </marker>
          <marker id="fintechArrow-a" markerWidth="7" markerHeight="7" refX="4" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 z" fill="#38bdf8" />
          </marker>
        </defs>

        {/* 배경 그리드 */}
        <rect width={SVG_W} height={TOTAL_H} fill="url(#fintechgrid)" />

        {/* 연결 화살표 */}
        {CHAIN_LAYERS.slice(0, -1).map((_, i) => {
          const y1 = PAD_Y + i * (LAYER_H + LAYER_GAP) + LAYER_H;
          const y2 = y1 + LAYER_GAP;
          const cx = SVG_W / 2;
          const isActive = activeId === CHAIN_LAYERS[i].id || activeId === CHAIN_LAYERS[i + 1].id;
          return (
            <line
              key={i}
              x1={cx} y1={y1 + 2}
              x2={cx} y2={y2 - 2}
              stroke={isActive ? '#38bdf8' : '#1e3a5f'}
              strokeWidth={isActive ? 2 : 1}
              markerEnd={isActive ? 'url(#fintechArrow-a)' : 'url(#fintechArrow)'}
            />
          );
        })}

        {/* 각 레이어 */}
        {CHAIN_LAYERS.map((layer, li) => {
          const y = PAD_Y + li * (LAYER_H + LAYER_GAP);
          const isActive = activeId === layer.id;
          const c = layer.color;

          // 노드 배치 계산
          const nodeCount = layer.nodes.length;
          const nodesW = nodeCount * NODE_W + (nodeCount - 1) * 10;
          const nodesStartX = (SVG_W - nodesW) / 2;

          return (
            <g
              key={layer.id}
              onClick={() => onSelect(layer.id)}
              style={{ cursor: 'pointer' }}
              filter={isActive ? 'url(#fintechglow)' : undefined}
            >
              {/* 레이어 배경 */}
              <rect
                x={PAD_X} y={y}
                width={SVG_W - PAD_X * 2} height={LAYER_H}
                rx={10}
                fill={isActive ? c.bgA : c.bg}
                stroke={isActive ? c.bdA : c.bd}
                strokeWidth={isActive ? 1.5 : 0.8}
              />

              {/* 아이콘 + 레이블 */}
              <text x={PAD_X + 14} y={y + 22} fontSize={15} fontFamily="sans-serif">{layer.icon}</text>
              <text
                x={PAD_X + 34} y={y + 23}
                fontSize={11} fontWeight={isActive ? 700 : 500}
                fill={isActive ? c.txA : c.tx}
                fontFamily="sans-serif"
              >
                {layer.label}
              </text>

              {/* 노드 태그들 */}
              {layer.nodes.map((node, ni) => {
                const nx = nodesStartX + ni * (NODE_W + 10);
                const ny = y + LAYER_H - NODE_H - 10;
                return (
                  <g key={ni}>
                    <rect
                      x={nx} y={ny}
                      width={NODE_W} height={NODE_H}
                      rx={6}
                      fill={isActive ? c.bgA : '#0a0f1a'}
                      stroke={isActive ? c.bdA : c.bd}
                      strokeWidth={0.8}
                      opacity={0.9}
                    />
                    <text
                      x={nx + NODE_W / 2} y={ny + NODE_H / 2 + 4}
                      textAnchor="middle"
                      fontSize={9.5}
                      fill={isActive ? c.txA : c.tx}
                      fontFamily="sans-serif"
                    >
                      {node}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}
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
        <FintechChainDiagram activeId={activeLayerId} onSelect={handleLayerSelect} />
      </div>

      {/* ── 힌트 텍스트 ── */}
      {!activeLayerId && (
        <p className="hint-text">
          💳 레이어를 클릭하면 해당 섹터의 주요 기업 상세 정보를 확인할 수 있습니다
        </p>
      )}

      {/* ── 선택된 레이어의 카드 목록 ── */}
      {activeLayer && (
        <div>
          {activeLayer.components.map((comp, ci) => (
            <div key={comp.id} style={{ marginBottom: ci < activeLayer.components.length - 1 ? 24 : 0 }}>
              <FintechLayerMap layerId={activeLayerId} compId={comp.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── 레이어 내 컴포넌트 카드 + 패널 ── */
function FintechLayerMap({ layerId, compId }) {
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

      {activeComp && layer.components.some(c => c.id === activeComp.id) && (
        <FintechCompanyPanel comp={activeComp} />
      )}
    </div>
  );
}
