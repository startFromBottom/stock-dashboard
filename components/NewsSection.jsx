'use client';

import { useState, useMemo } from 'react';
import { NEWS_ITEMS, NEWS_TYPE_LABEL } from '@/data/news';
import { ALL_COMPONENTS } from '@/data/companies';

const ALL_FILTER = { id: 'all', label: '전체' };

export default function NewsSection() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeType, setActiveType]     = useState('all');

  // category filter options from actual news data
  const categoryFilters = useMemo(() => {
    const ids = [...new Set(NEWS_ITEMS.map(n => n.category))];
    return ids.map(id => {
      const comp = ALL_COMPONENTS.find(c => c.id === id);
      return { id, label: comp ? `${comp.icon} ${comp.name}` : id };
    });
  }, []);

  const filtered = useMemo(() => {
    return NEWS_ITEMS.filter(n => {
      const catMatch  = activeFilter === 'all' || n.category === activeFilter;
      const typeMatch = activeType   === 'all' || n.type     === activeType;
      return catMatch && typeMatch;
    });
  }, [activeFilter, activeType]);

  return (
    <div>
      {/* Filters */}
      <div className="news-filters">
        <span className="filter-label">카테고리</span>
        <button
          className={`filter-btn${activeFilter === 'all' ? ' active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          전체 ({NEWS_ITEMS.length})
        </button>
        {categoryFilters.map(f => (
          <button
            key={f.id}
            className={`filter-btn${activeFilter === f.id ? ' active' : ''}`}
            onClick={() => setActiveFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="news-filters" style={{ marginTop: -10 }}>
        <span className="filter-label">유형</span>
        {['all', 'announcement', 'news', 'report'].map(t => (
          <button
            key={t}
            className={`filter-btn${activeType === t ? ' active' : ''}`}
            onClick={() => setActiveType(t)}
          >
            {t === 'all' ? '전체' : NEWS_TYPE_LABEL[t]?.label ?? t}
          </button>
        ))}
      </div>

      {/* News list */}
      {filtered.length === 0 ? (
        <p className="hint-text">해당 조건의 뉴스가 없습니다.</p>
      ) : (
        <div className="news-grid">
          {filtered.map(item => {
            const typeInfo = NEWS_TYPE_LABEL[item.type] ?? { label: item.type, color: '#666', bg: '#eee' };
            return (
              <div key={item.id} className="news-card">
                {/* Type badge */}
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
        뉴스 데이터 기준: 2026년 4월 · 웹 검색 수동 수집 —{' '}
        <span style={{ color: 'var(--accent-light)' }}>추후 NewsAPI / RSS 자동화 연동 예정</span>
      </p>
    </div>
  );
}
