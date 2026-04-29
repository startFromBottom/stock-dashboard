'use client';

import { useState, useRef, useEffect } from 'react';
import useAuth from '@/hooks/useAuth';

/**
 * 헤더 우상단의 로그인 / 사용자 아바타 버튼.
 *
 * - 비로그인: "로그인" 버튼 → 클릭 시 GitHub OAuth 시작
 * - 로그인됨: 아바타(이미지 또는 이니셜) → 클릭 시 드롭다운 (이메일 + 로그아웃)
 *
 * 향후 Google 추가 시 드롭다운에 "Google로 로그인"도 같이 노출하도록 확장.
 */
export default function LoginButton() {
  const {
    user,
    isLoggedIn,
    isConfigured,
    initialized,
    signInWithGitHub,
    signInWithGoogle,
    signOut,
  } = useAuth();

  const [open, setOpen]       = useState(false);
  const [busy, setBusy]       = useState(false);
  const [showProviders, setShowProviders] = useState(false); // 비로그인 드롭다운
  const wrapRef = useRef(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function onDocClick(e) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) {
        setOpen(false);
        setShowProviders(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  if (!isConfigured) {
    return (
      <span className="login-btn login-btn-disabled" title="Supabase 미설정">
        🔒 인증 비활성
      </span>
    );
  }

  // 첫 세션 로딩 중에는 스켈레톤
  if (!initialized) {
    return <span className="login-btn login-btn-skel">…</span>;
  }

  /* ── 비로그인 ── */
  if (!isLoggedIn) {
    return (
      <div className="login-wrap" ref={wrapRef}>
        <button
          className="login-btn"
          onClick={() => setShowProviders(v => !v)}
          disabled={busy}
        >
          {busy ? '⟳ 이동중…' : '🔑 로그인'}
        </button>
        {showProviders && (
          <div className="login-dropdown">
            <button
              className="login-provider-btn"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                const { error } = await signInWithGitHub();
                if (error) {
                  alert('GitHub 로그인 실패: ' + (error.message ?? error));
                  setBusy(false);
                }
                // 성공이면 OAuth 페이지로 리다이렉트되므로 setBusy(false) 불필요
              }}
            >
              <span className="login-provider-icon">🐙</span>
              GitHub로 로그인
            </button>
            <button
              className="login-provider-btn"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                const { error } = await signInWithGoogle();
                if (error) {
                  alert('Google 로그인 실패: ' + (error.message ?? error));
                  setBusy(false);
                }
              }}
            >
              <span className="login-provider-icon">🟢</span>
              Google로 로그인
            </button>
          </div>
        )}
      </div>
    );
  }

  /* ── 로그인됨 ── */
  const avatarUrl =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    null;
  const displayName =
    user?.user_metadata?.user_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'user';
  const initial = (displayName?.[0] ?? '?').toUpperCase();

  return (
    <div className="login-wrap" ref={wrapRef}>
      <button
        className={`avatar-btn${open ? ' active' : ''}`}
        onClick={() => setOpen(v => !v)}
        title={displayName}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="avatar-img" />
        ) : (
          <span className="avatar-initial">{initial}</span>
        )}
      </button>
      {open && (
        <div className="login-dropdown">
          <div className="login-userinfo">
            <span className="login-userinfo-name">{displayName}</span>
            {user?.email && (
              <span className="login-userinfo-email">{user.email}</span>
            )}
          </div>
          <div className="login-dropdown-divider" />
          <button
            className="login-provider-btn"
            onClick={async () => {
              setBusy(true);
              await signOut();
              setBusy(false);
              setOpen(false);
            }}
            disabled={busy}
          >
            <span className="login-provider-icon">🚪</span>
            {busy ? '로그아웃 중…' : '로그아웃'}
          </button>
        </div>
      )}
    </div>
  );
}
