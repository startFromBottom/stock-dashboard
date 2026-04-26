'use client';

import { useState, useMemo } from 'react';
import {
  DC_GLOSSARY_ITEMS,
  DC_GLOSSARY_CAT_LABEL,
  DC_GROUPS,
  countDcGlossaryByCat,
} from '@/data/dc-glossary';

/* ── 인라인 SVG 다이어그램 ── */
function DiagramSVG({ type }) {
  const svgs = {

    'hbm-stack': (
      <svg viewBox="0 0 320 200" className="glos-diagram-svg">
        <text x="160" y="16" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="bold">HBM 수직 적층 구조</text>
        {/* 베이스 다이 */}
        <rect x="80" y="158" width="160" height="22" rx="4" fill="#0c2340" stroke="#0ea5e9" strokeWidth="2"/>
        <text x="160" y="172" textAnchor="middle" fill="#38bdf8" fontSize="9">베이스 로직 다이</text>
        {/* D램 다이 적층 */}
        {[0,1,2,3].map(i => (
          <g key={i}>
            <rect x="80" y={68+i*22} width="160" height="20" rx="3" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5"/>
            <text x="160" y={80+i*22} textAnchor="middle" fill="#93c5fd" fontSize="8">
              D램 다이 #{4-i}
            </text>
            {/* TSV 핀 */}
            {[95,110,125,140,155,170,185,200,215,225].map(x => (
              <line key={x} x1={x} y1={88+i*22} x2={x} y2={90+i*22} stroke="#fbbf24" strokeWidth="1.5"/>
            ))}
          </g>
        ))}
        {/* 범프 */}
        {[95,110,125,140,155,170,185,200,215].map(x => (
          <ellipse key={x} cx={x} cy="156" rx="5" ry="4" fill="#fbbf24" opacity="0.9"/>
        ))}
        <text x="248" y="152" fill="#fcd34d" fontSize="7">마이크로 범프</text>
        {/* TSV 세로선 강조 */}
        {[110,140,180,210].map(x => (
          <line key={x} x1={x} y1="68" x2={x} y2="158" stroke="#fbbf24" strokeWidth="1" opacity="0.4" strokeDasharray="3,2"/>
        ))}
        <text x="60" y="108" fill="#fcd34d" fontSize="7" transform="rotate(-90,60,108)">TSV 관통배선</text>
        <text x="160" y="195" textAnchor="middle" fill="#64748b" fontSize="8">HBM3e: 2048bit 버스 · 최대 1.2TB/s · B200에는 192GB 탑재</text>
      </svg>
    ),
  };

  return svgs[type] ?? null;
}

