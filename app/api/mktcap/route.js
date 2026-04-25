import { NextResponse } from 'next/server';

const FMP_BASE = 'https://financialmodelingprep.com/api/v3';

// 서버 메모리 캐시 (프로세스 재시작 전까지 유지, revalidate 보조)
let cache = { data: null, ts: 0 };
const CACHE_TTL = 60 * 60 * 1000; // 1시간

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tickers = searchParams.get('tickers')?.split(',').filter(Boolean) ?? [];

  if (!tickers.length) {
    return NextResponse.json({});
  }

  const apiKey = process.env.FMP_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'FMP_API_KEY 환경변수가 없습니다.' }, { status: 500 });
  }

  // 캐시 히트
  const now = Date.now();
  if (cache.data && now - cache.ts < CACHE_TTL) {
    // 요청한 ticker 중 캐시에 있는 것만 반환
    const result = {};
    for (const t of tickers) {
      if (cache.data[t] !== undefined) result[t] = cache.data[t];
    }
    return NextResponse.json(result, {
      headers: { 'X-Cache': 'HIT', 'X-Cache-Age': String(Math.floor((now - cache.ts) / 1000)) },
    });
  }

  // FMP bulk quote (쉼표 구분 최대 ~200개 지원)
  const tickerStr = tickers.join(',');
  try {
    const res = await fetch(
      `${FMP_BASE}/quote/${encodeURIComponent(tickerStr)}?apikey=${apiKey}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error('[mktcap] FMP error:', res.status, text);
      return NextResponse.json({ error: `FMP ${res.status}` }, { status: 502 });
    }

    const raw = await res.json();

    // FMP가 에러 객체를 반환하는 경우 ({"Error Message": "..."})
    if (!Array.isArray(raw)) {
      console.error('[mktcap] FMP unexpected response:', raw);
      return NextResponse.json({ error: 'FMP 응답 형식 오류' }, { status: 502 });
    }

    const result = {};
    for (const item of raw) {
      if (item.symbol && item.marketCap) {
        result[item.symbol] = item.marketCap; // USD 단위 원시값
      }
    }

    // 캐시 갱신
    cache = { data: result, ts: now };

    return NextResponse.json(result, {
      headers: { 'X-Cache': 'MISS' },
    });
  } catch (err) {
    console.error('[mktcap] fetch error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
