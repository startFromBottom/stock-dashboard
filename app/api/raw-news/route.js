import { NextResponse } from 'next/server';

// ── 서버 사이드 캐시 (1시간) ────────────────────────────────
let _cache = null;
let _cacheTs = 0;
const CACHE_TTL = 60 * 60 * 1000;

// ── 티커 → category 매핑 ──────────────────────────────────
const TICKER_CATEGORY = {
  // 에너지
  XOM:    'oil',
  CVX:    'oil',
  'BP':   'oil',
  SHEL:   'oil',
  COP:    'oil',
  EQNR:   'oil',
  TTE:    'oil',
  // 천연가스
  LNG:    'naturalgas',
  KMI:    'naturalgas',
  WMB:    'naturalgas',
  // 석탄
  BTU:    'coal',
  ARCH:   'coal',
  // 구리·산업금속
  FCX:    'copper',
  SCCO:   'copper',
  TECK:   'industrial',
  // 리튬·배터리
  ALB:    'lithium',
  SQM:    'lithium',
  LTHM:   'lithium',
  // 희토류
  MP:     'rare-earth',
  // 귀금속
  NEM:    'gold',
  AEM:    'gold',
  WPM:    'silver',
  // 다각화 광업
  'GLEN.L': 'industrial',
  BHP:    'industrial',
  RIO:    'industrial',
  VALE:   'iron',
};

// ── Finnhub 조회 티커 (미국 상장 / 무료 tier 안정) ──────────
const FINNHUB_TICKERS = [
  'XOM', 'CVX', 'COP', 'EQNR', 'TTE',
  'LNG', 'KMI', 'WMB',
  'BTU', 'ARCH',
  'FCX', 'SCCO',
  'ALB', 'SQM',
  'MP',
  'NEM', 'AEM', 'WPM',
  'BHP', 'RIO', 'VALE',
];

// ── RSS 피드 ─────────────────────────────────────────────
const RSS_FEEDS = [
  {
    url: 'https://www.mining.com/feed/',
    source: 'Mining.com',
    tickers: [], category: null,
  },
  {
    url: 'https://www.miningweekly.com/rss',
    source: 'Mining Weekly',
    tickers: [], category: null,
  },
  {
    url: 'https://oilprice.com/rss/main',
    source: 'OilPrice.com',
    tickers: [], category: null,
  },
  {
    url: 'https://www.reuters.com/business/energy/rss',
    source: 'Reuters Energy',
    tickers: [], category: null,
  },
  {
    url: 'https://www.iea.org/rss/news.xml',
    source: 'IEA News',
    tickers: [], category: null,
  },
  {
    url: 'https://feeds.bloomberg.com/energy/news.rss',
    source: 'Bloomberg Energy',
    tickers: [], category: null,
  },
  {
    url: 'https://www.spglobal.com/commodityinsights/en/rss-feed/oil',
    source: 'S&P Commodity Insights',
    tickers: [], category: null,
  },
  {
    url: 'https://www.argusmedia.com/en/rss-feeds',
    source: 'Argus Media',
    tickers: [], category: null,
  },
  {
    url: 'https://www.metalbulletin.com/rss',
    source: 'Metal Bulletin',
    tickers: [], category: null,
  },
];

// ── 원자재 관련 키워드 필터 ───────────────────────────────
const RAW_KEYWORDS = [
  // 에너지
  'oil', 'crude', 'petroleum', 'brent', 'wti', 'opec', 'refinery', 'gasoline', 'diesel',
  'natural gas', 'lng', 'pipeline', 'shale', 'fracking', 'offshore',
  'coal', 'coking coal', 'thermal coal', 'metallurgical coal',
  // 금속
  'copper', 'iron ore', 'steel', 'aluminum', 'aluminium', 'nickel', 'zinc', 'lead',
  'lithium', 'cobalt', 'rare earth', 'neodymium', 'gallium', 'germanium', 'indium',
  'gold', 'silver', 'platinum', 'palladium',
  // 광업
  'mine', 'mining', 'mineral', 'ore', 'refining', 'smelting', 'concentrate',
  'commodity', 'commodities', 'raw material', 'critical mineral',
  // 관련 회사/지역
  'exxon', 'chevron', 'shell', 'bp ', 'total energies', 'equinor',
  'freeport', 'glencore', 'bhp', 'rio tinto', 'vale', 'mp materials',
  'saudi aramco', 'sinopec', 'gazprom', 'novatek',
  // 시장
  'lme', 'nymex', 'eia', 'iea', 'usgs', 'market', 'supply', 'demand', 'price',
];

