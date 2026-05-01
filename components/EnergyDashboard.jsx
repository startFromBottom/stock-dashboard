'use client';

import { useState, useMemo } from 'react';
import { ENERGY_TYPES, ENERGY_SHARE_SUMMARY } from '@/data/energyCompanies';
// ENERGY_SHARE_SUMMARY는 DonutChart 내부에서만 사용
import useMarketCaps from '@/hooks/useMarketCaps';
import useStockMetrics from '@/hooks/useStockMetrics';
import { extractPublicTickers, normalizeTicker, formatMktcap } from '@/lib/ticker-utils';
import StarButton from './StarButton';
import { cardClickHandler } from '@/lib/company-card-click';

function getRsiStyle(rsi) {
  if (rsi === null || rsi === undefined) return { color: 'var(--text-muted)', label: '—', badge: '' };
  if (rsi >= 70) return { color: '#f87171', label: `${rsi}`, badge: '과매수' };
  if (rsi <= 30) return { color: '#60a5fa', label: `${rsi}`, badge: '과매도' };
  return { color: '#4ade80', label: `${rsi}`, badge: '중립' };
}
function formatVolume(vol) {
  if (!vol || vol <= 0) return '—';
  if (vol >= 1_000_000_000) return `${(vol / 1_000_000_000).toFixed(2)}B`;
  if (vol >= 1_000_000)     return `${(vol / 1_000_000).toFixed(2)}M`;
  if (vol >= 1_000)         return `${(vol / 1_000).toFixed(1)}K`;
  return `${vol}`;
}

