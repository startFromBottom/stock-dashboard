'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * 전역 워치리스트 상태 관리 훅 (Phase B — 인증 적용)
 *
 * - 모든 fetch에 Authorization: Bearer <access_token> 첨부
 * - 로그인 상태 변화(login/logout) 감지하면 자동 reload·clear
 * - mutation은 optimistic update + 실패 시 롤백
 *
 * 사용:
 *   const { items, isWatched, add, remove, update, loading, requiresAuth } = useWatchlist();
 *   if (requiresAuth) → 로그인 필요 안내
 */

// ── 모듈 레벨 전역 상태 ──────────────────────────────
let globalItems = null;
let globalError = null;
let globalLoading = false;
let globalLoaded = false;
let globalRequiresAuth = false;
let currentSessionUserId = null; // 현재 세션이 누구를 위해 로드되었는지
const subscribers = new Set();

function notify() {
  for (const s of subscribers) s();
}

function resetState() {
  globalItems = null;
  globalError = null;
  globalLoading = false;
  globalLoaded = false;
  globalRequiresAuth = false;
  currentSessionUserId = null;
  notify();
}

function setGlobalItems(items) {
  globalItems = items;
  notify();
}

async function getAccessToken() {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

async function authedFetch(url, opts = {}) {
  const token = await getAccessToken();
  const headers = { ...(opts.headers ?? {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (opts.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  return fetch(url, { ...opts, headers });
}

async function loadOnce() {
  if (globalLoading) return;

  // 인증 안 됐으면 로드 안 함
  const token = await getAccessToken();
  if (!token) {
    globalRequiresAuth = true;
    globalItems = [];
    globalLoaded = true;
    notify();
    return;
  }

  globalLoading = true;
  globalRequiresAuth = false;
  notify();

  try {
    const res = await authedFetch('/api/watchlist');
    if (res.status === 401) {
      globalRequiresAuth = true;
      globalItems = [];
      globalError = null;
      return;
    }
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j.error ?? `HTTP ${res.status}`);
    }
    const j = await res.json();
    globalItems = j.items ?? [];
    globalError = null;
    globalRequiresAuth = false;
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

// auth 변화 감지 — 로그인하면 reload, 로그아웃하면 clear
let authListenerInitialized = false;
function ensureAuthListener() {
  if (authListenerInitialized || !supabase) return;
  authListenerInitialized = true;

  // 첫 세션 처리
  supabase.auth.getSession().then(({ data: { session } }) => {
    const userId = session?.user?.id ?? null;
    if (userId !== currentSessionUserId) {
      currentSessionUserId = userId;
      globalLoaded = false;
      loadOnce();
    }
  });

  supabase.auth.onAuthStateChange((event, session) => {
    const userId = session?.user?.id ?? null;
    if (userId !== currentSessionUserId) {
      currentSessionUserId = userId;
      if (userId) {
        // 새 사용자 로그인 → 다시 로드
        globalLoaded = false;
        globalLoading = false;
        loadOnce();
      } else {
        // 로그아웃 → 상태 초기화
        resetState();
      }
    }
  });
}

// ── React 훅 ────────────────────────────────────────
export default function useWatchlist() {
  const [, force] = useState(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const sub = () => mountedRef.current && force(n => n + 1);
    subscribers.add(sub);
    ensureAuthListener();
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
    if (globalRequiresAuth) return { error: 'auth_required' };

    const upper = ticker.toUpperCase();
    if (tickerSet.has(upper)) return null;

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
      const res = await authedFetch('/api/watchlist', {
        method: 'POST',
        body: JSON.stringify({ ticker: upper, name, sector, added_price }),
      });
      if (res.status === 401) {
        setGlobalItems((globalItems ?? []).filter(it => it.id !== tempItem.id));
        globalRequiresAuth = true;
        notify();
        return { error: 'auth_required' };
      }
      if (!res.ok && res.status !== 409) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `HTTP ${res.status}`);
      }
      const j = await res.json();
      setGlobalItems((globalItems ?? []).map(it =>
        it.id === tempItem.id ? (j.item ?? it) : it
      ));
      return j.item;
    } catch (e) {
      console.warn('[useWatchlist] add 실패:', e.message);
      setGlobalItems((globalItems ?? []).filter(it => it.id !== tempItem.id));
      return null;
    }
  }, [items]); // eslint-disable-line

  const remove = useCallback(async (ticker) => {
    if (!ticker) return false;
    if (globalRequiresAuth) return false;

    const upper = ticker.toUpperCase();
    const prev = globalItems ?? [];
    const next = prev.filter(it => it.ticker !== upper);
    setGlobalItems(next);

    try {
      const res = await authedFetch(`/api/watchlist?ticker=${encodeURIComponent(upper)}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `HTTP ${res.status}`);
      }
      return true;
    } catch (e) {
      console.warn('[useWatchlist] remove 실패:', e.message);
      setGlobalItems(prev);
      return false;
    }
  }, [items]); // eslint-disable-line

  const update = useCallback(async ({ ticker, buy_price, buy_shares, memo }) => {
    if (!ticker) return null;
    if (globalRequiresAuth) return null;

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

      const res = await authedFetch('/api/watchlist', {
        method: 'PATCH',
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
      setGlobalItems(prev);
      return null;
    }
  }, [items]); // eslint-disable-line

  const toggle = useCallback(async ({ ticker, name, sector, added_price }) => {
    if (!ticker) return;
    if (tickerSet.has(ticker.toUpperCase())) {
      await remove(ticker);
    } else {
      return await add({ ticker, name, sector, added_price });
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
    requiresAuth: globalRequiresAuth,
  };
}
