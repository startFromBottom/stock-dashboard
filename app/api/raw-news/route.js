import { NextResponse } from 'next/server';

// ── 서버 사이드 캐시 (1시간) ────────────────────────────────
let _cache = null;
let _cacheTs = 0;
const CACHE_TTL = 60 * 60 * 1000;

// ── 티커 → category 매핑 ──────────────────────────────────
const TICKER_CATEGORY = {
  // 석유
  XOM: 'oil', CVX: 'oil', BP: 'oil', SHEL: 'oil',
  COP: 'oil', EQNR: 'oil', TTE: 'oil', PXD: 'oil',
  MPC: 'oil', PSX: 'oil', VLO: 'oil', OXY: 'oil',
  // 천연가스
  LNG: 'naturalgas', KMI: 'naturalgas', WMB: 'naturalgas',
  AR: 'naturalgas', EQT: 'naturalgas', RRC: 'naturalgas',
  // 석탄
  BTU: 'coal', ARCH: 'coal', CEIX: 'coal', AMR: 'coal',
  // 구리
  FCX: 'copper', SCCO: 'copper',
  // 산업금속
  TECK: 'industrial', BHP: 'industrial', RIO: 'industrial',
  'GLEN.L': 'industrial', AA: 'industrial', NUE: 'iron',
  // 철강
  VALE: 'iron', MT: 'iron', X: 'iron',
  // 리튬·배터리
  ALB: 'lithium', SQM: 'lithium', LTHM: 'lithium', PLL: 'lithium',
  NICKEL: 'battery', NORAM: 'battery',
  // 희토류
  MP: 'rare-earth', LYSCF: 'rare-earth',
  // 귀금속
  NEM: 'gold', AEM: 'gold', GOLD: 'gold', KGC: 'gold',
  WPM: 'silver', PAAS: 'silver', AG: 'silver',
  SBSW: 'precious', PAL: 'precious',
};

// ── Finnhub 조회 티커 ──────────────────────────────────────
const FINNHUB_TICKERS = [
  // 석유 메이저
  'XOM', 'CVX', 'COP', 'EQNR', 'OXY', 'MPC', 'PSX', 'VLO',
  // 천연가스
  'LNG', 'KMI', 'WMB', 'EQT', 'AR',
  // 석탄
  'BTU', 'ARCH', 'CEIX',
  // 구리
  'FCX', 'SCCO',
  // 산업금속
  'BHP', 'RIO', 'VALE', 'TECK', 'AA',
  // 리튬
  'ALB', 'SQM', 'LTHM',
  // 희토류
  'MP',
  // 귀금속
  'NEM', 'AEM', 'GOLD', 'WPM', 'PAAS',
];

// ── Alpha Vantage 조회 키워드 (무료 25콜/일, NEWS_SENTIMENT API) ──
// https://www.alphavantage.co/documentation/#news-sentiment
const AV_TOPICS = [
  'energy_transportation',  // 에너지·운송
  'economy_commodity',      // 원자재 경제
  'finance',                // 금융·시장
];

// ── GDELT 뉴스 검색 쿼리 (완전무료, 실시간) ──────────────────
// https://api.gdeltproject.org/api/v2/doc/doc
const GDELT_QUERIES = [
  { q: '"rare earth" OR "neodymium" OR "dysprosium" OR "critical minerals"', cat: 'rare-earth' },
  { q: '"lithium" OR "cobalt" OR "battery metals" OR "EV battery"',          cat: 'battery'    },
  { q: '"copper price" OR "copper mine" OR "copper supply"',                  cat: 'copper'     },
  { q: '"gold price" OR "gold mining" OR "silver price" OR "precious metal"', cat: 'precious'   },
  { q: '"oil price" OR "crude oil" OR "OPEC" OR "Brent" OR "WTI"',           cat: 'oil'        },
  { q: '"natural gas" OR "LNG" OR "liquefied natural gas" OR "gas price"',    cat: 'naturalgas' },
  { q: '"coal price" OR "coking coal" OR "thermal coal" OR "coal mining"',    cat: 'coal'       },
  { q: '"iron ore" OR "steel price" OR "steel production"',                   cat: 'iron'       },
  { q: '"gallium" OR "germanium" OR "indium" OR "semiconductor materials"',   cat: 'tech'       },
];

