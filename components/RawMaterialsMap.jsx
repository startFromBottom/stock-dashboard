'use client';

import { useState, useMemo } from 'react';
import { MATERIALS, CONTINENTS, GROUPS } from '@/data/rawMaterials';
import { RAW_COMPANIES } from '@/data/rawMaterialCompanies';
import useMarketCaps from '@/hooks/useMarketCaps';
import useStockMetrics from '@/hooks/useStockMetrics';
import { extractPublicTickers, normalizeTicker, formatMktcap } from '@/lib/ticker-utils';

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

/* ═══════════════════════════════════════════════════════
   대륙 SVG 경로  Equirectangular 720×400
   x=(lon+180)/360*720   y=(90-lat)/180*400
   주요 기준 좌표:
     베이징    (593,111)  바이안오보 (580,107)
     서울      (614,116)  도쿄       (639,121)
     런던      (360, 86)  시드니     (662,275)
═══════════════════════════════════════════════════════ */
const CONTINENT_PATHS = {
  northAmerica: {
    labelX: 150, labelY: 126,
    path: `M 200,42 L 78,42 L 24,42 L 24,49 L 36,60
           L 30,67 L 36,67 L 88,71 L 100,78
           L 112,91 L 112,107 L 116,118 L 126,129
           L 140,138 L 148,149 L 168,164 L 176,169
           L 192,178 L 206,182 L 210,178
           L 200,144 L 208,122 L 212,111
           L 220,109 L 228,102 L 254,96
           L 238,56 L 210,67 L 196,78
           L 188,56 L 200,42 Z`,
  },
  southAmerica: {
    labelX: 236, labelY: 262,
    path: `M 218,173 L 234,176 L 240,182 L 256,189
           L 260,196 L 290,211 L 290,218 L 286,222
           L 282,233 L 278,249 L 262,262 L 256,273
           L 246,284 L 234,293 L 224,311 L 222,316
           L 230,322 L 212,311 L 210,298 L 214,289
           L 216,278 L 218,262 L 220,244
           L 210,233 L 204,222 L 198,211 L 200,200
           L 206,189 L 206,182 L 210,178 L 218,173 Z`,
  },
  europe: {
    labelX: 370, labelY: 80,
    /* 런던(360,86)·파리(362,84)·스톡홀름(392,69) 등 포함
       유럽은 서쪽 끝(이베리아)~동쪽 끝(우랄, lon≈60) */
    path: `M 342,120 L 350,120 L 360,116 L 360,111
           L 368,107 L 374,104 L 380,98 L 388,102
           L 398,111 L 404,120 L 412,111 L 416,109
           L 416,102 L 420,98 L 440,96 L 460,84
           L 472,71 L 470,62 L 470,49 L 460,44
           L 412,42 L 400,44 L 388,56
           L 372,62 L 370,67 L 376,71
           L 376,82 L 368,82 L 366,87
           L 370,104 L 356,102 L 344,102
           L 342,104 L 342,120 Z`,
  },
  africa: {
    labelX: 390, labelY: 213,
    path: `M 380,118 L 382,122 L 426,133 L 434,151
           L 448,173 L 462,176 L 460,182 L 444,196
           L 440,211 L 440,227 L 430,240 L 430,249
           L 426,258 L 422,267 L 412,276 L 400,278
           L 396,276 L 394,262 L 388,249 L 382,238
           L 384,227 L 384,213 L 378,196 L 364,189
           L 356,182 L 330,178 L 326,169 L 328,160
           L 324,151 L 340,133 L 346,124 L 380,118 Z`,
  },
  asia: {
    labelX: 555, labelY: 104,
    /* 서쪽(터키 lon≈26) ~ 동쪽(캄차카 lon≈170)
       남쪽(말레이반도 lat≈2) ~ 북쪽(시베리아 lat≈71)
       중국 동해안: 광저우(22,114) 상하이(28,121) 베이징(39,122)
       한반도 위치: 서울(614,116) → ISLAND_PATHS 에 별도 표시
       일본 위치: 도쿄(639,121) → ISLAND_PATHS 에 별도 표시  */
    path: `M 412,111 L 432,107 L 440,102 L 462,96
           L 460,84 L 460,78 L 470,62 L 486,49
           L 480,42 L 560,42 L 640,42 L 680,42
           L 706,49 L 706,60 L 686,67 L 680,78
           L 642,84 L 630,93 L 622,107
           L 618,116 L 616,124 L 610,129
           L 602,138 L 602,144 L 594,151
           L 582,158 L 574,169 L 566,182
           L 566,196 L 556,196 L 546,187
           L 536,160 L 524,160 L 518,171
           L 514,182 L 506,171 L 502,151
           L 492,151 L 480,144 L 476,144
           L 462,160 L 448,173 L 446,176
           L 434,151 L 428,133
           L 430,120 L 416,120
           L 412,116 L 412,111 Z`,
  },
  oceania: {
    labelX: 627, labelY: 260,
    path: `M 588,249 L 588,258 L 590,267 L 590,276
           L 602,271 L 608,276 L 620,276 L 632,276
           L 640,280 L 644,284 L 656,289
           L 654,284 L 662,276 L 666,267
           L 666,258 L 660,249 L 652,240
           L 646,227 L 644,222 L 632,222
           L 620,227 L 612,231 L 604,240
           L 588,249 Z`,
  },
};

