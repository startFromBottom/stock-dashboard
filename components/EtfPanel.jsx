'use client';

import { useMemo, useState } from 'react';
import { getRsiStyle } from '@/lib/rsi-style';
import { SECTOR_ETFS } from '@/data/etfs';
import useEtfQuotes from '@/hooks/useEtfQuotes';
import useStockMetrics from '@/hooks/useStockMetrics';

function fmt(num, digits = 2) {
  if (num === null || num === undefined) return '—';
  return num.toFixed(digits);
}
function fmtPrice(p) {
  if (!p) return '—';
  return `$${p.toFixed(2)}`;
}
function formatVolume(vol) {
  if (!vol || vol <= 0) return '—';
  if (vol >= 1_000_000_000) return `${(vol / 1_000_000_000).toFixed(2)}B`;
  if (vol >= 1_000_000)     return `${(vol / 1_000_000).toFixed(2)}M`;
  if (vol >= 1_000)         return `${(vol / 1_000).toFixed(1)}K`;
  return `${vol}`;
}

export default function EtfPanel({ sectorId }) {
  const [expanded, setExpanded] = useState(false);  // 기본 접힘
  const etfs = SECTOR_ETFS[sectorId] ?? [];
  const tickers = useMemo(() => etfs.map(e => e.ticker), [sectorId]); // eslint-disable-line
  const { quotes,  loading,        error   } = useEtfQuotes(tickers);
  const { metrics, loading: mLoading } = useStockMetrics(tickers);

  if (!etfs.length) return null;

  // 헤더 요약 — 상위 2개 ETF의 ticker + 1D 등락
  const summary = etfs.slice(0, 2).map(etf => {
    const q = quotes[etf.ticker];
    return { ticker: etf.ticker, pct: q?.changePct };
  });

  return (
    <div className={`etf-panel${expanded ? ' etf-panel-expanded' : ' etf-panel-collapsed'}`}>
      {/* 헤더 (클릭으로 토글) */}
      <button
        className="etf-panel-header etf-panel-toggle"
        onClick={() => setExpanded(v => !v)}
        type="button"
        aria-expanded={expanded}
      >
        <span className="etf-panel-title">📈 대표 ETF ({etfs.length})</span>

        {/* 헤더 요약 (접힌 상태에서 정보 노출) */}
        <span className="etf-panel-summary">
          {summary.map((s, i) => {
            const isUp = s.pct > 0;
            const isDown = s.pct < 0;
            const color = isUp ? '#4ade80' : isDown ? '#f87171' : 'var(--text-muted)';
            const sign = isUp ? '+' : '';
            return (
              <span key={s.ticker} className="etf-summary-chip">
                <span className="etf-summary-ticker">{s.ticker}</span>
                {s.pct !== undefined && s.pct !== null ? (
                  <span style={{ color }} className="etf-summary-pct">
                    {sign}{fmt(s.pct)}%
                  </span>
                ) : (
                  <span className="etf-summary-pct" style={{ color: 'var(--text-muted)' }}>—</span>
                )}
              </span>
            );
          })}
          {etfs.length > 2 && (
            <span className="etf-summary-more">+{etfs.length - 2}</span>
          )}
        </span>

        <span className="etf-panel-meta">
          {loading && <span className="live-badge loading-badge">⟳</span>}
          {error   && <span className="live-badge error-badge" title={error}>⚠</span>}
          {!loading && !error && Object.keys(quotes).length > 0 && (
            <span className="live-badge">●</span>
          )}
          <span className="etf-panel-chevron">{expanded ? '▲' : '▼'}</span>
        </span>
      </button>

      {/* ETF 카드 리스트 (펼친 상태에서만) */}
      {expanded && (
      <div className="etf-grid">
        {etfs.map(etf => {
          const q = quotes[etf.ticker];
          const pct = q?.changePct;
          const isUp     = pct > 0;
          const isDown   = pct < 0;
          const pctColor = isUp ? '#4ade80' : isDown ? '#f87171' : 'var(--text-muted)';
          const pctSign  = isUp ? '+' : '';

          const sm       = metrics[etf.ticker];
          const volStr   = formatVolume(sm?.volume ?? null);

          return (
            <a
              key={etf.ticker}
              href={etf.url}
              target="_blank"
              rel="noopener noreferrer"
              className="etf-card"
            >
              {/* 티커 + 등락 */}
              <div className="etf-card-top">
                <div className="etf-ticker-wrap">
                  <span className="etf-ticker">{etf.ticker}</span>
                  <span className="etf-issuer">{etf.issuer}</span>
                </div>
                <div className="etf-price-wrap">
                  {loading ? (
                    <span className="etf-price-loading">…</span>
                  ) : (
                    <>
                      <span className="etf-price">{fmtPrice(q?.price)}</span>
                      {pct !== undefined && pct !== null && (
                        <span className="etf-change" style={{ color: pctColor }} title="전일 종가 대비 등락률">
                          {pctSign}{fmt(pct)}% <span style={{ fontSize: 9, opacity: 0.7, fontWeight: 400 }}>전일比</span>
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* ETF 이름 */}
              <div className="etf-name">{etf.name}</div>

              {/* 포커스 태그 */}
              <span className="etf-focus-tag">{etf.focus}</span>

              {/* 거래량 + RSI */}
              <div className="stock-metrics-row">
                <div className="stock-metric-item">
                  <span className="stock-metric-label">거래량</span>
                  <span className="stock-metric-value">
                    {mLoading ? <span className="metrics-loading">…</span> : volStr}
                  </span>
                </div>
                <div className="stock-metric-item">
                  <span className="stock-metric-label">RSI(14)</span>
                  {(() => {
                    const rsiStyle = getRsiStyle(sm?.rsi ?? null);
                    return (
                      <span className="stock-metric-value rsi-value" style={{ color: rsiStyle.color }}>
                        {rsiStyle.label}
                        {rsiStyle.badge && (
                          <span className="rsi-badge" style={{ borderColor: rsiStyle.color, color: rsiStyle.color }}>
                            {rsiStyle.badge}
                          </span>
                        )}
                      </span>
                    );
                  })()}
                </div>
              </div>

              {/* 설명 */}
              <div className="etf-desc">{etf.desc}</div>

              {/* 하단 메타 */}
              <div className="etf-meta-row">
                <span className="etf-meta-item">
                  <span className="etf-meta-label">AUM</span>
                  <span className="etf-meta-value">{etf.aum}</span>
                </span>
                <span className="etf-meta-item">
                  <span className="etf-meta-label">보수율</span>
                  <span className="etf-meta-value">{etf.expense}%</span>
                </span>
                {q?.prevClose && (
                  <span className="etf-meta-item">
                    <span className="etf-meta-label">전일종가</span>
                    <span className="etf-meta-value">${fmt(q.prevClose)}</span>
                  </span>
                )}
              </div>
            </a>
          );
        })}
      </div>
      )}
    </div>
  );
}