// ── RSS 피드 (광업·에너지·원자재 전문 + 주요 금융) ────────────
const RSS_FEEDS = [
  // ── 광업 전문 ──
  {
    url: 'https://www.mining.com/feed/',
    source: 'Mining.com', tickers: [], category: null,
  },
  {
    url: 'https://www.miningweekly.com/rss',
    source: 'Mining Weekly', tickers: [], category: null,
  },
  {
    url: 'https://www.kitco.com/rss/kitcoNewsRSS.xml',
    source: 'Kitco News', tickers: [], category: null,
  },
  {
    url: 'https://www.mining-journal.com/feed',
    source: 'Mining Journal', tickers: [], category: null,
  },
  {
    url: 'https://northernminer.com/feed/',
    source: 'Northern Miner', tickers: [], category: null,
  },
  {
    url: 'https://www.resourceworld.com/feed/',
    source: 'Resource World', tickers: [], category: null,
  },
  // ── 에너지 전문 ──
  {
    url: 'https://oilprice.com/rss/main',
    source: 'OilPrice.com', tickers: [], category: null,
  },
  {
    url: 'https://www.rigzone.com/news/rss/rigzone_latest.aspx',
    source: 'Rigzone', tickers: [], category: 'oil',
  },
  {
    url: 'https://www.offshore-mag.com/rss/content/all',
    source: 'Offshore Magazine', tickers: [], category: 'oil',
  },
  {
    url: 'https://www.naturalgasintel.com/feed/',
    source: 'Natural Gas Intel', tickers: [], category: 'naturalgas',
  },
  {
    url: 'https://lngprime.com/feed/',
    source: 'LNG Prime', tickers: [], category: 'naturalgas',
  },
  {
    url: 'https://ieefa.org/feed/',
    source: 'IEEFA', tickers: [], category: null,
  },
  {
    url: 'https://carbontracker.org/feed/',
    source: 'Carbon Tracker', tickers: [], category: 'coal',
  },
  // ── 귀금속 ──
  {
    url: 'https://www.goldprice.org/rss/gold-price.rss',
    source: 'GoldPrice.org', tickers: [], category: 'precious',
  },
  {
    url: 'https://goldsilver.com/blog/feed/',
    source: 'GoldSilver.com', tickers: [], category: 'precious',
  },
  {
    url: 'https://www.silverseek.com/rss.php',
    source: 'SilverSeek', tickers: [], category: 'silver',
  },
  // ── 원자재 시장·금융 ──
  {
    url: 'https://www.reuters.com/business/energy/rss',
    source: 'Reuters Energy', tickers: [], category: null,
  },
  {
    url: 'https://www.reuters.com/business/commodities/rss',
    source: 'Reuters Commodities', tickers: [], category: null,
  },
  {
    url: 'https://feeds.marketwatch.com/marketwatch/marketpulse/',
    source: 'MarketWatch Pulse', tickers: [], category: null,
  },
  {
    url: 'https://www.ft.com/commodities?format=rss',
    source: 'FT Commodities', tickers: [], category: null,
  },
  {
    url: 'https://seekingalpha.com/feed.xml',
    source: 'Seeking Alpha', tickers: [], category: null,
  },
  // ── 공공기관 ──
  {
    url: 'https://www.iea.org/rss/news.xml',
    source: 'IEA News', tickers: [], category: null,
  },
  {
    url: 'https://www.eia.gov/rss/news.xml',
    source: 'EIA News (US)', tickers: [], category: null,
  },
  {
    url: 'https://www.usgs.gov/news/science-explorer-rss',
    source: 'USGS News', tickers: [], category: null,
  },
  {
    url: 'https://ec.europa.eu/commission/presscorner/api/rss',
    source: 'EU Commission', tickers: [], category: null,
  },
  // ── 배터리·전기차·희토류 ──
  {
    url: 'https://electrek.co/feed/',
    source: 'Electrek', tickers: [], category: 'battery',
  },
  {
    url: 'https://insideevs.com/feed/',
    source: 'InsideEVs', tickers: [], category: 'battery',
  },
  {
    url: 'https://www.benchmarkminerals.com/feed/',
    source: 'Benchmark Mineral Intelligence', tickers: [], category: null,
  },
  {
    url: 'https://rareearth.guru/feed/',
    source: 'Rare Earth Guru', tickers: [], category: 'rare-earth',
  },
  {
    url: 'https://investingnews.com/daily/resource-investing/critical-metals-investing/feed/',
    source: 'INN Critical Metals', tickers: [], category: null,
  },
  // ── 글로벌 파이낸셜 ──
  {
    url: 'https://feeds.bloomberg.com/energy/news.rss',
    source: 'Bloomberg Energy', tickers: [], category: null,
  },
  {
    url: 'https://www.spglobal.com/commodityinsights/en/rss-feed/oil',
    source: 'S&P Commodity Insights', tickers: [], category: null,
  },
  {
    url: 'https://www.argusmedia.com/en/rss-feeds',
    source: 'Argus Media', tickers: [], category: null,
  },
  {
    url: 'https://www.metalbulletin.com/rss',
    source: 'Fastmarkets MB', tickers: [], category: null,
  },
  // ── 아시아 ──
  {
    url: 'https://www.nikkei.com/rss/news.rss',
    source: 'Nikkei', tickers: [], category: null,
  },
  {
    url: 'https://asia.nikkei.com/rss/feed/nar',
    source: 'Nikkei Asia', tickers: [], category: null,
  },
];

