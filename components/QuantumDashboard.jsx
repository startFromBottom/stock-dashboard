'use client';

import { useState } from 'react';
import { QUANTUM_LAYERS, QUANTUM_FLAG_BY_NAME } from '@/data/quantumCompanies';
import useMarketCaps from '@/hooks/useMarketCaps';
import { extractPublicTickers, normalizeTicker, formatMktcap } from '@/lib/ticker-utils';

/* ═══════════════════════════════════════════════════════
   양자컴퓨터 밸류체인 SVG 다이어그램 (5개 레이어 수직)
═══════════════════════════════════════════════════════ */

const CHAIN_LAYERS = [
  {
    id: 'quantum_chip',
    label: '양자칩 & 게이트 기술',
    icon: '⚛️',
    color: { bg: '#0a0a1a', bd: '#7c3aed', bgA: '#1a0f3a', bdA: '#a78bfa', tx: '#a78bfa', txA: '#ddd6fe' },
    nodes: ['초전도 큐비트', '이온 트랩', '포토닉 / NV센터'],
  },
  {
    id: 'qubit_validation',
    label: '큐비트 검증 & 제어',
    icon: '🔬',
    color: { bg: '#0a1a15', bd: '#0d9488', bgA: '#081f1a', bdA: '#2dd4bf', tx: '#2dd4bf', txA: '#99f6e4' },
    nodes: ['오류 정정', '신호 처리', '큐비트 보정'],
  },
  {
    id: 'software',
    label: '소프트웨어 & 알고리즘',
    icon: '💻',
    color: { bg: '#0a1420', bd: '#0ea5e9', bgA: '#081e2b', bdA: '#38bdf8', tx: '#38bdf8', txA: '#7dd3fc' },
    nodes: ['양자 컴파일러', '알고리즘 설계', '시뮬레이터'],
  },
  {
    id: 'application_sw',
    label: '응용 소프트웨어',
    icon: '🎯',
    color: { bg: '#1a0a0a', bd: '#ef4444', bgA: '#2d0f0f', bdA: '#f87171', tx: '#f87171', txA: '#fecaca' },
    nodes: ['약물 설계', '최적화 문제', '금융 모델링'],
  },
  {
    id: 'industry_apps',
    label: '산업별 응용',
    icon: '🏭',
    color: { bg: '#1a1205', bd: '#b45309', bgA: '#2d1f08', bdA: '#f59e0b', tx: '#f59e0b', txA: '#fde68a' },
    nodes: ['제약 & 생명과학', '화학·재료', '금융·최적화'],
  },
];

const SVG_W = 680;
const LAYER_H = 72;
const LAYER_GAP = 22;
const PAD_X = 24;
const PAD_Y = 16;
const NODE_W = 118;
const NODE_H = 26;
const TOTAL_H = PAD_Y + CHAIN_LAYERS.length * (LAYER_H + LAYER_GAP) - LAYER_GAP + PAD_Y;

/* ── 양자 입자 장식 ── */
function QuantumDecor({ x, yStart, height, color }) {
  const steps = Math.floor(height / 14);
  const elements = [];
  for (let i = 0; i < steps; i++) {
    const y = yStart + i * 14 + 7;
    const phase = (i / steps) * Math.PI * 2;
    const ox = Math.sin(phase) * 6;
    elements.push(
      <circle key={`q${i}`} cx={x + ox} cy={y} r={1.2}
        fill={color} opacity={0.35} />,
      <circle key={`qo${i}`} cx={x + ox} cy={y} r={3}
        fill="none" stroke={color} strokeWidth={0.6} opacity={0.15} />,
    );
  }
  return <>{elements}</>;
}

