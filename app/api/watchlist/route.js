import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

/**
 * /api/watchlist
 *
 *   GET    → 전체 워치리스트 조회 (added_at 내림차순)
 *   POST   { ticker, name?, sector?, added_price? }
 *           → 종목 추가 (이미 있으면 409)
 *   PATCH  { ticker, buy_price?, buy_shares?, memo? }
 *           → 매수가/수량/메모 업데이트
 *   DELETE { ticker } 또는 ?ticker=XXX
 *           → 종목 제거
 */

function notConfiguredResponse() {
  return NextResponse.json(
    { error: 'Supabase 미설정 — .env.local의 NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY 확인' },
    { status: 503 }
  );
}

export async function GET() {
  if (!isSupabaseConfigured()) return notConfiguredResponse();

  const { data, error } = await supabase
    .from('watchlist')
    .select('*')
    .order('added_at', { ascending: false });

  if (error) {
    console.error('[watchlist] GET 실패:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ items: data ?? [] });
}

export async function POST(request) {
  if (!isSupabaseConfigured()) return notConfiguredResponse();

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid JSON' }, { status: 400 });
  }

  const { ticker, name, sector, added_price } = body ?? {};
  if (!ticker || typeof ticker !== 'string') {
    return NextResponse.json({ error: 'ticker required' }, { status: 400 });
  }

  const insert = {
    ticker: ticker.trim().toUpperCase(),
    name: name ?? null,
    sector: sector ?? null,
    added_price: typeof added_price === 'number' ? added_price : null,
  };

  const { data, error } = await supabase
    .from('watchlist')
    .insert(insert)
    .select()
    .single();

  if (error) {
    // unique 제약 위반 (중복 추가)
    if (error.code === '23505') {
      return NextResponse.json({ error: 'already in watchlist', ticker: insert.ticker }, { status: 409 });
    }
    console.error('[watchlist] POST 실패:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ item: data }, { status: 201 });
}

export async function PATCH(request) {
  if (!isSupabaseConfigured()) return notConfiguredResponse();

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid JSON' }, { status: 400 });
  }

  const { ticker, buy_price, buy_shares, memo } = body ?? {};
  if (!ticker || typeof ticker !== 'string') {
    return NextResponse.json({ error: 'ticker required' }, { status: 400 });
  }

  // 업데이트 가능 필드만 추림 (값이 명시적으로 제공된 경우만)
  const update = {};
  if ('buy_price'  in body) update.buy_price  = (typeof buy_price  === 'number') ? buy_price  : null;
  if ('buy_shares' in body) update.buy_shares = (typeof buy_shares === 'number') ? buy_shares : null;
  if ('memo'       in body) update.memo       = (typeof memo === 'string') ? memo : null;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'no fields to update' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('watchlist')
    .update(update)
    .eq('ticker', ticker.trim().toUpperCase())
    .select()
    .single();

  if (error) {
    console.error('[watchlist] PATCH 실패:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ item: data });
}

export async function DELETE(request) {
  if (!isSupabaseConfigured()) return notConfiguredResponse();

  // body 또는 query parameter 둘 다 지원
  let ticker = null;
  try {
    const body = await request.json();
    ticker = body?.ticker;
  } catch {
    // body 없으면 query에서
    const { searchParams } = new URL(request.url);
    ticker = searchParams.get('ticker');
  }

  if (!ticker || typeof ticker !== 'string') {
    return NextResponse.json({ error: 'ticker required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('watchlist')
    .delete()
    .eq('ticker', ticker.trim().toUpperCase());

  if (error) {
    console.error('[watchlist] DELETE 실패:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
