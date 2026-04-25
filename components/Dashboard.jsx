'use client';

import { useState } from 'react';
import NewsSection from './NewsSection';
import Illustration from './Illustration';
import SemiconductorDashboard from './SemiconductorDashboard';

/* ── 섹터 선택 ── */
const SECTORS = [
  { id: 'ai-dc', label: 'AI 데이터센터', icon: '🏢' },
  { id: 'semi',  label: '반도체',         icon: '🔬' },
];

/* ── 데이터센터 탭 ── */
const DC_TABS = [
  { id: 'illust', label: '🏢 데이터센터' },
  { id: 'news',   label: '📰 뉴스 & 레포트' },
];

export default function Dashboard() {
  const [sector, setSector] = useState('ai-dc');
  const [dcTab,  setDcTab]  = useState('illust');

  const now = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const headerTitle = sector === 'ai-dc'
    ? <>🏢 AI 데이터센터 <span>인프라 대시보드</span></>
    : <>🔬 반도체 <span>밸류체인 대시보드</span></>;

  const headerDesc = sector === 'ai-dc'
    ? 'AI 데이터센터 레이어별 구성 요소 · 시가총액 Top 10 기업 · 최신 뉴스 & 리포트'
    : '실리콘 원자재 → EDA/IP → 소재 → 장비 → 파운드리 → 팹리스 → 패키징 → 테스트 → 유통 · 각 단계 Top 10 기업';

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
      {sector === 'semi' && <SemiconductorDashboard />}
    </div>
  );
}