function QuantumChainDiagram({ activeId, onSelect }) {
  return (
    <div style={{ width: '100%', maxWidth: SVG_W }}>
      <svg
        viewBox={`0 0 ${SVG_W} ${TOTAL_H}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', width: '100%', borderRadius: 12, background: '#0a0a0f' }}
      >
        <defs>
          <pattern id="quantumgrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="0.5" fill="#4f46e5" opacity="0.15" />
          </pattern>
          <filter id="quantumglow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Background */}
        <rect width={SVG_W} height={TOTAL_H} fill="#0a0a0f" />
        <rect width={SVG_W} height={TOTAL_H} fill="url(#quantumgrid)" />

        {/* 세로 연결선 & 흐름 */}
        {CHAIN_LAYERS.map((layer, idx) => {
          const y = PAD_Y + idx * (LAYER_H + LAYER_GAP);
          if (idx < CHAIN_LAYERS.length - 1) {
            const nextY = y + LAYER_H + LAYER_GAP;
            const isActive = activeId === layer.id || activeId === CHAIN_LAYERS[idx + 1]?.id;
            return (
              <g key={`flow${idx}`}>
                <line
                  x1={SVG_W / 2} y1={y + LAYER_H}
                  x2={SVG_W / 2} y2={nextY}
                  stroke={isActive ? '#a78bfa' : '#4f46e5'}
                  strokeWidth={isActive ? 2 : 1}
                  strokeDasharray={isActive ? 'none' : '3,3'}
                  opacity={isActive ? 0.8 : 0.4}
                />
                <polygon
                  points={`${SVG_W / 2},${nextY - 4} ${SVG_W / 2 - 3},${nextY - 8} ${SVG_W / 2 + 3},${nextY - 8}`}
                  fill={isActive ? '#a78bfa' : '#4f46e5'}
                  opacity={isActive ? 0.8 : 0.5}
                />
              </g>
            );
          }
          return null;
        })}

        {/* Layers */}
        {CHAIN_LAYERS.map((layer, idx) => {
          const y = PAD_Y + idx * (LAYER_H + LAYER_GAP);
          const isActive = activeId === layer.id;
          const c = layer.color;

          return (
            <g key={layer.id} onClick={() => onSelect(layer.id)} style={{ cursor: 'pointer' }}>
              {/* 글로우 */}
              {isActive && (
                <rect x={PAD_X - 4} y={y - 4} width={SVG_W - PAD_X * 2 + 8} height={LAYER_H + 8}
                  rx={13} fill="none" stroke={c.bdA} strokeWidth={2} opacity={0.3}
                  filter="url(#quantumglow)" />
              )}

              {/* 레이어 배경 */}
              <rect
                x={PAD_X} y={y}
                width={SVG_W - 2 * PAD_X} height={LAYER_H}
                fill={isActive ? c.bgA : c.bg}
                stroke={isActive ? c.bdA : c.bd}
                strokeWidth={isActive ? 1.8 : 1}
                rx={10}
                opacity={isActive ? 1 : 0.7}
              />

              {/* 좌측 장식 */}
              <QuantumDecor
                x={PAD_X + 8}
                yStart={y}
                height={LAYER_H}
                color={isActive ? c.bdA : c.bd}
              />

              {/* 아이콘 */}
              <text x={PAD_X + 28} y={y + LAYER_H / 2 + 1}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={22} style={{ pointerEvents: 'none' }}>
                {layer.icon}
              </text>

              {/* 레이블 */}
              <text
                x={PAD_X + 54} y={y + 26}
                fontSize={12.5} fontWeight="700"
                fill={isActive ? c.txA : c.tx}
                style={{ pointerEvents: 'none' }}>
                {layer.label}
              </text>

              {/* 노드들 */}
              {layer.nodes.map((node, nodeIdx) => {
                const nodeX = PAD_X + 54 + nodeIdx * (NODE_W + 7);
                const nodeY = y + LAYER_H - NODE_H - 8;
                return (
                  <g key={`${layer.id}-${nodeIdx}`} style={{ pointerEvents: 'none' }}>
                    <rect
                      x={nodeX} y={nodeY}
                      width={NODE_W} height={NODE_H}
                      fill={isActive ? `${c.bdA}22` : `${c.bd}18`}
                      stroke={isActive ? `${c.bdA}88` : `${c.bd}44`}
                      strokeWidth={0.8}
                      rx={4}
                    />
                    <text
                      x={nodeX + NODE_W / 2} y={nodeY + NODE_H / 2}
                      fontSize={9} fontWeight="600"
                      textAnchor="middle" dominantBaseline="middle"
                      fill={isActive ? c.txA : c.tx} opacity={0.9}>
                      {node}
                    </text>
                  </g>
                );
              })}

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

        <text x={SVG_W / 2} y={TOTAL_H - 5}
          textAnchor="middle" fontSize={7.5} fill="#1e1e3f" fontWeight="600" letterSpacing="1.4"
          style={{ pointerEvents: 'none' }}>
          QUANTUM COMPUTING VALUE CHAIN  ·  5 LAYERS
        </text>
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   사이드 패널
═══════════════════════════════════════════════════════ */
function QuantumSidePanel({ activeId, onSelect }) {
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
   기업 카드 패널 (바이오텍과 동일한 구조)
═══════════════════════════════════════════════════════ */
const RANK_LABELS = ['🥇 1위', '🥈 2위', '🥉 3위', '4위', '5위', '6위', '7위', '8위', '9위', '10위'];

function QuantumCompanyPanel({ layer }) {
  const [showMore, setShowMore] = useState(false);

  const allCandidates = layer.components.flatMap(c => c.candidates);

  const tickers = allCandidates
    .map(c => c.ticker)
    .filter(t => t && t !== 'Private' && t !== 'Academic' && t !== 'Government' && !t.startsWith('~'));

  const { mktcaps, loading, error, fresh } = useMarketCaps(tickers);

  const sortedPool = allCandidates.map(c => {
    const fmpTicker = normalizeTicker(c.ticker);
    const liveCap = fmpTicker ? mktcaps?.[fmpTicker] : undefined;
    return { ...c, liveCap };
  }).sort((a, b) => {
    if (a.liveCap && b.liveCap) return b.liveCap - a.liveCap;
    if (a.liveCap) return -1;
    if (b.liveCap) return 1;
    return a.rank - b.rank;
  });

  const top10 = sortedPool.slice(0, 10);
  const rest  = sortedPool.slice(10);
  const now = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

  const chainLayer = CHAIN_LAYERS.find(l => l.id === layer.id);
  const c = chainLayer?.color;

  return (
    <div className="company-panel">
      {/* 헤더 */}
      <div className="panel-header">
        <div className="panel-icon">{chainLayer?.icon ?? '⚛️'}</div>
        <div style={{ flex: 1 }}>
          <div className="panel-title">{layer.layer}</div>
          <div className="panel-subtitle">
            시가총액 Top 10 기업
            {fresh && <span className="live-badge">● LIVE</span>}
            {loading && <span className="live-badge loading-badge">⟳ 로딩 중…</span>}
            {error && <span className="live-badge error-badge" title={error}>⚠ 하드코딩 데이터</span>}
            {!fresh && !loading && !error && <span style={{ marginLeft: 6 }}>· 정적 데이터</span>}
            {rest.length > 0 && (
              <span className="pool-size-badge">후보풀 {allCandidates.length}개</span>
            )}
          </div>
        </div>
        {fresh && <div className="panel-refresh-note">{now} 기준 실시간</div>}
      </div>

      {/* 컴포넌트 설명 */}
      {layer.components.map(comp => (
        comp.detail?.length > 0 && (
          <div key={comp.id} className="comp-detail-box">
            {comp.detail.map((para, i) => (
              <p key={i} className="comp-detail-para">{para}</p>
            ))}
          </div>
        )
      ))}

      {/* Top 10 그리드 */}
      <div className="companies-grid">
        {top10.map((company, idx) => {
          const flag = QUANTUM_FLAG_BY_NAME[company.name] ?? '🌐';
          const liveMktcap = company.liveCap ? formatMktcap(company.liveCap) : null;
          const displayRank = idx + 1;
          return (
            <div key={`top-${company.rank}-${company.name}`} className="company-card">
              <span className={`rank-badge rank-${displayRank}`}>
                {RANK_LABELS[displayRank - 1]}
                {fresh && displayRank !== company.rank && (
                  <span className={`rank-change ${displayRank < company.rank ? 'rank-up' : 'rank-down'}`}>
                    {displayRank < company.rank ? ` ▲${company.rank - displayRank}` : ` ▼${displayRank - company.rank}`}
                  </span>
                )}
              </span>
              <div className="company-name">
                <span className="company-flag">{flag}</span>
                {company.name}
              </div>
              <div className="company-ticker">{company.ticker}</div>
              <div className="company-mktcap">
                {liveMktcap ? (
                  <>{liveMktcap}<span className="mktcap-live-dot" title="실시간 데이터">●</span></>
                ) : (
                  company.mktcap
                )}
              </div>
              <div className="company-detail">{company.detail}</div>
              <div className="company-links">
                <a href={company.ir}   target="_blank" rel="noopener noreferrer" className="link-btn">📊 IR</a>
                <a href={company.news} target="_blank" rel="noopener noreferrer" className="link-btn">📰 뉴스</a>
                <a href={company.x}    target="_blank" rel="noopener noreferrer" className="link-btn">𝕏 X</a>
              </div>
            </div>
          );
        })}
      </div>

      {/* 더보기 */}
      {rest.length > 0 && (
        <div className="more-section">
          <button className="more-toggle-btn" onClick={() => setShowMore(v => !v)}>
            {showMore ? `▲ 접기` : `▼ 후보풀 더보기 (${rest.length}개)`}
          </button>
          {showMore && (
            <div className="more-grid">
              {rest.map((company, idx) => {
                const flag = QUANTUM_FLAG_BY_NAME[company.name] ?? '🌐';
                const liveMktcap = company.liveCap ? formatMktcap(company.liveCap) : null;
                return (
                  <div key={`more-${company.rank}-${company.name}`} className="company-card more-card">
                    <span className="rank-badge rank-more">{idx + 11}위</span>
                    <div className="company-name">
                      <span className="company-flag">{flag}</span>
                      {company.name}
                    </div>
                    <div className="company-ticker">{company.ticker}</div>
                    <div className="company-mktcap" style={{ color: 'var(--text-muted)' }}>
                      {liveMktcap ? (
                        <>{liveMktcap}<span className="mktcap-live-dot">●</span></>
                      ) : (
                        company.mktcap
                      )}
                    </div>
                    <div className="company-detail">{company.detail}</div>
                    <div className="company-links">
                      <a href={company.ir}   target="_blank" rel="noopener noreferrer" className="link-btn">📊 IR</a>
                      <a href={company.news} target="_blank" rel="noopener noreferrer" className="link-btn">📰 뉴스</a>
                      <a href={company.x}    target="_blank" rel="noopener noreferrer" className="link-btn">𝕏 X</a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   메인 양자컴퓨터 대시보드
═══════════════════════════════════════════════════════ */
export default function QuantumDashboard() {
  const [activeId, setActiveId] = useState(null);
  const toggle = id => setActiveId(prev => prev === id ? null : id);

  const activeLayer = QUANTUM_LAYERS.find(l => l.id === activeId);

  return (
    <div>
      {/* 헤더 */}
      <div style={{ marginBottom: 14 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
          ⚛️ 양자컴퓨터 밸류체인
        </h2>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <span style={{ color: '#a78bfa' }}>양자칩 & 게이트</span>
          &ensp;→&ensp;
          <span style={{ color: '#2dd4bf' }}>큐비트 검증 & 제어</span>
          &ensp;→&ensp;
          <span style={{ color: '#38bdf8' }}>소프트웨어 & 알고리즘</span>
          &ensp;→&ensp;
          <span style={{ color: '#f87171' }}>응용 소프트웨어</span>
          &ensp;→&ensp;
          <span style={{ color: '#f59e0b' }}>산업별 응용</span>
        </p>
      </div>

      {/* 다이어그램 + 사이드 패널 */}
      <div className="illust-wrap" style={{ alignItems: 'flex-start' }}>
        <div className="illust-svg" style={{ flex: '1 1 auto' }}>
          <QuantumChainDiagram activeId={activeId} onSelect={toggle} />
        </div>
        <QuantumSidePanel activeId={activeId} onSelect={toggle} />
      </div>

      {!activeId && (
        <p className="hint-text" style={{ marginTop: 20 }}>
          ↑ 레이어를 클릭하면 세부 설명과 시총 Top 10 기업이 표시됩니다
        </p>
      )}

      {/* 선택된 레이어 기업 패널 */}
      {activeLayer && (
        <div style={{ marginTop: 24 }}>
          <QuantumCompanyPanel layer={activeLayer} />
        </div>
      )}
    </div>
  );
}
