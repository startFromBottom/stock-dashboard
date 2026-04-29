import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isSupabaseConfigured } from '@/lib/supabase';

/**
 * /api/watchlist (Phase B — 인증 적용)
 *
 *   GET    → 자기 워치리스트 조회 (RLS가 user_id 자동 필터)
 *   POST   { ticker, name?, sector?, added_price? }
 *           → 자기 워치리스트에 추가
 *   PATCH  { ticker, buy_price?, buy_shares?, memo? }
 *   DELETE { ticker } 또는 ?ticker=XXX
 *
 * 인증:
 * - 클라이언트가 Authorization: Bearer <access_token> 헤더 첨부
 * - 서버에서 그 토큰을 supabase 클라이언트에 주입 → RLS가 자동으로 user_id 필터링/검증
 * - 토큰 없거나 만료면 401
 */

function notConfiguredResponse() {
  return NextResponse.json(
    { error: 'Supabase 미설정 — .env.local 확인' },
    { status: 503 }
  );
}

function unauthorizedResponse() {
  return NextResponse.json(
    { error: 'unauthorized — 로그인이 필요합니다' },
    { status: 401 }
  );
}

/** 요청 헤더에서 access_token을 받아 인증된 supabase 클라이언트 생성 */
function getAuthedClient(request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const auth = request.headers.get('authorization');
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return null;

  return createClient(url, key, {
    auth: { persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}

/* ── GET ── */
export async function GET(request) {
  if (!isSupabaseConfigured()) return notConfiguredResponse();
  const supa = getAuthedClient(request);
  if (!supa) return unauthorizedResponse();

  // 토큰으로 유저 검증 (RLS가 알아서 막지만, 401을 명시적으로 주려면 user 조회)
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return unauthorizedResponse();

  const { data, error } = await supa
    .from('watchlist')
    .select('*')
    .order('added_at', { ascending: false });

  if (error) {
    console.error('[watchlist] GET 실패:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ items: data ?? [] });
}

/* ── POST ── */
export async function POST(request) {
  if (!isSupabaseConfigured()) return notConfiguredResponse();
  const supa = getAuthedClient(request);
  if (!supa) return unauthorizedResponse();

  const { data: { user } } = await supa.auth.getUser();
  if (!user) return unauthorizedResponse();

  let body;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: 'invalid JSON' }, { status: 400 }); }

  const { ticker, name, sector, added_price } = body ?? {};
  if (!ticker || typeof ticker !== 'string') {
    return NextResponse.json({ error: 'ticker required' }, { status: 400 });
  }

  const insert = {
    ticker: ticker.trim().toUpperCase(),
    name: name ?? null,
    sector: sector ?? null,
    added_price: typeof added_price === 'number' ? added_price : null,
    user_id: user.id, // 명시적으로 첨부 (RLS와 일치)
  };

  const { data, error } = await supa
    .from('watchlist')
    .insert(insert)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'already in watchlist', ticker: insert.ticker }, { status: 409 });
    }
    console.error('[watchlist] POST 실패:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ item: data }, { status: 201 });
}

/* ── PATCH ── */
export async function PATCH(request) {
  if (!isSupabaseConfigured()) return notConfiguredResponse();
  const supa = getAuthedClient(request);
  if (!supa) return unauthorizedResponse();

  const { data: { user } } = await supa.auth.getUser();
  if (!user) return unauthorizedResponse();

  let body;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: 'invalid JSON' }, { status: 400 }); }

  const { ticker, buy_price, buy_shares, memo } = body ?? {};
  if (!ticker || typeof ticker !== 'string') {
    return NextResponse.json({ error: 'ticker required' }, { status: 400 });
  }

  const update = {};
  if ('buy_price'  in body) update.buy_price  = (typeof buy_price  === 'number') ? buy_price  : null;
  if ('buy_shares' in body) update.buy_shares = (typeof buy_shares === 'number') ? buy_shares : null;
  if ('memo'       in body) update.memo       = (typeof memo === 'string') ? memo : null;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'no fields to update' }, { status: 400 });
  }

  const { data, error } = await supa
    .from('watchlist')
    .update(update)
    .eq('ticker', ticker.trim().toUpperCase())
    .eq('user_id', user.id)  // 명시적 (RLS도 막지만 이중방어)
    .select()
    .single();

  if (error) {
    console.error('[watchlist] PATCH 실패:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ item: data });
}

/* ── DELETE ── */
export async function DELETE(request) {
  if (!isSupabaseConfigured()) return notConfiguredResponse();
  const supa = getAuthedClient(request);
  if (!supa) return unauthorizedResponse();

  const { data: { user } } = await supa.auth.getUser();
  if (!user) return unauthorizedResponse();

  let ticker = null;
  try {
    const body = await request.json();
    ticker = body?.ticker;
  } catch {
    const { searchParams } = new URL(request.url);
    ticker = searchParams.get('ticker');
  }

  if (!ticker || typeof ticker !== 'string') {
    return NextResponse.json({ error: 'ticker required' }, { status: 400 });
  }

  const { error } = await supa
    .from('watchlist')
    .delete()
    .eq('ticker', ticker.trim().toUpperCase())
    .eq('user_id', user.id);

  if (error) {
    console.error('[watchlist] DELETE 실패:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
