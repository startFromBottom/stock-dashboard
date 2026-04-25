/**
 * 디버그: http://localhost:3000/api/mktcap/debug
 */
import { NextResponse } from 'next/server';

const TEST_TICKERS = ['NVDA', 'MSFT', 'DELL', 'SMCI', 'HPE'];

export async function GET() {
  const token = process.env.FINNHUB_API_KEY;
  if (!token) {
    return NextResponse.json({
      ok: false,
      error: 'FINNHUB_API_KEY 없음 — .env.local에 추가 후 dev 서버 재시작',
    }, { status: 500 });
  }

  const results = await Promise.all(
    TEST_TICKERS.map(async ticker => {
      const url = `https://finnhub.io/api/v1/stock/metric?symbol=${ticker}&metric=all&token=${token}`;
      try {
        const res  = await fetch(url);
        const json = await res.json();
        const mktcapM = json?.metric?.marketCapitalization;
        return {
          symbol:    ticker,
          status:    res.status,
          marketCap: mktcapM ? mktcapM * 1e6 : null,
          formatted: mktcapM
            ? '$' + (mktcapM / 1e6).toFixed(2) + '조'  // mktcapM은 백만 USD
            : null,
        };
      } catch (e) {
        return { symbol: ticker, error: e.message };
      }
    })
  );

  return NextResponse.json({ ok: true, results });
}
