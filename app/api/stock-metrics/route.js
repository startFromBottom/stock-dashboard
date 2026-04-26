import { NextResponse } from 'next/server';

// ── 캐시 (15분 TTL) ──────────────────────────────────────────
const metricsCache = new Map();
const METRICS_TTL  = 15 * 60 * 1000; // 15분

/**
 * Finnhub /quote → 현재 거래량 조회
 * volume 필드: 해당 거래일 누적 거래량
 */
async function fetchVolume(ticker, token) {
  try {
    const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(ticker)}&token=${token}`;
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
    if (!res.ok) return null;
    const json = await res.json();
    // v = volume (일부 ticker는 없을 수 있음)
    return typeof json?.v === 'number' && json.v > 0 ? json.v : null;
  } catch {
    return null;
  }
}

/**
 * Finnhub /indicator → RSI(14) 조회
 * resolution: D (일봉), indicator: rsi, timeperiod: 14
 */
async function fetchRSI(ticker, token) {
  try {
    // Finnhub indicator API: 최근 일봉 기준 RSI
    const to   = Math.floor(Date.now() / 1000);
    const from = to - 60 * 60 * 24 * 60; // 60일치 (RSI 계산용)
    const url  = `https://finnhub.io/api/v1/indicator?symbol=${encodeURIComponent(ticker)}&resolution=D&from=${from}&to=${to}&indicator=rsi&timeperiod=14&token=${token}`;
    const res  = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
    if (!res.ok) return null;
    const json = await res.json();
    // rsi 배열의 마지막 유효값
    const rsiArr = json?.rsi;
    if (!Array.isArray(rsiArr) || rsiArr.length === 0) return null;
    // 뒤에서부터 유효한 숫자 찾기
    for (let i = rsiArr.length - 1; i >= 0; i--) {
      if (typeof rsiArr[i] === 'number' && !isNaN(rsiArr[i])) {
        return parseFloat(rsiArr[i].toFixed(2));
      }
    }
    return null;
  } catch {
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
  const hit  = {};
  const miss = [];

  for (const t of tickers) {
    const cached = metricsCache.get(t);
    if (cached && now - cached.ts < METRICS_TTL) {
      hit[t] = cached.data;
    } else {
      miss.push(t);
    }
  }

  if (miss.length === 0) {
    return NextResponse.json(hit, { headers: { 'X-Cache': 'HIT' } });
  }

  // 배치 처리 (Finnhub 무료 플랜: 30 req/s)
  const fresh = {};
  const BATCH = 5;
  const DELAY = 250; // ms

  for (let i = 0; i < miss.length; i += BATCH) {
    const batch = miss.slice(i, i + BATCH);

    const results = await Promise.allSettled(
      batch.map(async (ticker) => {
        const [volume, rsi] = await Promise.all([
          fetchVolume(ticker, token),
          fetchRSI(ticker, token),
        ]);
        return { ticker, volume, rsi };
      })
    );

    for (const r of results) {
      if (r.status === 'fulfilled') {
        const { ticker, volume, rsi } = r.value;
        const data = { volume, rsi };
        fresh[ticker] = data;
        metricsCache.set(ticker, { data, ts: now });
      }
    }

    if (i + BATCH < miss.length) await sleep(DELAY);
  }

  const merged = { ...hit, ...fresh };

  console.log(
    `[stock-metrics] 완료: ${Object.keys(fresh).length}/${miss.length}개 신규` +
    (Object.keys(hit).length ? ` (캐시 히트: ${Object.keys(hit).length}개)` : '')
  );

  return NextResponse.json(merged, {
    headers: { 'X-Cache': Object.keys(hit).length > 0 ? 'PARTIAL' : 'MISS' },
  });
}
