import { NextResponse } from 'next/server';
import { getAlphaVantageRSI } from '@/lib/alpha-vantage';

/**
 * /api/stock-rsi?ticker=NVDA
 *
 * 단일 종목의 RSI(14, daily)을 Alpha Vantage에서 받아옴.
 * - 6시간 캐시 (lib/alpha-vantage.js 안에서 자동)
 * - 분당 5회 큐 (lib/alpha-vantage.js 안에서 자동)
 *
 * 응답:
 *   { ticker, rsi: number|null, source: 'alpha-vantage' }
 *
 * 클라이언트(useStockMetrics)는 카드 그리드 렌더 후 이 endpoint를
 * 종목별로 차례차례 호출해서 천천히 채움.
 */

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ticker = (searchParams.get('ticker') || '').trim().toUpperCase();
  if (!ticker) {
    return NextResponse.json({ error: 'ticker required' }, { status: 400 });
  }

  if (!process.env.ALPHA_VANTAGE_API_KEY) {
    return NextResponse.json(
      { ticker, rsi: null, error: 'ALPHA_VANTAGE_API_KEY 미설정' },
      { status: 200 } // 데이터 없음은 200으로 — 클라이언트에서 그냥 null로 처리
    );
  }

  try {
    const rsi = await getAlphaVantageRSI(ticker);
    return NextResponse.json({ ticker, rsi, source: 'alpha-vantage' });
  } catch (e) {
    console.error('[stock-rsi]', ticker, e.message);
    return NextResponse.json({ ticker, rsi: null, error: e.message }, { status: 200 });
  }
}
