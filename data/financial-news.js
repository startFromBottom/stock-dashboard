// 금융(Financial Services) 섹터 뉴스 데이터 (2025~2026년 기준)

export const FINANCIAL_NEWS_TYPE_LABEL = {
  news:   { icon: '📰', label: '뉴스' },
  report: { icon: '📊', label: '리포트' },
};

export const FINANCIAL_CATEGORY_LABEL = {
  big_banks:        { icon: '🏦', name: '대형 은행' },
  asset_managers:   { icon: '📊', name: '자산운용·증권' },
  insurers:         { icon: '🛡️', name: '보험' },
  card_networks:    { icon: '💳', name: '결제 네트워크' },
  exchanges_data:   { icon: '📈', name: '거래소·인프라' },
};

export function countFinancialByCat(items) {
  const map = {};
  for (const item of items) {
    map[item.category] = (map[item.category] ?? 0) + 1;
  }
  return map;
}

export const FINANCIAL_NEWS_ITEMS = [
  // ── 대형 은행 ─────────────────────────────────────
  {
    id: 'fn-n-001',
    category: 'big_banks',
    type: 'news',
    date: '2026-04-25',
    title: 'JPMorgan 1Q26 어닝 비트 — 트레이딩+IB 두 자릿수 회복',
    summary: 'JPM이 1분기 매출 +8%, 영업이익 +12%로 컨센서스 상회. 트레이딩 +18%, IB 자문 +25% 회복. NIM 안정화 + 신용 손실 충당금 감소가 영업이익 견인. Jamie Dimon은 "경제는 견고하지만 신중한 낙관"이라 평가.',
    tickers: ['JPM'],
    source: 'CNBC',
    url: 'https://www.cnbc.com/2026/04/25/jpmorgan-q1-2026.html',
  },
  {
    id: 'fn-n-002',
    category: 'big_banks',
    type: 'news',
    date: '2026-04-12',
    title: 'Wells Fargo 자산 상한 규제 해제 후 1년 — 매출 회복 본격',
    summary: 'WFC가 2018년 부과된 $1.95조 자산 상한 규제 해제 후 1년 만에 매출 +9% 성장. 소매뱅킹·기업금융 양쪽 모두 회복. CEO Charlie Scharf는 "구조조정 마무리 단계"라고 평가.',
    tickers: ['WFC'],
    source: 'Reuters',
    url: 'https://www.reuters.com/business/finance/wells-fargo-2026',
  },
  {
    id: 'fn-n-003',
    category: 'big_banks',
    type: 'report',
    date: '2026-03-22',
    title: '[리포트] 은행 어닝 시즌 2026 — Big 4 ROE 15%+ 안정화',
    summary: 'Goldman Sachs 분석. 미국 Big 4 은행(JPM·BAC·WFC·C)의 ROE가 2024년 13%대에서 2026년 15%+로 회복. 고금리 NIM + 트레이딩 호황 + 자본환원(자사주 매입+배당) 유지. 은행주는 시장 대비 +20% 누적 성과.',
    tickers: ['JPM', 'BAC', 'WFC', 'C'],
    source: 'Goldman Sachs Equity Research',
    url: 'https://www.gs.com/research/banks-2026',
  },

  // ── 자산운용·증권 ─────────────────────────────────
  {
    id: 'fn-n-010',
    category: 'asset_managers',
    type: 'news',
    date: '2026-04-20',
    title: 'BlackRock AUM $11.5조 돌파 — Bitcoin ETF 자금 유입 가속',
    summary: 'BLK가 1분기 운용자산 $11.5조 돌파. iShares Bitcoin ETF(IBIT) AUM $400억 돌파로 단일 ETF 사상 최단기 성장 기록. Larry Fink는 "민간 자산·디지털 자산 두 트렌드"가 향후 5년 핵심이라 강조.',
    tickers: ['BLK'],
    source: 'Financial Times',
    url: 'https://www.ft.com/content/blackrock-aum-11trillion-2026',
  },
  {
    id: 'fn-n-011',
    category: 'asset_managers',
    type: 'news',
    date: '2026-04-08',
    title: 'Goldman Sachs IB 자문 매출 +28% — M&A 시장 회복',
    summary: 'GS의 IB 자문 부문이 1분기 매출 +28%로 4분기 연속 두 자릿수 성장. 미국 M&A 거래 규모 +35%, IPO 시장 회복 + Sponsor M&A(PE 거래) 활성화가 핵심 동력. MS와 함께 월스트리트 정점 회복.',
    tickers: ['GS', 'MS'],
    source: 'Wall Street Journal',
    url: 'https://www.wsj.com/articles/goldman-sachs-ib-q1-2026',
  },
  {
    id: 'fn-n-012',
    category: 'asset_managers',
    type: 'report',
    date: '2026-03-15',
    title: '[리포트] 사모펀드(PE) 산업 회복 — Blackstone·KKR·Apollo 3강',
    summary: 'McKinsey. 사모펀드 시장이 2024년 침체에서 회복 단계 진입. 출구(엑시트) 거래 +40%, 신규 펀드레이징 +25%. BX는 부동산 회복, KKR은 보험 통합 확장, APO는 사모 신용 시장 1위 굳히기. AUM 합계 $3조+ 돌파.',
    tickers: ['BX', 'KKR', 'APO'],
    source: 'McKinsey & Company',
    url: 'https://www.mckinsey.com/industries/private-equity/2026',
  },

  // ── 보험 ─────────────────────────────────────────
  {
    id: 'fn-n-020',
    category: 'insurers',
    type: 'news',
    date: '2026-04-18',
    title: 'UnitedHealth 1Q26 — Medical Loss Ratio 안정화',
    summary: 'UNH가 1분기 매출 +8%, EPS +6%로 컨센서스 부합. 의료비 청구율(MLR) 84%로 안정화 — 2024년 87% 정점 후 회복세. Optum 의료서비스 매출 +12%로 견인. 사이버 보안 사고 영향 일단락.',
    tickers: ['UNH'],
    source: 'CNBC',
    url: 'https://www.cnbc.com/2026/04/18/unitedhealth-q1-2026.html',
  },
  {
    id: 'fn-n-021',
    category: 'insurers',
    type: 'news',
    date: '2026-03-30',
    title: 'Progressive 자동차 보험 점유율 1위 등극 — GEICO 추월',
    summary: 'PGR이 미국 자동차 보험 점유율에서 GEICO를 처음 추월. 텔레매틱스 데이터 + AI 가격책정으로 우량 운전자 확보. Snapshot 가입자 1,500만 명 돌파. 영업이익률 14%대 — 자동차 보험 업계 최고 수준.',
    tickers: ['PGR', 'BRK.B'],
    source: 'Insurance Journal',
    url: 'https://www.insurancejournal.com/2026/03/progressive-no1',
  },
  {
    id: 'fn-n-022',
    category: 'insurers',
    type: 'report',
    date: '2026-03-08',
    title: '[리포트] 재보험료 8년 연속 인상 — 기후 리스크 + 자연재해',
    summary: 'S&P Global Ratings. 글로벌 재보험료가 2026년 +12% 인상되며 8년 연속 상승. 미국 허리케인·가뭄·산불 + 유럽 홍수가 재보험사 손실 키움. Munich Re·Swiss Re·Hannover Re 3강은 가격 결정력으로 마진 회복.',
    tickers: ['MURGY'],
    source: 'S&P Global Ratings',
    url: 'https://www.spglobal.com/ratings/reinsurance-2026',
  },

  // ── 결제 네트워크 ─────────────────────────────────
  {
    id: 'fn-n-030',
    category: 'card_networks',
    type: 'news',
    date: '2026-04-22',
    title: 'Visa·Mastercard 1Q26 — 글로벌 결제 거래액 두 자릿수 성장',
    summary: 'V는 결제 거래액 +11%, MA는 +12%로 컨센서스 상회. 국경 간 거래(cross-border) +15%로 회복 견인 — 여행·국제 e커머스 회복이 핵심. 영업이익률 V 67%, MA 58%로 업계 최고 수준 유지.',
    tickers: ['V', 'MA'],
    source: 'Reuters',
    url: 'https://www.reuters.com/business/visa-mastercard-q1-2026',
  },
  {
    id: 'fn-n-031',
    category: 'card_networks',
    type: 'news',
    date: '2026-04-05',
    title: 'Capital One·Discover 합병 정식 마무리 — 미국 결제 4강 재편',
    summary: 'COF의 DFS $350억 인수 정식 종결. 결합 시총 $1,200억+. 미국 신용카드 발행 + 자체 결제 네트워크 통합으로 V·MA·AXP 3강에 도전. CEO Richard Fairbank는 "장기적으로 발행+네트워크 시너지"라 평가.',
    tickers: ['COF', 'DFS'],
    source: 'Wall Street Journal',
    url: 'https://www.wsj.com/articles/capital-one-discover-closes-2026',
  },
  {
    id: 'fn-n-032',
    category: 'card_networks',
    type: 'report',
    date: '2026-02-25',
    title: '[리포트] BNPL(Buy Now Pay Later) 시장 둔화 — Affirm·Klarna 회복 지연',
    summary: 'Bloomberg Intelligence. BNPL 시장이 2024년 정점 후 -8% 둔화. 신용 손실 증가 + 규제 강화(미국 CFPB)가 마진 압박. AFRM·KLAR 같은 메이저는 흑자 전환 지연. 전통 카드 네트워크(V·MA)에는 우호적 환경.',
    tickers: ['AFRM', 'V', 'MA'],
    source: 'Bloomberg Intelligence',
    url: 'https://www.bloomberg.com/intelligence/bnpl-2026',
  },

  // ── 거래소·인프라 ──────────────────────────────────
  {
    id: 'fn-n-040',
    category: 'exchanges_data',
    type: 'news',
    date: '2026-04-15',
    title: 'S&P Global 1Q26 — Ratings + Indices 두 부문 두 자릿수 성장',
    summary: 'SPGI가 1분기 매출 +12%, 영업이익 +18%로 사상 최대 분기 어닝 갱신. 신용평가 부문 +14% (회사채 발행 회복), 인덱스 부문 +15% (ETF AUM 사상 최대). Buffett 보유주 안정성 입증.',
    tickers: ['SPGI'],
    source: 'CNBC',
    url: 'https://www.cnbc.com/2026/04/15/spglobal-q1-2026.html',
  },
  {
    id: 'fn-n-041',
    category: 'exchanges_data',
    type: 'news',
    date: '2026-03-28',
    title: 'CME Group 비트코인·암호화폐 선물 거래량 +60%',
    summary: 'CME가 1분기 BTC·ETH 선물 + 옵션 거래량이 사상 최대 갱신. 미국 SEC의 Bitcoin ETF 승인 후 기관투자자 헷지 수요 폭증. CME의 디지털 자산 부문 매출 +60%로 전체 성장 동력 확보.',
    tickers: ['CME'],
    source: 'Bloomberg',
    url: 'https://www.bloomberg.com/news/cme-bitcoin-2026',
  },
  {
    id: 'fn-n-042',
    category: 'exchanges_data',
    type: 'report',
    date: '2026-02-15',
    title: '[리포트] MSCI 인덱스 라이선싱 매출 — ESG ETF 회복 견인',
    summary: 'Morgan Stanley. MSCI의 인덱스 라이선싱 매출이 2024년 ESG 자금 유출로 -3% 둔화 후 2026년 +9% 회복. 미국·유럽 ESG ETF 자금 유입 재개 + 신규 인덱스(AI·기후) 출시가 동력. MSCI 영업이익률 60% 유지.',
    tickers: ['MSCI'],
    source: 'Morgan Stanley Equity Research',
    url: 'https://www.morganstanley.com/research/msci-2026',
  },
];
