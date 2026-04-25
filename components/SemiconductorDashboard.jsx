'use client';

import { useState, useMemo } from 'react';
import { SEMI_CHAIN, SEMI_FLAGS } from '@/data/semiconductor';
import { FLAG_BY_NAME } from '@/data/companies';
import useMarketCaps from '@/hooks/useMarketCaps';
import { extractPublicTickers, normalizeTicker, formatMktcap } from '@/lib/ticker-utils';

/* ─────────────────────────────────────────────
   밸류체인 SVG 다이어그램 (좌→우 플로우)
───────────────────────────────────────────── */
const CHAIN_W = 900;
const CHAIN_H = 220;
const STEP_W  = 96;
const STEP_H  = 80;
const ARROW_W = 14;
const START_X = 10;
const MID_Y   = CHAIN_H / 2;

function ChainDiagram({ activeId, onSelect }) {
  const count  = SEMI_CHAIN.length;
  const totalW = count * STEP_W + (count - 1) * ARROW_W + START_X * 2;

  return (
    <div className="semi-chain-wrap">
      <svg
        viewBox={`0 0 ${totalW} ${CHAIN_H}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', width: '100%', borderRadius: 12, background: '#080f1f' }}
      >
        <defs>
          <pattern id="sgrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.4" />
          </pattern>
          <filter id="sglow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#334155" />
          </marker>
          <marker id="arrow-active" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#818cf8" />
          </marker>
        </defs>

        <rect width={totalW} height={CHAIN_H} fill="url(#sgrid)" />

        {/* 연결 화살표 */}
        {SEMI_CHAIN.map((step, i) => {
          if (i === count - 1) return null;
          const x1 = START_X + i * (STEP_W + ARROW_W) + STEP_W;
          const x2 = x1 + ARROW_W;
          const isActive = activeId === step.id || activeId === SEMI_CHAIN[i + 1].id;
          return (
            <line
              key={`arrow-${i}`}
              x1={x1} y1={MID_Y}
              x2={x2} y2={MID_Y}
              stroke={isActive ? '#6366f1' : '#334155'}
              strokeWidth={isActive ? 2 : 1.5}
              markerEnd={isActive ? 'url(#arrow-active)' : 'url(#arrow)'}
              style={{ transition: 'stroke 0.18s' }}
            />
          );
        })}

        {/* 단계 박스 */}
        {SEMI_CHAIN.map((step, i) => {
          const x      = START_X + i * (STEP_W + ARROW_W);
          const y      = MID_Y - STEP_H / 2;
          const isActive = activeId === step.id;
          const c      = step.color;

          return (
            <g key={step.id} onClick={() => onSelect(step.id)} style={{ cursor: 'pointer' }}>
              {/* 배경 박스 */}
              <rect
                x={x} y={y}
                width={STEP_W} height={STEP_H}
                rx={8}
                fill={isActive ? c.bgA : c.bg}
                stroke={isActive ? c.bdA : c.bd}
                strokeWidth={isActive ? 2 : 1.2}
                style={{ transition: 'all 0.18s' }}
              />
              {/* 글로우 */}
              {isActive && (
                <rect
                  x={x} y={y}
                  width={STEP_W} height={STEP_H}
                  rx={8}
                  fill="none"
                  stroke={c.bdA}
                  strokeWidth={3}
                  opacity={0.4}
                  filter="url(#sglow)"
                />
              )}
              {/* 아이콘 */}
              <text
                x={x + STEP_W / 2} y={y + 24}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={22}
                style={{ pointerEvents: 'none' }}
              >
                {step.icon}
              </text>
              {/* 단계 번호 */}
              <text
                x={x + 6} y={y + 10}
                fontSize={8} fontWeight="700"
                fill={isActive ? c.txA : c.tx}
                style={{ pointerEvents: 'none' }}
                opacity={0.8}
              >
                {step.step}
              </text>
              {/* 이름 (2줄) */}
              <text
                x={x + STEP_W / 2} y={y + STEP_H - 22}
                textAnchor="middle"
                fontSize={9.5} fontWeight="700"
                fill={isActive ? c.txA : c.tx}
                style={{ pointerEvents: 'none', transition: 'fill 0.18s' }}
              >
                {step.shortName.length > 5 ? step.shortName.slice(0, 5) : step.shortName}
              </text>
              <text
                x={x + STEP_W / 2} y={y + STEP_H - 10}
                textAnchor="middle"
                fontSize={8}
                fill={isActive ? c.txA : c.tx}
                style={{ pointerEvents: 'none', transition: 'fill 0.18s' }}
                opacity={0.75}
              >
                {step.shortName.length > 5 ? step.shortName.slice(5) : ''}
              </text>
            </g>
          );
        })}

        {/* 하단 레이블 */}
        <text x={totalW / 2} y={CHAIN_H - 8}
          textAnchor="middle" fontSize={9} fill="#334155" fontWeight="600" letterSpacing="1.5"
          style={{ pointerEvents: 'none' }}>
          SEMICONDUCTOR VALUE CHAIN  —  SILICON TO MARKET
        </text>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   단계별 상세 패널 (기업 Top 10)
───────────────────────────────────────────── */
const RANK_LABELS = ['🥇 1위', '🥈 2위', '🥉 3위', '4위', '5위', '6위', '7위', '8위', '9위', '10위'];

function SemiCompanyPanel({ step }) {
  const [showMore, setShowMore] = useState(false);
  const pool = step.candidates ?? [];

  const tickers = useMemo(() => {
    return pool
      .map(c => c.ticker)
      .filter(t => t && t !== 'Private' && !t.startsWith('비상장') && !t.includes('지주사') && !t.includes('중복'));
  }, [step.id]); // eslint-disable-line

  const { mktcaps, loading, error, fresh } = useMarketCaps(tickers);

  const sortedPool = useMemo(() => {
    const withLive = pool.map(c => {
      const norm = normalizeTicker(c.ticker);
      const liveCap = norm ? mktcaps[norm] : undefined;
      return { ...c, liveCap };
    });
    if (Object.keys(mktcaps).length === 0) return withLive;
    return [...withLive].sort((a, b) => {
      if (a.liveCap && b.liveCap) return b.liveCap - a.liveCap;
      if (a.liveCap) return -1;
      if (b.liveCap) return 1;
      return a.rank - b.rank;
    });
  }, [pool, mktcaps]); // eslint-disable-line

  const validPool = sortedPool.filter(c =>
    c.name && c.detail && c.ticker !== 'Private' || c.mktcap !== '중복'
  ).filter(c => c.detail && c.detail !== '참고용 — Synopsys로 통합');

  const top10 = validPool.slice(0, 10);
  const rest  = validPool.slice(10);

  const now = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  const c   = step.color;

  const getFlag = (name) => SEMI_FLAGS[name] ?? FLAG_BY_NAME?.[name] ?? '🌐';

  return (
    <div className="company-panel" style={{ borderColor: c.bd, marginTop: 24 }}>
      {/* 패널 헤더 */}
      <div className="panel-header" style={{ borderBottomColor: c.bd }}>
        <div className="panel-icon">{step.icon}</div>
        <div style={{ flex: 1 }}>
          <div className="panel-title">
            {step.step}단계: {step.name}
            <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-secondary)', marginLeft: 8 }}>
              — {step.desc}
            </span>
          </div>
          <div className="panel-subtitle">
            시가총액 Top 10 기업
            {fresh && <span className="live-badge">● LIVE</span>}
            {loading && <span className="live-badge loading-badge">⟳ 로딩 중…</span>}
            {error && <span className="live-badge error-badge" title={error}>⚠ 하드코딩 데이터</span>}
            {!fresh && !loading && !error && <span style={{ marginLeft: 6 }}>· 정적 데이터</span>}
          </div>
        </div>
        {fresh && <div className="panel-refresh-note">{now} 기준 실시간</div>}
      </div>

      {/* 단계 설명 */}
      <div style={{
        padding: '10px 16px',
        fontSize: 12,
        color: 'var(--text-secondary)',
        background: 'rgba(255,255,255,0.02)',
        borderBottom: '1px solid var(--border)',
        lineHeight: 1.7,
      }}>
        {step.detail}
      </div>

      {/* Top 10 그리드 */}
      <div className="companies-grid">
        {top10.map((comp, idx) => {
          const flag      = getFlag(comp.name);
          const liveMktcap = comp.liveCap ? formatMktcap(comp.liveCap) : null;
          const displayRank = idx + 1;

          return (
            <div key={`${comp.name}-${idx}`} className="company-card">
              <span className={`rank-badge rank-${displayRank}`}>
                {RANK_LABELS[displayRank - 1]}
                {fresh && displayRank !== comp.rank && (
                  <span className={`rank-change ${displayRank < comp.rank ? 'rank-up' : 'rank-down'}`}>
                    {displayRank < comp.rank ? ` ▲${comp.rank - displayRank}` : ` ▼${displayRank - comp.rank}`}
                  </span>
                )}
              </span>
              <div className="company-name">
                <span className="company-flag">{flag}</span>
                {comp.name}
              </div>
              <div className="company-ticker">{comp.ticker}</div>
              <div className="company-mktcap">
                {liveMktcap ? (
                  <>
                    {liveMktcap}
                    <span className="mktcap-live-dot" title="실시간 데이터">●</span>
                  </>
                ) : (
                  comp.mktcap
                )}
              </div>
              <div className="company-detail">{comp.detail}</div>
              <div className="company-links">
                {comp.ir  && <a href={comp.ir}   target="_blank" rel="noopener noreferrer" className="link-btn">📊 IR</a>}
                {comp.news && <a href={comp.news} target="_blank" rel="noopener noreferrer" className="link-btn">📰 뉴스</a>}
                {comp.x   && <a href={comp.x}    target="_blank" rel="noopener noreferrer" className="link-btn">𝕏 X</a>}
              </div>
            </div>
          );
        })}
      </div>

      {/* 더보기 */}
      {rest.length > 0 && (
        <div className="more-section">
          <button className="more-toggle-btn" onClick={() => setShowMore(v => !v)}>
            {showMore ? `▲ 접기` : `▼ 후보풀 더보기 (${rest.length}개)`}
          </button>
          {showMore && (
            <div className="more-grid">
              {rest.map((comp, idx) => {
                const flag = getFlag(comp.name);
                const liveMktcap = comp.liveCap ? formatMktcap(comp.liveCap) : null;
                return (
                  <div key={`more-${comp.name}-${idx}`} className="company-card more-card">
                    <span className="rank-badge rank-more">{idx + 11}위</span>
                    <div className="company-name">
                      <span className="company-flag">{flag}</span>
                      {comp.name}
                    </div>
                    <div className="company-ticker">{comp.ticker}</div>
                    <div className="company-mktcap" style={{ color: 'var(--text-muted)' }}>
                      {liveMktcap ? <>{liveMktcap}<span className="mktcap-live-dot">●</span></> : comp.mktcap}
                    </div>
                    <div className="company-detail">{comp.detail}</div>
                    <div className="company-links">
                      {comp.ir   && <a href={comp.ir}   target="_blank" rel="noopener noreferrer" className="link-btn">📊 IR</a>}
                      {comp.news && <a href={comp.news} target="_blank" rel="noopener noreferrer" className="link-btn">📰 뉴스</a>}
                      {comp.x    && <a href={comp.x}    target="_blank" rel="noopener noreferrer" className="link-btn">𝕏 X</a>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   사이드 패널 - 단계 목록
───────────────────────────────────────────── */
function ChainSidePanel({ activeId, onSelect }) {
  return (
    <div className="illust-panel">
      <div className="illust-panel-title">밸류체인 단계</div>
      {SEMI_CHAIN.map(step => {
        const isActive = activeId === step.id;
        const c = step.color;
        return (
          <div
            key={step.id}
            className={`illust-item${isActive ? ' active' : ''}`}
            onClick={() => onSelect(step.id)}
            style={isActive ? { borderColor: c.bdA, background: c.bgA } : {}}
          >
            <div className="illust-item-label" style={{ color: isActive ? c.txA : undefined }}>
              <span style={{ marginRight: 6 }}>{step.icon}</span>
              <span style={{ fontSize: 10, opacity: 0.6, marginRight: 4 }}>{step.step}.</span>
              {step.name}
            </div>
            {isActive && (
              <div className="illust-item-body">
                <div className="illust-item-layer">{step.desc}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────
   메인 반도체 대시보드
───────────────────────────────────────────── */
export default function SemiconductorDashboard() {
  const [activeId, setActiveId] = useState(null);
  const toggle = id => setActiveId(prev => prev === id ? null : id);
  const activeStep = SEMI_CHAIN.find(s => s.id === activeId);

  return (
    <div>
      {/* 섹션 헤더 */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
          🔬 반도체 전체 밸류체인
        </h2>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          실리콘 원자재 채굴 → EDA/IP 설계 → 소재 → 장비 → 파운드리 → 팹리스 설계 → 패키징(후공정) → 테스트 → 유통/판매
        </p>
      </div>

      {/* 다이어그램 + 사이드 패널 */}
      <div className="illust-wrap" style={{ alignItems: 'flex-start' }}>
        <div className="illust-svg" style={{ flex: '1 1 auto' }}>
          <ChainDiagram activeId={activeId} onSelect={toggle} />
        </div>
        <ChainSidePanel activeId={activeId} onSelect={toggle} />
      </div>

      {/* 기업 패널 */}
      {activeStep && <SemiCompanyPanel step={activeStep} />}

      {!activeId && (
        <p className="hint-text" style={{ marginTop: 20 }}>
          ↑ 밸류체인 단계를 클릭하면 단계 설명과 Top 10 기업이 표시됩니다
        </p>
      )}
    </div>
  );
}
