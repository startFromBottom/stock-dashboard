/**
 * 디버그: http://localhost:3000/api/mktcap/debug
 */
import { NextResponse } from 'next/server';

const TEST_TICKERS = ['NVDA', 'MSFT', 'GOOGL'];

export async function GET() {
  const apiKey = process.env.FMP_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: 'FMP_API_KEY 없음' }, { status: 500 });
  }

  try {
    const results = await Promise.all(
      TEST_TICKERS.map(async ticker => {
        const res = await fetch(
          `https://financialmodelingprep.com/stable/quote?symbol=${ticker}&apikey=${apiKey}`
        );
        const raw = await res.json();
        const item = Array.isArray(raw) ? raw[0] : null;
        return {
          symbol: ticker,
          status: res.status,
          marketCap: item?.marketCap ?? null,
          formatted: item?.marketCap
            ? '$' + (item.marketCap / 1e12).toFixed(2) + '조'
            : null,
        };
      })
    );

    return NextResponse.json({ ok: true, results });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
