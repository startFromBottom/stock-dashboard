import { NextResponse } from 'next/server';

// ── 티커별 개별 캐시 ──────────────────────────────────────────
const tickerCache = new Map();
const TICKER_TTL  = 60 * 60 * 1000; // 1시간

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// ── Finnhub: 티커 1개의 시가총액 조회 ────────────────────────
// 반환값: USD 원시값 (e.g. 5_062_000_000_000) 또는 null
async function fetchOneFinnhub(ticker, token) {
  // Finnhub는 일부 국제 ticker 형식이 달라 US 단일 심볼만 처리
  // 예: '000660.KS' → Finnhub에서 지원 안 됨 → null 반환
  const url = `https://finnhub.io/api/v1/stock/metric?symbol=${encodeURIComponent(ticker)}&metric=all&token=${token}`;

  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) return null;

    const json = await res.json();
    // Finnhub는 marketCapitalization을 백만 USD 단위로 반환
    const mktcapM = json?.metric?.marketCapitalization;
    if (!mktcapM) return null;

    return mktcapM * 1_000_000; // USD 원시값으로 변환
  } catch {
    return null;
  }
}

// ── 배치 처리: 5개씩 병렬 + 100ms 딜레이 ─────────────────────
async function fetchBatch(tickers, token) {
  const result = {};
  const BATCH = 5;

  for (let i = 0; i < tickers.length; i += BATCH) {
    const batch = tickers.slice(i, i + BATCH);

    const entries = await Promise.allSettled(
      batch.map(async ticker => {
        const mktcap = await fetchOneFinnhub(ticker, token);
        return mktcap ? { ticker, mktcap } : null;
      })
    );

    for (const e of entries) {
      if (e.status === 'fulfilled' && e.value) {
        result[e.value.ticker] = e.value.mktcap;
      }
    }

    if (i + BATCH < tickers.length) await sleep(100);
  }

  return result;
}

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