/* ══════════════════════════════════════════════════════
   도넛 차트 (전 세계 발전원 비중)
══════════════════════════════════════════════════════ */
function DonutChart({ activeId, onSelect }) {
  const W = 320, H = 320, R = 120, r = 68, CX = W / 2, CY = H / 2;

  // arc 경로 계산
  const total = ENERGY_SHARE_SUMMARY.reduce((s, e) => s + e.share, 0);
  let cumAngle = -Math.PI / 2; // 12시 방향 시작

  const arcs = ENERGY_SHARE_SUMMARY.map(item => {
    const angle = (item.share / total) * 2 * Math.PI;
    const startAngle = cumAngle;
    const endAngle = cumAngle + angle;
    cumAngle = endAngle;

    const x1 = CX + R * Math.cos(startAngle);
    const y1 = CY + R * Math.sin(startAngle);
    const x2 = CX + R * Math.cos(endAngle);
    const y2 = CY + R * Math.sin(endAngle);
    const xi1 = CX + r * Math.cos(startAngle);
    const yi1 = CY + r * Math.sin(startAngle);
    const xi2 = CX + r * Math.cos(endAngle);
    const yi2 = CY + r * Math.sin(endAngle);
    const largeArc = angle > Math.PI ? 1 : 0;

    const midAngle = startAngle + angle / 2;
    const labelR = R + 18;
    const labelX = CX + labelR * Math.cos(midAngle);
    const labelY = CY + labelR * Math.sin(midAngle);

    const d = [
      `M ${x1} ${y1}`,
      `A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${xi2} ${yi2}`,
      `A ${r} ${r} 0 ${largeArc} 0 ${xi1} ${yi1}`,
      'Z',
    ].join(' ');

    return { ...item, d, midAngle, labelX, labelY, angle };
  });

  const active = ENERGY_TYPES.find(e => e.id === activeId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, display: 'block' }}>
        {arcs.map(arc => {
          const isActive = arc.id === activeId;
          const scale = isActive ? 1.06 : 1;
          return (
            <g key={arc.id}
              onClick={() => onSelect(arc.id)}
              style={{ cursor: 'pointer', transformOrigin: `${CX}px ${CY}px`, transform: `scale(${scale})`, transition: 'transform 0.2s' }}
            >
              <path
                d={arc.d}
                fill={arc.color}
                opacity={activeId && !isActive ? 0.35 : 0.9}
                stroke={isActive ? '#fff' : '#0d1117'}
                strokeWidth={isActive ? 2 : 1}
                style={{ transition: 'opacity 0.2s' }}
              />
              {/* 큰 섹터만 라벨 표시 (1% 이상) */}
              {arc.share >= 1 && (
                <text
                  x={arc.labelX}
                  y={arc.labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={arc.share >= 10 ? 10 : 9}
                  fontWeight={isActive ? '700' : '500'}
                  fill={isActive ? '#fff' : '#94a3b8'}
                  style={{ pointerEvents: 'none', transition: 'fill 0.2s' }}
                >
                  {arc.share}%
                </text>
              )}
            </g>
          );
        })}

        {/* 중앙 텍스트 */}
        {active ? (
          <>
            <text x={CX} y={CY - 14} textAnchor="middle" dominantBaseline="middle"
              fontSize={22} style={{ pointerEvents: 'none' }}>{active.icon}</text>
            <text x={CX} y={CY + 8} textAnchor="middle" dominantBaseline="middle"
              fontSize={11} fontWeight="700" fill="#e2e8f0" style={{ pointerEvents: 'none' }}>
              {active.label}
            </text>
            <text x={CX} y={CY + 26} textAnchor="middle" dominantBaseline="middle"
              fontSize={14} fontWeight="800" fill={active.color.bdA ?? active.color.bd} style={{ pointerEvents: 'none' }}>
              {active.sharePercent}%
            </text>
          </>
        ) : (
          <>
            <text x={CX} y={CY - 8} textAnchor="middle" dominantBaseline="middle"
              fontSize={12} fill="#64748b" style={{ pointerEvents: 'none' }}>전 세계 발전</text>
            <text x={CX} y={CY + 10} textAnchor="middle" dominantBaseline="middle"
              fontSize={11} fill="#475569" style={{ pointerEvents: 'none' }}>에너지원 비중</text>
          </>
        )}
      </svg>

      <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, textAlign: 'center' }}>
        출처: IEA / BP Statistical Review · 2024 기준 추정치
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   사이드 패널 — 에너지 유형 목록
══════════════════════════════════════════════════════ */
function EnergyTypeList({ activeId, onSelect }) {
  return (
    <div className="illust-panel">
      <div className="illust-panel-title">에너지원 선택</div>
      {ENERGY_TYPES.map(et => {
        const isActive = activeId === et.id;
        const c = et.color;
        const summary = ENERGY_SHARE_SUMMARY.find(s => s.id === et.id);
        return (
          <div
            key={et.id}
            className={`illust-item${isActive ? ' active' : ''}`}
            onClick={() => onSelect(et.id)}
            style={isActive ? { borderColor: c.bdA, background: c.bgA } : {}}
          >
            <div className="illust-item-label" style={{ color: isActive ? c.txA : undefined }}>
              <span style={{ marginRight: 6 }}>{et.icon}</span>
              <span style={{ flex: 1 }}>{et.label}</span>
              <span style={{
                fontSize: 10, fontWeight: 700,
                color: isActive ? c.bdA : '#475569',
                marginLeft: 4,
                minWidth: 36, textAlign: 'right',
              }}>
                {summary?.share ?? et.sharePercent}%
              </span>
            </div>
            {isActive && (
              <div className="illust-item-body">
                <div className="illust-item-layer" style={{ color: c.tx, fontSize: 10 }}>
                  {et.desc}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   기업 카드 패널 (에너지 유형별)
══════════════════════════════════════════════════════ */
const RANK_LABELS = ['🥇 1위', '🥈 2위', '🥉 3위', '4위', '5위', '6위', '7위', '8위', '9위', '10위'];

function EnergyCompanyPanel({ energyType }) {
  const [showMore, setShowMore] = useState(false);
  const pool = energyType.companies ?? [];

  const tickers = useMemo(() => extractPublicTickers(pool), [energyType.id]); // eslint-disable-line
  const { mktcaps, loading, error, fresh } = useMarketCaps(tickers);
  const { metrics: stockMetrics, loading: metricsLoading } = useStockMetrics(tickers);

  const sortedPool = useMemo(() => {
    const withLive = pool.map(c => {
      const fmpTicker = normalizeTicker(c.ticker);
      const liveCap = fmpTicker ? mktcaps[fmpTicker] : undefined;
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

  const top10 = sortedPool.slice(0, 10);
  const rest  = sortedPool.slice(10);
  const c = energyType.color;
  const now = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="company-panel" style={{ borderColor: c.bd }}>
      {/* 헤더 */}
      <div className="panel-header">
        <div className="panel-icon">{energyType.icon}</div>
        <div style={{ flex: 1 }}>
          <div className="panel-title" style={{ color: c.txA }}>{energyType.label}</div>
          <div className="panel-subtitle">
            전 세계 발전 비중 <strong style={{ color: c.bdA }}>{energyType.sharePercent}%</strong>
            {fresh && <span className="live-badge">● LIVE</span>}
            {loading && <span className="live-badge loading-badge">⟳ 로딩 중…</span>}
            {error && <span className="live-badge error-badge" title={error}>⚠ 하드코딩 데이터</span>}
          </div>
        </div>
        {fresh && <div className="panel-refresh-note">{now} 기준 실시간</div>}
      </div>

      {/* 설명 */}
      <div className="comp-detail-box" style={{ borderLeftColor: c.bd }}>
        <p className="comp-detail-para">{energyType.desc}</p>
      </div>

      {/* 기업 그리드 */}
      <div className="companies-grid">
        {top10.map((co, idx) => {
          const liveMktcap = co.liveCap ? formatMktcap(co.liveCap) : null;
          const displayRank = idx + 1;
          const fmpTicker = normalizeTicker(co.ticker);
          const sm = fmpTicker ? stockMetrics[fmpTicker] : null;
          const rsiStyle = getRsiStyle(sm?.rsi ?? null);
          const volStr   = formatVolume(sm?.volume ?? null);
          return (
            <div key={`${co.name}-${idx}`} className="company-card clickable" onClick={cardClickHandler({ ticker: co.ticker, name: co.name, sector: 'energy' })}>
              <StarButton ticker={co.ticker} name={co.name} sector="energy" />
              <span className={`rank-badge rank-${displayRank}`}>
                {RANK_LABELS[displayRank - 1] ?? `${displayRank}위`}
                {fresh && displayRank !== co.rank && (
                  <span className={`rank-change ${displayRank < co.rank ? 'rank-up' : 'rank-down'}`}>
                    {displayRank < co.rank ? ` ▲${co.rank - displayRank}` : ` ▼${displayRank - co.rank}`}
                  </span>
                )}
              </span>
              <div className="company-name">🌐 {co.name}</div>
              <div className="company-ticker">{co.ticker}</div>
              <div className="company-mktcap">
                {liveMktcap ? (
                  <>{liveMktcap}<span className="mktcap-live-dot" title="실시간">●</span></>
                ) : co.mktcap}
              </div>
              <div className="stock-metrics-row">
                <div className="stock-metric-item">
                  <span className="stock-metric-label">거래량</span>
                  <span className="stock-metric-value">
                    {metricsLoading ? <span className="metrics-loading">…</span> : volStr}
                  </span>
                </div>
                <div className="stock-metric-item">
                  <span className="stock-metric-label">RSI(14)</span>
                  {metricsLoading ? (
                    <span className="stock-metric-value metrics-loading">…</span>
                  ) : (
                    <span className="stock-metric-value rsi-value" style={{ color: rsiStyle.color }}>
                      {rsiStyle.label}
                      {rsiStyle.badge && (
                        <span className="rsi-badge" style={{ borderColor: rsiStyle.color, color: rsiStyle.color }}>
                          {rsiStyle.badge}
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </div>
              <div className="company-detail">{co.detail}</div>
              <div className="company-links">
                <a href={co.ir}   target="_blank" rel="noopener noreferrer" className="link-btn">📊 IR</a>
                <a href={co.news} target="_blank" rel="noopener noreferrer" className="link-btn">📰 뉴스</a>
                <a href={co.x}    target="_blank" rel="noopener noreferrer" className="link-btn">𝕏 X</a>
              </div>
            </div>
          );
        })}
      </div>

      {/* 더보기 */}
      {rest.length > 0 && (
        <div className="more-section">
          <button className="more-toggle-btn" onClick={() => setShowMore(v => !v)}>
            {showMore ? '▲ 접기' : `▼ 더보기 (${rest.length}개)`}
          </button>
          {showMore && (
            <div className="more-grid">
              {rest.map((co, idx) => {
                const liveMktcap = co.liveCap ? formatMktcap(co.liveCap) : null;
                return (
                  <div key={`more-${co.name}-${idx}`} className="company-card more-card clickable" onClick={cardClickHandler({ ticker: co.ticker, name: co.name, sector: 'energy' })}>
                    <StarButton ticker={co.ticker} name={co.name} sector="energy" />
                    <span className="rank-badge rank-more">{idx + 11}위</span>
                    <div className="company-name">🌐 {co.name}</div>
                    <div className="company-ticker">{co.ticker}</div>
                    <div className="company-mktcap" style={{ color: 'var(--text-muted)' }}>
                      {liveMktcap ? <>{liveMktcap}<span className="mktcap-live-dot">●</span></> : co.mktcap}
                    </div>
                    <div className="company-detail">{co.detail}</div>
                    <div className="company-links">
                      <a href={co.ir}   target="_blank" rel="noopener noreferrer" className="link-btn">📊 IR</a>
                      <a href={co.news} target="_blank" rel="noopener noreferrer" className="link-btn">📰 뉴스</a>
                      <a href={co.x}    target="_blank" rel="noopener noreferrer" className="link-btn">𝕏 X</a>
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

/* ══════════════════════════════════════════════════════
   에너지 섹터 ETF 패널
══════════════════════════════════════════════════════ */
const ENERGY_ETFS = [
  {
    category: '재생에너지 (광범위)',
    color: '#10b981',
    items: [
      { ticker: 'ICLN',  name: 'iShares Global Clean Energy ETF',        aum: '~$28억',  ter: '0.41%', desc: '전 세계 청정에너지 기업 100종목. 태양광·풍력·수력·연료전지 고루 편입.' },
      { ticker: 'QCLN',  name: 'First Trust NASDAQ Clean Edge ETF',      aum: '~$8억',   ter: '0.58%', desc: '나스닥 상장 청정에너지 기업. 미국 비중 높음. EV·배터리 포함.' },
      { ticker: 'RNRG',  name: 'Global X Renewable Energy Producers ETF', aum: '~$2억',  ter: '0.65%', desc: '재생에너지 전력 생산 기업 특화. 유틸리티·IPP 중심.' },
    ],
  },
  {
    category: '태양광',
    color: '#facc15',
    items: [
      { ticker: 'TAN',   name: 'Invesco Solar ETF',                       aum: '~$17억',  ter: '0.69%', desc: '태양광 밸류체인 전반. 모듈·인버터·설치·금융 등 53종목 편입.' },
      { ticker: 'RAYS',  name: 'Global X Solar ETF',                      aum: '~$1억',   ter: '0.45%', desc: '글로벌 태양광 기업 집중. 중국·미국·유럽 태양광 제조사 포함.' },
    ],
  },
  {
    category: '풍력',
    color: '#10b981',
    items: [
      { ticker: 'FAN',   name: 'First Trust Global Wind Energy ETF',      aum: '~$3억',   ter: '0.60%', desc: '전 세계 풍력 터빈 제조·발전사. Vestas·Siemens Gamesa·Ørsted 등.' },
      { ticker: 'WNDY',  name: 'Global X Wind Energy ETF',                aum: '~$0.5억', ter: '0.50%', desc: '육상·해상풍력 기업 집중 편입. 풍력 밸류체인 전반 커버.' },
    ],
  },
  {
    category: '원자력 / SMR',
    color: '#60a5fa',
    items: [
      { ticker: 'URNM',  name: 'Sprott Uranium Miners ETF',               aum: '~$12억',  ter: '0.83%', desc: '우라늄 채굴·생산 기업 순수 편입. Cameco·NAC·Paladin 등. 우라늄 가격 레버리지.' },
      { ticker: 'URA',   name: 'Global X Uranium ETF',                    aum: '~$14억',  ter: '0.69%', desc: '우라늄 채굴+원전 장비 기업. 광산사 외 Cameco·원전 설계사도 포함.' },
      { ticker: 'NLR',   name: 'VanEck Uranium+Nuclear Energy ETF',       aum: '~$10억',  ter: '0.61%', desc: '원자력 발전 유틸리티+우라늄 채굴 혼합. Constellation·Cameco·도시바 등.' },
      { ticker: 'NUKZ',  name: 'Range Nuclear Renaissance Index ETF',     aum: '~$2억',   ter: '0.85%', desc: 'SMR·차세대 원전 특화. Oklo·NuScale·BWX Tech 등 신규 원전 기업 집중.' },
    ],
  },
  {
    category: '수소 / 연료전지',
    color: '#f43f5e',
    items: [
      { ticker: 'HYDR',  name: 'Global X Hydrogen ETF',                   aum: '~$1억',   ter: '0.50%', desc: '수소 생산·저장·운반·연료전지 기업. Plug Power·Ballard·Nel 등.' },
      { ticker: 'FCEL',  name: 'FuelCell Energy (개별주)',                 aum: '—',       ter: '—',     desc: 'ETF 아닌 개별주. 연료전지 순수 노출 원할 때 참고. 변동성 높음.' },
    ],
  },
  {
    category: '에너지 인프라 / 유틸리티',
    color: '#a78bfa',
    items: [
      { ticker: 'XLU',   name: 'Utilities Select Sector SPDR ETF',        aum: '~$170억', ter: '0.09%', desc: 'S&P500 유틸리티 섹터 전체. 전력·가스·수도. 저변동·배당 중심. AUM 최대.' },
      { ticker: 'VPU',   name: 'Vanguard Utilities ETF',                  aum: '~$70억',  ter: '0.10%', desc: '미국 유틸리티 전체 커버. XLU와 유사하나 더 넓은 종목 수. 저보수.' },
      { ticker: 'GRID',  name: 'First Trust NASDAQ Clean Edge Smart Grid ETF', aum: '~$6억', ter: '0.58%', desc: '스마트그리드·전력망 현대화 기업. AI 전력 수요 확대 수혜 직접 노출.' },
    ],
  },
];

function EtfPanel() {
  const [openCat, setOpenCat] = useState(null);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: '12px 14px',
      background: 'var(--card-bg)',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 2, letterSpacing: '0.05em' }}>
        📦 에너지 섹터 ETF
      </div>
      {ENERGY_ETFS.map(cat => {
        const isOpen = openCat === cat.category;
        return (
          <div key={cat.category}>
            {/* 카테고리 헤더 */}
            <button
              onClick={() => setOpenCat(isOpen ? null : cat.category)}
              style={{
                width: '100%', textAlign: 'left',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '7px 10px',
                borderRadius: 8,
                border: `1px solid ${isOpen ? cat.color : 'var(--border)'}`,
                background: isOpen ? `${cat.color}14` : 'var(--card-bg)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, color: isOpen ? cat.color : 'var(--text-secondary)' }}>
                {cat.category}
              </span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                {cat.items.length}개 {isOpen ? '▲' : '▼'}
              </span>
            </button>

            {/* ETF 카드 목록 */}
            {isOpen && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 6, marginTop: 6, paddingLeft: 4 }}>
                {cat.items.map(etf => (
                  <div key={etf.ticker} style={{
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    background: 'var(--card-bg)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 3 }}>
                      <span style={{
                        fontSize: 12, fontWeight: 800,
                        color: cat.color,
                        fontFamily: 'monospace',
                      }}>{etf.ticker}</span>
                      {etf.aum !== '—' && (
                        <span style={{ fontSize: 9, color: 'var(--text-muted)', background: '#1e293b', borderRadius: 4, padding: '1px 5px' }}>
                          AUM {etf.aum}
                        </span>
                      )}
                      {etf.ter !== '—' && (
                        <span style={{ fontSize: 9, color: 'var(--text-muted)', background: '#1e293b', borderRadius: 4, padding: '1px 5px' }}>
                          보수 {etf.ter}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 9.5, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 3 }}>
                      {etf.name}
                    </div>
                    <div style={{ fontSize: 9.5, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      {etf.desc}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
      <p style={{ fontSize: 8.5, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.5 }}>
        * AUM·보수율은 2025년 기준 추정치. 투자 전 운용사 공식 자료 확인 권장.
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   IEA Net Zero 시나리오 — 현재 vs 2030 vs 2050 전망
══════════════════════════════════════════════════════ */
const OUTLOOK_DATA = [
  { id: 'coal_gas',   label: '화석연료',    icon: '🏭', color: '#d97706', now: 61,  y2030: 37,  y2050: 8,   trend: 'down' },
  { id: 'hydro',      label: '수력',        icon: '💧', color: '#22d3ee', now: 15,  y2030: 16,  y2050: 17,  trend: 'flat' },
  { id: 'nuclear',    label: '원자력',      icon: '⚛️', color: '#60a5fa', now: 10,  y2030: 11,  y2050: 13,  trend: 'up'   },
  { id: 'wind',       label: '풍력',        icon: '🌬️', color: '#10b981', now: 7,   y2030: 16,  y2050: 24,  trend: 'up'   },
  { id: 'solar',      label: '태양광',      icon: '☀️', color: '#facc15', now: 5,   y2030: 14,  y2050: 22,  trend: 'up'   },
  { id: 'biomass',    label: '바이오매스',  icon: '🌿', color: '#22c55e', now: 2.3, y2030: 3,   y2050: 4,   trend: 'up'   },
  { id: 'geothermal', label: '지열',        icon: '🌋', color: '#f97316', now: 0.4, y2030: 0.8, y2050: 1.5, trend: 'up'   },
  { id: 'fuel_cell',  label: '연료전지/수소',icon: '⚡', color: '#f43f5e', now: 0.2, y2030: 1,   y2050: 6,   trend: 'up'   },
  { id: 'smr',        label: 'SMR',         icon: '🔋', color: '#818cf8', now: 0.1, y2030: 0.5, y2050: 3,   trend: 'up'   },
];

const TREND_ICON = { up: '▲', down: '▼', flat: '→' };
const TREND_COLOR = { up: '#10b981', down: '#f87171', flat: '#94a3b8' };

function OutlookPanel() {
  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: '12px 14px',
      background: 'var(--card-bg)',
      marginTop: 8,
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 10, letterSpacing: '0.04em' }}>
        🔭 IEA Net Zero 발전 비중 전망
      </div>

      {/* 컬럼 헤더 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 56px 56px 56px', gap: 4, marginBottom: 6, paddingBottom: 6, borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>에너지원</span>
        <span style={{ fontSize: 9, color: 'var(--text-muted)', textAlign: 'right' }}>현재</span>
        <span style={{ fontSize: 9, color: '#60a5fa', textAlign: 'right' }}>2030</span>
        <span style={{ fontSize: 9, color: '#a78bfa', textAlign: 'right' }}>2050</span>
      </div>

      {/* 데이터 행 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {OUTLOOK_DATA.map(row => {
          const maxVal = Math.max(row.now, row.y2030, row.y2050, 1);
          return (
            <div key={row.id}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 56px 56px 56px', gap: 4, alignItems: 'center', marginBottom: 2 }}>
                <span style={{ fontSize: 10, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>{row.icon}</span>
                  <span>{row.label}</span>
                  <span style={{ fontSize: 9, color: TREND_COLOR[row.trend], fontWeight: 700 }}>
                    {TREND_ICON[row.trend]}
                  </span>
                </span>
                <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-primary)', textAlign: 'right' }}>{row.now}%</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#60a5fa', textAlign: 'right' }}>{row.y2030}%</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#a78bfa', textAlign: 'right' }}>{row.y2050}%</span>
              </div>
              {/* 미니 진행 바 — 현재/2030/2050 3단 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 56px 56px 56px', gap: 4, alignItems: 'center' }}>
                <div style={{ height: 4, background: '#1e293b', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', height: '100%' }}>
                    <div style={{ width: `${(row.now / 61) * 100}%`, background: row.color, opacity: 0.9, borderRadius: 3, transition: 'width 0.4s' }} />
                  </div>
                </div>
                <div style={{ height: 4, background: '#1e293b', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min((row.y2030 / maxVal) * 100, 100)}%`, height: '100%', background: '#3b82f6', opacity: 0.8, borderRadius: 3 }} />
                </div>
                <div style={{ height: 4, background: '#1e293b', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min((row.y2050 / maxVal) * 100, 100)}%`, height: '100%', background: '#8b5cf6', opacity: 0.8, borderRadius: 3 }} />
                </div>
                {/* 빈 칸 (4번째 컬럼 자리 맞추기) */}
                <div />
              </div>
            </div>
          );
        })}
      </div>

      <p style={{ fontSize: 8.5, color: 'var(--text-muted)', marginTop: 10, lineHeight: 1.5 }}>
        출처: IEA World Energy Outlook 2024 · NZE 시나리오 기준 추정치.<br />
        현재 바는 화석연료(61%) 대비, 2030·2050 바는 각 항목 최대값 대비.
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   메인 에너지 대시보드
══════════════════════════════════════════════════════ */
export default function EnergyDashboard() {
  const [activeId, setActiveId] = useState(null);
  const toggle = id => setActiveId(prev => prev === id ? null : id);

  const activeType = ENERGY_TYPES.find(e => e.id === activeId) ?? null;

  return (
    <div>
      {/* 헤더 */}
      <div style={{ marginBottom: 14 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
          ⚡ 전 세계 에너지원별 발전 비중 & 메이저 기업
        </h2>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          IEA / BP Statistical Review 2024 기준 ·&nbsp;
          <span style={{ color: '#d97706' }}>화석연료 61%</span>
          &ensp;·&ensp;
          <span style={{ color: '#22d3ee' }}>수력 15%</span>
          &ensp;·&ensp;
          <span style={{ color: '#60a5fa' }}>원자력 10%</span>
          &ensp;·&ensp;
          <span style={{ color: '#10b981' }}>풍력 7%</span>
          &ensp;·&ensp;
          <span style={{ color: '#facc15' }}>태양광 5%</span>
          &ensp;·&ensp;기타 &lt;3%
        </p>
      </div>

      {/* 도넛 + 에너지원 목록 + ETF/전망 — 3컬럼 grid로 꽉 채움 */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 220px 1fr', gap: 20, alignItems: 'start' }}>
        {/* 1. 도넛 차트 */}
        <div>
          <DonutChart activeId={activeId} onSelect={toggle} />
        </div>
        {/* 2. 에너지원 선택 목록 */}
        <EnergyTypeList activeId={activeId} onSelect={toggle} />
        {/* 3. ETF + 전망 세로 적층 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <EtfPanel />
          <OutlookPanel />
        </div>
      </div>

      {/* 선택 안 됐을 때 힌트 */}
      {!activeId && (
        <p className="hint-text" style={{ marginTop: 20 }}>
          ⚡ 차트 섹터 또는 왼쪽 목록을 클릭하면 해당 에너지원의 메이저 기업을 확인할 수 있습니다
        </p>
      )}

      {/* 선택된 에너지원 기업 패널 */}
      {activeType && (
        <div style={{ marginTop: 28 }}>
          <EnergyCompanyPanel energyType={activeType} />
        </div>
      )}

    </div>
  );
}
