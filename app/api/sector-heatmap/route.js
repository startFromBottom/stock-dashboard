import { NextResponse } from 'next/server';
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
 * /api/sector-heatmap?sectors=ai-dc,semi
 *
 * 지정한 섹터들의 회사 12개 기준 데이터(시총·등락률·이름·PER)를 반환.
 * sector-overview와 ticker 캐시 공유 → 카드용 5개는 즉시 캐시 히트, 추가 7개만 새로 fetch.
 *
 * 클라이언트가 모멘텀 핫한 섹터 순으로 차례차례 호출 → 점진 로딩.
 */

/* ───────────── ticker 풀 (12개) ───────────── */

function isUsTicker(t) {
  if (!t) return false;
  if (t === 'Private' || t === '비상장 (국영)' || t === '(AMD 합산)' || t === '비상장') return false;
  return /^[A-Z]{1,6}$/.test(t) || /^[A-Z]{1,5}\.?[A-Z]?$/.test(t);
}

/**
 * 섹터의 candidates/companies 풀에서 미국 ticker만 max개. 회사명도 같이 보존.
 */
function takeTopUsWithMeta(layersOrComponents, key, max = 12) {
  const out = [];
  const seen = new Set();
  for (const top of layersOrComponents) {
    const components = top.components ?? [top];
    for (const comp of components) {
      const pool = comp[key] ?? [];
      for (const c of pool.slice(0, 15)) {
        if (!isUsTicker(c.ticker)) continue;
        if (seen.has(c.ticker)) continue;
        seen.add(c.ticker);
        out.push({ ticker: c.ticker, name: c.name, layerName: comp.name ?? null });
        if (out.length >= max) return out;
      }
    }
  }
  return out;
}

const SECTOR_POOLS = {
  'ai-dc':         () => takeTopUsWithMeta(AI_LAYERS,            'candidates', 12),
  'semi':          () => takeTopUsWithMeta(SEMI_CHAIN,           'candidates', 12),
  'space':         () => takeTopUsWithMeta(SPACE_LAYERS,         'candidates', 12),
  'energy':        () => takeTopUsWithMeta(ENERGY_TYPES,         'companies',  12),
  'biotech':       () => takeTopUsWithMeta(BIOTECH_LAYERS,       'candidates', 12),
  'fintech':       () => takeTopUsWithMeta(FINTECH_LAYERS,       'candidates', 12),
  'healthcare':    () => takeTopUsWithMeta(HEALTHCARE_LAYERS,    'candidates', 12),
  'quantum':       () => takeTopUsWithMeta(QUANTUM_LAYERS,       'candidates', 12),
  'staples':       () => takeTopUsWithMeta(STAPLES_LAYERS,       'candidates', 12),
  'discretionary': () => takeTopUsWithMeta(DISCRETIONARY_LAYERS, 'candidates', 12),
  'financials':    () => takeTopUsWithMeta(FINANCIAL_LAYERS,     'candidates', 12),
  'industrials':   () => takeTopUsWithMeta(INDUSTRIALS_LAYERS,   'candidates', 12),
  'raw':           () => [], // 데이터 구조가 달라서 비움
};

/* ───────────── 메인 핸들러 ───────────── */

export async function GET(request) {
  const token = process.env.FINNHUB_API_KEY;
  if (!token) {
    return NextResponse.json({ error: 'FINNHUB_API_KEY 없음' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const requested = (searchParams.get('sectors') ?? 'ai-dc,semi,space,raw,energy,biotech,fintech,healthcare,quantum,staples,discretionary,financials,industrials')
    .split(',')
    .map(s => s.trim())
    .filter(s => s in SECTOR_POOLS);

  if (requested.length === 0) {
    return NextResponse.json({ error: '유효한 섹터 없음' }, { status: 400 });
  }

  // 섹터별 ticker 풀 + 평탄화
  const pools = {};
  const allTickers = new Set();
  for (const sid of requested) {
    const pool = SECTOR_POOLS[sid]();
    pools[sid] = pool;
    for (const c of pool) allTickers.add(c.ticker);
  }

  // 공유 캐시로 fetch (이미 sector-overview가 받은 ticker는 즉시 히트)
  const { quotes, metrics } = await fetchQuotesAndMetrics([...allTickers], token);

  // 섹터별 결과 조립
  const result = {};
  for (const sid of requested) {
    const companies = pools[sid].map(c => {
      const q = quotes[c.ticker];
      const m = metrics[c.ticker];
      const mktcap = m?.marketCapitalization ? m.marketCapitalization * 1_000_000 : null;
      const pe = m?.peNormalizedAnnual ?? m?.peTTM ?? m?.peExclExtraTTM ?? null;
      return {
        ticker: c.ticker,
        name: c.name,
        layerName: c.layerName,
        mktcap,
        changePct: typeof q?.changePct === 'number' ? q.changePct : null,
        price: q?.price ?? null,
        pe: typeof pe === 'number' ? pe : null,
      };
    }).filter(c => c.mktcap !== null && c.changePct !== null); // 둘 다 있어야 트리맵에 그릴 수 있음

    result[sid] = companies;
  }

  return NextResponse.json(
    { generatedAt: Date.now(), data: result },
    { headers: { 'X-Cache': 'shared-ticker' } }
  );
}
