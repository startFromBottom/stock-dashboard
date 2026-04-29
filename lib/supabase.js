import { createClient } from '@supabase/supabase-js';

/**
 * Supabase 클라이언트 (서버·클라이언트 양쪽에서 사용 가능)
 *
 * Phase B: 인증 활성화 (GitHub OAuth, 향후 Google 추가 예정).
 * - persistSession: true → 새로고침해도 로그인 유지
 * - autoRefreshToken: true → 토큰 만료 시 자동 갱신
 * - detectSessionInUrl: true → OAuth 콜백 URL의 토큰 자동 처리
 *
 * watchlist 테이블에 user_id + RLS 정책 활성. 자기 데이터만 접근 가능.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.warn('[supabase] 환경변수 누락 — .env.local에 NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY 설정 필요');
}

export const supabase = (url && key) ? createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
}) : null;

export const isSupabaseConfigured = () => !!(url && key);
