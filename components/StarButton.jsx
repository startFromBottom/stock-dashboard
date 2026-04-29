'use client';

import { useState } from 'react';
import useWatchlist from '@/hooks/useWatchlist';
import useAuth from '@/hooks/useAuth';

/**
 * 회사 카드용 ⭐ 토글 버튼
 *
 * - 로그인된 경우: 즉시 워치리스트 add/remove
 * - 비로그인:    클릭 시 GitHub 로그인 안내 inline tooltip 표시 (1.8초간)
 *
 * 사용 예:
 *   <StarButton ticker={c.ticker} name={c.name} sector="ai-dc" livePrice={...} />
 */
export default function StarButton({ ticker, name, sector, livePrice }) {
  const { isWatched, toggle, loaded, requiresAuth } = useWatchlist();
  const { isLoggedIn, initialized, signInWithGitHub } = useAuth();
  const watched = isWatched(ticker);

  const [showAuthHint, setShowAuthHint] = useState(false);

  const handleClick = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    // 비로그인 상태 → 안내 + GitHub 로그인 시작
    if (initialized && !isLoggedIn) {
      setShowAuthHint(true);
      // 잠깐 hint 보여주고 로그인 OAuth 시작
      setTimeout(() => setShowAuthHint(false), 1800);
      const { error } = await signInWithGitHub();
      if (error) {
        alert('GitHub 로그인 실패: ' + (error.message ?? error));
      }
      return;
    }

    toggle({
      ticker,
      name,
      sector,
      added_price: typeof livePrice === 'number' ? livePrice : null,
    });
  };

  // ticker 없거나 비상장이면 버튼 숨김
  if (!ticker || ticker === 'Private' || ticker === '비상장' ||
      ticker === '비상장 (국영)' || ticker === '(AMD 합산)') {
    return null;
  }

  const title = !initialized
    ? '인증 확인 중…'
    : !isLoggedIn
      ? '로그인하면 워치리스트에 추가할 수 있어요'
      : loaded
        ? (watched ? '워치리스트에서 제거' : '워치리스트에 추가')
        : '워치리스트 로딩 중…';

  return (
    <span className="star-btn-wrap">
      <button
        className={`star-btn${watched ? ' star-btn-on' : ''}${(!isLoggedIn && initialized) ? ' star-btn-locked' : ''}`}
        onClick={handleClick}
        title={title}
        aria-label={watched ? 'Remove from watchlist' : 'Add to watchlist'}
      >
        {watched ? '★' : '☆'}
      </button>
      {showAuthHint && (
        <span className="star-auth-hint">로그인 필요 — GitHub 페이지로 이동합니다</span>
      )}
    </span>
  );
}
