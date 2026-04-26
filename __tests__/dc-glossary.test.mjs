/**
 * data/dc-glossary.js 구조·무결성 테스트
 * 실행: node --test __tests__/dc-glossary.test.mjs
 *
 * 검증 범위:
 *  - DC_GLOSSARY_ITEMS: 36개 용어, 필수 필드, 12카테고리 전부 커버
 *  - DC_GLOSSARY_CAT_LABEL: 12개 카테고리, 각 카테고리 icon·name·group 존재
 *  - DC_GROUPS: 6개 그룹, 각 그룹 id·label 존재
 *  - countDcGlossaryByCat: 순수 함수 동작 검증
 *  - 카테고리-컴포넌트 id 1:1 매핑 (ALL_COMPONENTS.id와 일치)
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  DC_GLOSSARY_ITEMS,
  DC_GLOSSARY_CAT_LABEL,
  DC_GROUPS,
  countDcGlossaryByCat,
} from '../data/dc-glossary.js';
import { ALL_COMPONENTS } from '../data/companies.js';

// ─── 상수 ────────────────────────────────────────
const EXPECTED_TOTAL  = 36;
const EXPECTED_CATS   = 12;
const EXPECTED_GROUPS = 6;
const REQUIRED_ITEM_FIELDS = ['id', 'category', 'term', 'icon', 'short', 'body'];

// ─────────────────────────────────────────────────
// DC_GLOSSARY_ITEMS 기본 구조
// ─────────────────────────────────────────────────
describe('DC_GLOSSARY_ITEMS 기본 구조', () => {
  test(`총 ${EXPECTED_TOTAL}개 용어가 존재한다`, () => {
    assert.equal(DC_GLOSSARY_ITEMS.length, EXPECTED_TOTAL);
  });

  test('모든 용어에 필수 필드(id, category, term, icon, short, body)가 존재한다', () => {
    const missing = [];
    for (const item of DC_GLOSSARY_ITEMS) {
      for (const field of REQUIRED_ITEM_FIELDS) {
        if (!item[field]) missing.push(`${item.id}: ${field} 누락`);
      }
    }
    assert.deepEqual(missing, [], `필수 필드 누락: ${missing.join(', ')}`);
  });

  test('모든 용어의 id가 중복되지 않는다', () => {
    const ids = DC_GLOSSARY_ITEMS.map(i => i.id);
    const unique = new Set(ids);
    assert.equal(unique.size, ids.length, 'id 중복 존재');
  });

  test('diagram 필드가 있는 용어는 최소 1개 이상이다', () => {
    const withDiagram = DC_GLOSSARY_ITEMS.filter(i => i.diagram);
    assert.ok(withDiagram.length >= 1, 'diagram 있는 용어가 없음');
  });

  test('HBM 스택 다이어그램 용어(dc-g-hbm-detail)가 존재한다', () => {
    const item = DC_GLOSSARY_ITEMS.find(i => i.id === 'dc-g-hbm-detail');
    assert.ok(item, 'dc-g-hbm-detail 용어 없음');
    assert.equal(item.diagram, 'hbm-stack');
  });
});

// ─────────────────────────────────────────────────
// DC_GLOSSARY_CAT_LABEL 구조
// ─────────────────────────────────────────────────
describe('DC_GLOSSARY_CAT_LABEL 구조', () => {
  test(`정확히 ${EXPECTED_CATS}개 카테고리가 정의되어 있다`, () => {
    assert.equal(Object.keys(DC_GLOSSARY_CAT_LABEL).length, EXPECTED_CATS);
  });

  test('각 카테고리에 icon, name, group이 존재한다', () => {
    const missing = [];
    for (const [catId, info] of Object.entries(DC_GLOSSARY_CAT_LABEL)) {
      if (!info.icon)  missing.push(`${catId}: icon 누락`);
      if (!info.name)  missing.push(`${catId}: name 누락`);
      if (!info.group) missing.push(`${catId}: group 누락`);
    }
    assert.deepEqual(missing, [], `카테고리 필드 누락: ${missing.join(', ')}`);
  });

  test('12개 컴포넌트 카테고리가 모두 포함된다 (hyperscaler, facility, gpu, memory, server, storage, ai-network, optics, power, cooling, construction, energy)', () => {
    const expected = ['hyperscaler','facility','gpu','memory','server','storage','ai-network','optics','power','cooling','construction','energy'];
    for (const cat of expected) {
      assert.ok(DC_GLOSSARY_CAT_LABEL[cat], `카테고리 '${cat}' 없음`);
    }
  });
});

// ─────────────────────────────────────────────────
// DC_GROUPS 구조
// ─────────────────────────────────────────────────
describe('DC_GROUPS 구조', () => {
  test(`정확히 ${EXPECTED_GROUPS}개 그룹이 존재한다`, () => {
    assert.equal(DC_GROUPS.length, EXPECTED_GROUPS);
  });

  test('각 그룹에 id, label이 존재한다', () => {
    for (const g of DC_GROUPS) {
      assert.ok(g.id,    `그룹 id 누락`);
      assert.ok(g.label, `${g.id}: label 누락`);
    }
  });

  test('"all" 그룹이 존재한다', () => {
    const allGroup = DC_GROUPS.find(g => g.id === 'all');
    assert.ok(allGroup, '"all" 그룹 없음');
  });

  test('all 그룹을 제외한 나머지 그룹은 cats 배열을 가진다', () => {
    const nonAll = DC_GROUPS.filter(g => g.id !== 'all');
    for (const g of nonAll) {
      assert.ok(Array.isArray(g.cats) && g.cats.length > 0, `${g.id}: cats 배열 없음 또는 비어있음`);
    }
  });

  test('그룹 cats 합집합이 12개 카테고리를 모두 커버한다', () => {
    const allCats = DC_GROUPS.flatMap(g => g.cats ?? []);
    const catSet = new Set(allCats);
    const expected = Object.keys(DC_GLOSSARY_CAT_LABEL);
    for (const cat of expected) {
      assert.ok(catSet.has(cat), `카테고리 '${cat}'이 어느 그룹에도 속하지 않음`);
    }
  });
});

// ─────────────────────────────────────────────────
// countDcGlossaryByCat 순수 함수 검증
// ─────────────────────────────────────────────────
describe('countDcGlossaryByCat 순수 함수', () => {
  test('빈 배열을 넣으면 빈 객체를 반환한다', () => {
    assert.deepEqual(countDcGlossaryByCat([]), {});
  });

  test('카테고리별 개수를 정확히 집계한다', () => {
    const mock = [
      { id: 'a1', category: 'gpu' },
      { id: 'a2', category: 'gpu' },
      { id: 'b1', category: 'memory' },
    ];
    const result = countDcGlossaryByCat(mock);
    assert.equal(result['gpu'], 2);
    assert.equal(result['memory'], 1);
  });

  test('실제 DC_GLOSSARY_ITEMS로 집계했을 때 12개 카테고리가 모두 존재한다', () => {
    const result = countDcGlossaryByCat(DC_GLOSSARY_ITEMS);
    const expected = Object.keys(DC_GLOSSARY_CAT_LABEL);
    for (const cat of expected) {
      assert.ok((result[cat] ?? 0) > 0, `카테고리 '${cat}'에 용어가 없음`);
    }
  });

  test('집계 결과 합계가 전체 용어 수와 일치한다', () => {
    const result = countDcGlossaryByCat(DC_GLOSSARY_ITEMS);
    const total = Object.values(result).reduce((a, b) => a + b, 0);
    assert.equal(total, DC_GLOSSARY_ITEMS.length);
  });

  test('원본 배열을 변경하지 않는다 (사이드 이펙트 없음)', () => {
    const copy = DC_GLOSSARY_ITEMS.map(i => ({ ...i }));
    countDcGlossaryByCat(DC_GLOSSARY_ITEMS);
    assert.equal(DC_GLOSSARY_ITEMS.length, copy.length);
    for (let i = 0; i < copy.length; i++) {
      assert.equal(DC_GLOSSARY_ITEMS[i].id, copy[i].id);
    }
  });
});

// ─────────────────────────────────────────────────
// 카테고리 ↔ 컴포넌트 id 매핑 무결성
// ─────────────────────────────────────────────────
describe('카테고리-컴포넌트 id 매핑 무결성', () => {
  test('DC_GLOSSARY_ITEMS의 모든 category 값이 DC_GLOSSARY_CAT_LABEL에 정의되어 있다', () => {
    const unknown = DC_GLOSSARY_ITEMS
      .filter(i => !DC_GLOSSARY_CAT_LABEL[i.category])
      .map(i => `${i.id}(${i.category})`);
    assert.deepEqual(unknown, [], `미정의 카테고리: ${unknown.join(', ')}`);
  });

  test('DC_GLOSSARY_CAT_LABEL의 카테고리 id가 ALL_COMPONENTS id와 동일한 집합이다', () => {
    const glossaryCats = new Set(Object.keys(DC_GLOSSARY_CAT_LABEL));
    const compIds = new Set(ALL_COMPONENTS.map(c => c.id));
    // glossary에 있지만 component에 없는 것
    const onlyInGlossary = [...glossaryCats].filter(c => !compIds.has(c));
    // component에 있지만 glossary에 없는 것
    const onlyInComp = [...compIds].filter(c => !glossaryCats.has(c));
    assert.deepEqual(onlyInGlossary, [], `glossary에만 있는 카테고리: ${onlyInGlossary}`);
    assert.deepEqual(onlyInComp, [], `component에만 있는 id (glossary 누락): ${onlyInComp}`);
  });
});
