// 양자컴퓨터 섹터 밸류체인 데이터 (2026년 기준)
// 밸류체인: 양자칩 & 게이트 → 큐비트 검증 & 제어 → 소프트웨어 & 알고리즘 → 응용 소프트웨어 → 산업별 응용
// candidates[]: 각 카테고리별 후보풀
// API로 시총 가져와 내림차순 정렬 → 상위 10개 동적 표시

export const QUANTUM_LAYERS = [
  // ─── 레이어 1: 양자칩 & 게이트 기술 ─────────────────────────────
  {
    id: 'quantum_chip',
    layer: '⚛️ 양자칩 & 게이트 기술',
    components: [
      {
        id: 'quantum_chip_main',
        icon: '⚛️',
        name: '양자칩 & 게이트 기술',
        desc: '초전도 큐비트·이온 트랩·포토닉 방식으로 양자 프로세서 제조',
        detail: [
          '양자컴퓨터의 핵심 하드웨어인 양자칩은 큐비트(qubit)를 구현하는 방식에 따라 초전도(IBM, Google), 이온 트랩(IonQ, Quantinuum), 포토닉(PsiQuantum), 중성 원자(QuEra, Atom Computing) 등으로 나뉜다. 2026년 현재 IBM의 헤론(Heron) 프로세서는 133 큐비트 이상을, Google의 Willow 칩은 105 큐비트로 양자 우월성 실험을 발표했다.',
          '상업용 양자 시스템은 아직 오류율이 높아 "노이즈 양자(NISQ)" 시대에 있지만, 오류 정정 큐비트(Logical Qubit) 구현을 향한 경쟁이 가속화되고 있다. Microsoft는 위상 큐비트(Topological Qubit) 기반 접근법으로 차별화를 꾀하고 있으며, PsiQuantum은 광자(Photon)를 이용한 대규모 내결함성(Fault-tolerant) 양자컴퓨터를 목표로 한다.',
        ],
        candidates: [
          { rank: 1,  name: 'IBM',               ticker: 'IBM',     mktcap: '~$2,000억',    detail: 'Eagle·Falcon·Heron 초전도 큐비트 프로세서. 1,000+ 큐비트 목표. IBM Quantum Network로 글로벌 생태계 구축', ir: 'https://www.ibm.com/investor', news: 'https://newsroom.ibm.com', x: 'https://x.com/search?q=IBM+quantum+computer+2026' },
          { rank: 2,  name: 'Google',             ticker: 'GOOGL',   mktcap: '~$2.1조',      detail: 'Sycamore·Willow 칩으로 양자 우월성 선언. 내결함성 큐비트 연구 선도. DeepMind와 양자 AI 융합 연구', ir: 'https://abc.xyz/investor/', news: 'https://blog.google/technology/research/', x: 'https://x.com/search?q=Google+quantum+Willow+2026' },
          { rank: 3,  name: 'Microsoft',          ticker: 'MSFT',    mktcap: '~$3.0조',      detail: '위상 큐비트(Topological) 독자 접근. Azure Quantum 클라우드 플랫폼. 내결함성 양자 시스템 장기 목표', ir: 'https://www.microsoft.com/en-us/investor', news: 'https://news.microsoft.com', x: 'https://x.com/search?q=Microsoft+quantum+computing+2026' },
          { rank: 4,  name: 'IonQ',               ticker: 'IONQ',    mktcap: '~$70억',       detail: '이온 트랩 방식 양자컴퓨터 상장사 선도. #AQ(Algorithmic Qubit) 지표 업계 최고 수준. AWS·Azure·GCP 3사 클라우드 탑재', ir: 'https://ionq.com/investors', news: 'https://ionq.com/news', x: 'https://x.com/search?q=IonQ+quantum+2026' },
          { rank: 5,  name: 'D-Wave Systems',     ticker: 'QBTS',    mktcap: '~$20억',       detail: '양자 어닐링(Quantum Annealing) 상용화 선두. Advantage2 5,000+ 큐비트. 최적화 문제에 실전 적용 중', ir: 'https://investors.dwavesys.com', news: 'https://www.dwavesys.com/company/newsroom', x: 'https://x.com/search?q=D-Wave+quantum+annealing+2026' },
          { rank: 6,  name: 'Rigetti Computing',  ticker: 'RGTI',    mktcap: '~$10억',       detail: '초전도 큐비트 전문 퓨어플레이. Novera QPU 판매 개시. 클라우드(QCS) 기반 양자 서비스 제공', ir: 'https://investors.rigetti.com', news: 'https://www.rigetti.com/news', x: 'https://x.com/search?q=Rigetti+Computing+quantum+2026' },
          { rank: 7,  name: 'Quantinuum',         ticker: 'Private', mktcap: '~$100억(추정)', detail: 'Honeywell·Cambridge Quantum 합병. 이온 트랩 H-시리즈. 양자 볼륨(QV) 세계 최고 기록 보유', ir: 'https://www.quantinuum.com', news: 'https://www.quantinuum.com/news', x: 'https://x.com/search?q=Quantinuum+quantum+2026' },
          { rank: 8,  name: 'Intel',              ticker: 'INTC',    mktcap: '~$1,300억',    detail: 'Horse Ridge II 극저온 제어 칩 & Tunnel Falls 12큐비트 실리콘 스핀 프로세서. 반도체 공정 강점 활용', ir: 'https://www.intc.com/investor-relations', news: 'https://www.intel.com/content/www/us/en/newsroom', x: 'https://x.com/search?q=Intel+quantum+silicon+spin+2026' },
          { rank: 9,  name: 'PsiQuantum',         ticker: 'Private', mktcap: '~$36억(추정)', detail: '포토닉(광자) 방식 100만 큐비트 목표. GLOBALFOUNDRIES와 제조 협약. 내결함성 양자컴퓨터 선도', ir: 'https://www.psiquantum.com', news: 'https://www.psiquantum.com/news', x: 'https://x.com/search?q=PsiQuantum+photonic+quantum+2026' },
          { rank: 10, name: 'Atom Computing',     ticker: 'Private', mktcap: 'N/A',          detail: '중성 원자(Neutral Atom) 방식. 1,225 원자 배열 시연. Microsoft 파트너십. 내결함성 로직 큐비트 연구', ir: 'https://atom-computing.com', news: 'https://atom-computing.com/news', x: 'https://x.com/search?q=Atom+Computing+neutral+atom+2026' },
          { rank: 11, name: 'QuEra Computing',    ticker: 'Private', mktcap: 'N/A',          detail: '중성 원자 256큐비트 Aquila 시스템. Harvard·MIT 스핀오프. 로직 큐비트 48개 구현 논문 발표', ir: 'https://www.quera.com', news: 'https://www.quera.com/news', x: 'https://x.com/search?q=QuEra+Computing+neutral+atom+2026' },
          { rank: 12, name: '알리바바',            ticker: 'BABA',    mktcap: '~$2,800억',    detail: '다모 아카데미(DAMO) 초전도 큐비트 연구. Taobao Qubit 클라우드 플랫폼. 중국 양자 인프라 투자 주도', ir: 'https://www.alibabagroup.com/en-US/ir', news: 'https://damo.alibaba.com', x: 'https://x.com/search?q=Alibaba+DAMO+quantum+2026' },
        ],
      },
    ],
  },

  // ─── 레이어 2: 큐비트 검증 & 제어 ────────────────────────────────
  {
    id: 'qubit_validation',
    layer: '🔬 큐비트 검증 & 제어',
    components: [
      {
        id: 'qubit_ctrl_main',
        icon: '🔬',
        name: '큐비트 검증 & 제어 시스템',
        desc: '오류 정정·신호 처리·극저온 제어 장비로 큐비트 품질 보증',
        detail: [
          '양자컴퓨터의 실용화를 위해서는 큐비트 오류율을 10억분의 1 수준으로 낮춰야 한다. 이를 위한 극저온(-273°C 근방) 환경 유지, 마이크로파 신호 제어, 오류 정정 코드(Surface Code, Shor Code) 적용이 필수다. Keysight Technologies·Zurich Instruments 같은 정밀 계측 기업들이 이 인프라를 공급한다.',
          '양자 시스템의 오류 정정은 물리 큐비트 수천 개로 논리 큐비트 1개를 구현하는 방식이다. 2026년 현재 Microsoft는 위상 큐비트로 오류 정정 오버헤드를 줄이려는 독자 접근을 취하고 있으며, Google의 Willow 칩은 큐비트 수를 늘릴수록 오류가 줄어드는 "임계점 돌파"를 달성했다고 발표했다.',
        ],
        candidates: [
          { rank: 1,  name: 'Keysight Technologies',  ticker: 'KEYS',    mktcap: '~$200억',   detail: '양자 테스트&측정 장비 선도. 극저온 마이크로파 소스·VNA 공급. 양자 하드웨어 검증 표준 장비', ir: 'https://investor.keysight.com', news: 'https://www.keysight.com/us/en/about/newsroom.html', x: 'https://x.com/search?q=Keysight+quantum+measurement+2026' },
          { rank: 2,  name: 'Rohde & Schwarz',        ticker: 'Private', mktcap: 'N/A',       detail: '독일 정밀 계측기기 글로벌 리더. 양자 시스템용 벡터 신호 발생기·분석기 공급. 방산·통신 겸용', ir: 'https://www.rohde-schwarz.com', news: 'https://www.rohde-schwarz.com/news', x: 'https://x.com/search?q=Rohde+Schwarz+quantum+measurement+2026' },
          { rank: 3,  name: 'Zurich Instruments',     ticker: 'Private', mktcap: 'N/A',       detail: '스위스 극저온 제어 전문. SHFQC+ 퀀텀 컨트롤러 — 초전도·이온트랩 큐비트 제어 사실상 표준', ir: 'https://www.zhinst.com', news: 'https://www.zhinst.com/europe/en/resources/news', x: 'https://x.com/search?q=Zurich+Instruments+qubit+control+2026' },
          { rank: 4,  name: 'Tektronix',              ticker: 'Private', mktcap: 'N/A',       detail: 'Fortive 자회사. 고속 오실로스코프·AWG(임의파형발생기) 양자 연구 실험실 필수 장비', ir: 'https://www.tek.com', news: 'https://www.tek.com/about/news', x: 'https://x.com/search?q=Tektronix+quantum+AWG+2026' },
          { rank: 5,  name: 'Microsoft',              ticker: 'MSFT',    mktcap: '~$3.0조',   detail: '위상 큐비트용 자체 제어 스택 개발. QECCO 오류 정정 프로토콜. Azure Quantum Elements 플랫폼', ir: 'https://www.microsoft.com/en-us/investor', news: 'https://news.microsoft.com', x: 'https://x.com/search?q=Microsoft+topological+qubit+2026' },
          { rank: 6,  name: 'IBM',                    ticker: 'IBM',     mktcap: '~$2,000억', detail: '자체 제어 전자장치·극저온 패키징 수직통합. Qiskit Runtime — 오류 완화(Error Mitigation) 내장', ir: 'https://www.ibm.com/investor', news: 'https://newsroom.ibm.com', x: 'https://x.com/search?q=IBM+quantum+error+correction+2026' },
          { rank: 7,  name: 'Yokogawa Electric',      ticker: '6841.T',  mktcap: '~$50억',    detail: '일본 계측·제어 기업. DC 전원·측정 장비로 극저온 양자 환경 지원. 반도체·양자 연구 겸용', ir: 'https://www.yokogawa.com/us/about/investor-relations/', news: 'https://www.yokogawa.com/us/news/', x: 'https://x.com/search?q=Yokogawa+quantum+measurement+2026' },
          { rank: 8,  name: 'FormFactor',             ticker: 'FORM',    mktcap: '~$20억',    detail: '극저온 프로브 카드·웨이퍼 테스트 전문. 양자칩 테스팅 인프라 핵심 공급사. 반도체 테스트 겸용', ir: 'https://investor.formfactor.com', news: 'https://www.formfactor.com/news/', x: 'https://x.com/search?q=FormFactor+cryogenic+quantum+2026' },
          { rank: 9,  name: 'QuTech (TU Delft)',      ticker: 'Academic', mktcap: 'N/A',      detail: '네덜란드 TU Delft·TNO 공동 연구센터. 위상·초전도 큐비트 오류 정정 국제 선도. Intel 협력 연구', ir: 'https://qutech.nl', news: 'https://qutech.nl/news', x: 'https://x.com/search?q=QuTech+Delft+quantum+error+2026' },
          { rank: 10, name: 'Q-CTRL',                 ticker: 'Private', mktcap: 'N/A',       detail: '호주 양자 제어 소프트웨어 전문. Black Opal·Fire Opal — 오류 억제 AI 소프트웨어. IBM·IonQ 연동', ir: 'https://q-ctrl.com', news: 'https://q-ctrl.com/news', x: 'https://x.com/search?q=Q-CTRL+quantum+control+2026' },
        ],
      },
    ],
  },

  // ─── 레이어 3: 소프트웨어 & 알고리즘 ────────────────────────────
  {
    id: 'software',
    layer: '💻 소프트웨어 & 알고리즘',
    components: [
      {
        id: 'software_main',
        icon: '💻',
        name: '양자 소프트웨어 & 알고리즘',
        desc: '양자 컴파일러·SDK·알고리즘 설계·클라우드 플랫폼',
        detail: [
          '양자 소프트웨어는 크게 양자 회로를 하드웨어에 최적화하는 컴파일러/트랜스파일러, 알고리즘을 구현하는 SDK, 클라우드 접근을 제공하는 플랫폼으로 구성된다. IBM의 Qiskit은 오픈소스로 전 세계 50만 명 이상이 사용하며 사실상 표준이 됐고, Amazon Braket·Azure Quantum은 다양한 하드웨어 백엔드를 클라우드로 제공한다.',
          '양자 알고리즘은 Shor(소인수분해), Grover(검색 가속), VQE·QAOA(최적화)가 대표적이다. 현재 NISQ 시대에는 노이즈에 강한 변분 양자 알고리즘(Variational Quantum Algorithms)이 주목받으며, 특히 금융 포트폴리오 최적화, 신약 분자 시뮬레이션, 물류 최적화 분야에서 실용화 연구가 진행 중이다.',
        ],
        candidates: [
          { rank: 1,  name: 'IBM',              ticker: 'IBM',     mktcap: '~$2,000억',    detail: 'Qiskit SDK 오픈소스 생태계 1위. IBM Quantum Experience 클라우드. Runtime 오류 완화 내장. 양자 교육 프로그램 선도', ir: 'https://www.ibm.com/investor', news: 'https://newsroom.ibm.com', x: 'https://x.com/search?q=IBM+Qiskit+quantum+software+2026' },
          { rank: 2,  name: 'Amazon (AWS)',     ticker: 'AMZN',    mktcap: '~$2.1조',      detail: 'Amazon Braket — IonQ·Rigetti·QuEra·OQC 등 다중 하드웨어 클라우드 접근. Amazon Web Services 양자 네트워킹 연구', ir: 'https://ir.aboutamazon.com', news: 'https://aws.amazon.com/blogs/quantum-computing/', x: 'https://x.com/search?q=Amazon+Braket+quantum+2026' },
          { rank: 3,  name: 'Microsoft',        ticker: 'MSFT',    mktcap: '~$3.0조',      detail: 'Azure Quantum 플랫폼. Q# 언어·QDK SDK. Copilot + Quantum Elements로 화학·재료 시뮬레이션 가속', ir: 'https://www.microsoft.com/en-us/investor', news: 'https://news.microsoft.com', x: 'https://x.com/search?q=Microsoft+Azure+Quantum+software+2026' },
          { rank: 4,  name: 'Google',           ticker: 'GOOGL',   mktcap: '~$2.1조',      detail: 'Cirq 오픈소스 프레임워크. Google Quantum AI 연구 선도. TensorFlow Quantum — 양자 머신러닝 라이브러리', ir: 'https://abc.xyz/investor/', news: 'https://blog.google/technology/research/', x: 'https://x.com/search?q=Google+Cirq+quantum+AI+2026' },
          { rank: 5,  name: 'IonQ',             ticker: 'IONQ',    mktcap: '~$70억',       detail: 'IonQ Aria·Forte 시스템. 자체 알고리즘 최적화 컴파일러. 양자 네트워킹·암호화 연구 병행', ir: 'https://ionq.com/investors', news: 'https://ionq.com/news', x: 'https://x.com/search?q=IonQ+quantum+algorithm+2026' },
          { rank: 6,  name: 'Quantinuum',       ticker: 'Private', mktcap: '~$100억(추정)', detail: 'TKET 컴파일러 오픈소스. InQuanto 양자 화학 플랫폼. QuantumOrigin 양자 난수 생성기(QRNG) 상용화', ir: 'https://www.quantinuum.com', news: 'https://www.quantinuum.com/news', x: 'https://x.com/search?q=Quantinuum+TKET+quantum+software+2026' },
          { rank: 7,  name: 'Zapata Computing', ticker: 'Private', mktcap: 'N/A',          detail: 'Orquestra 워크플로우 플랫폼. 금융·에너지·제약 최적화 응용 전문. 변분 알고리즘(VQE·QAOA) 상업화', ir: 'https://www.zapatacomputing.com', news: 'https://www.zapatacomputing.com/news', x: 'https://x.com/search?q=Zapata+Computing+quantum+algorithm+2026' },
          { rank: 8,  name: 'QC Ware',          ticker: 'Private', mktcap: 'N/A',          detail: '엔터프라이즈 양자 소프트웨어 전문. Forge 플랫폼 — 금융·항공 최적화. Goldman Sachs·Airbus 협업', ir: 'https://qcware.com', news: 'https://qcware.com/news', x: 'https://x.com/search?q=QC+Ware+quantum+enterprise+2026' },
          { rank: 9,  name: 'Classiq',          ticker: 'Private', mktcap: 'N/A',          detail: '이스라엘 양자 회로 자동 합성 플랫폼. 고수준 양자 알고리즘 설계→최적화 회로 자동 변환. HSBC·NatWest 협업', ir: 'https://www.classiq.io', news: 'https://www.classiq.io/news', x: 'https://x.com/search?q=Classiq+quantum+circuit+synthesis+2026' },
          { rank: 10, name: 'Strangeworks',     ticker: 'Private', mktcap: 'N/A',          detail: '양자 클라우드 애그리게이터. 다중 하드웨어(IBM·Rigetti·IonQ) 단일 인터페이스 접근. 기업 양자 PoC 지원', ir: 'https://strangeworks.com', news: 'https://strangeworks.com/news', x: 'https://x.com/search?q=Strangeworks+quantum+cloud+2026' },
        ],
      },
    ],
  },

  // ─── 레이어 4: 응용 소프트웨어 ───────────────────────────────────
  {
    id: 'application_sw',
    layer: '🎯 응용 소프트웨어',
    components: [
      {
        id: 'app_sw_main',
        icon: '🎯',
        name: '응용 소프트웨어 & 산업 솔루션',
        desc: '약물 설계·포트폴리오 최적화·물류·암호화 등 분야별 양자 응용',
        detail: [
          '양자컴퓨터의 응용 소프트웨어는 현재 하이브리드(고전+양자) 방식으로 실용화가 진행 중이다. 제약 분야에서는 분자 시뮬레이션으로 신약 후보물질의 에너지 준위를 정확히 계산하고, 금융에서는 포트폴리오 최적화·리스크 분석에 양자 어닐링을 적용하는 파일럿 프로젝트가 늘고 있다.',
          'BMW·Airbus·Volkswagen 등 제조업체들은 양자 최적화로 공급망·생산 스케줄링 효율화를 시도하고 있다. IBM·Bosch 등은 2026년을 전후로 양자 이점(Quantum Advantage)의 실질적 첫 사례가 나올 것으로 전망한다. 양자 암호(QKD) 분야는 이미 중국·유럽에서 네트워크 상용화가 시작됐다.',
        ],
        candidates: [
          { rank: 1,  name: 'IBM',                    ticker: 'IBM',     mktcap: '~$2,000억',  detail: 'IBM Quantum Safe — 포스트 양자 암호화 컨설팅. Quantum Serverless 응용 개발 플랫폼. 금융·헬스케어 양자 파일럿', ir: 'https://www.ibm.com/investor', news: 'https://newsroom.ibm.com', x: 'https://x.com/search?q=IBM+quantum+applications+2026' },
          { rank: 2,  name: 'JPMorgan Chase',         ticker: 'JPM',     mktcap: '~$6,000억',  detail: '양자 금융 연구 선도. 옵션 프라이싱·포트폴리오 최적화 IBM과 공동연구. 양자 보안 인프라 내재화 추진', ir: 'https://www.jpmorganchase.com/ir', news: 'https://www.jpmorganchase.com/news', x: 'https://x.com/search?q=JPMorgan+quantum+finance+2026' },
          { rank: 3,  name: 'Goldman Sachs',          ticker: 'GS',      mktcap: '~$1,600억',  detail: '양자 알고리즘 R&D 팀 운영. 파생상품 가격 산정 QMC 알고리즘 연구. QC Ware와 양자 최적화 파트너십', ir: 'https://www.goldmansachs.com/investor-relations', news: 'https://www.goldmansachs.com/media', x: 'https://x.com/search?q=Goldman+Sachs+quantum+computing+2026' },
          { rank: 4,  name: 'Roche',                  ticker: 'RHHBY',   mktcap: '~$2,200억',  detail: '분자 시뮬레이션으로 신약 타겟 발굴. IBM과 양자 화학 공동연구. 암·희귀질환 파이프라인 양자 가속', ir: 'https://www.roche.com/investors', news: 'https://www.roche.com/media', x: 'https://x.com/search?q=Roche+quantum+drug+discovery+2026' },
          { rank: 5,  name: 'Pfizer',                 ticker: 'PFE',     mktcap: '~$1,500억',  detail: '단백질 접힘 시뮬레이션·분자 최적화 양자 연구. IBM Quantum Network 회원사. mRNA 구조 예측 적용 목표', ir: 'https://investors.pfizer.com', news: 'https://www.pfizer.com/news', x: 'https://x.com/search?q=Pfizer+quantum+chemistry+2026' },
          { rank: 6,  name: 'Boehringer Ingelheim',   ticker: 'Private', mktcap: 'N/A',        detail: '독일 제약사 최초 양자컴퓨터 전담팀 운영. Google과 분자 시뮬레이션 협약. 2026년 양자 이점 첫 시연 목표', ir: 'https://www.boehringer-ingelheim.com', news: 'https://www.boehringer-ingelheim.com/news', x: 'https://x.com/search?q=Boehringer+Ingelheim+quantum+2026' },
          { rank: 7,  name: 'Airbus',                 ticker: 'AIR.PA',  mktcap: '~$1,100억',  detail: '항공 유체역학 시뮬레이션·연료 최적화 양자 연구. Quantum Computing Challenge 공모전 운영. EU 퀀텀 플래그십 참여', ir: 'https://www.airbus.com/en/investors', news: 'https://www.airbus.com/en/newsroom', x: 'https://x.com/search?q=Airbus+quantum+optimization+2026' },
          { rank: 8,  name: 'Volkswagen Group',       ticker: 'VOW3.DE', mktcap: '~$700억',    detail: '교통 흐름 최적화·배터리 소재 시뮬레이션 양자 적용. D-Wave 어닐링으로 리스본 버스 노선 최적화 시연', ir: 'https://www.volkswagenag.com/en/InvestorRelations', news: 'https://www.volkswagenag.com/en/news.html', x: 'https://x.com/search?q=Volkswagen+quantum+computing+2026' },
          { rank: 9,  name: 'Pasqal',                 ticker: 'Private', mktcap: 'N/A',        detail: '프랑스 중성 원자 양자컴퓨터. 화학·재료 시뮬레이션 특화. BASF·LG화학과 소재 시뮬레이션 파일럿', ir: 'https://www.pasqal.com', news: 'https://www.pasqal.com/news', x: 'https://x.com/search?q=Pasqal+quantum+material+simulation+2026' },
          { rank: 10, name: 'SandboxAQ',              ticker: 'Private', mktcap: 'N/A',        detail: 'Alphabet 분사. AI + 양자 센서·보안 응용 전문. 포스트 양자 암호화(PQC) 마이그레이션 서비스 기업 제공', ir: 'https://www.sandboxaq.com', news: 'https://www.sandboxaq.com/news', x: 'https://x.com/search?q=SandboxAQ+quantum+security+2026' },
          { rank: 11, name: 'Multiverse Computing',   ticker: 'Private', mktcap: 'N/A',        detail: '스페인 양자 금융 최적화 전문. CompactifAI — LLM 압축에 양자 기술 적용. BBVA·Bankia 금융 파일럿', ir: 'https://multiversecomputing.com', news: 'https://multiversecomputing.com/news', x: 'https://x.com/search?q=Multiverse+Computing+quantum+finance+2026' },
        ],
      },
    ],
  },

  // ─── 레이어 5: 산업별 응용 ────────────────────────────────────────
  {
    id: 'industry_apps',
    layer: '🏭 산업별 응용',
    components: [
      {
        id: 'industry_main',
        icon: '🏭',
        name: '산업별 응용 & 클라우드 인프라',
        desc: '제약·화학·금융·물류·방산 등 실전 양자 응용과 클라우드 인프라 구축',
        detail: [
          '양자컴퓨팅의 산업 응용은 2026년을 기점으로 POC(개념 증명)에서 파일럿(시범 도입) 단계로 전환 중이다. 제약·생명과학 분야에서 분자 시뮬레이션, 금융에서 몬테카를로 시뮬레이션 가속, 에너지에서 그리드 최적화, 물류에서 경로 최적화 등이 실제 도입 사례로 나타나고 있다.',
          '양자 통신·양자 암호 분야에서는 중국이 2,000km 이상 QKD(양자 키 분배) 네트워크를 구축했고, 유럽은 EuroQCI(양자 통신 인프라) 프로젝트를 추진 중이다. NIST의 포스트 양자 암호 표준(2024년 최종 확정) 발표 이후 기업의 양자 보안 전환 수요도 폭발적으로 증가하고 있다.',
        ],
        candidates: [
          { rank: 1,  name: 'Eli Lilly',             ticker: 'LLY',     mktcap: '~$7,000억',  detail: 'GLP-1 비만·당뇨 신약 개발에 양자 분자 시뮬레이션 적용. IBM Quantum Network 회원사. AI+양자 신약 R&D 투자 확대', ir: 'https://investor.lilly.com', news: 'https://investor.lilly.com/news', x: 'https://x.com/search?q=Eli+Lilly+quantum+drug+2026' },
          { rank: 2,  name: 'Moderna',               ticker: 'MRNA',    mktcap: '~$180억',    detail: 'mRNA 서열 최적화·LNP 전달 시뮬레이션에 양자 컴퓨팅 연구 적용. AWS Braket 파트너사. 양자 백신 설계 목표', ir: 'https://investors.modernatx.com', news: 'https://investors.modernatx.com/news', x: 'https://x.com/search?q=Moderna+quantum+computing+2026' },
          { rank: 3,  name: 'BASF',                  ticker: 'BASFY',   mktcap: '~$400억',    detail: '촉매·신소재 양자 화학 시뮬레이션. IBM·Pasqal과 파트너십. 2030년까지 양자 이점 재료 발굴 목표', ir: 'https://www.basf.com/global/en/investors.html', news: 'https://www.basf.com/global/en/media/news-releases.html', x: 'https://x.com/search?q=BASF+quantum+chemistry+materials+2026' },
          { rank: 4,  name: 'ExxonMobil',            ticker: 'XOM',     mktcap: '~$4,800억',  detail: '해상 운송 경로 최적화·이산화탄소 포집 소재 시뮬레이션 양자 연구. IBM과 에너지 최적화 협력', ir: 'https://investor.exxonmobil.com', news: 'https://corporate.exxonmobil.com/news', x: 'https://x.com/search?q=ExxonMobil+quantum+energy+optimization+2026' },
          { rank: 5,  name: 'Lockheed Martin',       ticker: 'LMT',     mktcap: '~$1,500억',  detail: 'D-Wave 어닐링으로 위성 경로 최적화. 양자 센서·레이더·양자 암호 통신 국방 적용 연구 선도', ir: 'https://www.lockheedmartin.com/en-us/investor-relations.html', news: 'https://news.lockheedmartin.com', x: 'https://x.com/search?q=Lockheed+Martin+quantum+defense+2026' },
          { rank: 6,  name: 'Mitsubishi Chemical',   ticker: 'MITCY',   mktcap: '~$100억',    detail: '배터리 소재·유기 태양전지 양자 시뮬레이션. Fugaku(후지쯔 양자 어닐러)와 공동 재료 연구', ir: 'https://www.m-chemical.co.jp/en/investors/', news: 'https://www.m-chemical.co.jp/en/news/', x: 'https://x.com/search?q=Mitsubishi+Chemical+quantum+materials+2026' },
          { rank: 7,  name: 'BioNTech',              ticker: 'BNTX',    mktcap: '~$250억',    detail: 'mRNA 암 백신 항원 최적화·면역 반응 시뮬레이션 양자 활용 연구. IBM Quantum 파트너십 체결', ir: 'https://investors.biontech.de', news: 'https://www.biontech.com/news', x: 'https://x.com/search?q=BioNTech+quantum+computing+2026' },
          { rank: 8,  name: 'DuPont',                ticker: 'DD',      mktcap: '~$300억',    detail: '반도체 공정 소재·특수 화학 양자 시뮬레이션. 양자 내성 재료 개발. 차세대 반도체 패키징 소재 연구', ir: 'https://investors.dupont.com', news: 'https://www.dupont.com/news.html', x: 'https://x.com/search?q=DuPont+quantum+materials+2026' },
          { rank: 9,  name: 'Shell',                 ticker: 'SHEL',    mktcap: '~$2,100억',  detail: '에너지 그리드 최적화·탄소 포집 소재 시뮬레이션 양자 연구. IBM·Microsoft와 에너지 전환 파일럿', ir: 'https://www.shell.com/investors.html', news: 'https://www.shell.com/media.html', x: 'https://x.com/search?q=Shell+quantum+energy+optimization+2026' },
          { rank: 10, name: 'Novartis',              ticker: 'NVS',     mktcap: '~$2,500억',  detail: '양자 컴퓨팅으로 단백질-리간드 결합 에너지 정밀 계산. Microsoft·IBM과 신약 시뮬레이션 파트너십', ir: 'https://www.novartis.com/investors', news: 'https://www.novartis.com/news', x: 'https://x.com/search?q=Novartis+quantum+drug+simulation+2026' },
          { rank: 11, name: 'Volkswagen Group',      ticker: 'VOW3.DE', mktcap: '~$700억',    detail: '배터리 전고체 소재 양자 시뮬레이션. EV 충전 네트워크 최적화 D-Wave 파일럿. 2030 양자 생산 혁신 목표', ir: 'https://www.volkswagenag.com/en/InvestorRelations', news: 'https://www.volkswagenag.com/en/news.html', x: 'https://x.com/search?q=Volkswagen+quantum+battery+EV+2026' },
          { rank: 12, name: '3M',                    ticker: 'MMM',     mktcap: '~$700억',    detail: '첨단 소재·접착제·반도체 공정 화학 양자 시뮬레이션. 양자 센서 응용 연구. 국방·의료 겸용 소재 개발', ir: 'https://investors.3m.com', news: 'https://news.3m.com', x: 'https://x.com/search?q=3M+quantum+materials+2026' },
        ],
      },
    ],
  },
];