/* ── 용어 카드 ── */
function GlossaryCard({ item, isOpen, onToggle }) {
  const catInfo = DC_GLOSSARY_CAT_LABEL[item.category];
  const hasDiagram = !!item.diagram;

  return (
    <div
      className={`glos-card${isOpen ? ' open' : ''}`}
      onClick={onToggle}
    >
      {/* 헤더 */}
      <div className="glos-card-header">
        <span className="glos-icon">{item.icon}</span>
        <div className="glos-term-wrap">
          <span className="glos-term">{item.term}</span>
          {item.abbr && <span className="glos-abbr">{item.abbr}</span>}
        </div>
        <span className="glos-cat-badge">
          {catInfo?.icon} {catInfo?.name}
        </span>
        {hasDiagram && <span className="glos-diagram-badge">📊 그림</span>}
        <span className="glos-chevron">{isOpen ? '▲' : '▼'}</span>
      </div>

      {/* 한 줄 요약 */}
      <p className="glos-short">{item.short}</p>

      {/* 펼쳤을 때 상세 + 다이어그램 */}
      {isOpen && (
        <div className="glos-body">
          <p className="glos-detail">{item.body}</p>
          {hasDiagram && (
            <div className="glos-diagram-wrap">
              <DiagramSVG type={item.diagram} />
            </div>
          )}
          {item.relatedTickers?.length > 0 && (
            <div className="glos-tickers">
              <span className="glos-tickers-label">관련 기업</span>
              {item.relatedTickers.map(t => (
                <span key={t} className="news-ticker-badge">{t}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── 메인 컴포넌트 ── */
export default function DcGlossary() {
  const [activeGroup, setActiveGroup] = useState('all');
  const [activeCat,   setActiveCat]   = useState('all');
  const [openId,      setOpenId]      = useState(null);
  const [search,      setSearch]      = useState('');

  const catCount = useMemo(() => countDcGlossaryByCat(DC_GLOSSARY_ITEMS), []);

  // 현재 그룹에서 보여줄 카테고리 목록
  const visibleCats = useMemo(() => {
    const group = DC_GROUPS.find(g => g.id === activeGroup);
    if (!group || !group.cats) return Object.keys(DC_GLOSSARY_CAT_LABEL);
    return group.cats;
  }, [activeGroup]);

  const catsWithItems = useMemo(() =>
    visibleCats.filter(c => (catCount[c] ?? 0) > 0),
  [visibleCats, catCount]);

  // 그룹별 총 용어 수
  const groupCount = useMemo(() => {
    const result = { all: DC_GLOSSARY_ITEMS.length };
    for (const g of DC_GROUPS) {
      if (g.cats) {
        result[g.id] = DC_GLOSSARY_ITEMS.filter(i => g.cats.includes(i.category)).length;
      }
    }
    return result;
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const group = DC_GROUPS.find(g => g.id === activeGroup);
    return DC_GLOSSARY_ITEMS.filter(item => {
      const groupOk = !group?.cats || group.cats.includes(item.category);
      const catOk   = activeCat === 'all' || item.category === activeCat;
      const searchOk = !q || [item.term, item.abbr, item.short, item.body].some(
        t => t?.toLowerCase().includes(q)
      );
      return groupOk && catOk && searchOk;
    });
  }, [activeGroup, activeCat, search]);

  function handleGroupClick(g) {
    setActiveGroup(g);
    setActiveCat('all');
    setOpenId(null);
  }

  return (
    <div>
      {/* 상단 바 */}
      <div className="news-live-bar">
        <span className="news-total-count">
          총 {DC_GLOSSARY_ITEMS.length}개 핵심 용어 · 그림 포함 {DC_GLOSSARY_ITEMS.filter(i => i.diagram).length}개
        </span>
      </div>

      {/* 검색 */}
      <div className="glos-search-wrap">
        <input
          className="glos-search"
          type="text"
          placeholder="🔍  용어·약어·설명 검색..."
          value={search}
          onChange={e => { setSearch(e.target.value); setOpenId(null); }}
        />
        {search && (
          <button className="glos-search-clear" onClick={() => setSearch('')}>✕</button>
        )}
      </div>

      {/* 그룹 탭 */}
      <div className="news-layer-tabs">
        {DC_GROUPS.map(g => (
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
          onClick={() => { setActiveCat('all'); setOpenId(null); }}
        >
          전체 ({groupCount[activeGroup] ?? DC_GLOSSARY_ITEMS.length})
        </button>
        {catsWithItems.map(catId => {
          const info = DC_GLOSSARY_CAT_LABEL[catId];
          if (!info) return null;
          return (
            <button
              key={catId}
              className={`filter-btn${activeCat === catId ? ' active' : ''}`}
              onClick={() => { setActiveCat(catId); setOpenId(null); }}
            >
              {info.icon} {info.name}
              <span className="news-comp-count">{catCount[catId] ?? 0}</span>
            </button>
          );
        })}
      </div>

      {/* 결과 수 */}
      <div className="news-result-summary">
        <span>{filtered.length}개 용어</span>
        {filtered.filter(i => i.diagram).length > 0 && (
          <span style={{ color: '#94a3b8', fontSize: 12 }}>
            📊 그림 {filtered.filter(i => i.diagram).length}개 포함
          </span>
        )}
      </div>

      {/* 용어 카드 목록 */}
      {filtered.length === 0 ? (
        <p className="hint-text">해당 조건의 용어가 없습니다.</p>
      ) : (
        <div className="glos-list">
          {filtered.map(item => (
            <GlossaryCard
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={() => setOpenId(openId === item.id ? null : item.id)}
            />
          ))}
        </div>
      )}

      <p className="hint-text" style={{ marginTop: 24 }}>
        AI 데이터센터 인프라 핵심 용어 {DC_GLOSSARY_ITEMS.length}개 · 2025~2026 기준 · 클릭하면 상세 설명 확인
      </p>
    </div>
  );
}
