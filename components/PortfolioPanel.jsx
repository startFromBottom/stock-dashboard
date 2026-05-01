'use client';

import { useMemo } from 'react';

/**
 * Portfolio Panel — 워치리스트 중 매수가+수량이 둘 다 있는 종목만 portfolio로 간주.
 *
 * 표시 항목:
 *   K1. 총 손익 + 손익률 + 평가금액 (큰 KPI)
 *   K2. 섹터별 비중 도넛
 *   K3. 종목별 손익 막대그래프 (수익률 기준)
 *   K5. Best / Worst performer 박스
 *   + 자동 인사이트 멘트 1~2줄 (분산도, 섹터 집중도 등)
 *
 * Props:
 *   - items: 워치리스트 전체 (livePrice 등 enrich 된 상태)
 */

const SECTOR_META = {
  'ai-dc':         { label: 'AI 데이터센터', color: '#60a5fa' },
  'semi':          { label: '반도체',         color: '#a78bfa' },
  'space':         { label: '우주',           color: '#34d399' },
  'raw':           { label: '원자재',         color: '#fbbf24' },
  'energy':        { label: '에너지',         color: '#fb923c' },
  'biotech':       { label: '바이오테크',     color: '#f472b6' },
  'fintech':       { label: '핀테크',         color: '#22d3ee' },
  'healthcare':    { label: '헬스케어',       color: '#4ade80' },
  'quantum':       { label: '양자컴퓨터',     color: '#c084fc' },
  'staples':       { label: '필수소비재',     color: '#94a3b8' },
  'discretionary': { label: '임의소비재',     color: '#fb7185' },
  'financials':    { label: '금융',           color: '#38bdf8' },
  'industrials':   { label: '산업재',         color: '#facc15' },
};

function fmt(n, digits = 0) {
  if (n === null || n === undefined || isNaN(n)) return '—';
  return n.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}
function fmtPct(pct, digits = 2) {
  if (pct === null || pct === undefined || isNaN(pct)) return '—';
  const sign = pct > 0 ? '+' : '';
  return `${sign}${pct.toFixed(digits)}%`;
}

