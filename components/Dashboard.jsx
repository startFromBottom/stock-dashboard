'use client';

import { useState } from 'react';
import LayerMap from './LayerMap';
import NewsSection from './NewsSection';
import Illustration from './Illustration';

const TABS = [
  { id: 'map',   label: '🗺️ 레이어 맵' },
  { id: 'illust', label: '🏢 데이터센터' },
  { id: 'news',  label: '📰 뉴스 & 레포트' },
];

export default function Dashboard() {
  const [tab, setTab] = useState('map');

  const now = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="page-wrap">
      {/* Header */}
      <div className="header">
        <div className="header-top">
          <h1>🏢 AI 데이터센터 <span>인프라 대시보드</span></h1>
          <span className="header-meta">마지막 업데이트: {now}</span>
        </div>
        <p className="header-desc">
          AI 데이터센터 레이어별 구성 요소 · 시가총액 Top 5 기업 · 최신 뉴스 & 리포트
        </p>
      </div>

      {/* Tab Nav */}
      <nav className="tab-nav">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`tab-btn${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      {tab === 'map'    && <LayerMap />}
      {tab === 'illust' && <Illustration />}
      {tab === 'news'   && <NewsSection />}
    </div>
  );
}
