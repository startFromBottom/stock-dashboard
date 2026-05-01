/**
 * RSI 값에 따른 색깔/라벨/배지 결정.
 *
 * - 30 미만: 과매도 (초록 — 매수 검토)
 * - 70 초과: 과매수 (빨강 — 차익실현 검토)
 * - 그 사이: 중립 (회색)
 * - null: 로딩중 또는 데이터 없음 (옅은 회색 "...")
 */
export function getRsiStyle(rsi) {
  if (rsi === null || rsi === undefined || isNaN(rsi)) {
    return { label: '...', color: '#64748b', badge: null };
  }
  if (rsi < 30) {
    return {
      label: rsi.toFixed(1),
      color: '#22c55e',
      badge: '과매도',
    };
  }
  if (rsi > 70) {
    return {
      label: rsi.toFixed(1),
      color: '#ef4444',
      badge: '과매수',
    };
  }
  return {
    label: rsi.toFixed(1),
    color: '#94a3b8',
    badge: null,
  };
}
