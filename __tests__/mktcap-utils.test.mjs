/**
 * lib/mktcap-utils.js 단위 테스트
 * 실행: node --test __tests__/mktcap-utils.test.mjs
 */
import { test, describe, mock } from 'node:test';
import assert from 'node:assert/strict';

import { fetchOneFinnhub, fetchBatch } from '../lib/mktcap-utils.js';

// ─── fetch 모킹 헬퍼 ────────────────────────────────────────
/** Finnhub 성공 응답을 반환하는 mock fetcher */
function mockFinnhubOk(mktcapMillions) {
  return async () => ({
    ok: true,
    json: async () => ({ metric: { marketCapitalization: mktcapMillions } }),
  });
}

/** HTTP 오류를 반환하는 mock fetcher */
function mockFinnhubError(status = 429) {
  return async () => ({ ok: false, status });
}

/** metric이 없는 응답 */
function mockFinnhubNoMetric() {
  return async () => ({
    ok: true,
    json: async () => ({ metric: {} }),
  });
}

/** 네트워크 예외 */
function mockFinnhubThrows() {
  return async () => { throw new Error('Network error'); };
}

// ─────────────────────────────────────────────
// fetchOneFinnhub
// ─────────────────────────────────────────────
describe('fetchOneFinnhub', () => {
  test('marketCapitalization을 백만→USD 원시값으로 변환한다', async () => {
    const result = await fetchOneFinnhub('NVDA', 'test-token', mockFinnhubOk(2_700_000));
    assert.equal(result, 2_700_000_000_000); // 2.7조
  });

  test('HTTP 오류(429 등)는 null 반환', async () => {
    const result = await fetchOneFinnhub('NVDA', 'test-token', mockFinnhubError(429));
    assert.equal(result, null);
  });

  test('metric.marketCapitalization 없으면 null 반환', async () => {
    const result = await fetchOneFinnhub('PRIVATE_CO', 'test-token', mockFinnhubNoMetric());
    assert.equal(result, null);
  });

  test('네트워크 예외 발생 시 null 반환 (throw하지 않음)', async () => {
    const result = await fetchOneFinnhub('NVDA', 'test-token', mockFinnhubThrows());
    assert.equal(result, null);
  });

  test('올바른 URL에 ticker를 인코딩해서 요청한다', async () => {
    let capturedUrl = '';
    const captureFetcher = async (url) => {
      capturedUrl = url;
      return { ok: true, json: async () => ({ metric: { marketCapitalization: 100 } }) };
    };

    await fetchOneFinnhub('TSM', 'my-key', captureFetcher);
    assert.ok(capturedUrl.includes('symbol=TSM'));
    assert.ok(capturedUrl.includes('token=my-key'));
    assert.ok(capturedUrl.includes('finnhub.io'));
  });

  test('점(.)과 숫자로만 된 국제 ticker도 symbol 파라미터에 그대로 포함된다', async () => {
    let capturedUrl = '';
    const captureFetcher = async (url) => {
      capturedUrl = url;
      return { ok: false };
    };
    await fetchOneFinnhub('000660.KS', 'key', captureFetcher);
    // encodeURIComponent('000660.KS') === '000660.KS' (URL-safe 문자)
    const parsed = new URL(capturedUrl);
    assert.equal(parsed.searchParams.get('symbol'), '000660.KS');
  });
});

// ─────────────────────────────────────────────
// fetchBatch
// ─────────────────────────────────────────────
describe('fetchBatch', () => {
  test('각 ticker의 시가총액 맵을 반환한다', async () => {
    // ticker마다 100억씩 다르게 반환
    const tickers = ['NVDA', 'AMD', 'INTC'];
    const caps = { NVDA: 2_700_000, AMD: 200_000, INTC: 100_000 };
    const mockFetcher = async (url) => {
      const sym = new URL(url).searchParams.get('symbol');
      return {
        ok: true,
        json: async () => ({ metric: { marketCapitalization: caps[sym] } }),
      };
    };

    const result = await fetchBatch(tickers, 'token', { delayMs: 0, fetcher: mockFetcher });
    assert.equal(result['NVDA'], 2_700_000_000_000);
    assert.equal(result['AMD'],    200_000_000_000);
    assert.equal(result['INTC'],   100_000_000_000);
  });

  test('일부 ticker가 실패해도 성공한 것만 포함된다', async () => {
    const mockFetcher = async (url) => {
      const sym = new URL(url).searchParams.get('symbol');
      if (sym === 'FAIL') return { ok: false };
      return { ok: true, json: async () => ({ metric: { marketCapitalization: 500_000 } }) };
    };

    const result = await fetchBatch(['OK', 'FAIL'], 'token', { delayMs: 0, fetcher: mockFetcher });
    assert.ok('OK' in result);
    assert.ok(!('FAIL' in result));
  });

  test('빈 배열 입력 시 빈 객체 반환', async () => {
    const result = await fetchBatch([], 'token', { delayMs: 0 });
    assert.deepEqual(result, {});
  });

  test('batchSize=2 일 때 배치를 나눠 처리한다', async () => {
    const callLog = [];
    const mockFetcher = async (url) => {
      const sym = new URL(url).searchParams.get('symbol');
      callLog.push(sym);
      return { ok: true, json: async () => ({ metric: { marketCapitalization: 100 } }) };
    };

    // 5개 ticker, batchSize=2 → 3번 배치 (2+2+1)
    const tickers = ['A', 'B', 'C', 'D', 'E'];
    await fetchBatch(tickers, 'token', { batchSize: 2, delayMs: 0, fetcher: mockFetcher });
    assert.equal(callLog.length, 5);
    assert.deepEqual(callLog.sort(), ['A', 'B', 'C', 'D', 'E']);
  });

  test('API 예외 발생해도 다른 ticker 결과는 유지된다', async () => {
    const mockFetcher = async (url) => {
      const sym = new URL(url).searchParams.get('symbol');
      if (sym === 'CRASH') throw new Error('unexpected');
      return { ok: true, json: async () => ({ metric: { marketCapitalization: 1_000 } }) };
    };

    const result = await fetchBatch(['GOOD', 'CRASH'], 'token', { delayMs: 0, fetcher: mockFetcher });
    assert.ok('GOOD' in result);
    assert.ok(!('CRASH' in result));
  });
});
