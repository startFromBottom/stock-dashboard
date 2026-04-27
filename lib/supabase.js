import { createClient } from '@supabase/supabase-js';

/**
 * Supabase 클라이언트 (서버·클라이언트 양쪽에서 사용 가능)
 *
 * 1단계 (Phase A): 단일 사용자 가정, RLS 미사용.
 * - publishable key (또는 legacy anon key) 사용
 * - 본인 PC에서만 접속 가정
 *
 * 2단계로 갈 때 변경할 부분:
 * - watchlist 테이블에 user_id 컬럼 추가
 * - RLS policy 활성화
 * - 클라이언트에서 supabase.auth.getUser()로 user_id 자동 첨부
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.warn('[supabase] 환경변수 누락 — .env.local에 NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY 설정 필요');
}

export const supabase = (url && key) ? createClient(url, key, {
  auth: { persistSession: false }, // 1단계는 인증 안 씀
}) : null;

export const isSupabaseConfigured = () => !!(url && key);
