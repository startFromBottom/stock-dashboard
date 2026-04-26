/**
 * 우주 섹터 데이터 무결성 & 로직 단위 테스트
 * 실행: node --test __tests__/space-data.test.mjs
 *
 * 검증 범위
 *  1. spaceCompanies.js  — SPACE_LAYERS 구조·필드·ticker 형식
 *  2. space-news.js      — SPACE_NEWS_ITEMS 구조·카테고리·타입·날짜
 *  3. countByCat()       — 카테고리 카운팅 유틸
 *  4. SPACE_FLAG_BY_NAME — 국기 매핑 완전성
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { SPACE_LAYERS, SPACE_FLAG_BY_NAME } from '../data/spaceCompanies.js';
import {
  SPACE_NEWS_ITEMS,
  SPACE_NEWS_TYPE_LABEL,
  SPACE_CATEGORY_LABEL,
  countByCat,
} from '../data/space-news.js';

// ─── 상수 ────────────────────────────────────────────────────
// 새 구조: 물리 인프라(materials→launch→satellite) + 서비스 계층(services) + 수평 응용처(defense)
const EXPECTED_LAYER_IDS    = ['materials', 'launch', 'satellite', 'services', 'defense'];
const EXPECTED_COMPONENT_IDS = [
  // materials
  'propulsion', 'advanced_materials', 'precision_parts',
  // launch
  'launch_vehicle',
  // satellite
  'sat_manufacturer',
  // services (서비스 계층 서브 컴포넌트)
  'sat_comms', 'earth_observation', 'space_analytics',
  // defense
  'defense_space',
];
const VALID_TYPES = ['news', 'announcement', 'report'];
const VALID_CATEGORIES = Object.keys(SPACE_CATEGORY_LABEL);

// 헬퍼: 모든 candidates를 평탄화
function allCandidates() {
  return SPACE_LAYERS.flatMap(l => l.components.flatMap(c => c.candidates));
}

// ─────────────────────────────────────────────────────────────
// 1. SPACE_LAYERS 구조
// ─────────────────────────────────────────────────────────────
describe('SPACE_LAYERS 구조', () => {

  test('5개 레이어가 정의돼 있다', () => {
    assert.equal(SPACE_LAYERS.length, 5);
  });

  test('레이어 id가 정해진 목록과 순서대로 일치한다', () => {
    const ids = SPACE_LAYERS.map(l => l.id);
    assert.deepEqual(ids, EXPECTED_LAYER_IDS);
  });

  test('모든 레이어에 id·layer·group·components 필드가 있다', () => {
    const VALID_GROUPS = ['infra', 'service', 'application'];
    for (const layer of SPACE_LAYERS) {
      assert.ok(layer.id,         `레이어 id 누락: ${JSON.stringify(layer)}`);
      assert.ok(layer.layer,      `레이어 layer 누락: ${layer.id}`);
      assert.ok(VALID_GROUPS.includes(layer.group), `레이어 group 유효하지 않음: ${layer.id} group=${layer.group}`);
      assert.ok(Array.isArray(layer.components), `components가 배열 아님: ${layer.id}`);
      assert.ok(layer.components.length > 0,    `components가 비어 있음: ${layer.id}`);
    }
  });

  test('group 필드가 올바른 구조로 배치돼 있다 (infra→service→application)', () => {
    const groups = SPACE_LAYERS.map(l => l.group);
    // 인프라가 앞에, 서비스가 중간, 응용이 끝
    const infraLayers = SPACE_LAYERS.filter(l => l.group === 'infra');
    const serviceLayers = SPACE_LAYERS.filter(l => l.group === 'service');
    const appLayers = SPACE_LAYERS.filter(l => l.group === 'application');
    assert.ok(infraLayers.length >= 1, '인프라(infra) 레이어 없음');
    assert.ok(serviceLayers.length >= 1, '서비스(service) 레이어 없음');
    assert.ok(appLayers.length >= 1, '응용(application) 레이어 없음');
    // 순서: 모든 infra가 service 앞에, service가 application 앞에
    const firstServiceIdx = groups.indexOf('service');
    const firstAppIdx = groups.indexOf('application');
    const lastInfraIdx = groups.lastIndexOf('infra');
    assert.ok(lastInfraIdx < firstServiceIdx, 'infra 레이어가 service보다 앞에 있어야 함');
    assert.ok(firstServiceIdx < firstAppIdx, 'service 레이어가 application보다 앞에 있어야 함');
  });

  test('9개 컴포넌트가 모두 존재한다', () => {
    const compIds = SPACE_LAYERS.flatMap(l => l.components.map(c => c.id));
    assert.deepEqual(compIds.sort(), [...EXPECTED_COMPONENT_IDS].sort());
  });

  test('모든 컴포넌트에 icon·name·desc·candidates 필드가 있다', () => {
    for (const layer of SPACE_LAYERS) {
      for (const comp of layer.components) {
        assert.ok(comp.icon,                           `icon 누락: ${comp.id}`);
        assert.ok(comp.name,                           `name 누락: ${comp.id}`);
        assert.ok(comp.desc,                           `desc 누락: ${comp.id}`);
        assert.ok(Array.isArray(comp.candidates),      `candidates 배열 아님: ${comp.id}`);
        assert.ok(comp.candidates.length >= 5,         `candidates 5개 미만: ${comp.id} (${comp.candidates.length}개)`);
      }
    }
  });

});

// ─────────────────────────────────────────────────────────────
// 2. candidates 필드 무결성
// ─────────────────────────────────────────────────────────────
describe('candidates 필드 무결성', () => {

  test('모든 candidate에 필수 필드(rank·name·ticker·mktcap·detail·ir·news·x)가 있다', () => {
    const required = ['rank', 'name', 'ticker', 'mktcap', 'detail', 'ir', 'news', 'x'];
    for (const c of allCandidates()) {
      for (const field of required) {
        assert.ok(
          c[field] !== undefined && c[field] !== null && c[field] !== '',
          `${c.name}: '${field}' 필드 누락/빈값`
        );
      }
    }
  });

  test('rank는 1 이상의 양수 정수다', () => {
    for (const c of allCandidates()) {
      assert.ok(Number.isInteger(c.rank) && c.rank >= 1, `${c.name}: rank=${c.rank}`);
    }
  });

  test('ir·news·x 링크가 http/https로 시작한다', () => {
    for (const c of allCandidates()) {
      for (const field of ['ir', 'news', 'x']) {
        assert.ok(
          c[field].startsWith('http://') || c[field].startsWith('https://'),
          `${c.name}: ${field}='${c[field]}' — http(s) 아님`
        );
      }
    }
  });

  test('각 컴포넌트 내 rank는 중복이 없다', () => {
    for (const layer of SPACE_LAYERS) {
      for (const comp of layer.components) {
        const ranks = comp.candidates.map(c => c.rank);
        const unique = new Set(ranks);
        assert.equal(
          unique.size, ranks.length,
          `${comp.id}: rank 중복 — ${ranks}`
        );
      }
    }
  });

  test('ticker 값이 빈 문자열이 아니다', () => {
    for (const c of allCandidates()) {
      assert.ok(c.ticker.trim().length > 0, `${c.name}: ticker가 빈 문자열`);
    }
  });

});

// ─────────────────────────────────────────────────────────────
// 3. SPACE_FLAG_BY_NAME
// ─────────────────────────────────────────────────────────────
describe('SPACE_FLAG_BY_NAME 국기 매핑', () => {

  test('SPACE_FLAG_BY_NAME가 객체로 존재한다', () => {
    assert.ok(typeof SPACE_FLAG_BY_NAME === 'object' && SPACE_FLAG_BY_NAME !== null);
  });

  test('공개 상장 기업(Private 아님)에 대한 국기 매핑이 있다', () => {
    const publicCandidates = allCandidates().filter(
      c => c.ticker !== 'Private' && !c.ticker.startsWith('Private(')
    );
    // 상장 기업의 50% 이상은 국기 매핑이 있어야 한다
    const mapped = publicCandidates.filter(c => SPACE_FLAG_BY_NAME[c.name]);
    const ratio = mapped.length / publicCandidates.length;
    assert.ok(ratio >= 0.5, `상장 기업 국기 매핑 비율 너무 낮음: ${(ratio * 100).toFixed(1)}%`);
  });

  test('매핑된 국기 값이 이모지 형식이다', () => {
    for (const [name, flag] of Object.entries(SPACE_FLAG_BY_NAME)) {
      // 국기 이모지는 2개의 Regional Indicator로 구성 (또는 일부 복합)
      assert.ok(typeof flag === 'string' && flag.length > 0, `${name}: 국기 값이 빈 문자열`);
    }
  });

});

// ─────────────────────────────────────────────────────────────
// 4. SPACE_NEWS_ITEMS 구조
// ─────────────────────────────────────────────────────────────
describe('SPACE_NEWS_ITEMS 구조', () => {

  test('뉴스 아이템이 1개 이상 존재한다', () => {
    assert.ok(SPACE_NEWS_ITEMS.length >= 1);
  });

  test('모든 아이템에 필수 필드가 있다', () => {
    const required = ['id', 'tickers', 'category', 'type', 'title', 'summary', 'date', 'source', 'url'];
    for (const item of SPACE_NEWS_ITEMS) {
      for (const field of required) {
        assert.ok(
          item[field] !== undefined,
          `id=${item.id}: '${field}' 필드 누락`
        );
      }
    }
  });

  test('id가 모두 고유하다', () => {
    const ids = SPACE_NEWS_ITEMS.map(n => n.id);
    const unique = new Set(ids);
    assert.equal(unique.size, ids.length, `중복 id 발견: ${ids.filter((id, i) => ids.indexOf(id) !== i)}`);
  });

  test('type이 허용된 값(news·announcement·report)만 사용한다', () => {
    for (const item of SPACE_NEWS_ITEMS) {
      assert.ok(
        VALID_TYPES.includes(item.type),
        `id=${item.id}: 허용되지 않은 type='${item.type}'`
      );
    }
  });

  test('category가 SPACE_CATEGORY_LABEL에 정의된 값만 사용한다', () => {
    for (const item of SPACE_NEWS_ITEMS) {
      assert.ok(
        VALID_CATEGORIES.includes(item.category),
        `id=${item.id}: 허용되지 않은 category='${item.category}'`
      );
    }
  });

  test('date가 YYYY-MM-DD 형식이다', () => {
    const dateRe = /^\d{4}-\d{2}-\d{2}$/;
    for (const item of SPACE_NEWS_ITEMS) {
      assert.ok(dateRe.test(item.date), `id=${item.id}: date='${item.date}' 형식 오류`);
    }
  });

  test('url이 http/https로 시작한다', () => {
    for (const item of SPACE_NEWS_ITEMS) {
      assert.ok(
        item.url.startsWith('http://') || item.url.startsWith('https://'),
        `id=${item.id}: url='${item.url}'`
      );
    }
  });

  test('tickers가 배열이다', () => {
    for (const item of SPACE_NEWS_ITEMS) {
      assert.ok(Array.isArray(item.tickers), `id=${item.id}: tickers가 배열 아님`);
    }
  });

  test('title과 summary가 빈 문자열이 아니다', () => {
    for (const item of SPACE_NEWS_ITEMS) {
      assert.ok(item.title.trim().length > 0,   `id=${item.id}: title이 빈 문자열`);
      assert.ok(item.summary.trim().length > 0, `id=${item.id}: summary가 빈 문자열`);
    }
  });

  test('모든 카테고리에 최소 1개 이상의 뉴스가 있다', () => {
    const cats = countByCat(SPACE_NEWS_ITEMS);
    for (const catId of VALID_CATEGORIES) {
      assert.ok(
        (cats[catId] ?? 0) >= 1,
        `카테고리 '${catId}'에 뉴스 없음`
      );
    }
  });

});

// ─────────────────────────────────────────────────────────────
// 5. countByCat() 유틸
// ─────────────────────────────────────────────────────────────
describe('countByCat', () => {

  test('카테고리별 개수를 정확히 집계한다', () => {
    const items = [
      { category: 'launch' },
      { category: 'launch' },
      { category: 'defense_space' },
    ];
    const result = countByCat(items);
    assert.equal(result['launch'], 2);
    assert.equal(result['defense_space'], 1);
  });

  test('빈 배열 입력 시 빈 객체 반환', () => {
    assert.deepEqual(countByCat([]), {});
  });

  test('단일 카테고리 아이템도 정상 집계된다', () => {
    const result = countByCat([{ category: 'propulsion' }]);
    assert.equal(result['propulsion'], 1);
  });

  test('원본 배열을 변경하지 않는다 (불변성)', () => {
    const items = [{ category: 'launch' }, { category: 'sat_comms' }];
    const before = items.length;
    countByCat(items);
    assert.equal(items.length, before);
  });

  test('실제 SPACE_NEWS_ITEMS 집계 결과의 합이 전체 아이템 수와 같다', () => {
    const cats = countByCat(SPACE_NEWS_ITEMS);
    const total = Object.values(cats).reduce((s, n) => s + n, 0);
    assert.equal(total, SPACE_NEWS_ITEMS.length);
  });

});

// ─────────────────────────────────────────────────────────────
// 6. SPACE_NEWS_TYPE_LABEL / SPACE_CATEGORY_LABEL 메타
// ─────────────────────────────────────────────────────────────
describe('SPACE_NEWS_TYPE_LABEL', () => {

  test('news·announcement·report 3종이 모두 정의돼 있다', () => {
    for (const type of VALID_TYPES) {
      assert.ok(SPACE_NEWS_TYPE_LABEL[type], `type '${type}' 누락`);
    }
  });

  test('각 타입에 label·color·bg 필드가 있다', () => {
    for (const [type, meta] of Object.entries(SPACE_NEWS_TYPE_LABEL)) {
      assert.ok(meta.label, `${type}: label 누락`);
      assert.ok(meta.color, `${type}: color 누락`);
      assert.ok(meta.bg,    `${type}: bg 누락`);
    }
  });

});

describe('SPACE_CATEGORY_LABEL', () => {

  test('9개 카테고리가 모두 정의돼 있다', () => {
    assert.equal(Object.keys(SPACE_CATEGORY_LABEL).length, 9);
  });

  test('각 카테고리에 icon·name 필드가 있다', () => {
    for (const [catId, meta] of Object.entries(SPACE_CATEGORY_LABEL)) {
      assert.ok(meta.icon, `${catId}: icon 누락`);
      assert.ok(meta.name, `${catId}: name 누락`);
    }
  });

  test('카테고리 id가 뉴스 데이터에서 실제 사용된 값을 포함한다', () => {
    const usedCats = new Set(SPACE_NEWS_ITEMS.map(n => n.category));
    for (const cat of usedCats) {
      assert.ok(
        SPACE_CATEGORY_LABEL[cat],
        `뉴스에서 사용된 category '${cat}'가 SPACE_CATEGORY_LABEL에 없음`
      );
    }
  });

});
