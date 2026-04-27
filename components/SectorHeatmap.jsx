'use client';

import { useMemo, useState } from 'react';
import useSectorHeatmap from '@/hooks/useSectorHeatmap';

const SECTORS = [
  { id: 'ai-dc',   label: 'AI 데이터센터', icon: '🏢' },
  { id: 'semi',    label: '반도체',         icon: '🔬' },
  { id: 'space',   label: '우주',           icon: '🚀' },
  { id: 'raw',     label: '원자재',         icon: '⛏️' },
  { id: 'energy',  label: '에너지',         icon: '⚡' },
  { id: 'biotech', label: '바이오테크',     icon: '🧬' },
  { id: 'fintech', label: '핀테크',         icon: '💳' },
];

/* ══════════════════════════════════════════════════
   Squarified treemap 알고리즘 (직접 구현)
   참고: Bruls, Huijsen, Wijk 2000 — 각 셀 종횡비를 정사각형에 가깝게
══════════════════════════════════════════════════ */

function worst(row, w) {
  // row 내 셀들의 가장 나쁜 종횡비
  if (row.length === 0) return Infinity;
  const sum = row.reduce((s, x) => s + x, 0);
  const rmax = Math.max(...row);
  const rmin = Math.min(...row);
  const w2 = w * w;
  const sum2 = sum * sum;
  return Math.max((w2 * rmax) / sum2, sum2 / (w2 * rmin));
}

/**
 * @param {Array<{value: number, ...}>} items  - 시총 등 가중치(value) 가진 아이템들. value 내림차순 정렬되어 들어와야 함.
 * @param {{x,y,w,h}} rect  - 그릴 사각형
 * @returns {Array<{...item, x,y,w,h}>}
 */
function squarify(items, rect) {
  const total = items.reduce((s, it) => s + it.value, 0);
  if (total <= 0 || items.length === 0) return [];

  // 가용 공간에 비례하게 정규화
  const area = rect.w * rect.h;
  const scale = area / total;
  const normalized = items.map(it => ({ ...it, area: it.value * scale }));

  const out = [];
  let { x, y, w, h } = rect;
  let remaining = [...normalized];

  while (remaining.length > 0) {
    const shorter = Math.min(w, h);
    let row = [];
    let bestWorst = Infinity;
    let i = 0;
    // row를 한 셀씩 늘려가며 worst가 나아지는 동안 추가
    while (i < remaining.length) {
      const test = [...row.map(r => r.area), remaining[i].area];
      const wTest = worst(test, shorter);
      if (wTest > bestWorst) break;
      bestWorst = wTest;
      row.push(remaining[i]);
      i++;
    }

    // row를 그리기. row의 합 = rowArea, 그걸 shorter 변에 직각으로 깔기.
    const rowArea = row.reduce((s, r) => s + r.area, 0);
    const longer = w + h - shorter;
    const rowThick = rowArea / shorter; // 행의 두께(긴 변에 직각)

    if (w >= h) {
      // 좌측에 세로로 row 깔기
      let cy = y;
      for (const cell of row) {
        const cellH = cell.area / rowThick;
        out.push({ ...cell, x, y: cy, w: rowThick, h: cellH });
        cy += cellH;
      }
      x += rowThick;
      w -= rowThick;
    } else {
      // 위쪽에 가로로 row 깔기
      let cx = x;
      for (const cell of row) {
        const cellW = cell.area / rowThick;
        out.push({ ...cell, x: cx, y, w: cellW, h: rowThick });
        cx += cellW;
      }
      y += rowThick;
      h -= rowThick;
    }

    remaining = remaining.slice(row.length);
  }

  return out;
}

/* ══════════════════════════════════════════════════
   색 매핑 (일간 등락률 → 색)
══════════════════════════════════════════════════ */

function colorForChange(pct) {
  if (pct === null || pct === undefined || isNaN(pct)) return '#475569'; // gray
  // -3% 이하 진한 빨강, +3% 이상 진한 초록, 0 회색
  const clamped = Math.max(-3, Math.min(3, pct));
  if (clamped > 0) {
    // 0 → #334155 (gray-blue), +3 → #16a34a (green-600)
    const t = clamped / 3;
    return mix('#334155', '#16a34a', t);
  } else if (clamped < 0) {
    const t = -clamped / 3;
    return mix('#334155', '#dc2626', t); // red-600
  }
  return '#334155';
}

function mix(a, b, t) {
  // a, b: hex (#rrggbb)
  const ah = parseInt(a.slice(1), 16), bh = parseInt(b.slice(1), 16);
  const ar = (ah >> 16) & 0xff, ag = (ah >> 8) & 0xff, ab = ah & 0xff;
  const br = (bh >> 16) & 0xff, bg = (bh >> 8) & 0xff, bb = bh & 0xff;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const b2 = Math.round(ab + (bb - ab) * t);
  return `#${[(r<<16)|(g<<8)|b2].map(n => n.toString(16).padStart(6, '0'))[0]}`;
}

function fmtPct(pct) {
  if (pct === null || pct === undefined) return '—';
  return `${pct > 0 ? '+' : ''}${pct.toFixed(2)}%`;
}

function fmtMktcap(usd) {
  if (!usd) return '—';
  if (usd >= 1e12) return `$${(usd / 1e12).toFixed(2)}T`;
  if (usd >= 1e9)  return `$${(usd / 1e9).toFixed(1)}B`;
  if (usd >= 1e6)  return `$${(usd / 1e6).toFixed(0)}M`;
  return `$${usd}`;
}

