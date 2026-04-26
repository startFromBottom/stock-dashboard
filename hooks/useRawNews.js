'use client';

import { useState, useEffect } from 'react';
import { RAW_NEWS_ITEMS } from '@/data/rawNews';

// 탭 공유 캐시
const _cache = { data: null, ts: 0 };
const CACHE_TTL = 60 * 60 * 1000; // 1시간

/**
 * 정적 원자재 뉴스(data/rawNews.js)를 즉시 반환하고,
 * 백그라운드에서 /api/raw-news를 호출해 라이브 뉴스와 병합합니다.
 *
 * @returns {{
 *   items: NewsItem[],
 *   loading: boolean,
 *   error: string|null,
 *   liveCount: number,
 *   fresh: boolean,
 * }}
 */
export default function useRawNews() {
  const [state, setState] = useState({
    items:     RAW_NEWS_ITEMS,
    loading:   false,
    error:     null,
    liveCount: 0,
    fresh:     false,
  });

  useEffect(() => {
    // 캐시 히트
    if (_cache.data && Date.now() - _cache.ts < CACHE_TTL) {
      setState({
        items:     mergeRawNews(RAW_NEWS_ITEMS, _cache.data),
        loading:   false,
        error:     null,
        liveCount: _cache.data.length,
        fresh:     true,
      });
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    const controller = new AbortController();

    fetch('/api/raw-news', { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(liveItems => {
        if (!Array.isArray(liveItems)) throw new Error('응답 형식 오류');

        _cache.data = liveItems;
        _cache.ts   = Date.now();

        setState({
          items:     mergeRawNews(RAW_NEWS_ITEMS, liveItems),
          loading:   false,
          error:     null,
          liveCount: liveItems.length,
          fresh:     true,
        });
      })
      .catch(err => {
        if (err.name === 'AbortError') return;
        console.warn('[useRawNews]', err.message);
        setState(prev => ({
          ...prev,
          loading: false,
          error:   err.message,
        }));
      });

    return () => controller.abort();
  }, []);

  return state;
}

/**
 * 정적 뉴스 + 라이브 뉴스 병합 (중복 id 제거, 날짜 내림차순)
 */
function mergeRawNews(staticItems, liveItems) {
  const ids = new Set(staticItems.map(n => n.id));
  const deduped = liveItems.filter(n => !ids.has(n.id));
  const merged = [...staticItems, ...deduped];
  merged.sort((a, b) => b.date.localeCompare(a.date));
  return merged;
}
