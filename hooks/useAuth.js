'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

/**
 * 전역 인증 상태 훅
 *
 * - user: 현재 로그인 사용자 (null이면 비로그인)
 * - session: 토큰 등 풀 세션 객체
 * - signInWithGitHub() / signInWithGoogle() / signOut()
 *
 * Supabase의 auth.onAuthStateChange로 모든 컴포넌트가 같은 상태 보게 함.
 */

// 모듈 레벨 전역 (subscribe 패턴)
let globalState = {
  user: null,
  session: null,
  loading: true,
  initialized: false,
};
const subscribers = new Set();

function notify() {
  for (const s of subscribers) s();
}

function setGlobalState(next) {
  globalState = { ...globalState, ...next };
  notify();
}

// Supabase 세션 listener — 한 번만 등록
let listenerInitialized = false;
function ensureListener() {
  if (listenerInitialized || !supabase) return;
  listenerInitialized = true;

  // 첫 세션 로드
  supabase.auth.getSession().then(({ data: { session } }) => {
    setGlobalState({
      user: session?.user ?? null,
      session: session ?? null,
      loading: false,
      initialized: true,
    });
  });

  // 이후 변경 listen
  supabase.auth.onAuthStateChange((event, session) => {
    setGlobalState({
      user: session?.user ?? null,
      session: session ?? null,
      loading: false,
      initialized: true,
    });
  });
}

export default function useAuth() {
  const [, force] = useState(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    ensureListener();
    const sub = () => mountedRef.current && force(n => n + 1);
    subscribers.add(sub);
    return () => {
      mountedRef.current = false;
      subscribers.delete(sub);
    };
  }, []);

  const signInWithGitHub = async () => {
    if (!supabase) return { error: 'Supabase 미설정' };
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
      },
    });
    return { data, error };
  };

  const signInWithGoogle = async () => {
    if (!supabase) return { error: 'Supabase 미설정' };
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
      },
    });
    return { data, error };
  };

  const signOut = async () => {
    if (!supabase) return { error: 'Supabase 미설정' };
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user: globalState.user,
    session: globalState.session,
    loading: globalState.loading,
    initialized: globalState.initialized,
    isLoggedIn: !!globalState.user,
    isConfigured: isSupabaseConfigured(),
    signInWithGitHub,
    signInWithGoogle,
    signOut,
  };
}
