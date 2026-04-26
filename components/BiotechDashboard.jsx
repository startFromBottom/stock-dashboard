'use client';

import { useState } from 'react';
import { BIOTECH_LAYERS, BIOTECH_FLAG_BY_NAME } from '@/data/biotechCompanies';
import useMarketCaps from '@/hooks/useMarketCaps';
import { extractPublicTickers, normalizeTicker, formatMktcap } from '@/lib/ticker-utils';

/* ═══════════════════════════════════════════════════════
   바이오텍 밸류체인 SVG 다이어그램 (7개 레이어 수직)
═══════════════════════════════════════════════════════ */

const CHAIN_LAYERS = [
  {
    id: 'ai_platform',
    label: 'AI 신약설계 플랫폼',
    icon: '🤖',
    color: { bg: '#0a1020', bd: '#6366f1', bgA: '#161a3a', bdA: '#818cf8', tx: '#818cf8', txA: '#c7d2fe' },
    nodes: ['분자 생성 AI', '단백질 구조 예측', '가상 스크리닝'],
  },
  {
    id: 'genomics',
    label: '유전체 / 데이터 인프라',
    icon: '🧬',
    color: { bg: '#061a12', bd: '#059669', bgA: '#0a2d1e', bdA: '#34d399', tx: '#34d399', txA: '#6ee7b7' },
    nodes: ['NGS 시퀀싱', '단세포 분석', '액체 생검'],
  },
  {
    id: 'modality',
    label: '치료 모달리티',
    icon: '💊',
    color: { bg: '#1a0820', bd: '#9333ea', bgA: '#280d38', bdA: '#c084fc', tx: '#c084fc', txA: '#e9d5ff' },
    nodes: ['유전자·세포치료', '항체·ADC', 'GLP-1·펩타이드'],
  },
  {
    id: 'cro',
    label: '임상시험 수탁(CRO)',
    icon: '🏥',
    color: { bg: '#0a1820', bd: '#0ea5e9', bgA: '#0c2535', bdA: '#38bdf8', tx: '#38bdf8', txA: '#7dd3fc' },
    nodes: ['전임상 독성', '임상 운영', 'AI 환자 선별'],
  },
  {
    id: 'cdmo',
    label: '바이오의약품 제조(CDMO)',
    icon: '🏭',
    color: { bg: '#1a1205', bd: '#b45309', bgA: '#2d1f08', bdA: '#f59e0b', tx: '#f59e0b', txA: '#fde68a' },
    nodes: ['항체 대규모 생산', 'mRNA / LNP', '세포·유전자 제조'],
  },
  {
    id: 'bigpharma',
    label: '빅파마 / 대형 바이오텍',
    icon: '💰',
    color: { bg: '#1a0808', bd: '#dc2626', bgA: '#2d0f0f', bdA: '#f87171', tx: '#f87171', txA: '#fecaca' },
    nodes: ['GLP-1 비만·당뇨', '항암 면역치료', 'AI 신약 파이프라인'],
  },
  {
    id: 'diagnostics',
    label: '진단·의료기기 / 디지털헬스',
    icon: '🩺',
    color: { bg: '#001a18', bd: '#0d9488', bgA: '#002826', bdA: '#2dd4bf', tx: '#2dd4bf', txA: '#99f6e4' },
    nodes: ['수술 로봇', 'AI 영상진단', 'CGM·웨어러블'],
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

/* ── DNA 이중나선 장식 ── */
function DnaDecor({ x, yStart, height, color }) {
  const steps = Math.floor(height / 14);
  const elements = [];
  for (let i = 0; i < steps; i++) {
    const y = yStart + i * 14 + 7;
    const phase = (i / steps) * Math.PI * 2;
    const ox = Math.sin(phase) * 6;
    elements.push(
      <line key={`l${i}`} x1={x - 6} y1={y} x2={x + 6} y2={y}
        stroke={color} strokeWidth={0.8} opacity={0.25} />,
      <circle key={`c${i}`} cx={x + ox} cy={y} r={1.2}
        fill={color} opacity={0.35} />,
    );
  }
  return <>{elements}</>;
}

function BiotechChainDiagram({ activeId, onSelect }) {
  return (
    <div style={{ width: '100%', maxWidth: SVG_W }}>
      <svg
        viewBox={`0 0 ${SVG_W} ${TOTAL_H}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', width: '100%', borderRadius: 12, background: '#020b0a' }}
      >
        <defs>
          <pattern id="biogrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0a1f18" strokeWidth="0.4" />
          </pattern>
          <filter id="bioglow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <marker id="bioarrow" markerWidth="7" markerHeight="7" refX="4" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 z" fill="#0f2a22" />
          </marker>
          <marker id="bioarrow-a" markerWidth="7" markerHeight="7" refX="4" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 z" fill="#34d399" />
          </marker>
        </defs>

        <rect width={SVG_W} height={TOTAL_H} fill="url(#biogrid)" />

        {/* DNA 나선 장식 (좌우) */}
        <DnaDecor x={12} yStart={PAD_Y} height={TOTAL_H - PAD_Y * 2} color="#059669" />
        <DnaDecor x={SVG_W - 12} yStart={PAD_Y} height={TOTAL_H - PAD_Y * 2} color="#059669" />

        {CHAIN_LAYERS.map((layer, li) => {
          const y = PAD_Y + li * (LAYER_H + LAYER_GAP);
          const isActive = activeId === layer.id;
          const c = layer.color;
          const centerX = SVG_W / 2;

          return (
            <g key={layer.id} onClick={() => onSelect(layer.id)} style={{ cursor: 'pointer' }}>
              {/* 연결선 */}
              {li > 0 && (
                <line
                  x1={centerX} y1={y - LAYER_GAP}
                  x2={centerX} y2={y}
                  stroke={isActive || activeId === CHAIN_LAYERS[li - 1].id ? '#34d399' : '#0f2a22'}
                  strokeWidth={isActive ? 2 : 1.4}
                  strokeDasharray={isActive ? 'none' : '4 3'}
                  markerEnd={isActive ? 'url(#bioarrow-a)' : 'url(#bioarrow)'}
                  style={{ transition: 'stroke 0.2s' }}
                />
              )}

              {/* 글로우 */}
              {isActive && (
                <rect x={PAD_X - 4} y={y - 4} width={SVG_W - PAD_X * 2 + 8} height={LAYER_H + 8}
                  rx={13} fill="none" stroke={c.bdA} strokeWidth={2} opacity={0.3}
                  filter="url(#bioglow)" />
              )}

              {/* 메인 배경 */}
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
                fontSize={12.5} fontWeight="700"
                fill={isActive ? c.txA : c.tx}
                style={{ pointerEvents: 'none', transition: 'fill 0.2s' }}>
                {layer.label}
              </text>

              {/* 노드 태그 */}
              {layer.nodes.map((node, ni) => {
                const nodeX = PAD_X + 56 + ni * (NODE_W + 7);
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
          textAnchor="middle" fontSize={7.5} fill="#0f2a22" fontWeight="600" letterSpacing="1.4"
          style={{ pointerEvents: 'none' }}>
          BIOTECH · AI DRUG DISCOVERY VALUE CHAIN  ·  7 LAYERS
        </text>
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   사이드 패널
═══════════════════════════════════════════════════════ */
function BiotechSidePanel({ activeId, onSelect }) {
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
   기업 카드 패널 (선택된 레이어의 CompanyPanel)
═══════════════════════════════════════════════════════ */
const RANK_LABELS = ['🥇 1위', '🥈 2위', '🥉 3위', '4위', '5위', '6위', '7위', '8위', '9위', '10위'];

function BiotechCompanyPanel({ layer }) {
  const [showMore, setShowMore] = useState(false);

  // 해당 레이어의 모든 컴포넌트 합산
  const allCandidates = layer.components.flatMap(c => c.candidates);

  const tickers = allCandidates
    .map(c => c.ticker)
    .filter(t => t && t !== 'Private' && !t.startsWith('~'));

  const { mktcaps, loading, error, fresh } = useMarketCaps(tickers);

  const sortedPool = allCandidates.map(c => {
    const fmpTicker = normalizeTicker(c.ticker);
    const liveCap = fmpTicker ? mktcaps[fmpTicker] : undefined;
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

  // 레이어 색상 가져오기
  const chainLayer = CHAIN_LAYERS.find(l => l.id === layer.id);
  const c = chainLayer?.color;

  return (
    <div className="company-panel">
      {/* 헤더 */}
      <div className="panel-header">
        <div className="panel-icon">{chainLayer?.icon ?? '💊'}</div>
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
          const flag = BIOTECH_FLAG_BY_NAME[company.name] ?? '🌐';
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
                const flag = BIOTECH_FLAG_BY_NAME[company.name] ?? '🌐';
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
   메인 바이오텍 대시보드
═══════════════════════════════════════════════════════ */
export default function BiotechDashboard() {
  const [activeId, setActiveId] = useState(null);
  const toggle = id => setActiveId(prev => prev === id ? null : id);

  const activeLayer = BIOTECH_LAYERS.find(l => l.id === activeId);

  return (
    <div>
      {/* 헤더 */}
      <div style={{ marginBottom: 14 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
          🧬 바이오테크 · AI 신약개발 밸류체인
        </h2>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <span style={{ color: '#818cf8' }}>AI 플랫폼</span>
          &ensp;→&ensp;
          <span style={{ color: '#34d399' }}>유전체·데이터</span>
          &ensp;→&ensp;
          <span style={{ color: '#c084fc' }}>치료 모달리티</span>
          &ensp;→&ensp;
          <span style={{ color: '#38bdf8' }}>CRO</span>
          &ensp;→&ensp;
          <span style={{ color: '#f59e0b' }}>CDMO</span>
          &ensp;→&ensp;
          <span style={{ color: '#f87171' }}>빅파마</span>
          &ensp;→&ensp;
          <span style={{ color: '#2dd4bf' }}>진단·의료기기</span>
        </p>
      </div>

      {/* 다이어그램 + 사이드 패널 */}
      <div className="illust-wrap" style={{ alignItems: 'flex-start' }}>
        <div className="illust-svg" style={{ flex: '1 1 auto' }}>
          <BiotechChainDiagram activeId={activeId} onSelect={toggle} />
        </div>
        <BiotechSidePanel activeId={activeId} onSelect={toggle} />
      </div>

      {!activeId && (
        <p className="hint-text" style={{ marginTop: 20 }}>
          ↑ 레이어를 클릭하면 세부 설명과 시총 Top 10 기업이 표시됩니다
        </p>
      )}

      {/* 선택된 레이어 기업 패널 */}
      {activeLayer && (
        <div style={{ marginTop: 24 }}>
          <BiotechCompanyPanel layer={activeLayer} />
        </div>
      )}
    </div>
  );
}
