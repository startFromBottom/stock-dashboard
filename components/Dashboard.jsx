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
import EnergyNewsSection from './EnergyNewsSection';
import BiotechDashboard from './BiotechDashboard';
import BiotechNewsSection from './BiotechNewsSection';
import FintechDashboard from './FintechDashboard';
import FintechNewsSection from './FintechNewsSection';
import HealthcareDashboard from './HealthcareDashboard';
import HealthcareNewsSection from './HealthcareNewsSection';
import QuantumDashboard from './QuantumDashboard';
import QuantumNewsSection from './QuantumNewsSection';
import StaplesDashboard from './StaplesDashboard';
import StaplesNewsSection from './StaplesNewsSection';
import DiscretionaryDashboard from './DiscretionaryDashboard';
import DiscretionaryNewsSection from './DiscretionaryNewsSection';
import FinancialDashboard from './FinancialDashboard';
import FinancialNewsSection from './FinancialNewsSection';
import IndustrialsDashboard from './IndustrialsDashboard';
import IndustrialsNewsSection from './IndustrialsNewsSection';
import EtfPanel from './EtfPanel';
import SectorOverview from './SectorOverview';
import TodayHeadline from './TodayHeadline';
import WatchlistDashboard from './WatchlistDashboard';
import HeaderWatchlistButton from './HeaderWatchlistButton';
import LoginButton from './LoginButton';
import CompanyDetailModal from './CompanyDetailModal';

/* ── 섹터 선택 ── */
const SECTORS = [
  { id: 'overview', label: '전체 전망',     icon: '🌐' },
  { id: 'ai-dc',   label: 'AI 데이터센터', icon: '🏢' },
  { id: 'semi',    label: '반도체',         icon: '🔬' },
  { id: 'space',   label: '우주',           icon: '🚀' },
  { id: 'raw',     label: '원자재',         icon: '⛏️' },
  { id: 'energy',  label: '에너지',         icon: '⚡' },
  { id: 'biotech', label: '바이오테크',     icon: '🧬' },
  { id: 'fintech', label: '핀테크',         icon: '💳' },
  { id: 'healthcare', label: '헬스케어',    icon: '🏥' },
  { id: 'quantum', label: '양자컴퓨터',     icon: '⚛️' },
  { id: 'staples', label: '필수소비재',     icon: '🥫' },
  { id: 'discretionary', label: '임의소비재', icon: '🛍️' },
  { id: 'financials', label: '금융',         icon: '🏦' },
  { id: 'industrials', label: '산업재',       icon: '🏭' },
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
  { id: 'news',  label: '📰 뉴스 & 리포트' },
];

/* ── 바이오테크 탭 ── */
const BIOTECH_TABS = [
  { id: 'chain', label: '🧬 밸류체인' },
  { id: 'news',  label: '📰 뉴스 & 리포트' },
];

/* ── 핀테크 탭 ── */
const FINTECH_TABS = [
  { id: 'chain', label: '💳 밸류체인' },
  { id: 'news',  label: '📰 뉴스 & 리포트' },
];

/* ── 헬스케어 탭 ── */
const HEALTHCARE_TABS = [
  { id: 'chain', label: '🏥 밸류체인' },
  { id: 'news',  label: '📰 뉴스 & 리포트' },
];

/* ── 양자컴퓨터 탭 ── */
const QUANTUM_TABS = [
  { id: 'chain', label: '⚛️ 밸류체인' },
  { id: 'news',  label: '📰 뉴스 & 리포트' },
];

/* ── 필수소비재 탭 ── */
const STAPLES_TABS = [
  { id: 'chain', label: '🥫 밸류체인' },
  { id: 'news',  label: '📰 뉴스 & 리포트' },
];

/* ── 임의소비재 탭 ── */
const DISCRETIONARY_TABS = [
  { id: 'chain', label: '🛍️ 밸류체인' },
  { id: 'news',  label: '📰 뉴스 & 리포트' },
];

