import { NextResponse } from 'next/server';
import { SECTOR_ETFS } from '@/data/etfs';
import { LAYERS as AI_LAYERS } from '@/data/companies';
import { SEMI_CHAIN } from '@/data/semiconductor';
import { SPACE_LAYERS } from '@/data/spaceCompanies';
import { ENERGY_TYPES } from '@/data/energyCompanies';
import { BIOTECH_LAYERS } from '@/data/biotechCompanies';
import { FINTECH_LAYERS } from '@/data/fintechCompanies';
import { HEALTHCARE_LAYERS } from '@/data/healthcareCompanies';
import { QUANTUM_LAYERS } from '@/data/quantumCompanies';
import { STAPLES_LAYERS } from '@/data/staplesCompanies';
import { DISCRETIONARY_LAYERS } from '@/data/discretionaryCompanies';
import { FINANCIAL_LAYERS } from '@/data/financialCompanies';
import { INDUSTRIALS_LAYERS } from '@/data/industrialsCompanies';
import { fetchQuotesAndMetrics } from '@/lib/finnhub-cache';

/**
 * /api/sector-overview  (metric 기반, candle 미사용)
 *
 * Finnhub 무료 플랜에서 /stock/candle 차단됨 → /stock/metric의 사전계산 필드들로 대체.
 *
 * ETF 지표 (각 섹터 대표 ETF 1개):
 *   - 기간별 수익률 → 5DayPriceReturnDaily / monthToDatePriceReturnDaily /
 *                    13WeekPriceReturnDaily / yearToDatePriceReturnDaily / 52WeekPriceReturnDaily
 *   - 1D 수익률    → /quote 의 dp (metric엔 없음)
 *   - 변동성       → 3MonthADReturnStd  (3개월 일간 수익률 표준편차, 연율화)
 *   - 거래 활성도  → 10DayAverageTradingVolume / 3MonthAverageTradingVolume
 *   - 52주 가격대  → 52WeekHigh / 52WeekLow + /quote 현재가  → 카드의 위치 마커
 *
 * 회사 지표 (섹터 미국 Top 8):
 *   - 시총 가중 일간 등락 → /quote dp + /stock/metric marketCapitalization
 *   - PER 중앙값          → /stock/metric peNormalizedAnnual / peTTM 폴백
 *
 * 응답 캐시: 15분
 */

const RESPONSE_CACHE_TTL = 15 * 60 * 1000;
let responseCache = null;

/* ───────────── 섹터 → 회사 ticker 풀 ───────────── */

function isUsTicker(t) {
  if (!t) return false;
  if (t === 'Private' || t === '비상장 (국영)' || t === '(AMD 합산)' || t === '비상장') return false;
  return /^[A-Z]{1,6}$/.test(t) || /^[A-Z]{1,5}\.?[A-Z]?$/.test(t);
}

function takeTopUs(layersOrComponents, key, max = 8) {
  const out = [];
  const seen = new Set();
  for (const top of layersOrComponents) {
    const components = top.components ?? [top];
    for (const comp of components) {
      const pool = comp[key] ?? [];
      for (const c of pool.slice(0, 10)) {
        if (!isUsTicker(c.ticker)) continue;
        if (seen.has(c.ticker)) continue;
        seen.add(c.ticker);
        out.push(c.ticker);
        if (out.length >= max) return out;
      }
    }
  }
  return out;
}

function getSectorTickerPools() {
  // 섹터당 5개 — 시총 가중 평균은 상위 1~3개가 거의 모든 영향력 차지하므로 5개면 충분.
  // Finnhub 무료 60 req/min 한도 안전권 유지용.
  return {
    'ai-dc':         takeTopUs(AI_LAYERS,            'candidates', 5),
    'semi':          takeTopUs(SEMI_CHAIN,           'candidates', 5),
    'space':         takeTopUs(SPACE_LAYERS,         'candidates', 5),
    'energy':        takeTopUs(ENERGY_TYPES,         'companies',  5),
    'biotech':       takeTopUs(BIOTECH_LAYERS,       'candidates', 5),
    'fintech':       takeTopUs(FINTECH_LAYERS,       'candidates', 5),
    'healthcare':    takeTopUs(HEALTHCARE_LAYERS,    'candidates', 5),
    'quantum':       takeTopUs(QUANTUM_LAYERS,       'candidates', 5),
    'staples':       takeTopUs(STAPLES_LAYERS,       'candidates', 5),
    'discretionary': takeTopUs(DISCRETIONARY_LAYERS, 'candidates', 5),
    'financials':    takeTopUs(FINANCIAL_LAYERS,     'candidates', 5),
    'industrials':   takeTopUs(INDUSTRIALS_LAYERS,   'candidates', 5),
    'raw':           [],
  };
}

/* ───────────── ETF metric 가공 ───────────── */

