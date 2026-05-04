'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * 페이지 로드 즉시 Supabase 세션을 부팅 처리하는 컴포넌트.
 *
 * 왜 필요한가:
 * - Supabase OAuth 콜백 후 URL에 #access_token=... fragment가 붙어 돌아옴
 * - lib/supabase.js의 detectSessionInUrl: true 옵션은 자동 파싱하긴 하지만
 *   타이밍상 useAuth 훅이 마운트되기 전이면 토큰이 URL에 남아있는 경우가 있음
 * - 이 컴포넌트가 layout 최상위에 마운트되어 페이지 hydration 직후
 *   supabase.auth.getSession()을 강제 호출해서 토큰을 처리하고 URL을 깨끗하게 함
 *
 * 렌더링하는 게 없음 (null 반환).
 */
export default function SupabaseSessionBoot() {
  useEffect(() => {
    // ── 임시 디버그: Vercel에 NEXT_PUBLIC_* 환경변수가 클라이언트 번들에 박혔는지 확인 ──
    // 진단 끝나면 이 두 줄 제거 예정
    console.log('[debug] supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('[debug] supabase KEY prefix:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 30));
    console.log('[debug] supabase client:', supabase ? 'initialized' : 'NULL');

    if (!supabase) return;
    // 페이지 로드 직후 한 번 호출 → URL fragment 토큰 처리 + localStorage 저장
    supabase.auth.getSession()
      .then(({ data, error }) => {
        console.log('[debug] getSession result:', { hasSession: !!data?.session, error });
      })
      .catch((e) => console.log('[debug] getSession threw:', e));
  }, []);

  return null;
}
