/**
 * 시가총액 조회 유틸 — API route에서 분리해 테스트 가능하게
 */

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/**
 * Finnhub에서 ticker 1개의 시가총액을 USD 원시값으로 조회합니다.
 * 실패 시 null 반환.
 *
 * @param {string} ticker
 * @param {string} token  - Finnhub API key
 * @param {function} [fetcher=fetch]  - 의존성 주입용 (테스트에서 모킹)
 * @returns {Promise<number|null>}
 */
export async function fetchOneFinnhub(ticker, token, fetcher = fetch) {
  const url = `https://finnhub.io/api/v1/stock/metric?symbol=${encodeURIComponent(ticker)}&metric=all&token=${token}`;
  try {
    const res = await fetcher(url, { headers: { 'Content-Type': 'application/json' } });
    if (!res.ok) return null;
    const json = await res.json();
    const mktcapM = json?.metric?.marketCapitalization;
    if (!mktcapM) return null;
    return mktcapM * 1_000_000;
  } catch {
    return null;
  }
}

/**
 * ticker 배열을 BATCH_SIZE씩 병렬 조회합니다.
 *
 * @param {string[]} tickers
 * @param {string} token
 * @param {object} [opts]
 * @param {number} [opts.batchSize=5]
 * @param {number} [opts.delayMs=100]
 * @param {function} [opts.fetcher=fetch]
 * @returns {Promise<Record<string, number>>}
 */
export async function fetchBatch(tickers, token, { batchSize = 5, delayMs = 100, fetcher = fetch } = {}) {
  const result = {};

  for (let i = 0; i < tickers.length; i += batchSize) {
    const batch = tickers.slice(i, i + batchSize);

    const entries = await Promise.allSettled(
      batch.map(async ticker => {
        const mktcap = await fetchOneFinnhub(ticker, token, fetcher);
        return mktcap ? { ticker, mktcap } : null;
      })
    );

    for (const e of entries) {
      if (e.status === 'fulfilled' && e.value) {
        result[e.value.ticker] = e.value.mktcap;
      }
    }

    if (i + batchSize < tickers.length) await sleep(delayMs);
  }

  return result;
}