function isRawMaterialRelated(text) {
  const lower = (text || '').toLowerCase();
  return RAW_KEYWORDS.some(kw => lower.includes(kw));
}

// ── category 자동 분류 ────────────────────────────────────
const CATEGORY_HINTS = [
  { keywords: ['oil', 'crude', 'brent', 'wti', 'opec', 'petroleum', 'refinery', 'gasoline', 'diesel', 'barrel', 'offshore', 'shale', 'exxon', 'chevron', 'shell', 'aramco', 'sinopec'], category: 'oil' },
  { keywords: ['natural gas', 'lng', 'pipeline', 'gazprom', 'novatek', 'qatarenergy', 'methane', 'liquefied'], category: 'naturalgas' },
  { keywords: ['coal', 'coking coal', 'thermal coal', 'metallurgical coal', 'anthracite', 'shenhua'], category: 'coal' },
  { keywords: ['copper', 'freeport', 'scco', 'codelco', 'electro', 'cathode'], category: 'copper' },
  { keywords: ['iron ore', 'steel', 'bhp', 'rio tinto', 'vale', 'blast furnace', 'pig iron'], category: 'iron' },
  { keywords: ['aluminum', 'aluminium', 'bauxite', 'alcoa', 'rusal'], category: 'industrial' },
  { keywords: ['nickel', 'cobalt', 'battery', 'ev ', 'electric vehicle', 'cathode material'], category: 'battery' },
  { keywords: ['lithium', 'albemarle', 'sqm', 'livent', 'brine', 'spodumene'], category: 'lithium' },
  { keywords: ['rare earth', 'neodymium', 'dysprosium', 'terbium', 'mp materials', 'lynas', 'hree', 'lree'], category: 'rare-earth' },
  { keywords: ['gallium', 'germanium', 'indium', 'tellurium', 'semiconductor material', 'compound semiconductor'], category: 'tech' },
  { keywords: ['gold', 'silver', 'platinum', 'palladium', 'precious metal', 'newmont', 'agnico'], category: 'precious' },
  { keywords: ['glencore', 'teck', 'bhp', 'diversified mining', 'base metal'], category: 'industrial' },
];

function guessCategory(text) {
  const lower = (text || '').toLowerCase();
  for (const { keywords, category } of CATEGORY_HINTS) {
    if (keywords.some(kw => lower.includes(kw))) return category;
  }
  return 'industrial';
}

// ── Finnhub 뉴스 조회 ──────────────────────────────────────
async function fetchFinnhubNews(token) {
  const today = new Date();
  const from  = new Date(today);
  from.setDate(from.getDate() - 14);

  const fmt = d => d.toISOString().slice(0, 10);
  const results = [];

  const BATCH = 5;
  for (let i = 0; i < FINNHUB_TICKERS.length; i += BATCH) {
    const batch = FINNHUB_TICKERS.slice(i, i + BATCH);
    const settled = await Promise.allSettled(
      batch.map(async ticker => {
        const url = `https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=${fmt(from)}&to=${fmt(today)}&token=${token}`;
        const res = await fetch(url, { next: { revalidate: 3600 } });
        if (!res.ok) return [];
        const items = await res.json();
        if (!Array.isArray(items)) return [];

        return items
          .filter(n => n.headline && isRawMaterialRelated(n.headline + ' ' + (n.summary || '')))
          .slice(0, 3)
          .map(n => ({
            id:       `raw-finnhub-${ticker}-${n.id}`,
            tickers:  [ticker],
            category: TICKER_CATEGORY[ticker] ?? guessCategory(n.headline),
            type:     'news',
            title:    n.headline,
            summary:  n.summary || n.headline,
            date:     new Date(n.datetime * 1000).toISOString().slice(0, 10),
            source:   n.source || 'Finnhub',
            url:      n.url || '#',
            _live:    true,
          }));
      })
    );

    for (const r of settled) {
      if (r.status === 'fulfilled') results.push(...r.value);
    }

    if (i + BATCH < FINNHUB_TICKERS.length) {
      await new Promise(r => setTimeout(r, 200));
    }
  }

  return results;
}

