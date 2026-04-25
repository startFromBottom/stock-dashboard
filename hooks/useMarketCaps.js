'use client';

import { useState, useEffect, useRef } from 'react';

// 브라우저 탭 공유 메모리 캐시 — ticker 세트(key)별로 저장
// key = 정렬된 ticker 문자열, value = { data, ts }
const clientCache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1시간

/**
 * @param {string[]} tickers  - Finnhub 정규화된 ticker 배열
 * @returns {{ mktcaps: Record<string,number>, loading: boolean, error: string|null, fresh: boolean }}
 *   mktcaps: { NVDA: 2700000000000, ... }
 *   fresh: true = API에서 막 가져온 값, false = 캐시 또는 미로드
 */
export default function useMarketCaps(tickers) {
  const [state, setState] = useState({
    mktcaps: {},
    loading: false,
    error: null,
    fresh: false,
  });
  const abortRef = useRef(null);

  useEffect(() => {
    if (!tickers || tickers.length === 0) return;

    const key = [...tickers].sort().join(',');
    const now = Date.now();

    // 클라이언트 캐시 히트 (이 ticker 세트에 대해 이미 가져온 적 있으면 재사용)
    const cached = clientCache.get(key);
    if (cached && now - cached.ts < CACHE_TTL) {
      setState({ mktcaps: cached.data, loading: false, error: null, fresh: false });
      return;
    }

    // 이전 요청 중단
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState(prev => ({ ...prev, loading: true, error: null }));

    fetch(`/api/mktcap?tickers=${encodeURIComponent(key)}`, {
      signal: controller.signal,
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data.error) throw new Error(data.error);
        clientCache.set(key, { data, ts: Date.now() });
        setState({ mktcaps: data, loading: false, error: null, fresh: true });
      })
      .catch(err => {
        if (err.name === 'AbortError') return;
        console.warn('[useMarketCaps]', err.message);
        setState(prev => ({ ...prev, loading: false, error: err.message }));
      });

    return () => controller.abort();
  }, [tickers.join(',')]); // eslint-disable-line

  return state;
}
