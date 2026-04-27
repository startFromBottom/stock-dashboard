'use client';

import { useMemo, useState } from 'react';
import useSectorOverview from '@/hooks/useSectorOverview';
import { SECTOR_ETFS } from '@/data/etfs';
import SectorHeatmap from './SectorHeatmap';

/* ── 섹터 메타 ── */
const SECTORS = [
  { id: 'ai-dc',   label: 'AI 데이터센터', icon: '🏢' },
  { id: 'semi',    label: '반도체',         icon: '🔬' },
  { id: 'space',   label: '우주',           icon: '🚀' },
  { id: 'raw',     label: '원자재',         icon: '⛏️' },
  { id: 'energy',  label: '에너지',         icon: '⚡' },
  { id: 'biotech', label: '바이오테크',     icon: '🧬' },
  { id: 'fintech', label: '핀테크',         icon: '💳' },
];

const TIMEFRAMES = [
  { id: '1D',  label: '1일' },
  { id: '5D',  label: '5일' },
  { id: 'MTD', label: 'MTD' },
  { id: '3M',  label: '3개월' },
  { id: 'YTD', label: 'YTD' },
  { id: '1Y',  label: '1년' },
];

/* ── 모멘텀 신호 ── */
function getMomentum(pct3M) {
  if (pct3M === null || pct3M === undefined) return { icon: '—', label: '—', tone: 'neutral' };
  if (pct3M >= 20)  return { icon: '🔥', label: '강세',     tone: 'hot' };
  if (pct3M >= 5)   return { icon: '📈', label: '상승',     tone: 'up' };
  if (pct3M >= -5)  return { icon: '➡️', label: '보합',     tone: 'flat' };
  if (pct3M >= -20) return { icon: '📉', label: '하락',     tone: 'down' };
  return { icon: '❄️', label: '약세', tone: 'cold' };
}

/* ── 밸류에이션 절대값 분류 ── */
function getValuation(pe) {
  if (pe === null || pe === undefined) return { label: '—', position: 50, tone: 'neutral' };
  // 0~60 범위로 매핑 (PER 60 이상은 거품권으로 우측 끝)
  const position = Math.min(100, Math.max(0, (pe / 60) * 100));
  if (pe < 15)   return { label: '저평가',    position, tone: 'cheap' };
  if (pe < 25)   return { label: '적정',      position, tone: 'fair' };
  if (pe < 40)   return { label: '고평가',    position, tone: 'rich' };
  return { label: '거품권', position, tone: 'bubble' };
}

/* ── 거래 활성도 ── */
function getActivity(ratio) {
  if (ratio === null || ratio === undefined) return { label: '—', tone: 'neutral' };
  if (ratio >= 1.3) return { label: '활발', tone: 'hot' };
  if (ratio >= 1.0) return { label: '보통', tone: 'up' };
  if (ratio >= 0.7) return { label: '둔화', tone: 'flat' };
  return { label: '저조', tone: 'cold' };
}

/* ── 변동성 분류 ── */
function getVolTone(volPct) {
  if (volPct === null || volPct === undefined) return 'neutral';
  if (volPct < 1.5) return 'low';
  if (volPct < 2.5) return 'mid';
  return 'high';
}

/* ── 52주 가격 위치 바 ── */
function Range52WBar({ position, low, high, price }) {
  if (position === null || position === undefined) return null;
  // 색: 위치 0~33 그린(저점부근) / 33~66 옐로우 / 66~100 오렌지~레드
  const tone =
    position < 33 ? '#4ade80' :
    position < 66 ? '#facc15' :
    position < 90 ? '#fb923c' : '#f87171';
  const fmt = (n) => n ? `$${n.toFixed(0)}` : '—';
  return (
    <div
      className="ov-range52w"
      title={`52주 범위: ${fmt(low)} ~ ${fmt(high)} · 현재 ${fmt(price)} · 위치 ${position}%`}
    >
      <div className="ov-range52w-track">
        <div
          className="ov-range52w-marker"
          style={{ left: `${position}%`, background: tone, boxShadow: `0 0 6px ${tone}` }}
        />
      </div>
      <span className="ov-range52w-label">{position}%</span>
    </div>
  );
}

function fmtPct(pct, digits = 2) {
  if (pct === null || pct === undefined) return '—';
  const sign = pct > 0 ? '+' : '';
  return `${sign}${pct.toFixed(digits)}%`;
}

function pctTone(pct) {
  if (pct === null || pct === undefined) return 'neutral';
  if (pct > 0.05) return 'up';
  if (pct < -0.05) return 'down';
  return 'flat';
}

