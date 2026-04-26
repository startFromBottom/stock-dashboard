'use client';

import { useMemo, useState } from 'react';
import { FLAG_BY_NAME } from '@/data/companies';
import useMarketCaps from '@/hooks/useMarketCaps';
import useStockMetrics from '@/hooks/useStockMetrics';
import { extractPublicTickers, normalizeTicker, formatMktcap } from '@/lib/ticker-utils';
import { DC_GLOSSARY_ITEMS } from '@/data/dc-glossary';

const RANK_LABELS = ['🥇 1위', '🥈 2위', '🥉 3위', '4위', '5위', '6위', '7위', '8위', '9위', '10위'];

/* ══════════════════════════════════════════════════
   RSI 유틸
══════════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════════
   HBM 스택 다이어그램 (메모리 컴포넌트 전용)
══════════════════════════════════════════════════ */
function GlossDiagramSVG({ type }) {
  if (type === 'hbm-stack') return (
    <svg viewBox="0 0 320 200" className="glos-diagram-svg">
      <text x="160" y="16" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="bold">HBM 수직 적층 구조</text>
      <rect x="80" y="158" width="160" height="22" rx="4" fill="#0c2340" stroke="#0ea5e9" strokeWidth="2"/>
      <text x="160" y="172" textAnchor="middle" fill="#38bdf8" fontSize="9">베이스 로직 다이</text>
      {[0,1,2,3].map(i => (
        <g key={i}>
          <rect x="80" y={68+i*22} width="160" height="20" rx="3" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5"/>
          <text x="160" y={80+i*22} textAnchor="middle" fill="#93c5fd" fontSize="8">D램 다이 #{4-i}</text>
          {[95,110,125,140,155,170,185,200,215].map(x => (
            <line key={x} x1={x} y1={88+i*22} x2={x} y2={90+i*22} stroke="#fbbf24" strokeWidth="1.5"/>
          ))}
        </g>
      ))}
      {[95,110,125,140,155,170,185,200,215].map(x => (
        <ellipse key={x} cx={x} cy="156" rx="5" ry="4" fill="#fbbf24" opacity="0.9"/>
      ))}
      {[110,140,180,210].map(x => (
        <line key={x} x1={x} y1="68" x2={x} y2="158" stroke="#fbbf24" strokeWidth="1" opacity="0.4" strokeDasharray="3,2"/>
      ))}
      <text x="60" y="108" fill="#fcd34d" fontSize="7" transform="rotate(-90,60,108)">TSV 관통배선</text>
      <text x="160" y="195" textAnchor="middle" fill="#64748b" fontSize="8">HBM3e: 2048bit 버스 · 최대 1.2TB/s · B200에는 192GB 탑재</text>
    </svg>
  );
  return null;
}

