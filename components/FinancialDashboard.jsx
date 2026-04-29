'use client';

import { useState } from 'react';
import { FINANCIAL_LAYERS, FINANCIAL_FLAG_BY_NAME } from '@/data/financialCompanies';
import useMarketCaps from '@/hooks/useMarketCaps';
import { normalizeTicker, formatMktcap } from '@/lib/ticker-utils';
import StarButton from './StarButton';

const CHAIN_LAYERS = [
  { id: 'banks',            label: '대형 은행',         icon: '🏦',
    color: { bg: '#0a1820', bd: '#0ea5e9', bgA: '#0c2535', bdA: '#38bdf8', tx: '#38bdf8', txA: '#7dd3fc' },
    nodes: ['Universal Banks'] },
  { id: 'asset_management', label: '자산운용 / 증권',   icon: '💼',
    color: { bg: '#1a0820', bd: '#a855f7', bgA: '#2d0f3a', bdA: '#c084fc', tx: '#c084fc', txA: '#e9d5ff' },
    nodes: ['IB·Wealth·PE'] },
  { id: 'insurance',        label: '보험',              icon: '🛡️',
    color: { bg: '#1a1208', bd: '#92400e', bgA: '#2d1f0a', bdA: '#d97706', tx: '#d97706', txA: '#fbbf24' },
    nodes: ['P&C·Life·Health'] },
  { id: 'payments',         label: '결제 네트워크',     icon: '💳',
    color: { bg: '#1a0808', bd: '#dc2626', bgA: '#2d0f0f', bdA: '#f87171', tx: '#f87171', txA: '#fecaca' },
    nodes: ['Card·Network'] },
  { id: 'exchanges',        label: '거래소 / 인프라',   icon: '📈',
    color: { bg: '#061a12', bd: '#059669', bgA: '#0a2d1e', bdA: '#34d399', tx: '#34d399', txA: '#6ee7b7' },
    nodes: ['Exchange·Data·Rating'] },
];

const SVG_W = 680;
const LAYER_H = 72;
const LAYER_GAP = 22;
const PAD_X = 24;
const PAD_Y = 16;
const NODE_W = 200;
const NODE_H = 26;
const TOTAL_H = PAD_Y + CHAIN_LAYERS.length * (LAYER_H + LAYER_GAP) - LAYER_GAP + PAD_Y;

