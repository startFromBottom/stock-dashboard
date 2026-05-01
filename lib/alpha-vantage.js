/**
 * Alpha Vantage fallback 데이터 소스.
 *
 * Finnhub 무료 tier에서 막힌 endpoint들의 대체:
 *   - RSI(14)   ← Finnhub /indicator (free에서 막힘)
 *   - OVERVIEW  ← Finnhub /stock/metric의 빈 항목 보강
 *
 * 한도: 무료 분당 5회 / 일 500회.
 *   → 이걸 넘기지 않게 in-process 큐 + per-symbol 캐시.
 *   → RSI는 6h TTL, OVERVIEW는 24h TTL.
 *
 * 모든 fetch는 이 모듈을 통해서만 → 한 곳에서 rate-limit 관리.
 */

const RSI_TTL      = 6 * 60 * 60 * 1000;  // 6시간
const OVERVIEW_TTL = 24 * 60 * 60 * 1000; // 24시간
const DAILY_QUOTA  = 500;                  // 일 500회 — 보수적으로 480에서 차단

// ── per-symbol 캐시 ───────────────────────────────────
const rsiCache      = new Map(); // sym → { value, ts }
const overviewCache = new Map(); // sym → { data, ts }

// ── 일별 호출 카운터 ──────────────────────────────────
let dayKey = currentDayKey();
let dayUsed = 0;
function currentDayKey() {
  const d = new Date();
  return `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
}
function bumpQuota() {
  const k = currentDayKey();
  if (k !== dayKey) { dayKey = k; dayUsed = 0; }
  dayUsed += 1;
}
function quotaAvailable() {
  const k = currentDayKey();
  if (k !== dayKey) { dayKey = k; dayUsed = 0; }
  return dayUsed < (DAILY_QUOTA - 20); // 20개는 버퍼로 남김
}

// ── 분당 5회 큐 ────────────────────────────────────────
// 매 12.5초 = 4.8 호출/min. 안전 마진.
const MIN_INTERVAL = 12500;
let lastCallAt = 0;
const queue = [];
let processing = false;

function processQueue() {
  if (processing) return;
  processing = true;
  (async () => {
    while (queue.length > 0) {
      const since = Date.now() - lastCallAt;
      if (since < MIN_INTERVAL) {
        await new Promise(r => setTimeout(r, MIN_INTERVAL - since));
      }
      const job = queue.shift();
      lastCallAt = Date.now();
      try {
        const result = await job.fn();
        bumpQuota();
        job.resolve(result);
      } catch (e) {
        job.reject(e);
      }
    }
    processing = false;
  })();
}

function enqueue(fn) {
  return new Promise((resolve, reject) => {
    queue.push({ fn, resolve, reject });
    processQueue();
  });
}

/* ──────────────────────────────────────────────────────
   RSI(14, daily) 조회
   ────────────────────────────────────────────────────── */
export async function getAlphaVantageRSI(ticker) {
  if (!ticker) return null;
  const sym = ticker.trim().toUpperCase();

  // 캐시 hit
  const c = rsiCache.get(sym);
  if (c && Date.now() - c.ts < RSI_TTL) {
    return c.value;
  }

  // 일 한도 초과
  if (!quotaAvailable()) {
    console.warn(`[AlphaVantage] daily quota near, skipping RSI ${sym}`);
    return null;
  }

  const key = process.env.ALPHA_VANTAGE_API_KEY;
  if (!key) return null;

  return enqueue(async () => {
    try {
      const url = `https://www.alphavantage.co/query?function=RSI&symbol=${encodeURIComponent(sym)}&interval=daily&time_period=14&series_type=close&apikey=${key}`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const json = await res.json();

      // 응답이 throttle되면 "Note" / "Information" 키로 옴
      if (json?.Note || json?.Information) {
        console.warn(`[AlphaVantage] throttled (RSI ${sym}):`, json.Note || json.Information);
        return null;
      }

      const series = json?.['Technical Analysis: RSI'];
      if (!series || typeof series !== 'object') return null;

      // 가장 최근 날짜의 RSI 값
      const dates = Object.keys(series).sort().reverse();
      for (const d of dates) {
        const v = parseFloat(series[d]?.RSI);
        if (!isNaN(v) && v > 0) {
          const value = parseFloat(v.toFixed(2));
          rsiCache.set(sym, { value, ts: Date.now() });
          return value;
        }
      }
      return null;
    } catch (e) {
      console.warn(`[AlphaVantage] RSI fetch 실패 (${sym}):`, e.message);
      return null;
    }
  });
}

/* ──────────────────────────────────────────────────────
   OVERVIEW (P/E, P/B, ROE, profit margin 등) 조회
   ────────────────────────────────────────────────────── */
