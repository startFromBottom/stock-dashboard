import { NextResponse } from 'next/server';

// Yahoo Finance v7 — API 키 불필요, 완전 무료
const YF_QUOTE   = 'https://query1.finance.yahoo.com/v7/finance/quote';
const YF_CRUMB   = 'https://query1.finance.yahoo.com/v1/test/getcrumb';
const YF_CONSENT = 'https://consent.yahoo.com/v2/collectConsent';

// 서버 메모리 캐시
let cache    = { data: null, ts: 0 };
let crumbVal = { value: '', cookie: '', ts: 0 };
const CACHE_TTL = 60 * 60 * 1000;   // 1시간
const CRUMB_TTL = 12 * 60 * 60 * 1000; // 12시간

const BASE_HEADERS = {
  'User-Agent':      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept':          'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Origin':          'https://finance.yahoo.com',
  'Referer':         'https://finance.yahoo.com/',
};

/* ── crumb 취득 (Yahoo Finance 인증 우회) ── */
async function getCrumb() {
  const now = Date.now();
  if (crumbVal.value && now - crumbVal.ts < CRUMB_TTL) return crumbVal;

  // 1) 쿠키 수집
  const cookieRes = await fetch('https://finance.yahoo.com/', {
    headers: BASE_HEADERS,
    redirect: 'follow',
  });
  const setCookies = cookieRes.headers.getSetCookie?.() ?? [];
  const cookie = setCookies
    .map(s => s.split(';')[0])
    .join('; ');

  // 2) crumb 요청
  const crumbRes = await fetch(YF_CRUMB, {
    headers: { ...BASE_HEADERS, Cookie: cookie },
  });
  const crumb = (await crumbRes.text()).trim();

  crumbVal = { value: crumb, cookie, ts: now };
  return crumbVal;
}

/* ── Yahoo Finance v7 bulk quote ── */
async function fetchYahoo(tickers) {
  const symbols = tickers.join(',');
  const url = `${YF_QUOTE}?symbols=${encodeURIComponent(symbols)}&fields=marketCap,shortName&lang=en-US&region=US&corsDomain=finance.yahoo.com`;

  // 1차 시도: crumb 없이
  let res = await fetch(url, { headers: BASE_HEADERS });

  // 401이면 crumb + cookie로 재시도
  if (res.status === 401 || res.status === 403) {
    const { value: crumb, cookie } = await getCrumb();
    res = await fetch(`${url}&crumb=${encodeURIComponent(crumb)}`, {
      headers: { ...BASE_HEADERS, Cookie: cookie },
    });
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Yahoo Finance HTTP ${res.status}: ${body.slice(0, 200)}`);
  }

  const json = await res.json();
  const items = json?.quoteResponse?.result ?? [];

  const result = {};
  for (const item of items) {
    if (item.symbol && item.marketCap) {
      result[item.symbol] = item.marketCap; // USD 원시값
    }
  }
  return result;
}

/* ── API Route ── */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tickers = searchParams.get('tickers')?.split(',').filter(Boolean) ?? [];

  if (!tickers.length) return NextResponse.json({});

  const now = Date.now();

  // 캐시 히트
  if (cache.data && now - cache.ts < CACHE_TTL) {
    const result = {};
    for (const t of tickers) {
      if (cache.data[t] !== undefined) result[t] = cache.data[t];
    }
    return NextResponse.json(result, {
      headers: {
        'X-Cache':     'HIT',
        'X-Cache-Age': String(Math.floor((now - cache.ts) / 1000)),
        'X-Source':    'Yahoo Finance (cached)',
      },
    });
  }

  try {
    const result = await fetchYahoo(tickers);
    cache = { data: result, ts: now };

    return NextResponse.json(result, {
      headers: {
        'X-Cache':  'MISS',
        'X-Source': 'Yahoo Finance (live)',
      },
    });
  } catch (err) {
    console.error('[mktcap]', err.message);
    return NextResponse.json(
      { error: err.message },
      { status: 502 }
    );
  }
}
