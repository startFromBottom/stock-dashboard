import { NextResponse } from 'next/server';

// ── 서버 사이드 캐시 (1시간) ────────────────────────────────
let _cache = null;
let _cacheTs = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1시간

// ── 티커 → category 매핑 ──────────────────────────────────
const TICKER_CATEGORY = {
  NVDA:        'gpu',
  AVGO:        'gpu',
  AMD:         'gpu',
  INTC:        'gpu',
  MRVL:        'gpu',
  ARM:         'gpu',
  QCOM:        'gpu',
  TSM:         'gpu',
  MU:          'memory',
  '000660.KS': 'memory',
  '005930.KS': 'memory',
  RMBS:        'memory',
  DELL:        'server',
  SMCI:        'server',
  HPE:         'server',
  IBM:         'server',
  PSTG:        'storage',
  NTAP:        'storage',
  WDC:         'storage',
  STX:         'storage',
  ANET:        'ai-network',
  CSCO:        'ai-network',
  JNPR:        'ai-network',
  NOK:         'ai-network',
  ERIC:        'ai-network',
  COHR:        'optics',
  LITE:        'optics',
  FN:          'optics',
  MSFT:        'hyperscaler',
  GOOGL:       'hyperscaler',
  AMZN:        'hyperscaler',
  META:        'hyperscaler',
  ORCL:        'hyperscaler',
  BABA:        'hyperscaler',
  CRWV:        'hyperscaler',
  EQIX:        'facility',
  DLR:         'facility',
  IRM:         'facility',
  AMT:         'facility',
  VRT:         'power',         // power + cooling 둘 다지만 power로 우선
  ETN:         'power',
  EMR:         'power',
  HUBB:        'power',
  MOD:         'cooling',
  JCI:         'cooling',
  CARR:        'cooling',
  TT:          'cooling',
  PWR:         'construction',
  EME:         'construction',
  ACM:         'construction',
  NEE:         'energy',
  CEG:         'energy',
  VST:         'energy',
  DUK:         'energy',
  SO:          'energy',
};

// ── 핵심 티커 목록 (Finnhub 무료 티어: 미국 주식만 안정적) ──
const FINNHUB_TICKERS = [
  'NVDA', 'AVGO', 'AMD', 'INTC', 'MRVL', 'ARM',
  'MU',
  'DELL', 'SMCI', 'HPE',
  'ANET', 'CSCO',
  'MSFT', 'GOOGL', 'AMZN', 'META', 'ORCL',
  'EQIX', 'DLR',
  'VRT', 'ETN',
  'NEE', 'CEG', 'VST',
  'COHR',
];

// ── RSS 피드 목록 ─────────────────────────────────────────
const RSS_FEEDS = [
  {
    url: 'https://nvidianews.nvidia.com/rss',
    source: 'NVIDIA Newsroom',
    tickers: ['NVDA'],
    category: 'gpu',
  },
  {
    url: 'https://aws.amazon.com/blogs/machine-learning/feed/',
    source: 'AWS ML Blog',
    tickers: ['AMZN'],
    category: 'hyperscaler',
  },
  {
    url: 'https://cloud.google.com/blog/rss.xml',
    source: 'Google Cloud Blog',
    tickers: ['GOOGL'],
    category: 'hyperscaler',
  },
  {
    url: 'https://azure.microsoft.com/en-us/blog/feed/',
    source: 'Microsoft Azure Blog',
    tickers: ['MSFT'],
    category: 'hyperscaler',
  },
];

// AI/데이터센터 관련 키워드 필터
const AI_KEYWORDS = [
  'ai', 'artificial intelligence', 'datacenter', 'data center', 'gpu', 'hbm',
  'inference', 'training', 'llm', 'machine learning', 'deep learning',
  'nvidia', 'cloud', 'supercomputer', 'accelerator', 'chip', 'semiconductor',
  'hyperscaler', 'transformer', 'workload', 'compute', 'generative',
];

