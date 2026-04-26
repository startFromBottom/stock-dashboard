'use client';

import { useState, useMemo } from 'react';
import {
  SEMI_NEWS_ITEMS,
  SEMI_NEWS_TYPE_LABEL,
  SEMI_CATEGORY_LABEL,
  countByCat,
} from '@/data/semi-news';

// 탭 그룹 정의 (공정 흐름 + 산업 플레이어)
const PROCESS_CATS = ['silicon', 'materials', 'litho', 'deposition', 'etch', 'clean', 'metrology', 'packaging', 'test', 'distribution'];
const INDUSTRY_CATS = ['eda', 'fabless', 'foundry'];

export default function SemiNewsSection() {
  const [activeGroup, setActiveGroup] = useState('all');   // 'all' | 'process' | 'industry'
  const [activeCat,   setActiveCat]   = useState('all');   // 'all' | category id
  const [activeType,  setActiveType]  = useState('all');   // 'all' | type
  const [sortOrder,   setSortOrder]   = useState('desc');  // 'desc' | 'asc'

  // 그룹 변경 시 카테고리 초기화
  function handleGroupClick(groupId) {
    setActiveGroup(groupId);
    setActiveCat('all');
  }

  // 현재 그룹에서 표시할 카테고리 목록
  const visibleCats = useMemo(() => {
    if (activeGroup === 'all')      return [...PROCESS_CATS, ...INDUSTRY_CATS];
    if (activeGroup === 'process')  return PROCESS_CATS;
    if (activeGroup === 'industry') return INDUSTRY_CATS;
    return [];
  }, [activeGroup]);

  // 전체 카운트 맵
  const catCount = useMemo(() => countByCat(SEMI_NEWS_ITEMS), []);

  // 현재 그룹에서 뉴스가 있는 카테고리만 필터
  const catsWithNews = useMemo(() =>
    visibleCats.filter(c => (catCount[c] ?? 0) > 0),
  [visibleCats, catCount]);

  // 필터링 + 정렬
  const filtered = useMemo(() => {
    const result = SEMI_NEWS_ITEMS.filter(n => {
      const groupMatch = activeGroup === 'all'
        ? true
        : activeGroup === 'process'
          ? PROCESS_CATS.includes(n.category)
          : INDUSTRY_CATS.includes(n.category);
      const catMatch  = activeCat === 'all' || n.category === activeCat;
      const typeMatch = activeType === 'all' || n.type === activeType;
      return groupMatch && catMatch && typeMatch;
    });
    result.sort((a, b) =>
      sortOrder === 'desc'
        ? b.date.localeCompare(a.date)
        : a.date.localeCompare(b.date)
    );
    return result;
  }, [activeGroup, activeCat, activeType, sortOrder]);

  // 그룹별 카운트
  const groupCount = useMemo(() => ({
    all:      SEMI_NEWS_ITEMS.length,
    process:  SEMI_NEWS_ITEMS.filter(n => PROCESS_CATS.includes(n.category)).length,
    industry: SEMI_NEWS_ITEMS.filter(n => INDUSTRY_CATS.includes(n.category)).length,
  }), []);

  return (
    <div>
      {/* ── 상단 정보 바 ── */}
      <div className="news-live-bar">
        <span className="news-total-count">총 {SEMI_NEWS_ITEMS.length}개 큐레이션 뉴스 & 레포트</span>
      </div>

      {/* ── 그룹 탭 (전체 / 공정 흐름 / 산업 플레이어) ── */}
      <div className="news-layer-tabs">
        {[
          { id: 'all',      label: '전체',         cnt: groupCount.all },
          { id: 'process',  label: '⚙ 공정 흐름',  cnt: groupCount.process },
          { id: 'industry', label: '🏢 산업 플레이어', cnt: groupCount.industry },
        ].map(g => (
          <button
            key={g.id}
            className={`news-layer-tab${activeGroup === g.id ? ' active' : ''}`}
            onClick={() => handleGroupClick(g.id)}
          >
            {g.label}
            <span className="news-count-badge">{g.cnt}</span>
          </button>
        ))}
      </div>

      {/* ── 카테고리 필터 ── */}
      <div className="news-comp-filters">
        <button
          className={`filter-btn${activeCat === 'all' ? ' active' : ''}`}
          onClick={() => setActiveCat('all')}
        >
          전체 ({activeGroup === 'all' ? groupCount.all : activeGroup === 'process' ? groupCount.process : groupCount.industry})
        </button>
        {catsWithNews.map(catId => {
          const info = SEMI_CATEGORY_LABEL[catId];
          if (!info) return null;
          return (
            <button
              key={catId}
              className={`filter-btn${activeCat === catId ? ' active' : ''}`}
              onClick={() => setActiveCat(catId)}
            >
              {info.icon} {info.name}
              <span className="news-comp-count">{catCount[catId] ?? 0}</span>
            </button>
          );
        })}
      </div>

      {/* ── 유형 필터 ── */}
      <div className="news-type-filters">
        <span className="filter-label">유형</span>
        {['all', 'announcement', 'news', 'report'].map(t => (
          <button
            key={t}
            className={`filter-btn${activeType === t ? ' active' : ''}`}
            onClick={() => setActiveType(t)}
          >
            {t === 'all' ? '전체' : SEMI_NEWS_TYPE_LABEL[t]?.label ?? t}
          </button>
        ))}
      </div>

      {/* ── 결과 요약 + 정렬 ── */}
      <div className="news-result-summary">
        <span>{filtered.length}개 항목</span>
        <button
          className={`sort-btn${sortOrder === 'desc' ? ' active' : ''}`}
          onClick={() => setSortOrder(o => o === 'desc' ? 'asc' : 'desc')}
          title={sortOrder === 'desc' ? '최신순 (클릭 시 오래된순)' : '오래된순 (클릭 시 최신순)'}
        >
          {sortOrder === 'desc' ? '↓ 최신순' : '↑ 오래된순'}
        </button>
      </div>

      {/* ── 뉴스 목록 ── */}
      {filtered.length === 0 ? (
        <p className="hint-text">해당 조건의 뉴스가 없습니다.</p>
      ) : (
        <div className="news-grid">
          {filtered.map(item => {
            const typeInfo = SEMI_NEWS_TYPE_LABEL[item.type] ?? { label: item.type, color: '#818cf8', bg: '#1e1b4b' };
            const catInfo  = SEMI_CATEGORY_LABEL[item.category];
            return (
              <div key={item.id} className="news-card">
                <span
                  className="news-type-badge"
                  style={{ color: typeInfo.color, background: typeInfo.bg }}
                >
                  {typeInfo.label}
                </span>
                <div className="news-body">
                  <div className="news-title">{item.title}</div>
                  <div className="news-summary">{item.summary}</div>
                  <div className="news-footer">
                    {item.tickers.map(t => (
                      <span key={t} className="news-ticker-badge">{t}</span>
                    ))}
                    {catInfo && (
                      <span className="news-comp-badge">
                        {catInfo.icon} {catInfo.name}
                      </span>
                    )}
                    <span className="news-meta">{item.date}</span>
                    <span className="news-source">출처: {item.source}</span>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="news-link"
                    >
                      원문 →
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="hint-text" style={{ marginTop: 24 }}>
        반도체 밸류체인 뉴스 데이터: 큐레이션 {SEMI_NEWS_ITEMS.length}개 · 2025~2026년 기준
      </p>
    </div>
  );
}
