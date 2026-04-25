'use client';

import { useState, useEffect, useRef } from 'react';

// 브라우저 탭 공유 메모리 캐시 (새로고침 전까지 유지)
const clientCache = { data: null, ts: 0, key: '' };
const CACHE_TTL = 60 * 60 * 1000; // 1시간

/**
 * @param {string[]} tickers  - FMP 정규화된 ticker 배열
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

    // 클라이언트 캐시 히트
    if (clientCache.key === key && clientCache.data && now - clientCache.ts < CACHE_TTL) {
      setState({ mktcaps: clientCache.data, loading: false, error: null, fresh: false });
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
        clientCache.data = data;
        clientCache.ts   = Date.now();
        clientCache.key  = key;
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
