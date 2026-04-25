/**
 * 디버그: http://localhost:3000/api/mktcap/debug
 */
import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.FMP_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: 'FMP_API_KEY 없음' }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://financialmodelingprep.com/stable/quote?symbol=NVDA,MSFT,GOOGL&apikey=${apiKey}`
    );
    const raw = await res.json();
    const items = Array.isArray(raw) ? raw : [];

    return NextResponse.json({
      ok: res.ok,
      status: res.status,
      count: items.length,
      sample: items.map(i => ({
        symbol: i.symbol,
        marketCap: i.marketCap,
        formatted: i.marketCap
          ? '$' + (i.marketCap / 1e12).toFixed(2) + '조'
          : null,
      })),
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
