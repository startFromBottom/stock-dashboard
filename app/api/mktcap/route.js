import { NextResponse } from 'next/server';
import { fetchBatch } from '@/lib/mktcap-utils.js';

// ── 티커별 개별 캐시 ──────────────────────────────────────────
const tickerCache = new Map();
const TICKER_TTL  = 60 * 60 * 1000; // 1시간

// ── API Route ─────────────────────────────────────────────────
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tickers = searchParams.get('tickers')?.split(',').filter(Boolean) ?? [];
  if (!tickers.length) return NextResponse.json({});

  const token = process.env.FINNHUB_API_KEY;
  if (!token) {
    return NextResponse.json(
      { error: '.env.local에 FINNHUB_API_KEY를 추가해 주세요 (https://finnhub.io 무료 발급)' },
      { status: 500 }
    );
  }

  const now  = Date.now();
  const hit  = {};
  const miss = [];

  for (const t of tickers) {
    const cached = tickerCache.get(t);
    if (cached && now - cached.ts < TICKER_TTL) {
      hit[t] = cached.marketCap;
    } else {
      miss.push(t);
    }
  }

  if (miss.length === 0) {
    return NextResponse.json(hit, { headers: { 'X-Cache': 'HIT' } });
  }

  try {
    const fresh = await fetchBatch(miss, token);

    for (const [sym, mktcap] of Object.entries(fresh)) {
      tickerCache.set(sym, { marketCap: mktcap, ts: now });
    }

    const merged = { ...hit, ...fresh };
    console.log(
      `[mktcap] Finnhub 취득: ${Object.keys(fresh).length}/${miss.length}개` +
      (Object.keys(hit).length ? ` (캐시 히트: ${Object.keys(hit).length}개)` : '')
    );

    return NextResponse.json(merged, {
      headers: { 'X-Cache': Object.keys(hit).length > 0 ? 'PARTIAL' : 'MISS' },
    });
  } catch (err) {
    console.error('[mktcap] 오류:', err.message);
    return NextResponse.json(
      Object.keys(hit).length ? hit : { error: err.message },
      { status: Object.keys(hit).length ? 200 : 502 }
    );
  }
}
