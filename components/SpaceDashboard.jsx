'use client';

import { useState } from 'react';
import { SPACE_LAYERS } from '@/data/spaceCompanies';
import SpaceLayerMap from './SpaceLayerMap';

/* ═══════════════════════════════════════════════════════
   우주 섹터 SVG 밸류체인 다이어그램
   구조: 물리 인프라(수평) + 서비스 계층(병렬) + 수평 응용처
═══════════════════════════════════════════════════════ */

// 레이어별 색상 팔레트
const COLORS = {
  materials: { bg: '#1a1030', bd: '#7c3aed', bgA: '#2d1a5e', bdA: '#a78bfa', tx: '#a78bfa', txA: '#c4b5fd' },
  launch:    { bg: '#0f1e30', bd: '#0ea5e9', bgA: '#0c2d4a', bdA: '#38bdf8', tx: '#38bdf8', txA: '#7dd3fc' },
  satellite: { bg: '#0a1f1a', bd: '#10b981', bgA: '#0d3026', bdA: '#34d399', tx: '#34d399', txA: '#6ee7b7' },
  sat_comms: { bg: '#111827', bd: '#f59e0b', bgA: '#1f2a10', bdA: '#fbbf24', tx: '#fbbf24', txA: '#fde68a' },
  earth_obs: { bg: '#0a1a2a', bd: '#06b6d4', bgA: '#0a2535', bdA: '#22d3ee', tx: '#22d3ee', txA: '#67e8f9' },
  space_nav: { bg: '#1a1030', bd: '#8b5cf6', bgA: '#1e0f40', bdA: '#a78bfa', tx: '#a78bfa', txA: '#c4b5fd' },
  defense:   { bg: '#1a100a', bd: '#f97316', bgA: '#2d1c0a', bdA: '#fb923c', tx: '#fb923c', txA: '#fdba74' },
};

// SVG 레이아웃 상수
const W = 680;
const PAD = 20;
// 인프라 행
const INFRA_Y = 16;
const INFRA_H = 68;
const INFRA_BOX_W = (W - PAD * 2 - 24) / 3; // 3칸 균등

// 서비스 행
const SVC_Y = INFRA_Y + INFRA_H + 44;
const SVC_H = 68;
const SVC_BOX_W = (W - PAD * 2 - 16) / 3;

// 국방 행
const DEF_Y = SVC_Y + SVC_H + 44;
const DEF_H = 54;

const TOTAL_H = DEF_Y + DEF_H + 28;

// 인프라 3개 박스 정보
const INFRA_BOXES = [
  { id: 'materials', icon: '🔩', label: '소재·부품·엔진', sub: '탄소섬유·추진제·정밀부품', col: COLORS.materials },
  { id: 'launch',    icon: '🚀', label: '발사체·론치',    sub: '소형~중대형·재사용 로켓', col: COLORS.launch },
  { id: 'satellite', icon: '🛰️', label: '위성 제작',      sub: '버스·군집 큐브샛·플랫폼', col: COLORS.satellite },
];

// 서비스 3개 박스 정보
const SVC_BOXES = [
  { id: 'sat_comms',        icon: '📡', label: '위성통신·인터넷',    sub: 'LEO/GEO 브로드밴드',   col: COLORS.sat_comms, layerId: 'services' },
  { id: 'earth_observation',icon: '🌍', label: '지구관측·이미지',    sub: '광학·SAR 위성 이미지', col: COLORS.earth_obs, layerId: 'services' },
  { id: 'space_analytics',  icon: '🔭', label: '항법·우주 데이터',   sub: '위치정보·SSA·분석',    col: COLORS.space_nav, layerId: 'services' },
];

