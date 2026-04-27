'use client';

import { useState, useEffect, useRef } from 'react';

// 클라이언트 캐시 — 첫 호출 비용 크니까 15분 유지
const clientCache = { data: null, ts: 0 };
const CACHE_TTL = 15 * 60 * 1000;

/**
 * /api/sector-overview에서 7개 섹터의 ETF/회사 지표를 한 번에 가져옵니다.
 * @returns {{
 *   data: Record<string, {
 *     etfTicker: string,
 *     etfMetrics: { returns: Record<string,number>, volatilityPct: number, turnoverRatio: number|null, sparkline: number[] }|null,
 *     weightedToday: number|null,
 *     companiesUsed: number,
 *     sectorPeMedian: number|null,
 *   }>|null,
 *   loading: boolean,
 *   error: string|null,
 *   generatedAt: number|null,
 * }}
 */
export default function useSectorOverview() {
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null,
    generatedAt: null,
  });
  const abortRef = useRef(null);

  useEffect(() => {
    const now = Date.now();
    if (clientCache.data && now - clientCache.ts < CACHE_TTL) {
      setState({
        data: clientCache.data.data,
        loading: false,
        error: null,
        generatedAt: clientCache.data.generatedAt,
      });
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState(prev => ({ ...prev, loading: true, error: null }));

    fetch('/api/sector-overview', { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(payload => {
        if (payload.error) throw new Error(payload.error);
        clientCache.data = payload;
        clientCache.ts = Date.now();
        setState({
          data: payload.data,
          loading: false,
          error: null,
          generatedAt: payload.generatedAt,
        });
      })
      .catch(err => {
        if (err.name === 'AbortError') return;
        console.warn('[useSectorOverview]', err.message);
        setState(prev => ({ ...prev, loading: false, error: err.message }));
      });

    return () => controller.abort();
  }, []);

  return state;
}
