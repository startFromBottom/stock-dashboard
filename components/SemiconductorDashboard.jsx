'use client';

import { useState, useMemo } from 'react';
import { SEMI_CHAIN, SEMI_ROW1, SEMI_ROW2, SEMI_ROW3, SEMI_FLAGS, INDUSTRY_PLAYERS } from '@/data/semiconductor';
import { GLOSSARY_ITEMS, GLOSSARY_CAT_LABEL } from '@/data/semi-glossary';

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
   단계별 용어 사전 섹션 (접기/펼치기)
═══════════════════════════════════════════════════════ */
function GlossaryInlineSection({ categoryId }) {
  const [open, setOpen] = useState(false);
  const [openTermId, setOpenTermId] = useState(null);

  const terms = GLOSSARY_ITEMS.filter(g => g.category === categoryId);
  if (terms.length === 0) return null;

  const catInfo = GLOSSARY_CAT_LABEL[categoryId];

  return (
    <div className="glos-inline-section">
      {/* 접기/펼치기 헤더 */}
      <button
        className="glos-inline-toggle"
        onClick={() => { setOpen(v => !v); setOpenTermId(null); }}
      >
        <span className="glos-inline-toggle-left">
          <span className="glos-inline-icon">📖</span>
          <span className="glos-inline-title">핵심 용어</span>
          <span className="glos-inline-count">{terms.length}개</span>
        </span>
        <span className="glos-inline-chevron">{open ? '▲ 접기' : '▼ 펼치기'}</span>
      </button>

      {/* 용어 카드 목록 */}
      {open && (
        <div className="glos-inline-list">
          {terms.map(item => (
            <div
              key={item.id}
              className={`glos-card${openTermId === item.id ? ' open' : ''}`}
              onClick={() => setOpenTermId(openTermId === item.id ? null : item.id)}
            >
              {/* 카드 헤더 */}
              <div className="glos-card-header">
                <span className="glos-icon">{item.icon}</span>
                <div className="glos-term-wrap">
                  <span className="glos-term">{item.term}</span>
                  {item.abbr && <span className="glos-abbr">{item.abbr}</span>}
                </div>
                {item.diagram && <span className="glos-diagram-badge">📊 그림</span>}
                <span className="glos-chevron">{openTermId === item.id ? '▲' : '▼'}</span>
              </div>
              {/* 한 줄 요약 */}
              <p className="glos-short">{item.short}</p>
              {/* 상세 */}
              {openTermId === item.id && (
                <div className="glos-body">
                  <p className="glos-detail">{item.body}</p>
                  {item.diagram && (
                    <div className="glos-diagram-wrap">
                      <GlossDiagramSVG type={item.diagram} />
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
          ))}
        </div>
      )}
    </div>
  );
}

/* ── 다이어그램 SVG (SemiGlossary.jsx와 동일한 로직을 인라인으로) ── */
function GlossDiagramSVG({ type }) {
  const svgs = {
    czochralski: (
      <svg viewBox="0 0 320 200" className="glos-diagram-svg">
        <rect x="80" y="90" width="160" height="90" rx="6" fill="#1a0f05" stroke="#b45309" strokeWidth="1.5"/>
        <ellipse cx="160" cy="90" rx="80" ry="16" fill="#2a1a08" stroke="#b45309" strokeWidth="1.5"/>
        <ellipse cx="160" cy="92" rx="72" ry="12" fill="#f97316" opacity="0.5"/>
        <text x="160" y="96" textAnchor="middle" fill="#fed7aa" fontSize="9">폴리실리콘 용융액</text>
        <rect x="138" y="16" width="44" height="78" rx="22" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1.5"/>
        <text x="160" y="58" textAnchor="middle" fill="#1e293b" fontSize="9" fontWeight="bold">실리콘</text>
        <text x="160" y="70" textAnchor="middle" fill="#1e293b" fontSize="9" fontWeight="bold">잉곳</text>
        <line x1="160" y1="14" x2="160" y2="4" stroke="#4ade80" strokeWidth="2"/>
        <polygon points="160,0 155,8 165,8" fill="#4ade80"/>
        <text x="195" y="10" fill="#86efac" fontSize="9">인상↑ + 회전</text>
        <text x="30" y="140" fill="#fbbf24" fontSize="9">🔥 고주파 가열</text>
        <rect x="145" y="10" width="30" height="8" rx="2" fill="#7c3aed"/>
        <text x="160" y="17" textAnchor="middle" fill="#e9d5ff" fontSize="7">종자결정</text>
        <text x="160" y="192" textAnchor="middle" fill="#64748b" fontSize="8">Czochralski (CZ) 공정</text>
      </svg>
    ),
    photoresist: (
      <svg viewBox="0 0 320 200" className="glos-diagram-svg">
        {[{x:20,label:'① 도포',sub:'PR 스핀코팅'},{x:100,label:'② 노광',sub:'EUV/ArF 조사'},{x:190,label:'③ 현상',sub:'용해·제거'},{x:255,label:'④ 식각',sub:'패턴 전사'}].map((s,i)=>(
          <g key={i}>
            <text x={s.x+25} y="18" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontWeight="bold">{s.label}</text>
            <text x={s.x+25} y="28" textAnchor="middle" fill="#94a3b8" fontSize="7">{s.sub}</text>
          </g>
        ))}
        <rect x="10" y="100" width="70" height="14" rx="2" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1"/>
        <rect x="10" y="86" width="70" height="14" rx="2" fill="#7c2d12" stroke="#ea580c" strokeWidth="1" opacity="0.85"/>
        <text x="45" y="94" textAnchor="middle" fill="#fed7aa" fontSize="7">PR층</text>
        <text x="45" y="108" textAnchor="middle" fill="#93c5fd" fontSize="7">웨이퍼(SiO₂)</text>
        <rect x="90" y="100" width="70" height="14" rx="2" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1"/>
        <rect x="90" y="86" width="70" height="14" rx="2" fill="#7c2d12" stroke="#ea580c" strokeWidth="1" opacity="0.85"/>
        <rect x="90" y="60" width="16" height="26" rx="1" fill="#334155"/>
        <rect x="126" y="60" width="34" height="26" rx="1" fill="#334155"/>
        {[95,98,101,104].map(x=><line key={x} x1={x} y1="55" x2={x} y2="86" stroke="#a78bfa" strokeWidth="1" opacity="0.7"/>)}
        {[131,137,143,149,155].map(x=><line key={x} x1={x} y1="55" x2={x} y2="86" stroke="#a78bfa" strokeWidth="1" opacity="0.7"/>)}
        <text x="125" y="58" textAnchor="middle" fill="#c4b5fd" fontSize="7">EUV 13.5nm</text>
        <rect x="180" y="100" width="70" height="14" rx="2" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1"/>
        <rect x="180" y="86" width="16" height="14" rx="1" fill="#7c2d12" stroke="#ea580c" strokeWidth="1" opacity="0.85"/>
        <rect x="234" y="86" width="16" height="14" rx="1" fill="#7c2d12" stroke="#ea580c" strokeWidth="1" opacity="0.85"/>
        <text x="215" y="80" textAnchor="middle" fill="#4ade80" fontSize="7">노출부 용해↓</text>
        <rect x="250" y="100" width="60" height="14" rx="2" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1"/>
        <rect x="250" y="86" width="14" height="14" rx="1" fill="#0f172a" stroke="#3b82f6" strokeWidth="1"/>
        <rect x="296" y="86" width="14" height="14" rx="1" fill="#0f172a" stroke="#3b82f6" strokeWidth="1"/>
        <rect x="264" y="96" width="32" height="4" rx="1" fill="#64748b"/>
        <text x="280" y="80" textAnchor="middle" fill="#38bdf8" fontSize="7">패턴 완성</text>
        {[80,168,248].map(x=>(
          <g key={x}><line x1={x} y1="93" x2={x+8} y2="93" stroke="#475569" strokeWidth="1.5"/><polygon points={`${x+10},93 ${x+6},90 ${x+6},96`} fill="#475569"/></g>
        ))}
        <text x="160" y="135" textAnchor="middle" fill="#64748b" fontSize="8">포토레지스트 패터닝 공정 (Positive-tone PR)</text>
      </svg>
    ),
    euv: (
      <svg viewBox="0 0 320 200" className="glos-diagram-svg">
        <text x="160" y="20" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="bold">파장(λ)과 패턴 크기</text>
        <rect x="30" y="40" width="193" height="32" rx="4" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5"/>
        <text x="37" y="56" fill="#93c5fd" fontSize="10" fontWeight="bold">ArF 액침</text>
        <text x="37" y="67" fill="#60a5fa" fontSize="9">λ = 193nm</text>
        <text x="225" y="60" fill="#94a3b8" fontSize="9">패턴 ≈ 38nm</text>
        <rect x="30" y="84" width="14" height="32" rx="4" fill="#4a044e" stroke="#d946ef" strokeWidth="1.5"/>
        <text x="48" y="100" fill="#f0abfc" fontSize="10" fontWeight="bold">EUV</text>
        <text x="48" y="111" fill="#e879f9" fontSize="9">λ = 13.5nm</text>
        <text x="225" y="104" fill="#94a3b8" fontSize="9">패턴 ≈ 13nm</text>
        <rect x="30" y="128" width="10" height="32" rx="4" fill="#2e1065" stroke="#818cf8" strokeWidth="1.5"/>
        <text x="44" y="144" fill="#c7d2fe" fontSize="10" fontWeight="bold">High-NA EUV</text>
        <text x="44" y="155" fill="#a5b4fc" fontSize="9">λ = 13.5nm, NA=0.55</text>
        <text x="225" y="148" fill="#94a3b8" fontSize="9">패턴 ≈ 8nm</text>
        <line x1="30" y1="175" x2="220" y2="175" stroke="#334155" strokeWidth="1"/>
        <text x="30" y="185" fill="#64748b" fontSize="8">0</text>
        <text x="215" y="185" fill="#64748b" fontSize="8">193nm</text>
        <text x="160" y="195" textAnchor="middle" fill="#64748b" fontSize="7">파장이 짧을수록 → 더 작은 패턴 가능 (분해능 ↑)</text>
      </svg>
    ),
    ald: (
      <svg viewBox="0 0 320 200" className="glos-diagram-svg">
        <text x="160" y="16" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">ALD 1 사이클 (= 원자층 1개)</text>
        {[{x:10,color:'#1e3a5f',bd:'#3b82f6',label:'① 전구체 A 투입',sub:'표면 흡착',dot:'#60a5fa'},{x:85,color:'#1a0f05',bd:'#b45309',label:'② N₂ 퍼지',sub:'과잉 제거',dot:'#fbbf24'},{x:160,color:'#0f1a0a',bd:'#16a34a',label:'③ 반응가스 B',sub:'박막 1층 형성',dot:'#4ade80'},{x:235,color:'#1a0020',bd:'#9333ea',label:'④ N₂ 퍼지',sub:'부산물 제거',dot:'#c084fc'}].map((s,i)=>(
          <g key={i}>
            <rect x={s.x} y="28" width="72" height="100" rx="6" fill={s.color} stroke={s.bd} strokeWidth="1.5"/>
            <rect x={s.x+6} y="88" width="60" height="10" rx="2" fill="#334155" stroke="#475569" strokeWidth="1"/>
            {i===0&&[0,1,2,3,4].map(j=><circle key={j} cx={s.x+14+j*11} cy="82" r="4" fill={s.dot} opacity="0.9"/>)}
            {i===2&&[0,1,2,3,4].map(j=><circle key={j} cx={s.x+14+j*11} cy="80" r="3" fill={s.dot} opacity="0.8"/>)}
            {(i===2||i===3)&&<rect x={s.x+6} y="84" width="60" height="4" rx="1" fill="#4ade80" opacity="0.6"/>}
            <text x={s.x+36} y="43" textAnchor="middle" fill="#e2e8f0" fontSize="8" fontWeight="bold">{s.label}</text>
            <text x={s.x+36} y="54" textAnchor="middle" fill="#94a3b8" fontSize="7">{s.sub}</text>
          </g>
        ))}
        {[82,157,232].map(x=>(
          <g key={x}><line x1={x} y1="78" x2={x+3} y2="78" stroke="#475569" strokeWidth="1.5"/><polygon points={`${x+5},78 ${x+1},75 ${x+1},81`} fill="#475569"/></g>
        ))}
        <path d="M 307 78 Q 315 140 160 155 Q 5 140 13 78" fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="4,3"/>
        <polygon points="13,78 9,85 17,83" fill="#475569"/>
        <text x="160" y="172" textAnchor="middle" fill="#64748b" fontSize="8">반복 → 원하는 두께까지</text>
      </svg>
    ),
    rie: (
      <svg viewBox="0 0 320 200" className="glos-diagram-svg">
        <text x="160" y="16" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">RIE 식각 원리 (이방성)</text>
        <rect x="40" y="25" width="240" height="60" rx="4" fill="#1a0020" stroke="#9333ea" strokeWidth="1.5"/>
        <text x="160" y="45" textAnchor="middle" fill="#c084fc" fontSize="9">플라즈마 (CF₄·Cl₂ 이온화)</text>
        <text x="160" y="58" textAnchor="middle" fill="#9333ea" fontSize="8">⚡ RF 전계 인가</text>
        {[80,105,130,155,180,205,230].map(x=>(
          <g key={x}><line x1={x} y1="88" x2={x} y2="105" stroke="#f0abfc" strokeWidth="1.5"/><polygon points={`${x},107 ${x-3},100 ${x+3},100`} fill="#f0abfc"/></g>
        ))}
        <text x="160" y="100" textAnchor="middle" fill="#e879f9" fontSize="8">이온 수직 충돌 ↓↓↓</text>
        <rect x="40" y="110" width="70" height="20" rx="2" fill="#7c2d12" stroke="#ea580c" strokeWidth="1.5"/>
        <rect x="210" y="110" width="70" height="20" rx="2" fill="#7c2d12" stroke="#ea580c" strokeWidth="1.5"/>
        <rect x="110" y="110" width="100" height="40" rx="2" fill="#0f172a" stroke="#334155" strokeWidth="1"/>
        <text x="160" y="134" textAnchor="middle" fill="#38bdf8" fontSize="8">수직 식각 ↓</text>
        <rect x="40" y="150" width="240" height="20" rx="2" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5"/>
        <rect x="110" y="150" width="100" height="20" rx="2" fill="#0c2340" stroke="#1d4ed8" strokeWidth="1"/>
        <text x="160" y="190" textAnchor="middle" fill="#64748b" fontSize="8">이방성(anisotropic) 식각 → 수직 측벽 형성</text>
      </svg>
    ),
    cmp: (
      <svg viewBox="0 0 320 200" className="glos-diagram-svg">
        <text x="160" y="16" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">CMP 공정 원리</text>
        <path d="M 30 80 Q 55 60 80 80 Q 105 100 130 75 Q 155 55 180 80 Q 205 100 230 70 Q 255 50 290 80 L 290 110 L 30 110 Z" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5"/>
        <rect x="30" y="38" width="260" height="18" rx="4" fill="#292524" stroke="#78716c" strokeWidth="1.5"/>
        <text x="160" y="50" textAnchor="middle" fill="#d6d3d1" fontSize="8">CMP 패드 (회전) ↻</text>
        {[60,90,120,150,180,210,240,270].map(x=><ellipse key={x} cx={x} cy="58" rx="5" ry="3" fill="#059669" opacity="0.7"/>)}
        <line x1="160" y1="22" x2="160" y2="36" stroke="#fbbf24" strokeWidth="2"/>
        <polygon points="160,38 156,32 164,32" fill="#fbbf24"/>
        <rect x="30" y="135" width="260" height="28" rx="4" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5"/>
        <text x="160" y="153" textAnchor="middle" fill="#93c5fd" fontSize="9">연마 후: 평탄화 완료 ✓</text>
        <line x1="160" y1="113" x2="160" y2="133" stroke="#475569" strokeWidth="1.5"/>
        <polygon points="160,135 156,129 164,129" fill="#475569"/>
        <text x="160" y="192" textAnchor="middle" fill="#64748b" fontSize="8">화학반응(산화) + 기계적 마모 → 원자 수준 평탄화</text>
      </svg>
    ),
    cowos: (
      <svg viewBox="0 0 320 200" className="glos-diagram-svg">
        <text x="160" y="16" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="bold">CoWoS-S 구조</text>
        <rect x="20" y="165" width="280" height="20" rx="3" fill="#292524" stroke="#78716c" strokeWidth="1.5"/>
        <text x="160" y="178" textAnchor="middle" fill="#d6d3d1" fontSize="9">유기 기판 (Organic Substrate)</text>
        <rect x="20" y="125" width="280" height="30" rx="3" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2"/>
        <text x="160" y="143" textAnchor="middle" fill="#a5b4fc" fontSize="9">실리콘 인터포저 (RDL 배선층)</text>
        {[40,55,70,85,100,115,130,145,160,175,190,205,220,235,250,265,280].map(x=><ellipse key={x} cx={x} cy="124" rx="4" ry="3" fill="#fbbf24" opacity="0.8"/>)}
        <rect x="30" y="70" width="150" height="50" rx="4" fill="#0c2340" stroke="#0ea5e9" strokeWidth="2"/>
        <text x="105" y="91" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">GPU / AI 칩</text>
        <text x="105" y="106" textAnchor="middle" fill="#7dd3fc" fontSize="8">TSMC N3 / N2</text>
        {[0,1,2,3].map(i=><rect key={i} x="190" y={70+i*11} width="95" height="11" rx="2" fill={i===0?'#0f172a':'#1e293b'} stroke="#38bdf8" strokeWidth="1"/>)}
        <text x="237" y="80" textAnchor="middle" fill="#7dd3fc" fontSize="8">HBM3e</text>
        <text x="237" y="91" textAnchor="middle" fill="#64748b" fontSize="7">D램 다이 ×4~12</text>
        <line x1="180" y1="95" x2="190" y2="95" stroke="#4ade80" strokeWidth="2" strokeDasharray="3,2"/>
        <text x="160" y="195" textAnchor="middle" fill="#64748b" fontSize="8">AI 서버 핵심 패키징 — H100·B200 GPU 탑재 방식</text>
      </svg>
    ),
    hbm: (
      <svg viewBox="0 0 320 200" className="glos-diagram-svg">
        <text x="160" y="16" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="bold">HBM 수직 적층 구조</text>
        <rect x="80" y="158" width="160" height="22" rx="4" fill="#0c2340" stroke="#0ea5e9" strokeWidth="2"/>
        <text x="160" y="172" textAnchor="middle" fill="#38bdf8" fontSize="9">베이스 로직 다이</text>
        {[0,1,2,3].map(i=>(
          <g key={i}>
            <rect x="80" y={68+i*22} width="160" height="20" rx="3" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5"/>
            <text x="160" y={80+i*22} textAnchor="middle" fill="#93c5fd" fontSize="8">D램 다이 #{4-i} (LPDDR5X)</text>
            {[95,105,115,125,135,145,155,165,175,185,195,205,215,225].map(x=><line key={x} x1={x} y1={88+i*22} x2={x} y2={90+i*22} stroke="#fbbf24" strokeWidth="1.5"/>)}
          </g>
        ))}
        {[95,110,125,140,155,170,185,200,215].map(x=><ellipse key={x} cx={x} cy="156" rx="5" ry="4" fill="#fbbf24" opacity="0.9"/>)}
        <text x="160" y="195" textAnchor="middle" fill="#64748b" fontSize="8">HBM3e: 2048bit 버스 · 최대 1.2TB/s · 24~36GB 용량</text>
      </svg>
    ),
    tsv: (
      <svg viewBox="0 0 320 200" className="glos-diagram-svg">
        <text x="160" y="16" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">TSV (Through-Silicon Via) 단면</text>
        <rect x="60" y="25" width="200" height="50" rx="4" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5"/>
        <text x="160" y="52" textAnchor="middle" fill="#93c5fd" fontSize="9">상단 실리콘 다이</text>
        <rect x="60" y="130" width="200" height="45" rx="4" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5"/>
        <text x="160" y="155" textAnchor="middle" fill="#93c5fd" fontSize="9">하단 실리콘 다이</text>
        {[120,160,200].map(x=>(
          <g key={x}>
            <rect x={x-7} y="72" width="14" height="60" rx="2" fill="#1a0020" stroke="#9333ea" strokeWidth="1"/>
            <rect x={x-5} y="74" width="10" height="56" rx="1" fill="#b45309" stroke="#f97316" strokeWidth="0.5"/>
            <text x={x} y="107" textAnchor="middle" fill="#fed7aa" fontSize="6">Cu</text>
          </g>
        ))}
        {[120,160,200].map(x=><ellipse key={x} cx={x} cy="130" rx="7" ry="5" fill="#fbbf24" opacity="0.9"/>)}
        {[120,160,200].map(x=><ellipse key={x} cx={x} cy="72" rx="7" ry="5" fill="#fbbf24" opacity="0.9"/>)}
        <text x="160" y="192" textAnchor="middle" fill="#64748b" fontSize="8">직경 2~10μm 구리 기둥 → 다이 간 초단거리 연결</text>
      </svg>
    ),
    finfet: (
      <svg viewBox="0 0 320 200" className="glos-diagram-svg">
        <text x="160" y="16" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">FinFET vs 평면 MOSFET 비교</text>
        <text x="80" y="38" textAnchor="middle" fill="#94a3b8" fontSize="9">평면 MOSFET</text>
        <rect x="30" y="80" width="100" height="30" rx="2" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5"/>
        <rect x="65" y="55" width="30" height="28" rx="2" fill="#4a044e" stroke="#9333ea" strokeWidth="2"/>
        <text x="80" y="73" textAnchor="middle" fill="#c084fc" fontSize="7">게이트</text>
        <rect x="30" y="70" width="25" height="12" rx="2" fill="#1a3a1a" stroke="#16a34a" strokeWidth="1"/>
        <rect x="105" y="70" width="25" height="12" rx="2" fill="#1a3a1a" stroke="#16a34a" strokeWidth="1"/>
        <text x="80" y="120" fill="#ef4444" fontSize="8" textAnchor="middle">누설전류 ↑</text>
        <text x="230" y="38" textAnchor="middle" fill="#94a3b8" fontSize="9">FinFET (3D)</text>
        <rect x="215" y="58" width="30" height="60" rx="3" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="2"/>
        <text x="230" y="95" textAnchor="middle" fill="#93c5fd" fontSize="7">Fin(채널)</text>
        <rect x="205" y="65" width="50" height="40" rx="4" fill="none" stroke="#9333ea" strokeWidth="3"/>
        <text x="185" y="88" fill="#c084fc" fontSize="7">게이트 3면</text>
        <text x="230" y="135" textAnchor="middle" fill="#4ade80" fontSize="8">누설전류 ↓ 제어력 ↑</text>
        <line x1="160" y1="40" x2="160" y2="150" stroke="#334155" strokeWidth="1" strokeDasharray="4,3"/>
        <text x="160" y="165" textAnchor="middle" fill="#64748b" fontSize="8">16nm~5nm 주력 공정</text>
      </svg>
    ),
    gaa: (
      <svg viewBox="0 0 320 200" className="glos-diagram-svg">
        <text x="160" y="16" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">GAA 나노시트 구조 (3nm 이하)</text>
        <rect x="60" y="40" width="200" height="130" rx="8" fill="#1a0020" stroke="#9333ea" strokeWidth="2.5"/>
        <text x="160" y="185" textAnchor="middle" fill="#c084fc" fontSize="9">게이트 (4면 전체 제어)</text>
        {[0,1,2].map(i=>(
          <g key={i}>
            <rect x="80" y={62+i*32} width="160" height="18" rx="4" fill="#0c2340" stroke="#38bdf8" strokeWidth="2"/>
            <text x="160" y={73+i*32} textAnchor="middle" fill="#7dd3fc" fontSize="8">나노시트 채널 #{i+1}</text>
          </g>
        ))}
        <rect x="35" y="62" width="30" height="82" rx="4" fill="#1a3a1a" stroke="#16a34a" strokeWidth="1.5"/>
        <text x="50" y="106" textAnchor="middle" fill="#86efac" fontSize="8" transform="rotate(-90,50,106)">소스(S)</text>
        <rect x="255" y="62" width="30" height="82" rx="4" fill="#1a3a1a" stroke="#16a34a" strokeWidth="1.5"/>
        <text x="270" y="106" textAnchor="middle" fill="#86efac" fontSize="8" transform="rotate(-90,270,106)">드레인(D)</text>
        <text x="160" y="197" textAnchor="middle" fill="#64748b" fontSize="8">삼성 3nm(2022) · TSMC 2nm(2025)</text>
      </svg>
    ),
    chiplet: (
      <svg viewBox="0 0 320 200" className="glos-diagram-svg">
        <text x="160" y="16" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">칩렛 (Chiplet) 구성 예시</text>
        <rect x="15" y="28" width="290" height="145" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1.5"/>
        <rect x="20" y="33" width="280" height="135" rx="4" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1" opacity="0.5"/>
        <text x="160" y="47" textAnchor="middle" fill="#6366f1" fontSize="7">실리콘 인터포저 / UCIe 인터커넥트</text>
        <rect x="30" y="55" width="80" height="55" rx="4" fill="#0c2340" stroke="#0ea5e9" strokeWidth="2"/>
        <text x="70" y="78" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold">CPU 코어</text>
        <text x="70" y="90" textAnchor="middle" fill="#7dd3fc" fontSize="7">TSMC N3</text>
        <rect x="120" y="55" width="80" height="55" rx="4" fill="#1a0020" stroke="#9333ea" strokeWidth="2"/>
        <text x="160" y="78" textAnchor="middle" fill="#c084fc" fontSize="8" fontWeight="bold">GPU 타일</text>
        <rect x="210" y="55" width="80" height="55" rx="4" fill="#0f1a0a" stroke="#16a34a" strokeWidth="2"/>
        <text x="250" y="75" textAnchor="middle" fill="#86efac" fontSize="8" fontWeight="bold">I/O 다이</text>
        <text x="250" y="87" textAnchor="middle" fill="#4ade80" fontSize="7">성숙 노드</text>
        <rect x="30" y="120" width="50" height="35" rx="3" fill="#082f49" stroke="#38bdf8" strokeWidth="1.5"/>
        <text x="55" y="141" textAnchor="middle" fill="#7dd3fc" fontSize="7">HBM</text>
        {[[110,82,120,82],[200,82,210,82],[70,110,70,120]].map(([x1,y1,x2,y2],i)=>(
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3,2"/>
        ))}
        <text x="160" y="192" textAnchor="middle" fill="#64748b" fontSize="8">각 타일을 최적 공정으로 분리 → 수율·비용 최적화</text>
      </svg>
    ),
  };
  return svgs[type] ?? null;
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
        padding: '12px 18px 14px',
        background: 'rgba(255,255,255,0.02)',
        borderBottom: '1px solid var(--border)',
      }}>
        {(Array.isArray(step.detail) ? step.detail : [step.detail]).map((para, i) => (
          <p key={i} style={{
            fontSize: 13, color: 'var(--text-secondary)',
            lineHeight: 1.75, margin: i === 0 ? 0 : '10px 0 0',
          }}>
            {para}
          </p>
        ))}
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

      {/* ── 핵심 용어 사전 (이 단계 관련 용어) ── */}
      <GlossaryInlineSection categoryId={step.id} />
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
