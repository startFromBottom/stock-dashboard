import { NextResponse } from 'next/server';

// ── 캐시 (15분 TTL) ──────────────────────────────────────────
const metricsCache = new Map();
const METRICS_TTL  = 15 * 60 * 1000; // 15분

/**
 * Finnhub /stock/candle (일봉) → 최신 거래량 조회
 * /quote의 v 필드보다 안정적
 */
async function fetchVolume(ticker, token) {
  try {
    const to   = Math.floor(Date.now() / 1000);
    const from = to - 60 * 60 * 24 * 5; // 최근 5일치 (주말 고려)
    const url  = `https://finnhub.io/api/v1/stock/candle?symbol=${encodeURIComponent(ticker)}&resolution=D&from=${from}&to=${to}&token=${token}`;
    const res  = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();

    // s: "ok" 여부 확인, v: volume 배열
    if (json?.s !== 'ok' || !Array.isArray(json?.v) || json.v.length === 0) return null;

    // 마지막(최신) 거래일 거래량
    const lastVol = json.v[json.v.length - 1];
    return typeof lastVol === 'number' && lastVol > 0 ? lastVol : null;
  } catch (e) {
    console.warn(`[stock-metrics] volume fetch 실패 (${ticker}):`, e.message);
    return null;
  }
}

/**
 * Finnhub /indicator → RSI(14) 조회
 */
async function fetchRSI(ticker, token) {
  try {
    const to   = Math.floor(Date.now() / 1000);
    const from = to - 60 * 60 * 24 * 90; // 90일치 (RSI 계산 충분히 확보)
    const url  = `https://finnhub.io/api/v1/indicator?symbol=${encodeURIComponent(ticker)}&resolution=D&from=${from}&to=${to}&indicator=rsi&timeperiod=14&token=${token}`;
    const res  = await fetch(url);
    if (!res.ok) {
      console.warn(`[stock-metrics] RSI HTTP ${res.status} (${ticker})`);
      return null;
    }
    const json = await res.json();

    // 응답 구조: { rsi: [...], t: [...], s: "ok" }
    if (json?.s !== 'ok') {
      console.warn(`[stock-metrics] RSI s != ok (${ticker}):`, json?.s);
      return null;
    }

    const rsiArr = json?.rsi;
    if (!Array.isArray(rsiArr) || rsiArr.length === 0) return null;

    // 뒤에서부터 유효한 숫자 찾기
    for (let i = rsiArr.length - 1; i >= 0; i--) {
      const v = rsiArr[i];
      if (typeof v === 'number' && !isNaN(v) && v > 0) {
        return parseFloat(v.toFixed(2));
      }
    }
    return null;
  } catch (e) {
    console.warn(`[stock-metrics] RSI fetch 실패 (${ticker}):`, e.message);
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

  // 배치 처리 (Finnhub 무료 플랜: 30 req/s, 넉넉히 배치당 250ms 간격)
  const fresh = {};
  const BATCH = 4;
  const DELAY = 300;

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

  const gotVol = Object.values(fresh).filter(d => d.volume !== null).length;
  const gotRsi = Object.values(fresh).filter(d => d.rsi !== null).length;
  console.log(
    `[stock-metrics] 완료: ${Object.keys(fresh).length}/${miss.length}개` +
    ` | volume: ${gotVol}개, RSI: ${gotRsi}개` +
    (Object.keys(hit).length ? ` | 캐시 히트: ${Object.keys(hit).length}개` : '')
  );

  return NextResponse.json(merged, {
    headers: { 'X-Cache': Object.keys(hit).length > 0 ? 'PARTIAL' : 'MISS' },
  });
}
