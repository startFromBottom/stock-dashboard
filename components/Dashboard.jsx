'use client';

import { useState } from 'react';
import NewsSection from './NewsSection';
import Illustration from './Illustration';
import SemiconductorDashboard from './SemiconductorDashboard';
import SemiNewsSection from './SemiNewsSection';
import SpaceDashboard from './SpaceDashboard';
import SpaceNewsSection from './SpaceNewsSection';
import RawMaterialsMap from './RawMaterialsMap';
import RawNewsSection from './RawNewsSection';
import EnergyDashboard from './EnergyDashboard';
import EtfPanel from './EtfPanel';

/* ── 섹터 선택 ── */
const SECTORS = [
  { id: 'ai-dc',   label: 'AI 데이터센터', icon: '🏢' },
  { id: 'semi',    label: '반도체',         icon: '🔬' },
  { id: 'space',   label: '우주',           icon: '🚀' },
  { id: 'raw',     label: '원자재',         icon: '⛏️' },
  { id: 'energy',  label: '에너지',         icon: '⚡' },
];

/* ── 데이터센터 탭 ── */
const DC_TABS = [
  { id: 'illust', label: '🏢 데이터센터' },
  { id: 'news',   label: '📰 뉴스 & 레포트' },
];

/* ── 반도체 탭 ── */
const SEMI_TABS = [
  { id: 'chain', label: '🔬 밸류체인' },
  { id: 'news',  label: '📰 뉴스 & 레포트' },
];

/* ── 우주 탭 ── */
const SPACE_TABS = [
  { id: 'chain', label: '🚀 밸류체인' },
  { id: 'news',  label: '📰 뉴스 & 레포트' },
];

/* ── 원자재 탭 ── */
const RAW_TABS = [
  { id: 'map',  label: '🗺️ 매장량 지도' },
  { id: 'news', label: '📰 뉴스 & 리포트' },
];

/* ── 에너지 탭 ── */
const ENERGY_TABS = [
  { id: 'chart', label: '⚡ 에너지원 & 기업' },
];

export default function Dashboard() {
  const [sector,    setSector]    = useState('ai-dc');
  const [dcTab,     setDcTab]     = useState('illust');
  const [semiTab,   setSemiTab]   = useState('chain');
  const [spaceTab,  setSpaceTab]  = useState('chain');
  const [rawTab,    setRawTab]    = useState('map');
  const [energyTab, setEnergyTab] = useState('chart');

  const now = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const headerTitle =
    sector === 'ai-dc'  ? <>🏢 AI 데이터센터 <span>인프라</span></> :
    sector === 'semi'   ? <>🔬 반도체 <span>밸류체인</span></> :
    sector === 'space'  ? <>🚀 우주 섹터 <span>밸류체인</span></> :
    sector === 'energy' ? <>⚡ 에너지 <span>섹터</span></> :
                          <>⛏️ 원자재 <span>매장량 분포</span></>;

  const headerDesc =
    sector === 'ai-dc'  ? 'AI 데이터센터 레이어별 구성 요소 · 시가총액 Top 10 기업 · 최신 뉴스 & 리포트' :
    sector === 'semi'   ? '실리콘 원자재 → EDA/IP → 소재 → 장비 → 파운드리 → 팹리스 → 패키징 → 테스트 → 유통 · 각 단계 Top 10 기업' :
    sector === 'space'  ? '소재·부품·엔진 → 발사체·론치 → 위성 제작·운용 → 우주 데이터·분석 → 국방·응용 · 각 레이어 Top 기업' :
    sector === 'energy' ? '화석연료 · 원자력 · 수력 · 풍력 · 태양광 · SMR · 연료전지 · 지열 · 바이오매스 · 조력 — IEA 2024 발전 비중 & 메이저 기업' :
                          '희토류 · 구리 · 금&은&백금 · 모래(규사) · 철 — 대륙별 전세계 매장량 비중 시각화 · USGS 2024 기준';

  return (
    <div className="page-wrap">
      {/* ── Header ── */}
      <div className="header">
        <div className="header-top">
          <h1>{headerTitle}</h1>
          <span className="header-meta">마지막 업데이트: {now}</span>
        </div>
        <p className="header-desc">{headerDesc}</p>
      </div>

      {/* ── 섹터 탭 (AI 데이터센터 / 반도체) ── */}
      <div className="sector-nav">
        {SECTORS.map(s => (
          <button
            key={s.id}
            className={`sector-btn${sector === s.id ? ' active' : ''}`}
            onClick={() => setSector(s.id)}
          >
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      {/* ── ETF 패널 (섹터 공통) ── */}
      <EtfPanel sectorId={sector} />

      {/* ── AI 데이터센터 섹션 ── */}
      {sector === 'ai-dc' && (
        <>
          <nav className="tab-nav">
            {DC_TABS.map(t => (
              <button
                key={t.id}
                className={`tab-btn${dcTab === t.id ? ' active' : ''}`}
                onClick={() => setDcTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>
          {dcTab === 'illust' && <Illustration />}
          {dcTab === 'news'   && <NewsSection />}
        </>
      )}

      {/* ── 반도체 섹션 ── */}
      {sector === 'semi' && (
        <>
          <nav className="tab-nav">
            {SEMI_TABS.map(t => (
              <button
                key={t.id}
                className={`tab-btn${semiTab === t.id ? ' active' : ''}`}
                onClick={() => setSemiTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>
          {semiTab === 'chain' && <SemiconductorDashboard />}
          {semiTab === 'news'  && <SemiNewsSection />}
        </>
      )}

      {/* ── 우주 섹션 ── */}
      {sector === 'space' && (
        <>
          <nav className="tab-nav">
            {SPACE_TABS.map(t => (
              <button
                key={t.id}
                className={`tab-btn${spaceTab === t.id ? ' active' : ''}`}
                onClick={() => setSpaceTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>
          {spaceTab === 'chain' && <SpaceDashboard />}
          {spaceTab === 'news'  && <SpaceNewsSection />}
        </>
      )}

      {/* ── 원자재 섹션 ── */}
      {sector === 'raw' && (
        <>
          <nav className="tab-nav">
            {RAW_TABS.map(t => (
              <button
                key={t.id}
                className={`tab-btn${rawTab === t.id ? ' active' : ''}`}
                onClick={() => setRawTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>
          {rawTab === 'map'  && <RawMaterialsMap />}
          {rawTab === 'news' && <RawNewsSection />}
        </>
      )}

      {/* ── 에너지 섹션 ── */}
      {sector === 'energy' && (
        <>
          <nav className="tab-nav">
            {ENERGY_TABS.map(t => (
              <button
                key={t.id}
                className={`tab-btn${energyTab === t.id ? ' active' : ''}`}
                onClick={() => setEnergyTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>
          {energyTab === 'chart' && <EnergyDashboard />}
        </>
      )}
    </div>
  );
}