export const QUANTUM_FLAG_BY_NAME = {
  'IBM': '🇺🇸',
  'Google': '🇺🇸',
  'Microsoft': '🇺🇸',
  'IonQ': '🇺🇸',
  'D-Wave Systems': '🇨🇦',
  'Rigetti Computing': '🇺🇸',
  'Quantinuum': '🇬🇧',
  'Intel': '🇺🇸',
  'PsiQuantum': '🇬🇧',
  'Atom Computing': '🇺🇸',
  'QuEra Computing': '🇺🇸',
  '알리바바': '🇨🇳',
  'Keysight Technologies': '🇺🇸',
  'Rohde & Schwarz': '🇩🇪',
  'Zurich Instruments': '🇨🇭',
  'Tektronix': '🇺🇸',
  'Yokogawa Electric': '🇯🇵',
  'FormFactor': '🇺🇸',
  'QuTech (TU Delft)': '🇳🇱',
  'Q-CTRL': '🇦🇺',
  'Amazon (AWS)': '🇺🇸',
  'Zapata Computing': '🇺🇸',
  'QC Ware': '🇺🇸',
  'Classiq': '🇮🇱',
  'Strangeworks': '🇺🇸',
  'JPMorgan Chase': '🇺🇸',
  'Goldman Sachs': '🇺🇸',
  'Roche': '🇨🇭',
  'Pfizer': '🇺🇸',
  'Boehringer Ingelheim': '🇩🇪',
  'Airbus': '🇪🇺',
  'Volkswagen Group': '🇩🇪',
  'Pasqal': '🇫🇷',
  'SandboxAQ': '🇺🇸',
  'Multiverse Computing': '🇪🇸',
  'Eli Lilly': '🇺🇸',
  'Moderna': '🇺🇸',
  'BASF': '🇩🇪',
  'ExxonMobil': '🇺🇸',
  'Lockheed Martin': '🇺🇸',
  'Mitsubishi Chemical': '🇯🇵',
  'BioNTech': '🇩🇪',
  'DuPont': '🇺🇸',
  'Shell': '🇳🇱',
  'Novartis': '🇨🇭',
  '3M': '🇺🇸',
};
