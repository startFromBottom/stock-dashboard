import { NextResponse } from 'next/server';

// ── 서버 캐시 (5분 TTL) ──────────────────────────────────────
const quoteCache = new Map();
const CACHE_TTL  = 5 * 60 * 1000; // 5분

/**
 * Finnhub /quote → ETF 현재가·등락·거래량 조회
 * 응답: { c: 현재가, d: 등락액, dp: 등락률(%), h: 고가, l: 저가, o: 시가, pc: 전일종가 }
 */
async function fetchQuote(ticker, token) {
  try {
    const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(ticker)}&token=${token}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    if (!json?.c || json.c === 0) return null;
    return {
      price:   json.c,
      change:  json.d,
      changePct: json.dp,
      prevClose: json.pc,
      high:    json.h,
      low:     json.l,
    };
  } catch (e) {
    console.warn(`[etf-quotes] fetch 실패 (${ticker}):`, e.message);
    return null;
  }
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tickers = searchParams.get('tickers')?.split(',').filter(Boolean) ?? [];
  if (!tickers.length) return NextResponse.json({});

  const token = process.env.FINNHUB_API_KEY;
  if (!token) {
    return NextResponse.json({ error: 'FINNHUB_API_KEY 없음' }, { status: 500 });
  }

  const now = Date.now();
  const hit  = {};
  const miss = [];

  for (const t of tickers) {
    const cached = quoteCache.get(t);
    if (cached && now - cached.ts < CACHE_TTL) {
      hit[t] = cached.data;
    } else {
      miss.push(t);
    }
  }

  if (!miss.length) return NextResponse.json(hit, { headers: { 'X-Cache': 'HIT' } });

  const fresh = {};
  const BATCH = 5;
  const DELAY = 250;

  for (let i = 0; i < miss.length; i += BATCH) {
    const batch = miss.slice(i, i + BATCH);
    const results = await Promise.allSettled(
      batch.map(async ticker => {
        const data = await fetchQuote(ticker, token);
        return { ticker, data };
      })
    );
    for (const r of results) {
      if (r.status === 'fulfilled' && r.value.data) {
        const { ticker, data } = r.value;
        fresh[ticker] = data;
        quoteCache.set(ticker, { data, ts: now });
      }
    }
    if (i + BATCH < miss.length) await sleep(DELAY);
  }

  const merged = { ...hit, ...fresh };
  console.log(`[etf-quotes] 완료: ${Object.keys(fresh).length}/${miss.length}개 신규, 캐시 히트: ${Object.keys(hit).length}개`);

  return NextResponse.json(merged, {
    headers: { 'X-Cache': Object.keys(hit).length > 0 ? 'PARTIAL' : 'MISS' },
  });
}
