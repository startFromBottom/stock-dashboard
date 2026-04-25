/**
 * 뉴스 유틸 — 테스트 가능하도록 순수 함수로 분리
 */

/**
 * 정적 뉴스와 라이브 뉴스를 병합합니다.
 * - URL 또는 제목 앞 40자 기준으로 중복 제거 (라이브 우선)
 * - 전체를 날짜 내림차순 정렬
 *
 * @param {Array} staticItems
 * @param {Array} liveItems
 * @returns {Array}
 */
export function merge(staticItems, liveItems) {
  const liveUrls   = new Set(liveItems.map(n => n.url));
  const liveTitles = new Set(liveItems.map(n => n.title.slice(0, 40).toLowerCase()));

  const uniqueStatic = staticItems.filter(
    n => !liveUrls.has(n.url) && !liveTitles.has(n.title.slice(0, 40).toLowerCase())
  );

  const all = [...liveItems, ...uniqueStatic];
  all.sort((a, b) => b.date.localeCompare(a.date));
  return all;
}

/**
 * 뉴스 아이템 배열에서 주어진 category에 해당하는 것만 필터링합니다.
 */
export function filterByCategory(items, category) {
  if (!category) return items;
  return items.filter(n => n.category === category);
}

/**
 * 뉴스 아이템 배열에서 주어진 type에 해당하는 것만 필터링합니다.
 */
export function filterByType(items, type) {
  if (!type) return items;
  return items.filter(n => n.type === type);
}
