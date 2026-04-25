'use client';

import { useState, useEffect } from 'react';
import { NEWS_ITEMS } from '@/data/news';
import { merge } from '@/lib/news-utils';

// 탭 공유 캐시
const _cache = { data: null, ts: 0 };
const CACHE_TTL = 60 * 60 * 1000; // 1시간

/**
 * 정적 뉴스(data/news.js)를 즉시 반환하고,
 * 백그라운드에서 /api/news를 호출해 라이브 뉴스와 병합합니다.
 *
 * @returns {{
 *   items: NewsItem[],       // 현재 표시 중인 뉴스 목록 (정적 → 병합)
 *   loading: boolean,        // API 로딩 중
 *   error: string|null,      // API 오류 메시지
 *   liveCount: number,       // 라이브로 추가된 뉴스 수
 *   fresh: boolean,          // API 데이터 반영 완료 여부
 * }}
 */
export default function useNews() {
  const [state, setState] = useState({
    items:     NEWS_ITEMS,   // 정적 데이터로 즉시 초기화
    loading:   false,
    error:     null,
    liveCount: 0,
    fresh:     false,
  });

  useEffect(() => {
    // 캐시 히트: 이미 가져온 라이브 데이터 있으면 바로 병합
    if (_cache.data && Date.now() - _cache.ts < CACHE_TTL) {
      setState({
        items:     merge(NEWS_ITEMS, _cache.data),
        loading:   false,
        error:     null,
        liveCount: _cache.data.length,
        fresh:     true,
      });
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    const controller = new AbortController();

    fetch('/api/news', { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(liveItems => {
        if (!Array.isArray(liveItems)) throw new Error('응답 형식 오류');

        _cache.data = liveItems;
        _cache.ts   = Date.now();

        setState({
          items:     merge(NEWS_ITEMS, liveItems),
          loading:   false,
          error:     null,
          liveCount: liveItems.length,
          fresh:     true,
        });
      })
      .catch(err => {
        if (err.name === 'AbortError') return;
        console.warn('[useNews]', err.message);
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

