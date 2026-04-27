/**
 * Finnhub ticker별 응답 캐시 — sector-overview / sector-heatmap 라우트 공유용
 *
 * 같은 ticker를 두 라우트가 모두 요청하니까 in-memory 캐시 하나에 둠.
 * 카드(5개)가 먼저 채우면, 히트맵(12개)은 그 5개는 즉시 가져가고 추가 7개만 fetch.
 */

export const quoteCache  = new Map(); // sym → { data, ts }
export const metricCache = new Map(); // sym → { data, ts }

export const TICKER_TTL = 15 * 60 * 1000; // 15분

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/* ───────────── Finnhub fetch helpers ───────────── */

export async function fetchQuote(ticker, token) {
  try {
    const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(ticker)}&token=${token}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    if (!json?.c || json.c === 0) return null;
    return {
      price:     json.c,
      changePct: json.dp,
      prevClose: json.pc,
    };
  } catch {
    return null;
  }
}

export async function fetchMetric(ticker, token) {
  try {
    const url = `https://finnhub.io/api/v1/stock/metric?symbol=${encodeURIComponent(ticker)}&metric=all&token=${token}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    return json?.metric ?? null;
  } catch {
    return null;
  }
}

/**
 * ticker 배열에 대해 quote + metric을 캐시 우선으로 가져와 채워줌.
 * @param {string[]} tickers
 * @param {string} token
 * @param {object} opts { batch=3, delay=1500 }
 * @returns {Promise<{ quotes: Record<string,object>, metrics: Record<string,object> }>}
 */
export async function fetchQuotesAndMetrics(tickers, token, opts = {}) {
  const { batch = 3, delay = 1500 } = opts;
  const now = Date.now();

  const quotes = {};
  const metrics = {};
  const missing = [];

  for (const t of tickers) {
    const cq = quoteCache.get(t);
    const cm = metricCache.get(t);
    if (cq && (now - cq.ts < TICKER_TTL)) quotes[t] = cq.data;
    if (cm && (now - cm.ts < TICKER_TTL)) metrics[t] = cm.data;
    if (!quotes[t] || !metrics[t]) missing.push(t);
  }

  for (let i = 0; i < missing.length; i += batch) {
    const slice = missing.slice(i, i + batch);
    const results = await Promise.allSettled(slice.map(async t => {
      const q = quotes[t]  ? null : await fetchQuote(t, token);
      const m = metrics[t] ? null : await fetchMetric(t, token);
      return { t, q, m };
    }));
    for (const r of results) {
      if (r.status === 'fulfilled' && r.value) {
        const { t, q, m } = r.value;
        if (q) {
          quotes[t] = q;
          quoteCache.set(t, { data: q, ts: now });
        }
        if (m) {
          metrics[t] = m;
          metricCache.set(t, { data: m, ts: now });
        }
      }
    }
    if (i + batch < missing.length) await sleep(delay);
  }

  return { quotes, metrics };
}
