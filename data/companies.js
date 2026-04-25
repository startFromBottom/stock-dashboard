// AI 데이터센터 구성 요소별 시가총액 Top 5 기업 데이터 (2025년 기준)

export const LAYERS = [
  {
    id: 'cloud',
    layer: '☁️ 클라우드 / 하이퍼스케일러',
    layerColor: '#fff1f2',
    components: [
      {
        id: 'hyperscaler',
        icon: '🌐',
        name: '클라우드 플랫폼',
        desc: 'AI 서비스 제공, GPU 클러스터 운영',
        companies: [
          { rank: 1, name: 'Microsoft',  ticker: 'MSFT',      mktcap: '~$3.0조', color: '#0078d4', detail: 'Azure AI, OpenAI 파트너십 — GB200 NVL72 Rubin 우선 배포 계약', ir: 'https://investor.microsoft.com', news: 'https://news.microsoft.com', x: 'https://x.com/search?q=Microsoft+Azure+AI' },
          { rank: 2, name: 'Alphabet',   ticker: 'GOOGL',     mktcap: '~$2.1조', color: '#4285f4', detail: 'Google Cloud AI, TPU v5p 자체 설계, Gemini 2.0 인프라', ir: 'https://abc.xyz/investor', news: 'https://blog.google', x: 'https://x.com/search?q=Google+Cloud+AI+datacenter' },
          { rank: 3, name: 'Amazon',     ticker: 'AMZN',      mktcap: '~$2.3조', color: '#ff9900', detail: 'AWS Trainium2/Inferentia, UltraCluster 네트워크 — 2026 최대 AI 투자', ir: 'https://ir.aboutamazon.com', news: 'https://aws.amazon.com/blogs', x: 'https://x.com/search?q=AWS+AI+datacenter+2026' },
          { rank: 4, name: 'Meta',       ticker: 'META',      mktcap: '~$1.5조', color: '#0866ff', detail: '2026년 AI 인프라 $1350억 투자, MTIA 2nm 자체칩 + Arista 네트워크', ir: 'https://investor.fb.com', news: 'https://engineering.fb.com', x: 'https://x.com/search?q=Meta+AI+datacenter+2026' },
          { rank: 5, name: 'CoreWeave', ticker: 'CRWV',      mktcap: '~$300억',  color: '#7c3aed', detail: '2025년 IPO, NVIDIA GPU 특화 클라우드 — 2026 급성장 중인 AI 전용 CSP', ir: 'https://www.coreweave.com/investors', news: 'https://www.coreweave.com/news', x: 'https://x.com/search?q=CoreWeave+AI+cloud' },
        ],
      },
      {
        id: 'facility',
        icon: '🏗️',
        name: '데이터센터 시설',
        desc: '코로케이션, 부지·전력 운영',
        companies: [
          { rank: 1, name: 'Equinix',        ticker: 'EQIX', mktcap: '~$830억', color: '#e31837', detail: '전 세계 260+ 데이터센터, xScale AI 캠퍼스 — 하이퍼스케일러 전용 고밀도 시설', ir: 'https://investor.equinix.com', news: 'https://blog.equinix.com', x: 'https://x.com/search?q=Equinix+AI+datacenter' },
          { rank: 2, name: 'Digital Realty', ticker: 'DLR',  mktcap: '~$490억', color: '#005eb8', detail: 'PlatformDIGITAL 글로벌 허브, 50+ 도시 운영 — AI 수요로 임대율 최고치', ir: 'https://investor.digitalrealty.com', news: 'https://www.digitalrealty.com/resources', x: 'https://x.com/search?q=Digital+Realty+AI' },
          { rank: 3, name: 'Iron Mountain', ticker: 'IRM',   mktcap: '~$330억', color: '#c8522b', detail: '데이터센터 리츠 전환 가속, AI 특화 시설 확장 — 레거시 스토리지→AI 코로케이션', ir: 'https://investor.ironmountain.com', news: 'https://www.ironmountain.com/resources', x: 'https://x.com/search?q=Iron+Mountain+datacenter' },
          { rank: 4, name: 'American Tower', ticker: 'AMT',  mktcap: '~$820억', color: '#1e3a8a', detail: '통신 타워·엣지 데이터센터 글로벌 1위 — AI 엣지 컴퓨팅 수혜 확대', ir: 'https://ir.americantower.com', news: 'https://www.americantower.com/newsroom', x: 'https://x.com/search?q=American+Tower+edge+AI' },
          { rank: 5, name: 'CyrusOne',       ticker: 'Private', mktcap: '비상장', color: '#4b5563', detail: 'KKR·GIP 소유 프라이빗 코로케이션 — 하이퍼스케일 전용 AI 캠퍼스 확대 중', ir: 'https://www.cyrusone.com', news: 'https://www.cyrusone.com/news', x: 'https://x.com/search?q=CyrusOne+datacenter' },
        ],
      },
    ],
  },
  {
    id: 'compute',
    layer: '⚡ 컴퓨트 레이어',
    layerColor: '#fdf4ff',
    components: [
      {
        id: 'gpu',
        icon: '🔲',
        name: 'AI 가속기 / GPU',
        desc: '학습·추론용 고성능 칩',
        companies: [
          { rank: 1, name: 'NVIDIA',   ticker: 'NVDA',  mktcap: '~$2.7조', color: '#76b900', detail: 'Rubin GPU 출시(2026 H2) — 72 GPU 랙, 전 세대 대비 전력효율 4배↑ AI칩 시장 80%+ 점유', ir: 'https://investor.nvidia.com', news: 'https://nvidianews.nvidia.com', x: 'https://x.com/search?q=NVIDIA+Rubin+GPU+2026' },
          { rank: 2, name: 'Broadcom', ticker: 'AVGO',  mktcap: '~$1.0조', color: '#cc0000', detail: 'AI 매출 106% YoY, Meta MTIA 2nm·OpenAI ASIC 공급 — 2027 AI칩 매출 $1000억 목표', ir: 'https://investors.broadcom.com', news: 'https://newsroom.broadcom.com', x: 'https://x.com/search?q=Broadcom+AI+ASIC+2026' },
          { rank: 3, name: 'AMD',      ticker: 'AMD',   mktcap: '~$1800억', color: '#ed1c24', detail: 'MI350X·MI355X 출시, MI400·Helios 랙(2026) — B200 대비 추론 성능 최대 35배↑', ir: 'https://ir.amd.com', news: 'https://www.amd.com/en/newsroom', x: 'https://x.com/search?q=AMD+MI350+MI400+2026' },
          { rank: 4, name: 'Marvell',  ticker: 'MRVL',  mktcap: '~$650억',  color: '#0051a2', detail: 'Google TPU·AWS Trainium2 실리콘 설계 파트너 — AI ASIC 2위 포지션 급부상', ir: 'https://investor.marvell.com', news: 'https://www.marvell.com/newsroom', x: 'https://x.com/search?q=Marvell+AI+chip+2026' },
          { rank: 5, name: 'Intel',    ticker: 'INTC',  mktcap: '~$900억',  color: '#0071c5', detail: 'Gaudi 3 AI 가속기 — AMD·NVIDIA 대비 가격경쟁력으로 엔터프라이즈 AI 시장 공략', ir: 'https://www.intc.com', news: 'https://newsroom.intel.com', x: 'https://x.com/search?q=Intel+Gaudi+AI+2026' },
        ],
      },
      {
        id: 'memory',
        icon: '💾',
        name: '메모리 (HBM / DRAM)',
        desc: '고대역폭 AI 전용 메모리',
        companies: [
          { rank: 1, name: 'SK Hynix', ticker: '000660.KS', mktcap: '~$900억',  color: '#e4002b', detail: 'HBM4 16단 48GB CES 공개, M15X 팹 2026 가동 — HBM 시장 점유율 50%+', ir: 'https://www.skhynix.com/investor', news: 'https://news.skhynix.com', x: 'https://x.com/search?q=SK+Hynix+HBM4+2026' },
          { rank: 2, name: 'Micron',   ticker: 'MU',        mktcap: '~$1100억', color: '#e2231a', detail: 'HBM3E 양산 가속, 2026 HBM4 진입 — AI 메모리 수요로 분기 최고 매출 경신', ir: 'https://investors.micron.com', news: 'https://www.micron.com/about/news', x: 'https://x.com/search?q=Micron+HBM+AI+2026' },
          { rank: 3, name: 'Samsung',  ticker: '005930.KS', mktcap: '~$2500억', color: '#1428a0', detail: 'HBM3E 양산 + HBM4 개발, DRAM·NAND 글로벌 1위 — AI 수요 대응 캐파 4배 확대', ir: 'https://www.samsung.com/global/ir', news: 'https://news.samsung.com', x: 'https://x.com/search?q=Samsung+HBM+AI+2026' },
          { rank: 4, name: 'TSMC',     ticker: 'TSM',       mktcap: '~$8800억', color: '#004b87', detail: 'CoWoS 패키징으로 HBM+GPU 통합 — AI칩 수요로 2025~2026 캐파 풀 가동', ir: 'https://investor.tsmc.com', news: 'https://www.tsmc.com/english/news', x: 'https://x.com/search?q=TSMC+CoWoS+AI+2026' },
          { rank: 5, name: 'Kioxia',   ticker: 'TYO:285A', mktcap: '~$130억',  color: '#e60012', detail: '낸드 플래시 글로벌 2위, AI 스토리지·고속 SSD — 2024 도쿄 상장, AI 수혜주', ir: 'https://www.kioxia.com/en-jp/investor-relations', news: 'https://www.kioxia.com/en-jp/news', x: 'https://x.com/search?q=Kioxia+NAND+AI' },
        ],
      },
      {
        id: 'server',
        icon: '🖥️',
        name: '서버 / AI 시스템',
        desc: 'AI 서버 설계·조립',
        companies: [
          { rank: 1, name: 'Dell',       ticker: 'DELL',  mktcap: '~$450억',  color: '#007db8', detail: 'PowerEdge AI 서버 엔터프라이즈 1위 — Rubin 기반 XE9680 신형 발표', ir: 'https://investors.delltechnologies.com', news: 'https://www.dell.com/en-us/blog', x: 'https://x.com/search?q=Dell+AI+server+2026' },
          { rank: 2, name: 'Super Micro', ticker: 'SMCI',  mktcap: '~$250억',  color: '#e31837', detail: 'GB200 NVL 랙 서버 핵심 ODM, 빠른 출시 속도 — 회계 이슈 해소 후 재성장', ir: 'https://www.supermicro.com/investor', news: 'https://www.supermicro.com/en/newsroom', x: 'https://x.com/search?q=SuperMicro+GB200+2026' },
          { rank: 3, name: 'HPE',        ticker: 'HPE',   mktcap: '~$200억',  color: '#01a982', detail: 'Cray Supercomputing + ProLiant AI 서버, HPC·국방 슈퍼컴 프로젝트 다수', ir: 'https://investors.hpe.com', news: 'https://www.hpe.com/us/en/newsroom', x: 'https://x.com/search?q=HPE+AI+server+2026' },
          { rank: 4, name: 'Lenovo',     ticker: 'HKG:0992', mktcap: '~$100억', color: '#e2231a', detail: 'Neptune 수냉 AI 서버 — 아시아·유럽 엔터프라이즈 AI 서버 시장 공략', ir: 'https://investor.lenovo.com', news: 'https://news.lenovo.com', x: 'https://x.com/search?q=Lenovo+AI+server+2026' },
          { rank: 5, name: 'Foxconn',    ticker: 'TPE:2317', mktcap: '~$560억', color: '#e60012', detail: '세계 최대 AI 서버 ODM — 엔비디아 GB200 랙 조립 물량 급증', ir: 'https://www.foxconn.com/en-us/investor-relations', news: 'https://www.foxconn.com/en-us/news', x: 'https://x.com/search?q=Foxconn+AI+server+GB200' },
        ],
      },
      {
        id: 'storage',
        icon: '📦',
        name: '스토리지',
        desc: '학습 데이터 저장·관리',
        companies: [
          { rank: 1, name: 'Pure Storage',   ticker: 'PSTG', mktcap: '~$200억', color: '#ff6900', detail: 'FlashBlade//S 올플래시 AI 워크로드 최적화 — NVIDIA DGX 파트너', ir: 'https://investor.purestorage.com', news: 'https://www.purestorage.com/company/newsroom', x: 'https://x.com/search?q=Pure+Storage+AI+2026' },
          { rank: 2, name: 'NetApp',         ticker: 'NTAP', mktcap: '~$180억', color: '#0067c5', detail: 'ONTAP AI 스토리지 + 하이브리드 클라우드 — AI 파이프라인 최적화 솔루션', ir: 'https://investors.netapp.com', news: 'https://www.netapp.com/newsroom', x: 'https://x.com/search?q=NetApp+AI+storage+2026' },
          { rank: 3, name: 'Western Digital', ticker: 'WDC', mktcap: '~$170억', color: '#003087', detail: 'HAMR HDD·NVMe SSD 대용량 스토리지 — AI 학습 데이터셋용 고용량 HDD 수요 급증', ir: 'https://investors.wdc.com', news: 'https://www.westerndigital.com/company/newsroom', x: 'https://x.com/search?q=Western+Digital+AI+storage' },
          { rank: 4, name: 'Seagate',        ticker: 'STX',  mktcap: '~$150억', color: '#00ae42', detail: '고용량 HDD Exos 시리즈 — AI 콜드 스토리지·데이터 레이크 수요 수혜', ir: 'https://investors.seagate.com', news: 'https://www.seagate.com/newsroom', x: 'https://x.com/search?q=Seagate+AI+storage+2026' },
          { rank: 5, name: 'Weka',           ticker: 'Private', mktcap: '~$10억', color: '#6d28d9', detail: 'AI/ML 파이프라인 특화 병렬 파일시스템 — NVIDIA DGX SuperPOD 공식 스토리지', ir: 'https://www.weka.io', news: 'https://www.weka.io/news', x: 'https://x.com/search?q=WekaIO+AI+storage' },
        ],
      },
    ],
  },
  {
    id: 'network',
    layer: '🔗 네트워킹 레이어',
    layerColor: '#eff6ff',
    components: [
      {
        id: 'ai-network',
        icon: '🔀',
        name: 'AI 네트워킹',
        desc: 'InfiniBand·이더넷 패브릭',
        companies: [
          { rank: 1, name: 'NVIDIA',          ticker: 'NVDA', mktcap: '~$2.7조',  color: '#76b900', detail: 'Quantum-X800 InfiniBand, NVLink 6, Spectrum-6 이더넷 — Rubin 랙 전용 네트워크', ir: 'https://investor.nvidia.com', news: 'https://nvidianews.nvidia.com', x: 'https://x.com/search?q=NVIDIA+InfiniBand+NVLink+2026' },
          { rank: 2, name: 'Broadcom',        ticker: 'AVGO', mktcap: '~$1.0조',  color: '#cc0000', detail: 'Tomahawk 6·Jericho3-AI 이더넷 스위치칩 — AI 클러스터 RoCE 네트워크 1위', ir: 'https://investors.broadcom.com', news: 'https://newsroom.broadcom.com', x: 'https://x.com/search?q=Broadcom+Tomahawk+AI+network' },
          { rank: 3, name: 'Arista Networks', ticker: 'ANET', mktcap: '~$1500억', color: '#007dc5', detail: '2026 AI 네트워킹 목표 $32.5억, Meta 10만 DPU DSF 네트워크 구축', ir: 'https://investors.arista.com', news: 'https://www.arista.com/en/company/news', x: 'https://x.com/search?q=Arista+Networks+AI+2026' },
          { rank: 4, name: 'Cisco',           ticker: 'CSCO', mktcap: '~$2400억', color: '#1ba0d7', detail: 'Silicon One G200, AI Pod 솔루션 — 엔터프라이즈 AI 클러스터 네트워크 강자', ir: 'https://investor.cisco.com', news: 'https://newsroom.cisco.com', x: 'https://x.com/search?q=Cisco+Silicon+One+AI+2026' },
          { rank: 5, name: 'Marvell',         ticker: 'MRVL', mktcap: '~$650억',  color: '#0051a2', detail: 'Teralynx 이더넷 스위치칩, Oclaro 광통신 — AI 데이터센터 네트워크 실리콘', ir: 'https://investor.marvell.com', news: 'https://www.marvell.com/newsroom', x: 'https://x.com/search?q=Marvell+Teralynx+AI+network' },
        ],
      },
      {
        id: 'optics',
        icon: '💡',
        name: '광트랜시버',
        desc: '고속 광학 통신 부품',
        companies: [
          { rank: 1, name: 'Coherent Corp', ticker: 'COHR', mktcap: '~$170억', color: '#00a3e0', detail: '800G·1.6T 광트랜시버 — AI 데이터센터 최대 수혜, NVIDIA·Cisco 주요 공급사', ir: 'https://www.coherent.com/company/investor-relations', news: 'https://www.coherent.com/news', x: 'https://x.com/search?q=Coherent+Corp+AI+transceiver+2026' },
          { rank: 2, name: 'Lumentum',     ticker: 'LITE', mktcap: '~$90억',  color: '#e31837', detail: 'VCSEL·광트랜시버 — 고속 클라우드 광통신 공급사, AI 데이터센터 수요 급증', ir: 'https://investor.lumentum.com', news: 'https://www.lumentum.com/en/news-releases', x: 'https://x.com/search?q=Lumentum+AI+optics+2026' },
          { rank: 3, name: 'Fabrinet',    ticker: 'FN',   mktcap: '~$60억',  color: '#0070c0', detail: '광모듈 위탁생산 1위 — Coherent·Lumentum 등 주요 광통신 업체 제조 파트너', ir: 'https://investor.fabrinet.com', news: 'https://www.fabrinet.com/news-events', x: 'https://x.com/search?q=Fabrinet+AI+optics' },
          { rank: 4, name: 'II-VI (Coherent)', ticker: 'COHR', mktcap: '(Coherent에 합병)', color: '#6b7280', detail: 'Coherent Corp에 합병 완료 — 광통신·반도체 레이저 통합 포트폴리오', ir: 'https://www.coherent.com/company/investor-relations', news: 'https://www.coherent.com/news', x: 'https://x.com/search?q=Coherent+II-VI+merger' },
          { rank: 5, name: 'Applied Optoelectronics', ticker: 'AAOI', mktcap: '~$4억', color: '#7c3aed', detail: '100G~400G 광트랜시버 소형 전문업체 — AI 데이터센터 수요로 2025~2026 급반등', ir: 'https://ir.ao-inc.com', news: 'https://www.ao-inc.com/news', x: 'https://x.com/search?q=Applied+Optoelectronics+AI' },
        ],
      },
    ],
  },
  {
    id: 'power-cooling',
    layer: '🔋 전력 & 냉각 레이어',
    layerColor: '#fefce8',
    components: [
      {
        id: 'power',
        icon: '⚡',
        name: '전력 인프라',
        desc: 'UPS, PDU, 변압기',
        companies: [
          { rank: 1, name: 'Schneider Electric', ticker: 'SU.PA', mktcap: '~$1500억', color: '#3dcd58', detail: 'EcoStruxure 데이터센터 통합 전력·관리 1위 — 2026 AI 데이터센터 전력 수주 급증', ir: 'https://www.se.com/us/en/about-us/investor-relations', news: 'https://www.se.com/us/en/about-us/press-releases', x: 'https://x.com/search?q=Schneider+Electric+AI+datacenter+2026' },
          { rank: 2, name: 'Eaton',              ticker: 'ETN',   mktcap: '~$1200억', color: '#ffd700', detail: 'UPS·PDU·배전 시스템 글로벌 1위 — AI 데이터센터 고밀도 전력 공급 전문', ir: 'https://www.eaton.com/us/en-us/company/investor-relations', news: 'https://www.eaton.com/us/en-us/company/news', x: 'https://x.com/search?q=Eaton+AI+power+datacenter+2026' },
          { rank: 3, name: 'Vertiv',             ticker: 'VRT',   mktcap: '~$400억',  color: '#e31837', detail: '800VDC 전력 포트폴리오 NVIDIA 로드맵 연동, AI 수주 폭증 — 2026 H2 출시 예정', ir: 'https://investors.vertiv.com', news: 'https://www.vertiv.com/en-us/about/news-and-insights', x: 'https://x.com/search?q=Vertiv+AI+power+800VDC+2026' },
          { rank: 4, name: 'ABB',                ticker: 'ABBN.SW', mktcap: '~$900억', color: '#ff000f', detail: '데이터센터 전력·자동화 솔루션 — AI 데이터센터 UPS·변압기 글로벌 공급', ir: 'https://investors.abb.com', news: 'https://new.abb.com/news', x: 'https://x.com/search?q=ABB+datacenter+power+AI' },
          { rank: 5, name: 'Siemens Energy',    ticker: 'ENR.DE', mktcap: '~$480억',  color: '#009999', detail: '변압기·그리드 솔루션 — 데이터센터 대형 전력 인프라 공급, 수주 잔고 사상 최고', ir: 'https://www.siemens-energy.com/global/en/home/investors', news: 'https://www.siemens-energy.com/global/en/home/press-releases', x: 'https://x.com/search?q=Siemens+Energy+datacenter+transformer' },
        ],
      },
      {
        id: 'cooling',
        icon: '❄️',
        name: '냉각 시스템',
        desc: '액침·공냉·수냉 쿨링',
        companies: [
          { rank: 1, name: 'Vertiv',             ticker: 'VRT',   mktcap: '~$400억',  color: '#e31837', detail: 'MegaMod HDX 모듈형 액침냉각 출시 — 랙당 120kW+ 고밀도 GPU 냉각 솔루션', ir: 'https://investors.vertiv.com', news: 'https://www.vertiv.com/en-us/about/news-and-insights', x: 'https://x.com/search?q=Vertiv+liquid+cooling+AI+2026' },
          { rank: 2, name: 'Schneider Electric', ticker: 'SU.PA', mktcap: '~$1500억', color: '#3dcd58', detail: '정밀 냉각·CRAC·Adiabatic 쿨링 — AI 데이터센터 통합 냉각관리 시스템', ir: 'https://www.se.com/us/en/about-us/investor-relations', news: 'https://www.se.com/us/en/about-us/press-releases', x: 'https://x.com/search?q=Schneider+Electric+cooling+AI' },
          { rank: 3, name: 'Modine',             ticker: 'MOD',   mktcap: '~$40억',   color: '#1e40af', detail: 'AI 데이터센터용 직접 액냉 시스템 전문 — 수주 잔고 급성장, AI 수혜 소형주', ir: 'https://investors.modine.com', news: 'https://www.modine.com/company/news', x: 'https://x.com/search?q=Modine+AI+datacenter+cooling' },
          { rank: 4, name: 'Johnson Controls',  ticker: 'JCI',   mktcap: '~$450억',  color: '#c8102e', detail: '데이터센터 HVAC·빌딩 자동화 — AI 시설 냉각·공조 시스템 글로벌 공급사', ir: 'https://investors.johnsoncontrols.com', news: 'https://www.johnsoncontrols.com/media-center', x: 'https://x.com/search?q=Johnson+Controls+datacenter+cooling' },
          { rank: 5, name: 'Comfort Systems',   ticker: 'FIX',   mktcap: '~$110억',  color: '#0f766e', detail: 'HVAC·기계설비 시공 — AI 데이터센터 냉각 시스템 시공 물량 급증', ir: 'https://investor.comfortsystems.com', news: 'https://www.comfortsystems.com/news', x: 'https://x.com/search?q=Comfort+Systems+AI+datacenter' },
        ],
      },
    ],
  },
  {
    id: 'infra',
    layer: '🏭 물리 인프라 레이어',
    layerColor: '#f0fdf4',
    components: [
      {
        id: 'construction',
        icon: '🏚️',
        name: '건설 / 엔지니어링',
        desc: '데이터센터 설계·시공',
        companies: [
          { rank: 1, name: 'Quanta Services', ticker: 'PWR',  mktcap: '~$400억', color: '#dc2626', detail: '데이터센터 전기·전력 인프라 시공 전문 — AI 수요로 수주 잔고 사상 최고치', ir: 'https://investor.quantaservices.com', news: 'https://www.quantaservices.com/news', x: 'https://x.com/search?q=Quanta+Services+AI+datacenter' },
          { rank: 2, name: 'AECOM',           ticker: 'ACM',  mktcap: '~$160억', color: '#1e3a5f', detail: '초대형 데이터센터 엔지니어링·설계 글로벌 1위 — 하이퍼스케일 캠퍼스 설계 다수', ir: 'https://investors.aecom.com', news: 'https://aecom.com/press-release', x: 'https://x.com/search?q=AECOM+datacenter+2026' },
          { rank: 3, name: 'MYR Group',       ticker: 'MYRG', mktcap: '~$30억',  color: '#0369a1', detail: '전기·기계 설비 전문 시공사 — AI 데이터센터 고압 전기공사 수주 급증', ir: 'https://investors.myrgroup.com', news: 'https://www.myrgroup.com/news', x: 'https://x.com/search?q=MYR+Group+datacenter' },
          { rank: 4, name: 'Jacobs',          ticker: 'J',    mktcap: '~$190억', color: '#6d28d9', detail: '데이터센터 설계·PM·환경 엔지니어링 — 정부·국방 AI 데이터센터 프로젝트 수주', ir: 'https://jacobs.com/investor-relations', news: 'https://jacobs.com/newsroom', x: 'https://x.com/search?q=Jacobs+Engineering+datacenter' },
          { rank: 5, name: 'Fluor',           ticker: 'FLR',  mktcap: '~$50억',  color: '#15803d', detail: '대형 산업시설·데이터센터 EPC 프로젝트 — AI 인프라 건설 물량 확대', ir: 'https://investor.fluor.com', news: 'https://www.fluor.com/news', x: 'https://x.com/search?q=Fluor+datacenter+AI' },
        ],
      },
      {
        id: 'energy',
        icon: '🔆',
        name: '에너지 공급',
        desc: '전력 생산·공급 (원전·신재생)',
        companies: [
          { rank: 1, name: 'NextEra Energy',      ticker: 'NEE', mktcap: '~$1500억', color: '#0f766e', detail: '재생에너지 세계 1위, 데이터센터 PPA 계약 확대 — AI 수요로 신규 태양광·풍력 가속', ir: 'https://investor.nexteraenergy.com', news: 'https://newsroom.nexteraenergy.com', x: 'https://x.com/search?q=NextEra+Energy+AI+datacenter+2026' },
          { rank: 2, name: 'Constellation Energy', ticker: 'CEG', mktcap: '~$700억',  color: '#1d4ed8', detail: '원전 전력 AI 데이터센터 직접 공급 계약 급증 — Microsoft Three Mile Island 재가동', ir: 'https://investor.constellationenergy.com', news: 'https://www.constellationenergy.com/newsroom', x: 'https://x.com/search?q=Constellation+Energy+nuclear+AI+2026' },
          { rank: 3, name: 'Vistra Energy',        ticker: 'VST', mktcap: '~$400억',  color: '#7c3aed', detail: '원전·가스 발전, Microsoft·Google 빅테크 전력 공급 계약 — AI 수요 수혜 최대주', ir: 'https://ir.vistracorp.com', news: 'https://www.vistracorp.com/news', x: 'https://x.com/search?q=Vistra+Energy+AI+datacenter+2026' },
          { rank: 4, name: 'Dominion Energy',      ticker: 'D',   mktcap: '~$450억',  color: '#0369a1', detail: '버지니아 데이터센터 밸리 전력 공급 1위 — 신규 원전 건설 추진, AI 수요 대응', ir: 'https://investors.dominionenergy.com', news: 'https://news.dominionenergy.com', x: 'https://x.com/search?q=Dominion+Energy+datacenter+Virginia' },
          { rank: 5, name: 'Duke Energy',          ticker: 'DUK', mktcap: '~$800억',  color: '#e85f10', detail: '남동부 전력 1위, 데이터센터 집중 지역 공급자 — AI 수요 대응 원전·재생에너지 확대', ir: 'https://investors.duke-energy.com', news: 'https://news.duke-energy.com', x: 'https://x.com/search?q=Duke+Energy+AI+datacenter' },
        ],
      },
    ],
  },
];

export const ALL_COMPONENTS = LAYERS.flatMap(l => l.components);
