'use client';

import { useState, useMemo } from 'react';
import {
  HEALTHCARE_NEWS_ITEMS,
  HEALTHCARE_NEWS_TYPE_LABEL,
  HEALTHCARE_CATEGORY_LABEL,
  countHealthcareByCat,
} from '@/data/healthcare-news';

const ALL_CATS = Object.keys(HEALTHCARE_CATEGORY_LABEL);

const GROUPS = [
  { id: 'all',       label: '전체',                cats: ALL_CATS },
  { id: 'devices',   label: '🏥 의료기기',         cats: ['surgical_robot', 'imaging_ai'] },
  { id: 'it',        label: '💻 의료IT',           cats: ['medical_it', 'wearable_cgm'] },
  { id: 'services',  label: '🏢 의료서비스',       cats: ['hospital'] },
  { id: 'saas',      label: '📊 헬스케어 SaaS',    cats: ['saas_billing'] },
];

export default function HealthcareNewsSection() {
  const [activeGroup, setActiveGroup] = useState('all');
  const [activeCat,   setActiveCat]   = useState('all');
  const [activeType,  setActiveType]  = useState('all');
  const [sortOrder,   setSortOrder]   = useState('desc');

  function handleGroupClick(groupId) {
    setActiveGroup(groupId);
    setActiveCat('all');
  }

  const currentGroup = GROUPS.find(g => g.id === activeGroup);
  const catCount = useMemo(() => countHealthcareByCat(HEALTHCARE_NEWS_ITEMS), []);

  const catsWithNews = useMemo(() =>
    currentGroup.cats.filter(c => (catCount[c] ?? 0) > 0),
  [currentGroup, catCount]);

  // 그룹별 총 뉴스 수
  const groupCount = useMemo(() => {
    const result = { all: HEALTHCARE_NEWS_ITEMS.length };
    for (const g of GROUPS) {
      if (g.id !== 'all') {
        result[g.id] = HEALTHCARE_NEWS_ITEMS.filter(n => g.cats.includes(n.category)).length;
      }
    }
    return result;
  }, []);

  const filtered = useMemo(() => {
    const result = HEALTHCARE_NEWS_ITEMS.filter(n => {
      const groupMatch = activeGroup === 'all' || currentGroup.cats.includes(n.category);
      const catMatch   = activeCat === 'all' || n.category === activeCat;
      const typeMatch  = activeType === 'all' || n.type === activeType;
      return groupMatch && catMatch && typeMatch;
    });
    result.sort((a, b) =>
      sortOrder === 'desc'
        ? b.date.localeCompare(a.date)
        : a.date.localeCompare(b.date)
    );
    return result;
  }, [activeGroup, activeCat, activeType, sortOrder, currentGroup]);

  return (
    <div>
      {/* 상단 바 */}
      <div className="news-live-bar">
        <span className="news-total-count">
          총 {HEALTHCARE_NEWS_ITEMS.length}개 뉴스·리포트
          &ensp;·&ensp;
          리포트 {HEALTHCARE_NEWS_ITEMS.filter(n => n.type === 'report').length}개
          &ensp;·&ensp;
          뉴스 {HEALTHCARE_NEWS_ITEMS.filter(n => n.type === 'news').length}개
        </span>
      </div>

      {/* 그룹 탭 */}
      <div className="news-layer-tabs">
        {GROUPS.map(g => (
          <button
            key={g.id}
            className={`news-layer-tab${activeGroup === g.id ? ' active' : ''}`}
            onClick={() => handleGroupClick(g.id)}
          >
            {g.label}
            <span className="news-count-badge">{groupCount[g.id] ?? 0}</span>
          </button>
        ))}
      </div>

      {/* 카테고리 필터 */}
      <div className="news-comp-filters">
        <button
          className={`filter-btn${activeCat === 'all' ? ' active' : ''}`}
          onClick={() => setActiveCat('all')}
        >
          전체 ({groupCount[activeGroup] ?? HEALTHCARE_NEWS_ITEMS.length})
        </button>
        {catsWithNews.map(catId => {
          const info = HEALTHCARE_CATEGORY_LABEL[catId];
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

      {/* 타입 + 정렬 */}
      <div className="news-type-bar">
        <div className="news-type-filters">
          {['all', 'news', 'report'].map(t => (
            <button
              key={t}
              className={`news-type-btn${activeType === t ? ' active' : ''}`}
              onClick={() => setActiveType(t)}
            >
              {t === 'all' ? '전체' : HEALTHCARE_NEWS_TYPE_LABEL[t]?.label}
            </button>
          ))}
        </div>
        <button
          className="news-sort-btn"
          onClick={() => setSortOrder(v => v === 'desc' ? 'asc' : 'desc')}
        >
          {sortOrder === 'desc' ? '↓ 최신순' : '↑ 오래된순'}
        </button>
      </div>

      {/* 결과 수 */}
      <div className="news-result-summary">
        <span>{filtered.length}개 항목</span>
      </div>

      {/* 뉴스 카드 목록 */}
      {filtered.length === 0 ? (
        <p className="hint-text">해당 조건의 뉴스가 없습니다.</p>
      ) : (
        <div className="news-list">
          {filtered.map(item => {
            const catInfo  = HEALTHCARE_CATEGORY_LABEL[item.category];
            const typeInfo = HEALTHCARE_NEWS_TYPE_LABEL[item.type];
            return (
              <div key={item.id} className="news-card">
                <div className="news-card-header">
                  <span className="news-cat-badge">
                    {catInfo?.icon} {catInfo?.name}
                  </span>
                  <span className={`news-type-badge ${item.type}`}>
                    {typeInfo?.icon} {typeInfo?.label}
                  </span>
                  <span className="news-date">{item.date}</span>
                </div>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="news-title"
                >
                  {item.title}
                </a>
                <p className="news-summary">{item.summary}</p>
                <div className="news-footer">
                  <span className="news-source">{item.source}</span>
                  <div className="news-tickers">
                    {item.tickers?.map(t => (
                      <span key={t} className="news-ticker-badge">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="hint-text" style={{ marginTop: 24 }}>
        헬스케어·의료기기 섹터 뉴스 {HEALTHCARE_NEWS_ITEMS.length}개 · 2025~2026년 기준
      </p>
    </div>
  );
}