/* ═══════════════════════════════════════════════════════
   섬·반도 폴리곤 — 장식용 (hover 없음)
   크기를 실제 비례에 맞게 약간 과장해서 가시성 확보
═══════════════════════════════════════════════════════ */
const ISLAND_PATHS = [
  // ── 그린란드
  { d: `M 228,31 L 276,18 L 312,16 L 324,22 L 322,31 L 314,40 L 304,49 L 282,56 L 270,67 L 262,67 L 254,58 L 252,53 L 254,44 L 244,36 L 228,31 Z` },
  // ── 영국 (브리튼 섬) — 런던(360,86) 포함
  { d: `M 348,89 L 348,69 L 356,67 L 360,71 L 360,80 L 356,87 L 352,91 L 348,89 Z` },
  // ── 아이슬란드
  { d: `M 310,60 L 314,53 L 330,51 L 336,56 L 326,62 L 310,62 L 310,60 Z` },
  // ── 한반도 — 서울(614,116) 포함
  { d: `M 610,113 L 618,113 L 622,118 L 620,124 L 616,129 L 610,127 L 608,122 L 610,116 L 610,113 Z` },
  // ── 일본 혼슈 — 도쿄(639,121) 포함
  { d: `M 630,127 L 626,124 L 626,120 L 630,116 L 636,113 L 640,111 L 644,107 L 648,104 L 654,102 L 654,107 L 650,111 L 646,116 L 642,120 L 638,124 L 634,129 L 630,129 L 630,127 Z` },
  // ── 일본 홋카이도
  { d: `M 638,102 L 646,98 L 654,100 L 654,107 L 648,109 L 640,107 L 638,102 Z` },
  // ── 일본 규슈
  { d: `M 620,127 L 626,124 L 630,127 L 630,131 L 626,133 L 620,131 L 620,127 Z` },
  // ── 대만 — (604,144) 포함
  { d: `M 600,142 L 606,140 L 608,147 L 606,151 L 602,149 L 600,144 L 600,142 Z` },
  // ── 스리랑카
  { d: `M 518,178 L 522,176 L 524,182 L 522,187 L 518,184 L 518,178 Z` },
  // ── 마다가스카르
  { d: `M 460,224 L 464,218 L 470,220 L 472,231 L 468,244 L 462,249 L 458,242 L 460,229 L 460,224 Z` },
  // ── 수마트라
  { d: `M 550,191 L 558,187 L 568,196 L 570,207 L 564,213 L 554,207 L 548,198 L 550,191 Z` },
  // ── 자바
  { d: `M 568,213 L 578,211 L 586,213 L 586,218 L 576,220 L 566,218 L 566,213 L 568,213 Z` },
  // ── 보르네오
  { d: `M 576,196 L 590,191 L 598,196 L 600,209 L 594,218 L 578,218 L 570,209 L 576,196 Z` },
  // ── 필리핀 루손
  { d: `M 598,156 L 606,153 L 614,156 L 614,164 L 608,171 L 600,169 L 598,160 L 598,156 Z` },
  // ── 뉴기니
  { d: `M 622,198 L 642,196 L 660,200 L 662,211 L 654,218 L 636,218 L 622,211 L 622,198 Z` },
  // ── 뉴질랜드 북섬
  { d: `M 702,276 L 710,276 L 714,284 L 710,291 L 704,291 L 700,284 L 702,276 Z` },
  // ── 뉴질랜드 남섬
  { d: `M 700,291 L 710,291 L 710,300 L 704,307 L 696,304 L 696,296 L 700,291 Z` },
  // ── 쿠바
  { d: `M 202,178 L 214,176 L 220,178 L 218,182 L 208,182 L 202,180 L 202,178 Z` },
];

