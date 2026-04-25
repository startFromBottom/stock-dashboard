// 웹 검색으로 수집한 AI 데이터센터 관련 최신 뉴스 (2026년 기준)
// 업데이트: 2026-04-25

export const NEWS_ITEMS = [
  // ── NVIDIA ──────────────────────────────────────────
  {
    id: 'nvda-1',
    tickers: ['NVDA'],
    category: 'gpu',
    type: 'announcement',
    title: 'NVIDIA Rubin 플랫폼 발표 — 6개 신형 칩과 AI 슈퍼컴퓨터',
    summary: 'Vera CPU·Rubin GPU·NVLink 6·ConnectX-9·BlueField-4·Spectrum-6 등 6개 신형 칩으로 구성된 Rubin 플랫폼 공개. Rubin NVL72 랙 1대에 72개 GPU 탑재, 전력 효율 전 세대 대비 4배↑. AWS·Google·Microsoft·OCI가 2026 H2 첫 배포 예정.',
    date: '2026-01-05',
    source: 'NVIDIA Newsroom',
    url: 'https://nvidianews.nvidia.com/news/rubin-platform-ai-supercomputer',
  },
  {
    id: 'nvda-2',
    tickers: ['NVDA'],
    category: 'gpu',
    type: 'news',
    title: 'NVIDIA, 우주 컴퓨팅 발표 — 궤도 데이터센터에 AI 탑재',
    summary: 'NVIDIA의 최신 가속 컴퓨팅 플랫폼이 우주 혁신의 새 시대를 열어, 궤도 데이터센터·지구공간 인텔리전스·자율 우주 운영에 AI 컴퓨팅을 적용. 우주 인프라 AI 시장 선점 전략.',
    date: '2026-03-29',
    source: 'NVIDIA Newsroom / Motley Fool',
    url: 'https://nvidianews.nvidia.com/news/space-computing',
  },
  {
    id: 'nvda-3',
    tickers: ['NVDA'],
    category: 'gpu',
    type: 'news',
    title: 'GTC 2026: Google Cloud, Vera Rubin NVL72 2026 H2 배포 계획 발표',
    summary: 'Google Cloud가 GTC 2026에서 NVIDIA Vera Rubin NVL72 랙 스케일 시스템을 2026 H2 클라우드 서비스로 최초 출시 예정임을 발표. Microsoft Azure도 위스콘신·애틀랜타 AI 슈퍼팩토리에 통합 계획 공개.',
    date: '2026-03-17',
    source: 'Google Cloud Blog / Microsoft Azure Blog',
    url: 'https://cloud.google.com/blog/products/compute/google-cloud-ai-infrastructure-at-nvidia-gtc-2026',
  },

  // ── Broadcom ─────────────────────────────────────────
  {
    id: 'avgo-1',
    tickers: ['AVGO'],
    category: 'gpu',
    type: 'news',
    title: 'Meta, Broadcom과 1GW AI 칩 파트너십 체결 — 세계 최초 2nm MTIA',
    summary: 'Meta가 Broadcom과 2029년까지 멀티 기가와트 규모 AI 칩 파트너십 체결. MTIA는 세계 최초 2nm 공정 AI ASIC으로 Broadcom 설계. Meta가 AI 칩 설계·서비스에 이미 $23억 지급, 2026년 AI 인프라 $1350억 투자 계획의 핵심.',
    date: '2026-04-14',
    source: 'CNBC',
    url: 'https://www.cnbc.com/2026/04/14/meta-commits-to-one-gigawatt-of-custom-chips-with-broadcom-as-hock-tan-agrees-to-leave-board.html',
  },
  {
    id: 'avgo-2',
    tickers: ['AVGO'],
    category: 'gpu',
    type: 'report',
    title: 'Broadcom AI 매출 FY Q1 106% 급증 — 분기 $84억, 2027년 $1000억 목표',
    summary: 'Broadcom의 AI 매출이 전년 동기 대비 106% 급증하여 분기 $84억 달성, 다음 분기 $107억 가이던스 제시. TrendForce는 커스텀 AI 칩 시장이 2026년 45% 성장, 2033년 $1180억 규모 도달 전망.',
    date: '2026-02-15',
    source: 'IndexBox / TrendForce',
    url: 'https://www.indexbox.io/blog/broadcoms-ai-chip-revenue-surges-in-fiscal-q1-2026/',
  },
  {
    id: 'avgo-3',
    tickers: ['AVGO'],
    category: 'gpu',
    type: 'news',
    title: 'OpenAI, Broadcom과 첫 자체 AI 칩 공동 개발 — 2027년 1GW 배포',
    summary: 'OpenAI가 Broadcom과 협력하여 자체 설계 AI 칩 첫 번째 버전을 개발 중으로 2027년 1GW 이상 컴퓨팅 용량 목표. Broadcom은 맞춤형 AI ASIC 시장 점유율 70%+ 유지.',
    date: '2026-03-05',
    source: 'TrendForce',
    url: 'https://www.trendforce.com/news/2026/03/05/news-broadcom-reportedly-eyes-100b-ai-chip-revenue-in-2027-backed-by-six-key-clients-including-google-meta/',
  },

  // ── SK Hynix ─────────────────────────────────────────
  {
    id: 'skhynix-1',
    tickers: ['000660.KS'],
    category: 'memory',
    type: 'announcement',
    title: 'SK Hynix, CES 2026에서 16단 48GB HBM4 최초 공개',
    summary: 'SK Hynix가 CES 2026에서 세계 최초로 16단 적층 48GB HBM4를 선보임. LPDDR6, SOCAMM2 AI 서버용 저전력 메모리 모듈도 동시 공개. HBM4는 고객사 일정에 맞춰 개발 진행 중.',
    date: '2026-01-06',
    source: 'TrendForce / VideoCardz',
    url: 'https://www.trendforce.com/news/2026/01/06/news-sk-hynix-debuts-16-layer-48gb-hbm4-at-ces-2026-alongside-socamm2-and-lpddr6/',
  },
  {
    id: 'skhynix-2',
    tickers: ['000660.KS'],
    category: 'memory',
    type: 'report',
    title: 'SK Hynix, 1Q26 사상 최대 영업이익 경신 — AI 메모리 수요 지속',
    summary: 'SK Hynix가 2026년 1분기 사상 최대 영업이익을 기록. HBM 시장 점유율 50%+ 유지, HBM3E가 2026년 전체 HBM 출하량의 약 2/3 차지 전망. M15X 팹 1클린룸 2026년 5월 완공·파일럿 가동 예정.',
    date: '2026-04-23',
    source: 'CNBC / SK Hynix IR',
    url: 'https://www.cnbc.com/2026/04/23/sk-hynix-earnings-ai-memory-shortage-hbm-demand.html',
  },
  {
    id: 'skhynix-3',
    tickers: ['000660.KS'],
    category: 'memory',
    type: 'news',
    title: 'SK Hynix 회장, "웨이퍼 부족 2030년까지 지속" 경고 — GTC 2026',
    summary: 'GTC 2026에서 SK Hynix 회장이 AI 메모리 수요 급증에 따른 웨이퍼 공급 부족이 2030년까지 이어질 수 있다고 경고. NVIDIA와의 HBM 파트너십 재확인, 커스텀 HBM 전략 발표.',
    date: '2026-03-17',
    source: 'TrendForce',
    url: 'https://www.trendforce.com/news/2026/03/17/news-sk-hynix-showcases-ai-memory-at-gtc-chairman-warns-wafer-shortage-may-last-until-2030/',
  },

  // ── AMD ──────────────────────────────────────────────
  {
    id: 'amd-1',
    tickers: ['AMD'],
    category: 'gpu',
    type: 'announcement',
    title: 'AMD MI350X·MI355X 출시 — 추론 성능 NVIDIA B200 최대 35배 상회',
    summary: 'AMD가 CDNA 4 아키텍처 기반 MI350X·MI355X AI 가속기를 발표. MI355X는 전 세대 MI300X 대비 최대 4.2배 성능, 특정 추론 워크로드에서 NVIDIA B200·GB200 상회. ROCm 소프트웨어 생태계와 함께 출시.',
    date: '2026-02-20',
    source: 'Tom\'s Hardware / AMD IR',
    url: 'https://www.tomshardware.com/pc-components/gpus/amd-announces-mi350x-and-mi355x-ai-gpus-claims-up-to-4x-generational-gain-up-to-35x-faster-inference-performance',
  },
  {
    id: 'amd-2',
    tickers: ['AMD'],
    category: 'gpu',
    type: 'announcement',
    title: 'AMD MI400 시리즈·Helios 랙 아키텍처 2026년 출시 예정',
    summary: 'AMD가 MI400 시리즈(CDNA 5)와 Helios 풀랙 레퍼런스 아키텍처를 2026년 출시 예정으로 발표. EPYC Venice CPU·MI400 GPU·Pensando Vulcano AI NIC 통합, 72 GPU Scale-Up 260TB/s 대역폭 지원.',
    date: '2026-03-10',
    source: 'WCCFTech / AMD IR',
    url: 'https://wccftech.com/amd-details-plans-for-instinct-ai-gpu-lineup-mi350-to-now-release-by-mid-2025-mi400-lineup-slated-for-2026/',
  },
  {
    id: 'amd-3',
    tickers: ['AMD'],
    category: 'gpu',
    type: 'report',
    title: 'AMD MLPerf Inference 6.0 돌파 — AI 성능 벤치마크 급상승',
    summary: 'AMD가 MLPerf Inference 6.0 벤치마크에서 전 버전 대비 획기적인 성능 향상을 발표. MI355X 기반 결과로 AI 추론 시장에서의 경쟁력을 공식 확인. NVIDIA 독점 구도에 도전장.',
    date: '2026-04-10',
    source: 'AMD Blog',
    url: 'https://www.amd.com/en/blogs/2026/amd-delivers-breakthrough-mlperf-inference-6-0-results.html',
  },

  // ── Arista Networks ───────────────────────────────────
  {
    id: 'anet-1',
    tickers: ['ANET'],
    category: 'ai-network',
    type: 'report',
    title: 'Arista Networks, 2026 AI 네트워킹 목표 $32.5억으로 상향',
    summary: 'Arista가 2026년 AI 네트워킹 매출 목표를 기존 $27.5억에서 $32.5억으로 상향 조정. 2026년 총매출 $100억 돌파 전망. Microsoft·Meta가 각각 매출의 10% 이상 차지.',
    date: '2026-02-13',
    source: 'Next Platform',
    url: 'https://www.nextplatform.com/2026/02/13/the-current-ai-networking-wave-will-be-a-tsunami-of-money-by-2027/',
  },
  {
    id: 'anet-2',
    tickers: ['ANET'],
    category: 'ai-network',
    type: 'news',
    title: 'Meta, Arista 7700R4 스위치로 10만 DPU 규모 AI 클러스터 구축',
    summary: 'Meta가 Arista 7700R4 Distributed Etherlink Switch를 DSF(Disaggregated Scheduled Fabric) 네트워크에 배포. 약 10만 DPU를 지원하는 멀티-티어 네트워크 구조로, Ethernet 기반 대규모 AI 클러스터의 실증 사례.',
    date: '2026-01-20',
    source: 'Network World',
    url: 'https://www.networkworld.com/article/3566785/meta-taps-arista-for-ethernet-based-ai-clusters.html',
  },

  // ── Vertiv ───────────────────────────────────────────
  {
    id: 'vrt-1',
    tickers: ['VRT'],
    category: 'power',
    type: 'announcement',
    title: 'Vertiv, 800VDC 전력·냉각 포트폴리오 NVIDIA 로드맵 연동 — 2026 H2 출시',
    summary: 'Vertiv가 NVIDIA AI 칩 로드맵과 연동한 800VDC 전력·냉각 포트폴리오를 2026 H2 출시 예정으로 발표. AI 데이터센터의 고압 직류 배전이 기존 480V 대비 효율성 대폭 향상.',
    date: '2026-01-09',
    source: 'HPCwire / Vertiv',
    url: 'https://www.hpcwire.com/2026/01/09/vertiv-report-details-how-ai-is-changing-data-center-design-and-operations/',
  },
  {
    id: 'vrt-2',
    tickers: ['VRT'],
    category: 'cooling',
    type: 'announcement',
    title: 'Vertiv MegaMod HDX 출시 — 고밀도 AI 랙용 모듈형 액침냉각',
    summary: 'Vertiv가 고밀도 컴퓨팅(AI·HPC)용 MegaMod HDX 프리팹 전력·액침냉각 통합 모듈을 출시. 북미·EMEA 지역 데이터센터 운영자가 급증하는 전력·냉각 요건을 공간 최적화하며 신속 배포 가능.',
    date: '2026-01-15',
    source: 'PR Newswire / Vertiv',
    url: 'https://www.prnewswire.com/news-releases/vertiv-introduces-new-modular-liquid-cooling-infrastructure-solution-to-support-high-density-compute-requirements-in-north-america-and-emea-302661073.html',
  },
  {
    id: 'vrt-3',
    tickers: ['VRT'],
    category: 'power',
    type: 'report',
    title: 'Vertiv 2026 트렌드 리포트: 디지털 트윈·적응형 액침냉각이 데이터센터 재편',
    summary: 'Vertiv가 발표한 Frontiers 2026 트렌드 리포트에서 AI·디지털 트윈·적응형 액침냉각을 3대 핵심 트렌드로 제시. 디지털 트윈으로 데이터센터 Time-to-Token 최대 50% 단축 가능.',
    date: '2026-01-09',
    source: 'Vertiv Frontiers Report',
    url: 'https://www.vertiv.com/en-us/about/news-and-insights/events/vertiv-2026-trends-and-outlooks-ai-and-high-density-computing/',
  },

  // ── Microsoft ─────────────────────────────────────────
  {
    id: 'msft-1',
    tickers: ['MSFT'],
    category: 'hyperscaler',
    type: 'news',
    title: 'Microsoft Azure, Rubin NVL72 랙 AI 슈퍼팩토리 배포 계획 발표',
    summary: 'Microsoft가 NVIDIA Vera Rubin NVL72 랙을 위스콘신·애틀랜타를 시작으로 차세대 AI 슈퍼팩토리에 통합 배포 계획을 발표. Azure의 전략적 AI 데이터센터 계획이 대규모 Rubin 배포를 원활히 지원.',
    date: '2026-03-17',
    source: 'Microsoft Azure Blog',
    url: 'https://azure.microsoft.com/en-us/blog/microsofts-strategic-ai-datacenter-planning-enables-seamless-large-scale-nvidia-rubin-deployments/',
  },

  // ── Micron ───────────────────────────────────────────
  {
    id: 'mu-1',
    tickers: ['MU'],
    category: 'memory',
    type: 'report',
    title: 'Micron, HBM3E 양산 가속 — AI 수요로 분기 사상 최고 매출',
    summary: 'Micron이 HBM3E 양산을 지속 확대하며 AI 메모리 수요 수혜를 받아 분기 사상 최고 매출을 경신. 2026년 HBM4 진입 준비 중. AI 관련 메모리 매출 비중이 전체의 40%+ 돌파.',
    date: '2026-03-20',
    source: 'Micron IR',
    url: 'https://investors.micron.com',
  },

  // ── Constellation Energy ──────────────────────────────
  {
    id: 'ceg-1',
    tickers: ['CEG'],
    category: 'energy',
    type: 'news',
    title: 'Constellation Energy, AI 데이터센터 원전 직접 공급 계약 급증',
    summary: 'Three Mile Island 원전 재가동(Microsoft 장기 PPA)을 비롯해 AI 데이터센터향 원전 전력 직접 공급 계약이 급증. 탄소 없는 원전 전력이 AI 데이터센터의 RE100·탄소중립 요건을 충족.',
    date: '2026-02-28',
    source: 'Constellation Energy IR',
    url: 'https://investor.constellationenergy.com',
  },
];

// 카테고리별 뉴스 필터링 헬퍼
export function getNewsByCategory(categoryId) {
  return NEWS_ITEMS.filter(n => n.category === categoryId);
}

// 티커별 뉴스 필터링 헬퍼
export function getNewsByTicker(ticker) {
  return NEWS_ITEMS.filter(n => n.tickers.includes(ticker));
}

export const NEWS_TYPE_LABEL = {
  announcement: { label: '발표', color: '#a78bfa', bg: '#2e1065' },
  news:         { label: '뉴스', color: '#60a5fa', bg: '#0c1a2e' },
  report:       { label: '리포트', color: '#4ade80', bg: '#052e16' },
};