// ── 원자재 관련 키워드 필터 ───────────────────────────────
const RAW_KEYWORDS = [
  // 에너지
  'oil', 'crude', 'petroleum', 'brent', 'wti', 'opec', 'refinery', 'gasoline', 'diesel',
  'natural gas', 'lng', 'pipeline', 'shale', 'fracking', 'offshore', 'liquefied',
  'coal', 'coking coal', 'thermal coal', 'metallurgical coal', 'anthracite',
  // 금속·광물
  'copper', 'iron ore', 'steel', 'aluminum', 'aluminium', 'nickel', 'zinc', 'lead',
  'lithium', 'cobalt', 'rare earth', 'neodymium', 'dysprosium', 'terbium',
  'gallium', 'germanium', 'indium', 'tungsten', 'molybdenum', 'vanadium',
  'gold', 'silver', 'platinum', 'palladium', 'rhodium',
  // 광업
  'mine', 'mining', 'mineral', 'ore', 'refining', 'smelting', 'concentrate',
  'commodity', 'commodities', 'raw material', 'critical mineral', 'battery metal',
  'resource', 'deposit', 'reserves', 'extraction',
  // 관련 회사
  'exxon', 'chevron', 'shell', 'total energies', 'equinor', 'conocophillips',
  'freeport', 'glencore', 'bhp', 'rio tinto', 'vale', 'mp materials', 'lynas',
  'albemarle', 'sqm', 'newmont', 'barrick', 'agnico',
  'saudi aramco', 'sinopec', 'petrochina', 'gazprom', 'novatek', 'qatarenergy',
  // 기관·지수
  'lme', 'nymex', 'comex', 'eia', 'iea', 'usgs', 'opec+',
  'supply chain', 'supply', 'demand', 'price', 'spot price',
];

function isRawMaterialRelated(text) {
  const lower = (text || '').toLowerCase();
  return RAW_KEYWORDS.some(kw => lower.includes(kw));
}