const RANK_LABELS = ['🥇 1위', '🥈 2위', '🥉 3위', '4위', '5위', '6위', '7위', '8위', '9위', '10위'];

/* ── 세계 지도 SVG (광산 마커 포함) ── */
function WorldMap({ mat, hoveredContinent, onHoverContinent, hoveredCompany, companies }) {
  const [tooltipMine, setTooltipMine] = useState(null);

  const getColor = (contId) => {
    if (!mat) return '#1e293b';
    const pct = mat.continents[contId]?.pct ?? 0;
    if (hoveredContinent === contId) return mat.color;
    if (pct === 0) return '#111827';
    const alpha = 0.12 + (pct / 100) * 0.78;
    return mat.color + Math.round(alpha * 255).toString(16).padStart(2, '0');
  };

  // hover된 기업의 광산만 표시, 없으면 전체 표시
  const visibleMines = useMemo(() => {
    if (!companies) return [];
    if (hoveredCompany) {
      const co = companies.find(c => c.rank === hoveredCompany);
      return co ? co.mines.map(m => ({ ...m, companyRank: co.rank, companyName: co.name, color: mat?.color ?? '#fbbf24' })) : [];
    }
    // 전체 기업 광산 (중복 좌표 대략 처리)
    return companies.flatMap(co =>
      co.mines.map(m => ({ ...m, companyRank: co.rank, companyName: co.name, color: mat?.color ?? '#fbbf24' }))
    );
  }, [companies, hoveredCompany, mat]);

  return (
    <div style={{ position: 'relative' }}>
      <svg viewBox="0 0 720 400" xmlns="http://www.w3.org/2000/svg" className="raw-map-svg">
        <rect width="720" height="400" fill="#080f1f" rx="12" />
        {Array.from({ length: 13 }).map((_, i) => (
          <line key={`v${i}`} x1={i*60} y1="0" x2={i*60} y2="400" stroke="#0f2040" strokeWidth="0.5" />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i*60} x2="720" y2={i*60} stroke="#0f2040" strokeWidth="0.5" />
        ))}
        <line x1="0" y1="200" x2="720" y2="200" stroke="#1e3a5f" strokeWidth="1" strokeDasharray="4 4" />
        <text x="8" y="196" fill="#1e4a6e" fontSize="8" fontFamily="monospace">equator</text>

        {/* 장식용: 섬·반도·그린란드 (일본·한국·대만·영국 등) */}
        {ISLAND_PATHS.map((ip, i) => (
          <path key={`island-${i}`} d={ip.d}
            fill={mat ? mat.color + '44' : '#1e2d45'}
            stroke="#334155" strokeWidth="0.7"
            style={{ pointerEvents: 'none' }}
          />
        ))}

        {/* 인터랙티브 대륙 */}
        {Object.entries(CONTINENT_PATHS).map(([id, { path, labelX, labelY }]) => {
          const pct = mat?.continents[id]?.pct ?? 0;
          const isHov = hoveredContinent === id;
          return (
            <g key={id} onMouseEnter={() => onHoverContinent(id)} onMouseLeave={() => onHoverContinent(null)} style={{ cursor: 'pointer' }}>
              <path d={path} fill={getColor(id)}
                stroke={isHov ? (mat?.color ?? '#475569') : '#334155'}
                strokeWidth={isHov ? 2 : 1}
                style={{ transition: 'all 0.2s', filter: isHov ? `drop-shadow(0 0 10px ${mat?.color ?? '#fff'}99)` : 'none' }}
              />
              <text x={labelX} y={labelY-7} fill={isHov ? '#fff' : '#94a3b8'} fontSize="9" fontWeight="700"
                textAnchor="middle" style={{ pointerEvents: 'none', transition: 'fill 0.2s' }}>
                {CONTINENTS[id]?.label}
              </text>
              {mat && (
                <text x={labelX} y={labelY+8}
                  fill={isHov ? mat.color : (pct >= 20 ? mat.color : pct >= 5 ? '#94a3b8' : '#475569')}
                  fontSize={isHov ? '13' : '11'} fontWeight="800" textAnchor="middle"
                  style={{ pointerEvents: 'none', transition: 'all 0.2s' }}>
                  {pct > 0 ? `${pct}%` : '—'}
                </text>
              )}
            </g>
          );
        })}

        {/* 광산 마커 */}
        {visibleMines.map((mine, i) => {
          const isHovered = tooltipMine === i;
          const isHighlight = hoveredCompany === mine.companyRank;
          const r = isHighlight ? 6 : 4;
          return (
            <g key={i}
              onMouseEnter={() => setTooltipMine(i)}
              onMouseLeave={() => setTooltipMine(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* pulse 링 */}
              {isHighlight && (
                <circle cx={mine.x} cy={mine.y} r={r + 5} fill="none"
                  stroke={mine.color} strokeWidth="1.5" opacity="0.5"
                  style={{ animation: 'pulse 1.5s infinite' }} />
              )}
              <circle cx={mine.x} cy={mine.y} r={r}
                fill={mine.color} stroke="#080f1f" strokeWidth="1.5"
                opacity={isHighlight ? 1 : 0.7}
                style={{ transition: 'all 0.2s' }}
              />
              {/* 핀 스템 */}
              <line x1={mine.x} y1={mine.y + r} x2={mine.x} y2={mine.y + r + 4}
                stroke={mine.color} strokeWidth="1" opacity="0.6" />

              {/* 인라인 툴팁 */}
              {isHovered && (
                <g>
                  <rect x={mine.x - 70} y={mine.y - 52} width="140" height={mine.elements?.length > 0 ? 48 : 34} rx="5"
                    fill="#0f172a" stroke={mine.color} strokeWidth="1" />
                  <text x={mine.x} y={mine.y - 36} fill="#f1f5f9" fontSize="9" fontWeight="700"
                    textAnchor="middle" style={{ pointerEvents: 'none' }}>
                    {mine.name}
                  </text>
                  <text x={mine.x} y={mine.y - 24} fill="#94a3b8" fontSize="7.5"
                    textAnchor="middle" style={{ pointerEvents: 'none' }}>
                    {mine.country} · {mine.companyName}
                  </text>
                  {mine.elements?.length > 0 && (
                    <text x={mine.x} y={mine.y - 12} fill={mine.color} fontSize="7.5" fontWeight="700"
                      textAnchor="middle" style={{ pointerEvents: 'none' }}>
                      {mine.elements.join(' · ')}
                    </text>
                  )}
                </g>
              )}
            </g>
          );
        })}

        {/* 범례 */}
        {mat && (
          <g>
            <rect x="8" y="356" width="155" height="36" rx="6" fill="#0d1929" stroke="#1e293b" />
            <text x="14" y="370" fill="#64748b" fontSize="8">매장량 비율 (색상 강도)</text>
            {[0.12, 0.3, 0.5, 0.7, 0.9].map((a, i) => (
              <rect key={i} x={14+i*24} y="375" width="20" height="8" rx="2"
                fill={mat.color + Math.round(a*255).toString(16).padStart(2,'0')} />
            ))}
            <text x="14"  y="396" fill="#475569" fontSize="7">낮음</text>
            <text x="122" y="396" fill="#475569" fontSize="7">높음</text>
          </g>
        )}
        {/* 광산 마커 범례 */}
        {companies && companies.length > 0 && (
          <g>
            <circle cx="178" cy="380" r="4" fill={mat?.color ?? '#fbbf24'} stroke="#080f1f" strokeWidth="1" />
            <text x="186" y="384" fill="#64748b" fontSize="8">주요 광산</text>
          </g>
        )}
        <text x="712" y="395" fill="#1e3a5f" fontSize="7" textAnchor="end">USGS 2024 · Bloomberg</text>
      </svg>
    </div>
  );
}

