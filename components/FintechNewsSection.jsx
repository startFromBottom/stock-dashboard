'use client';

import { useState, useMemo } from 'react';
import {
  FINTECH_NEWS_ITEMS,
  FINTECH_NEWS_TYPE_LABEL,
  FINTECH_CATEGORY_LABEL,
} from '@/data/fintech-news';

const ALL_CATS = ['network', 'processor', 'neobank', 'lending', 'brokerage', 'market_infra', 'crypto_exchange', 'financial_data', 'ai_fintech'];

function countByCat(items) {
  const map = {};
  items.forEach(n => { map[n.category] = (map[n.category] ?? 0) + 1; });
  return map;
}

export default function FintechNewsSection() {
  const [activeCat,  setActiveCat]  = useState('all');
  const [activeType, setActiveType] = useState('all');
  const [sortOrder,  setSortOrder]  = useState('desc');

  const catCount = useMemo(() => countByCat(FINTECH_NEWS_ITEMS), []);

  const catsWithNews = useMemo(() =>
    ALL_CATS.filter(c => (catCount[c] ?? 0) > 0),
  [catCount]);

  const filtered = useMemo(() => {
    const result = FINTECH_NEWS_ITEMS.filter(n => {
      const catMatch  = activeCat === 'all' || n.category === activeCat;
      const typeMatch = activeType === 'all' || n.type === activeType;
      return catMatch && typeMatch;
    });
    result.sort((a, b) =>
      sortOrder === 'desc'
        ? b.date.localeCompare(a.date)
        : a.date.localeCompare(b.date)
    );
    return result;
  }, [activeCat, activeType, sortOrder]);

  return (
    <div>
      {/* ── 상단 정보 바 ── */}
      <div className="news-live-bar">
        <span className="news-total-count">총 {FINTECH_NEWS_ITEMS.length}개 큐레이션 뉴스 & 레포트</span>
      </div>

      {/* ── 카테고리 필터 ── */}
      <div className="news-comp-filters">
        <button
          className={`filter-btn${activeCat === 'all' ? ' active' : ''}`}
          onClick={() => setActiveCat('all')}
        >
          전체 ({FINTECH_NEWS_ITEMS.length})
        </button>
        {catsWithNews.map(catId => {
          const info = FINTECH_CATEGORY_LABEL[catId];
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
            {t === 'all' ? '전체' : FINTECH_NEWS_TYPE_LABEL[t]?.label ?? t}
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
            const typeInfo = FINTECH_NEWS_TYPE_LABEL[item.type] ?? { label: item.type, color: '#818cf8', bg: '#1e1b4b' };
            const catInfo  = FINTECH_CATEGORY_LABEL[item.category];
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
        핀테크/금융 인프라 뉴스 데이터: 큐레이션 {FINTECH_NEWS_ITEMS.length}개 · 2025~2026년 기준
      </p>
    </div>
  );
}