/* ══════════════════════════════════════════════════
   메인
══════════════════════════════════════════════════ */
export default function SectorOverview({ onSelectSector }) {
  const [tf, setTf] = useState('3M');
  const { data, loading, error, generatedAt } = useSectorOverview();

  // 히트맵 호출 우선순위 — 카드의 3M 수익률 내림차순 (모멘텀 핫한 섹터 먼저)
  const priorityOrder = useMemo(() => {
    if (!data) return null;
    const ranked = SECTORS
      .map(s => ({ id: s.id, ret3M: data[s.id]?.etfMetrics?.returns?.['3M'] ?? -Infinity }))
      .sort((a, b) => b.ret3M - a.ret3M)
      .map(s => s.id);
    return ranked;
  }, [data]);

  const updatedAt = generatedAt
    ? new Date(generatedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div className="sector-overview">
      {/* 헤더 + 시간축 토글 */}
      <div className="ov-header">
        <div className="ov-header-left">
          <span className="ov-title">🌐 섹터 전망</span>
          <span className="ov-subtitle">7개 섹터 한눈에 비교 · 카드 클릭 시 상세 진입</span>
        </div>
        <div className="ov-header-right">
          {loading && <span className="live-badge loading-badge">⟳ 로딩 중…</span>}
          {!loading && !error && data && <span className="live-badge">● LIVE</span>}
          {error && <span className="live-badge error-badge" title={error}>⚠ 정적 폴백</span>}
          {updatedAt && <span className="ov-update-time">업데이트 {updatedAt}</span>}
        </div>
      </div>

      <div className="ov-tf-toggle">
        <span className="ov-tf-label">기간</span>
        {TIMEFRAMES.map(t => (
          <button
            key={t.id}
            className={`ov-tf-btn${tf === t.id ? ' active' : ''}`}
            onClick={() => setTf(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 섹터 카드 그리드 */}
      <div className="ov-grid">
        {SECTORS.map(s => {
          const sd = data?.[s.id];
          const etfList = SECTOR_ETFS[s.id] ?? [];
          const repEtf = etfList[0];

          const ret    = sd?.etfMetrics?.returns?.[tf];
          const ret3M  = sd?.etfMetrics?.returns?.['3M'];
          const volPct = sd?.etfMetrics?.volatilityPct;
          const turnRatio = sd?.etfMetrics?.turnoverRatio;
          const peMed  = sd?.sectorPeMedian;
          const wToday = sd?.weightedToday;
          const pos52w = sd?.etfMetrics?.pricePosition52w;
          const high52 = sd?.etfMetrics?.high52;
          const low52  = sd?.etfMetrics?.low52;
          const price  = sd?.etfMetrics?.price;

          const momentum = getMomentum(ret3M);
          const valuation = getValuation(peMed);
          const activity  = getActivity(turnRatio);
          const volTone   = getVolTone(volPct);

          const retTone = pctTone(ret);

          return (
            <button
              key={s.id}
              className={`ov-card ov-card-${momentum.tone}`}
              onClick={() => onSelectSector?.(s.id)}
            >
              {/* 헤더: 섹터명 + 모멘텀 배지 */}
              <div className="ov-card-head">
                <div className="ov-card-title">
                  <span className="ov-card-icon">{s.icon}</span>
                  <span className="ov-card-name">{s.label}</span>
                </div>
                <span className={`ov-momentum ov-momentum-${momentum.tone}`} title={`3개월 수익률: ${fmtPct(ret3M)}`}>
                  {momentum.icon} {momentum.label}
                </span>
              </div>

              {/* 1행: ETF 티커 + 수익률 */}
              <div className="ov-row ov-row-etf">
                <div className="ov-row-left">
                  <span className="ov-row-label">ETF</span>
                  <span className="ov-etf-ticker">{repEtf?.ticker ?? '—'}</span>
                </div>
                <span className={`ov-pct ov-pct-${retTone}`}>{fmtPct(ret)}</span>
              </div>

              {/* 1행 보조: 52주 가격 위치 */}
              <div className="ov-row ov-row-range">
                <span className="ov-row-label">52주 위치</span>
                <Range52WBar position={pos52w} low={low52} high={high52} price={price} />
              </div>

              {/* 2행: 시총 가중 등락 */}
              <div className="ov-row">
                <span className="ov-row-label">Top {sd?.companiesUsed ?? '—'} 가중 (오늘)</span>
                <span className={`ov-pct ov-pct-${pctTone(wToday)}`}>{fmtPct(wToday)}</span>
              </div>

              {/* 3행: 밸류에이션 게이지 */}
              <div className="ov-row ov-row-gauge">
                <span className="ov-row-label">
                  밸류 (PER {peMed ?? '—'})
                </span>
                <div className="ov-gauge-wrap">
                  <div className="ov-gauge-track">
                    <div
                      className={`ov-gauge-fill ov-gauge-${valuation.tone}`}
                      style={{ width: `${valuation.position}%` }}
                    />
                  </div>
                  <span className={`ov-gauge-label ov-gauge-${valuation.tone}`}>{valuation.label}</span>
                </div>
              </div>

              {/* 4행: 거래 활성도 + 변동성 */}
              <div className="ov-row ov-row-pair">
                <div className="ov-pair-item">
                  <span className="ov-row-label">거래 활성도</span>
                  <span className={`ov-pair-val ov-activity-${activity.tone}`}>
                    {activity.label}
                    {turnRatio && <span className="ov-sub"> ×{turnRatio.toFixed(2)}</span>}
                  </span>
                </div>
                <div className="ov-pair-item">
                  <span className="ov-row-label">변동성</span>
                  <span className={`ov-pair-val ov-vol-${volTone}`}>
                    {volPct !== null && volPct !== undefined ? `σ ${volPct.toFixed(2)}%` : '—'}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <p className="ov-footnote">
        💡 ETF 지표는 각 섹터 대표 ETF(첫 번째) 기준 ·
        시총 가중 등락은 미국 상장 Top 회사들의 일간 등락률 ·
        밸류 PER은 섹터 대표 회사들의 PER 중앙값 ·
        변동성은 3개월 일간 수익률 표준편차 ·
        거래 활성도는 10일 평균 거래량 ÷ 3개월 평균 거래량 ·
        52주 위치는 (현재가 − 52주 저점) / (52주 고점 − 52주 저점)
      </p>

      {/* ── 히트맵 (점진 로딩) ── */}
      <SectorHeatmap priorityOrder={priorityOrder} onSelectSector={onSelectSector} />
    </div>
  );
}
