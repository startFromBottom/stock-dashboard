'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * /api/sector-heatmap을 섹터별로 나눠 호출해서 점진 로딩 효과 제공.
 *
 * @param {string[]|null} prioritizedSectors  - 호출 순서 (모멘텀 핫한 섹터부터 같은 식). null이면 기본 순.
 * @returns {{
 *   data: Record<string, Array<{ticker,name,layerName,mktcap,changePct,price,pe}>|null>,
 *   loadedSet: Set<string>,
 *   loading: boolean,
 *   error: string|null,
 * }}
 */

const DEFAULT_ORDER = ['ai-dc', 'semi', 'space', 'energy', 'biotech', 'fintech', 'healthcare', 'quantum', 'staples', 'discretionary', 'financials', 'industrials', 'raw'];
const CHUNK_SIZE = 2; // 한 번에 2섹터씩 호출

// 클라이언트 메모리 캐시
const cache = new Map(); // sectorId → { data, ts }
const CACHE_TTL = 15 * 60 * 1000;

export default function useSectorHeatmap(prioritizedSectors) {
  const [data, setData] = useState({});
  const [loadedSet, setLoadedSet] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  // priority가 변할 때마다 리로드 — 단, sectors 배열 동일성 체크 위해 join 사용
  const orderKey = (prioritizedSectors ?? DEFAULT_ORDER).join(',');

  useEffect(() => {
    const order = (prioritizedSectors && prioritizedSectors.length > 0)
      ? prioritizedSectors
      : DEFAULT_ORDER;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    // 캐시 즉시 적용
    const initialData = {};
    const initialLoaded = new Set();
    const now = Date.now();
    for (const sid of order) {
      const c = cache.get(sid);
      if (c && now - c.ts < CACHE_TTL) {
        initialData[sid] = c.data;
        initialLoaded.add(sid);
      }
    }
    if (Object.keys(initialData).length > 0) {
      setData(initialData);
      setLoadedSet(initialLoaded);
    }

    // 캐시에 없는 섹터만 점진 호출
    const todo = order.filter(sid => !initialLoaded.has(sid));

    if (todo.length === 0) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        for (let i = 0; i < todo.length; i += CHUNK_SIZE) {
          if (controller.signal.aborted) return;
          const chunk = todo.slice(i, i + CHUNK_SIZE);
          const url = `/api/sector-heatmap?sectors=${encodeURIComponent(chunk.join(','))}`;

          const res = await fetch(url, { signal: controller.signal });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const json = await res.json();
          if (controller.signal.aborted) return;
          if (json.error) throw new Error(json.error);

          const ts = Date.now();
          setData(prev => {
            const next = { ...prev };
            for (const sid of chunk) {
              const sectorData = json.data?.[sid] ?? [];
              next[sid] = sectorData;
              cache.set(sid, { data: sectorData, ts });
            }
            return next;
          });
          setLoadedSet(prev => {
            const next = new Set(prev);
            for (const sid of chunk) next.add(sid);
            return next;
          });
        }
        setLoading(false);
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.warn('[useSectorHeatmap]', err.message);
        setError(err.message);
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [orderKey]); // eslint-disable-line

  return { data, loadedSet, loading, error };
}
