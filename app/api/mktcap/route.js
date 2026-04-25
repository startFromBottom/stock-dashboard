import { NextResponse } from 'next/server';

const FMP_BASE = 'https://financialmodelingprep.com/stable';
const TICKER_TTL = 60 * 60 * 1000; // 1시간

// ── 티커별 개별 캐시 (요청 단위가 아닌 티커 단위로 저장) ──
// { 'NVDA': { marketCap: 5062002467464, ts: 1234567890 } }
const tickerCache = new Map();

function getCached(tickers) {
  const now = Date.now();
  const hit = {};
  const miss = [];
  for (const t of tickers) {
    const entry = tickerCache.get(t);
    if (entry && now - entry.ts < TICKER_TTL) {
      hit[t] = entry.marketCap;
    } else {
      miss.push(t);
    }
  }
  return { hit, miss };
}

function saveToCache(data) {
  const ts = Date.now();
  for (const [symbol, marketCap] of Object.entries(data)) {
    tickerCache.set(symbol, { marketCap, ts });
  }
}

// ── FMP 요청 ──
async function fetchFMP(tickers) {
  const apiKey = process.env.FMP_API_KEY;
  if (!apiKey) throw new Error('FMP_API_KEY 환경변수가 없습니다');

  const result = {};

  // 1) 배치 시도 — 쉼표를 인코딩하지 않고 그대로 전달
  const batchSymbols = tickers.join(',');
  try {
    const batchRes = await fetch(
      `${FMP_BASE}/quote?symbol=${batchSymbols}&apikey=${apiKey}`
    );
    if (batchRes.ok) {
      const text = await batchRes.text();
      // "Premium" 텍스트가 오면 JSON 파싱 건너뜀
      if (text.trim().startsWith('[') || text.trim().startsWith('{')) {
        const raw = JSON.parse(text);
        if (Array.isArray(raw) && raw.length > 0) {
          for (const item of raw) {
            if (item.symbol && item.marketCap) result[item.symbol] = item.marketCap;
          }
          if (Object.keys(result).length > 0) {
            console.log(`[mktcap] 배치 성공: ${Object.keys(result).length}/${tickers.length}개`);
            return result;
          }
        }
      } else {
        console.log('[mktcap] 배치 응답이 JSON 아님, 개별 요청으로 전환:', text.slice(0, 80));
      }
    }
  } catch (e) {
    console.log('[mktcap] 배치 실패:', e.message, '→ 개별 요청으로 전환');
  }

  // 2) 개별 요청 병렬 처리
  console.log(`[mktcap] 개별 요청: ${tickers.length}개`);
  const entries = await Promise.allSettled(
    tickers.map(ticker =>
      fetch(`${FMP_BASE}/quote?symbol=${encodeURIComponent(ticker)}&apikey=${apiKey}`)
        .then(async r => {
          const text = await r.text();
          if (!text.trim().startsWith('[')) return null;
          const raw = JSON.parse(text);
          const item = Array.isArray(raw) ? raw[0] : null;
          return item?.marketCap ? { symbol: ticker, marketCap: item.marketCap } : null;
        })
        .catch(() => null)
    )
  );

  for (const entry of entries) {
    if (entry.status === 'fulfilled' && entry.value) {
      result[entry.value.symbol] = entry.value.marketCap;
    }
  }
  console.log(`[mktcap] 개별 완료: ${Object.keys(result).length}/${tickers.length}개`);
  return result;
}

// ── API Route ──
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tickers = searchParams.get('tickers')?.split(',').filter(Boolean) ?? [];
  if (!tickers.length) return NextResponse.json({});

  // 캐시에서 찾기
  const { hit, miss } = getCached(tickers);

  if (miss.length === 0) {
    // 전부 캐시 히트
    return NextResponse.json(hit, { headers: { 'X-Cache': 'HIT' } });
  }

  // 캐시 미스 티커만 FMP에서 가져오기
  try {
    const fresh = await fetchFMP(miss);
    saveToCache(fresh);

    return NextResponse.json(
      { ...hit, ...fresh },
      { headers: { 'X-Cache': miss.length === tickers.length ? 'MISS' : 'PARTIAL' } }
    );
  } catch (err) {
    console.error('[mktcap] 오류:', err.message);
    // 캐시 히트 데이터라도 반환
    return NextResponse.json(
      hit,
      { status: Object.keys(hit).length ? 200 : 502,
        headers: { 'X-Cache': 'ERROR', 'X-Error': err.message } }
    );
  }
}
