'use client';

import { useEffect, useMemo, useState } from 'react';
import useSectorOverview from '@/hooks/useSectorOverview';
import { NEWS_ITEMS }         from '@/data/news';
import { SEMI_NEWS_ITEMS }    from '@/data/semi-news';
import { SPACE_NEWS_ITEMS }   from '@/data/space-news';
import { ENERGY_NEWS_ITEMS }  from '@/data/energy-news';
import { BIOTECH_NEWS_ITEMS } from '@/data/biotech-news';
import { FINTECH_NEWS_ITEMS } from '@/data/fintech-news';
import { RAW_NEWS_ITEMS }     from '@/data/rawNews';

const SECTOR_META = {
  'ai-dc':   { label: 'AI 데이터센터', icon: '🏢' },
  'semi':    { label: '반도체',         icon: '🔬' },
  'space':   { label: '우주',           icon: '🚀' },
  'raw':     { label: '원자재',         icon: '⛏️' },
  'energy':  { label: '에너지',         icon: '⚡' },
  'biotech': { label: '바이오테크',     icon: '🧬' },
  'fintech': { label: '핀테크',         icon: '💳' },
};

const ALL_NEWS = [
  ...(NEWS_ITEMS         ?? []).map(n => ({ ...n, _sector: 'ai-dc' })),
  ...(SEMI_NEWS_ITEMS    ?? []).map(n => ({ ...n, _sector: 'semi' })),
  ...(SPACE_NEWS_ITEMS   ?? []).map(n => ({ ...n, _sector: 'space' })),
  ...(ENERGY_NEWS_ITEMS  ?? []).map(n => ({ ...n, _sector: 'energy' })),
  ...(BIOTECH_NEWS_ITEMS ?? []).map(n => ({ ...n, _sector: 'biotech' })),
  ...(FINTECH_NEWS_ITEMS ?? []).map(n => ({ ...n, _sector: 'fintech' })),
  ...(RAW_NEWS_ITEMS     ?? []).map(n => ({ ...n, _sector: 'raw' })),
];

const SLIDE_INTERVAL = 6000;

/* ══════════════════════════════════════════════════
   슬라이드 빌더 — sector-overview 데이터에서 인사이트 추출
══════════════════════════════════════════════════ */

