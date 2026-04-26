'use client';

import { useState, useEffect, useRef } from 'react';

// 브라우저 탭 공유 메모리 캐시 — ticker 세트(key)별로 저장
// 새로고침해도 같은 탭이면 TTL 내 재호출 없음
const clientCache = new Map();
const CACHE_TTL = 15 * 60 * 1000; // 15분 (서버 캐시와 동일)

/**
 * 주어진 ticker 배열의 거래량(volume) + RSI를 /api/stock-metrics에서 가져옵니다.
 *
 * @param {string[]} tickers  - FMP 호환 ticker 목록
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

    // 클라이언트 캐시 히트 → 서버 호출 없이 즉시 반환
    const cached = clientCache.get(key);
    if (cached && now - cached.ts < CACHE_TTL) {
      setMetrics(cached.data);
      setLoading(false);
      setError(null);
      return;
    }

    // 이전 요청 중단
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
        if (data.error) throw new Error(data.error);
        clientCache.set(key, { data, ts: Date.now() });
        setMetrics(data);
        setLoading(false);
      })
      .catch(err => {
        if (err.name === 'AbortError') return;
        console.warn('[useStockMetrics]', err.message);
        setError(err.message);
        setLoading(false);
      });

    return () => controller.abort();
  }, [tickers?.join(',')]); // eslint-disable-line

  return { metrics, loading, error };
}
