'use client';

import { useMemo, useState } from 'react';
import { FINTECH_FLAG_BY_NAME } from '@/data/fintechCompanies';
import useMarketCaps from '@/hooks/useMarketCaps';
import useStockMetrics from '@/hooks/useStockMetrics';
import { extractPublicTickers, normalizeTicker, formatMktcap } from '@/lib/ticker-utils';

function getRsiStyle(rsi) {
  if (rsi === null || rsi === undefined) return { color: 'var(--text-muted)', label: '—', badge: '' };
  if (rsi >= 70) return { color: '#f87171', label: `${rsi}`, badge: '과매수' };
  if (rsi <= 30) return { color: '#60a5fa', label: `${rsi}`, badge: '과매도' };
  return { color: '#4ade80', label: `${rsi}`, badge: '중립' };
}
function formatVolume(vol) {
  if (!vol || vol <= 0) return '—';
  if (vol >= 1_000_000_000) return `${(vol / 1_000_000_000).toFixed(2)}B`;
  if (vol >= 1_000_000)     return `${(vol / 1_000_000).toFixed(2)}M`;
  if (vol >= 1_000)         return `${(vol / 1_000).toFixed(1)}K`;
  return `${vol}`;
}

const RANK_LABELS = ['🥇 1위', '🥈 2위', '🥉 3위', '4위', '5위', '6위', '7위', '8위', '9위', '10위'];

export default function FintechCompanyPanel({ comp }) {
  if (!comp) return null;
  return <PanelInner comp={comp} />;
}

