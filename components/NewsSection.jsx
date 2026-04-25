'use client';

import { useState, useMemo } from 'react';
import { NEWS_TYPE_LABEL } from '@/data/news';
import { LAYERS, ALL_COMPONENTS } from '@/data/companies';
import useNews from '@/hooks/useNews';

// 레이어별 구성요소 id 목록 (탭 구조 생성용)
const LAYER_TABS = LAYERS.map(layer => ({
  id: layer.id,
  label: layer.layer,
  componentIds: layer.components.map(c => c.id),
}));

export default function NewsSection() {
  const { items: NEWS_ITEMS, loading, error, liveCount, fresh } = useNews();

  const [activeLayer, setActiveLayer]   = useState('all'); // 'all' | layer.id
  const [activeComp,  setActiveComp]    = useState('all'); // 'all' | comp.id
  const [activeType,  setActiveType]    = useState('all'); // 'all' | type
  const [sortOrder,   setSortOrder]     = useState('desc'); // 'desc' | 'asc'

  // 레이어 변경 시 구성요소 필터 초기화
  function handleLayerClick(layerId) {
    setActiveLayer(layerId);
    setActiveComp('all');
  }

  // 현재 레이어에서 보여줄 구성요소 목록
  const visibleComps = useMemo(() => {
    if (activeLayer === 'all') return ALL_COMPONENTS;
    const layer = LAYERS.find(l => l.id === activeLayer);
    return layer ? layer.components : [];
  }, [activeLayer]);

  // 현재 카테고리 필터에서 뉴스가 1개 이상인 comp만 표시
  const compsWithNews = useMemo(() => {
    return visibleComps.filter(c =>
      NEWS_ITEMS.some(n => n.category === c.id)
    );
  }, [visibleComps]);

  // 필터링 + 정렬된 뉴스
  const filtered = useMemo(() => {
    const layerCompIds = activeLayer === 'all'
      ? null
      : LAYERS.find(l => l.id === activeLayer)?.components.map(c => c.id);

    const result = NEWS_ITEMS.filter(n => {
      const layerMatch = !layerCompIds || layerCompIds.includes(n.category);
      const compMatch  = activeComp === 'all' || n.category === activeComp;
      const typeMatch  = activeType === 'all' || n.type === activeType;
      return layerMatch && compMatch && typeMatch;
    });

    // 정렬 적용 (date 문자열은 YYYY-MM-DD 포맷이라 문자열 비교로 충분)
    result.sort((a, b) =>
      sortOrder === 'desc'
        ? b.date.localeCompare(a.date)
        : a.date.localeCompare(b.date)
    );

    return result;
  }, [activeLayer, activeComp, activeType, sortOrder]);

  // 레이어별 뉴스 수 (뱃지용)
  const countByLayer = useMemo(() => {
    const map = {};
    for (const layer of LAYERS) {
      const ids = layer.components.map(c => c.id);
      map[layer.id] = NEWS_ITEMS.filter(n => ids.includes(n.category)).length;
    }
    return map;
  }, []);

  // 구성요소별 뉴스 수 (뱃지용)
  const countByComp = useMemo(() => {
    const map = {};
    for (const c of ALL_COMPONENTS) {
      map[c.id] = NEWS_ITEMS.filter(n => n.category === c.id).length;
    }
    return map;
  }, []);

  return (
    <div>
      {/* ── 라이브 상태 배지 ── */}
      <div className="news-live-bar">
        {loading && (
          <span className="live-badge loading-badge">⟳ 최신 뉴스 수집 중…</span>
        )}
        {fresh && (
          <span className="live-badge">
            ● LIVE — Finnhub + RSS {liveCount}개 수집
          </span>
        )}
        {error && (
          <span className="live-badge error-badge" title={error}>
            ⚠ API 오류 · 정적 데이터 표시 중
          </span>
        )}
        <span className="news-total-count">총 {NEWS_ITEMS.length}개</span>
      </div>

      {/* ── 레이어 탭 ── */}
      <div className="news-layer-tabs">
        <button
          className={`news-layer-tab${activeLayer === 'all' ? ' active' : ''}`}
          onClick={() => handleLayerClick('all')}
        >
          전체
          <span className="news-count-badge">{NEWS_ITEMS.length}</span>
        </button>
        {LAYER_TABS.map(lt => {
          const cnt = countByLayer[lt.id] ?? 0;
          if (cnt === 0) return null;
          return (
            <button
              key={lt.id}
              className={`news-layer-tab${activeLayer === lt.id ? ' active' : ''}`}
              onClick={() => handleLayerClick(lt.id)}
            >
              {lt.label.replace(/ 레이어$/, '')}
              <span className="news-count-badge">{cnt}</span>
            </button>
          );
        })}
      </div>

      {/* ── 구성요소 필터 (선택된 레이어의 comp) ── */}
      {compsWithNews.length > 0 && (
        <div className="news-comp-filters">
          <button
            className={`filter-btn${activeComp === 'all' ? ' active' : ''}`}
            onClick={() => setActiveComp('all')}
          >
            전체 ({activeLayer === 'all' ? NEWS_ITEMS.length : (countByLayer[activeLayer] ?? 0)})
          </button>
          {compsWithNews.map(c => (
            <button
              key={c.id}
              className={`filter-btn${activeComp === c.id ? ' active' : ''}`}
              onClick={() => setActiveComp(c.id)}
            >
              {c.icon} {c.name}
              <span className="news-comp-count">{countByComp[c.id] ?? 0}</span>
            </button>
          ))}
        </div>
      )}

      {/* ── 유형 필터 ── */}
      <div className="news-type-filters">
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

      {/* ── 결과 요약 + 정렬 ── */}
      <div className="news-result-summary">
        <span>
          {filtered.length}개 항목
          {activeLayer !== 'all' && (
            <span className="news-breadcrumb">
              {' '}· {LAYER_TABS.find(l => l.id === activeLayer)?.label.replace(/ 레이어$/, '')}
              {activeComp !== 'all' && (
                <> › {ALL_COMPONENTS.find(c => c.id === activeComp)?.icon} {ALL_COMPONENTS.find(c => c.id === activeComp)?.name}</>
              )}
            </span>
          )}
        </span>
        <button
          className={`sort-btn${sortOrder === 'desc' ? ' active' : ''}`}
          onClick={() => setSortOrder(o => o === 'desc' ? 'asc' : 'desc')}
          title={sortOrder === 'desc' ? '최신순 정렬 중 (클릭 시 오래된순)' : '오래된순 정렬 중 (클릭 시 최신순)'}
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
            const typeInfo = NEWS_TYPE_LABEL[item.type] ?? { label: item.type, color: '#818cf8', bg: '#1e1b4b' };
            const compInfo = ALL_COMPONENTS.find(c => c.id === item.category);
            return (
              <div key={item.id} className="news-card">
                {/* 유형 뱃지 */}
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
                    {/* 구성요소 레이블 (전체 탭에서만 표시) */}
                    {compInfo && (
                      <span className="news-comp-badge">
                        {compInfo.icon} {compInfo.name}
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
        {fresh
          ? <>라이브 뉴스: Finnhub company-news + RSS 피드 자동 수집 (1시간 캐시) · 정적 큐레이션 {NEWS_ITEMS.filter(n => !n._live).length}개 포함</>
          : <>뉴스 데이터: 정적 큐레이션 표시 중 · 백그라운드에서 최신 뉴스 수집 중</>
        }
      </p>
    </div>
  );
}
