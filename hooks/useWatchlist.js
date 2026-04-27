'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * 전역 워치리스트 상태 관리 훅
 *
 * - 모든 컴포넌트가 같은 상태를 봄 (subscribe 패턴)
 * - 첫 마운트 시 1회 fetch, 그 이후엔 캐시 사용
 * - mutation은 optimistic update + 실패 시 롤백
 *
 * 사용 예:
 *   const { items, isWatched, add, remove, update, loading } = useWatchlist();
 *   if (isWatched('NVDA')) ...
 *   add({ ticker: 'NVDA', name: 'NVIDIA', sector: 'ai-dc', added_price: 506.46 });
 *   update({ ticker: 'NVDA', memo: '메모', buy_price: 500, buy_shares: 10 });
 *   remove('NVDA');
 */

// ── 모듈 레벨 전역 상태 ──────────────────────────────
let globalItems = null;       // null = 미로드, [] = 빈 워치리스트
let globalError = null;
let globalLoading = false;
let globalLoaded = false;
const subscribers = new Set();

function notify() {
  for (const s of subscribers) s();
}

function setGlobalItems(items) {
  globalItems = items;
  notify();
}

async function loadOnce() {
  if (globalLoaded || globalLoading) return;
  globalLoading = true;
  notify();
  try {
    const res = await fetch('/api/watchlist');
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j.error ?? `HTTP ${res.status}`);
    }
    const j = await res.json();
    globalItems = j.items ?? [];
    globalError = null;
  } catch (e) {
    console.warn('[useWatchlist] load 실패:', e.message);
    globalError = e.message;
    globalItems = [];
  } finally {
    globalLoading = false;
    globalLoaded = true;
    notify();
  }
}

// ── React 훅 ────────────────────────────────────────
export default function useWatchlist() {
  const [, force] = useState(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const sub = () => mountedRef.current && force(n => n + 1);
    subscribers.add(sub);
    loadOnce(); // 첫 호출에서만 실제로 fetch
    return () => {
      mountedRef.current = false;
      subscribers.delete(sub);
    };
  }, []);

  const items = globalItems ?? [];
  const tickerSet = new Set(items.map(i => i.ticker));

  const isWatched = useCallback((ticker) => {
    if (!ticker) return false;
    return tickerSet.has(ticker.toUpperCase());
  }, [items]); // eslint-disable-line

  const add = useCallback(async ({ ticker, name, sector, added_price }) => {
    if (!ticker) return null;
    const upper = ticker.toUpperCase();
    if (tickerSet.has(upper)) return null; // 이미 있음

    // optimistic
    const tempItem = {
      id: -Date.now(),
      ticker: upper,
      name: name ?? null,
      sector: sector ?? null,
      added_at: new Date().toISOString(),
      added_price: typeof added_price === 'number' ? added_price : null,
      buy_price: null,
      buy_shares: null,
      memo: null,
      _pending: true,
    };
    setGlobalItems([tempItem, ...(globalItems ?? [])]);

    try {
      const res = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: upper, name, sector, added_price }),
      });
      if (!res.ok && res.status !== 409) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `HTTP ${res.status}`);
      }
      const j = await res.json();
      // 임시 항목을 실제 항목으로 교체
      setGlobalItems((globalItems ?? []).map(it =>
        it.id === tempItem.id ? (j.item ?? it) : it
      ));
      return j.item;
    } catch (e) {
      console.warn('[useWatchlist] add 실패:', e.message);
      // 롤백
      setGlobalItems((globalItems ?? []).filter(it => it.id !== tempItem.id));
      return null;
    }
  }, [items]); // eslint-disable-line

  const remove = useCallback(async (ticker) => {
    if (!ticker) return false;
    const upper = ticker.toUpperCase();

    const prev = globalItems ?? [];
    const next = prev.filter(it => it.ticker !== upper);
    setGlobalItems(next);

    try {
      const res = await fetch(`/api/watchlist?ticker=${encodeURIComponent(upper)}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `HTTP ${res.status}`);
      }
      return true;
    } catch (e) {
      console.warn('[useWatchlist] remove 실패:', e.message);
      setGlobalItems(prev); // 롤백
      return false;
    }
  }, [items]); // eslint-disable-line

  const update = useCallback(async ({ ticker, buy_price, buy_shares, memo }) => {
    if (!ticker) return null;
    const upper = ticker.toUpperCase();

    const prev = globalItems ?? [];
    const target = prev.find(it => it.ticker === upper);
    if (!target) return null;

    const optimistic = { ...target };
    if (buy_price  !== undefined) optimistic.buy_price  = buy_price;
    if (buy_shares !== undefined) optimistic.buy_shares = buy_shares;
    if (memo       !== undefined) optimistic.memo       = memo;

    setGlobalItems(prev.map(it => it.ticker === upper ? optimistic : it));

    try {
      const body = { ticker: upper };
      if (buy_price  !== undefined) body.buy_price  = buy_price;
      if (buy_shares !== undefined) body.buy_shares = buy_shares;
      if (memo       !== undefined) body.memo       = memo;

      const res = await fetch('/api/watchlist', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `HTTP ${res.status}`);
      }
      const j = await res.json();
      setGlobalItems((globalItems ?? []).map(it =>
        it.ticker === upper ? (j.item ?? it) : it
      ));
      return j.item;
    } catch (e) {
      console.warn('[useWatchlist] update 실패:', e.message);
      setGlobalItems(prev); // 롤백
      return null;
    }
  }, [items]); // eslint-disable-line

  const toggle = useCallback(async ({ ticker, name, sector, added_price }) => {
    if (!ticker) return;
    if (tickerSet.has(ticker.toUpperCase())) {
      await remove(ticker);
    } else {
      await add({ ticker, name, sector, added_price });
    }
  }, [items, add, remove]); // eslint-disable-line

  return {
    items,
    isWatched,
    add,
    remove,
    update,
    toggle,
    loading: globalLoading && !globalLoaded,
    error: globalError,
    loaded: globalLoaded,
  };
}
