import { NextResponse } from 'next/server';

/**
 * /api/macro — 시장 컨텍스트 거시 지표
 *
 * 6개 핵심 지표 + Crypto Fear & Greed
 *
 * Finnhub /quote 사용 (무료). 일부 인덱스 ticker(^VIX, ^TNX)는 무료 플랜에서 막혔을 수 있어
 * 안전하게 ETF proxy도 준비:
 *   - VIX:    ^VIX → fallback VIXY (1x VIX ETF)
 *   - 10Y:    ^TNX → fallback IEF (7-10Y Treasury ETF, 가격으로는 금리 직접 안 보이지만 추세 대용)
 *   - DXY:    DX-Y.NYB → fallback UUP (Bullish USD ETF, 보통 더 안정)
 *   - Gold:   GLD (SPDR Gold Trust)
 *   - Oil:    USO (USO Oil Fund)
 *   - BTC:    BINANCE:BTCUSDT → fallback IBIT (Bitcoin ETF)
 *
 * Crypto F&G: alternative.me 무료 API
 *
 * 응답 캐시: 15분 (시장 거시 변수는 그렇게 자주 안 변함)
 */

const RESPONSE_CACHE_TTL = 15 * 60 * 1000;
let cache = null;

const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ───────────── 지표 정의 ───────────── */

const INDICATORS = [
  // id, label, icon, primary ticker, fallback ticker, kind
  { id: 'vix',  label: 'VIX',       icon: '😱', primary: '^VIX',              fallback: 'VIXY', kind: 'level' },
  { id: 'us10y', label: '10Y 금리', icon: '📈', primary: '^TNX',              fallback: null,   kind: 'level', divisor: 1 }, // ^TNX는 보통 4.21 같은 % 단위 그대로
  { id: 'dxy',  label: '달러 (DXY)', icon: '💵', primary: 'DX-Y.NYB',         fallback: 'UUP',  kind: 'level' },
  { id: 'gold', label: '금 (GLD)',  icon: '🥇', primary: 'GLD',              fallback: null,   kind: 'price' },
  { id: 'oil',  label: '유가 (USO)', icon: '🛢️', primary: 'USO',             fallback: null,   kind: 'price' },
  { id: 'btc',  label: '비트코인',   icon: '₿',  primary: 'BINANCE:BTCUSDT', fallback: 'IBIT', kind: 'price' },
];

/* ───────────── Finnhub /quote 호출 ───────────── */

async function fetchQuote(ticker, token) {
  try {
    const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(ticker)}&token=${token}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    if (!json?.c || json.c === 0) return null;
    return {
      price:     json.c,
      change:    json.d,
      changePct: json.dp,
      prevClose: json.pc,
    };
  } catch {
    return null;
  }
}

/* ───────────── Crypto Fear & Greed (alternative.me) ───────────── */

async function fetchCryptoFearGreed() {
  try {
    const res = await fetch('https://api.alternative.me/fng/?limit=2'); // 오늘+어제
    if (!res.ok) return null;
    const json = await res.json();
    const today = json?.data?.[0];
    const yesterday = json?.data?.[1];
    if (!today) return null;
    const value = parseInt(today.value, 10);
    const prev = yesterday ? parseInt(yesterday.value, 10) : null;
    return {
      value,
      classification: today.value_classification,  // "Fear", "Greed", etc
      change: prev !== null ? value - prev : null,
      timestamp: parseInt(today.timestamp, 10),
    };
  } catch {
    return null;
  }
}

/* ───────────── 메인 핸들러 ───────────── */

export async function GET() {
  const now = Date.now();
  if (cache && (now - cache.ts < RESPONSE_CACHE_TTL)) {
    return NextResponse.json(cache.data, { headers: { 'X-Cache': 'HIT' } });
  }

  const token = process.env.FINNHUB_API_KEY;
  if (!token) {
    return NextResponse.json({ error: 'FINNHUB_API_KEY 없음' }, { status: 500 });
  }

  // 지표별 fetch (primary, 실패 시 fallback). 배치 3개씩.
  const result = {};
  const BATCH = 3;
  const DELAY = 400;

  for (let i = 0; i < INDICATORS.length; i += BATCH) {
    const batch = INDICATORS.slice(i, i + BATCH);
    const results = await Promise.allSettled(batch.map(async ind => {
      let q = await fetchQuote(ind.primary, token);
      let usedTicker = ind.primary;
      if (!q && ind.fallback) {
        q = await fetchQuote(ind.fallback, token);
        usedTicker = ind.fallback;
      }
      return { id: ind.id, ind, q, usedTicker };
    }));
    for (const r of results) {
      if (r.status === 'fulfilled' && r.value) {
        const { id, ind, q, usedTicker } = r.value;
        result[id] = q ? {
          label: ind.label,
          icon: ind.icon,
          ticker: usedTicker,
          isFallback: usedTicker !== ind.primary,
          kind: ind.kind,
          ...q,
        } : {
          label: ind.label,
          icon: ind.icon,
          ticker: ind.primary,
          isFallback: false,
          kind: ind.kind,
          price: null,
          changePct: null,
        };
      }
    }
    if (i + BATCH < INDICATORS.length) await sleep(DELAY);
  }

  // Crypto F&G (병렬 가능했지만 단순화)
  const cfg = await fetchCryptoFearGreed();

  const payload = {
    generatedAt: now,
    indicators: result,
    cryptoFearGreed: cfg,
  };

  cache = { data: payload, ts: now };

  return NextResponse.json(payload, { headers: { 'X-Cache': 'MISS' } });
}
