'use client';

import useWatchlist from '@/hooks/useWatchlist';

/**
 * 헤더 우상단의 ⭐ 워치리스트 버튼.
 * - 카운트 배지 표시
 * - 활성 상태(현재 sector === 'watchlist')에서 강조 스타일
 * - 클릭 시 onSelect 콜백 (Dashboard에서 setSector('watchlist'))
 */
export default function HeaderWatchlistButton({ active, onSelect }) {
  const { items, loaded } = useWatchlist();
  const count = items.length;

  return (
    <button
      className={`header-wl-btn${active ? ' active' : ''}`}
      onClick={() => onSelect?.('watchlist')}
      title="나의 워치리스트"
    >
      <span className="header-wl-icon">⭐</span>
      <span className="header-wl-label">워치리스트</span>
      {loaded && count > 0 && (
        <span className="header-wl-badge">{count}</span>
      )}
    </button>
  );
}
