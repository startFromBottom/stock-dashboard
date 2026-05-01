'use client';

import { useState, useEffect, useRef } from 'react';

// 브라우저 탭 공유 메모리 캐시 — ticker 세트(key)별로 저장
// 새로고침해도 같은 탭이면 TTL 내 재호출 없음
const clientCache = new Map();
const CACHE_TTL = 15 * 60 * 1000; // 15분 (서버 캐시와 동일)

// RSI 클라이언트 캐시 (ticker별, 서버에서도 6h TTL이지만 클라에서 한 번 더)
const rsiClientCache = new Map(); // ticker → { value, ts }
const RSI_CLIENT_TTL = 6 * 60 * 60 * 1000; // 6h

/**
 * 주어진 ticker 배열의 거래량(volume) + RSI를 가져옵니다.
 *
 * 동작 단계:
 *   1. /api/stock-metrics 한 번 호출 → 거래량 즉시 채움 (~수백ms)
 *   2. 그 다음 백그라운드로 ticker 하나씩 /api/stock-rsi 호출 → RSI 점진적 채움
 *      (Alpha Vantage 분당 5회 한도라 서버에서 큐로 12.5초 간격 throttle)
 *
 * @param {string[]} tickers  - 정규화된 ticker 목록
 * @returns {{ metrics: Record<string, {volume: number|null, rsi: number|null}>, loading: boolean, error: string|null }}
 */
export default function useStockMetrics(tickers) {
  const [metrics,  setMetrics]  = useState({});
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    if (!tickers || tickers.length === 0) return;

    const key = [...tickers].sort().join(',');
    const now = Date.now();
    let cancelled = false;

    // 1단계: 거래량 — 캐시 hit 시 즉시 반환
    const cached = clientCache.get(key);
    let initialMetrics;
    if (cached && now - cached.ts < CACHE_TTL) {
      initialMetrics = cached.data;
      setMetrics(initialMetrics);
      setLoading(false);
      setError(null);
    } else {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);
      setError(null);

      fetch(`/api/stock-metrics?tickers=${encodeURIComponent(key)}`, {
        signal: controller.signal,
      })
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(data => {
          if (cancelled) return;
          if (data.error) throw new Error(data.error);
          clientCache.set(key, { data, ts: Date.now() });
          initialMetrics = data;
          setMetrics(data);
          setLoading(false);

          // 2단계 시작 (점진적 RSI fetch)
          startRsiBackfill(tickers, data, cancelled, setMetrics);
        })
        .catch(err => {
          if (err.name === 'AbortError') return;
          console.warn('[useStockMetrics]', err.message);
          setError(err.message);
          setLoading(false);
        });

      return () => {
        cancelled = true;
        controller.abort();
      };
    }

    // 캐시 hit 경로 → 거래량 이미 있고, RSI만 백그라운드로 채움
    if (initialMetrics) {
      startRsiBackfill(tickers, initialMetrics, cancelled, setMetrics);
    }

    return () => { cancelled = true; };
  }, [tickers?.join(',')]); // eslint-disable-line

  return { metrics, loading, error };
}

/**
 * 백그라운드에서 ticker별로 /api/stock-rsi를 차례차례 호출.
 * 서버에서 큐로 throttle하니 클라는 그냥 동시에 던져도 되지만,
 * 너무 많이 일어나면 fetch들이 노드 안에서 hang하니 약간의 staggering.
 */
function startRsiBackfill(tickers, baseMetrics, cancelled, setMetrics) {
  const need = tickers.filter(t => {
    if (!t) return false;
    // 클라 캐시 hit이면 skip
    const c = rsiClientCache.get(t);
    if (c && Date.now() - c.ts < RSI_CLIENT_TTL) return false;
    // 이미 RSI가 있으면 skip
    return !(typeof baseMetrics?.[t]?.rsi === 'number');
  });

  if (need.length === 0) {
    // 모두 캐시 hit → 캐시값만 머지
    const merged = { ...baseMetrics };
    let updated = false;
    for (const t of tickers) {
      const c = rsiClientCache.get(t);
      if (c && typeof c.value === 'number') {
        merged[t] = { ...(merged[t] ?? {}), rsi: c.value };
        updated = true;
      }
    }
    if (updated) setMetrics(merged);
    return;
  }

  // 클라 캐시 있는 것들 먼저 즉시 머지
  const merged = { ...baseMetrics };
  let didCacheMerge = false;
  for (const t of tickers) {
    const c = rsiClientCache.get(t);
    if (c && typeof c.value === 'number') {
      merged[t] = { ...(merged[t] ?? {}), rsi: c.value };
      didCacheMerge = true;
    }
  }
  if (didCacheMerge) setMetrics(merged);

  // need 종목들 fetch — 100ms 간격으로 살짝 stagger (네트워크 풀 보호)
  need.forEach((t, idx) => {
    setTimeout(() => {
      if (cancelled) return;
      fetch(`/api/stock-rsi?ticker=${encodeURIComponent(t)}`)
        .then(res => res.ok ? res.json() : null)
        .then(j => {
          if (cancelled) return;
          if (typeof j?.rsi === 'number') {
            rsiClientCache.set(t, { value: j.rsi, ts: Date.now() });
            setMetrics(prev => ({
              ...prev,
              [t]: { ...(prev[t] ?? {}), rsi: j.rsi },
            }));
          }
        })
        .catch(() => { /* RSI 실패는 무시 */ });
    }, idx * 100);
  });
}
