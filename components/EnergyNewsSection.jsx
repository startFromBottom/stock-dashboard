'use client';

import { useState, useMemo } from 'react';
import {
  ENERGY_NEWS_ITEMS,
  ENERGY_NEWS_TYPE_LABEL,
  ENERGY_CATEGORY_LABEL,
  countByCat,
} from '@/data/energy-news';

const NUCLEAR_CATS  = ['nuclear', 'smr'];
const RENEW_CATS    = ['solar', 'wind', 'hydro'];
const NEW_ENERGY    = ['fuel_cell', 'geothermal', 'biomass'];
const INFRA_CATS    = ['grid'];
const POLICY_CATS   = ['policy'];

const ALL_CATS = [...NUCLEAR_CATS, ...RENEW_CATS, ...NEW_ENERGY, ...INFRA_CATS, ...POLICY_CATS];

const GROUPS = [
  { id: 'all',      label: '전체',              cats: ALL_CATS },
  { id: 'nuclear',  label: '⚛️ 원자력·SMR',    cats: NUCLEAR_CATS },
  { id: 'renew',    label: '🌱 재생에너지',     cats: RENEW_CATS },
  { id: 'new',      label: '⚡ 수소·지열·바이오', cats: NEW_ENERGY },
  { id: 'grid',     label: '🔌 전력망·ESS',     cats: INFRA_CATS },
  { id: 'policy',   label: '📋 정책·규제',      cats: POLICY_CATS },
];

export default function EnergyNewsSection() {
  const [activeGroup, setActiveGroup] = useState('all');
  const [activeCat,   setActiveCat]   = useState('all');
  const [activeType,  setActiveType]  = useState('all');
  const [sortOrder,   setSortOrder]   = useState('desc');

  function handleGroupClick(groupId) {
    setActiveGroup(groupId);
    setActiveCat('all');
  }

  const currentGroup = GROUPS.find(g => g.id === activeGroup);
  const catCount = useMemo(() => countByCat(ENERGY_NEWS_ITEMS), []);

  const catsWithNews = useMemo(() =>
    currentGroup.cats.filter(c => (catCount[c] ?? 0) > 0),
  [currentGroup, catCount]);

  const filtered = useMemo(() => {
    const result = ENERGY_NEWS_ITEMS.filter(n => {
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

  const groupCount = useMemo(() =>
    Object.fromEntries(
      GROUPS.map(g => [
        g.id,
        g.id === 'all'
          ? ENERGY_NEWS_ITEMS.length
          : ENERGY_NEWS_ITEMS.filter(n => g.cats.includes(n.category)).length,
      ])
    ),
  []);

  const groupCatTotal = activeGroup === 'all'
    ? ENERGY_NEWS_ITEMS.length
    : groupCount[activeGroup];

  return (
    <div>
      {/* ── 상단 정보 바 ── */}
      <div className="news-live-bar">
        <span className="news-total-count">총 {ENERGY_NEWS_ITEMS.length}개 큐레이션 뉴스 & 레포트</span>
      </div>

      {/* ── 그룹 탭 ── */}
      <div className="news-layer-tabs">
        {GROUPS.map(g => (
          <button
            key={g.id}
            className={`news-layer-tab${activeGroup === g.id ? ' active' : ''}`}
            onClick={() => handleGroupClick(g.id)}
          >
            {g.label}
            <span className="news-count-badge">{groupCount[g.id]}</span>
          </button>
        ))}
      </div>

      {/* ── 카테고리 필터 ── */}
      <div className="news-comp-filters">
        <button
          className={`filter-btn${activeCat === 'all' ? ' active' : ''}`}
          onClick={() => setActiveCat('all')}
        >
          전체 ({groupCatTotal})
        </button>
        {catsWithNews.map(catId => {
          const info = ENERGY_CATEGORY_LABEL[catId];
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
            {t === 'all' ? '전체' : ENERGY_NEWS_TYPE_LABEL[t]?.label ?? t}
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
            const typeInfo = ENERGY_NEWS_TYPE_LABEL[item.type] ?? { label: item.type, color: '#818cf8', bg: '#1e1b4b' };
            const catInfo  = ENERGY_CATEGORY_LABEL[item.category];
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
        에너지 섹터 뉴스 데이터: 큐레이션 {ENERGY_NEWS_ITEMS.length}개 · 2025~2026년 기준
      </p>
    </div>
  );
}
