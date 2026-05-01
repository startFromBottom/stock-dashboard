import { NextResponse } from 'next/server';

/**
 * /api/stock-metrics?tickers=NVDA,AMD,...
 *
 * 카드용 보조 메트릭 (거래량 등) 반환.
 *
 * 이전 버전은 /stock/candle (거래량) + /indicator (RSI)을 썼지만
 * 둘 다 Finnhub free tier에서 막혀(403) 항상 null.
 *
 * 새 버전: /stock/metric?metric=all 한 번 호출하고 거기서:
 *   - volume:    10DayAverageTradingVolume (백만 주 단위 → 정수 주로 환산)
 *   - rsi:       null (free tier에서 못 가져옴)
 *
 * 응답: { TICKER: { volume, rsi }, ... }
 *
 * 캐시: 6시간 (10일 평균이라 거의 안 바뀌고, free tier 호출 절약)
 */

const cache = new Map();
const TTL = 6 * 60 * 60 * 1000; // 6시간

async function fetchMetric(ticker, token) {
  try {
    const url = `https://finnhub.io/api/v1/stock/metric?symbol=${encodeURIComponent(ticker)}&metric=all&token=${token}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    return json?.metric ?? null;
  } catch (e) {
    console.warn(`[stock-metrics] metric fetch 실패 (${ticker}):`, e.message);
    return null;
  }
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tickers = searchParams.get('tickers')?.split(',').filter(Boolean) ?? [];
  if (!tickers.length) return NextResponse.json({});

  const token = process.env.FINNHUB_API_KEY;
  if (!token) {
    return NextResponse.json(
      { error: '.env.local에 FINNHUB_API_KEY를 추가해 주세요' },
      { status: 500 }
    );
  }

  const now = Date.now();
  const hit = {};
  const miss = [];

  for (const t of tickers) {
    const cached = cache.get(t);
    if (cached && now - cached.ts < TTL) {
      hit[t] = cached.data;
    } else {
      miss.push(t);
    }
  }

  if (miss.length === 0) {
    return NextResponse.json(hit, { headers: { 'X-Cache': 'HIT' } });
  }

  // 배치: 4개씩 동시, 300ms 간격 (free tier 60/min 안에 안전)
  const fresh = {};
  const BATCH = 4;
  const DELAY = 300;

  for (let i = 0; i < miss.length; i += BATCH) {
    const batch = miss.slice(i, i + BATCH);

    const results = await Promise.allSettled(
      batch.map(async (ticker) => {
        const m = await fetchMetric(ticker, token);
        // 10DayAverageTradingVolume은 단위가 백만 주 → 실제 주 수로 환산
        const vol10d = (typeof m?.['10DayAverageTradingVolume'] === 'number')
          ? m['10DayAverageTradingVolume'] * 1_000_000
          : null;
        return {
          ticker,
          volume: vol10d,
          rsi: null, // free tier에선 가져올 수 없음
        };
      })
    );

    for (const r of results) {
      if (r.status === 'fulfilled') {
        const { ticker, volume, rsi } = r.value;
        const data = { volume, rsi };
        fresh[ticker] = data;
        cache.set(ticker, { data, ts: now });
      }
    }

    if (i + BATCH < miss.length) await sleep(DELAY);
  }

  const merged = { ...hit, ...fresh };

  const gotVol = Object.values(fresh).filter(d => d.volume !== null).length;
  console.log(
    `[stock-metrics] 완료: ${Object.keys(fresh).length}/${miss.length}개 신규` +
    ` | volume: ${gotVol}개` +
    (Object.keys(hit).length ? ` | 캐시 히트: ${Object.keys(hit).length}개` : '')
  );

  return NextResponse.json(merged, {
    headers: { 'X-Cache': Object.keys(hit).length > 0 ? 'PARTIAL' : 'MISS' },
  });
}