// ── category 자동 분류 ────────────────────────────────────
const CATEGORY_HINTS = [
  { keywords: ['oil', 'crude', 'brent', 'wti', 'opec', 'petroleum', 'refinery', 'gasoline', 'diesel', 'barrel', 'offshore', 'shale', 'exxon', 'chevron', 'shell', 'aramco', 'sinopec', 'petrochina', 'conocophillips', 'valero', 'marathon petroleum'], category: 'oil' },
  { keywords: ['natural gas', 'lng', 'pipeline', 'gazprom', 'novatek', 'qatarenergy', 'methane', 'liquefied', 'lng terminal', 'gas price', 'henry hub'], category: 'naturalgas' },
  { keywords: ['coal', 'coking coal', 'thermal coal', 'metallurgical coal', 'anthracite', 'shenhua', 'glencore coal', 'peabody'], category: 'coal' },
  { keywords: ['copper', 'freeport', 'scco', 'codelco', 'antofagasta', 'copper mine', 'copper price', 'cathode copper'], category: 'copper' },
  { keywords: ['iron ore', 'steel', 'bhp', 'rio tinto', 'vale', 'blast furnace', 'pig iron', 'hot rolled', 'rebar', 'nucor', 'arcelormittal'], category: 'iron' },
  { keywords: ['aluminum', 'aluminium', 'bauxite', 'alcoa', 'rusal', 'hydro asa', 'alumina'], category: 'industrial' },
  { keywords: ['nickel', 'cobalt', 'battery metal', 'ev battery', 'cathode material', 'norilsk', 'vale nickel'], category: 'battery' },
  { keywords: ['lithium', 'albemarle', 'sqm', 'livent', 'brine', 'spodumene', 'lithium carbonate', 'lithium hydroxide', 'pilbara', 'greenbushes'], category: 'lithium' },
  { keywords: ['rare earth', 'neodymium', 'dysprosium', 'terbium', 'lanthanum', 'cerium', 'praseodymium', 'mp materials', 'lynas', 'hree', 'lree', 'ndfeb', 'permanent magnet'], category: 'rare-earth' },
  { keywords: ['gallium', 'germanium', 'indium', 'tellurium', 'semiconductor material', 'compound semiconductor', 'gaas', 'gan', 'sic wafer'], category: 'tech' },
  { keywords: ['gold', 'silver', 'platinum', 'palladium', 'rhodium', 'precious metal', 'newmont', 'agnico', 'barrick', 'kinross', 'gold price', 'silver price'], category: 'precious' },
  { keywords: ['glencore', 'teck', 'diversified mining', 'base metal', 'zinc', 'lead', 'manganese'], category: 'industrial' },
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

// ── Alpha Vantage NEWS_SENTIMENT API (무료 25콜/일) ──────────
// https://www.alphavantage.co/documentation/#news-sentiment
async function fetchAlphaVantageNews(avKey) {
  if (!avKey) return [];
  const results = [];

  // 원자재 관련 티커들 직접 조회 (티커별 1콜, 최신 10건)
  const AV_TICKERS = ['XOM', 'CVX', 'FCX', 'ALB', 'NEM', 'MP', 'BHP', 'RIO', 'BTU'];

  await Promise.allSettled(
    AV_TICKERS.map(async ticker => {
      try {
        const url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${ticker}&limit=10&apikey=${avKey}`;
        const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
        if (!res.ok) return;
        const data = await res.json();
        const feed = data?.feed;
        if (!Array.isArray(feed)) return;

        for (const item of feed) {
          if (!item.title || !isRawMaterialRelated(item.title + ' ' + (item.summary || ''))) continue;
          const dateStr = item.time_published?.slice(0, 8); // "20250426T123000" → "20250426"
          const date = dateStr
            ? `${dateStr.slice(0,4)}-${dateStr.slice(4,6)}-${dateStr.slice(6,8)}`
            : new Date().toISOString().slice(0, 10);

          results.push({
            id:       `raw-av-${ticker}-${Buffer.from(item.title).toString('base64').slice(0, 12)}`,
            tickers:  [ticker],
            category: TICKER_CATEGORY[ticker] ?? guessCategory(item.title),
            type:     'news',
            title:    item.title,
            summary:  (item.summary || item.title).slice(0, 220),
            date,
            source:   item.source || 'Alpha Vantage',
            url:      item.url || '#',
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

// ── GDELT DOC 2.0 API (완전 무료, 실시간 뉴스 검색) ─────────
// https://api.gdeltproject.org/api/v2/doc/doc
async function fetchGdeltNews() {
  const results = [];

  await Promise.allSettled(
    GDELT_QUERIES.map(async ({ q, cat }) => {
      try {
        const encoded = encodeURIComponent(q);
        // mode=artlist: 기사 목록, maxrecords=10, sourcelang=english
        const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encoded}&mode=artlist&maxrecords=10&sourcelang=english&format=json`;
        const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
        if (!res.ok) return;
        const data = await res.json();
        const articles = data?.articles;
        if (!Array.isArray(articles)) return;

        for (const art of articles) {
          if (!art.title) continue;
          const date = art.seendate
            ? `${art.seendate.slice(0,4)}-${art.seendate.slice(4,6)}-${art.seendate.slice(6,8)}`
            : new Date().toISOString().slice(0, 10);

          results.push({
            id:       `raw-gdelt-${cat}-${Buffer.from(art.title).toString('base64').slice(0, 12)}`,
            tickers:  [],
            category: cat,
            type:     'news',
            title:    art.title,
            summary:  art.title, // GDELT는 요약 미제공, 제목으로 대체
            date,
            source:   art.domain || 'GDELT',
            url:      art.url || '#',
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
  const finnhubKey = process.env.FINNHUB_API_KEY;
  const avKey      = process.env.ALPHA_VANTAGE_API_KEY; // 선택적
  if (!finnhubKey) {
    return NextResponse.json({ error: 'FINNHUB_API_KEY 없음' }, { status: 500 });
  }

  if (_cache && Date.now() - _cacheTs < CACHE_TTL) {
    return NextResponse.json(_cache, { headers: { 'X-Cache': 'HIT' } });
  }

  try {
    // 병렬 수집 (Finnhub + Alpha Vantage + GDELT + RSS)
    const [finnhubItems, avItems, gdeltItems, rssItems] = await Promise.all([
      fetchFinnhubNews(finnhubKey),
      fetchAlphaVantageNews(avKey),
      fetchGdeltNews(),
      fetchRssFeeds(),
    ]);

    const all = dedup([...finnhubItems, ...avItems, ...gdeltItems, ...rssItems]);
    all.sort((a, b) => b.date.localeCompare(a.date));
    const result = all.slice(0, 150); // 원자재는 카테고리 많으므로 150개로 확대

    _cache   = result;
    _cacheTs = Date.now();

    console.log(
      `[raw-news] 수집 완료: Finnhub ${finnhubItems.length}개` +
      ` + AV ${avItems.length}개` +
      ` + GDELT ${gdeltItems.length}개` +
      ` + RSS ${rssItems.length}개` +
      ` → 중복제거 후 ${result.length}개`
    );

    return NextResponse.json(result, {
      headers: {
        'X-Cache':          'MISS',
        'X-Finnhub-Count':  String(finnhubItems.length),
        'X-AV-Count':       String(avItems.length),
        'X-GDELT-Count':    String(gdeltItems.length),
        'X-RSS-Count':      String(rssItems.length),
        'X-Total':          String(result.length),
      },
    });
  } catch (err) {
    console.error('[raw-news] 오류:', err.message);
    return NextResponse.json({ error: err.message }, { status: 502 });
  }
}
