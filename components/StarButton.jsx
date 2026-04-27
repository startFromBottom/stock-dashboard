'use client';

import useWatchlist from '@/hooks/useWatchlist';

/**
 * 회사 카드용 ⭐ 토글 버튼
 *
 * 사용 예:
 *   <StarButton
 *     ticker={c.ticker}
 *     name={c.name}
 *     sector="ai-dc"
 *     livePrice={c.liveCap ? null : null}  // 시총은 가격 아님 — 별도로 전달 권장
 *   />
 */
export default function StarButton({ ticker, name, sector, livePrice }) {
  const { isWatched, toggle, loaded } = useWatchlist();
  const watched = isWatched(ticker);

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
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

  return (
    <button
      className={`star-btn${watched ? ' star-btn-on' : ''}`}
      onClick={handleClick}
      title={loaded
        ? (watched ? '워치리스트에서 제거' : '워치리스트에 추가')
        : '워치리스트 로딩 중…'}
      aria-label={watched ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      {watched ? '★' : '☆'}
    </button>
  );
}