function buildSlides(data) {
  if (!data) return [];

  const entries = Object.entries(data)
    .map(([sid, sd]) => ({ sid, ...sd }))
    .filter(e => e.etfMetrics);

  if (entries.length === 0) return [];

  const slides = [];

  // 1. 🔥 오늘 가장 뜨거운 곳 (값이 음수면 라벨/톤 변경)
  const hottest = [...entries].sort((a, b) =>
    (b.etfMetrics?.returns?.['1D'] ?? -Infinity) - (a.etfMetrics?.returns?.['1D'] ?? -Infinity)
  )[0];
  if (hottest && typeof hottest.etfMetrics.returns['1D'] === 'number') {
    const meta = SECTOR_META[hottest.sid];
    const v = hottest.etfMetrics.returns['1D'];
    const isPositive = v > 0;
    slides.push({
      id: 'hottest',
      kind: 'hot',
      icon: isPositive ? '🔥' : '🛡️',
      label: isPositive ? '오늘 가장 뜨거운 곳' : '그나마 가장 강한 곳',
      sectorId: hottest.sid,
      title: `${meta.icon} ${meta.label}`,
      value: `${v > 0 ? '+' : ''}${v.toFixed(2)}%`,
      tone: isPositive ? 'up' : 'info',
    });
  }

  // 2. ❄️ 오늘 가장 식은 곳 (값이 양수면 라벨 변경)
  const coldest = [...entries].sort((a, b) =>
    (a.etfMetrics?.returns?.['1D'] ?? Infinity) - (b.etfMetrics?.returns?.['1D'] ?? Infinity)
  )[0];
  if (coldest && typeof coldest.etfMetrics.returns['1D'] === 'number' && coldest.sid !== hottest?.sid) {
    const meta = SECTOR_META[coldest.sid];
    const v = coldest.etfMetrics.returns['1D'];
    const isNegative = v < 0;
    slides.push({
      id: 'coldest',
      kind: 'cold',
      icon: isNegative ? '❄️' : '🐢',
      label: isNegative ? '오늘 가장 식은 곳' : '오늘 가장 약한 곳',
      sectorId: coldest.sid,
      title: `${meta.icon} ${meta.label}`,
      value: `${v > 0 ? '+' : ''}${v.toFixed(2)}%`,
      tone: isNegative ? 'down' : 'info',
    });
  }

  // 3. 💰 자금 폭증 (turnoverRatio 가장 높은 섹터)
  const moneyFlow = [...entries].sort((a, b) =>
    (b.etfMetrics?.turnoverRatio ?? 0) - (a.etfMetrics?.turnoverRatio ?? 0)
  )[0];
  if (moneyFlow?.etfMetrics?.turnoverRatio > 1.0) {
    const meta = SECTOR_META[moneyFlow.sid];
    slides.push({
      id: 'flow',
      kind: 'flow',
      icon: '💰',
      label: '자금 폭증',
      sectorId: moneyFlow.sid,
      title: `${meta.icon} ${meta.label}`,
      value: `평소 대비 ×${moneyFlow.etfMetrics.turnoverRatio.toFixed(2)}`,
      tone: 'hot',
    });
  }

  // 4. 🎯 모멘텀 1위 (3M 수익률 최대)
  const momentum = [...entries].sort((a, b) =>
    (b.etfMetrics?.returns?.['3M'] ?? -Infinity) - (a.etfMetrics?.returns?.['3M'] ?? -Infinity)
  )[0];
  if (momentum && typeof momentum.etfMetrics.returns['3M'] === 'number') {
    const meta = SECTOR_META[momentum.sid];
    slides.push({
      id: 'momentum',
      kind: 'momentum',
      icon: '🎯',
      label: '3개월 모멘텀 1위',
      sectorId: momentum.sid,
      title: `${meta.icon} ${meta.label}`,
      value: `${momentum.etfMetrics.returns['3M'] > 0 ? '+' : ''}${momentum.etfMetrics.returns['3M'].toFixed(2)}%`,
      tone: 'up',
    });
  }

  // 5. ⚠️ 변동성 주의 (volatilityPct 최대 + 2.5% 이상일 때만)
  const volHigh = [...entries].sort((a, b) =>
    (b.etfMetrics?.volatilityPct ?? 0) - (a.etfMetrics?.volatilityPct ?? 0)
  )[0];
  if (volHigh?.etfMetrics?.volatilityPct >= 2.5) {
    const meta = SECTOR_META[volHigh.sid];
    slides.push({
      id: 'vol',
      kind: 'vol',
      icon: '⚠️',
      label: '변동성 주의',
      sectorId: volHigh.sid,
      title: `${meta.icon} ${meta.label}`,
      value: `σ ${volHigh.etfMetrics.volatilityPct.toFixed(2)}%/일`,
      tone: 'warn',
    });
  }

  // 6. 🚨 PER 거품 경계 (sectorPeMedian ≥ 40인 섹터들 중 최대)
  const valHigh = [...entries].filter(e => e.sectorPeMedian).sort((a, b) =>
    b.sectorPeMedian - a.sectorPeMedian
  )[0];
  if (valHigh?.sectorPeMedian >= 40) {
    const meta = SECTOR_META[valHigh.sid];
    slides.push({
      id: 'pe',
      kind: 'pe',
      icon: '🚨',
      label: 'PER 거품 경계',
      sectorId: valHigh.sid,
      title: `${meta.icon} ${meta.label}`,
      value: `PER ${valHigh.sectorPeMedian.toFixed(1)}`,
      tone: 'warn',
    });
  }

  // 7. 📈 52주 신고가 근처 (pricePosition52w ≥ 95% 인 섹터들)
  const nearHigh = entries.filter(e => (e.etfMetrics?.pricePosition52w ?? 0) >= 95);
  if (nearHigh.length > 0) {
    const top = nearHigh.sort((a, b) => b.etfMetrics.pricePosition52w - a.etfMetrics.pricePosition52w)[0];
    const meta = SECTOR_META[top.sid];
    const others = nearHigh.length > 1 ? ` 외 ${nearHigh.length - 1}` : '';
    slides.push({
      id: 'high52',
      kind: 'high52',
      icon: '📈',
      label: '52주 신고가 근처',
      sectorId: top.sid,
      title: `${meta.icon} ${meta.label}${others}`,
      value: `${top.etfMetrics.pricePosition52w}%`,
      tone: 'up',
    });
  }

  // 8. 📰 최신 뉴스 (모든 섹터 합쳐서 date 내림차순 1건)
  const latestNews = [...ALL_NEWS]
    .filter(n => n.title && n.date)
    .sort((a, b) => b.date.localeCompare(a.date))[0];
  if (latestNews) {
    const meta = SECTOR_META[latestNews._sector];
    slides.push({
      id: 'news',
      kind: 'news',
      icon: '📰',
      label: '최신 뉴스',
      sectorId: latestNews._sector,
      title: `${meta?.icon ?? ''} ${latestNews.title}`,
      value: latestNews.date,
      tone: 'info',
      url: latestNews.url,
    });
  }

  return slides;
}

