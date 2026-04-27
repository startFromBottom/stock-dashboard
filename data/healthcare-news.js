// 헬스케어·의료기기 섹터 뉴스 데이터 (2025~2026년 기준)
// type: 'news' | 'report'

export const HEALTHCARE_NEWS_TYPE_LABEL = {
  news:   { icon: '📰', label: '뉴스' },
  report: { icon: '📊', label: '리포트' },
};

export const HEALTHCARE_CATEGORY_LABEL = {
  surgical_robot: { icon: '🤖', name: '수술 로봇' },
  imaging_ai:     { icon: '🖼️', name: 'AI 영상진단' },
  medical_it:     { icon: '💻', name: '의료IT' },
  wearable_cgm:   { icon: '⌚', name: '웨어러블·CGM' },
  hospital:       { icon: '🏥', name: '병원·의료서비스' },
  saas_billing:   { icon: '💳', name: '헬스케어 SaaS' },
};

export function countHealthcareByCat(items) {
  const map = {};
  for (const item of items) {
    map[item.category] = (map[item.category] ?? 0) + 1;
  }
  return map;
}

export const HEALTHCARE_NEWS_ITEMS = [
  // ── 수술 로봇 ────────────────────────────────────
  {
    id: 'hc-n-001',
    category: 'surgical_robot',
    type: 'news',
    date: '2026-04-15',
    title: 'Medtronic Hugo RAS 임상 확대 — da Vinci 독점 붕괴 가속',
    summary: 'Medtronic(MDT)의 Hugo RAS 로봇 수술 시스템이 정형외과·신경외과로 임상 적응증을 확대하고 있다. 기존 Intuitive Surgical(ISRG) da Vinci의 독점 지배를 깨고 가격 경쟁력으로 중소 병원 시장까지 확대하면서 수술 로봇 시장의 보편화가 가속화되고 있다.',
    tickers: ['MDT', 'ISRG'],
    source: 'Medical Device Weekly',
    url: 'https://www.medicaldeviceweekly.com/hugo-ras-expansion-2026',
  },
  {
    id: 'hc-n-002',
    category: 'surgical_robot',
    type: 'news',
    date: '2026-03-25',
    title: 'CMR Surgical, Versius 수술 로봇 유럽 병원 30개 거점 확보',
    summary: 'CMR Surgical의 Versius 모듈식 수술 로봇이 영국·독일·스페인 30개 병원과 임상 배치 계약을 체결했다. 컴팩트 설계와 저비용 운영이 중소 병원·외래 수술센터의 로봇 도입을 가능하게 하면서 정형외과·일반 외과 로봇화 시대를 열고 있다.',
    tickers: [],
    source: 'Surgical Innovation',
    url: 'https://www.surgicalinnovation.com/cmr-versius-europe-2026',
  },
  {
    id: 'hc-n-003',
    category: 'surgical_robot',
    type: 'report',
    date: '2026-03-10',
    title: '[리포트] 수술 로봇 시장 2030년 $300억 전망 — da Vinci 점유율 50% 하락',
    summary: 'Frost & Sullivan 분석에 따르면 글로벌 수술 로봇 시장이 2026년 $100억에서 2030년 $300억으로 성장할 전망이다. da Vinci 점유율이 2025년 95%에서 2030년 50%로 하락하면서 Medtronic·CMR·Stryker 등 신규 경쟁자가 시장 점유를 급속 확대할 것으로 예상된다.',
    tickers: ['ISRG', 'MDT', 'SYK'],
    source: 'Frost & Sullivan',
    url: 'https://www.frost.com/research/surgical-robots-market-2030',
  },

  // ── AI 영상진단 ──────────────────────────────────
  {
    id: 'hc-n-004',
    category: 'imaging_ai',
    type: 'news',
    date: '2026-04-12',
    title: 'FDA, AI 의료 영상 진단 누적 1,000개 승인 달성 — 임상 검증 강화',
    summary: 'FDA가 2020년 이후 승인한 AI 의료 영상 진단 제품이 누적 1,000개를 넘어섰다. 유방암·폐암·심장 영상에 특화된 AI가 의사의 진단 정확도를 85%에서 94% 이상으로 높이면서 임상 채택이 급속 확대되고 있다.',
    tickers: ['GE', 'PHI'],
    source: 'FDA Official',
    url: 'https://www.fda.gov/news/ai-medical-imaging-1000-approvals',
  },
  {
    id: 'hc-n-005',
    category: 'imaging_ai',
    type: 'news',
    date: '2026-03-28',
    title: 'Zebra Medical Vision, 대형 병원 네트워크 50곳 AI 영상 배치 완료',
    summary: 'AI 방사선 스크리닝 플랫폼 Zebra Medical Vision이 미국·유럽 대형 병원 네트워크 50곳에 AI 영상 분석 시스템을 배치했다. 폐암·골다공증·심장 영상에 특화된 AI가 일일 800,000개 영상을 분석하면서 의료 인프라의 AI 전환이 구체화되고 있다.',
    tickers: [],
    source: 'Healthcare IT News',
    url: 'https://www.healthcareitnews.com/zebra-medical-50-hospitals',
  },
  {
    id: 'hc-n-006',
    category: 'imaging_ai',
    type: 'report',
    date: '2026-03-05',
    title: '[리포트] AI 의료 영상 시장 2030년 $180억 전망 — 진단 정확도 95% 달성',
    summary: 'McKinsey 보고서는 AI 의료 영상 시장이 2026년 $40억에서 2030년 $180억으로 성장할 것으로 전망했다. GE·Philips·Siemens 같은 대형 의료기기 회사와 Lunit·Subtle Medical 같은 AI 스타트업이 진단 정확도 95% 이상 달성을 목표로 임상 확대 중이다.',
    tickers: ['GE', 'PHI'],
    source: 'McKinsey & Company',
    url: 'https://www.mckinsey.com/industries/healthcare/ai-medical-imaging-2030',
  },

  // ── 의료IT ──────────────────────────────────────
  {
    id: 'hc-n-007',
    category: 'medical_it',
    type: 'news',
    date: '2026-04-10',
    title: '원격진료 시장 폭발 — Teladoc·Amazon 서비스 환자 1천만 명 돌파',
    summary: 'Teladoc Health(TDOC)의 원격진료 플랫폼과 Amazon 약국 클리닉이 누적 환자 1,000만 명을 돌파했다. 보험사의 만성질환 원격진료 급여 확대로 원격 상담이 일반의료의 표준으로 정착되면서 기존 클리닉 수요가 20~30% 감소하는 추이를 보이고 있다.',
    tickers: ['TDOC', 'AMZN'],
    source: 'Digital Health News',
    url: 'https://www.digitalhealthnews.com/teladoc-amazon-10m-patients',
  },
  {
    id: 'hc-n-008',
    category: 'medical_it',
    type: 'news',
    date: '2026-03-20',
    title: 'EHR 상호운용성 의무화 — Epic·Cerner 데이터 포팅 시대 개막',
    summary: '미국 HHS가 HIPAA 규정을 강화해 EHR 간 데이터 포팅을 의무화함에 따라 Epic·Cerner의 진입장벽이 크게 낮아지고 있다. Veradigm·Athena Health 같은 클라우드 기반 EHR 스타트업이 시장 점유를 확대하면서 의료 데이터 개방 시대가 본격화되고 있다.',
    tickers: ['VRDN'],
    source: 'HHS Official',
    url: 'https://www.hhs.gov/news/ehr-interoperability-mandate-2026',
  },
  {
    id: 'hc-n-009',
    category: 'medical_it',
    type: 'report',
    date: '2026-02-28',
    title: '[리포트] 헬스케어 클라우드 시장 2030년 $1,200억 전망 — Google·Microsoft 주도',
    summary: 'Gartner 보고서에 따르면 헬스케어 클라우드 시장이 2026년 $400억에서 2030년 $1,200억으로 성장할 전망이다. Google Cloud·Microsoft Azure·AWS가 EHR·환자 모니터링·AI 진단 통합 플랫폼으로 경쟁하면서 온프레미스 의료 IT 시대가 막을 내리고 있다.',
    tickers: ['GOOGL', 'MSFT'],
    source: 'Gartner',
    url: 'https://www.gartner.com/report/healthcare-cloud-2030',
  },

  // ── 웨어러블·CGM ────────────────────────────────
  {
    id: 'hc-n-010',
    category: 'wearable_cgm',
    type: 'news',
    date: '2026-04-08',
    title: 'Dexcom CGM 비당뇨 사용자 50% 돌파 — 피트니스 시장 확대',
    summary: 'Dexcom(DXCM)의 연속혈당측정기(CGM) 사용자 중 비당뇨 피트니스 애호가가 50%를 넘어섰다. Apple Watch·Oura Ring 같은 일반 웨어러블에도 CGM 통합 기능이 추가되면서 건강 관리 기기의 경계가 무너지고 있다.',
    tickers: ['DXCM', 'AAPL'],
    source: 'Digital Health Weekly',
    url: 'https://www.digitalhealthweekly.com/dexcom-non-diabetic-50percent',
  },
  {
    id: 'hc-n-011',
    category: 'wearable_cgm',
    type: 'news',
    date: '2026-03-15',
    title: 'Abbott FreeStyle Libre, 글로벌 CGM 시장 점유율 30% 달성',
    summary: 'Abbott(ABT)의 스캔 없는 CGM FreeStyle Libre가 글로벌 시장 점유율 30%를 달성했다. Dexcom의 G7와 가격 경쟁을 벌이면서 CGM 보편화가 가속되고 있으며, 의료보험 급여 확대로 비당뇨 인구 접근성이 급속 개선되고 있다.',
    tickers: ['ABT', 'DXCM'],
    source: 'Healthcare Dive',
    url: 'https://www.healthcaredive.com/abbott-freestyle-libre-30percent',
  },
  {
    id: 'hc-n-012',
    category: 'wearable_cgm',
    type: 'report',
    date: '2026-02-20',
    title: '[리포트] 웨어러블 헬스 센서 시장 2030년 $500억 전망 — 의료 기기화 가속',
    summary: 'IDC 보고서는 웨어러블 헬스 센서 시장이 2026년 $150억에서 2030년 $500억으로 성장할 전망이다. 심방세동 감지·낙상 위험 예측 같은 의료용 기능이 Apple Watch·Whoop 같은 소비자 제품에 통합되면서 헬스케어와 웨어러블의 경계가 소멸하고 있다.',
    tickers: ['AAPL', 'GRMN'],
    source: 'IDC',
    url: 'https://www.idc.com/wearables-health-market-2030',
  },

  // ── 병원·의료서비스 ──────────────────────────────
  {
    id: 'hc-n-013',
    category: 'hospital',
    type: 'news',
    date: '2026-04-05',
    title: 'UnitedHealth Optum, 의료 VIC 모델로 의료비 20% 절감 달성',
    summary: 'UnitedHealth(UNH)의 Optum이 의료보험·병원·약국·의료기기·IT를 통합한 VIC 모델로 의료비를 20% 절감했다고 발표했다. 이 모델이 글로벌 헬스케어 통합의 새로운 기준이 되면서 CVS·Amazon 등 다른 대형사도 추종 중이다.',
    tickers: ['UNH'],
    source: 'Medical Economics',
    url: 'https://www.medicaleconomics.com/unitedhealth-optum-20percent',
  },
  {
    id: 'hc-n-014',
    category: 'hospital',
    type: 'news',
    date: '2026-03-22',
    title: 'IHH Healthcare, 유럽 진출 발표 — 아시아 병원 체인 글로벌 확장',
    summary: 'IHH Healthcare(5225.KL)가 유럽 10개국에 병원 네트워크 구축 계획을 발표했다. 아시아 의료 관광이 회복되면서 Parkway Pantai 같은 프리미엄 병원 체인이 고급 의료 서비스로 글로벌 시장을 확대하고 있다.',
    tickers: [],
    source: 'Global Healthcare Report',
    url: 'https://www.globalhealthcarereport.com/iih-europe-expansion',
  },
  {
    id: 'hc-n-015',
    category: 'hospital',
    type: 'report',
    date: '2026-03-01',
    title: '[리포트] 병원 체인 M&A 2030년 $3,000억 전망 — 의료 통합 가속',
    summary: 'Goldman Sachs 보고서는 병원 체인 M&A가 2026년 $1,500억에서 2030년 $3,000억으로 성장할 전망이다. 의료 서비스의 규모화·효율화 추세가 강화되면서 소규모 병원의 대형 체인 편입이 가속되고 있다.',
    tickers: ['UNH', 'CVS'],
    source: 'Goldman Sachs',
    url: 'https://www.goldmansachs.com/hospital-ma-2030',
  },

  // ── 헬스케어 SaaS ────────────────────────────────
  {
    id: 'hc-n-016',
    category: 'saas_billing',
    type: 'news',
    date: '2026-04-02',
    title: 'Optum, AI 청구 자동화로 의료 청구 오류율 5% 이하로 감축',
    summary: 'Optum의 AI 청구 시스템이 의료 청구 오류율을 기존 30%에서 5% 이하로 감축했다. 보험금 회수율이 95% 이상으로 올라가면서 의료 청구 자동화가 헬스케어 비용 절감의 핵심 전략으로 부상하고 있다.',
    tickers: ['UNH'],
    source: 'Health Finance News',
    url: 'https://www.healthfinancenews.com/optum-ai-billing',
  },
  {
    id: 'hc-n-017',
    category: 'saas_billing',
    type: 'news',
    date: '2026-03-10',
    title: 'Veradigm, EHR·청구 통합 플랫폼 메이저 보험사 5곳 계약',
    summary: 'Veradigm(VRDN)의 EHR·청구 통합 플랫폼이 메이저 의료보험사 5곳과 계약을 체결했다. 클라우드 기반 의료 SaaS가 온프레미스 솔루션을 대체하면서 의료 데이터 통합·자동화 시대가 본격화되고 있다.',
    tickers: ['VRDN'],
    source: 'Healthcare IT News',
    url: 'https://www.healthcareitnews.com/veradigm-billing-integration',
  },
  {
    id: 'hc-n-018',
    category: 'saas_billing',
    type: 'report',
    date: '2026-02-15',
    title: '[리포트] 헬스케어 SaaS 시장 2030년 $800억 전망 — 청구·의료IT 통합',
    summary: 'Forrester 보고서는 헬스케어 SaaS 시장이 2026년 $300억에서 2030년 $800억으로 성장할 전망이다. EHR·청구·환자 참여 통합 플랫폼이 의료 기관의 운영 효율화를 주도하면서 SaaS 채택이 급속 확대되고 있다.',
    tickers: ['VRDN', 'NXGN'],
    source: 'Forrester',
    url: 'https://www.forrester.com/healthcare-saas-2030',
  },
];