// ── RSS 파싱 ──────────────────────────────────────────────
async function fetchRssFeeds() {
  const results = [];

  await Promise.allSettled(
    RSS_FEEDS.map(async feed => {
      try {
        const res = await fetch(feed.url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RawMat-Dashboard/1.0)' },
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) return;
        const xml = await res.text();

        const items = [...xml.matchAll(/<item[^>]*>([\s\S]*?)<\/item>/gi)];

        for (const [, body] of items.slice(0, 10)) {
          const title   = (body.match(/<title[^>]*><!\[CDATA\[([\s\S]*?)\]\]>/i) ||
                           body.match(/<title[^>]*>([\s\S]*?)<\/title>/i))?.[1]?.trim() ?? '';
          const link    = (body.match(/<link[^>]*>([\s\S]*?)<\/link>/i))?.[1]?.trim() ?? '#';
          const pubDate = (body.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i))?.[1]?.trim() ?? '';
          const desc    = (body.match(/<description[^>]*><!\[CDATA\[([\s\S]*?)\]\]>/i) ||
                           body.match(/<description[^>]*>([\s\S]*?)<\/description>/i))?.[1]
                           ?.replace(/<[^>]+>/g, '').trim() ?? '';

          const combined = title + ' ' + desc;
          if (!title || !isRawMaterialRelated(combined)) continue;

          const date     = pubDate ? new Date(pubDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
          const id       = `raw-rss-${feed.source}-${Buffer.from(title).toString('base64').slice(0, 16)}`;
          const category = feed.category ?? guessCategory(combined);
          const cleanTitle = title
            .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
            .replace(/&#\d+;/g, '').trim();

          results.push({
            id,
            tickers:  feed.tickers,
            category,
            type:     'news',
            title:    cleanTitle,
            summary:  desc.replace(/<[^>]+>/g, '').slice(0, 220) + (desc.length > 220 ? '…' : ''),
            date,
            source:   feed.source,
            url:      link,
            _live:    true,
          });
        }
      } catch {
        // 조용히 무시
      }
    })
  );

  return results;
}

// ── 중복 제거 ─────────────────────────────────────────────
function dedup(items) {
  const seen = new Set();
  return items.filter(item => {
    const key = item.url === '#' ? item.title : item.url;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ── API Route ─────────────────────────────────────────────
export async function GET() {
  const token = process.env.FINNHUB_API_KEY;
  if (!token) {
    return NextResponse.json({ error: 'FINNHUB_API_KEY 없음' }, { status: 500 });
  }

  if (_cache && Date.now() - _cacheTs < CACHE_TTL) {
    return NextResponse.json(_cache, { headers: { 'X-Cache': 'HIT' } });
  }

  try {
    const [finnhubItems, rssItems] = await Promise.all([
      fetchFinnhubNews(token),
      fetchRssFeeds(),
    ]);

    const all = dedup([...finnhubItems, ...rssItems]);
    all.sort((a, b) => b.date.localeCompare(a.date));
    const result = all.slice(0, 100);

    _cache   = result;
    _cacheTs = Date.now();

    console.log(`[raw-news] 수집 완료: Finnhub ${finnhubItems.length}개 + RSS ${rssItems.length}개 → 중복제거 후 ${result.length}개`);

    return NextResponse.json(result, {
      headers: {
        'X-Cache':         'MISS',
        'X-Finnhub-Count': String(finnhubItems.length),
        'X-RSS-Count':     String(rssItems.length),
        'X-Total':         String(result.length),
      },
    });
  } catch (err) {
    console.error('[raw-news] 오류:', err.message);
    return NextResponse.json({ error: err.message }, { status: 502 });
  }
}
