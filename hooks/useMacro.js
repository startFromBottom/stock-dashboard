'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * /api/macro 거시 지표 fetch 훅
 *
 * @returns {{
 *   indicators: Record<string, { label, icon, ticker, kind, price, changePct, ... }>,
 *   cryptoFearGreed: { value, classification, change }|null,
 *   loading: boolean,
 *   error: string|null,
 *   generatedAt: number|null,
 * }}
 */

const cache = { data: null, ts: 0 };
const CACHE_TTL = 15 * 60 * 1000;

export default function useMacro() {
  const [state, setState] = useState({
    indicators: null,
    cryptoFearGreed: null,
    loading: false,
    error: null,
    generatedAt: null,
  });
  const abortRef = useRef(null);

  useEffect(() => {
    const now = Date.now();
    if (cache.data && now - cache.ts < CACHE_TTL) {
      setState({
        indicators: cache.data.indicators,
        cryptoFearGreed: cache.data.cryptoFearGreed,
        loading: false,
        error: null,
        generatedAt: cache.data.generatedAt,
      });
      return;
    }

    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setState(prev => ({ ...prev, loading: true, error: null }));

    fetch('/api/macro', { signal: ctrl.signal })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(payload => {
        if (payload.error) throw new Error(payload.error);
        cache.data = payload;
        cache.ts = Date.now();
        setState({
          indicators: payload.indicators,
          cryptoFearGreed: payload.cryptoFearGreed,
          loading: false,
          error: null,
          generatedAt: payload.generatedAt,
        });
      })
      .catch(err => {
        if (err.name === 'AbortError') return;
        console.warn('[useMacro]', err.message);
        setState(prev => ({ ...prev, loading: false, error: err.message }));
      });

    return () => ctrl.abort();
  }, []);

  return state;
}
