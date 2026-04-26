'use client';

import { useMemo } from 'react';
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

export default function EtfPanel({ sectorId }) {
  const etfs = SECTOR_ETFS[sectorId] ?? [];
  const tickers = useMemo(() => etfs.map(e => e.ticker), [sectorId]); // eslint-disable-line
  const { quotes,  loading,        error   } = useEtfQuotes(tickers);
  const { metrics, loading: mLoading } = useStockMetrics(tickers);

  if (!etfs.length) return null;

  return (
    <div className="etf-panel">
      {/* 헤더 */}
      <div className="etf-panel-header">
        <span className="etf-panel-title">📈 대표 ETF</span>
        <span className="etf-panel-meta">
          {loading && <span className="live-badge loading-badge">⟳ 시세 로딩…</span>}
          {error   && <span className="live-badge error-badge" title={error}>⚠ 정적 데이터</span>}
          {!loading && !error && Object.keys(quotes).length > 0 && (
            <span className="live-badge">● LIVE</span>
          )}
          <span className="etf-panel-note">Finnhub · 5분 캐시</span>
        </span>
      </div>

      {/* ETF 카드 리스트 */}
      <div className="etf-grid">
        {etfs.map(etf => {
          const q = quotes[etf.ticker];
          const pct = q?.changePct;
          const isUp     = pct > 0;
          const isDown   = pct < 0;
          const pctColor = isUp ? '#4ade80' : isDown ? '#f87171' : 'var(--text-muted)';
          const pctSign  = isUp ? '+' : '';

          const sm       = metrics[etf.ticker];
          const rsiStyle = getRsiStyle(sm?.rsi ?? null);
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
                  {mLoading ? (
                    <span className="stock-metric-value metrics-loading">…</span>
                  ) : (
                    <span className="stock-metric-value" style={{ color: rsiStyle.color }}>
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
    </div>
  );
}
