/**
 * Finnhub /stock/metric?metric=all 응답에서 같은 의미의 메트릭이
 * 종목마다 다른 키에 들어있는 경우가 많음.
 *
 * 예: NVDA는 peNormalizedAnnual에 들어있는데 ABT는 peTTM에만 있고,
 * 비미국 ADR(TSM 등)은 peBasicExclExtraTTM에만 있음.
 *
 * 이 헬퍼는 우선순위 순으로 키를 시도해서 첫 번째 유효값을 반환.
 * 더 흔한 키부터 → 변형으로.
 *
 * pickMetric(metric, ['peNormalizedAnnual', 'peTTM', 'peBasicExclExtraTTM'])
 *   → 첫번째로 finite number 가진 값 반환, 없으면 null
 */

export function pickMetric(metric, keys) {
  if (!metric) return null;
  for (const k of keys) {
    const v = metric[k];
    if (typeof v === 'number' && !isNaN(v) && isFinite(v)) {
      return v;
    }
  }
  return null;
}

/**
 * 추적용 — 어느 키가 적중했는지까지 같이 반환 (디버그용)
 */
export function pickMetricWithKey(metric, keys) {
  if (!metric) return { value: null, key: null };
  for (const k of keys) {
    const v = metric?.[k];
    if (typeof v === 'number' && !isNaN(v) && isFinite(v)) {
      return { value: v, key: k };
    }
  }
  return { value: null, key: null };
}

/* ── 카테고리별 fallback 키 우선순위 ──────────────────────────
   Finnhub 무료 tier에서 종목 구분 없이 가장 많이 채워지는 순서로
*/

export const METRIC_KEYS = {
  // ── 밸류에이션 ──
  pe: [
    'peNormalizedAnnual',
    'peTTM',
    'peBasicExclExtraTTM',
    'peExclExtraAnnual',
    'peExclExtraTTM',
    'peInclExtraTTM',
    'peAnnual',
    'peExclExtraHighTTM', // 예외값까지 포함
  ],
  pb: [
    'pbAnnual',
    'pbQuarterly',
    'priceToBookAnnual',
    'priceToBookQuarterly',
  ],
  ps: [
    'psTTM',
    'psAnnual',
    'priceToSalesTTM',
    'priceToSalesAnnual',
  ],
  evEbitda: [
    'enterpriseValueOverEBITDATTM',
    'enterpriseValueOverEBITDAAnnual',
    'currentEv/freeCashFlowTTM',
    'currentEv/freeCashFlowAnnual',
  ],
  divYield: [
    'dividendYieldIndicatedAnnual',
    'currentDividendYieldTTM',
    'dividendYield5Y',
    'dividendYieldTTM',
  ],

  // ── 수익성 ──
  roe: [
    'roeTTM',
    'roeRfy',
    'roeAnnual',
    'roe5Y',
    'returnOnEquityTTM',
  ],
  roa: [
    'roaTTM',
    'roaRfy',
    'roa5Y',
    'roaAnnual',
    'returnOnAssetsTTM',
  ],
  operatingMargin: [
    'operatingMarginTTM',
    'operatingMarginAnnual',
    'operatingMargin5Y',
    'operatingMarginRfy',
  ],
  netMargin: [
    'netProfitMarginTTM',
    'netProfitMarginAnnual',
    'netProfitMargin5Y',
    'netMarginGrowth5Y',
    'netProfitMarginRfy',
  ],
  grossMargin: [
    'grossMarginTTM',
    'grossMarginAnnual',
    'grossMargin5Y',
    'grossMarginRfy',
  ],

  // ── 성장 ──
  revenueGrowth5Y: [
    'revenueGrowth5Y',
    'revenueGrowthRate5Y',
    'revenueCAGR5Y',
  ],
  revenueGrowthYoy: [
    'revenueGrowthQuarterlyYoy',
    'revenueGrowthTTMYoy',
    'revenueGrowthAnnual',
    'revenueGrowthRate',
  ],
  epsGrowth5Y: [
    'epsGrowth5Y',
    'epsBasicExclExtraItemsTTM5Y',
    'epsGrowthRate5Y',
  ],
  epsGrowthYoy: [
    'epsGrowthQuarterlyYoy',
    'epsGrowthTTMYoy',
    'epsGrowthAnnual',
  ],
  bookValueGrowth5Y: [
    'bookValueShareGrowth5Y',
    'bookValuePerShareGrowth5Y',
    'tangibleBookValuePerShareQuarterly',
  ],

  // ── 재무건전성 ──
  debtToEquity: [
    'totalDebt/totalEquityAnnual',
    'totalDebt/totalEquityQuarterly',
    'longTermDebt/equityAnnual',
    'longTermDebt/equityQuarterly',
  ],
  currentRatio: [
    'currentRatioAnnual',
    'currentRatioQuarterly',
    'quickRatioAnnual',
    'quickRatioQuarterly',
  ],
  interestCoverage: [
    'netInterestCoverageAnnual',
    'netInterestCoverageTTM',
    'interestCoverageAnnual',
  ],
  beta: [
    'beta',
    'beta5Y',
  ],
  avgVolume: [
    '10DayAverageTradingVolume',
    '3MonthAverageTradingVolume',
    'monthlyAverageTradingVolume',
  ],

  // ── 52주 ──
  high52w: [
    '52WeekHigh',
    'high52Week',
  ],
  low52w: [
    '52WeekLow',
    'low52Week',
  ],
};