function buildEtfMetrics(metric, quote) {
  if (!metric) return null;

  const num = (x) => (typeof x === 'number' && !isNaN(x)) ? x : null;

  const returns = {
    '1D':  num(quote?.changePct),
    '5D':  num(metric['5DayPriceReturnDaily']),
    'MTD': num(metric.monthToDatePriceReturnDaily),
    '3M':  num(metric['13WeekPriceReturnDaily']),
    'YTD': num(metric.yearToDatePriceReturnDaily),
    '1Y':  num(metric['52WeekPriceReturnDaily']),
  };

  // 변동성: 3MonthADReturnStd (연율화 일간 변동성 %)
  // Finnhub는 이미 "%" 단위로 줌. 하루 변동성으로 환산: σ_daily = σ_annual / sqrt(252)
  const annualStd = num(metric['3MonthADReturnStd']);
  const volatilityDailyPct = annualStd !== null
    ? Math.round((annualStd / Math.sqrt(252)) * 100) / 100
    : null;

  // 거래 활성도: 10일 평균 / 3개월 평균
  const v10 = num(metric['10DayAverageTradingVolume']);
  const v3m = num(metric['3MonthAverageTradingVolume']);
  const turnoverRatio = (v10 && v3m && v3m > 0)
    ? Math.round((v10 / v3m) * 100) / 100
    : null;

  // 52주 가격대 위치 (0~100)
  const high52 = num(metric['52WeekHigh']);
  const low52  = num(metric['52WeekLow']);
  const price  = num(quote?.price);
  let pricePosition52w = null;
  if (high52 && low52 && price && high52 > low52) {
    pricePosition52w = Math.max(0, Math.min(100,
      ((price - low52) / (high52 - low52)) * 100
    ));
    pricePosition52w = Math.round(pricePosition52w);
  }

  return {
    returns,
    volatilityPct: volatilityDailyPct,
    annualVolPct: annualStd !== null ? Math.round(annualStd * 100) / 100 : null,
    turnoverRatio,
    beta: num(metric.beta) !== null ? Math.round(num(metric.beta) * 100) / 100 : null,
    high52,
    low52,
    price,
    pricePosition52w,
  };
}

/* ───────────── 유틸 ───────────── */

function median(arr) {
  const xs = arr.filter(x => typeof x === 'number' && !isNaN(x) && x > 0).sort((a, b) => a - b);
  if (xs.length === 0) return null;
  const m = Math.floor(xs.length / 2);
  return xs.length % 2 ? xs[m] : (xs[m - 1] + xs[m]) / 2;
}

/* ───────────── 메인 핸들러 ───────────── */

export async function GET() {
  const token = process.env.FINNHUB_API_KEY;
  if (!token) {
    return NextResponse.json({ error: 'FINNHUB_API_KEY 없음' }, { status: 500 });
  }

  const now = Date.now();
  // 응답 캐시 — 단, 캐시된 응답이 회사 데이터 결측을 포함하면 무효 처리해서 재시도
  if (responseCache && (now - responseCache.ts < RESPONSE_CACHE_TTL)) {
    return NextResponse.json(responseCache.data, { headers: { 'X-Cache': 'HIT' } });
  }

  const sectorIds = ['ai-dc', 'semi', 'space', 'raw', 'energy', 'biotech', 'fintech', 'healthcare', 'quantum', 'staples', 'discretionary', 'financials', 'industrials'];
  const tickerPools = getSectorTickerPools();

  // 1. 각 섹터 대표 ETF
  const repEtfs = {};
  for (const sid of sectorIds) {
    const list = SECTOR_ETFS[sid] ?? [];
    if (list.length > 0) repEtfs[sid] = list[0].ticker;
  }
  const etfTickers = [...new Set(Object.values(repEtfs))];

  // 2. 회사 ticker 평탄화 (중복 제거)
  const allCompanyTickers = [...new Set(Object.values(tickerPools).flat())];

  // 3. ETF + 회사 모두 quote + metric 호출. 공유 캐시 사용.
  const allTickers = [...new Set([...etfTickers, ...allCompanyTickers])];
  const { quotes, metrics } = await fetchQuotesAndMetrics(allTickers, token);

  // 4. 섹터별 결과 조립
  const result = {};
  for (const sid of sectorIds) {
    const etfTicker = repEtfs[sid];
    const etfMetrics = buildEtfMetrics(metrics[etfTicker], quotes[etfTicker]);

    const pool = tickerPools[sid];

    // 시총 가중 일간 등락
    let weightedToday = null;
    let totalCap = 0;
    let weightedSum = 0;
    let companiesUsed = 0;
    const peValues = [];
    for (const t of pool) {
      const q = quotes[t];
      const m = metrics[t];
      const cap = m?.marketCapitalization ? m.marketCapitalization * 1_000_000 : null;
      if (q && cap && typeof q.changePct === 'number') {
        weightedSum += q.changePct * cap;
        totalCap   += cap;
        companiesUsed++;
      }
      const pe = m?.peNormalizedAnnual ?? m?.peTTM ?? m?.peExclExtraTTM ?? null;
      if (typeof pe === 'number' && pe > 0 && pe < 200) peValues.push(pe);
    }
    if (totalCap > 0) {
      weightedToday = Math.round((weightedSum / totalCap) * 100) / 100;
    }

    const sectorPeMedian = median(peValues);

    result[sid] = {
      etfTicker,
      etfMetrics,
      weightedToday,
      companiesUsed,
      sectorPeMedian: sectorPeMedian ? Math.round(sectorPeMedian * 10) / 10 : null,
    };
  }

  const payload = { generatedAt: now, data: result };

  // 모든 섹터(원자재 제외)에 회사 데이터가 채워졌으면 풀 캐시, 아니면 캐시 안 잡아 다음 호출에 재시도
  const allFilled = sectorIds.every(sid => {
    if (sid === 'raw') return true; // raw는 회사 풀이 없는 게 정상
    return result[sid].companiesUsed > 0;
  });

  if (allFilled) {
    responseCache = { data: payload, ts: now };
  }

  return NextResponse.json(payload, {
    headers: {
      'X-Cache': 'MISS',
      'X-Filled': allFilled ? 'full' : 'partial',
    },
  });
}
