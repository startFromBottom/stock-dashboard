import { NextResponse } from 'next/server';

/**
 * /api/company-detail?ticker=NVDA
 *
 * Finnhub 무료 tier에서 가능한 endpoint들을 한 번에 묶어서 반환:
 *   - /stock/profile2     — 회사 프로필 (이름, 산업, 로고, IPO일 등)
 *   - /quote              — 현재가, 변동률
 *   - /stock/metric       — 밸류에이션·수익성·성장 지표 (52주 high/low 포함)
 *   - /calendar/earnings  — 향후 4분기 실적 일정
 *
 * 30분 in-memory 캐시 (서버 재시작하면 날아감, 충분).
 *
 * 응답 형태:
 *   {
 *     ticker, profile: {...}, quote: {...}, metric: {...},
 *     nextEarnings: { date, hour, epsEstimate, ... } | null,
 *     fetchedAt: <ISO>
 *   }
 */

const detailCache = new Map(); // ticker → { data, ts }
const TTL = 30 * 60 * 1000;    // 30분

async function safeFetch(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchProfile(ticker, token) {
  const j = await safeFetch(
    `https://finnhub.io/api/v1/stock/profile2?symbol=${encodeURIComponent(ticker)}&token=${token}`
  );
  if (!j || Object.keys(j).length === 0) return null;
  return j;
}

async function fetchQuote(ticker, token) {
  const j = await safeFetch(
    `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(ticker)}&token=${token}`
  );
  if (!j || !j.c || j.c === 0) return null;
  return {
    price:     j.c,
    changePct: j.dp,
    change:    j.d,
    high:      j.h,
    low:       j.l,
    open:      j.o,
    prevClose: j.pc,
  };
}

async function fetchMetric(ticker, token) {
  const j = await safeFetch(
    `https://finnhub.io/api/v1/stock/metric?symbol=${encodeURIComponent(ticker)}&metric=all&token=${token}`
  );
  return j?.metric ?? null;
}

async function fetchNextEarnings(ticker, token) {
  // 오늘부터 6개월 후까지 검색
  const today = new Date();
  const from = today.toISOString().slice(0, 10);
  const future = new Date(today);
  future.setMonth(future.getMonth() + 6);
  const to = future.toISOString().slice(0, 10);

  const j = await safeFetch(
    `https://finnhub.io/api/v1/calendar/earnings?from=${from}&to=${to}&symbol=${encodeURIComponent(ticker)}&token=${token}`
  );
  const arr = j?.earningsCalendar;
  if (!Array.isArray(arr) || arr.length === 0) return null;

  // 가장 가까운 미래 날짜
  const sorted = [...arr].sort((a, b) => new Date(a.date) - new Date(b.date));
  return sorted[0];
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ticker = (searchParams.get('ticker') || '').trim().toUpperCase();
  if (!ticker) {
    return NextResponse.json({ error: 'ticker required' }, { status: 400 });
  }

  const token = process.env.FINNHUB_API_KEY;
  if (!token) {
    return NextResponse.json(
      { error: 'FINNHUB_API_KEY 미설정' },
      { status: 500 }
    );
  }

  // 캐시 확인
  const now = Date.now();
  const cached = detailCache.get(ticker);
  if (cached && now - cached.ts < TTL) {
    return NextResponse.json(cached.data, { headers: { 'X-Cache': 'HIT' } });
  }

  // 4개 endpoint 병렬 호출
  const [profile, quote, metric, nextEarnings] = await Promise.all([
    fetchProfile(ticker, token),
    fetchQuote(ticker, token),
    fetchMetric(ticker, token),
    fetchNextEarnings(ticker, token),
  ]);

  // 다 null이면 보통 ticker 인식 못 함
  if (!profile && !quote && !metric) {
    return NextResponse.json(
      { error: 'no data — ticker가 올바른지, Finnhub free tier 한도가 안 찼는지 확인' },
      { status: 404 }
    );
  }

  const data = {
    ticker,
    profile,
    quote,
    metric,
    nextEarnings,
    fetchedAt: new Date().toISOString(),
  };

  detailCache.set(ticker, { data, ts: now });
  return NextResponse.json(data, { headers: { 'X-Cache': 'MISS' } });
}