function SpaceChainDiagram({ activeId, onSelect }) {
  return (
    <div style={{ width: '100%', maxWidth: W }}>
      <svg
        viewBox={`0 0 ${W} ${TOTAL_H}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', width: '100%', borderRadius: 12, background: '#04080f' }}
      >
        <defs>
          <pattern id="spacegrid2" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0f172a" strokeWidth="0.5" />
          </pattern>
          <filter id="spaceglow2" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <marker id="arrowDown" markerWidth="7" markerHeight="7" refX="3.5" refY="4" orient="auto">
            <path d="M0,0 L7,0 L3.5,7 z" fill="#1e3a5f" />
          </marker>
          <marker id="arrowDown-a" markerWidth="7" markerHeight="7" refX="3.5" refY="4" orient="auto">
            <path d="M0,0 L7,0 L3.5,7 z" fill="#38bdf8" />
          </marker>
          <marker id="arrowRight" markerWidth="7" markerHeight="7" refX="4" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 z" fill="#1e3a5f" />
          </marker>
          <marker id="arrowRight-a" markerWidth="7" markerHeight="7" refX="4" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 z" fill="#38bdf8" />
          </marker>
        </defs>

        {/* 배경 그리드 */}
        <rect width={W} height={TOTAL_H} fill="url(#spacegrid2)" />

        {/* 별 배경 */}
        {[
          [50,20],[130,8],[220,32],[330,14],[440,25],[560,10],[640,40],
          [70,80],[200,65],[380,85],[520,70],[660,90],
          [30,140],[160,120],[310,155],[470,130],[630,148],
          [90,210],[240,200],[400,220],[570,205],[650,225],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.2 : 0.7}
            fill="white" opacity={0.12 + (i % 4) * 0.07} />
        ))}

        {/* ─── 섹션 라벨 ─── */}
        {/* 물리 인프라 라벨 */}
        <text x={PAD} y={INFRA_Y - 4} fontSize={8} fontWeight="700"
          fill="#4b5563" letterSpacing="1.2" style={{ pointerEvents: 'none' }}>
          물리 인프라 (업스트림 공급망)
        </text>

        {/* 서비스 계층 라벨 */}
        <text x={PAD} y={SVC_Y - 4} fontSize={8} fontWeight="700"
          fill="#4b5563" letterSpacing="1.2" style={{ pointerEvents: 'none' }}>
          서비스 계층 (위성이 만들어내는 것)
        </text>

        {/* 국방 라벨 */}
        <text x={PAD} y={DEF_Y - 4} fontSize={8} fontWeight="700"
          fill="#4b5563" letterSpacing="1.2" style={{ pointerEvents: 'none' }}>
          수평 응용처 (서비스 계층 전체를 소비)
        </text>

        {/* ─── 인프라 행 화살표 (가로) ─── */}
        {[0, 1].map(i => {
          const fromX = PAD + (i + 1) * INFRA_BOX_W + i * 12;
          const arrowY = INFRA_Y + INFRA_H / 2;
          const isActive = activeId === INFRA_BOXES[i].id || activeId === INFRA_BOXES[i + 1].id;
          return (
            <line key={`infra-arr-${i}`}
              x1={fromX} y1={arrowY} x2={fromX + 10} y2={arrowY}
              stroke={isActive ? '#38bdf8' : '#1e3a5f'}
              strokeWidth={isActive ? 2 : 1.4}
              markerEnd={isActive ? 'url(#arrowRight-a)' : 'url(#arrowRight)'}
              style={{ transition: 'stroke 0.2s' }}
            />
          );
        })}

        {/* ─── 인프라 → 서비스 연결 화살표 (세로) ─── */}
        {/* 중앙(발사체)에서 아래로 */}
        {(() => {
          const centerX = W / 2;
          const fromY = INFRA_Y + INFRA_H;
          const toY = SVC_Y;
          const midY = fromY + (toY - fromY) / 2;
          const isActive = activeId === 'launch';
          return (
            <g key="infra-svc-main">
              <line x1={centerX} y1={fromY} x2={centerX} y2={toY - 4}
                stroke={isActive ? '#38bdf8' : '#1e3a5f'}
                strokeWidth={isActive ? 2 : 1.4}
                strokeDasharray={isActive ? 'none' : '4 3'}
                markerEnd={isActive ? 'url(#arrowDown-a)' : 'url(#arrowDown)'}
                style={{ transition: 'stroke 0.2s' }}
              />
              {/* 팬아웃 분기선 */}
              {[0, 1, 2].map(si => {
                const svcCenterX = PAD + si * (SVC_BOX_W + 8) + SVC_BOX_W / 2;
                return (
                  <line key={`fan-${si}`}
                    x1={centerX} y1={midY}
                    x2={svcCenterX} y2={SVC_Y - 4}
                    stroke="#1e3a5f" strokeWidth={1}
                    strokeDasharray="3 3" opacity={0.5}
                    style={{ pointerEvents: 'none' }}
                  />
                );
              })}
            </g>
          );
        })()}

        {/* ─── 서비스 → 국방 연결 (세로 통합) ─── */}
        {(() => {
          const centerX = W / 2;
          const fromY = SVC_Y + SVC_H;
          const toY = DEF_Y;
          const isActive = ['sat_comms', 'earth_observation', 'space_analytics', 'services'].includes(activeId);
          return (
            <g key="svc-def">
              {/* 3개 서비스 박스에서 공통선으로 합류 */}
              {[0, 1, 2].map(si => {
                const svcCenterX = PAD + si * (SVC_BOX_W + 8) + SVC_BOX_W / 2;
                return (
                  <line key={`merge-${si}`}
                    x1={svcCenterX} y1={fromY}
                    x2={centerX} y2={fromY + (toY - fromY) * 0.5}
                    stroke={isActive ? '#f97316' : '#1e3a5f'}
                    strokeWidth={isActive ? 1.5 : 1}
                    strokeDasharray={isActive ? 'none' : '3 3'}
                    opacity={0.7}
                    style={{ transition: 'stroke 0.2s', pointerEvents: 'none' }}
                  />
                );
              })}
              <line x1={centerX} y1={fromY + (toY - fromY) * 0.5} x2={centerX} y2={toY - 4}
                stroke={isActive ? '#f97316' : '#1e3a5f'}
                strokeWidth={isActive ? 2 : 1.4}
                strokeDasharray={isActive ? 'none' : '4 3'}
                markerEnd={isActive ? 'url(#arrowDown-a)' : 'url(#arrowDown)'}
                style={{ transition: 'stroke 0.2s' }}
              />
            </g>
          );
        })()}

        {/* ─── 인프라 3박스 ─── */}
        {INFRA_BOXES.map((box, i) => {
          const x = PAD + i * (INFRA_BOX_W + 12);
          const isActive = activeId === box.id;
          const c = box.col;
          return (
            <g key={box.id} onClick={() => onSelect(box.id)} style={{ cursor: 'pointer' }}>
              {isActive && (
                <rect x={x - 3} y={INFRA_Y - 3} width={INFRA_BOX_W + 6} height={INFRA_H + 6}
                  rx={12} fill="none" stroke={c.bdA} strokeWidth={2} opacity={0.3}
                  filter="url(#spaceglow2)" />
              )}
              <rect x={x} y={INFRA_Y} width={INFRA_BOX_W} height={INFRA_H}
                rx={10} fill={isActive ? c.bgA : c.bg}
                stroke={isActive ? c.bdA : c.bd}
                strokeWidth={isActive ? 1.8 : 1}
                style={{ transition: 'all 0.2s' }} />
              <text x={x + 22} y={INFRA_Y + INFRA_H / 2 - 2}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={20} style={{ pointerEvents: 'none' }}>{box.icon}</text>
              <text x={x + 50} y={INFRA_Y + 24}
                fontSize={11} fontWeight="700"
                fill={isActive ? c.txA : c.tx}
                style={{ pointerEvents: 'none', transition: 'fill 0.2s' }}>{box.label}</text>
              <text x={x + 50} y={INFRA_Y + 42}
                fontSize={8.5} fill={isActive ? c.txA : c.tx} opacity={0.75}
                style={{ pointerEvents: 'none' }}>{box.sub}</text>
              {!isActive && (
                <text x={x + INFRA_BOX_W - 10} y={INFRA_Y + INFRA_H / 2 + 1}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={10} fill={c.bd} opacity={0.5}
                  style={{ pointerEvents: 'none' }}>→</text>
              )}
            </g>
          );
        })}

        {/* ─── 서비스 3박스 (병렬) ─── */}
        {SVC_BOXES.map((box, i) => {
          const x = PAD + i * (SVC_BOX_W + 8);
          const isActive = activeId === box.id || activeId === box.layerId;
          const c = box.col;
          return (
            <g key={box.id} onClick={() => onSelect(box.id)} style={{ cursor: 'pointer' }}>
              {isActive && (
                <rect x={x - 3} y={SVC_Y - 3} width={SVC_BOX_W + 6} height={SVC_H + 6}
                  rx={12} fill="none" stroke={c.bdA} strokeWidth={2} opacity={0.3}
                  filter="url(#spaceglow2)" />
              )}
              <rect x={x} y={SVC_Y} width={SVC_BOX_W} height={SVC_H}
                rx={10} fill={isActive ? c.bgA : c.bg}
                stroke={isActive ? c.bdA : c.bd}
                strokeWidth={isActive ? 1.8 : 1}
                style={{ transition: 'all 0.2s' }} />
              <text x={x + 22} y={SVC_Y + SVC_H / 2 - 2}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={20} style={{ pointerEvents: 'none' }}>{box.icon}</text>
              <text x={x + 50} y={SVC_Y + 24}
                fontSize={11} fontWeight="700"
                fill={isActive ? c.txA : c.tx}
                style={{ pointerEvents: 'none', transition: 'fill 0.2s' }}>{box.label}</text>
              <text x={x + 50} y={SVC_Y + 42}
                fontSize={8.5} fill={isActive ? c.txA : c.tx} opacity={0.75}
                style={{ pointerEvents: 'none' }}>{box.sub}</text>
            </g>
          );
        })}

        {/* ─── 국방·안보 와이드 밴드 ─── */}
        {(() => {
          const isActive = activeId === 'defense';
          const c = COLORS.defense;
          return (
            <g onClick={() => onSelect('defense')} style={{ cursor: 'pointer' }}>
              {isActive && (
                <rect x={PAD - 3} y={DEF_Y - 3} width={W - PAD * 2 + 6} height={DEF_H + 6}
                  rx={12} fill="none" stroke={c.bdA} strokeWidth={2} opacity={0.3}
                  filter="url(#spaceglow2)" />
              )}
              <rect x={PAD} y={DEF_Y} width={W - PAD * 2} height={DEF_H}
                rx={10} fill={isActive ? c.bgA : c.bg}
                stroke={isActive ? c.bdA : c.bd}
                strokeWidth={isActive ? 2 : 1.2}
                style={{ transition: 'all 0.2s' }} />
              <text x={PAD + 28} y={DEF_Y + DEF_H / 2}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={22} style={{ pointerEvents: 'none' }}>🛡️</text>
              <text x={PAD + 56} y={DEF_Y + 20}
                fontSize={12} fontWeight="800"
                fill={isActive ? c.txA : c.tx}
                style={{ pointerEvents: 'none', transition: 'fill 0.2s' }}>
                국방 / 안보 응용
              </text>
              <text x={PAD + 56} y={DEF_Y + 36}
                fontSize={8.5} fill={isActive ? c.txA : c.tx} opacity={0.75}
                style={{ pointerEvents: 'none' }}>
                군사위성 · 미사일방어 · 우주정보융합 — 서비스 계층 전체의 수평 응용처
              </text>
              {!isActive && (
                <text x={W - PAD - 14} y={DEF_Y + DEF_H / 2}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={11} fill={c.bd} opacity={0.5}
                  style={{ pointerEvents: 'none' }}>→</text>
              )}
            </g>
          );
        })()}

        {/* 하단 서명 */}
        <text x={W / 2} y={TOTAL_H - 5}
          textAnchor="middle" fontSize={7} fill="#1e3a5f" fontWeight="600" letterSpacing="1.2"
          style={{ pointerEvents: 'none' }}>
          SPACE SECTOR VALUE CHAIN  ·  물리 인프라 + 서비스 계층 + 수평 응용처
        </text>
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   사이드 패널
═══════════════════════════════════════════════════════ */
const SIDE_ITEMS = [
  { group: '물리 인프라', items: [
    { id: 'materials', icon: '🔩', label: '소재·부품·엔진', col: COLORS.materials },
    { id: 'launch',    icon: '🚀', label: '발사체·론치',    col: COLORS.launch },
    { id: 'satellite', icon: '🛰️', label: '위성 제작',      col: COLORS.satellite },
  ]},
  { group: '서비스 계층', items: [
    { id: 'sat_comms',         icon: '📡', label: '위성통신·인터넷',  col: COLORS.sat_comms },
    { id: 'earth_observation', icon: '🌍', label: '지구관측·이미지',  col: COLORS.earth_obs },
    { id: 'space_analytics',   icon: '🔭', label: '항법·우주 데이터', col: COLORS.space_nav },
  ]},
  { group: '수평 응용처', items: [
    { id: 'defense', icon: '🛡️', label: '국방·안보', col: COLORS.defense },
  ]},
];

function SpaceSidePanel({ activeId, onSelect }) {
  return (
    <div className="illust-panel">
      <div className="illust-panel-title">밸류체인 레이어</div>
      {SIDE_ITEMS.map(section => (
        <div key={section.group}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase',
            letterSpacing: '0.08em', margin: '8px 0 4px 4px' }}>
            {section.group}
          </div>
          {section.items.map(item => {
            const isActive = activeId === item.id;
            const c = item.col;
            return (
              <div key={item.id}
                className={`illust-item${isActive ? ' active' : ''}`}
                onClick={() => onSelect(item.id)}
                style={isActive ? { borderColor: c.bdA, background: c.bgA } : {}}>
                <div className="illust-item-label" style={{ color: isActive ? c.txA : undefined }}>
                  <span style={{ marginRight: 6 }}>{item.icon}</span>
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   서비스 컴포넌트 ID → SPACE_LAYERS services 레이어 매핑
   SpaceLayerMap은 filterLayerId로 레이어 id를 받으므로
   서비스 서브 컴포넌트 클릭 시 'services' 레이어로 라우팅하되
   컴포넌트 필터도 추가로 지원
═══════════════════════════════════════════════════════ */
const SVC_COMPONENT_IDS = new Set(['sat_comms', 'earth_observation', 'space_analytics']);

function resolveLayerId(activeId) {
  if (!activeId) return null;
  if (SVC_COMPONENT_IDS.has(activeId)) return 'services';
  return activeId;
}

/* ═══════════════════════════════════════════════════════
   메인 우주 대시보드
═══════════════════════════════════════════════════════ */
export default function SpaceDashboard() {
  const [activeId, setActiveId] = useState(null);
  const toggle = id => setActiveId(prev => prev === id ? null : id);

  const layerId = resolveLayerId(activeId);

  return (
    <div>
      {/* 헤더 */}
      <div style={{ marginBottom: 14 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
          🚀 우주 섹터 전체 밸류체인
        </h2>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <span style={{ color: '#a78bfa' }}>소재·부품</span>
          {' → '}
          <span style={{ color: '#38bdf8' }}>발사체</span>
          {' → '}
          <span style={{ color: '#34d399' }}>위성 제작</span>
          {' ↓ '}
          <span style={{ color: '#fbbf24' }}>위성통신</span>
          {' | '}
          <span style={{ color: '#22d3ee' }}>지구관측</span>
          {' | '}
          <span style={{ color: '#a78bfa' }}>항법·SSA</span>
          {' ↓ '}
          <span style={{ color: '#fb923c' }}>국방·안보 (수평 응용)</span>
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
          <SpaceLayerMap filterLayerId={layerId} filterComponentId={SVC_COMPONENT_IDS.has(activeId) ? activeId : null} />
        </div>
      )}
    </div>
  );
}
