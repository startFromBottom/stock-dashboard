'use client';

import { useMemo } from 'react';
import { FLAG_BY_NAME } from '@/data/companies';
import useMarketCaps from '@/hooks/useMarketCaps';
import { extractPublicTickers, normalizeTicker, formatMktcap } from '@/lib/ticker-utils';

const RANK_LABELS = ['🥇 1위', '🥈 2위', '🥉 3위', '4위', '5위', '6위', '7위', '8위', '9위', '10위'];

export default function CompanyPanel({ comp }) {
  if (!comp) return null;

  // 이 컴포넌트 안에서 훅을 사용하는 내부 컴포넌트로 위임
  return <PanelInner comp={comp} />;
}

function PanelInner({ comp }) {
  // ticker 목록 추출 (메모이제이션)
  const tickers = useMemo(
    () => extractPublicTickers(comp.companies),
    [comp.id] // eslint-disable-line
  );

  const { mktcaps, loading, error, fresh } = useMarketCaps(tickers);

  // 라이브 시가총액으로 정렬 (없으면 원래 rank 유지)
  const sorted = useMemo(() => {
    const withLive = comp.companies.map(c => {
      const fmpTicker = normalizeTicker(c.ticker);
      const liveCap = fmpTicker ? mktcaps[fmpTicker] : undefined;
      return { ...c, liveCap };
    });

    if (Object.keys(mktcaps).length === 0) return withLive; // API 데이터 없으면 원래 순서

    // liveCap 있는 것 내림차순 → 없는 것(비상장) 뒤로
    return [...withLive].sort((a, b) => {
      if (a.liveCap && b.liveCap) return b.liveCap - a.liveCap;
      if (a.liveCap) return -1;
      if (b.liveCap) return 1;
      return a.rank - b.rank;
    });
  }, [comp.companies, mktcaps]); // eslint-disable-line

  const now = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="company-panel">
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
          </div>
        </div>
        {fresh && (
          <div className="panel-refresh-note">{now} 기준 실시간</div>
        )}
      </div>

      <div className="companies-grid">
        {sorted.map((c, idx) => {
          const flag = FLAG_BY_NAME[c.name] ?? '🌐';
          const liveMktcap = c.liveCap ? formatMktcap(c.liveCap) : null;
          const displayRank = idx + 1; // 정렬 후 실제 순위

          return (
            <div key={c.rank} className="company-card">
              <span className={`rank-badge rank-${displayRank}`}>
                {RANK_LABELS[displayRank - 1]}
                {/* 원래 순위와 달라졌으면 변동 표시 */}
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
              <div className="company-ticker">{c.ticker}</div>
              <div className="company-mktcap">
                {liveMktcap ? (
                  <>
                    {liveMktcap}
                    <span className="mktcap-live-dot" title="실시간 FMP 데이터">●</span>
                  </>
                ) : (
                  c.mktcap
                )}
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
    </div>
  );
}
