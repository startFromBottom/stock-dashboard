'use client';

import { useState, useMemo } from 'react';
import {
  RAW_NEWS_ITEMS,
  RAW_NEWS_TYPE_LABEL,
  RAW_CATEGORY_LABEL,
  countByCat,
} from '@/data/rawNews';
import useRawNews from '@/hooks/useRawNews';

// 그룹 레벨 카테고리 (탭으로 사용)
const GROUP_CATS  = ['rare-earth', 'precious', 'battery', 'industrial', 'tech', 'energy'];
// 소재 레벨 카테고리 (필터 칩으로 사용)
const MATERIAL_CATS = [
  'neodymium', 'dysprosium', 'terbium',
  'gold', 'silver',
  'lithium', 'cobalt', 'nickel',
  'copper', 'iron',
  'gallium', 'germanium',
  'oil', 'naturalgas', 'coal',
];

// 그룹 → 속하는 소재 카테고리 매핑
const GROUP_MATERIAL_MAP = {
  'rare-earth': ['neodymium', 'dysprosium', 'terbium'],
  'precious':   ['gold', 'silver'],
  'battery':    ['lithium', 'cobalt', 'nickel'],
  'industrial': ['copper', 'iron'],
  'tech':       ['gallium', 'germanium'],
  'energy':     ['oil', 'naturalgas', 'coal'],
};

export default function RawNewsSection() {
  const { items, loading, error, liveCount, fresh } = useRawNews();

  const [activeGroup, setActiveGroup] = useState('all');
  const [activeCat,   setActiveCat]   = useState('all');
  const [activeType,  setActiveType]  = useState('all');
  const [sortOrder,   setSortOrder]   = useState('desc');

  function handleGroupClick(groupId) {
    setActiveGroup(groupId);
    setActiveCat('all');
  }

  // 현재 그룹에서 표시할 소재 카테고리 목록
  const visibleMaterialCats = useMemo(() => {
    if (activeGroup === 'all') return MATERIAL_CATS;
    return GROUP_MATERIAL_MAP[activeGroup] ?? [];
  }, [activeGroup]);

  // 전체 카운트 맵
  const catCount = useMemo(() => countByCat(items), [items]);

  // 현재 그룹에서 뉴스가 있는 소재 카테고리
  const matsWithNews = useMemo(() =>
    visibleMaterialCats.filter(c => (catCount[c] ?? 0) > 0),
  [visibleMaterialCats, catCount]);

  // 그룹별 카운트
  const groupCount = useMemo(() => {
    const counts = { all: items.length };
    for (const gid of GROUP_CATS) {
      // 그룹 id 자체 + 그룹 소속 소재 id를 모두 합산
      const relatedCats = new Set([gid, ...(GROUP_MATERIAL_MAP[gid] ?? [])]);
      counts[gid] = items.filter(n => relatedCats.has(n.category)).length;
    }
    return counts;
  }, [items]);

  // 필터링 + 정렬
  const filtered = useMemo(() => {
    const result = items.filter(n => {
      let groupMatch = true;
      if (activeGroup !== 'all') {
        const relatedCats = new Set([activeGroup, ...(GROUP_MATERIAL_MAP[activeGroup] ?? [])]);
        groupMatch = relatedCats.has(n.category);
      }
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
  }, [items, activeGroup, activeCat, activeType, sortOrder]);

  return (
    <div>
      {/* ── 상단 정보 바 ── */}
      <div className="news-live-bar">
        <span className="news-total-count">
          총 {items.length}개 뉴스 & 리포트
        </span>
        {loading && (
          <span className="news-live-badge" style={{ background: '#1c2d40', color: '#38bdf8' }}>
            ⟳ 최신 뉴스 수집 중…
          </span>
        )}
        {fresh && liveCount > 0 && (
          <span className="news-live-badge">
            ● 라이브 {liveCount}건 반영
          </span>
        )}
        {error && (
          <span className="news-live-badge" style={{ background: '#2d1010', color: '#f87171' }}>
            ⚠ 라이브 수집 실패 (큐레이션 데이터 표시 중)
          </span>
        )}
      </div>

      {/* ── 그룹 탭 ── */}
      <div className="news-layer-tabs">
        <button
          className={`news-layer-tab${activeGroup === 'all' ? ' active' : ''}`}
          onClick={() => handleGroupClick('all')}
        >
          전체
          <span className="news-count-badge">{groupCount.all}</span>
        </button>
        {GROUP_CATS.map(gid => {
          const info = RAW_CATEGORY_LABEL[gid];
          if (!info) return null;
          return (
            <button
              key={gid}
              className={`news-layer-tab${activeGroup === gid ? ' active' : ''}`}
              onClick={() => handleGroupClick(gid)}
            >
              {info.icon} {info.name}
              <span className="news-count-badge">{groupCount[gid] ?? 0}</span>
            </button>
          );
        })}
      </div>

      {/* ── 소재 카테고리 필터 칩 ── */}
      {matsWithNews.length > 0 && (
        <div className="news-comp-filters">
          <button
            className={`filter-btn${activeCat === 'all' ? ' active' : ''}`}
            onClick={() => setActiveCat('all')}
          >
            전체 ({activeGroup === 'all' ? groupCount.all : (groupCount[activeGroup] ?? 0)})
          </button>
          {matsWithNews.map(catId => {
            const info = RAW_CATEGORY_LABEL[catId];
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
      )}

      {/* ── 유형 필터 ── */}
      <div className="news-type-filters">
        <span className="filter-label">유형</span>
        {['all', 'news', 'report', 'announcement', 'regulation', 'market'].map(t => (
          <button
            key={t}
            className={`filter-btn${activeType === t ? ' active' : ''}`}
            onClick={() => setActiveType(t)}
          >
            {t === 'all' ? '전체' : RAW_NEWS_TYPE_LABEL[t]?.label ?? t}
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
            const typeInfo = RAW_NEWS_TYPE_LABEL[item.type] ?? { label: item.type, color: '#818cf8', bg: '#1e1b4b' };
            const catInfo  = RAW_CATEGORY_LABEL[item.category];
            return (
              <div key={item.id} className={`news-card${item._live ? ' news-card-live' : ''}`}>
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
                    {(item.tickers ?? []).map(t => (
                      <span key={t} className="news-ticker-badge">{t}</span>
                    ))}
                    {catInfo && (
                      <span className="news-comp-badge">
                        {catInfo.icon} {catInfo.name}
                      </span>
                    )}
                    <span className="news-meta">{item.date}</span>
                    <span className="news-source">출처: {item.source}</span>
                    {item.url && item.url !== '#' && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="news-link"
                      >
                        원문 →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="hint-text" style={{ marginTop: 24 }}>
        원자재·에너지 뉴스 데이터: 큐레이션 {RAW_NEWS_ITEMS.length}개 · 2024~2026년 기준
      </p>
    </div>
  );
}
