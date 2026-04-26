'use client';

import { useState, useMemo } from 'react';
import { SEMI_CHAIN, SEMI_ROW1, SEMI_ROW2, SEMI_ROW3, SEMI_FLAGS, INDUSTRY_PLAYERS } from '@/data/semiconductor';

// shortName을 최대 width 기준으로 2줄 분리
function splitName(name) {
  // 슬래시, 공백, 특수문자 기준 4자 이하면 한 줄
  if (name.length <= 4) return [name, ''];
  // 슬래시 포함 이름 처리 (EDA/IP → 'EDA/' / 'IP')
  const slashIdx = name.indexOf('/');
  if (slashIdx > 0 && slashIdx < name.length - 1) {
    return [name.slice(0, slashIdx + 1), name.slice(slashIdx + 1)];
  }
  // 5자 초과면 앞 5자 / 나머지
  if (name.length > 5) return [name.slice(0, 5), name.slice(5)];
  return [name, ''];
}
import { FLAG_BY_NAME } from '@/data/companies';
import useMarketCaps from '@/hooks/useMarketCaps';
import { normalizeTicker, formatMktcap } from '@/lib/ticker-utils';

/* ═══════════════════════════════════════════════════════
   레이아웃 상수
   Row 1 (업스트림):    3단계 — 원자재 · EDA/IP · 소재
   Row 2 (전공정장비):  5단계 — 노광 · 증착 · 식각 · 세정 · 계측
   Row 3 (팹·후공정):  5단계 — 파운드리 · 팹리스 · 패키징 · 테스트 · 유통

   연결 구조:
   Row1 마지막(소재)  ─L자→ Row2 첫번째(노광)
   Row2 마지막(계측)  ─L자→ Row3 첫번째(파운드리)
═══════════════════════════════════════════════════════ */
const BOX_W   = 88;
const BOX_H   = 72;
const GAP_X   = 12;
const PAD_X   = 14;
const PAD_Y   = 18;
const ROW_GAP = 48;

// 각 행의 박스 영역 너비
const row1W = SEMI_ROW1.length * BOX_W + (SEMI_ROW1.length - 1) * GAP_X;
const row2W = SEMI_ROW2.length * BOX_W + (SEMI_ROW2.length - 1) * GAP_X;
const row3W = SEMI_ROW3.length * BOX_W + (SEMI_ROW3.length - 1) * GAP_X;

// SVG 전체 크기
const TOTAL_W = Math.max(row1W, row2W, row3W) + PAD_X * 2;
const ROW1_Y  = PAD_Y + 10; // 레이블 공간 확보
const ROW2_Y  = ROW1_Y + BOX_H + ROW_GAP;
const ROW3_Y  = ROW2_Y + BOX_H + ROW_GAP;
const TOTAL_H = ROW3_Y + BOX_H + PAD_Y;

// 박스 중심 X (각 행의 왼쪽부터 정렬)
function boxCX(rowArr, idx) {
  return PAD_X + idx * (BOX_W + GAP_X) + BOX_W / 2;
}

/* ── 단일 박스 ── */
function StepBox({ step, idx, rowArr, rowY, isActive, onSelect }) {
  const cx = boxCX(rowArr, idx);
  const x  = cx - BOX_W / 2;
  const c  = step.color;

  return (
    <g onClick={() => onSelect(step.id)} style={{ cursor: 'pointer' }}>
      {isActive && (
        <rect x={x} y={rowY} width={BOX_W} height={BOX_H} rx={9}
          fill="none" stroke={c.bdA} strokeWidth={3}
          opacity={0.45} filter="url(#sglow)" />
      )}
      <rect x={x} y={rowY} width={BOX_W} height={BOX_H} rx={9}
        fill={isActive ? c.bgA : c.bg}
        stroke={isActive ? c.bdA : c.bd}
        strokeWidth={isActive ? 2 : 1.2}
        style={{ transition: 'all 0.18s' }} />
      {/* 단계 번호 */}
      <text x={x + 5} y={rowY + 11} fontSize={8} fontWeight="700"
        fill={isActive ? c.txA : c.tx} opacity={0.65}
        style={{ pointerEvents: 'none' }}>
        {step.step}
      </text>
      {/* 아이콘 */}
      <text x={cx} y={rowY + 28}
        textAnchor="middle" dominantBaseline="middle"
        fontSize={19} style={{ pointerEvents: 'none' }}>
        {step.icon}
      </text>
      {/* 이름 (최대 2줄 — splitName으로 자연스럽게 분리) */}
      {(() => {
        const [line1, line2] = splitName(step.shortName);
        const hasLine2 = line2.length > 0;
        return (
          <>
            <text x={cx} y={rowY + BOX_H - (hasLine2 ? 18 : 12)}
              textAnchor="middle" fontSize={9} fontWeight="700"
              fill={isActive ? c.txA : c.tx}
              style={{ pointerEvents: 'none', transition: 'fill 0.18s' }}>
              {line1}
            </text>
            {hasLine2 && (
              <text x={cx} y={rowY + BOX_H - 6}
                textAnchor="middle" fontSize={9} fontWeight="700"
                fill={isActive ? c.txA : c.tx}
                style={{ pointerEvents: 'none', transition: 'fill 0.18s' }}>
                {line2}
              </text>
            )}
          </>
        );
      })()}
    </g>
  );
}