/* ══════════════════════════════════════════════════
   메인 컴포넌트
══════════════════════════════════════════════════ */
export default function TodayHeadline({ onSelectSector }) {
  const { data, loading } = useSectorOverview();
  const slides = useMemo(() => buildSlides(data), [data]);

  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  // 인덱스 자동 회전
  useEffect(() => {
    if (slides.length <= 1 || paused) return;
    const t = setInterval(() => {
      setIdx(prev => (prev + 1) % slides.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(t);
  }, [slides.length, paused]);

  // 슬라이드 개수 변하면 idx 리셋
  useEffect(() => {
    if (idx >= slides.length) setIdx(0);
  }, [slides.length, idx]);

  if (loading && slides.length === 0) {
    return (
      <div className="hl-bar hl-bar-loading">
        <span className="hl-icon">🌐</span>
        <span className="hl-skeleton">시장 헤드라인 가져오는 중…</span>
      </div>
    );
  }

  if (slides.length === 0) return null;

  const current = slides[idx];

  const handleClick = (e) => {
    if (current.kind === 'news' && current.url) {
      // 뉴스는 새 탭으로 열기
      e.preventDefault();
      window.open(current.url, '_blank', 'noopener,noreferrer');
      return;
    }
    if (current.sectorId) {
      onSelectSector?.(current.sectorId);
    }
  };

  return (
    <div
      className={`hl-bar hl-tone-${current.tone ?? 'info'}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleClick(e)}
      title={paused ? '클릭으로 이동 (회전 일시정지)' : '클릭으로 이동 (호버 시 일시정지)'}
    >
      <span className="hl-icon">{current.icon}</span>
      <span className="hl-label">{current.label}</span>
      <span className="hl-divider">|</span>
      <span className="hl-title">{current.title}</span>
      <span className={`hl-value hl-value-${current.tone ?? 'info'}`}>{current.value}</span>

      {/* 진행 도트 */}
      <div className="hl-dots">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`hl-dot${i === idx ? ' active' : ''}`}
            onClick={(e) => { e.stopPropagation(); setIdx(i); }}
          />
        ))}
      </div>

      {paused && <span className="hl-pause-tag">⏸ 일시정지</span>}
    </div>
  );
}
