'use client';

import { useState } from 'react';
import NewsSection from './NewsSection';
import Illustration from './Illustration';
import SemiconductorDashboard from './SemiconductorDashboard';
import SemiNewsSection from './SemiNewsSection';
import SpaceDashboard from './SpaceDashboard';

/* ── 섹터 선택 ── */
const SECTORS = [
  { id: 'ai-dc',  label: 'AI 데이터센터', icon: '🏢' },
  { id: 'semi',   label: '반도체',         icon: '🔬' },
  { id: 'space',  label: '우주',           icon: '🚀' },
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
];

export default function Dashboard() {
  const [sector,    setSector]    = useState('ai-dc');
  const [dcTab,     setDcTab]     = useState('illust');
  const [semiTab,   setSemiTab]   = useState('chain');
  const [spaceTab,  setSpaceTab]  = useState('chain');

  const now = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const headerTitle =
    sector === 'ai-dc' ? <>🏢 AI 데이터센터 <span>인프라</span></> :
    sector === 'semi'  ? <>🔬 반도체 <span>밸류체인</span></> :
                         <>🚀 우주 섹터 <span>밸류체인</span></>;

  const headerDesc =
    sector === 'ai-dc' ? 'AI 데이터센터 레이어별 구성 요소 · 시가총액 Top 10 기업 · 최신 뉴스 & 리포트' :
    sector === 'semi'  ? '실리콘 원자재 → EDA/IP → 소재 → 장비 → 파운드리 → 팹리스 → 패키징 → 테스트 → 유통 · 각 단계 Top 10 기업' :
                         '소재·부품·엔진 → 발사체·론치 → 위성 제작·운용 → 우주 데이터·분석 → 국방·응용 · 각 레이어 Top 기업';

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
        </>
      )}
    </div>
  );
}