export async function getAlphaVantageOverview(ticker) {
  if (!ticker) return null;
  const sym = ticker.trim().toUpperCase();

  const c = overviewCache.get(sym);
  if (c && Date.now() - c.ts < OVERVIEW_TTL) {
    return c.data;
  }

  if (!quotaAvailable()) {
    console.warn(`[AlphaVantage] daily quota near, skipping OVERVIEW ${sym}`);
    return null;
  }

  const key = process.env.ALPHA_VANTAGE_API_KEY;
  if (!key) return null;

  return enqueue(async () => {
    try {
      const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${encodeURIComponent(sym)}&apikey=${key}`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const json = await res.json();

      if (json?.Note || json?.Information) {
        console.warn(`[AlphaVantage] throttled (OVERVIEW ${sym}):`, json.Note || json.Information);
        return null;
      }

      // 응답이 비어있거나 Symbol 누락 → 무효
      if (!json || !json.Symbol) return null;

      // string으로 오는 숫자들을 number로 변환 (못 하면 그대로)
      const data = {};
      for (const [k, v] of Object.entries(json)) {
        if (v === 'None' || v === '-' || v === '' || v == null) {
          data[k] = null;
          continue;
        }
        const n = parseFloat(v);
        data[k] = isNaN(n) ? v : n;
      }

      overviewCache.set(sym, { data, ts: Date.now() });
      return data;
    } catch (e) {
      console.warn(`[AlphaVantage] OVERVIEW fetch 실패 (${sym}):`, e.message);
      return null;
    }
  });
}

/**
 * Alpha Vantage OVERVIEW 응답을 Finnhub metric 형식으로 매핑하는 헬퍼.
 * pickMetric(metric, METRIC_KEYS.pe) 같은 기존 호출에 그대로 fallback으로 쓸 수 있게.
 *
 * Finnhub metric 키 → AV OVERVIEW 키
 *   peNormalizedAnnual, peTTM      → PERatio
 *   pbAnnual                       → PriceToBookRatio
 *   psTTM                          → PriceToSalesRatioTTM
 *   roeTTM, roeRfy                 → ReturnOnEquityTTM (* 100, AV는 0.xx로 줌)
 *   roaTTM                         → ReturnOnAssetsTTM (* 100)
 *   operatingMarginTTM             → OperatingMarginTTM (* 100)
 *   netProfitMarginTTM             → ProfitMargin (* 100)
 *   grossMarginTTM                 → (없음)
 *   dividendYieldIndicatedAnnual   → DividendYield (* 100, AV는 0.xx)
 *   beta                           → Beta
 *   52WeekHigh, 52WeekLow          → 52WeekHigh, 52WeekLow
 *   revenueGrowthQuarterlyYoy      → QuarterlyRevenueGrowthYOY (* 100)
 *   epsGrowthQuarterlyYoy          → QuarterlyEarningsGrowthYOY (* 100)
 */
export function overviewToMetricFallback(ov) {
  if (!ov) return {};
  const m = {};
  const num = (v, mult = 1) => (typeof v === 'number' && !isNaN(v)) ? v * mult : undefined;

  // 밸류에이션
  if (num(ov.PERatio)             !== undefined) m.peNormalizedAnnual = num(ov.PERatio);
  if (num(ov.PriceToBookRatio)    !== undefined) m.pbAnnual           = num(ov.PriceToBookRatio);
  if (num(ov.PriceToSalesRatioTTM)!== undefined) m.psTTM              = num(ov.PriceToSalesRatioTTM);
  if (num(ov.EVToEBITDA)          !== undefined) m.enterpriseValueOverEBITDATTM = num(ov.EVToEBITDA);

  // 수익성 (AV는 ratio 0.xx → %로 변환)
  if (num(ov.ReturnOnEquityTTM)  !== undefined) m.roeTTM           = num(ov.ReturnOnEquityTTM, 100);
  if (num(ov.ReturnOnAssetsTTM)  !== undefined) m.roaTTM           = num(ov.ReturnOnAssetsTTM, 100);
  if (num(ov.OperatingMarginTTM) !== undefined) m.operatingMarginTTM = num(ov.OperatingMarginTTM, 100);
  if (num(ov.ProfitMargin)       !== undefined) m.netProfitMarginTTM = num(ov.ProfitMargin, 100);

  // 배당
  if (num(ov.DividendYield) !== undefined) m.dividendYieldIndicatedAnnual = num(ov.DividendYield, 100);

  // 베타
  if (num(ov.Beta) !== undefined) m.beta = num(ov.Beta);

  // 52주 (Finnhub와 같은 키 이름)
  if (num(ov['52WeekHigh']) !== undefined) m['52WeekHigh'] = num(ov['52WeekHigh']);
  if (num(ov['52WeekLow'])  !== undefined) m['52WeekLow']  = num(ov['52WeekLow']);

  // 성장
  if (num(ov.QuarterlyRevenueGrowthYOY) !== undefined) m.revenueGrowthQuarterlyYoy = num(ov.QuarterlyRevenueGrowthYOY, 100);
  if (num(ov.QuarterlyEarningsGrowthYOY)!== undefined) m.epsGrowthQuarterlyYoy    = num(ov.QuarterlyEarningsGrowthYOY, 100);

  return m;
}

/* 디버그용 — 큐/한도 현황 (콘솔 도구) */
export function _avStatus() {
  return {
    queueDepth: queue.length,
    processing,
    dayKey,
    dayUsed,
    rsiCacheSize: rsiCache.size,
    overviewCacheSize: overviewCache.size,
  };
}
