import { NextResponse } from 'next/server';

const FMP_BASE = 'https://financialmodelingprep.com/stable';

// 서버 메모리 캐시
let dataCache = { data: null, ts: 0 };
const CACHE_TTL = 60 * 60 * 1000; // 1시간

/**
 * FMP stable/quote — 쉼표 구분 복수 symbol 지원 여부 확인 후
 * 안되면 individual 요청으로 폴백
 */
async function fetchFMP(tickers) {
  const apiKey = process.env.FMP_API_KEY;
  if (!apiKey) throw new Error('FMP_API_KEY 환경변수가 없습니다');

  // 1) 배치 시도 (쉼표 구분)
  const batchSymbols = tickers.join(',');
  const batchRes = await fetch(
    `${FMP_BASE}/quote?symbol=${encodeURIComponent(batchSymbols)}&apikey=${apiKey}`
  );

  if (batchRes.ok) {
    const raw = await batchRes.json();
    if (Array.isArray(raw) && raw.length > 0) {
      const result = {};
      for (const item of raw) {
        if (item.symbol && item.marketCap) result[item.symbol] = item.marketCap;
      }
      console.log(`[mktcap] 배치 성공: ${Object.keys(result).length}/${tickers.length}개`);
      return result;
    }
  }

  // 2) 배치 실패 시 개별 요청으로 폴백 (Promise.allSettled 병렬)
  console.log('[mktcap] 배치 실패 → 개별 요청으로 전환');
  const entries = await Promise.allSettled(
    tickers.map(ticker =>
      fetch(`${FMP_BASE}/quote?symbol=${encodeURIComponent(ticker)}&apikey=${apiKey}`)
        .then(r => r.json())
        .then(raw => {
          const item = Array.isArray(raw) ? raw[0] : null;
          return item?.marketCap ? { symbol: ticker, marketCap: item.marketCap } : null;
        })
    )
  );

  const result = {};
  for (const entry of entries) {
    if (entry.status === 'fulfilled' && entry.value) {
      result[entry.value.symbol] = entry.value.marketCap;
    }
  }
  console.log(`[mktcap] 개별 요청 완료: ${Object.keys(result).length}/${tickers.length}개`);
  return result;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tickers = searchParams.get('tickers')?.split(',').filter(Boolean) ?? [];

  if (!tickers.length) return NextResponse.json({});

  const now = Date.now();

  // 캐시 히트
  if (dataCache.data && now - dataCache.ts < CACHE_TTL) {
    const result = {};
    for (const t of tickers) {
      if (dataCache.data[t] !== undefined) result[t] = dataCache.data[t];
    }
    return NextResponse.json(result, {
      headers: {
        'X-Cache':     'HIT',
        'X-Cache-Age': Math.floor((now - dataCache.ts) / 1000) + 's',
      },
    });
  }

  try {
    const result = await fetchFMP(tickers);
    dataCache = { data: result, ts: now };

    return NextResponse.json(result, { headers: { 'X-Cache': 'MISS' } });
  } catch (err) {
    console.error('[mktcap] 오류:', err.message);
    return NextResponse.json({ error: err.message }, { status: 502 });
  }
}
