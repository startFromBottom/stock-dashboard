'use client';

import { openCompanyModal } from '@/hooks/useCompanyModal';

/**
 * 회사 카드 onClick 헬퍼.
 *
 * 사용:
 *   <div
 *     className="company-card clickable"
 *     onClick={cardClickHandler({ ticker, name, sector })}
 *   >
 *     ... StarButton, IR/뉴스 링크 등 자식들 ...
 *   </div>
 *
 * - 자식의 <a> 또는 <button> 클릭은 무시 (자연스러운 link/star toggle 동작 유지)
 * - ticker가 없거나 비상장이면 클릭 무반응
 */
export function cardClickHandler({ ticker, name, sector }) {
  return (e) => {
    // 자식 링크/버튼 클릭은 카드 클릭으로 처리하지 않음
    if (e.target.closest('a, button, .star-btn-wrap')) return;
    if (!ticker || ticker === 'Private' || ticker === '비상장' ||
        ticker === '비상장 (국영)' || ticker === '(AMD 합산)' ||
        ticker.startsWith('~')) {
      return;
    }
    openCompanyModal({ ticker, name, sector });
  };
}
