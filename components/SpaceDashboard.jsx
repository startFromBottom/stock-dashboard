'use client';

import { useState } from 'react';
import { SPACE_LAYERS } from '@/data/spaceCompanies';
import SpaceLayerMap from './SpaceLayerMap';

/* ═══════════════════════════════════════════════════════
   우주 섹터 SVG 밸류체인 다이어그램 (5개 레이어 수직)
═══════════════════════════════════════════════════════ */

const CHAIN_LAYERS = [
  {
    id: 'materials',
    label: '소재 / 부품 / 엔진',
    icon: '🔩',
    color: { bg: '#1a1030', bd: '#7c3aed', bgA: '#2d1a5e', bdA: '#a78bfa', tx: '#a78bfa', txA: '#c4b5fd' },
    nodes: ['로켓 소재', '추진 엔진', '정밀 부품'],
  },
  {
    id: 'launch',
    label: '발사체 / 론치 서비스',
    icon: '🚀',
    color: { bg: '#0f1e30', bd: '#0ea5e9', bgA: '#0c2d4a', bdA: '#38bdf8', tx: '#38bdf8', txA: '#7dd3fc' },
    nodes: ['소형 로켓', '중·대형 로켓', '재사용 발사체'],
  },
  {
    id: 'satellite',
    label: '인공위성 제작 / 운용',
    icon: '🛰️',
    color: { bg: '#0a1f1a', bd: '#10b981', bgA: '#0d3026', bdA: '#34d399', tx: '#34d399', txA: '#6ee7b7' },
    nodes: ['위성 버스', '위성 통신', '큐브샛 군집'],
  },
  {
    id: 'data',
    label: '우주 데이터 / 분석',
    icon: '📊',
    color: { bg: '#1a1a0a', bd: '#f59e0b', bgA: '#2d2a0a', bdA: '#fbbf24', tx: '#fbbf24', txA: '#fde68a' },
    nodes: ['지구 관측', '위성 이미지', '항법 / SSA'],
  },
  {
    id: 'defense',
    label: '우주 국방 / 응용',
    icon: '🛡️',
    color: { bg: '#1a100a', bd: '#f97316', bgA: '#2d1c0a', bdA: '#fb923c', tx: '#fb923c', txA: '#fdba74' },
    nodes: ['군사 위성', '미사일 방어', '정보 융합'],
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

function SpaceChainDiagram({ activeId, onSelect }) {
  return (
    <div style={{ width: '100%', maxWidth: SVG_W }}>
      <svg
        viewBox={`0 0 ${SVG_W} ${TOTAL_H}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', width: '100%', borderRadius: 12, background: '#04080f' }}
      >
        <defs>
          <pattern id="spacegrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0f172a" strokeWidth="0.5" />
          </pattern>
          <filter id="spaceglow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <marker id="spacearrow" markerWidth="7" markerHeight="7" refX="4" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 z" fill="#1e3a5f" />
          </marker>
          <marker id="spacearrow-a" markerWidth="7" markerHeight="7" refX="4" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 z" fill="#38bdf8" />
          </marker>
        </defs>

        <rect width={SVG_W} height={TOTAL_H} fill="url(#spacegrid)" />

        {/* 별 효과 */}
        {[
          [50, 30], [120, 15], [200, 45], [310, 20], [420, 35], [530, 10], [620, 50],
          [80, 100], [250, 80], [400, 95], [560, 75], [650, 120],
          [30, 180], [170, 160], [340, 200], [490, 170], [640, 190],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.2 : 0.7}
            fill="white" opacity={0.15 + (i % 4) * 0.08} />
        ))}

        {CHAIN_LAYERS.map((layer, li) => {
          const y = PAD_Y + li * (LAYER_H + LAYER_GAP);
          const isActive = activeId === layer.id;
          const c = layer.color;
          const centerX = SVG_W / 2;

          // 메인 레이어 박스
          return (
            <g key={layer.id} onClick={() => onSelect(layer.id)} style={{ cursor: 'pointer' }}>
              {/* 연결선 (위 레이어와) */}
              {li > 0 && (
                <line
                  x1={centerX} y1={y - LAYER_GAP}
                  x2={centerX} y2={y}
                  stroke={isActive || activeId === CHAIN_LAYERS[li - 1].id ? '#38bdf8' : '#1e3a5f'}
                  strokeWidth={isActive ? 2 : 1.4}
                  strokeDasharray={isActive ? 'none' : '4 3'}
                  markerEnd={isActive ? 'url(#spacearrow-a)' : 'url(#spacearrow)'}
                  style={{ transition: 'stroke 0.2s' }}
                />
              )}

              {/* 글로우 효과 (활성) */}
              {isActive && (
                <rect x={PAD_X - 4} y={y - 4} width={SVG_W - PAD_X * 2 + 8} height={LAYER_H + 8}
                  rx={13} fill="none" stroke={c.bdA} strokeWidth={2} opacity={0.3}
                  filter="url(#spaceglow)" />
              )}

              {/* 메인 레이어 배경 */}
              <rect x={PAD_X} y={y} width={SVG_W - PAD_X * 2} height={LAYER_H}
                rx={10} fill={isActive ? c.bgA : c.bg}
                stroke={isActive ? c.bdA : c.bd}
                strokeWidth={isActive ? 1.8 : 1}
                style={{ transition: 'all 0.2s' }} />

              {/* 아이콘 */}
              <text x={PAD_X + 28} y={y + LAYER_H / 2 + 1}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={22} style={{ pointerEvents: 'none' }}>
                {layer.icon}
              </text>

              {/* 레이어 제목 */}
              <text x={PAD_X + 56} y={y + 26}
                fontSize={13} fontWeight="700"
                fill={isActive ? c.txA : c.tx}
                style={{ pointerEvents: 'none', transition: 'fill 0.2s' }}>
                {layer.label}
              </text>

              {/* 노드 태그들 */}
              {layer.nodes.map((node, ni) => {
                const nodeX = PAD_X + 56 + ni * (NODE_W + 8);
                const nodeY = y + LAYER_H - NODE_H - 8;
                return (
                  <g key={ni} style={{ pointerEvents: 'none' }}>
                    <rect x={nodeX} y={nodeY} width={NODE_W} height={NODE_H}
                      rx={6}
                      fill={isActive ? `${c.bdA}22` : `${c.bd}18`}
                      stroke={isActive ? `${c.bdA}88` : `${c.bd}44`}
                      strokeWidth={0.8} />
                    <text x={nodeX + NODE_W / 2} y={nodeY + NODE_H / 2}
                      textAnchor="middle" dominantBaseline="middle"
                      fontSize={9} fontWeight="600"
                      fill={isActive ? c.txA : c.tx} opacity={0.9}>
                      {node}
                    </text>
                  </g>
                );
              })}

              {/* 클릭 힌트 화살표 */}
              {!isActive && (
                <text x={SVG_W - PAD_X - 16} y={y + LAYER_H / 2 + 1}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={12} fill={c.bd} opacity={0.5}
                  style={{ pointerEvents: 'none' }}>
                  →
                </text>
              )}
            </g>
          );
        })}

        {/* 하단 서명 */}
        <text x={SVG_W / 2} y={TOTAL_H - 5}
          textAnchor="middle" fontSize={7.5} fill="#1e3a5f" fontWeight="600" letterSpacing="1.4"
          style={{ pointerEvents: 'none' }}>
          SPACE SECTOR VALUE CHAIN  ·  5 LAYERS  ·  MATERIALS TO APPLICATIONS
        </text>
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   사이드 패널
═══════════════════════════════════════════════════════ */
function SpaceSidePanel({ activeId, onSelect }) {
  return (
    <div className="illust-panel">
      <div className="illust-panel-title">밸류체인 레이어</div>
      {CHAIN_LAYERS.map(layer => {
        const isActive = activeId === layer.id;
        const c = layer.color;
        return (
          <div key={layer.id}
            className={`illust-item${isActive ? ' active' : ''}`}
            onClick={() => onSelect(layer.id)}
            style={isActive ? { borderColor: c.bdA, background: c.bgA } : {}}>
            <div className="illust-item-label" style={{ color: isActive ? c.txA : undefined }}>
              <span style={{ marginRight: 6 }}>{layer.icon}</span>
              {layer.label}
            </div>
            {isActive && (
              <div className="illust-item-body">
                <div className="illust-item-layer" style={{ color: c.tx }}>
                  {layer.nodes.join(' · ')}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   메인 우주 대시보드
═══════════════════════════════════════════════════════ */
export default function SpaceDashboard() {
  const [activeId, setActiveId] = useState(null);
  const toggle = id => setActiveId(prev => prev === id ? null : id);

  return (
    <div>
      {/* 헤더 */}
      <div style={{ marginBottom: 14 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
          🚀 우주 섹터 전체 밸류체인
        </h2>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <span style={{ color: '#a78bfa' }}>소재·부품·엔진</span>
          &ensp;→&ensp;
          <span style={{ color: '#38bdf8' }}>발사체·론치</span>
          &ensp;→&ensp;
          <span style={{ color: '#34d399' }}>위성 제작·운용</span>
          &ensp;→&ensp;
          <span style={{ color: '#fbbf24' }}>우주 데이터·분석</span>
          &ensp;→&ensp;
          <span style={{ color: '#fb923c' }}>국방·응용</span>
        </p>
      </div>

      {/* 다이어그램 + 사이드 패널 */}
      <div className="illust-wrap" style={{ alignItems: 'flex-start' }}>
        <div className="illust-svg" style={{ flex: '1 1 auto' }}>
          <SpaceChainDiagram activeId={activeId} onSelect={toggle} />
        </div>
        <SpaceSidePanel activeId={activeId} onSelect={toggle} />
      </div>

      {!activeId && (
        <p className="hint-text" style={{ marginTop: 20 }}>
          ↑ 레이어를 클릭하면 세부 카테고리와 Top 기업이 표시됩니다
        </p>
      )}

      {/* 선택된 레이어의 LayerMap */}
      {activeId && (
        <div style={{ marginTop: 24 }}>
          <SpaceLayerMap filterLayerId={activeId} />
        </div>
      )}
    </div>
  );
}
