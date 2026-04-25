/**
 * lib/news-utils.js 단위 테스트
 * 실행: node --test __tests__/news-utils.test.mjs
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { merge, filterByCategory, filterByType } from '../lib/news-utils.js';

// 테스트용 뉴스 아이템 팩토리
const item = (overrides) => ({
  url:      'http://example.com/default',
  title:    'Default Title',
  date:     '2026-01-01',
  category: 'gpu',
  type:     'news',
  ...overrides,
});

// ─────────────────────────────────────────────
// merge()
// ─────────────────────────────────────────────
describe('merge', () => {

  describe('중복 제거', () => {
    test('URL이 같으면 라이브 항목만 남긴다', () => {
      const staticItems = [item({ url: 'http://a.com', title: 'Static A', date: '2026-01-01' })];
      const liveItems   = [item({ url: 'http://a.com', title: 'Live A',   date: '2026-01-02' })];

      const result = merge(staticItems, liveItems);
      assert.equal(result.length, 1);
      assert.equal(result[0].title, 'Live A');
    });

    test('제목 앞 40자가 같으면 라이브 항목만 남긴다', () => {
      // 40자를 확실히 넘는 공통 접두사 (한글 포함 40자 이상)
      const prefix40 = 'NVIDIA 2026년 1분기 실적 발표: 매출 예상치 대폭 상회하며 시장 놀라';
      assert.ok(prefix40.length >= 40, `prefix length=${prefix40.length} should be ≥ 40`);

      const staticItems = [item({ url: 'http://static.com', title: prefix40 + '게 함 (정적)', date: '2026-01-01' })];
      const liveItems   = [item({ url: 'http://live.com',   title: prefix40 + '게 함 (라이브)', date: '2026-01-02' })];

      const result = merge(staticItems, liveItems);
      assert.equal(result.length, 1);
      assert.equal(result[0].url, 'http://live.com');
    });

    test('URL도 제목도 다르면 둘 다 포함된다', () => {
      const staticItems = [item({ url: 'http://a.com', title: 'Article A', date: '2026-01-01' })];
      const liveItems   = [item({ url: 'http://b.com', title: 'Article B', date: '2026-01-02' })];

      const result = merge(staticItems, liveItems);
      assert.equal(result.length, 2);
    });

    test('대소문자 무시하고 제목 중복을 제거한다', () => {
      const staticItems = [item({ url: 'http://s.com', title: 'NVIDIA Earnings Report Details', date: '2026-01-01' })];
      const liveItems   = [item({ url: 'http://l.com', title: 'nvidia earnings report details', date: '2026-01-02' })];

      const result = merge(staticItems, liveItems);
      assert.equal(result.length, 1);
    });
  });

  describe('날짜 정렬', () => {
    test('날짜 내림차순으로 정렬된다', () => {
      const staticItems = [
        item({ url: 'http://s1.com', title: 'S1', date: '2026-01-01' }),
        item({ url: 'http://s3.com', title: 'S3', date: '2026-01-03' }),
      ];
      const liveItems = [
        item({ url: 'http://l2.com', title: 'L2', date: '2026-01-02' }),
      ];

      const result = merge(staticItems, liveItems);
      assert.equal(result[0].date, '2026-01-03');
      assert.equal(result[1].date, '2026-01-02');
      assert.equal(result[2].date, '2026-01-01');
    });

    test('라이브 데이터가 항상 상단에 오는 건 아니다 — 날짜 기준 정렬', () => {
      const staticItems = [item({ url: 'http://s.com', title: 'S',        date: '2026-04-25' })];
      const liveItems   = [item({ url: 'http://l.com', title: 'Old Live', date: '2025-12-01' })];

      const result = merge(staticItems, liveItems);
      assert.equal(result[0].title, 'S'); // 최신 날짜가 먼저
    });
  });

  describe('엣지 케이스', () => {
    test('liveItems가 빈 배열이면 staticItems만 반환', () => {
      const staticItems = [item({ url: 'http://s.com', title: 'Only Static', date: '2026-01-01' })];
      const result = merge(staticItems, []);
      assert.equal(result.length, 1);
      assert.equal(result[0].title, 'Only Static');
    });

    test('staticItems가 빈 배열이면 liveItems만 반환', () => {
      const liveItems = [item({ url: 'http://l.com', title: 'Only Live', date: '2026-01-01' })];
      const result = merge([], liveItems);
      assert.equal(result.length, 1);
      assert.equal(result[0].title, 'Only Live');
    });

    test('둘 다 빈 배열이면 빈 배열 반환', () => {
      assert.deepEqual(merge([], []), []);
    });

    test('원본 배열을 변경하지 않는다 (불변성)', () => {
      const staticItems = [item({ url: 'http://s.com', title: 'S', date: '2026-01-01' })];
      const liveItems   = [item({ url: 'http://l.com', title: 'L', date: '2026-01-02' })];
      const origStaticLen = staticItems.length;
      const origLiveLen   = liveItems.length;

      merge(staticItems, liveItems);

      assert.equal(staticItems.length, origStaticLen);
      assert.equal(liveItems.length,   origLiveLen);
    });
  });
});

// ─────────────────────────────────────────────
// filterByCategory()
// ─────────────────────────────────────────────
describe('filterByCategory', () => {
  const items = [
    item({ url: 'http://1.com', category: 'gpu' }),
    item({ url: 'http://2.com', category: 'memory' }),
    item({ url: 'http://3.com', category: 'gpu' }),
  ];

  test('해당 category만 반환한다', () => {
    const result = filterByCategory(items, 'gpu');
    assert.equal(result.length, 2);
    assert.ok(result.every(n => n.category === 'gpu'));
  });

  test('category가 null/undefined이면 전체 반환', () => {
    assert.equal(filterByCategory(items, null).length, 3);
    assert.equal(filterByCategory(items, undefined).length, 3);
  });

  test('일치하는 category가 없으면 빈 배열', () => {
    assert.deepEqual(filterByCategory(items, 'cooling'), []);
  });
});

// ─────────────────────────────────────────────
// filterByType()
// ─────────────────────────────────────────────
describe('filterByType', () => {
  const items = [
    item({ url: 'http://1.com', type: 'news' }),
    item({ url: 'http://2.com', type: 'report' }),
    item({ url: 'http://3.com', type: 'news' }),
  ];

  test('해당 type만 반환한다', () => {
    const result = filterByType(items, 'report');
    assert.equal(result.length, 1);
    assert.equal(result[0].type, 'report');
  });

  test('type이 null이면 전체 반환', () => {
    assert.equal(filterByType(items, null).length, 3);
  });

  test('일치하는 type이 없으면 빈 배열', () => {
    assert.deepEqual(filterByType(items, 'announcement'), []);
  });
});
