'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * 주어진 ticker 배열의 거래량(volume) + RSI를 /api/stock-metrics에서 가져옵니다.
 *
 * @param {string[]} tickers  - FMP 호환 ticker 목록
 * @returns {{ metrics: Record<string, {volume: number|null, rsi: number|null}>, loading: boolean, error: string|null }}
 */
export default function useStockMetrics(tickers) {
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const prevKey = useRef('');

  useEffect(() => {
    if (!tickers || tickers.length === 0) return;

    const key = [...tickers].sort().join(',');
    if (key === prevKey.current) return; // tickers 변경 없으면 재조회 스킵
    prevKey.current = key;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/stock-metrics?tickers=${encodeURIComponent(key)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        if (!cancelled) setMetrics(data);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [tickers?.join(',')]); // eslint-disable-line

  return { metrics, loading, error };
}