function PanelInner({ comp }) {
  const [showMore, setShowMore] = useState(false);

  const pool = comp.candidates ?? comp.companies ?? [];

  const tickers = useMemo(
    () => extractPublicTickers(pool),
    [comp.id] // eslint-disable-line
  );

  const { mktcaps, loading, error, fresh } = useMarketCaps(tickers);
  const { metrics: stockMetrics, loading: metricsLoading } = useStockMetrics(tickers);

  const sortedPool = useMemo(() => {
    const withLive = pool.map(c => {
      const fmpTicker = normalizeTicker(c.ticker);
      const liveCap = fmpTicker ? mktcaps[fmpTicker] : undefined;
      return { ...c, liveCap };
    });
    if (Object.keys(mktcaps).length === 0) return withLive;
    return [...withLive].sort((a, b) => {
      if (a.liveCap && b.liveCap) return b.liveCap - a.liveCap;
      if (a.liveCap) return -1;
      if (b.liveCap) return 1;
      return a.rank - b.rank;
    });
  }, [pool, mktcaps]); // eslint-disable-line

  const top10 = sortedPool.slice(0, 10);
  const rest  = sortedPool.slice(10);

  const now = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="company-panel">
      {/* ── 패널 헤더 ── */}
      <div className="panel-header">
        <div className="panel-icon">{comp.icon}</div>
        <div style={{ flex: 1 }}>
          <div className="panel-title">{comp.name}</div>
          <div className="panel-subtitle">
            시가총액 Top 10 기업
            {fresh && <span className="live-badge">● LIVE</span>}
            {loading && <span className="live-badge loading-badge">⟳ 로딩 중…</span>}
            {error && <span className="live-badge error-badge" title={error}>⚠ 하드코딩 데이터</span>}
            {!fresh && !loading && !error && <span style={{ marginLeft: 6 }}>· 정적 데이터</span>}
            {rest.length > 0 && (
              <span className="pool-size-badge">후보풀 {pool.length}개</span>
            )}
          </div>
        </div>
        {fresh && <div className="panel-refresh-note">{now} 기준 실시간</div>}
      </div>

      {/* ── Top 10 그리드 ── */}
      <div className="companies-grid">
        {top10.map((c, idx) => {
          const flag       = FINTECH_FLAG_BY_NAME[c.name] ?? '🌐';
          const liveMktcap = c.liveCap ? formatMktcap(c.liveCap) : null;
          const displayRank = idx + 1;
          const fmpTicker  = normalizeTicker(c.ticker);
          const sm         = fmpTicker ? stockMetrics[fmpTicker] : null;
          const rsiStyle   = getRsiStyle(sm?.rsi ?? null);
          const volStr     = formatVolume(sm?.volume ?? null);

          return (
            <div key={`top-${c.rank}-${c.name}`} className="company-card">
              <span className={`rank-badge rank-${displayRank}`}>
                {RANK_LABELS[displayRank - 1] ?? `${displayRank}위`}
                {fresh && displayRank !== c.rank && (
                  <span className={`rank-change ${displayRank < c.rank ? 'rank-up' : 'rank-down'}`}>
                    {displayRank < c.rank ? ` ▲${c.rank - displayRank}` : ` ▼${displayRank - c.rank}`}
                  </span>
                )}
              </span>
              <div className="company-name">
                <span className="company-flag">{flag}</span>
                {c.name}
              </div>
              <div className="company-ticker">
                {c.ticker === 'Private'
                  ? <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>비상장</span>
                  : c.ticker}
              </div>
              <div className="company-mktcap">
                {liveMktcap ? (
                  <>{liveMktcap}<span className="mktcap-live-dot" title="실시간 데이터">●</span></>
                ) : c.mktcap}
              </div>
              <div className="stock-metrics-row">
                <div className="stock-metric-item">
                  <span className="stock-metric-label">거래량</span>
                  <span className="stock-metric-value">
                    {metricsLoading ? <span className="metrics-loading">…</span> : volStr}
                  </span>
                </div>
                <div className="stock-metric-item">
                  <span className="stock-metric-label">RSI(14)</span>
                  {metricsLoading ? (
                    <span className="stock-metric-value metrics-loading">…</span>
                  ) : (
                    <span className="stock-metric-value rsi-value" style={{ color: rsiStyle.color }}>
                      {rsiStyle.label}
                      {rsiStyle.badge && (
                        <span className="rsi-badge" style={{ borderColor: rsiStyle.color, color: rsiStyle.color }}>
                          {rsiStyle.badge}
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </div>
              <div className="company-detail">{c.detail}</div>
              <div className="company-links">
                <a href={c.ir}   target="_blank" rel="noopener noreferrer" className="link-btn">📊 IR</a>
                <a href={c.news} target="_blank" rel="noopener noreferrer" className="link-btn">📰 뉴스</a>
                <a href={c.x}    target="_blank" rel="noopener noreferrer" className="link-btn">𝕏 X</a>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 더보기 (11위~) ── */}
      {rest.length > 0 && (
        <div className="more-section">
          <button
            className="more-toggle-btn"
            onClick={() => setShowMore(v => !v)}
          >
            {showMore
              ? '▲ 접기'
              : `▼ 후보풀 더보기 (${rest.length}개 — 현재 Top 10 외)`}
          </button>
          {showMore && (
            <div className="more-grid">
              {rest.map((c, idx) => {
                const flag       = FINTECH_FLAG_BY_NAME[c.name] ?? '🌐';
                const liveMktcap = c.liveCap ? formatMktcap(c.liveCap) : null;
                const displayRank = top10.length + idx + 1;
                return (
                  <div key={`more-${c.rank}-${c.name}`} className="company-card more-card">
                    <span className="rank-badge rank-more">{displayRank}위</span>
                    <div className="company-name">
                      <span className="company-flag">{flag}</span>
                      {c.name}
                    </div>
                    <div className="company-ticker">
                      {c.ticker === 'Private'
                        ? <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>비상장</span>
                        : c.ticker}
                    </div>
                    <div className="company-mktcap" style={{ color: 'var(--text-muted)' }}>
                      {liveMktcap ? (
                        <>{liveMktcap}<span className="mktcap-live-dot" title="실시간 데이터">●</span></>
                      ) : c.mktcap}
                    </div>
                    <div className="company-detail">{c.detail}</div>
                    <div className="company-links">
                      <a href={c.ir}   target="_blank" rel="noopener noreferrer" className="link-btn">📊 IR</a>
                      <a href={c.news} target="_blank" rel="noopener noreferrer" className="link-btn">📰 뉴스</a>
                      <a href={c.x}    target="_blank" rel="noopener noreferrer" className="link-btn">𝕏 X</a>
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
