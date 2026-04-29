'use client';

import useMacro from '@/hooks/useMacro';

/* ── 헬퍼 ── */
function fmtPrice(v, kind) {
  if (v === null || v === undefined || isNaN(v)) return '—';
  if (kind === 'level') {
    // VIX 18.4, 10Y 4.21%, DXY 104.2
    return v.toFixed(2);
  }
  // 가격: $2,840 / $73 / $96K
  if (v >= 1000) return `$${(v / 1000).toFixed(1)}K`;
  if (v >= 100)  return `$${v.toFixed(0)}`;
  return `$${v.toFixed(2)}`;
}

function fmtChange(pct) {
  if (pct === null || pct === undefined || isNaN(pct)) return '—';
  const sign = pct > 0 ? '+' : '';
  return `${sign}${pct.toFixed(2)}%`;
}

function changeTone(pct) {
  if (pct === null || pct === undefined) return 'neutral';
  if (pct > 0.05) return 'up';
  if (pct < -0.05) return 'down';
  return 'flat';
}

/* VIX 톤: 낮으면 평온(green), 높으면 공포(red) — 등락 톤과 반대 */
function vixTone(level) {
  if (level === null || level === undefined) return 'neutral';
  if (level < 15) return 'calm';     // 평온
  if (level < 25) return 'mid';      // 보통
  if (level < 35) return 'elevated'; // 경계
  return 'panic';                    // 패닉
}

function vixLabel(level) {
  if (level === null || level === undefined) return '—';
  if (level < 15) return '평온';
  if (level < 25) return '보통';
  if (level < 35) return '경계';
  return '패닉';
}

/* Crypto F&G 색상 */
function fgTone(value) {
  if (value === null || value === undefined) return 'neutral';
  if (value < 25)  return 'extreme-fear';
  if (value < 50)  return 'fear';
  if (value < 75)  return 'greed';
  return 'extreme-greed';
}

function fgLabel(cls) {
  // alternative.me classification 한국어 매핑
  switch (cls) {
    case 'Extreme Fear':  return '극도의 공포';
    case 'Fear':          return '공포';
    case 'Neutral':       return '중립';
    case 'Greed':         return '탐욕';
    case 'Extreme Greed': return '극도의 탐욕';
    default:              return cls ?? '—';
  }
}

/* ══════════════════════════════════════════════════
   메인
══════════════════════════════════════════════════ */
export default function MarketContext() {
  const { indicators, cryptoFearGreed, loading, error, generatedAt } = useMacro();

  const updatedAt = generatedAt
    ? new Date(generatedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div className="mc-wrap">
      <div className="mc-head">
        <span className="mc-title">📊 시장 컨텍스트</span>
        <span className="mc-subtitle">거시 지표 · 시장 심리 · 안전자산 / 위험자산</span>
        <div className="mc-status">
          {loading && <span className="live-badge loading-badge">⟳ 로딩 중…</span>}
          {!loading && !error && indicators && <span className="live-badge">● LIVE</span>}
          {error && <span className="live-badge error-badge" title={error}>⚠ 오류</span>}
          {updatedAt && <span className="mc-time">업데이트 {updatedAt}</span>}
        </div>
      </div>

      <div className="mc-grid">
        {/* Crypto Fear & Greed (특수 카드) */}
        <div className={`mc-card mc-card-fg mc-fg-${fgTone(cryptoFearGreed?.value)}`}>
          <div className="mc-card-label">
            <span className="mc-icon">🐢</span>
            크립토 공포·탐욕
          </div>
          {cryptoFearGreed ? (
            <>
              <div className="mc-fg-bar">
                <div
                  className="mc-fg-track"
                  style={{ '--fg-pos': `${cryptoFearGreed.value}%` }}
                >
                  <div className="mc-fg-marker" style={{ left: `${cryptoFearGreed.value}%` }} />
                </div>
                <span className="mc-fg-value">{cryptoFearGreed.value}</span>
              </div>
              <div className="mc-card-foot">
                <span className="mc-fg-label">{fgLabel(cryptoFearGreed.classification)}</span>
                {cryptoFearGreed.change !== null && (
                  <span className={`mc-change ${changeTone(cryptoFearGreed.change)}`}>
                    {cryptoFearGreed.change > 0 ? '↑' : cryptoFearGreed.change < 0 ? '↓' : '→'}
                    {' '}{Math.abs(cryptoFearGreed.change)}
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="mc-card-loading">—</div>
          )}
        </div>

        {/* 6개 지표 */}
        {indicators && Object.entries(indicators).map(([id, ind]) => {
          const tone = changeTone(ind.changePct);
          const isVix = id === 'vix';
          const vTone = isVix ? vixTone(ind.price) : null;
          return (
            <div
              key={id}
              className={`mc-card${isVix ? ` mc-vix-${vTone}` : ''}`}
              title={ind.isFallback ? `대체 ticker: ${ind.ticker}` : ind.ticker}
            >
              <div className="mc-card-label">
                <span className="mc-icon">{ind.icon}</span>
                {ind.label}
              </div>
              <div className="mc-card-value">
                {fmtPrice(ind.price, ind.kind)}
                {isVix && (
                  <span className={`mc-vix-badge mc-vix-${vTone}`}>
                    {vixLabel(ind.price)}
                  </span>
                )}
              </div>
              <div className="mc-card-foot">
                <span className={`mc-change ${tone}`}>
                  {tone === 'up' ? '↑' : tone === 'down' ? '↓' : '→'}
                  {' '}{fmtChange(ind.changePct)}
                </span>
                {ind.isFallback && <span className="mc-sub">{ind.ticker}</span>}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mc-foot-note">
        💡 VIX는 S&P500 옵션 변동성 (낮으면 평온, 30+ 공포) ·
        10Y는 미국 10년물 국채 금리 ·
        DXY는 달러 인덱스 ·
        Gold/Oil/BTC는 안전자산·인플레이션·디지털금 헷지 ·
        크립토 F&G는 비트코인 시장 심리 (alternative.me)
      </p>
    </div>
  );
}
