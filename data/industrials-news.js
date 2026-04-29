// 산업재(Industrials) 섹터 뉴스 데이터 (2025~2026년 기준)

export const INDUSTRIALS_NEWS_TYPE_LABEL = {
  news:   { icon: '📰', label: '뉴스' },
  report: { icon: '📊', label: '리포트' },
};

export const INDUSTRIALS_CATEGORY_LABEL = {
  aerospace_defense: { icon: '✈️', name: '항공우주·방산' },
  machinery:         { icon: '🚜', name: '중장비·기계' },
  hvac_construction: { icon: '🏗️', name: '인프라·HVAC' },
  transport:         { icon: '🚚', name: '운송·물류' },
  automation:        { icon: '🤖', name: '자동화·산업기술' },
};

export function countIndustrialsByCat(items) {
  const map = {};
  for (const item of items) {
    map[item.category] = (map[item.category] ?? 0) + 1;
  }
  return map;
}

export const INDUSTRIALS_NEWS_ITEMS = [
  // ── 항공우주·방산 ─────────────────────────────────
  {
    id: 'in-n-001',
    category: 'aerospace_defense',
    type: 'news',
    date: '2026-04-22',
    title: 'RTX 1Q26 — 패트리어트·미사일 백오더 사상 최대',
    summary: 'RTX의 방산 부문 백오더가 $2,150억 돌파 — 사상 최대 갱신. 우크라이나·이스라엘·대만 수요 + 미군 보충 수요 동시 작용. NASAMS·패트리어트·재블린 다년간 생산 풀가동. 매출 +9%, 영업이익 +14%.',
    tickers: ['RTX', 'LMT', 'NOC'],
    source: 'Defense News',
    url: 'https://www.defensenews.com/business/2026/04/rtx-q1',
  },
  {
    id: 'in-n-002',
    category: 'aerospace_defense',
    type: 'news',
    date: '2026-04-08',
    title: 'Boeing 737 MAX 생산 50대/월 회복 — 안전 이슈 일단락',
    summary: 'BA가 737 MAX 월 생산 50대 회복. FAA 안전 감독 완화 + Spirit AeroSystems 재인수로 품질 통제 강화. 하지만 에어버스(A320neo)와의 경쟁에서 시장 점유율 -10%포인트 손실은 회복 중.',
    tickers: ['BA', 'EADSY'],
    source: 'Reuters',
    url: 'https://www.reuters.com/business/aerospace-defense/boeing-2026',
  },
  {
    id: 'in-n-003',
    category: 'aerospace_defense',
    type: 'report',
    date: '2026-03-20',
    title: '[리포트] 미국 방산예산 2027 $9,000억 — 5년 누적 +30%',
    summary: 'CSIS 보고서. 미국 2027 회계연도 국방예산이 $9,000억 돌파 예상. 우크라이나·중국·중동 동시 분쟁으로 5년 누적 +30% 확대. LMT(F-35·THAAD)·RTX(미사일)·NOC(B-21) 핵심 수혜. 방산주 중장기 강세.',
    tickers: ['LMT', 'RTX', 'NOC', 'GD'],
    source: 'CSIS',
    url: 'https://www.csis.org/analysis/defense-budget-2027',
  },

  // ── 중장비·기계 ───────────────────────────────────
  {
    id: 'in-n-010',
    category: 'machinery',
    type: 'news',
    date: '2026-04-25',
    title: 'Caterpillar 1Q26 — 데이터센터 백업 발전기 매출 +35%',
    summary: 'CAT의 발전기·디젤엔진 부문 매출이 데이터센터 수요로 +35% 폭증. AI 데이터센터 한 캠퍼스당 백업전력 수요가 100MW+로 5년 전 대비 5배. 광업·건설 부문은 안정적, Energy & Transportation 부문이 새 성장 동력.',
    tickers: ['CAT'],
    source: 'CNBC',
    url: 'https://www.cnbc.com/2026/04/25/caterpillar-q1-2026.html',
  },
  {
    id: 'in-n-011',
    category: 'machinery',
    type: 'news',
    date: '2026-04-10',
    title: 'Eaton 데이터센터 전력관리 매출 +50% — AI 인프라 직접 수혜',
    summary: 'ETN이 1분기 매출 +14%, 데이터센터 전력관리 부문 +50% 폭증. UPS·전력분배·EV 충전 시너지. NVDA·MSFT·AMZN 하이퍼스케일러 직접 공급. AI 인프라 간접 수혜주로 재평가.',
    tickers: ['ETN', 'NVDA'],
    source: 'Wall Street Journal',
    url: 'https://www.wsj.com/articles/eaton-data-center-2026',
  },
  {
    id: 'in-n-012',
    category: 'machinery',
    type: 'report',
    date: '2026-03-12',
    title: '[리포트] 정밀농업 시장 2030년 $200억 — Deere 시장 점유 1위 굳히기',
    summary: 'McKinsey. 자율주행 트랙터·AI 농기계·드론 정찰 결합한 정밀농업 시장 연 12% 성장. DE의 Smart Industrial 전략이 시장 리더. AGCO·CNH 추격하지만 격차 확대. AI 통합 + 데이터 플랫폼이 차별화 핵심.',
    tickers: ['DE', 'AGCO'],
    source: 'McKinsey & Company',
    url: 'https://www.mckinsey.com/industries/agriculture/precision-farming-2030',
  },

  // ── 인프라·HVAC ───────────────────────────────────
  {
    id: 'in-n-020',
    category: 'hvac_construction',
    type: 'news',
    date: '2026-04-20',
    title: 'Carrier·Trane 데이터센터 냉각 백오더 사상 최대',
    summary: 'CARR·TT 양강의 데이터센터 냉각 시스템 백오더가 다년간 풀가동 수준. 액침냉각·증발냉각 같은 차세대 기술 R&D 가속. AI 데이터센터 한 캠퍼스 냉각 비용 $5억+ — 가장 빠른 성장 시장.',
    tickers: ['CARR', 'TT'],
    source: 'Bloomberg',
    url: 'https://www.bloomberg.com/news/articles/data-center-cooling-2026',
  },
  {
    id: 'in-n-021',
    category: 'hvac_construction',
    type: 'news',
    date: '2026-04-02',
    title: 'Vulcan Materials 골재 매출 +18% — IIJA 인프라법 수혜 본격',
    summary: 'VMC가 1분기 매출 +18%로 컨센서스 상회. 미국 IIJA 인프라법($1.2조)의 도로·교량·철도 건설이 골재·시멘트 수요 견인. 가격 인상력도 작용 — 톤당 가격 +12%. 미국 인프라 투자 다년간 지속.',
    tickers: ['VMC', 'MLM'],
    source: 'Reuters',
    url: 'https://www.reuters.com/business/vulcan-materials-q1-2026',
  },
  {
    id: 'in-n-022',
    category: 'hvac_construction',
    type: 'report',
    date: '2026-03-05',
    title: '[리포트] 미국 인프라 투자 사이클 2030년까지 — 건설 산업 슈퍼사이클',
    summary: 'Morgan Stanley. 미국 IIJA $1.2조 + 데이터센터 $5,000억 + 친환경 전환 $3,000억 = 다년간 인프라 슈퍼사이클. 건설자재(VMC·MLM)·EPC(PWR·FLR·ACM)·HVAC(CARR·TT) 핵심 수혜.',
    tickers: ['VMC', 'MLM', 'PWR', 'CARR'],
    source: 'Morgan Stanley',
    url: 'https://www.morganstanley.com/research/infrastructure-supercycle',
  },

  // ── 운송·물류 ─────────────────────────────────────
  {
    id: 'in-n-030',
    category: 'transport',
    type: 'news',
    date: '2026-04-18',
    title: 'Union Pacific 1Q26 — 인터모달 매출 +14%',
    summary: 'UNP의 인터모달(철도+트럭) 부문 매출이 +14%로 회복 견인. 미국·멕시코 nearshoring 무역 +20%, 트럭 운송 수요 둔화 시기에 철도 점유 확대. 운영효율(OR) 58%로 사상 최저 갱신.',
    tickers: ['UNP', 'CSX', 'CP'],
    source: 'CNBC',
    url: 'https://www.cnbc.com/2026/04/18/union-pacific-q1-2026.html',
  },
  {
    id: 'in-n-031',
    category: 'transport',
    type: 'news',
    date: '2026-04-05',
    title: 'UPS·FedEx 미국 e커머스 회복 — 1Q 매출 +6% 동반 성장',
    summary: 'UPS·FDX 양사가 1분기 매출 동반 +6% — 미국 e커머스 거래량 +11% 회복 견인. Amazon 자체 물류망(Amazon Logistics) 점유 확대 우려는 일단락. 헬스케어 물류 + 국제 항공 화물이 새 성장 동력.',
    tickers: ['UPS', 'FDX'],
    source: 'Wall Street Journal',
    url: 'https://www.wsj.com/articles/ups-fedex-q1-2026',
  },
  {
    id: 'in-n-032',
    category: 'transport',
    type: 'report',
    date: '2026-03-15',
    title: '[리포트] 자율주행 트럭 상업 운영 본격화 — 2030년 미국 화물의 15%',
    summary: 'Goldman Sachs. Aurora·Kodiak·Plus AI 등 자율주행 트럭이 텍사스·애리조나에서 상업 운영 본격화. 2030년 미국 장거리 화물의 15% 자율주행 전환 예상. ODFL·KNX 등 트럭 운송사 장기 위협, 그러나 단기는 효율 개선 수혜.',
    tickers: ['ODFL', 'JBHT', 'XPO'],
    source: 'Goldman Sachs',
    url: 'https://www.gs.com/research/autonomous-trucks-2030',
  },

  // ── 자동화·산업기술 ───────────────────────────────
  {
    id: 'in-n-040',
    category: 'automation',
    type: 'news',
    date: '2026-04-22',
    title: 'ABB 1Q26 — 데이터센터 전력 자동화 매출 +45%',
    summary: 'ABB의 데이터센터 전력 자동화·UPS 시스템 매출이 +45% 폭증. 글로벌 AI 인프라 수요 + 친환경 전환이 동시 작용. ABB·Siemens·Schneider 3강이 데이터센터 전력 인프라 시장을 양분.',
    tickers: ['ABBNY', 'SIEGY', 'SBGSY'],
    source: 'Reuters',
    url: 'https://www.reuters.com/business/abb-q1-2026',
  },
  {
    id: 'in-n-041',
    category: 'automation',
    type: 'news',
    date: '2026-04-10',
    title: 'Rockwell Automation — 미국 nearshoring 수혜 본격',
    summary: 'ROK가 1분기 매출 +9%로 회복. 미국·멕시코 nearshoring + EV 공장 신축 + 반도체 팹(TSMC 애리조나·Intel 오하이오) 자동화 수요 폭증. PLC·MES·디지털 트윈 시스템 다년간 백오더.',
    tickers: ['ROK', 'EMR'],
    source: 'CNBC',
    url: 'https://www.cnbc.com/2026/04/10/rockwell-automation-q1.html',
  },
  {
    id: 'in-n-042',
    category: 'automation',
    type: 'report',
    date: '2026-02-28',
    title: '[리포트] 휴머노이드 로봇 산업 — Tesla Optimus 2026 출시 예정',
    summary: 'Bloomberg Intelligence. Tesla Optimus 양산형 2026 하반기 출시 예정. 가정·공장용 휴머노이드 로봇 시장이 2030년 $400억 전망. Fanuc·ABB 등 산업로봇 메이저는 휴머노이드와 별도 시장 형성. 산업IoT·디지털 트윈이 핵심.',
    tickers: ['TSLA', 'FANUY', 'ABBNY'],
    source: 'Bloomberg Intelligence',
    url: 'https://www.bloomberg.com/intelligence/humanoid-robots-2030',
  },
];
