// 헬스케어·의료기기 섹터 밸류체인 데이터 (2026년 기준)
// 밸류체인: 의료기기 → 의료IT/디지털헬스 → 의료 서비스 & 인프라 → 헬스케어 SaaS/결제
// candidates[]: 각 카테고리별 후보풀 (10~15개)
// API로 시총 가져와 내림차순 정렬 → 상위 10개 동적 표시

export const HEALTHCARE_LAYERS = [
  // ─── 레이어 1: 의료기기 (Medical Devices) ─────────────────────────
  {
    id: 'medical_devices',
    layer: '🏥 의료기기 (Medical Devices)',
    components: [
      {
        id: 'surgical_robotics',
        icon: '🤖',
        name: '수술 로봇 & 최소침습 기술',
        desc: '수술 정밀도·복구력 혁신',
        detail: [
          '수술 로봇은 외과 의사의 손떨림을 제거하고 카메라를 통해 초미세 수술을 가능하게 한다. Intuitive Surgical의 da Vinci 시스템은 전 세계 6,000대 이상 설치되어 복부·비뇨기·부인과 수술의 표준이 됐고, 이제 경비용종 제거·담도 수술 등 저침습 영역으로 확장 중이다.',
          'AI 기반 수술 가이드가 정밀도를 한 단계 높이고 있다. CMR Surgical의 Versius 같은 소형 모듈식 로봇은 병원 수술실 공간 제약을 극복하고, Medtronic의 Hugo RAS는 비용을 낮춰 중소 병원 보급을 가속하고 있다. 수술 로봇 시장은 연 15% 이상 성장할 것으로 예상된다.',
        ],
        candidates: [
          { rank: 1,  name: 'Intuitive Surgical',        ticker: 'ISRG',    mktcap: '~$960억',   detail: 'da Vinci 수술 로봇 시장 독점. 전 세계 6,000+ 시스템 설치. 단일 관 로봇(Inguinal) 개발 중', ir: 'https://investor.intuitivesurgical.com', news: 'https://www.intuitivesurgical.com/newsroom', x: 'https://x.com/search?q=Intuitive+Surgical+da+Vinci+2026' },
          { rank: 2,  name: 'Medtronic',                  ticker: 'MDT',     mktcap: '~$1,100억',  detail: 'Hugo RAS 로봇 수술 시스템. 가성비 높은 수술 로봇으로 시장 확대 중. 심장·신경외과 로봇 개발', ir: 'https://investors.medtronic.com', news: 'https://www.medtronic.com/en-us/newsroom', x: 'https://x.com/search?q=Medtronic+Hugo+RAS+2026' },
          { rank: 3,  name: 'CMR Surgical',               ticker: 'Private', mktcap: '~$30억',    detail: 'Versius 모듈식 수술 로봇 — 임상 채택 확대. 컴팩트 설계로 중소 병원 시장 타겟. 2026 FDA 승인 목표', ir: 'https://www.cmrsurgical.com', news: 'https://www.cmrsurgical.com/news', x: 'https://x.com/search?q=CMR+Surgical+Versius+2026' },
          { rank: 4,  name: 'Johnson & Johnson',          ticker: 'JNJ',     mktcap: '~$4,200억',  detail: 'Ethicon·DePuy 수술기기 부문. 내시경 수술 기계(EndoAssist) 개발 중. 종합 수술 기기 포트폴리오', ir: 'https://investors.jnj.com', news: 'https://www.jnj.com/news', x: 'https://x.com/search?q=Johnson+Johnson+surgical+robot+2026' },
          { rank: 5,  name: 'Stryker Corporation',        ticker: 'SYK',     mktcap: '~$800억',    detail: 'Mako 로봇 무릎·고관절 수술 시스템. Neuronavigation 신경외과 가이드 시스템. 정형외과 수술 로봇 선도', ir: 'https://investors.stryker.com', news: 'https://www.stryker.com/newsroom', x: 'https://x.com/search?q=Stryker+Mako+robot+2026' },
          { rank: 6,  name: 'Zimmer Biomet',              ticker: 'ZBH',     mktcap: '~$300억',    detail: 'Robodoc 무릎·고관절 로봇 수술 시스템. 정형외과 AI 가이드. Persona 커스텀 임플란트 AI 설계', ir: 'https://investors.zimmerbiometholdingsco.com', news: 'https://www.zimmerbiometholdingsco.com/news', x: 'https://x.com/search?q=Zimmer+Biomet+Robodoc+2026' },
          { rank: 7,  name: 'Smith & Nephew',             ticker: 'SNN.L',   mktcap: '~$200억',    detail: 'SPRINT Robotic 극소형 척추 수술 로봇. 내시경 부위별 로봇 기술 개발. 정형외과·재구성 플랫폼', ir: 'https://investors.smith-nephew.com', news: 'https://www.smith-nephew.com/en/news', x: 'https://x.com/search?q=Smith+Nephew+SPRINT+robot+2026' },
          { rank: 8,  name: 'Align Technology',           ticker: 'ALGN',    mktcap: '~$150억',    detail: 'iTero 3D 치과 스캔·가상 수술 시뮬레이션. 교정용 로봇 치과 기기. 치과 디지털화 선도', ir: 'https://investors.aligntech.com', news: 'https://www.aligntech.com/newsroom', x: 'https://x.com/search?q=Align+Technology+iTero+2026' },
          { rank: 9,  name: 'Accuray',                    ticker: 'ARAY',    mktcap: '~$10억',     detail: 'CyberKnife·TomoTherapy 방사선 수술 로봇. 뇌·척추·종양 정위적 방사선수술 시스템. 글로벌 300+ 거점', ir: 'https://investors.accuray.com', news: 'https://www.accuray.com/newsroom', x: 'https://x.com/search?q=Accuray+CyberKnife+2026' },
          { rank: 10, name: 'Asensus Surgical',           ticker: 'ASXC',    mktcap: '~$2억',      detail: 'Senhance 디지털 수술 플랫폼. 원격 수술·AI 수술 가이드 기술. FDA 최근 승인 순수 수술 로봇 스타트업', ir: 'https://investors.asensus.com', news: 'https://www.asensus.com/newsroom', x: 'https://x.com/search?q=Asensus+Senhance+2026' },
          { rank: 11, name: 'KARL STORZ Endoscopy',       ticker: 'Private', mktcap: 'N/A',        detail: '독일 내시경·미니침습 수술 기기 전문. 고화질 4K 카메라·AR 오버레이 기술. 비정부 유한책임회사', ir: 'https://www.karlstorz.com', news: 'https://www.karlstorz.com/news', x: 'https://x.com/search?q=KARL+STORZ+endoscopy+2026' },
          { rank: 12, name: 'Wolf Corporation',            ticker: 'Private', mktcap: 'N/A',        detail: '독일 미니침습 수술기기·내시경 제조. 의료용 카메라·광학 기술 선도. 아사히유리 소유', ir: 'https://www.wolfendoscopy.de', news: 'https://www.wolfendoscopy.de/news', x: 'https://x.com/search?q=Wolf+Endoscopy+surgical+2026' },
        ],
      },
      {
        id: 'diagnostic_imaging',
        icon: '🖼️',
        name: 'AI 영상진단 & 진단 기기',
        desc: '의료 영상 AI 분석·조기 진단',
        detail: [
          'AI 의료 영상 분석은 CT·MRI·X선·초음파의 해석을 자동화하고 조기 진단 정확도를 높인다. GE Healthcare·Philips·Siemens 같은 거대 기업들이 AI 영상 제품을 확대하고 있으며, 스타트업들은 특정 질환(유방암·폐암·심장병)에 특화된 AI 모델을 개발 중이다. FDA 승인 AI 의료 영상 제품은 2020년 100개 미만에서 2026년 500개 이상으로 급증했다.',
          '특히 유방암 진단·폐결절 분류·심장 영상 분석 같은 고위험 영역에서 AI는 의사의 진단 정확도를 85%에서 94% 이상으로 높인다. Contextual AI·Zebra Medical Vision·Subtle Medical 같은 AI 영상 스타트업들이 대형 의료기기사에 인수되거나 파트너십을 확대하고 있다.',
        ],
        candidates: [
          { rank: 1,  name: 'GE Healthcare',              ticker: 'GE',      mktcap: '~$750억',    detail: 'CT·MRI·초음파·X선 기계. Edison AI 플랫폼 병합. 방사선 AI 진단 시스템 FDA 승인 다수', ir: 'https://investors.ge.com', news: 'https://www.gehealthcare.com/newsroom', x: 'https://x.com/search?q=GE+Healthcare+AI+imaging+2026' },
          { rank: 2,  name: 'Philips Healthcare',         ticker: 'PHI.AS',  mktcap: '~$400억',    detail: '진단 영상·치료 장비 선도. AI 영상 해석·환자 모니터링 플랫폼 통합 중. HealthSuite 클라우드 플랫폼', ir: 'https://investors.philips.com', news: 'https://www.philips.com/en/corporate/news', x: 'https://x.com/search?q=Philips+Healthcare+AI+2026' },
          { rank: 3,  name: 'Siemens Healthineers',       ticker: 'SHL.DE',  mktcap: '~$350억',    detail: '의료 영상 기계 세계 2위. Healthineers@home AI 클라우드 진단 플랫폼. 방사선·병리 AI 투자 확대', ir: 'https://siemenshealthineers.com/en-us/newsroom', news: 'https://www.siemens-healthineers.com/news', x: 'https://x.com/search?q=Siemens+Healthineers+AI+2026' },
          { rank: 4,  name: 'Zebra Medical Vision',       ticker: 'Private', mktcap: '~$5억',      detail: 'AI 방사선 스크리닝 플랫폼. 폐암·골다공증·심장 질환 AI 분석. IBM Watson Health 인수 합병 대상', ir: 'https://www.zebra-medical.com', news: 'https://www.zebra-medical.com/news', x: 'https://x.com/search?q=Zebra+Medical+Vision+AI+2026' },
          { rank: 5,  name: 'Subtle Medical',             ticker: 'Private', mktcap: '~$3억',      detail: 'AI 의료 영상 노이즈 제거·해상도 강화. CT·MRI·초음파 품질 개선. Google Cloud 파트너', ir: 'https://www.subtlemedical.com', news: 'https://www.subtlemedical.com/news', x: 'https://x.com/search?q=Subtle+Medical+AI+imaging+2026' },
          { rank: 6,  name: 'Contextual AI',              ticker: 'Private', mktcap: '~$2억',      detail: 'AI 병리 진단·암 분류. 디지털 병리(WSI) AI 분석. Roche 파트너십 중', ir: 'https://www.contextualai.com', news: 'https://www.contextualai.com/news', x: 'https://x.com/search?q=Contextual+AI+pathology+2026' },
          { rank: 7,  name: 'Tempus AI',                  ticker: 'TEM',     mktcap: '~$70억',     detail: '임상 데이터 + 영상 AI 플랫폼. 종양·심장·뇌 질환 AI 진단. Cerner EHR 통합 중', ir: 'https://investors.tempus.com', news: 'https://www.tempus.com/news', x: 'https://x.com/search?q=Tempus+AI+imaging+2026' },
          { rank: 8,  name: 'Lunit',                      ticker: 'Private', mktcap: '~$5억',      detail: '한국 AI 의료 영상 스타트업. 유방암·폐암·간암 AI 진단. 글로벌 임상 검증 진행 중', ir: 'https://www.lunit.io', news: 'https://www.lunit.io/news', x: 'https://x.com/search?q=Lunit+AI+medical+imaging+2026' },
          { rank: 9,  name: 'Caption Health',             ticker: 'Private', mktcap: '~$2억',      detail: 'AI 초음파 가이드. 손떨림 보정·표준화된 영상 취득. 심초음파 진단 자동화 플랫폼', ir: 'https://www.captionhealth.com', news: 'https://www.captionhealth.com/news', x: 'https://x.com/search?q=Caption+Health+ultrasound+AI+2026' },
          { rank: 10, name: 'Arterys',                    ticker: 'Private', mktcap: '~$1억',      detail: 'AI 심장 영상 분석. 좌심실 기능 자동 측정. FDA 510(k) 승인 심초음파·CT 플랫폼', ir: 'https://www.arterys.com', news: 'https://www.arterys.com/news', x: 'https://x.com/search?q=Arterys+cardiac+AI+2026' },
          { rank: 11, name: '3D Systems',                 ticker: 'DDD',     mktcap: '~$20억',     detail: '3D 의료 영상 재구성·3D 프린팅 기술. 수술 계획·의료기기 맞춤형 제조. 의료용 소프트웨어 플랫폼', ir: 'https://investors.3dsystems.com', news: 'https://www.3dsystems.com/newsroom', x: 'https://x.com/search?q=3D+Systems+medical+imaging+2026' },
          { rank: 12, name: 'Mindray',                    ticker: '0885.HK', mktcap: '~$400억',    detail: '중국 초음파·모니터링 기기 선도. AI 초음파 이미징 기술. 글로벌 의료기기 회사로 성장 중', ir: 'https://ir.mindray.com', news: 'https://www.mindray.com/en/news', x: 'https://x.com/search?q=Mindray+ultrasound+2026' },
        ],
      },
    ],
  },

  // ─── 레이어 2: 의료IT & 디지털헬스 ─────────────────────────
  {
    id: 'medical_it',
    layer: '💻 의료IT & 디지털헬스',
    components: [
      {
        id: 'ehrs_digital',
        icon: '💻',
        name: '전자의료기록(EHR) & 의료 소프트웨어',
        desc: '병원 데이터 통합·임상 의사결정 지원',
        detail: [
          '전자의료기록(EHR)은 의료 빅데이터의 핵심이며, AI 진단·의사결정 지원(CDSS)의 연료다. Epic·Cerner·Medidata 같은 EHR 플랫폼이 미국 병원 70%를 점유하며, 이제 AI 기반 임상 인사이트·환자 모니터링·자동화된 의료비 청구로 확장 중이다.',
          '클라우드 기반 EHR이 주류가 되면서 Veradigm·Allscripts 같은 중형 EHR 회사들이 Amazon HealthLake·Google Cloud Healthcare 같은 클라우드 제공자에 의해 재편되고 있다. 의료 데이터 표준화(FHIR) 확대로 EHR 간 상호운용성이 높아져 스타트업의 참여 기회가 늘고 있다.',
        ],
        candidates: [
          { rank: 1,  name: 'Epic Systems',               ticker: 'Private', mktcap: '~$200억',    detail: 'EHR 시장 선도. 미국 대형 병원 50%+ 점유. AI 임상 인사이트 플랫폼 Cogito·Recognized 개발', ir: 'https://www.epic.com', news: 'https://www.epic.com/newsroom', x: 'https://x.com/search?q=Epic+Systems+EHR+2026' },
          { rank: 2,  name: 'Cerner (Oracle)',            ticker: 'ORCL',    mktcap: '~$3,200억',  detail: 'Oracle 인수(2022). EHR·헬스케어 IT 플랫폼. Veterans Affairs 계약 최대화 중', ir: 'https://www.oracle.com/investors/', news: 'https://www.oracle.com/news/', x: 'https://x.com/search?q=Oracle+Cerner+EHR+2026' },
          { rank: 3,  name: 'Veradigm',                   ticker: 'VRDN',    mktcap: '~$70억',     detail: 'Allscripts에서 분사한 EHR·헬스 데이터 플랫폼. 1억+ 환자 데이터. Salesforce Healthcare Cloud 통합', ir: 'https://investors.veradigm.com', news: 'https://www.veradigm.com/newsroom', x: 'https://x.com/search?q=Veradigm+EHR+healthcare+data+2026' },
          { rank: 4,  name: 'Medidata Solutions',         ticker: 'MDSO',    mktcap: '~$50억',     detail: 'Dassault Systèmes 인수 자회사. 임상시험 데이터 플랫폼. AI 환자 선별·위험 예측 기술', ir: 'https://investors.medidata.com', news: 'https://www.medidata.com/newsroom', x: 'https://x.com/search?q=Medidata+clinical+data+2026' },
          { rank: 5,  name: 'Henry Schein One',           ticker: 'HSIC',    mktcap: '~$150억',    detail: 'Henry Schein 치과·의료 소프트웨어 부문. 의료 데이터 통합·의료비 청구 자동화. 중소 의료기관 타겟', ir: 'https://investors.henryschein.com', news: 'https://www.henryschein.com/news', x: 'https://x.com/search?q=Henry+Schein+One+healthcare+IT+2026' },
          { rank: 6,  name: 'Teladoc Health',             ticker: 'TDOC',    mktcap: '~$20억',     detail: '원격 진료 플랫폼. AI 환자 분류·심리 상담봇 기술. 행동 건강 데이터 플랫폼 Livongo 인수', ir: 'https://investors.teladoc.com', news: 'https://teladoc.com/news', x: 'https://x.com/search?q=Teladoc+telehealth+2026' },
          { rank: 7,  name: 'Optum Health',               ticker: 'UNH',     mktcap: '~$5,000억',  detail: 'UnitedHealth 의료 IT 부문. OptumInsight 헬스케어 데이터 분석. 1억+ 환자 데이터 통합', ir: 'https://investors.unitedhealthgroup.com', news: 'https://newsroom.unitedhealthgroup.com', x: 'https://x.com/search?q=UnitedHealth+Optum+healthcare+IT+2026' },
          { rank: 8,  name: 'Allscripts',                 ticker: 'MDRX',    mktcap: '~$30억',     detail: '독립형 EHR·의료 소프트웨어 기업. 소형 의료기관 특화. Open EHR 전략', ir: 'https://investors.allscripts.com', news: 'https://www.allscripts.com/newsroom', x: 'https://x.com/search?q=Allscripts+EHR+2026' },
          { rank: 9,  name: 'Athena Health',              ticker: 'Private', mktcap: '~$200억',    detail: '클라우드 의료 IT. EHR·의료비 청구·환자 참여 통합. Sunflower Health 헬스플랜 시작', ir: 'https://www.athenahealth.com', news: 'https://www.athenahealth.com/newsroom', x: 'https://x.com/search?q=Athena+Health+cloud+healthcare+2026' },
          { rank: 10, name: 'Nextgen Healthcare',         ticker: 'NXGN',    mktcap: '~$20억',     detail: '클라우드 의료 소프트웨어. 소형·독립형 의료기관 1위 제공자. Clarity AI 임상 인사이트', ir: 'https://investors.nextgen.com', news: 'https://www.nextgen.com/newsroom', x: 'https://x.com/search?q=NextGen+Healthcare+EHR+2026' },
          { rank: 11, name: 'Practice Fusion',            ticker: 'Private', mktcap: '~$5억',      detail: '클라우드 EHR 스타트업. 소형 의료기관 무료·저가 모델. AllScripts 경쟁 시작', ir: 'https://www.practicefusion.com', news: 'https://www.practicefusion.com/news', x: 'https://x.com/search?q=Practice+Fusion+EHR+2026' },
          { rank: 12, name: 'Care.com',                   ticker: 'CARE',    mktcap: '~$10억',     detail: '헬스케어 인력 매칭 플랫폼. 간호사·간병인 공급. 고령화 사회 요양 서비스 확장', ir: 'https://investors.care.com', news: 'https://www.care.com/newsroom', x: 'https://x.com/search?q=Care.com+healthcare+workforce+2026' },
        ],
      },
      {
        id: 'wearables_cgm',
        icon: '⌚',
        name: '웨어러블 & 연속혈당측정기(CGM)',
        desc: '개인 건강 모니터링·만성질환 관리',
        detail: [
          'CGM(Continuous Glucose Monitor)은 당뇨 환자의 혈당을 24시간 추적하는 혁신 기술이다. Abbott FreeStyle Libre·Dexcom이 CGM 시장을 주도하며, Dexcom은 2024년 매출 $30억을 넘어섰다. 이제 CGM이 비당뇨 인구(피트니스·다이어트)로 확대되고 있으며, AI 기반 혈당 예측 알고리즘이 인슐린 자동 투여와 결합된다.',
          'Apple Watch·Oura Ring·Whoop 같은 웨어러블은 심박·수면·스트레스를 연속 모니터링하며, 이 데이터가 AI 건강 인사이트로 변환된다. 특히 심방세동(AFib) 감지·낙상 위험 예측이 의료용 웨어러블로 승인되면서 헬스케어의 경계가 사라지고 있다.',
        ],
        candidates: [
          { rank: 1,  name: 'Dexcom',                     ticker: 'DXCM',    mktcap: '~$450억',    detail: 'CGM 세계 1위. G6/G7 연속혈당측정기. AI 혈당 예측 알고리즘. 비당뇨 시장 확대 중', ir: 'https://investors.dexcom.com', news: 'https://www.dexcom.com/newsroom', x: 'https://x.com/search?q=Dexcom+CGM+glucose+2026' },
          { rank: 2,  name: 'Abbott Laboratories',        ticker: 'ABT',     mktcap: '~$2,400억',  detail: 'FreeStyle Libre CGM 시장 선도. 스캔 없는 연속혈당 모니터링. Glucose Boss 앱 AI 분석', ir: 'https://investors.abbott.com', news: 'https://www.abbott.com/newsroom', x: 'https://x.com/search?q=Abbott+FreeStyle+Libre+2026' },
          { rank: 3,  name: 'Medtronic',                  ticker: 'MDT',     mktcap: '~$1,100억',  detail: 'Guardian/6 CGM + MiniMed 인슐린 펌프 통합. AI 자동 인슐린 투여 알고리즘. 당뇨 환자 1천만+ 타겟', ir: 'https://investors.medtronic.com', news: 'https://www.medtronic.com/newsroom', x: 'https://x.com/search?q=Medtronic+CGM+insulin+pump+2026' },
          { rank: 4,  name: 'Senseonics',                 ticker: 'SENS',    mktcap: '~$5억',      detail: '피하 삽입형 CGM Eversense. 6개월 착용·스캔 없는 실시간 혈당 모니터링. Roche 파트너십', ir: 'https://investors.senseonics.com', news: 'https://www.senseonics.com/newsroom', x: 'https://x.com/search?q=Senseonics+Eversense+CGM+2026' },
          { rank: 5,  name: 'Apple',                      ticker: 'AAPL',    mktcap: '~$3,200억',  detail: 'Apple Watch 심박·심방세동 감지. Health App 데이터 통합. 의료용 웨어러블 확대 중', ir: 'https://investor.apple.com', news: 'https://www.apple.com/newsroom/', x: 'https://x.com/search?q=Apple+Watch+health+2026' },
          { rank: 6,  name: 'Oura Health',                ticker: 'Private', mktcap: '~$15억',     detail: '반지형 웨어러블 Oura Ring. 수면·체온·심률 변동성(HRV) 추적. AI 건강 점수 및 질병 예측', ir: 'https://www.ouraring.com', news: 'https://www.ouraring.com/news', x: 'https://x.com/search?q=Oura+Ring+wearable+2026' },
          { rank: 7,  name: 'Whoop',                      ticker: 'Private', mktcap: '~$30억',     detail: '운동선수·피트니스 웨어러블. 회복도·부상 위험 예측. AI 훈련 최적화. 스포츠 헬스 시장 전문', ir: 'https://www.whoop.com', news: 'https://www.whoop.com/news', x: 'https://x.com/search?q=Whoop+wearable+fitness+2026' },
          { rank: 8,  name: 'Garmin',                     ticker: 'GRMN',    mktcap: '~$80억',     detail: 'Forerunner·Epix 스마트워치 건강 추적. 심박·수면·스트레스 모니터링. 운동 애호가 시장 1위', ir: 'https://investors.garmin.com', news: 'https://www.garmin.com/newsroom', x: 'https://x.com/search?q=Garmin+smartwatch+health+2026' },
          { rank: 9,  name: 'Fitbit (Google)',            ticker: 'GOOGL',   mktcap: '~$2,200억',  detail: 'Google 인수 웨어러블. Sense ECG·수면추적. Google Fit 통합. 대중 시장 헬스 웨어러블', ir: 'https://investors.google.com', news: 'https://www.google.com/newsroom/', x: 'https://x.com/search?q=Google+Fitbit+health+2026' },
          { rank: 10, name: 'Withings',                   ticker: 'Private', mktcap: '~$5억',      detail: '스마트 체중계·혈압계·수면추적기. 홈 의료기기 AI 분석. Nokia Health 이력. 소비자 헬스케어', ir: 'https://www.withings.com', news: 'https://www.withings.com/newsroom', x: 'https://x.com/search?q=Withings+smart+health+2026' },
          { rank: 11, name: 'BioIntelliSense',            ticker: 'Private', mktcap: '~$1억',      detail: '패치형 생체신호 센서 BioSticker. 온도·호흡·심박 실시간 모니터링. FDA 의료용 승인', ir: 'https://biointellisense.com', news: 'https://biointellisense.com/news', x: 'https://x.com/search?q=BioIntelliSense+wearable+2026' },
          { rank: 12, name: 'Livongo (Teladoc)',          ticker: 'TDOC',    mktcap: '~$20억',     detail: 'Teladoc 인수. 만성질환 웨어러블 플랫폼. 혈당·혈압·폐질환 모니터링. 원격 환자 모니터링 선도', ir: 'https://investors.teladoc.com', news: 'https://teladoc.com/news', x: 'https://x.com/search?q=Livongo+chronic+disease+management+2026' },
        ],
      },
    ],
  },

  // ─── 레이어 3: 의료 서비스 & 인프라 ────────────────────
  {
    id: 'healthcare_services',
    layer: '🏥 의료 서비스 & 인프라',
    components: [
      {
        id: 'hospital_chains',
        icon: '🏥',
        name: '병원 체인 & 의료 서비스 기업',
        desc: '의료 기관 운영·통합 가치사슬',
        detail: [
          '글로벌 병원 체인은 규모의 경제로 의료비 효율화를 추구하고 있다. Tenet Healthcare·United Healthcare Optum·CVS Health 같은 대형 헬스케어 기업들이 병원 인수·통합 M&A를 지속하며, 헬스케어 수직통합(VIC) 구조가 강화되고 있다. 아시아에서는 Parkway Pantai·IHH Healthcare 같은 병원 체인이 글로벌 의료 관광객을 끌어들이고 있다.',
          'AI·로봇·원격진료가 병원 운영 효율을 높이고 있다. 자동화된 의료비 청구·AI 응급실 트리아주·원격진료 통합이 운영 비용을 20~30% 감축하는 사례가 늘고 있다. 소규모 지역 의료기관들은 디지털 헬스케어 플랫폼으로 대형 네트워크에 참여하고 있다.',
        ],
        candidates: [
          { rank: 1,  name: 'United Healthcare (Optum)',  ticker: 'UNH',     mktcap: '~$5,000억',  detail: '의료보험 + 헬스케어 서비스 통합. 병원·약국·의료기기·IT 일괄 보유. 의료 VIC 모델 선도', ir: 'https://investors.unitedhealthgroup.com', news: 'https://newsroom.unitedhealthgroup.com', x: 'https://x.com/search?q=UnitedHealth+Optum+healthcare+2026' },
          { rank: 2,  name: 'CVS Health',                 ticker: 'CVS',     mktcap: '~$700억',    detail: '약국 + 병원 + 의료보험 통합. MinuteClinic 2,200+ 거점. Aetna 보험 + 의료 사일로 붕괴', ir: 'https://investors.cvshealth.com', news: 'https://www.cvshealth.com/news', x: 'https://x.com/search?q=CVS+Health+integrated+healthcare+2026' },
          { rank: 3,  name: 'Tenet Healthcare',           ticker: 'THC',     mktcap: '~$120억',    detail: '미국 병원 체인 3위. 600+ 의료 시설. 낮은 의료비로 접근성 높은 의료 제공 목표', ir: 'https://investors.tenethealth.com', news: 'https://www.tenethealth.com/newsroom', x: 'https://x.com/search?q=Tenet+Healthcare+hospitals+2026' },
          { rank: 4,  name: 'HCA Healthcare',             ticker: 'HCA',     mktcap: '~$700억',    detail: '미국 최대 병원 체인. 186개 병원 + 2,400+ 의료시설. 응급·외과·암 센터 특화', ir: 'https://investors.hcahealthcare.com', news: 'https://www.hcahealthcare.com/newsroom', x: 'https://x.com/search?q=HCA+Healthcare+hospital+chain+2026' },
          { rank: 5,  name: 'IHH Healthcare',             ticker: '5225.KL', mktcap: '~$500억',    detail: '아시아 최대 병원 체인. Parkway Pantai·Asian Healthcare 운영. 40+ 국가 의료 네트워크', ir: 'https://www.ihhealthcare.com/investors', news: 'https://www.ihhealthcare.com/newsroom', x: 'https://x.com/search?q=IHH+Healthcare+Asia+hospitals+2026' },
          { rank: 6,  name: 'Parkway Pantai',             ticker: '5225.KL', mktcap: '~$500억',    detail: 'IHH 산하 프리미엄 병원 체인. 동남아 의료 관광 선도. 고급 암·심장·신경외과 센터', ir: 'https://www.parkwaypantai.com', news: 'https://www.parkwaypantai.com/news', x: 'https://x.com/search?q=Parkway+Pantai+healthcare+2026' },
          { rank: 7,  name: 'Ramsay Health Care',         ticker: 'RHC.AX', mktcap: '~$300억',    detail: '호주 병원 체인. 호주·영국·프랑스 400+ 시설. 부케파마 수술 특화', ir: 'https://www.ramsayhealth.com/investors', news: 'https://www.ramsayhealth.com/news', x: 'https://x.com/search?q=Ramsay+Health+Care+hospitals+2026' },
          { rank: 8,  name: 'Apollo Hospitals',           ticker: 'APOLLOHOSP.BO', mktcap: '~$150억', detail: '인도 최대 병원 체인. 72개 병원, 10,000+ 병상. 의료 관광·암·심장 수술 선도. IPO 공개', ir: 'https://www.apollohospitals.com/investors', news: 'https://www.apollohospitals.com/news', x: 'https://x.com/search?q=Apollo+Hospitals+India+2026' },
          { rank: 9,  name: 'Fortis Healthcare',         ticker: 'FORTIS.BO', mktcap: '~$80억',   detail: '인도 병원 체인 2위. 41개 병원. 종양·심혈관·신경 센터. Dr. Reddy 지원 구조 재편', ir: 'https://www.fortishealthcare.com/investors', news: 'https://www.fortishealthcare.com/news', x: 'https://x.com/search?q=Fortis+Healthcare+India+2026' },
          { rank: 10, name: 'Community Health Systems',   ticker: 'CYH',     mktcap: '~$30억',     detail: '미국 중소 병원 운영. 120+ 병원·강한 지역 기반. 농촌 의료 접근성 향상 목표', ir: 'https://investors.communityhealthsystems.com', news: 'https://www.communityhealthsystems.com/newsroom', x: 'https://x.com/search?q=Community+Health+Systems+2026' },
          { rank: 11, name: 'Cerner (Oracle)',            ticker: 'ORCL',    mktcap: '~$3,200억',  detail: 'Veterans Affairs 최대 병원 네트워크 EHR 운영. 글로벌 병원 IT 인프라 구축 중', ir: 'https://www.oracle.com/investors/', news: 'https://www.oracle.com/news/', x: 'https://x.com/search?q=Oracle+Cerner+hospital+2026' },
          { rank: 12, name: 'Aster DM Healthcare',        ticker: 'ASTERDM.BO', mktcap: '~$20억',  detail: '인도·GCC 병원 체인. 35개 병원·의료 대학. 신흥시장 의료 확장 중', ir: 'https://www.asterdmhealthcare.com/investors', news: 'https://www.asterdmhealthcare.com/news', x: 'https://x.com/search?q=Aster+DM+Healthcare+2026' },
        ],
      },
    ],
  },

  // ─── 레이어 4: 헬스케어 소프트웨어 & 결제 ──────────────────
  {
    id: 'healthcare_saas',
    layer: '💳 헬스케어 SaaS & 결제 인프라',
    components: [
      {
        id: 'healthcare_payment',
        icon: '💳',
        name: '의료비 관리·결제 & 컴플라이언스',
        desc: '의료비 청구·보험 처리·환자 결제',
        detail: [
          '미국 의료비 청구는 1조 달러 산업이며, 이 중 30% 이상이 청구 오류·거절로 낭비된다. AI 기반 청구 자동화·보험 사전 승인·보험금 회수 자동화가 비용 30~50%를 절감한다. Optum·CVS·Amazon Pharmacy 같은 거대 기업들이 헬스케어 결제 생태계를 재편하고 있다.',
          '환자 결제 플랫폼(Patient Finance)은 고비용 의료 시술에 대한 분할 결제를 가능하게 한다. Affirm·Klarna 같은 일반 핀테크와 달리, Sunbit·CareCredit 같은 의료 전문 결제 플랫폼이 성장 중이다. 또한 의료 규제 컴플라이언스(HIPAA·GDPR)를 보장하는 의료용 SaaS 플랫폼이 클라우드 전환을 가속하고 있다.',
        ],
        candidates: [
          { rank: 1,  name: 'Optum (United Healthcare)',  ticker: 'UNH',     mktcap: '~$5,000억',  detail: '의료비 청구·보험 처리 1위. 청구 자동화·AI 사전승인 시스템. 의료 데이터 분석 통합', ir: 'https://investors.unitedhealthgroup.com', news: 'https://newsroom.unitedhealthgroup.com', x: 'https://x.com/search?q=Optum+medical+billing+2026' },
          { rank: 2,  name: 'Veradigm',                   ticker: 'VRDN',    mktcap: '~$70억',     detail: '의료 데이터 통합 청구·보험 플랫폼. 임상 데이터 + 청구 시스템 연동. Salesforce 통합', ir: 'https://investors.veradigm.com', news: 'https://www.veradigm.com/newsroom', x: 'https://x.com/search?q=Veradigm+medical+billing+2026' },
          { rank: 3,  name: 'CareCredit (Synchrony)',     ticker: 'SYF',     mktcap: '~$200억',    detail: '의료 특화 결제 카드. 환자 분할 결제 플랫폼. 의료시술 높은 이용률. Synchrony 금융사 소유', ir: 'https://investors.synchronyfinancial.com', news: 'https://www.synchronyfinancial.com/news', x: 'https://x.com/search?q=CareCredit+patient+payment+2026' },
          { rank: 4,  name: 'Sunbit',                     ticker: 'Private', mktcap: '~$10억',     detail: '의료 특화 점-of-sale 신용심사·분할 결제. 수술·치과·미용 시술 환자 금융 플랫폼', ir: 'https://www.sunbit.com', news: 'https://www.sunbit.com/news', x: 'https://x.com/search?q=Sunbit+healthcare+payment+2026' },
          { rank: 5,  name: 'Instamed (PayPal)',          ticker: 'PYPL',    mktcap: '~$900억',    detail: 'PayPal 인수 헬스케어 결제 플랫폼. 의료 청구·환자 결제 통합. HIPAA 준수 결제 서비스', ir: 'https://investor.paypal.com', news: 'https://www.paypal.com/newsroom', x: 'https://x.com/search?q=PayPal+Instamed+healthcare+2026' },
          { rank: 6,  name: 'Coker & Co',                 ticker: 'Private', mktcap: '~$2억',      detail: '의료 청구 컨설팅·자동화 SaaS. 보험금 회수 최적화. 중소 의료 기관 특화', ir: 'https://www.cokerandcompany.com', news: 'https://www.cokerandcompany.com/news', x: 'https://x.com/search?q=Coker+Company+medical+billing+2026' },
          { rank: 7,  name: 'Athena Health',              ticker: 'Private', mktcap: '~$200억',    detail: '클라우드 의료 청구·EHR·의료비 청구 통합. 소형 의료기관 플랫폼. Sunflower Health 사보험 진출', ir: 'https://www.athenahealth.com', news: 'https://www.athenahealth.com/newsroom', x: 'https://x.com/search?q=Athena+Health+medical+billing+2026' },
          { rank: 8,  name: 'IQVIA',                      ticker: 'IQV',     mktcap: '~$400억',    detail: '헬스케어 데이터 + 청구 최적화. 환자 모니터링·리얼월드데이터 수집. 보험+임상 통합 분석', ir: 'https://ir.iqvia.com', news: 'https://www.iqvia.com/newsroom', x: 'https://x.com/search?q=IQVIA+healthcare+analytics+2026' },
          { rank: 9,  name: 'Tabula Rasa Healthcare',     ticker: 'TRHC',    mktcap: '~$20억',     detail: 'MedImpact 약물 관리 플랫폼. 처방 적정성·의료비 절감. 노인 의료(Medicare/Medicaid) 특화', ir: 'https://investors.tabularasahealthcare.com', news: 'https://www.tabularasahealthcare.com/newsroom', x: 'https://x.com/search?q=Tabula+Rasa+Healthcare+medication+2026' },
          { rank: 10, name: 'Conduent',                   ticker: 'CNDT',    mktcap: '~$10억',     detail: '의료 청구 아웃소싱 서비스. 보험 처리·환자 이력 관리 BPO. 글로벌 헬스케어 프로세싱', ir: 'https://investors.conduent.com', news: 'https://www.conduent.com/newsroom', x: 'https://x.com/search?q=Conduent+medical+billing+2026' },
          { rank: 11, name: 'ServiceTitan',               ticker: 'Private', mktcap: '~$80억',     detail: '의료용 운영관리 소프트웨어. 스케줄링·청구·고객관계 통합. 치과·수의료 특화. Apex 펀드 지원', ir: 'https://www.servicetitan.com', news: 'https://www.servicetitan.com/newsroom', x: 'https://x.com/search?q=ServiceTitan+healthcare+software+2026' },
          { rank: 12, name: 'Blue Hammer Marketing',      ticker: 'Private', mktcap: '~$1억',      detail: '의료 마케팅·환자 획득 플랫폼. 디지털 광고·CRM·결제 최적화. 치과·피부과 클리닉 특화', ir: 'https://bluehammer.io', news: 'https://bluehammer.io/blog', x: 'https://x.com/search?q=Blue+Hammer+medical+marketing+2026' },
        ],
      },
    ],
  },
];

export const HEALTHCARE_FLAG_BY_NAME = HEALTHCARE_LAYERS.flatMap((layer) =>
  layer.components.flatMap((comp) =>
    comp.candidates.map((cand) => ({
      name: cand.name,
      layer_id: layer.id,
      component_id: comp.id,
    }))
  )
);
