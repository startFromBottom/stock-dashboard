'use client';

import { useState, useEffect } from 'react';
import useCompanyModal from '@/hooks/useCompanyModal';
import useWatchlist from '@/hooks/useWatchlist';
import useAuth from '@/hooks/useAuth';

/**
 * 전역 회사 상세 모달.
 *
 * useCompanyModal() 의 isOpen + ticker가 채워지면 자동 fetch + 표시.
 *
 * 한 군데(Dashboard.jsx 등)에 <CompanyDetailModal /> 한 번만 마운트.
 */

// ── 포맷터 ────────────────────────────────────────────────
function fmtPrice(n, d = 2) {
  if (n === null || n === undefined || isNaN(n)) return '—';
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })}`;
}
function fmtPct(n, d = 2) {
  if (n === null || n === undefined || isNaN(n)) return '—';
  const sign = n > 0 ? '+' : '';
  return `${sign}${n.toFixed(d)}%`;
}
function fmtNum(n, d = 2) {
  if (n === null || n === undefined || isNaN(n)) return '—';
  return n.toFixed(d);
}
function fmtCap(b) {
  // b 는 billion 단위 (Finnhub의 marketCapitalization)
  if (b === null || b === undefined || isNaN(b)) return '—';
  if (b >= 1000) return `$${(b/1000).toFixed(2)}T`;
  return `$${b.toFixed(1)}B`;
}
function daysUntil(dateStr) {
  if (!dateStr) return null;
  const target = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  const diff = Math.ceil((target - now) / (1000*60*60*24));
  return diff;
}

export default function CompanyDetailModal() {
  const { isOpen, ticker, name: hintName, sector, close } = useCompanyModal();
  const { isWatched, toggle } = useWatchlist();
  const { isLoggedIn } = useAuth();

  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  // 열릴 때 fetch
  useEffect(() => {
    if (!isOpen || !ticker) return;
    let aborted = false;

    setLoading(true);
    setError(null);
    setData(null);

    fetch(`/api/company-detail?ticker=${encodeURIComponent(ticker)}`)
      .then(async (r) => {
        if (!r.ok) {
          const j = await r.json().catch(() => ({}));
          throw new Error(j.error || `HTTP ${r.status}`);
        }
        return r.json();
      })
      .then(j => { if (!aborted) setData(j); })
      .catch(e => { if (!aborted) setError(e.message); })
      .finally(() => { if (!aborted) setLoading(false); });

    return () => { aborted = true; };
  }, [isOpen, ticker]);

  // ESC로 닫기
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, close]);

  // body scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  if (!isOpen) return null;

  const profile = data?.profile;
  const quote   = data?.quote;
  const metric  = data?.metric;
  const next    = data?.nextEarnings;

  const displayName = profile?.name || hintName || ticker;
  const watched = ticker ? isWatched(ticker) : false;

  // ── 52주 위치 게이지용 ──
  const w52high = metric?.['52WeekHigh'];
  const w52low  = metric?.['52WeekLow'];
  const curPrice = quote?.price;
  const w52pct = (w52high && w52low && curPrice && w52high > w52low)
    ? ((curPrice - w52low) / (w52high - w52low)) * 100
    : null;

  // ── 다음 실적 D-day ──
  const dday = next?.date ? daysUntil(next.date) : null;

  return (
    <div
      className="cdm-overlay"
      onMouseDown={(e) => { if (e.target.classList.contains('cdm-overlay')) close(); }}
    >
      <div className="cdm-modal" role="dialog" aria-modal="true">
        {/* ── 닫기 버튼 ── */}
        <button className="cdm-close" onClick={close} aria-label="Close" title="닫기 (ESC)">×</button>

        {/* ── 로딩/에러 ── */}
        {loading && (
          <div className="cdm-loading">
            <div className="cdm-spinner">⟳</div>
            <p>{ticker} 정보 불러오는 중…</p>
          </div>
        )}

        {error && (
          <div className="cdm-error">
            <p>⚠️ 정보를 가져오지 못했습니다</p>
            <p className="cdm-error-msg">{error}</p>
            <p className="cdm-error-hint">
              — Finnhub 무료 한도 초과거나, ticker가 미국 시장에 없을 수 있어요.
            </p>
          </div>
        )}

        {/* ── 본문 ── */}
        {!loading && !error && data && (
          <>
            {/* ── 헤더 ── */}
            <div className="cdm-head">
              {profile?.logo && (
                <img src={profile.logo} alt="" className="cdm-logo"
                     onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              )}
              <div className="cdm-head-text">
                <div className="cdm-ticker-row">
                  <span className="cdm-ticker">{ticker}</span>
                  <span className="cdm-name">{displayName}</span>
                </div>
                <div className="cdm-meta">
                  {profile?.finnhubIndustry && <span>{profile.finnhubIndustry}</span>}
                  {profile?.exchange && <span>· {profile.exchange}</span>}
                  {profile?.country && <span>· {profile.country}</span>}
                  {profile?.ipo && <span>· IPO {profile.ipo}</span>}
                  {profile?.weburl && (
                    <a href={profile.weburl} target="_blank" rel="noopener noreferrer" className="cdm-web">
                      🌐 홈페이지
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* ── 가격 + 52주 게이지 ── */}
            <div className="cdm-price-row">
              <div className="cdm-price-block">
                <span className="cdm-price-val">{fmtPrice(quote?.price)}</span>
                <span className={`cdm-price-change ${quote?.changePct > 0 ? 'cdm-pos' : quote?.changePct < 0 ? 'cdm-neg' : ''}`}>
                  {fmtPct(quote?.changePct)}
                  {quote?.change !== undefined && (
                    <span className="cdm-price-abs">
                      {' '}({quote.change >= 0 ? '+' : ''}{fmtPrice(quote.change, 2)})
                    </span>
                  )}
                </span>
              </div>

              {(w52high && w52low) && (
                <div className="cdm-52w">
                  <div className="cdm-52w-label">
                    <span>52주 위치</span>
                    {w52pct !== null && <span className="cdm-52w-pct">{w52pct.toFixed(0)}%</span>}
                  </div>
                  <div className="cdm-52w-bar">
                    <div className="cdm-52w-track" />
                    {w52pct !== null && (
                      <div className="cdm-52w-marker" style={{ left: `${w52pct}%` }} />
                    )}
                  </div>
                  <div className="cdm-52w-edges">
                    <span>저 {fmtPrice(w52low)}</span>
                    <span>고 {fmtPrice(w52high)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* ── 회사 설명 ── */}
            {(profile?.marketCapitalization || profile?.shareOutstanding || profile?.employeeTotal) && (
              <div className="cdm-summary-strip">
                {profile?.marketCapitalization && (
                  <div className="cdm-summary-cell">
                    <span className="cdm-summary-label">시가총액</span>
                    <span className="cdm-summary-val">{fmtCap(profile.marketCapitalization)}</span>
                  </div>
                )}
                {profile?.shareOutstanding && (
                  <div className="cdm-summary-cell">
                    <span className="cdm-summary-label">발행주식수</span>
                    <span className="cdm-summary-val">{(profile.shareOutstanding).toFixed(0)}M</span>
                  </div>
                )}
                {profile?.employeeTotal && (
                  <div className="cdm-summary-cell">
                    <span className="cdm-summary-label">임직원</span>
                    <span className="cdm-summary-val">{profile.employeeTotal.toLocaleString()}</span>
                  </div>
                )}
              </div>
            )}

            {/* ── 메트릭 그리드: 밸류에이션 / 수익성 / 성장 / 건전성 ── */}
            <div className="cdm-grid">
              <MetricBlock
                title="📊 밸류에이션"
                rows={[
                  ['P/E (TTM)',   fmtNum(metric?.peNormalizedAnnual ?? metric?.peTTM ?? metric?.peBasicExclExtraTTM)],
                  ['P/B',         fmtNum(metric?.pbAnnual ?? metric?.pbQuarterly)],
                  ['P/S (TTM)',   fmtNum(metric?.psTTM)],
                  ['EV/EBITDA',   fmtNum(metric?.['enterpriseValueOverEBITDATTM'] ?? metric?.['currentEv/freeCashFlowTTM'])],
                  ['배당수익률',   fmtPct(metric?.dividendYieldIndicatedAnnual ?? metric?.currentDividendYieldTTM, 2)],
                ]}
              />
              <MetricBlock
                title="💰 수익성"
                rows={[
                  ['ROE (TTM)',     fmtPct(metric?.roeTTM ?? metric?.roeRfy, 1)],
                  ['ROA (TTM)',     fmtPct(metric?.roaTTM ?? metric?.roaRfy, 1)],
                  ['영업이익률',     fmtPct(metric?.operatingMarginTTM, 1)],
                  ['순이익률',       fmtPct(metric?.netProfitMarginTTM, 1)],
                  ['총이익률',       fmtPct(metric?.grossMarginTTM, 1)],
                ]}
              />
              <MetricBlock
                title="📈 성장"
                rows={[
                  ['매출 5Y CAGR',   fmtPct(metric?.revenueGrowth5Y, 1)],
                  ['매출 YoY (분기)', fmtPct(metric?.revenueGrowthQuarterlyYoy ?? metric?.revenueGrowthTTMYoy, 1)],
                  ['EPS 5Y CAGR',    fmtPct(metric?.epsGrowth5Y, 1)],
                  ['EPS YoY (분기)',  fmtPct(metric?.epsGrowthQuarterlyYoy ?? metric?.epsGrowthTTMYoy, 1)],
                  ['BPS 5Y CAGR',    fmtPct(metric?.bookValueShareGrowth5Y, 1)],
                ]}
              />
              <MetricBlock
                title="🛡️ 재무건전성"
                rows={[
                  ['부채/자기자본',  fmtNum(metric?.['totalDebt/totalEquityAnnual'] ?? metric?.['totalDebt/totalEquityQuarterly'])],
                  ['유동비율',       fmtNum(metric?.currentRatioAnnual ?? metric?.currentRatioQuarterly)],
                  ['이자보상배율',   fmtNum(metric?.['netInterestCoverageAnnual'])],
                  ['베타',           fmtNum(metric?.beta)],
                  ['일평균 거래량',   metric?.['10DayAverageTradingVolume']
                                       ? `${(metric['10DayAverageTradingVolume']).toFixed(2)}M`
                                       : '—'],
                ]}
              />
            </div>

            {/* ── 다음 실적 ── */}
            {next?.date && (
              <div className="cdm-earnings">
                <span className="cdm-earnings-icon">🗓️</span>
                <div className="cdm-earnings-text">
                  <div className="cdm-earnings-line">
                    <strong>다음 실적 발표:</strong>{' '}
                    <span className="cdm-earnings-date">{next.date}</span>
                    {dday !== null && dday >= 0 && (
                      <span className={`cdm-dday ${dday <= 7 ? 'cdm-dday-soon' : ''}`}>
                        D-{dday === 0 ? 'DAY' : dday}
                      </span>
                    )}
                    {next.hour && <span className="cdm-earnings-hour"> · {next.hour === 'bmo' ? '장 시작 전' : next.hour === 'amc' ? '장 마감 후' : next.hour}</span>}
                  </div>
                  {next.epsEstimate !== undefined && next.epsEstimate !== null && (
                    <div className="cdm-earnings-sub">
                      EPS 컨센서스 {fmtPrice(next.epsEstimate, 2)}
                      {next.revenueEstimate && (
                        <> · 매출 컨센서스 {fmtCap(next.revenueEstimate / 1e9)}</>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── 액션 버튼 ── */}
            <div className="cdm-actions">
              <button
                className={`cdm-action ${watched ? 'cdm-action-watched' : 'cdm-action-add'}`}
                onClick={() => {
                  if (!isLoggedIn) {
                    alert('워치리스트는 로그인 후에 사용할 수 있어요. 헤더에서 로그인해주세요.');
                    return;
                  }
                  toggle({
                    ticker,
                    name: displayName,
                    sector,
                    added_price: typeof quote?.price === 'number' ? quote.price : null,
                  });
                }}
              >
                {watched ? '★ 워치리스트에서 제거' : '☆ 워치리스트에 추가'}
              </button>
            </div>

            {/* ── 푸터 ── */}
            <div className="cdm-foot">
              <span>데이터: Finnhub · 캐시 30분</span>
              <span>{data.fetchedAt && new Date(data.fetchedAt).toLocaleString('ko-KR')}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── 메트릭 4개 한 블록 ── */
function MetricBlock({ title, rows }) {
  return (
    <div className="cdm-metric-block">
      <h4 className="cdm-metric-title">{title}</h4>
      <table className="cdm-metric-table">
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k}>
              <td className="cdm-metric-key">{k}</td>
              <td className="cdm-metric-val">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
