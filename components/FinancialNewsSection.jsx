'use client';

import { useState, useMemo } from 'react';
import {
  FINANCIAL_NEWS_ITEMS,
  FINANCIAL_NEWS_TYPE_LABEL,
  FINANCIAL_CATEGORY_LABEL,
  countFinancialByCat,
} from '@/data/financial-news';

const ALL_CATS = Object.keys(FINANCIAL_CATEGORY_LABEL);

const GROUPS = [
  { id: 'all',     label: '전체',           cats: ALL_CATS },
  { id: 'banks',   label: '🏦 대형 은행',    cats: ['big_banks'] },
  { id: 'asset',   label: '💼 자산운용·증권', cats: ['asset_managers'] },
  { id: 'ins',     label: '🛡️ 보험',         cats: ['insurers'] },
  { id: 'pay',     label: '💳 결제',         cats: ['card_networks'] },
  { id: 'exch',    label: '📈 거래소·인프라', cats: ['exchanges_data'] },
];

export default function FinancialNewsSection() {
  const [activeGroup, setActiveGroup] = useState('all');
  const [activeCat,   setActiveCat]   = useState('all');
  const [activeType,  setActiveType]  = useState('all');
  const [sortOrder,   setSortOrder]   = useState('desc');

  function handleGroupClick(groupId) {
    setActiveGroup(groupId);
    setActiveCat('all');
  }

  const currentGroup = GROUPS.find(g => g.id === activeGroup);
  const catCount = useMemo(() => countFinancialByCat(FINANCIAL_NEWS_ITEMS), []);

  const catsWithNews = useMemo(() =>
    currentGroup.cats.filter(c => (catCount[c] ?? 0) > 0),
  [currentGroup, catCount]);

  const groupCount = useMemo(() => {
    const result = { all: FINANCIAL_NEWS_ITEMS.length };
    for (const g of GROUPS) {
      if (g.id !== 'all') {
        result[g.id] = FINANCIAL_NEWS_ITEMS.filter(n => g.cats.includes(n.category)).length;
      }
    }
    return result;
  }, []);

  const filtered = useMemo(() => {
    const result = FINANCIAL_NEWS_ITEMS.filter(n => {
      const groupMatch = activeGroup === 'all' || currentGroup.cats.includes(n.category);
      const catMatch   = activeCat === 'all' || n.category === activeCat;
      const typeMatch  = activeType === 'all' || n.type === activeType;
      return groupMatch && catMatch && typeMatch;
    });
    result.sort((a, b) =>
      sortOrder === 'desc' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)
    );
    return result;
  }, [activeGroup, activeCat, activeType, sortOrder, currentGroup]);

  return (
    <div>
      <div className="news-live-bar">
        <span className="news-total-count">
          총 {FINANCIAL_NEWS_ITEMS.length}개 뉴스·리포트
          &ensp;·&ensp;리포트 {FINANCIAL_NEWS_ITEMS.filter(n => n.type === 'report').length}개
          &ensp;·&ensp;뉴스 {FINANCIAL_NEWS_ITEMS.filter(n => n.type === 'news').length}개
        </span>
      </div>

      <div className="news-layer-tabs">
        {GROUPS.map(g => (
          <button key={g.id}
            className={`news-layer-tab${activeGroup === g.id ? ' active' : ''}`}
            onClick={() => handleGroupClick(g.id)}>
            {g.label}
            <span className="news-count-badge">{groupCount[g.id] ?? 0}</span>
          </button>
        ))}
      </div>

      <div className="news-comp-filters">
        <button className={`filter-btn${activeCat === 'all' ? ' active' : ''}`}
          onClick={() => setActiveCat('all')}>
          전체 ({groupCount[activeGroup] ?? FINANCIAL_NEWS_ITEMS.length})
        </button>
        {catsWithNews.map(catId => {
          const info = FINANCIAL_CATEGORY_LABEL[catId];
          if (!info) return null;
          return (
            <button key={catId}
              className={`filter-btn${activeCat === catId ? ' active' : ''}`}
              onClick={() => setActiveCat(catId)}>
              {info.icon} {info.name}
              <span className="news-comp-count">{catCount[catId] ?? 0}</span>
            </button>
          );
        })}
      </div>

      <div className="news-type-bar">
        <div className="news-type-filters">
          {['all', 'news', 'report'].map(t => (
            <button key={t}
              className={`news-type-btn${activeType === t ? ' active' : ''}`}
              onClick={() => setActiveType(t)}>
              {t === 'all' ? '전체' : FINANCIAL_NEWS_TYPE_LABEL[t]?.label}
            </button>
          ))}
        </div>
        <button className="news-sort-btn"
          onClick={() => setSortOrder(v => v === 'desc' ? 'asc' : 'desc')}>
          {sortOrder === 'desc' ? '↓ 최신순' : '↑ 오래된순'}
        </button>
      </div>

      <div className="news-result-summary"><span>{filtered.length}개 항목</span></div>

      {filtered.length === 0 ? (
        <p className="hint-text">해당 조건의 뉴스가 없습니다.</p>
      ) : (
        <div className="news-list">
          {filtered.map(item => {
            const catInfo  = FINANCIAL_CATEGORY_LABEL[item.category];
            const typeInfo = FINANCIAL_NEWS_TYPE_LABEL[item.type];
            return (
              <div key={item.id} className="news-card">
                <div className="news-card-header">
                  <span className="news-cat-badge">{catInfo?.icon} {catInfo?.name}</span>
                  <span className={`news-type-badge ${item.type}`}>
                    {typeInfo?.icon} {typeInfo?.label}
                  </span>
                  <span className="news-date">{item.date}</span>
                </div>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="news-title">
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
        금융 섹터 뉴스 {FINANCIAL_NEWS_ITEMS.length}개 · 2025~2026년 기준
      </p>
    </div>
  );
}
