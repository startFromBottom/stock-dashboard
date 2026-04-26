'use client';

import { useState, useEffect, useRef } from 'react';

// 브라우저 메모리 캐시 (5분 TTL)
const clientCache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

/**
 * ETF ticker 배열의 실시간 시세를 /api/etf-quotes에서 가져옵니다.
 * @param {string[]} tickers
 * @returns {{ quotes: Record<string, {price,change,changePct,prevClose,high,low}>, loading: boolean, error: string|null }}
 */
export default function useEtfQuotes(tickers) {
  const [quotes,  setQuotes]  = useState({});
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    if (!tickers || tickers.length === 0) return;

    const key = [...tickers].sort().join(',');
    const now = Date.now();

    // 클라이언트 캐시 히트
    const cached = clientCache.get(key);
    if (cached && now - cached.ts < CACHE_TTL) {
      setQuotes(cached.data);
      setLoading(false);
      setError(null);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    fetch(`/api/etf-quotes?tickers=${encodeURIComponent(key)}`, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data.error) throw new Error(data.error);
        clientCache.set(key, { data, ts: Date.now() });
        setQuotes(data);
        setLoading(false);
      })
      .catch(err => {
        if (err.name === 'AbortError') return;
        console.warn('[useEtfQuotes]', err.message);
        setError(err.message);
        setLoading(false);
      });

    return () => controller.abort();
  }, [tickers?.join(',')]); // eslint-disable-line

  return { quotes, loading, error };
}
