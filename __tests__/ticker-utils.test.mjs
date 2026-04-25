/**
 * ticker-utils.js 단위 테스트
 * 실행: node --test __tests__/ticker-utils.test.mjs
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// lib/ticker-utils.js를 ESM으로 직접 import
import {
  normalizeTicker,
  extractPublicTickers,
  formatMktcap,
} from '../lib/ticker-utils.js';

// ─────────────────────────────────────────────
// normalizeTicker
// ─────────────────────────────────────────────
describe('normalizeTicker', () => {
  test('알려진 일본 ticker를 변환한다', () => {
    assert.equal(normalizeTicker('TYO:9613'), '9613.T');
  });

  test('알려진 홍콩 ticker를 변환한다', () => {
    assert.equal(normalizeTicker('HKG:0992'), '0992.HK');
  });

  test('알려진 대만 ticker를 변환한다', () => {
    assert.equal(normalizeTicker('TPE:2317'), '2317.TW');
  });

  test('이미 정규화된 ticker는 그대로 반환한다', () => {
    assert.equal(normalizeTicker('NVDA'), 'NVDA');
    assert.equal(normalizeTicker('000660.KS'), '000660.KS');
    assert.equal(normalizeTicker('2382.TW'), '2382.TW');
  });

  test('"Private"는 null을 반환한다', () => {
    assert.equal(normalizeTicker('Private'), null);
  });

  test('"(AMD 합산)" 같은 더미값은 null을 반환한다', () => {
    assert.equal(normalizeTicker('(AMD 합산)'), null);
  });

  test('null/undefined 입력은 null을 반환한다', () => {
    assert.equal(normalizeTicker(null), null);
    assert.equal(normalizeTicker(undefined), null);
  });

  test('빈 문자열은 null을 반환한다', () => {
    assert.equal(normalizeTicker(''), null);
  });
});

// ─────────────────────────────────────────────
// extractPublicTickers
// ─────────────────────────────────────────────
describe('extractPublicTickers', () => {
  test('Private 기업은 제외된다', () => {
    const result = extractPublicTickers([
      { ticker: 'NVDA' },
      { ticker: 'Private' },
    ]);
    assert.deepEqual(result, ['NVDA']);
  });

  test('ticker 정규화가 함께 적용된다', () => {
    const result = extractPublicTickers([
      { ticker: 'TYO:9613' },
      { ticker: 'NVDA' },
    ]);
    assert.ok(result.includes('9613.T'));
    assert.ok(result.includes('NVDA'));
  });

  test('중복 ticker는 한 번만 포함된다', () => {
    const result = extractPublicTickers([
      { ticker: 'NVDA' },
      { ticker: 'NVDA' },
      { ticker: 'NVDA' },
    ]);
    assert.equal(result.length, 1);
    assert.equal(result[0], 'NVDA');
  });

  test('빈 배열 입력 시 빈 배열 반환', () => {
    assert.deepEqual(extractPublicTickers([]), []);
  });

  test('모두 Private이면 빈 배열 반환', () => {
    const result = extractPublicTickers([
      { ticker: 'Private' },
      { ticker: '(AMD 합산)' },
    ]);
    assert.deepEqual(result, []);
  });

  test('ticker 없는 항목은 무시된다', () => {
    const result = extractPublicTickers([
      { name: 'No Ticker Corp' },
      { ticker: 'AMZN' },
    ]);
    assert.deepEqual(result, ['AMZN']);
  });
});

// ─────────────────────────────────────────────
// formatMktcap
// ─────────────────────────────────────────────
describe('formatMktcap', () => {
  // 조(兆) 단위
  test('2.7조 USD → "~$2.7조"', () => {
    assert.equal(formatMktcap(2_700_000_000_000), '~$2.7조');
  });

  test('1조 USD → "~$1조"', () => {
    assert.equal(formatMktcap(1_000_000_000_000), '~$1조');
  });

  test('0.5조(5000억) 경계 → 조 단위 표기', () => {
    // 5000억 = 0.5조 → 조 단위로 표기
    assert.equal(formatMktcap(500_000_000_000), '~$0.5조');
  });

  // 억 단위
  test('499억 경계 아래: 억 단위', () => {
    // 4990억 = 499,000,000,000 → 0.499조 < 0.5조 → 억 단위
    assert.equal(formatMktcap(499_000_000_000), '~$4990억');
  });

  test('소수점 반올림 — 2750억 → "~$2750억"', () => {
    assert.equal(formatMktcap(275_000_000_000), '~$2750억');
  });

  test('10억 미만은 억 단위 (반올림)', () => {
    assert.equal(formatMktcap(5_000_000_000), '~$50억');
  });

  // 무효값
  test('0은 null 반환', () => {
    assert.equal(formatMktcap(0), null);
  });

  test('음수는 null 반환', () => {
    assert.equal(formatMktcap(-1_000_000_000), null);
  });

  test('null은 null 반환', () => {
    assert.equal(formatMktcap(null), null);
  });

  test('undefined는 null 반환', () => {
    assert.equal(formatMktcap(undefined), null);
  });
});