/* ── 금융 탭 ── */
const FINANCIALS_TABS = [
  { id: 'chain', label: '🏦 밸류체인' },
  { id: 'news',  label: '📰 뉴스 & 리포트' },
];

/* ── 산업재 탭 ── */
const INDUSTRIALS_TABS = [
  { id: 'chain', label: '🏭 밸류체인' },
  { id: 'news',  label: '📰 뉴스 & 리포트' },
];

export default function Dashboard() {
  const [sector,        setSector]        = useState('overview');
  const [dcTab,         setDcTab]         = useState('illust');
  const [semiTab,       setSemiTab]       = useState('chain');
  const [spaceTab,      setSpaceTab]      = useState('chain');
  const [rawTab,        setRawTab]        = useState('map');
  const [energyTab,     setEnergyTab]     = useState('chart');
  const [biotechTab,    setBiotechTab]    = useState('chain');
  const [fintechTab,    setFintechTab]    = useState('chain');
  const [healthcareTab,   setHealthcareTab]   = useState('chain');
  const [quantumTab,      setQuantumTab]      = useState('chain');
  const [staplesTab,      setStaplesTab]      = useState('chain');
  const [discretionaryTab, setDiscretionaryTab] = useState('chain');
  const [financialsTab,   setFinancialsTab]   = useState('chain');
  const [industrialsTab,  setIndustrialsTab]  = useState('chain');

  const now = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const headerTitle =
    sector === 'overview'   ? <>🌐 섹터 <span>전망</span></> :
    sector === 'ai-dc'      ? <>🏢 AI 데이터센터 <span>인프라</span></> :
    sector === 'semi'       ? <>🔬 반도체 <span>밸류체인</span></> :
    sector === 'space'      ? <>🚀 우주 섹터 <span>밸류체인</span></> :
    sector === 'energy'     ? <>⚡ 에너지 <span>섹터</span></> :
    sector === 'biotech'    ? <>🧬 바이오테크 <span>AI 신약개발</span></> :
    sector === 'fintech'    ? <>💳 핀테크 <span>금융 인프라</span></> :
    sector === 'healthcare' ? <>🏥 헬스케어 <span>의료기기</span></> :
    sector === 'quantum'    ? <>⚛️ 양자컴퓨터 <span>밸류체인</span></> :
    sector === 'staples'       ? <>🥫 필수소비재 <span>밸류체인</span></> :
    sector === 'discretionary' ? <>🛍️ 임의소비재 <span>밸류체인</span></> :
    sector === 'financials'    ? <>🏦 금융 <span>밸류체인</span></> :
    sector === 'industrials'   ? <>🏭 산업재 <span>밸류체인</span></> :
    sector === 'watchlist'     ? <>⭐ 나의 <span>워치리스트</span></> :
                              <>⛏️ 원자재 <span>매장량 분포</span></>;

  const headerDesc =
    sector === 'overview'   ? `${SECTORS.length - 1}개 섹터 한눈에 비교 — ETF 수익률 · 시총 가중 등락 · 모멘텀 · 밸류에이션 · 거래 활성도 · 변동성 · 기간별 토글` :
    sector === 'ai-dc'      ? 'AI 데이터센터 레이어별 구성 요소 · 시가총액 Top 10 기업 · 최신 뉴스 & 리포트' :
    sector === 'semi'       ? '실리콘 원자재 → EDA/IP → 소재 → 장비 → 파운드리 → 팹리스 → 패키징 → 테스트 → 유통 · 각 단계 Top 10 기업' :
    sector === 'space'      ? '소재·부품·엔진 → 발사체·론치 → 위성 제작·운용 → 우주 데이터·분석 → 국방·응용 · 각 레이어 Top 기업' :
    sector === 'energy'     ? '화석연료 · 원자력 · 수력 · 풍력 · 태양광 · SMR · 연료전지 · 지열 · 바이오매스 · 조력 — IEA 2024 발전 비중 & 메이저 기업' :
    sector === 'biotech'    ? 'AI 신약설계 플랫폼 → 유전체·데이터 → 치료 모달리티 → CRO → CDMO → 빅파마 → 진단·의료기기 · 각 레이어 Top 기업' :
    sector === 'fintech'    ? '결제 인프라 → 은행/신용 → 투자/자산관리 → 블록체인/크립토 → AI 금융/데이터 — 각 레이어 Top 기업' :
    sector === 'healthcare' ? '의료기기(수술로봇, AI영상진단) → 의료IT(EHR, 웨어러블) → 의료서비스(병원체인) → 헬스케어SaaS(청구자동화) · 각 레이어 Top 기업' :
    sector === 'quantum'    ? '양자칩 & 게이트 → 큐비트 검증 → 소프트웨어 & 알고리즘 → 응용 소프트웨어 → 산업별 응용 · 각 레이어 Top 기업 & 최신 동향' :
    sector === 'staples'       ? '농업/원료 → 식품/음료 → 담배/주류 → 생필품/유통 — 경기 방어주의 핵심, 글로벌 브랜드 메이저' :
    sector === 'discretionary' ? '자동차/EV → 럭셔리/패션 → 외식/여행 → 가전/홈 → 미디어/엔터 — 경기 사이클 민감, 라이프스타일 트렌드 직접 반영' :
    sector === 'financials'    ? '대형 은행 → 자산운용/증권 → 보험 → 결제 네트워크 → 거래소·인프라 — 금리·경기 민감도 가장 큼, 시장 거시 흐름의 바로미터' :
    sector === 'industrials'   ? '항공우주/방산 → 중장비/기계 → 인프라/HVAC → 운송/물류 → 자동화/산업기술 — 인프라·AI·nearshoring 슈퍼사이클의 직접 수혜' :
    sector === 'watchlist'     ? '내가 점찍은 종목들 — 관심 시작 후 수익률 · 매수가 · 메모를 한 화면에서 추적' :
                              '희토류 · 구리 · 금&은&백금 · 모래(규사) · 철 — 대륙별 전세계 매장량 비중 시각화 · USGS 2024 기준';

  return (
    <div className="page-wrap">
      {/* ── 글로벌 회사 상세 모달 — 어떤 카드에서든 열 수 있음 ── */}
      <CompanyDetailModal />

      {/* ── Header ── */}
      <div className="header">
        <div className="header-top">
          <h1>{headerTitle}</h1>
          <div className="header-right">
            <HeaderWatchlistButton
              active={sector === 'watchlist'}
              onSelect={setSector}
            />
            <LoginButton />
            <span className="header-meta">마지막 업데이트: {now}</span>
          </div>
        </div>
        <p className="header-desc">{headerDesc}</p>
      </div>

      {/* ── 오늘의 시장 헤드라인 (모든 섹터 공통) ── */}
      <TodayHeadline onSelectSector={(id) => setSector(id)} />

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

      {/* ── ETF 패널 (overview/watchlist 제외 섹터 공통) ── */}
      {sector !== 'overview' && sector !== 'watchlist' && <EtfPanel sectorId={sector} />}

      {/* ── 전체 전망 (Overview) ── */}
      {sector === 'overview' && (
        <SectorOverview onSelectSector={(id) => setSector(id)} />
      )}

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
          {energyTab === 'news'  && <EnergyNewsSection />}
        </>
      )}

      {/* ── 바이오테크 섹션 ── */}
      {sector === 'biotech' && (
        <>
          <nav className="tab-nav">
            {BIOTECH_TABS.map(t => (
              <button
                key={t.id}
                className={`tab-btn${biotechTab === t.id ? ' active' : ''}`}
                onClick={() => setBiotechTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>
          {biotechTab === 'chain' && <BiotechDashboard />}
          {biotechTab === 'news'  && <BiotechNewsSection />}
        </>
      )}

      {/* ── 핀테크 섹션 ── */}
      {sector === 'fintech' && (
        <>
          <nav className="tab-nav">
            {FINTECH_TABS.map(t => (
              <button
                key={t.id}
                className={`tab-btn${fintechTab === t.id ? ' active' : ''}`}
                onClick={() => setFintechTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>
          {fintechTab === 'chain' && <FintechDashboard />}
          {fintechTab === 'news'  && <FintechNewsSection />}
        </>
      )}

      {/* ── 헬스케어 섹션 ── */}
      {sector === 'healthcare' && (
        <>
          <nav className="tab-nav">
            {HEALTHCARE_TABS.map(t => (
              <button
                key={t.id}
                className={`tab-btn${healthcareTab === t.id ? ' active' : ''}`}
                onClick={() => setHealthcareTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>
          {healthcareTab === 'chain' && <HealthcareDashboard />}
          {healthcareTab === 'news'  && <HealthcareNewsSection />}
        </>
      )}

      {/* ── 양자컴퓨터 섹션 ── */}
      {sector === 'quantum' && (
        <>
          <nav className="tab-nav">
            {QUANTUM_TABS.map(t => (
              <button
                key={t.id}
                className={`tab-btn${quantumTab === t.id ? ' active' : ''}`}
                onClick={() => setQuantumTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>
          {quantumTab === 'chain' && <QuantumDashboard />}
          {quantumTab === 'news'  && <QuantumNewsSection />}
        </>
      )}

      {/* ── 필수소비재 섹션 ── */}
      {sector === 'staples' && (
        <>
          <nav className="tab-nav">
            {STAPLES_TABS.map(t => (
              <button
                key={t.id}
                className={`tab-btn${staplesTab === t.id ? ' active' : ''}`}
                onClick={() => setStaplesTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>
          {staplesTab === 'chain' && <StaplesDashboard />}
          {staplesTab === 'news'  && <StaplesNewsSection />}
        </>
      )}

      {/* ── 임의소비재 섹션 ── */}
      {sector === 'discretionary' && (
        <>
          <nav className="tab-nav">
            {DISCRETIONARY_TABS.map(t => (
              <button
                key={t.id}
                className={`tab-btn${discretionaryTab === t.id ? ' active' : ''}`}
                onClick={() => setDiscretionaryTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>
          {discretionaryTab === 'chain' && <DiscretionaryDashboard />}
          {discretionaryTab === 'news'  && <DiscretionaryNewsSection />}
        </>
      )}

      {/* ── 금융 섹션 ── */}
      {sector === 'financials' && (
        <>
          <nav className="tab-nav">
            {FINANCIALS_TABS.map(t => (
              <button key={t.id}
                className={`tab-btn${financialsTab === t.id ? ' active' : ''}`}
                onClick={() => setFinancialsTab(t.id)}>
                {t.label}
              </button>
            ))}
          </nav>
          {financialsTab === 'chain' && <FinancialDashboard />}
          {financialsTab === 'news'  && <FinancialNewsSection />}
        </>
      )}

      {/* ── 산업재 섹션 ── */}
      {sector === 'industrials' && (
        <>
          <nav className="tab-nav">
            {INDUSTRIALS_TABS.map(t => (
              <button key={t.id}
                className={`tab-btn${industrialsTab === t.id ? ' active' : ''}`}
                onClick={() => setIndustrialsTab(t.id)}>
                {t.label}
              </button>
            ))}
          </nav>
          {industrialsTab === 'chain' && <IndustrialsDashboard />}
          {industrialsTab === 'news'  && <IndustrialsNewsSection />}
        </>
      )}

      {/* ── 워치리스트 섹션 ── */}
      {sector === 'watchlist' && (
        <WatchlistDashboard onSelectSector={(id) => setSector(id)} />
      )}
    </div>
  );
}