function FinancialChainDiagram({ activeId, onSelect }) {
  return (
    <div style={{ width: '100%', maxWidth: SVG_W }}>
      <svg viewBox={`0 0 ${SVG_W} ${TOTAL_H}`} xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', width: '100%', borderRadius: 12, background: '#0a141e' }}>
        <defs>
          <pattern id="fingrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1a2535" strokeWidth="0.4" />
          </pattern>
          <filter id="finglow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect width={SVG_W} height={TOTAL_H} fill="url(#fingrid)" />
        {CHAIN_LAYERS.map((layer, li) => {
          const y = PAD_Y + li * (LAYER_H + LAYER_GAP);
          const isActive = activeId === layer.id;
          const c = layer.color;
          const centerX = SVG_W / 2;
          return (
            <g key={layer.id} onClick={() => onSelect(layer.id)} style={{ cursor: 'pointer' }}>
              {isActive && (
                <rect x={PAD_X - 4} y={y - 4} width={SVG_W - PAD_X * 2 + 8} height={LAYER_H + 8}
                  rx={13} fill="none" stroke={c.bdA} strokeWidth={2} opacity={0.3} filter="url(#finglow)" />
              )}
              <rect x={PAD_X} y={y} width={SVG_W - PAD_X * 2} height={LAYER_H}
                rx={10} fill={isActive ? c.bgA : c.bg} stroke={isActive ? c.bdA : c.bd}
                strokeWidth={isActive ? 2 : 1.5} />
              <text x={PAD_X + 16} y={y + 24} fontSize="14" fontWeight="600" fill={isActive ? c.txA : c.tx}>
                {layer.icon} {layer.label}
              </text>
              {layer.nodes.map((node, ni) => {
                const nodeX = PAD_X + 24 + ni * (NODE_W + 12);
                const nodeY = y + 38;
                return (
                  <g key={`${layer.id}-${ni}`}>
                    <rect x={nodeX} y={nodeY} width={NODE_W} height={NODE_H} rx={5}
                      fill={c.bg} stroke={c.bd} strokeWidth={1} opacity={0.7} />
                    <text x={nodeX + NODE_W / 2} y={nodeY + NODE_H / 2 + 4}
                      textAnchor="middle" fontSize="10" fill={c.tx} fontWeight="500">
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

function FinancialSidePanel({ activeId, onSelect }) {
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
              <span style={{ marginRight: 6 }}>{layer.icon}</span>{layer.label}
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

const RANK_LABELS = ['🥇 1위', '🥈 2위', '🥉 3위', '4위', '5위', '6위', '7위', '8위', '9위', '10위'];

function FinancialCompanyPanel({ layer }) {
  const [showMore, setShowMore] = useState(false);
  const allCandidates = layer.components.flatMap(c => c.candidates);
  const tickers = allCandidates.map(c => c.ticker)
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
  const chainLayer = CHAIN_LAYERS.find(l => l.id === layer.id);

  return (
    <div className="company-panel">
      <div className="panel-header">
        <div className="panel-icon">{chainLayer?.icon ?? '💰'}</div>
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

      {layer.components.map(comp => (
        comp.detail?.length > 0 && (
          <div key={comp.id} className="comp-detail-box">
            {comp.detail.map((para, i) => (
              <p key={i} className="comp-detail-para">{para}</p>
            ))}
          </div>
        )
      ))}

      <div className="companies-grid">
        {top10.map((company, idx) => {
          const flag = FINANCIAL_FLAG_BY_NAME[company.name] ?? '🌐';
          const liveMktcap = company.liveCap ? formatMktcap(company.liveCap) : null;
          const displayRank = idx + 1;
          return (
            <div key={`top-${company.rank}-${company.name}`} className="company-card">
              <StarButton ticker={company.ticker} name={company.name} sector="financials" />
              <span className={`rank-badge rank-${displayRank}`}>
                {RANK_LABELS[displayRank - 1]}
                {fresh && displayRank !== company.rank && (
                  <span className={`rank-change ${displayRank < company.rank ? 'rank-up' : 'rank-down'}`}>
                    {displayRank < company.rank ? ` ▲${company.rank - displayRank}` : ` ▼${displayRank - company.rank}`}
                  </span>
                )}
              </span>
              <div className="company-name">
                <span className="company-flag">{flag}</span>{company.name}
              </div>
              <div className="company-ticker">{company.ticker}</div>
              <div className="company-mktcap">
                {liveMktcap ? (<>{liveMktcap}<span className="mktcap-live-dot">●</span></>) : company.mktcap}
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

      {rest.length > 0 && (
        <div className="more-section">
          <button className="more-toggle-btn" onClick={() => setShowMore(v => !v)}>
            {showMore ? `▲ 접기` : `▼ 후보풀 더보기 (${rest.length}개)`}
          </button>
          {showMore && (
            <div className="more-grid">
              {rest.map((company, idx) => {
                const flag = FINANCIAL_FLAG_BY_NAME[company.name] ?? '🌐';
                const liveMktcap = company.liveCap ? formatMktcap(company.liveCap) : null;
                return (
                  <div key={`more-${company.rank}-${company.name}`} className="company-card more-card">
                    <StarButton ticker={company.ticker} name={company.name} sector="financials" />
                    <span className="rank-badge rank-more">{idx + 11}위</span>
                    <div className="company-name">
                      <span className="company-flag">{flag}</span>{company.name}
                    </div>
                    <div className="company-ticker">{company.ticker}</div>
                    <div className="company-mktcap" style={{ color: 'var(--text-muted)' }}>
                      {liveMktcap ? (<>{liveMktcap}<span className="mktcap-live-dot">●</span></>) : company.mktcap}
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

export default function FinancialDashboard() {
  const [activeId, setActiveId] = useState(null);
  const toggle = id => setActiveId(prev => prev === id ? null : id);
  const activeLayer = FINANCIAL_LAYERS.find(l => l.id === activeId);
  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
          🏦 금융 (Financial Services) 밸류체인
        </h2>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <span style={{ color: '#38bdf8' }}>대형 은행</span>&ensp;→&ensp;
          <span style={{ color: '#c084fc' }}>자산운용/증권</span>&ensp;→&ensp;
          <span style={{ color: '#fbbf24' }}>보험</span>&ensp;→&ensp;
          <span style={{ color: '#f87171' }}>결제 네트워크</span>&ensp;→&ensp;
          <span style={{ color: '#34d399' }}>거래소·인프라</span>
        </p>
      </div>
      <div className="illust-wrap" style={{ alignItems: 'flex-start' }}>
        <div className="illust-svg" style={{ flex: '1 1 auto' }}>
          <FinancialChainDiagram activeId={activeId} onSelect={toggle} />
        </div>
        <FinancialSidePanel activeId={activeId} onSelect={toggle} />
      </div>
      {!activeId && (
        <p className="hint-text" style={{ marginTop: 20 }}>
          ↑ 레이어를 클릭하면 세부 설명과 시총 Top 10 기업이 표시됩니다
        </p>
      )}
      {activeLayer && (
        <div style={{ marginTop: 24 }}>
          <FinancialCompanyPanel layer={activeLayer} />
        </div>
      )}
    </div>
  );
}