/* ── 대륙 hover 상세 ── */
function ContinentDetail({ contId, mat }) {
  if (!contId || !mat) return null;
  const cont = CONTINENTS[contId];
  const data = mat.continents[contId];
  if (!data) return null;
  return (
    <div className="raw-continent-detail" style={{ borderColor: mat.color + '66' }}>
      <div className="raw-detail-header">
        <span style={{ fontSize: 22 }}>{cont.emoji}</span>
        <div style={{ flex: 1 }}>
          <div className="raw-detail-name">{cont.label}</div>
          <div className="raw-detail-note">{data.note}</div>
        </div>
        <div className="raw-detail-pct" style={{ color: mat.color }}>{data.pct}%</div>
      </div>
      <div className="raw-detail-countries">
        {data.countries.map((c, i) => (
          <span key={i} className="raw-country-chip"
            style={{ borderColor: mat.color+'55', color: mat.color, background: mat.colorDark+'55' }}>
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── 사이드 순위 리스트 ── */
function RankList({ mat, hovered, onHover }) {
  if (!mat) return null;
  return (
    <div className="raw-rank-list">
      {Object.entries(mat.continents).sort((a,b) => b[1].pct - a[1].pct).map(([contId, data], idx) => {
        const cont = CONTINENTS[contId];
        const isHov = hovered === contId;
        return (
          <div key={contId}
            className={`raw-rank-item${isHov ? ' hovered' : ''}`}
            style={isHov ? { borderColor: mat.color+'88', background: mat.colorDark+'bb' } : {}}
            onMouseEnter={() => onHover(contId)} onMouseLeave={() => onHover(null)}
          >
            <span className="raw-rank-num" style={{ color: idx < 3 ? mat.color : '#475569' }}>#{idx+1}</span>
            <span className="raw-rank-emoji">{cont.emoji}</span>
            <span className="raw-rank-label">{cont.label}</span>
            <div className="raw-rank-bar-wrap">
              <div className="raw-rank-bar" style={{ width: `${data.pct}%`, background: mat.color+(isHov?'ff':'88') }} />
            </div>
            <span className="raw-rank-pct" style={{ color: isHov ? mat.color : '#94a3b8' }}>{data.pct}%</span>
          </div>
        );
      })}
    </div>
  );
}

/* ── 기업 패널 ── */
function CompanySection({ matId, mat }) {
  const [hoveredRank, setHoveredRank] = useState(null);
  const companies = RAW_COMPANIES[matId] ?? [];

  const tickers = useMemo(() => extractPublicTickers(companies), [matId]); // eslint-disable-line
  const { mktcaps, loading, error, fresh } = useMarketCaps(tickers);
  const { metrics: stockMetrics, loading: metricsLoading } = useStockMetrics(tickers);

  const sorted = useMemo(() => {
    if (!companies.length) return [];
    const withLive = companies.map(c => {
      const t = normalizeTicker(c.ticker);
      const liveCap = t ? mktcaps[t] : undefined;
      return { ...c, liveCap };
    });
    if (!Object.keys(mktcaps).length) return withLive;
    return [...withLive].sort((a, b) => {
      if (a.liveCap && b.liveCap) return b.liveCap - a.liveCap;
      if (a.liveCap) return -1;
      if (b.liveCap) return 1;
      return a.rank - b.rank;
    });
  }, [companies, mktcaps]); // eslint-disable-line

  if (!sorted.length) return (
    <div className="raw-companies-empty">
      <p>해당 광물의 기업 데이터를 준비 중입니다.</p>
    </div>
  );

  return (
    <div className="raw-companies-section">
      <div className="raw-companies-header">
        <div className="raw-companies-title">
          <span>{mat?.icon}</span>
          <span>{mat?.label} — 시가총액 Top 기업</span>
        </div>
        <div className="raw-companies-badges">
          {fresh && <span className="live-badge">● LIVE</span>}
          {loading && <span className="live-badge loading-badge">⟳ 로딩 중…</span>}
          {error && <span className="live-badge error-badge">⚠ 정적 데이터</span>}
          <span className="raw-mine-hint">💡 기업 카드에 커서를 올리면 광산 위치가 지도에 표시됩니다</span>
        </div>
      </div>

      <div className="raw-companies-grid">
        {sorted.map((co, idx) => {
          const rank = idx + 1;
          const liveMktcap = co.liveCap ? formatMktcap(co.liveCap) : null;
          const isHov = hoveredRank === co.rank;
          const fmpTicker = normalizeTicker(co.ticker);
          const sm = fmpTicker ? stockMetrics[fmpTicker] : null;
          const rsiStyle = getRsiStyle(sm?.rsi ?? null);
          const volStr   = formatVolume(sm?.volume ?? null);
          return (
            <div key={co.rank}
              className={`raw-company-card${isHov ? ' hovered' : ''}`}
              style={isHov ? { borderColor: mat?.color ?? '#fbbf24', boxShadow: `0 0 0 2px ${mat?.color ?? '#fbbf24'}33` } : {}}
              onMouseEnter={() => setHoveredRank(co.rank)}
              onMouseLeave={() => setHoveredRank(null)}
            >
              <span className={`rank-badge rank-${Math.min(rank, 10)}`}>
                {RANK_LABELS[rank - 1] ?? `${rank}위`}
              </span>
              <div className="company-name">
                <span className="company-flag">{co.flag}</span>
                {co.name}
              </div>
              <div className="company-ticker">{co.ticker}</div>
              <div className="company-mktcap" style={{ color: mat?.color ?? 'var(--accent-light)' }}>
                {liveMktcap ? <>{liveMktcap}<span className="mktcap-live-dot">●</span></> : co.mktcap}
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
              {/* 광산 목록 */}
              {co.mines && co.mines.length > 0 && (
                <div className="raw-mine-list">
                  {co.mines.map((m, mi) => (
                    <span key={mi} className="raw-mine-chip" style={{ borderColor: mat?.color+'33', color: mat?.color }}>
                      📍 {m.name}
                      <span className="raw-mine-country">{m.country}</span>
                    </span>
                  ))}
                </div>
              )}
              <div className="company-links" style={{ marginTop: 8 }}>
                <a href={co.ir}   target="_blank" rel="noopener noreferrer" className="link-btn">📊 IR</a>
                <a href={co.news} target="_blank" rel="noopener noreferrer" className="link-btn">📰 뉴스</a>
                <a href={co.x}    target="_blank" rel="noopener noreferrer" className="link-btn">𝕏 X</a>
              </div>
            </div>
          );
        })}
      </div>

      {/* 지도에 마커 표시용 hidden state 올리기 — WorldMap과 공유 */}
      {/* hoveredRank를 부모로 올려서 지도와 연동 */}
      <div style={{ display: 'none' }} data-hovered-rank={hoveredRank} />
    </div>
  );
}

/* ── 지도 + 기업 패널 통합 (상태 공유) ── */
function MapAndCompanies({ mat, matId }) {
  const [hoveredContinent, setHoveredContinent] = useState(null);
  const [hoveredCompany,   setHoveredCompany]   = useState(null);

  const companies = RAW_COMPANIES[matId] ?? [];

  const tickers = useMemo(() => extractPublicTickers(companies), [matId]); // eslint-disable-line
  const { mktcaps, loading, error, fresh } = useMarketCaps(tickers);
  const { metrics: stockMetrics, loading: metricsLoading } = useStockMetrics(tickers);

  // 정렬: staticRank가 있는 기업(중국 국영 등 API 미지원)은 순서 고정,
  // liveCap이 있는 기업끼리는 시총 내림차순, 나머지는 rank 순
  const sorted = useMemo(() => {
    if (!companies.length) return [];
    const withLive = companies.map(c => {
      const t = normalizeTicker(c.ticker);
      return { ...c, liveCap: t ? mktcaps[t] : undefined };
    });
    if (!Object.keys(mktcaps).length) return withLive;
    return [...withLive].sort((a, b) => {
      // staticRank 고정된 것(중국 국영 등)은 항상 앞, 서로 간엔 staticRank 순
      const aStatic = a.staticRank != null;
      const bStatic = b.staticRank != null;
      if (aStatic && bStatic) return a.staticRank - b.staticRank;
      if (aStatic) return -1;
      if (bStatic) return 1;
      // 둘 다 라이브 가능한 경우 시총 내림차순
      if (a.liveCap && b.liveCap) return b.liveCap - a.liveCap;
      if (a.liveCap) return -1;
      if (b.liveCap) return 1;
      return a.rank - b.rank;
    });
  }, [companies, mktcaps]); // eslint-disable-line

  const hasChinaOnly = sorted.some(co => co.staticRank != null);

  return (
    <>
      {/* ── 지도 + 사이드 ── */}
      <div className="raw-body">
        <div className="raw-map-wrap">
          <WorldMap
            mat={mat}
            hoveredContinent={hoveredContinent}
            onHoverContinent={setHoveredContinent}
            hoveredCompany={hoveredCompany}
            companies={sorted}
          />
        </div>
        <div className="raw-side">
          <div className="raw-side-title">대륙별 매장량 순위</div>
          <RankList mat={mat} hovered={hoveredContinent} onHover={setHoveredContinent} />
          {hoveredContinent
            ? <ContinentDetail contId={hoveredContinent} mat={mat} />
            : <div className="raw-hover-hint">🗺️ 지도 위 대륙을 hover하면<br />국가별 세부 비중을 확인할 수 있어요</div>
          }
        </div>
      </div>

      {/* ── 기업 패널 ── */}
      {sorted.length > 0 && (
        <div className="raw-companies-section">
          <div className="raw-companies-header">
            <div className="raw-companies-title">
              <span>{mat?.icon}</span>
              <span>{mat?.label} — 시가총액 Top 기업</span>
            </div>
            <div className="raw-companies-badges">
              {fresh   && <span className="live-badge">● LIVE</span>}
              {loading && <span className="live-badge loading-badge">⟳ 로딩 중…</span>}
              {error   && <span className="live-badge error-badge">⚠ 정적 데이터</span>}
              {hasChinaOnly && (
                <span className="raw-china-note">
                  ⚠ 중국 A주(SS/SZ)는 FMP API 미지원 → 시총 하드코딩 · 순위 고정
                </span>
              )}
              <span className="raw-mine-hint">💡 기업 카드에 커서를 올리면 광산 위치가 지도에 표시됩니다</span>
            </div>
          </div>

          <div className="raw-companies-grid">
            {sorted.map((co, idx) => {
              const rank = idx + 1;
              const liveMktcap = co.liveCap ? formatMktcap(co.liveCap) : null;
              const isHov = hoveredCompany === co.rank;
              const isStatic = co.staticRank != null;
              return (
                <div key={co.rank}
                  className={`raw-company-card${isHov ? ' hovered' : ''}${isStatic ? ' static-rank' : ''}`}
                  style={isHov ? { borderColor: mat?.color, boxShadow: `0 0 0 2px ${mat?.color}33` } : {}}
                  onMouseEnter={() => setHoveredCompany(co.rank)}
                  onMouseLeave={() => setHoveredCompany(null)}
                >
                  {/* 순위 배지 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 7 }}>
                    <span className={`rank-badge rank-${Math.min(rank,10)}`}>
                      {RANK_LABELS[rank-1] ?? `${rank}위`}
                    </span>
                    {isStatic && (
                      <span className="raw-static-badge">📌 고정</span>
                    )}
                  </div>

                  <div className="company-name">
                    <span className="company-flag">{co.flag}</span>
                    {co.name}
                  </div>
                  <div className="company-ticker">{co.ticker}</div>

                  {/* API 미지원 안내 */}
                  {co.note && (
                    <div className="raw-api-note">{co.note}</div>
                  )}

                  <div className="company-mktcap" style={{ color: mat?.color ?? 'var(--accent-light)' }}>
                    {liveMktcap
                      ? <>{liveMktcap}<span className="mktcap-live-dot">●</span></>
                      : co.mktcap
                    }
                  </div>
                  {(() => {
                    const fmpTicker = normalizeTicker(co.ticker);
                    const sm = fmpTicker ? stockMetrics[fmpTicker] : null;
                    const rsiStyle = getRsiStyle(sm?.rsi ?? null);
                    const volStr   = formatVolume(sm?.volume ?? null);
                    return (
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
                    );
                  })()}
                  <div className="company-detail">{co.detail}</div>

                  {/* 광산 목록 + 원소 태그 */}
                  {co.mines?.length > 0 && (
                    <div className="raw-mine-list">
                      {co.mines.map((m, mi) => (
                        <div key={mi} className="raw-mine-item">
                          <span className="raw-mine-chip"
                            style={{ borderColor: (mat?.color ?? '#fbbf24')+'44', color: mat?.color ?? '#fbbf24' }}>
                            📍 {m.name}
                            <span className="raw-mine-country">{m.country}</span>
                          </span>
                          {m.elements?.length > 0 && (
                            <div className="raw-element-tags">
                              {m.elements.map(el => (
                                <span key={el} className="raw-element-tag"
                                  style={{
                                    borderColor: (mat?.color ?? '#a78bfa') + '66',
                                    color: mat?.color ?? '#a78bfa',
                                    background: (mat?.colorDark ?? '#1e1b4b') + 'aa',
                                  }}>
                                  {el}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="company-links" style={{ marginTop: 8 }}>
                    <a href={co.ir}   target="_blank" rel="noopener noreferrer" className="link-btn">📊 IR</a>
                    <a href={co.news} target="_blank" rel="noopener noreferrer" className="link-btn">📰 뉴스</a>
                    <a href={co.x}    target="_blank" rel="noopener noreferrer" className="link-btn">𝕏 X</a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

/* ════ 메인 ════ */
export default function RawMaterialsMap() {
  const [activeGroup, setActiveGroup] = useState('rare-earth');
  const [activeMat,   setActiveMat]   = useState('neodymium');

  const groupMaterials = MATERIALS.filter(m => m.group === activeGroup);
  const mat = MATERIALS.find(m => m.id === activeMat) ?? groupMaterials[0];

  const handleGroupChange = (gid) => {
    setActiveGroup(gid);
    const first = MATERIALS.find(m => m.group === gid);
    if (first) setActiveMat(first.id);
  };

  return (
    <div className="raw-wrap">
      <div className="raw-header">
        <h2 className="raw-title">🌍 전세계 원자재 매장량 분포</h2>
        <p className="raw-subtitle">대륙을 hover하면 세부 국가별 비중 · 기업 카드를 hover하면 광산 위치가 지도에 표시됩니다 · USGS 2024</p>
      </div>

      {/* 1단계: 그룹 탭 */}
      <div className="raw-group-tabs">
        {GROUPS.map(g => {
          const isActive = activeGroup === g.id;
          const firstMat = MATERIALS.find(m => m.group === g.id);
          return (
            <button key={g.id}
              className={`raw-group-btn${isActive ? ' active' : ''}`}
              style={isActive && firstMat ? { borderColor: firstMat.color, color: firstMat.color, background: firstMat.colorDark, boxShadow: `0 0 0 2px ${firstMat.color}33` } : {}}
              onClick={() => handleGroupChange(g.id)}
            >
              <span>{g.icon}</span>
              <div className="raw-group-btn-text">
                <span className="raw-group-btn-label">{g.label}</span>
                <span className="raw-group-btn-desc">{g.desc}</span>
              </div>
              <span className="raw-group-count">{MATERIALS.filter(m => m.group === g.id).length}</span>
            </button>
          );
        })}
      </div>

      {/* 2단계: 세부 원소 탭 */}
      <div className="raw-mat-tabs">
        {groupMaterials.map(m => {
          const isActive = activeMat === m.id;
          return (
            <button key={m.id}
              className={`raw-mat-btn${isActive ? ' active' : ''}`}
              style={isActive ? { borderColor: m.color, color: m.color, background: m.colorDark, boxShadow: `0 0 0 2px ${m.color}33` } : {}}
              onClick={() => setActiveMat(m.id)}
            >
              <span className="raw-mat-icon">{m.icon}</span>
              <div>
                <div className="raw-mat-btn-name">{m.label}</div>
                {m.type && <div className={`raw-mat-type-badge ${m.type === 'HREE' ? 'hree' : 'lree'}`}>{m.type}</div>}
              </div>
            </button>
          );
        })}
      </div>

      {/* 원자재 정보 바 */}
      {mat && (
        <div className="raw-mat-info" style={{ borderColor: mat.color+'55', borderLeftColor: mat.color }}>
          <div className="raw-mat-info-left">
            <span className="raw-mat-info-icon">{mat.icon}</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                <div className="raw-mat-info-label" style={{ color: mat.color }}>{mat.label}</div>
                {mat.atomicNum && <span className="raw-atomic-badge">원자번호 {mat.atomicNum}</span>}
                {mat.type && (
                  <span className={`raw-mat-type-badge ${mat.type === 'HREE' ? 'hree' : 'lree'}`} style={{ fontSize: 10 }}>
                    {mat.type === 'HREE' ? '중희토류' : '경희토류'}
                  </span>
                )}
              </div>
              <div className="raw-mat-info-desc">{mat.description}</div>
              <div className="raw-total-note" style={{ marginTop: 4 }}>전세계 확인매장량 · {mat.totalWorld}</div>
            </div>
          </div>
          <div className="raw-mat-info-right">
            <div className="raw-hot-badge">🔥 HOT</div>
            <div className="raw-hot-note">{mat.hotNote}</div>
          </div>
        </div>
      )}

      {/* 지도 + 사이드 + 기업 패널 통합 */}
      <MapAndCompanies key={activeMat} mat={mat} matId={activeMat} />
    </div>
  );
}