/* ══════════════════════════════════════════════════
   컴포넌트별 핵심 용어 인라인 섹션
══════════════════════════════════════════════════ */
function GlossaryInlineSection({ categoryId }) {
  const [open,       setOpen]       = useState(false);
  const [openTermId, setOpenTermId] = useState(null);

  const terms = DC_GLOSSARY_ITEMS.filter(g => g.category === categoryId);
  if (terms.length === 0) return null;

  return (
    <div className="glos-inline-section">
      <button
        className="glos-inline-toggle"
        onClick={() => { setOpen(v => !v); setOpenTermId(null); }}
      >
        <span className="glos-inline-toggle-left">
          <span className="glos-inline-icon">📖</span>
          <span className="glos-inline-title">핵심 용어</span>
          <span className="glos-inline-count">{terms.length}개</span>
        </span>
        <span className="glos-inline-chevron">{open ? '▲ 접기' : '▼ 펼치기'}</span>
      </button>

      {open && (
        <div className="glos-inline-list">
          {terms.map(item => (
            <div
              key={item.id}
              className={`glos-card${openTermId === item.id ? ' open' : ''}`}
              onClick={() => setOpenTermId(openTermId === item.id ? null : item.id)}
            >
              <div className="glos-card-header">
                <span className="glos-icon">{item.icon}</span>
                <div className="glos-term-wrap">
                  <span className="glos-term">{item.term}</span>
                  {item.abbr && <span className="glos-abbr">{item.abbr}</span>}
                </div>
                {item.diagram && <span className="glos-diagram-badge">📊 그림</span>}
                <span className="glos-chevron">{openTermId === item.id ? '▲' : '▼'}</span>
              </div>
              <p className="glos-short">{item.short}</p>
              {openTermId === item.id && (
                <div className="glos-body">
                  <p className="glos-detail">{item.body}</p>
                  {item.diagram && (
                    <div className="glos-diagram-wrap">
                      <GlossDiagramSVG type={item.diagram} />
                    </div>
                  )}
                  {item.relatedTickers?.length > 0 && (
                    <div className="glos-tickers">
                      <span className="glos-tickers-label">관련 기업</span>
                      {item.relatedTickers.map(t => (
                        <span key={t} className="news-ticker-badge">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CompanyPanel({ comp }) {
  if (!comp) return null;
  return <PanelInner comp={comp} />;
}

function PanelInner({ comp }) {
  const [showMore, setShowMore] = useState(false);

  // candidates 배열 사용 (없으면 companies로 폴백)
  const pool = comp.candidates ?? comp.companies ?? [];

  // ticker 목록 추출 (전체 후보풀에서)
  const tickers = useMemo(
    () => extractPublicTickers(pool),
    [comp.id] // eslint-disable-line
  );

  const { mktcaps, loading, error, fresh } = useMarketCaps(tickers);
  const { metrics: stockMetrics, loading: metricsLoading } = useStockMetrics(tickers);

  // 전체 후보풀을 시총으로 정렬
  const sortedPool = useMemo(() => {
    const withLive = pool.map(c => {
      const fmpTicker = normalizeTicker(c.ticker);
      const liveCap = fmpTicker ? mktcaps[fmpTicker] : undefined;
      return { ...c, liveCap };
    });

    if (Object.keys(mktcaps).length === 0) return withLive; // 데이터 없으면 원래 순서 유지

    // liveCap 있는 것 내림차순 → 없는 것(비상장) 뒤로
    return [...withLive].sort((a, b) => {
      if (a.liveCap && b.liveCap) return b.liveCap - a.liveCap;
      if (a.liveCap) return -1;
      if (b.liveCap) return 1;
      return a.rank - b.rank;
    });
  }, [pool, mktcaps]); // eslint-disable-line

  // Top 10 vs 나머지
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
        {fresh && (
          <div className="panel-refresh-note">{now} 기준 실시간</div>
        )}
      </div>

      {/* ── 상세 설명 ── */}
      {comp.detail?.length > 0 && (
        <div className="comp-detail-box">
          {comp.detail.map((para, i) => (
            <p key={i} className="comp-detail-para">{para}</p>
          ))}
        </div>
      )}

      {/* ── Top 10 그리드 ── */}
      <div className="companies-grid">
        {top10.map((c, idx) => {
          const flag = FLAG_BY_NAME[c.name] ?? '🌐';
          const liveMktcap = c.liveCap ? formatMktcap(c.liveCap) : null;
          const displayRank = idx + 1;

          // 거래량 + RSI
          const fmpTicker = normalizeTicker(c.ticker);
          const sm = fmpTicker ? stockMetrics[fmpTicker] : null;
          const rsiStyle = getRsiStyle(sm?.rsi ?? null);
          const volStr   = formatVolume(sm?.volume ?? null);

          return (
            <div key={`top-${c.rank}-${c.name}`} className="company-card">
              <span className={`rank-badge rank-${displayRank}`}>
                {RANK_LABELS[displayRank - 1]}
                {/* 원래 rank와 달라졌으면 변동 표시 */}
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
                    <span className="mktcap-live-dot" title="실시간 Finnhub 데이터">●</span>
                  </>
                ) : (
                  c.mktcap
                )}
              </div>

              {/* ── 거래량 + RSI 행 ── */}
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

      {/* ── 더보기 (Top 11~) ── */}
      {rest.length > 0 && (
        <div className="more-section">
          <button
            className="more-toggle-btn"
            onClick={() => setShowMore(v => !v)}
          >
            {showMore
              ? `▲ 접기`
              : `▼ 후보풀 더보기 (${rest.length}개 — 현재 Top 10 외)`}
          </button>

          {showMore && (
            <div className="more-grid">
              {rest.map((c, idx) => {
                const flag = FLAG_BY_NAME[c.name] ?? '🌐';
                const liveMktcap = c.liveCap ? formatMktcap(c.liveCap) : null;
                const displayRank = idx + 11;

                return (
                  <div key={`more-${c.rank}-${c.name}`} className="company-card more-card">
                    <span className="rank-badge rank-more">{displayRank}위</span>
                    <div className="company-name">
                      <span className="company-flag">{flag}</span>
                      {c.name}
                    </div>
                    <div className="company-ticker">{c.ticker}</div>
                    <div className="company-mktcap" style={{ color: 'var(--text-muted)' }}>
                      {liveMktcap ? (
                        <>
                          {liveMktcap}
                          <span className="mktcap-live-dot" title="실시간 데이터">●</span>
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
          )}
        </div>
      )}

      {/* ── 핵심 용어 사전 ── */}
      <GlossaryInlineSection categoryId={comp.id} />
    </div>
  );
}