/* ══════════════════════════════════════════════════
   섹터 한 칸
══════════════════════════════════════════════════ */

function SectorBlock({ sector, companies, isLoaded, onSelectSector }) {
  const W = 360, H = 220;
  const PAD = 1; // 셀 간격

  const cells = useMemo(() => {
    if (!companies || companies.length === 0) return [];
    const items = companies
      .filter(c => c.mktcap > 0)
      .sort((a, b) => b.mktcap - a.mktcap)
      .map(c => ({ ...c, value: c.mktcap }));
    return squarify(items, { x: 0, y: 0, w: W, h: H });
  }, [companies]);

  return (
    <div className="hm-block">
      <div className="hm-block-head">
        <button
          className="hm-block-title"
          onClick={() => onSelectSector?.(sector.id)}
          title="클릭해 이 섹터 진입"
        >
          <span>{sector.icon}</span> {sector.label}
        </button>
        {!isLoaded && <span className="hm-loading-tag">⟳ 로딩</span>}
        {isLoaded && cells.length === 0 && (
          <span className="hm-empty-tag">데이터 없음</span>
        )}
        {isLoaded && cells.length > 0 && (
          <span className="hm-count-tag">{cells.length}개</span>
        )}
      </div>

      <div className="hm-block-body">
        {!isLoaded && (
          <div className="hm-skeleton">
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
              <rect width={W} height={H} fill="#1e293b" />
              {[0, 1, 2, 3].map(i => (
                <rect key={i}
                  x={(i * W / 4) + 2} y={2} width={W/4 - 4} height={H - 4}
                  fill="#0f172a" opacity={0.5}
                />
              ))}
            </svg>
          </div>
        )}

        {isLoaded && cells.length > 0 && (
          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            className="hm-tree"
          >
            {cells.map(cell => {
              const fill = colorForChange(cell.changePct);
              const showLabel = cell.w > 30 && cell.h > 18;
              const showPct   = cell.w > 50 && cell.h > 32;
              const tFontSize = Math.max(8, Math.min(14, Math.sqrt(cell.w * cell.h) / 7));
              return (
                <g key={cell.ticker}
                  className="hm-cell"
                  onClick={() => onSelectSector?.(sector.id)}
                >
                  <title>
                    {`${cell.name} (${cell.ticker})\n` +
                     `시총 ${fmtMktcap(cell.mktcap)}\n` +
                     `일간 ${fmtPct(cell.changePct)}\n` +
                     (cell.pe ? `PER ${cell.pe.toFixed(1)}\n` : '') +
                     (cell.layerName ? `레이어 ${cell.layerName}` : '')}
                  </title>
                  <rect
                    x={cell.x + PAD} y={cell.y + PAD}
                    width={Math.max(0, cell.w - 2 * PAD)}
                    height={Math.max(0, cell.h - 2 * PAD)}
                    fill={fill}
                    stroke="#0f172a"
                    strokeWidth="0.5"
                  />
                  {showLabel && (
                    <text
                      x={cell.x + cell.w / 2}
                      y={cell.y + cell.h / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={tFontSize}
                      fontWeight="700"
                      fill="#f1f5f9"
                      style={{ pointerEvents: 'none' }}
                    >
                      {cell.ticker}
                    </text>
                  )}
                  {showPct && (
                    <text
                      x={cell.x + cell.w / 2}
                      y={cell.y + cell.h / 2 + tFontSize * 0.9}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={tFontSize * 0.75}
                      fontWeight="500"
                      fill="#e2e8f0"
                      style={{ pointerEvents: 'none' }}
                    >
                      {fmtPct(cell.changePct)}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        )}

        {isLoaded && cells.length === 0 && (
          <div className="hm-empty-msg">
            {sector.id === 'raw'
              ? '광물별 구조라 히트맵 미지원'
              : '데이터 없음'}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   메인
══════════════════════════════════════════════════ */
export default function SectorHeatmap({ priorityOrder, onSelectSector }) {
  const { data, loadedSet, loading, error } = useSectorHeatmap(priorityOrder);

  return (
    <div className="sector-heatmap">
      <div className="hm-head">
        <span className="hm-title">🗺️ 섹터 히트맵</span>
        <span className="hm-subtitle">
          셀 크기 = 시총 · 색 = 일간 등락률 (-3%~+3%) · 호버하면 상세
        </span>
        <span className="hm-progress">
          {loadedSet.size}/{SECTORS.length} 섹터 로드됨
          {loading && <span className="live-badge loading-badge" style={{ marginLeft: 8 }}>⟳ 채우는 중…</span>}
          {error && <span className="live-badge error-badge" title={error} style={{ marginLeft: 8 }}>⚠</span>}
        </span>
      </div>

      <div className="hm-grid">
        {SECTORS.map(s => (
          <SectorBlock
            key={s.id}
            sector={s}
            companies={data[s.id]}
            isLoaded={loadedSet.has(s.id)}
            onSelectSector={onSelectSector}
          />
        ))}
      </div>

      {/* 색 범례 */}
      <div className="hm-legend">
        <span className="hm-legend-label">색 범례</span>
        <div className="hm-legend-bar">
          <span className="hm-legend-tick">-3%</span>
          <div className="hm-legend-gradient" />
          <span className="hm-legend-tick">+3%</span>
        </div>
      </div>
    </div>
  );
}