export default function PortfolioPanel({ items }) {
  // 매수가+수량 둘 다 있는 종목 = 포트폴리오
  const portfolio = useMemo(
    () => (items ?? []).filter(it =>
      typeof it.buy_price === 'number' && it.buy_price > 0 &&
      typeof it.buy_shares === 'number' && it.buy_shares > 0
    ),
    [items]
  );

  // 빈 상태
  if (portfolio.length === 0) {
    return (
      <div className="pf-empty">
        <div className="pf-empty-icon">📊</div>
        <div className="pf-empty-text">
          <h4 className="pf-empty-title">포트폴리오 분석을 보려면 매수가/수량을 입력하세요</h4>
          <p className="pf-empty-desc">
            아래 워치리스트에서 종목 옆 ✎ 버튼을 눌러 매수가와 수량을 채우면, 여기에 손익·섹터 비중·인사이트가 자동 분석됩니다.
          </p>
        </div>
      </div>
    );
  }

  // ── KPI 계산 ──
  const positions = portfolio.map(it => {
    const cost = it.buy_price * it.buy_shares;
    const value = (typeof it.livePrice === 'number')
      ? it.livePrice * it.buy_shares
      : null;
    const pnl = (value !== null) ? value - cost : null;
    const pnlPct = (value !== null) ? ((it.livePrice / it.buy_price) - 1) * 100 : null;
    return { ...it, cost, value, pnl, pnlPct };
  });

  const totalCost  = positions.reduce((s, p) => s + p.cost, 0);
  const withValue  = positions.filter(p => p.value !== null);
  const totalValue = withValue.reduce((s, p) => s + p.value, 0);
  const totalPnl   = withValue.reduce((s, p) => s + p.pnl, 0);
  const totalPnlPct = totalCost > 0 ? (totalPnl / totalCost) * 100 : null;
  const livePctOfPortfolio = totalCost > 0
    ? (withValue.reduce((s, p) => s + p.cost, 0) / totalCost) * 100
    : 0;

  // ── 섹터별 집계 ──
  const sectorMap = {};
  for (const p of positions) {
    const sid = p.sector ?? '_';
    if (!sectorMap[sid]) sectorMap[sid] = { sid, cost: 0, value: 0, pnl: 0, count: 0, hasValue: false };
    sectorMap[sid].cost += p.cost;
    sectorMap[sid].count += 1;
    if (p.value !== null) {
      sectorMap[sid].value += p.value;
      sectorMap[sid].pnl += p.pnl;
      sectorMap[sid].hasValue = true;
    }
  }
  const sectorBreakdown = Object.values(sectorMap)
    .map(s => ({
      ...s,
      weight: totalCost > 0 ? (s.cost / totalCost) * 100 : 0,
      pnlPct: s.cost > 0 && s.hasValue ? (s.pnl / s.cost) * 100 : null,
      meta: SECTOR_META[s.sid] ?? { label: s.sid, color: '#6b7280' },
    }))
    .sort((a, b) => b.weight - a.weight);

  // ── Best / Worst (livePrice 있는 것만) ──
  const ranked = withValue
    .filter(p => p.pnlPct !== null)
    .sort((a, b) => b.pnlPct - a.pnlPct);
  const best  = ranked[0] ?? null;
  const worst = ranked.length > 1 ? ranked[ranked.length - 1] : null;

  // ── 종목별 막대 데이터 (수익률 기준 정렬) ──
  const barData = ranked; // 이미 정렬됨

  // ── 인사이트 멘트 ──
  const insights = [];
  // 섹터 집중도
  if (sectorBreakdown.length > 0) {
    const top = sectorBreakdown[0];
    if (top.weight >= 50) {
      insights.push({
        kind: 'warn',
        text: `${top.meta.label} 섹터 비중이 ${top.weight.toFixed(0)}%로 매우 높음 — 분산 검토 필요`,
      });
    } else if (top.weight >= 35) {
      insights.push({
        kind: 'info',
        text: `${top.meta.label} 섹터에 ${top.weight.toFixed(0)}% 집중 — 다른 섹터 보강 고려`,
      });
    }
  }
  // 종목 수
  if (portfolio.length === 1) {
    insights.push({ kind: 'warn', text: '단일 종목 포트폴리오 — 최소 5~10종목 분산 권장' });
  } else if (portfolio.length < 5) {
    insights.push({ kind: 'info', text: `${portfolio.length}개 종목으로 구성 — 분산 효과를 위해 더 추가 검토` });
  }
  // 손익률 코멘트
  if (totalPnlPct !== null) {
    if (totalPnlPct > 20) {
      insights.push({ kind: 'good', text: `전체 +${totalPnlPct.toFixed(1)}% 수익 — 부분 차익실현 검토 가능` });
    } else if (totalPnlPct < -15) {
      insights.push({ kind: 'warn', text: `전체 ${totalPnlPct.toFixed(1)}% 손실 — 매수 근거 재검토 권장` });
    }
  }
  // 라이브 가격 미반영
  if (withValue.length < portfolio.length) {
    insights.push({
      kind: 'info',
      text: `${portfolio.length - withValue.length}개 종목은 실시간 가격 미반영 — 잠시 후 자동 업데이트`,
    });
  }

  const pnlCls = totalPnl > 0 ? 'pf-pos' : totalPnl < 0 ? 'pf-neg' : '';

  return (
    <div className="pf-wrap">
      <div className="pf-head">
        <h3 className="pf-title">📊 내 포트폴리오 분석</h3>
        <span className="pf-subtitle">매수가·수량 입력된 {portfolio.length}개 종목 기준</span>
      </div>

      {/* ── K1. 큰 KPI ── */}
      <div className="pf-kpi-row">
        <div className="pf-kpi-main">
          <span className="pf-kpi-label">총 평가금액</span>
          <span className="pf-kpi-main-val">${fmt(totalValue, 0)}</span>
          <span className="pf-kpi-sub">매수원가 ${fmt(totalCost, 0)}</span>
        </div>
        <div className="pf-kpi-main">
          <span className="pf-kpi-label">미실현 손익</span>
          <span className={`pf-kpi-main-val ${pnlCls}`}>
            {totalPnl >= 0 ? '+' : ''}${fmt(Math.abs(totalPnl), 0)}
          </span>
          <span className={`pf-kpi-sub ${pnlCls}`}>{fmtPct(totalPnlPct)}</span>
        </div>
        <div className="pf-kpi-main">
          <span className="pf-kpi-label">종목 수 / 섹터 수</span>
          <span className="pf-kpi-main-val pf-kpi-neutral">
            {portfolio.length} <span className="pf-kpi-slash">/</span> {sectorBreakdown.length}
          </span>
          <span className="pf-kpi-sub">
            평균 종목당 ${fmt(totalCost / portfolio.length, 0)}
          </span>
        </div>
      </div>

      {/* ── 인사이트 멘트 ── */}
      {insights.length > 0 && (
        <div className="pf-insights">
          {insights.map((ins, i) => (
            <div key={i} className={`pf-insight pf-insight-${ins.kind}`}>
              <span className="pf-insight-icon">
                {ins.kind === 'warn' ? '⚠️' : ins.kind === 'good' ? '✅' : '💡'}
              </span>
              <span>{ins.text}</span>
            </div>
          ))}
        </div>
      )}

      <div className="pf-grid">
        {/* ── K2. 섹터 비중 도넛 ── */}
        <div className="pf-card">
          <h4 className="pf-card-title">섹터별 비중 (매수원가 기준)</h4>
          <div className="pf-donut-wrap">
            <DonutChart breakdown={sectorBreakdown} totalCost={totalCost} />
            <div className="pf-donut-legend">
              {sectorBreakdown.map(s => (
                <div key={s.sid} className="pf-legend-row">
                  <span className="pf-legend-dot" style={{ background: s.meta.color }} />
                  <span className="pf-legend-label">{s.meta.label}</span>
                  <span className="pf-legend-weight">{s.weight.toFixed(1)}%</span>
                  {s.pnlPct !== null && (
                    <span className={`pf-legend-pnl ${s.pnlPct > 0 ? 'pf-pos' : s.pnlPct < 0 ? 'pf-neg' : ''}`}>
                      {fmtPct(s.pnlPct, 1)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── K5. Winner / Loser ── */}
        <div className="pf-card">
          <h4 className="pf-card-title">최고 / 최저 수익 종목</h4>
          <div className="pf-wl-row">
            {best ? (
              <div className="pf-wl-card pf-wl-best">
                <span className="pf-wl-tag">🏆 최고</span>
                <span className="pf-wl-ticker">{best.ticker}</span>
                {best.name && <span className="pf-wl-name">{best.name}</span>}
                <span className="pf-wl-pct pf-pos">{fmtPct(best.pnlPct)}</span>
                <span className="pf-wl-pnl pf-pos">+${fmt(best.pnl, 0)}</span>
              </div>
            ) : (
              <div className="pf-wl-card pf-wl-empty">
                <span>실시간 가격 대기 중…</span>
              </div>
            )}
            {worst ? (
              <div className="pf-wl-card pf-wl-worst">
                <span className="pf-wl-tag">📉 최저</span>
                <span className="pf-wl-ticker">{worst.ticker}</span>
                {worst.name && <span className="pf-wl-name">{worst.name}</span>}
                <span className={`pf-wl-pct ${worst.pnlPct < 0 ? 'pf-neg' : 'pf-pos'}`}>
                  {fmtPct(worst.pnlPct)}
                </span>
                <span className={`pf-wl-pnl ${worst.pnl < 0 ? 'pf-neg' : 'pf-pos'}`}>
                  {worst.pnl >= 0 ? '+' : '-'}${fmt(Math.abs(worst.pnl), 0)}
                </span>
              </div>
            ) : (
              <div className="pf-wl-card pf-wl-empty">
                <span>2개 이상 종목에 가격 데이터가 들어오면 표시됩니다</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── K3. 종목별 손익 막대 ── */}
      {barData.length > 0 && (
        <div className="pf-card pf-card-full">
          <h4 className="pf-card-title">종목별 수익률 (매수가 대비)</h4>
          <BarChart data={barData} />
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   도넛 차트 (SVG)
   - 섹터별 weight(%)에 비례한 호 그리기
══════════════════════════════════════════════════ */
function DonutChart({ breakdown, totalCost }) {
  const size = 180;
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = 80;
  const rInner = 50;

  if (breakdown.length === 0 || totalCost === 0) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={rOuter} fill="#1e293b" />
      </svg>
    );
  }

  // 단일 섹터면 그냥 풀원
  if (breakdown.length === 1) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={rOuter} fill={breakdown[0].meta.color} />
        <circle cx={cx} cy={cy} r={rInner} fill="var(--bg-card, #0f172a)" />
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="11" fill="#94a3b8">100%</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="10" fill="#cbd5e1" fontWeight="700">
          {breakdown[0].meta.label}
        </text>
      </svg>
    );
  }

  // 다중 섹터: 호 그리기
  const arcs = [];
  let cumPct = 0;
  for (const s of breakdown) {
    const startAngle = (cumPct / 100) * 2 * Math.PI - Math.PI / 2;
    const endAngle   = ((cumPct + s.weight) / 100) * 2 * Math.PI - Math.PI / 2;
    cumPct += s.weight;

    const x1 = cx + rOuter * Math.cos(startAngle);
    const y1 = cy + rOuter * Math.sin(startAngle);
    const x2 = cx + rOuter * Math.cos(endAngle);
    const y2 = cy + rOuter * Math.sin(endAngle);
    const xi1 = cx + rInner * Math.cos(endAngle);
    const yi1 = cy + rInner * Math.sin(endAngle);
    const xi2 = cx + rInner * Math.cos(startAngle);
    const yi2 = cy + rInner * Math.sin(startAngle);

    const largeArc = s.weight > 50 ? 1 : 0;
    const path = [
      `M ${x1} ${y1}`,
      `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${xi1} ${yi1}`,
      `A ${rInner} ${rInner} 0 ${largeArc} 0 ${xi2} ${yi2}`,
      'Z',
    ].join(' ');

    arcs.push({ path, color: s.meta.color, sid: s.sid });
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {arcs.map((a, i) => (
        <path key={a.sid + i} d={a.path} fill={a.color} stroke="var(--bg-card, #0f172a)" strokeWidth="1.5" />
      ))}
      <text x={cx} y={cy - 2} textAnchor="middle" fontSize="11" fill="#94a3b8">총</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="13" fill="#f1f5f9" fontWeight="800">
        ${fmt(totalCost, 0)}
      </text>
    </svg>
  );
}

/* ══════════════════════════════════════════════════
   막대 차트 (HTML/CSS)
   - 0 기준선 가운데, 양수 오른쪽 / 음수 왼쪽
══════════════════════════════════════════════════ */
function BarChart({ data }) {
  if (data.length === 0) return null;

  const maxAbs = Math.max(
    ...data.map(d => Math.abs(d.pnlPct ?? 0)),
    5  // 최소 5%까지는 보이게
  );

  return (
    <div className="pf-bars">
      {data.map(d => {
        const pct = d.pnlPct ?? 0;
        const widthPct = Math.min(50, (Math.abs(pct) / maxAbs) * 50); // 최대 50% (한쪽)
        const isPos = pct >= 0;
        return (
          <div key={d.id ?? d.ticker} className="pf-bar-row">
            <div className="pf-bar-label">
              <span className="pf-bar-ticker">{d.ticker}</span>
            </div>
            <div className="pf-bar-track">
              <div className="pf-bar-zero" />
              <div
                className={`pf-bar-fill ${isPos ? 'pf-bar-pos' : 'pf-bar-neg'}`}
                style={{
                  width: `${widthPct}%`,
                  [isPos ? 'left' : 'right']: '50%',
                }}
              />
            </div>
            <div className={`pf-bar-val ${isPos ? 'pf-pos' : 'pf-neg'}`}>
              {fmtPct(pct, 1)}
              <span className="pf-bar-pnl-sub">
                {' '}({isPos ? '+' : '-'}${fmt(Math.abs(d.pnl ?? 0), 0)})
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