/* ── L자형 연결 경로 생성 ──
   fromRow의 마지막 박스 하단 → toRow의 첫번째 박스 상단 */
function lPath(fromRowArr, fromRowY, toRowArr, toRowY) {
  const fromCX = boxCX(fromRowArr, fromRowArr.length - 1);
  const toCX   = boxCX(toRowArr, 0);
  const fromY  = fromRowY + BOX_H;
  const toY    = toRowY;
  const midY   = fromY + ROW_GAP / 2;
  return `M ${fromCX} ${fromY} L ${fromCX} ${midY} L ${toCX} ${midY} L ${toCX} ${toY}`;
}

/* ── 3행 SVG 다이어그램 ── */
function ChainDiagram({ activeId, onSelect }) {
  // L자 연결 1: 소재(row1 끝) → 노광(row2 시작)
  const conn12 = lPath(SEMI_ROW1, ROW1_Y, SEMI_ROW2, ROW2_Y);
  const conn12Active = activeId === SEMI_ROW1[SEMI_ROW1.length - 1].id || activeId === SEMI_ROW2[0].id;

  // L자 연결 2: 계측(row2 끝) → 파운드리(row3 시작)
  const conn23 = lPath(SEMI_ROW2, ROW2_Y, SEMI_ROW3, ROW3_Y);
  const conn23Active = activeId === SEMI_ROW2[SEMI_ROW2.length - 1].id || activeId === SEMI_ROW3[0].id;

  const rowArrow = (rowArr, rowY) => rowArr.map((step, i) => {
    if (i === rowArr.length - 1) return null;
    const x1 = boxCX(rowArr, i) + BOX_W / 2;
    const x2 = boxCX(rowArr, i + 1) - BOX_W / 2;
    const y  = rowY + BOX_H / 2;
    const isAct = activeId === step.id || activeId === rowArr[i + 1].id;
    return (
      <line key={`arr-${step.id}`}
        x1={x1} y1={y} x2={x2} y2={y}
        stroke={isAct ? '#6366f1' : '#334155'}
        strokeWidth={isAct ? 2 : 1.4}
        markerEnd={isAct ? 'url(#sarrow-a)' : 'url(#sarrow)'}
        style={{ transition: 'stroke 0.18s' }} />
    );
  });

  // 행 레이블 (배경 rect + 텍스트)
  const rowLabel = (text, y, color) => (
    <>
      <rect x={PAD_X - 2} y={y - 13} width={text.length * 6.6 + 10} height={13}
        rx={4} fill={color} opacity={0.18} />
      <text x={PAD_X + 3} y={y - 2} fontSize={8} fontWeight="800"
        fill={color} letterSpacing="0.8" style={{ pointerEvents: 'none' }}>
        {text}
      </text>
    </>
  );

  return (
    <div className="semi-chain-wrap">
      <svg
        viewBox={`0 0 ${TOTAL_W} ${TOTAL_H}`}
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
          {/* 오른쪽 화살표 */}
          <marker id="sarrow" markerWidth="7" markerHeight="7" refX="4" refY="3.5" orient="auto">
            <path d="M0,0 L0,7 L7,3.5 z" fill="#334155" />
          </marker>
          <marker id="sarrow-a" markerWidth="7" markerHeight="7" refX="4" refY="3.5" orient="auto">
            <path d="M0,0 L0,7 L7,3.5 z" fill="#818cf8" />
          </marker>
          {/* 아래쪽 화살표 (L자 연결 종단) */}
          <marker id="sarrow-dn" markerWidth="7" markerHeight="7" refX="3.5" refY="4" orient="auto">
            <path d="M0,0 L7,0 L3.5,7 z" fill="#334155" />
          </marker>
          <marker id="sarrow-dn-a" markerWidth="7" markerHeight="7" refX="3.5" refY="4" orient="auto">
            <path d="M0,0 L7,0 L3.5,7 z" fill="#818cf8" />
          </marker>
        </defs>

        <rect width={TOTAL_W} height={TOTAL_H} fill="url(#sgrid)" />

        {/* ── 행 레이블 ── */}
        {rowLabel('UPSTREAM  ·  업스트림', ROW1_Y, '#b45309')}
        {rowLabel('FRONT-END  ·  전공정 장비', ROW2_Y, '#6366f1')}
        {rowLabel('BACK-END  ·  후공정 / 유통', ROW3_Y, '#0891b2')}

        {/* ── 행 내부 수평 화살표 ── */}
        {rowArrow(SEMI_ROW1, ROW1_Y)}
        {rowArrow(SEMI_ROW2, ROW2_Y)}
        {rowArrow(SEMI_ROW3, ROW3_Y)}

        {/* ── L자 연결: 업스트림 → 전공정 ── */}
        <path d={conn12} fill="none"
          stroke={conn12Active ? '#6366f1' : '#334155'}
          strokeWidth={conn12Active ? 2 : 1.4}
          strokeDasharray={conn12Active ? 'none' : '4 3'}
          markerEnd={conn12Active ? 'url(#sarrow-dn-a)' : 'url(#sarrow-dn)'}
          style={{ transition: 'stroke 0.18s' }} />

        {/* ── L자 연결: 전공정 → 팹·후공정 ── */}
        <path d={conn23} fill="none"
          stroke={conn23Active ? '#6366f1' : '#334155'}
          strokeWidth={conn23Active ? 2 : 1.4}
          strokeDasharray={conn23Active ? 'none' : '4 3'}
          markerEnd={conn23Active ? 'url(#sarrow-dn-a)' : 'url(#sarrow-dn)'}
          style={{ transition: 'stroke 0.18s' }} />

        {/* ── Row 1 박스 ── */}
        {SEMI_ROW1.map((step, i) => (
          <StepBox key={step.id}
            step={step} idx={i} rowArr={SEMI_ROW1}
            rowY={ROW1_Y} isActive={activeId === step.id}
            onSelect={onSelect} />
        ))}

        {/* ── Row 2 박스 ── */}
        {SEMI_ROW2.map((step, i) => (
          <StepBox key={step.id}
            step={step} idx={i} rowArr={SEMI_ROW2}
            rowY={ROW2_Y} isActive={activeId === step.id}
            onSelect={onSelect} />
        ))}

        {/* ── Row 3 박스 ── */}
        {SEMI_ROW3.map((step, i) => (
          <StepBox key={step.id}
            step={step} idx={i} rowArr={SEMI_ROW3}
            rowY={ROW3_Y} isActive={activeId === step.id}
            onSelect={onSelect} />
        ))}

        {/* ── 하단 서명 ── */}
        <text x={TOTAL_W / 2} y={TOTAL_H - 4}
          textAnchor="middle" fontSize={7.5} fill="#1e293b" fontWeight="600" letterSpacing="1.4"
          style={{ pointerEvents: 'none' }}>
          SEMICONDUCTOR VALUE CHAIN  ·  13 STAGES  ·  SILICON TO MARKET
        </text>
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   사이드 패널 — 3행 분리 목록
═══════════════════════════════════════════════════════ */
function ChainSidePanel({ activeId, onSelect }) {
  const group = (label, rows, color) => (
    <>
      <div style={{
        fontSize: 9, fontWeight: 800, color,
        letterSpacing: '0.8px', textTransform: 'uppercase',
        padding: '6px 8px 2px', marginTop: 4,
      }}>
        {label}
      </div>
      {rows.map(step => {
        const isActive = activeId === step.id;
        const c = step.color;
        return (
          <div key={step.id}
            className={`illust-item${isActive ? ' active' : ''}`}
            onClick={() => onSelect(step.id)}
            style={isActive ? { borderColor: c.bdA, background: c.bgA } : {}}>
            <div className="illust-item-label" style={{ color: isActive ? c.txA : undefined }}>
              <span style={{ marginRight: 5 }}>{step.icon}</span>
              <span style={{ fontSize: 9, opacity: 0.55, marginRight: 3 }}>{step.step}.</span>
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
    </>
  );

  return (
    <div className="illust-panel">
      <div className="illust-panel-title">밸류체인 단계</div>
      {group('▶ 업스트림', SEMI_ROW1, '#b45309')}
      <div style={{ borderTop: '1px solid #1e293b', marginTop: 6 }} />
      {group('▶ 전공정 장비', SEMI_ROW2, '#6366f1')}
      <div style={{ borderTop: '1px solid #1e293b', marginTop: 6 }} />
      {group('▶ 후공정 · 유통', SEMI_ROW3, '#0891b2')}
      <div style={{ borderTop: '1px solid #1e293b', marginTop: 6 }} />
      <div style={{ fontSize: 9, fontWeight: 800, color: '#64748b', letterSpacing: '0.8px',
        textTransform: 'uppercase', padding: '6px 8px 4px' }}>
        ▶ 산업 플레이어
      </div>
      {INDUSTRY_PLAYERS.map(p => {
        const isActive = false;
        return (
          <div key={p.id} className="illust-item" style={{ opacity: 0.7 }}>
            <div className="illust-item-label">
              <span style={{ marginRight: 5 }}>{p.icon}</span>
              <span style={{ fontSize: 9, color: '#64748b', marginRight: 4 }}>[{p.role}]</span>
              {p.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   산업 플레이어 카드 섹션 (공정 흐름 밖 — 설계/생산 주체)
═══════════════════════════════════════════════════════ */
function IndustryPlayersSection({ activeId, onSelect }) {
  return (
    <div style={{ marginTop: 32 }}>
      {/* 섹션 헤더 */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12,
        paddingBottom: 8, borderBottom: '1px solid var(--border)',
      }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
          🏢 산업 플레이어
        </span>
        <span style={{
          fontSize: 11, color: 'var(--text-muted)',
          background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
          borderRadius: 6, padding: '2px 8px',
        }}>
          공정 흐름 밖에서 설계·생산을 담당하는 핵심 주체
        </span>
      </div>

      {/* 카드 3개 가로 배열 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {INDUSTRY_PLAYERS.map(player => {
          const isActive = activeId === player.id;
          const c = player.color;
          return (
            <div key={player.id}
              onClick={() => onSelect(player.id)}
              style={{
                cursor: 'pointer',
                background: isActive ? c.bgA : c.bg,
                border: `1.5px solid ${isActive ? c.bdA : c.bd}`,
                borderRadius: 12, padding: '14px 16px',
                transition: 'all 0.18s',
                boxShadow: isActive ? `0 0 16px ${c.bd}55` : 'none',
              }}>
              {/* 카드 헤더 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 22 }}>{player.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: isActive ? c.txA : c.tx }}>
                    {player.name}
                  </div>
                  <div style={{
                    fontSize: 10, color: isActive ? c.tx : 'var(--text-muted)',
                    background: `${c.bd}33`, borderRadius: 4,
                    padding: '1px 6px', display: 'inline-block', marginTop: 2,
                  }}>
                    {player.role}
                  </div>
                </div>
              </div>
              {/* 설명 */}
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {player.desc}
              </div>
              {/* 클릭 힌트 */}
              {!isActive && (
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 8, opacity: 0.6 }}>
                  클릭하여 Top 10 기업 보기 →
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 선택된 산업 플레이어 기업 패널 */}
      {(() => {
        const activePlayer = INDUSTRY_PLAYERS.find(p => p.id === activeId);
        if (!activePlayer) return null;
        return <SemiCompanyPanel step={activePlayer} />;
      })()}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   기업 Top 10 패널
═══════════════════════════════════════════════════════ */
const RANK_LABELS = ['🥇 1위', '🥈 2위', '🥉 3위', '4위', '5위', '6위', '7위', '8위', '9위', '10위'];

function SemiCompanyPanel({ step }) {
  const [showMore, setShowMore] = useState(false);
  const pool = step.candidates ?? [];

  const tickers = useMemo(() => pool
    .map(c => c.ticker)
    .filter(t => t && t !== 'Private'
      && !t.startsWith('비상장')
      && !t.includes('지주사')
      && !t.includes('통합')
      && !t.includes('중복')),
  [step.id]); // eslint-disable-line

  const { mktcaps, loading, error, fresh } = useMarketCaps(tickers);

  const sortedPool = useMemo(() => {
    const withLive = pool.map(c => {
      const norm    = normalizeTicker(c.ticker);
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

  const validPool = sortedPool.filter(c => c.detail && !c.detail.startsWith('참고용'));
  const top10 = validPool.slice(0, 10);
  const rest  = validPool.slice(10);

  const now = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  const c   = step.color;
  const getFlag = name => SEMI_FLAGS[name] ?? FLAG_BY_NAME?.[name] ?? '🌐';

  return (
    <div className="company-panel" style={{ borderColor: c.bd, marginTop: 24 }}>
      {/* 헤더 */}
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
            {fresh   && <span className="live-badge">● LIVE</span>}
            {loading && <span className="live-badge loading-badge">⟳ 로딩 중…</span>}
            {error   && <span className="live-badge error-badge" title={error}>⚠ 하드코딩 데이터</span>}
            {!fresh && !loading && !error && <span style={{ marginLeft: 6 }}>· 정적 데이터</span>}
          </div>
        </div>
        {fresh && <div className="panel-refresh-note">{now} 기준 실시간</div>}
      </div>

      {/* 단계 설명 */}
      <div style={{
        padding: '10px 16px', fontSize: 12,
        color: 'var(--text-secondary)',
        background: 'rgba(255,255,255,0.02)',
        borderBottom: '1px solid var(--border)', lineHeight: 1.7,
      }}>
        {step.detail}
      </div>

      {/* Top 10 그리드 */}
      <div className="companies-grid">
        {top10.map((comp, idx) => {
          const flag       = getFlag(comp.name);
          const liveMktcap = comp.liveCap ? formatMktcap(comp.liveCap) : null;
          const rank       = idx + 1;
          return (
            <div key={`${comp.name}-${idx}`} className="company-card">
              <span className={`rank-badge rank-${rank}`}>
                {RANK_LABELS[rank - 1]}
                {fresh && rank !== comp.rank && (
                  <span className={`rank-change ${rank < comp.rank ? 'rank-up' : 'rank-down'}`}>
                    {rank < comp.rank ? ` ▲${comp.rank - rank}` : ` ▼${rank - comp.rank}`}
                  </span>
                )}
              </span>
              <div className="company-name">
                <span className="company-flag">{flag}</span>
                {comp.name}
              </div>
              <div className="company-ticker">{comp.ticker}</div>
              <div className="company-mktcap">
                {liveMktcap
                  ? <>{liveMktcap}<span className="mktcap-live-dot" title="실시간">●</span></>
                  : comp.mktcap}
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

      {/* 더보기 */}
      {rest.length > 0 && (
        <div className="more-section">
          <button className="more-toggle-btn" onClick={() => setShowMore(v => !v)}>
            {showMore ? '▲ 접기' : `▼ 후보풀 더보기 (${rest.length}개)`}
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
                      <span className="company-flag">{flag}</span>{comp.name}
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

/* ═══════════════════════════════════════════════════════
   메인 반도체 대시보드
═══════════════════════════════════════════════════════ */
export default function SemiconductorDashboard() {
  const [activeId, setActiveId] = useState(null);
  const toggle     = id => setActiveId(prev => prev === id ? null : id);
  const activeStep = SEMI_CHAIN.find(s => s.id === activeId);

  return (
    <div>
      {/* 헤더 */}
      <div style={{ marginBottom: 14 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
          🔬 반도체 전체 밸류체인
        </h2>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <span style={{ color: '#b45309' }}>업스트림</span>
          &nbsp;(원자재 · 소재)&ensp;→&ensp;
          <span style={{ color: '#6366f1' }}>전공정 장비</span>
          &nbsp;(노광 · 증착 · 식각 · 세정 · 계측)&ensp;→&ensp;
          <span style={{ color: '#0891b2' }}>후공정 · 유통</span>
          &nbsp;(패키징 · 테스트 · 유통)
        </p>
      </div>

      {/* 다이어그램 + 사이드 패널 */}
      <div className="illust-wrap" style={{ alignItems: 'flex-start' }}>
        <div className="illust-svg" style={{ flex: '1 1 auto' }}>
          <ChainDiagram activeId={activeId} onSelect={toggle} />
        </div>
        <ChainSidePanel activeId={activeId} onSelect={toggle} />
      </div>

      {/* 공정 단계 기업 패널 */}
      {activeStep && <SemiCompanyPanel step={activeStep} />}

      {!activeId && (
        <p className="hint-text" style={{ marginTop: 20 }}>
          ↑ 밸류체인 단계를 클릭하면 단계 설명과 Top 10 기업이 표시됩니다
        </p>
      )}

      {/* ── 산업 플레이어 카드 섹션 ── */}
      <IndustryPlayersSection
        activeId={activeId}
        onSelect={toggle}
      />
    </div>
  );
}