function isAiRelated(text) {
  const lower = (text || '').toLowerCase();
  return AI_KEYWORDS.some(kw => lower.includes(kw));
}

// ── Finnhub 뉴스 조회 ──────────────────────────────────────
async function fetchFinnhubNews(token) {
  const today = new Date();
  const from  = new Date(today);
  from.setDate(from.getDate() - 14); // 최근 2주

  const fmt = d => d.toISOString().slice(0, 10);
  const results = [];

  // 5개씩 병렬, 배치 간 200ms 딜레이
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
          .filter(n => n.headline && isAiRelated(n.headline + ' ' + (n.summary || '')))
          .slice(0, 3) // 티커당 최대 3개
          .map(n => ({
            id:       `finnhub-${ticker}-${n.id}`,
            tickers:  [ticker],
            category: TICKER_CATEGORY[ticker] ?? 'gpu',
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

// ── RSS 파싱 (간단한 정규식 파서, xml2js 없이) ────────────
async function fetchRssFeeds() {
  const results = [];

  await Promise.allSettled(
    RSS_FEEDS.map(async feed => {
      try {
        const res = await fetch(feed.url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AI-DC-Dashboard/1.0)' },
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) return;
        const xml = await res.text();

        // <item> 파싱
        const items = [...xml.matchAll(/<item[^>]*>([\s\S]*?)<\/item>/gi)];

        for (const [, body] of items.slice(0, 10)) {
          const title   = (body.match(/<title[^>]*><!\[CDATA\[([\s\S]*?)\]\]>/i) ||
                           body.match(/<title[^>]*>([\s\S]*?)<\/title>/i))?.[1]?.trim() ?? '';
          const link    = (body.match(/<link[^>]*>([\s\S]*?)<\/link>/i))?.[1]?.trim() ?? '#';
          const pubDate = (body.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i))?.[1]?.trim() ?? '';
          const desc    = (body.match(/<description[^>]*><!\[CDATA\[([\s\S]*?)\]\]>/i) ||
                           body.match(/<description[^>]*>([\s\S]*?)<\/description>/i))?.[1]
                           ?.replace(/<[^>]+>/g, '').trim() ?? '';

          if (!title || !isAiRelated(title + ' ' + desc)) continue;

          const date = pubDate ? new Date(pubDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
          const id   = `rss-${feed.source}-${Buffer.from(title).toString('base64').slice(0, 16)}`;

          results.push({
            id,
            tickers:  feed.tickers,
            category: feed.category,
            type:     'news',
            title:    title.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'),
            summary:  desc.slice(0, 200) + (desc.length > 200 ? '…' : ''),
            date,
            source:   feed.source,
            url:      link,
            _live:    true,
          });
        }
      } catch {
        // RSS 실패는 조용히 무시
      }
    })
  );

  return results;
}

// ── 중복 제거 (URL 기준) ──────────────────────────────────
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

  // 캐시 히트
  if (_cache && Date.now() - _cacheTs < CACHE_TTL) {
    return NextResponse.json(_cache, { headers: { 'X-Cache': 'HIT' } });
  }

  try {
    // 병렬 수집
    const [finnhubItems, rssItems] = await Promise.all([
      fetchFinnhubNews(token),
      fetchRssFeeds(),
    ]);

    const all = dedup([...finnhubItems, ...rssItems]);

    // 날짜 내림차순 정렬, 최대 100개
    all.sort((a, b) => b.date.localeCompare(a.date));
    const result = all.slice(0, 100);

    _cache   = result;
    _cacheTs = Date.now();

    console.log(`[news] 수집 완료: Finnhub ${finnhubItems.length}개 + RSS ${rssItems.length}개 → 중복제거 후 ${result.length}개`);

    return NextResponse.json(result, {
      headers: {
        'X-Cache':   'MISS',
        'X-Sources': `finnhub:${finnhubItems.length},rss:${rssItems.length}`,
      },
    });
  } catch (err) {
    console.error('[news] 오류:', err.message);
    return NextResponse.json({ error: err.message }, { status: 502 });
  }
}
