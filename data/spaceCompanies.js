// 우주 섹터 밸류체인 기업 데이터 (2026년 기준)
// candidates[]: 각 카테고리의 후보풀 (10-15개)
// API로 시총을 가져와 내림차순 정렬 → 상위 10개를 Top 10으로 동적 표시

export const SPACE_LAYERS = [
  {
    id: 'launch',
    layer: '🚀 발사체 / 론치 서비스',
    components: [
      {
        id: 'launch_vehicle',
        icon: '🚀',
        name: '로켓 발사 서비스',
        desc: '궤도·준궤도 발사체 개발·운용',
        candidates: [
          { rank: 1,  name: 'SpaceX',           ticker: 'Private',   mktcap: '~$3500억', detail: 'Falcon 9·Falcon Heavy·Starship — 전 세계 발사 시장 60%+ 점유, 재사용 로켓 패러다임 선도', ir: 'https://www.spacex.com', news: 'https://www.spacex.com/updates', x: 'https://x.com/search?q=SpaceX+launch+2026' },
          { rank: 2,  name: 'Rocket Lab',        ticker: 'RKLB',      mktcap: '~$120억',  detail: 'Electron·Neutron 개발 중 — 소형위성 전문 발사체, 뉴질랜드·미국 발사장 운영', ir: 'https://investors.rocketlabusa.com', news: 'https://www.rocketlabusa.com/updates', x: 'https://x.com/search?q=Rocket+Lab+launch+2026' },
          { rank: 3,  name: 'United Launch Alliance', ticker: 'Private', mktcap: 'N/A',  detail: 'Vulcan Centaur·Delta IV — Boeing·Lockheed 합작, 미국 정부·국방 발사 주력 업체', ir: 'https://www.ulalaunch.com', news: 'https://www.ulalaunch.com/news', x: 'https://x.com/search?q=ULA+Vulcan+launch+2026' },
          { rank: 4,  name: 'Arianespace',       ticker: 'Private',   mktcap: 'N/A',      detail: 'Ariane 6 — 유럽 주력 상업 발사체, ESA 지원으로 국제 상업 위성 발사 담당', ir: 'https://www.arianespace.com', news: 'https://www.arianespace.com/news', x: 'https://x.com/search?q=Arianespace+Ariane6+2026' },
          { rank: 5,  name: 'Blue Origin',       ticker: 'Private',   mktcap: 'N/A',      detail: 'New Glenn·New Shepard — Jeff Bezos 설립, 달 착륙선 Blue Moon·재사용 발사체 개발', ir: 'https://www.blueorigin.com', news: 'https://www.blueorigin.com/news', x: 'https://x.com/search?q=Blue+Origin+New+Glenn+2026' },
          { rank: 6,  name: 'Relativity Space', ticker: 'Private',   mktcap: 'N/A',       detail: '3D 프린팅 로켓 Terran R — 완전재사용 중형 발사체 개발 중, 2026 첫 발사 목표', ir: 'https://www.relativityspace.com', news: 'https://www.relativityspace.com/news', x: 'https://x.com/search?q=Relativity+Space+Terran+2026' },
          { rank: 7,  name: 'Mitsubishi Heavy Industries', ticker: '7011.T', mktcap: '~$200억', detail: 'H3 로켓 — 일본 JAXA 협력 차세대 발사체, 상업 발사 시장 진입 추진', ir: 'https://www.mhi.com/ir', news: 'https://www.mhi.com/news', x: 'https://x.com/search?q=H3+rocket+MHI+launch+2026' },
          { rank: 8,  name: 'Astra Space',       ticker: 'ASTR',      mktcap: '~$1억',    detail: '초소형 발사체 전문 — Rocket 3.3, 소형 위성 군집 저비용 발사 서비스 시도', ir: 'https://astra.com/investors', news: 'https://astra.com/news', x: 'https://x.com/search?q=Astra+Space+launch' },
          { rank: 9,  name: 'ABL Space Systems', ticker: 'Private',   mktcap: 'N/A',      detail: 'RS1 발사체 — 소형위성 전용, 미국 공군 계약 확보, 저비용 발사 시장 공략', ir: 'https://ablspacesystems.com', news: 'https://ablspacesystems.com/news', x: 'https://x.com/search?q=ABL+Space+RS1+launch' },
          { rank: 10, name: 'Firefly Aerospace', ticker: 'Private',   mktcap: 'N/A',      detail: 'Alpha·MLV — 소형~중형 발사체 포트폴리오, NASA 달 착륙 임무 계약 확보', ir: 'https://firefly.com', news: 'https://firefly.com/news', x: 'https://x.com/search?q=Firefly+Aerospace+launch+2026' },
          { rank: 11, name: 'Virgin Galactic',   ticker: 'SPCE',      mktcap: '~$2억',    detail: 'VSS Unity 준궤도 우주여행 — 델타클래스 우주선 개발 중, 상업 우주관광 개척', ir: 'https://investors.virgingalactic.com', news: 'https://www.virgingalactic.com/press', x: 'https://x.com/search?q=Virgin+Galactic+2026' },
          { rank: 12, name: 'Exos Aerospace',    ticker: 'Private',   mktcap: 'N/A',      detail: 'SARGE 재사용 준궤도 발사체 — 미세중력 실험·소형위성 저비용 발사 서비스', ir: 'https://exosaerospace.com', news: 'https://exosaerospace.com/news', x: 'https://x.com/search?q=Exos+Aerospace+launch' },
        ],
      },
    ],
  },
  {
    id: 'satellite',
    layer: '🛰️ 인공위성 제작 / 운용',
    components: [
      {
        id: 'sat_manufacturer',
        icon: '🛰️',
        name: '위성 제조 / 버스',
        desc: '위성 본체·버스 설계·제작',
        candidates: [
          { rank: 1,  name: 'Lockheed Martin',  ticker: 'LMT',       mktcap: '~$1000억', detail: 'A2100·LM 400 위성 버스 — GPS III, SBIRS, SES 등 대형 군·상업 위성 제작 글로벌 1위', ir: 'https://www.lockheedmartin.com/en-us/investors.html', news: 'https://news.lockheedmartin.com', x: 'https://x.com/search?q=Lockheed+Martin+satellite+2026' },
          { rank: 2,  name: 'Boeing',            ticker: 'BA',        mktcap: '~$1300억', detail: 'Boeing 702 위성 버스 — Starliner·위성통신 대형 플랫폼, 정지궤도 방송·통신위성 주력', ir: 'https://investors.boeing.com', news: 'https://boeing.mediaroom.com', x: 'https://x.com/search?q=Boeing+satellite+2026' },
          { rank: 3,  name: 'Airbus Defence & Space', ticker: 'AIR.PA', mktcap: '~$1100억', detail: 'Eurostar·OneSat 위성 플랫폼 — 유럽 최대 위성 제조사, 디지털페이로드 위성 선도', ir: 'https://www.airbus.com/en/investors', news: 'https://www.airbus.com/en/newsroom', x: 'https://x.com/search?q=Airbus+Defence+Space+satellite+2026' },
          { rank: 4,  name: 'Northrop Grumman', ticker: 'NOC',        mktcap: '~$700억',  detail: 'GEOStar·위성 서비스 연장 — MEV(수명연장 우주선), 군사·정보위성 주요 제조사', ir: 'https://investor.northropgrumman.com', news: 'https://news.northropgrumman.com', x: 'https://x.com/search?q=Northrop+Grumman+satellite+2026' },
          { rank: 5,  name: 'Maxar Technologies', ticker: 'MAXR',     mktcap: '~$60억',   detail: '1300 위성 버스 — WorldView 지구관측위성·NASA·정부위성 제조, 위성 이미지 서비스 병행', ir: 'https://investors.maxar.com', news: 'https://www.maxar.com/newsroom', x: 'https://x.com/search?q=Maxar+Technologies+satellite+2026' },
          { rank: 6,  name: 'Thales Alenia Space', ticker: 'HO.PA',   mktcap: 'N/A(자회사)', detail: 'Thales·Leonardo 합작 — 통신위성·ISS 모듈·Copernicus 지구관측위성 유럽 2위 제조사', ir: 'https://www.thalesgroup.com/en/investors', news: 'https://www.thalesgroup.com/en/worldwide/space/news', x: 'https://x.com/search?q=Thales+Alenia+Space+satellite+2026' },
          { rank: 7,  name: 'Surrey Satellite Technology', ticker: 'Private', mktcap: 'N/A', detail: 'SSTL — 소형·중형 위성 제조 선구자, Airbus 자회사, 100+ 위성 납품 실적', ir: 'https://www.sstl.co.uk', news: 'https://www.sstl.co.uk/news', x: 'https://x.com/search?q=Surrey+Satellite+SSTL+2026' },
          { rank: 8,  name: 'Planet Labs',        ticker: 'PL',        mktcap: '~$10억',   detail: 'Dove·SkySat 큐브샛 군집 — 하루 1회 전 지구 촬영, 위성 제조·운용·이미지 판매 수직통합', ir: 'https://investors.planet.com', news: 'https://www.planet.com/company/news', x: 'https://x.com/search?q=Planet+Labs+satellite+2026' },
          { rank: 9,  name: 'Spire Global',       ticker: 'SPIR',      mktcap: '~$3억',    detail: 'LEMUR 큐브샛 군집 — 기상·해운·항공 데이터 수집 위성 운용, 데이터 서비스 SaaS 모델', ir: 'https://investors.spire.com', news: 'https://spire.com/news', x: 'https://x.com/search?q=Spire+Global+satellite+2026' },
          { rank: 10, name: 'Terran Orbital',     ticker: 'LLAP',      mktcap: '~$5억',    detail: '소형~중형 위성 제조 전문 — Lockheed 지분 투자, 미 국방부 위성 대량생산 계약', ir: 'https://investors.terranorbital.com', news: 'https://www.terranorbital.com/news', x: 'https://x.com/search?q=Terran+Orbital+satellite+2026' },
          { rank: 11, name: 'Mitsubishi Electric', ticker: '6503.T',   mktcap: '~$250억',  detail: 'MELCO 위성 버스 — 일본 국산위성 주력 제조사, JAXA·SoftBank 위성 납품', ir: 'https://www.mitsubishielectric.com/ir', news: 'https://www.mitsubishielectric.com/news', x: 'https://x.com/search?q=Mitsubishi+Electric+satellite+2026' },
          { rank: 12, name: 'Swarm Technologies', ticker: 'Private(acq.SpaceX)', mktcap: 'N/A', detail: 'SpaceX 인수 초소형 위성 IoT 군집 — 타일형 초소형 위성, IoT 글로벌 연결 서비스', ir: 'https://swarm.space', news: 'https://swarm.space/news', x: 'https://x.com/search?q=Swarm+Technologies+satellite' },
        ],
      },
      {
        id: 'sat_comms',
        icon: '📡',
        name: '위성통신 / 인터넷',
        desc: '저궤도·정지궤도 통신 서비스',
        candidates: [
          { rank: 1,  name: 'SpaceX (Starlink)', ticker: 'Private',   mktcap: '~$3500억', detail: 'Starlink 7,000+ 위성 군집 — 전 세계 400만+ 가입자, LEO 위성통신 시장 독점적 선도', ir: 'https://www.spacex.com', news: 'https://www.starlink.com/news', x: 'https://x.com/search?q=Starlink+satellite+internet+2026' },
          { rank: 2,  name: 'Viasat',            ticker: 'VSAT',      mktcap: '~$30억',   detail: 'ViaSat-3 정지궤도 — 전 세계 커버리지 광대역 위성인터넷, 항공·해상 연결 서비스', ir: 'https://investors.viasat.com', news: 'https://news.viasat.com', x: 'https://x.com/search?q=Viasat+satellite+internet+2026' },
          { rank: 3,  name: 'Intelsat',          ticker: 'Private',   mktcap: 'N/A',      detail: '정지궤도 위성군 운용 최대 사업자 — 방송·백홀·정부 통신서비스, 재무 구조조정 후 재성장', ir: 'https://www.intelsat.com', news: 'https://www.intelsat.com/news', x: 'https://x.com/search?q=Intelsat+satellite+2026' },
          { rank: 4,  name: 'SES',               ticker: 'SESG.PA',   mktcap: '~$30억',   detail: 'MEO O3b mPOWER·GEO 위성군 — 정부·기업·해운 광대역 서비스, Intelsat 합병 추진', ir: 'https://www.ses.com/investors', news: 'https://www.ses.com/press-releases', x: 'https://x.com/search?q=SES+satellite+2026' },
          { rank: 5,  name: 'Amazon (Kuiper)',   ticker: 'AMZN',      mktcap: '~$2.3조',  detail: 'Project Kuiper 3,200+ LEO 위성 — 2026 상용서비스 목표, AWS 연동 우주 클라우드 인프라', ir: 'https://ir.aboutamazon.com', news: 'https://www.aboutamazon.com/news/tag/project-kuiper', x: 'https://x.com/search?q=Amazon+Kuiper+satellite+2026' },
          { rank: 6,  name: 'Telesat',           ticker: 'TSAT',      mktcap: '~$5억',    detail: 'Telesat Lightspeed LEO 198기 — 캐나다 정부 지원 저궤도 광대역 위성군 구축 중', ir: 'https://www.telesat.com/investors', news: 'https://www.telesat.com/press-releases', x: 'https://x.com/search?q=Telesat+Lightspeed+2026' },
          { rank: 7,  name: 'EchoStar',          ticker: 'SATS',      mktcap: '~$15억',   detail: 'HughesNet·Jupiter 정지궤도 — 미국 위성인터넷 2위, 농촌·원격지 커버리지 특화', ir: 'https://echostar.com/investors', news: 'https://echostar.com/news', x: 'https://x.com/search?q=EchoStar+HughesNet+2026' },
          { rank: 8,  name: 'OneWeb (Eutelsat)', ticker: 'ETL.PA',    mktcap: '~$15억',   detail: 'OneWeb 648 LEO 위성군 — Eutelsat 합병, 유럽 주도 저궤도 위성통신 Starlink 경쟁자', ir: 'https://www.eutelsat.com/en/investors.html', news: 'https://www.eutelsat.com/en/news.html', x: 'https://x.com/search?q=OneWeb+Eutelsat+LEO+2026' },
          { rank: 9,  name: 'AST SpaceMobile',  ticker: 'ASTS',       mktcap: '~$30억',   detail: 'BlueBird LEO — 기존 스마트폰과 직접 통신하는 위성망, AT&T·Verizon 파트너십', ir: 'https://investors.ast-science.com', news: 'https://ast-science.com/news', x: 'https://x.com/search?q=AST+SpaceMobile+BlueBird+2026' },
          { rank: 10, name: 'Iridium',           ticker: 'IRDM',      mktcap: '~$35억',   detail: 'Iridium NEXT 66기 LEO 군집 — 극지방 포함 전 지구 커버리지, IoT·위성전화 서비스', ir: 'https://investor.iridium.com', news: 'https://www.iridium.com/news', x: 'https://x.com/search?q=Iridium+satellite+2026' },
          { rank: 11, name: 'Globalstar',        ticker: 'GSAT',      mktcap: '~$15억',   detail: 'LEO 48기 군집 — Apple iPhone 위성SOS 파트너, IoT·위성전화·비상통신 서비스', ir: 'https://investor.globalstar.com', news: 'https://www.globalstar.com/en-us/corporate/press-releases', x: 'https://x.com/search?q=Globalstar+Apple+satellite+2026' },
          { rank: 12, name: 'Ligado Networks',   ticker: 'Private',   mktcap: 'N/A',      detail: 'L-밴드 위성·지상 하이브리드 네트워크 — IoT·커넥티드카 5G 보완 서비스, 미 정부 면허 보유', ir: 'https://ligado.com', news: 'https://ligado.com/news', x: 'https://x.com/search?q=Ligado+Networks+satellite+2026' },
        ],
      },
    ],
  },
  {
    id: 'data',
    layer: '📊 우주 데이터 / 분석',
    components: [
      {
        id: 'earth_observation',
        icon: '🌍',
        name: '지구 관측 / 위성 이미지',
        desc: '위성 원격탐사, 영상·데이터 판매',
        candidates: [
          { rank: 1,  name: 'Maxar Technologies', ticker: 'MAXR',    mktcap: '~$60억',   detail: 'WorldView-3·4 고해상도 위성 이미지 — 미 국방부·CIA 독점 공급, 30cm급 해상도 위성 운용', ir: 'https://investors.maxar.com', news: 'https://www.maxar.com/newsroom', x: 'https://x.com/search?q=Maxar+WorldView+imagery+2026' },
          { rank: 2,  name: 'Planet Labs',        ticker: 'PL',       mktcap: '~$10억',   detail: '하루 1회 전 지구 촬영 Dove 군집 — 농업·산림·도시변화 모니터링, AI 분석 플랫폼 병행', ir: 'https://investors.planet.com', news: 'https://www.planet.com/company/news', x: 'https://x.com/search?q=Planet+Labs+earth+observation+2026' },
          { rank: 3,  name: 'Satellogic',         ticker: 'SATL',     mktcap: '~$2억',    detail: '70cm급 다중분광 위성군 — 중남미 기반 저비용 고해상도 위성 이미지, 머신러닝 분석 통합', ir: 'https://investors.satellogic.com', news: 'https://satellogic.com/news', x: 'https://x.com/search?q=Satellogic+earth+observation+2026' },
          { rank: 4,  name: 'BlackSky',           ticker: 'BKSY',     mktcap: '~$2억',    detail: '준실시간 지구 관측·AI 분석 — 특정 지점 시간당 재방문, 정부·기업 인텔리전스 서비스', ir: 'https://investors.blacksky.com', news: 'https://www.blacksky.com/news', x: 'https://x.com/search?q=BlackSky+satellite+intelligence+2026' },
          { rank: 5,  name: 'Airbus Defence & Space', ticker: 'AIR.PA', mktcap: '~$1100억', detail: 'Pléiades Neo·SPOT 위성군 — 최고 30cm 해상도, Copernicus 위성 운용·ESA 협력', ir: 'https://www.airbus.com/en/investors', news: 'https://www.airbus.com/en/newsroom/press-releases', x: 'https://x.com/search?q=Airbus+Pleiades+earth+observation+2026' },
          { rank: 6,  name: 'Spire Global',       ticker: 'SPIR',     mktcap: '~$3억',    detail: 'GPS-RO 기상 데이터·AIS 선박·ADS-B 항공 — 위성 데이터 수집·SaaS 서비스 수직통합', ir: 'https://investors.spire.com', news: 'https://spire.com/news', x: 'https://x.com/search?q=Spire+Global+data+analytics+2026' },
          { rank: 7,  name: 'HawkEye 360',        ticker: 'Private',  mktcap: 'N/A',      detail: 'RF신호 위성 군집 감청 — 불법 선박·재난신호 탐지, 스펙트럼 모니터링 전문 데이터 서비스', ir: 'https://www.he360.com', news: 'https://www.he360.com/news', x: 'https://x.com/search?q=HawkEye+360+RF+satellite+2026' },
          { rank: 8,  name: 'ICEYE',              ticker: 'Private',  mktcap: 'N/A',      detail: 'SAR(합성개구레이더) 소형 위성군 — 야간·구름 관통 영상, 보험·재난·국방 데이터 서비스', ir: 'https://www.iceye.com', news: 'https://www.iceye.com/news', x: 'https://x.com/search?q=ICEYE+SAR+satellite+2026' },
          { rank: 9,  name: 'Capella Space',      ticker: 'Private',  mktcap: 'N/A',      detail: '초소형 SAR 군집 위성 — 1시간 재방문 정찰 이미지, NGA·미군·동맹 정보기관 공급', ir: 'https://www.capellaspace.com', news: 'https://www.capellaspace.com/news', x: 'https://x.com/search?q=Capella+Space+SAR+2026' },
          { rank: 10, name: 'Umbra',              ticker: 'Private',  mktcap: 'N/A',      detail: '25cm급 상업 SAR 위성 — 최고해상도 상업 레이더 이미지, 오픈데이터 정책으로 시장 파괴', ir: 'https://umbra.space', news: 'https://umbra.space/news', x: 'https://x.com/search?q=Umbra+SAR+satellite+2026' },
          { rank: 11, name: 'Orbital Insight',    ticker: 'Private',  mktcap: 'N/A',      detail: '위성 이미지 AI 분석 플랫폼 — 주차장 차량 수·유전 저장량 분석 등 대안적 투자 데이터', ir: 'https://orbitalinsight.com', news: 'https://orbitalinsight.com/news', x: 'https://x.com/search?q=Orbital+Insight+geospatial+AI' },
          { rank: 12, name: 'Descartes Labs',     ticker: 'Private',  mktcap: 'N/A',      detail: '위성·센서 빅데이터 AI 플랫폼 — 농업 작황·기후 예측, IBM 인수 후 엔터프라이즈 AI 통합', ir: 'https://www.descarteslabs.com', news: 'https://www.descarteslabs.com/news', x: 'https://x.com/search?q=Descartes+Labs+satellite+AI' },
        ],
      },
      {
        id: 'space_analytics',
        icon: '🔭',
        name: '우주 상황 인식 / 항법',
        desc: 'GPS·SSA·우주 기상 데이터',
        candidates: [
          { rank: 1,  name: 'Garmin',             ticker: 'GRMN',     mktcap: '~$250억',  detail: '항공·해양·육상 GPS 수신기 1위 — GNSS 기반 내비게이션, 정밀 측위 솔루션 전문', ir: 'https://investor.garmin.com', news: 'https://www.garmin.com/en-US/newsroom', x: 'https://x.com/search?q=Garmin+GPS+navigation+2026' },
          { rank: 2,  name: 'Trimble',             ticker: 'TRMB',     mktcap: '~$150억',  detail: '정밀 GNSS·측량 솔루션 — 농업·건설·지도제작용 위성 측위 시스템, RTK 네트워크 운용', ir: 'https://investor.trimble.com', news: 'https://www.trimble.com/en/news', x: 'https://x.com/search?q=Trimble+GNSS+precision+2026' },
          { rank: 3,  name: 'NovAtel (Hexagon)', ticker: 'HXGBY',     mktcap: '~$300억',  detail: 'GNSS 수신기·인터페이스 솔루션 — 자율주행·드론·정밀농업 고정밀 위치정보 공급', ir: 'https://investors.hexagon.com', news: 'https://hexagon.com/news', x: 'https://x.com/search?q=Hexagon+NovAtel+GNSS+2026' },
          { rank: 4,  name: 'LeoLabs',            ticker: 'Private',  mktcap: 'N/A',      detail: '우주 물체 추적 레이다 네트워크 — 저궤도 10cm급 잔해 추적, 위성 충돌 회피 서비스', ir: 'https://leolabs.space', news: 'https://leolabs.space/news', x: 'https://x.com/search?q=LeoLabs+space+situational+awareness+2026' },
          { rank: 5,  name: 'ExoAnalytic Solutions', ticker: 'Private', mktcap: 'N/A',   detail: '광학 망원경 네트워크 — GEO·MEO 위성·우주 잔해 실시간 감시, 미 우주군·정보기관 공급', ir: 'https://exoanalytic.com', news: 'https://exoanalytic.com/news', x: 'https://x.com/search?q=ExoAnalytic+space+surveillance+2026' },
          { rank: 6,  name: 'Slingshot Aerospace', ticker: 'Private', mktcap: 'N/A',     detail: '우주 상황인식 SaaS — 위성 충돌 예측·우주 교통관리, 미 우주군·상업 운용사 구독 서비스', ir: 'https://www.slingshotaerospace.com', news: 'https://www.slingshotaerospace.com/news', x: 'https://x.com/search?q=Slingshot+Aerospace+SSA+2026' },
          { rank: 7,  name: 'Aalyria Technologies', ticker: 'Private', mktcap: 'N/A',    detail: 'Google 분사 우주 네트워크 관리 — Spacetime(레이저 통신 네트워크 스케줄링) AI 플랫폼', ir: 'https://www.aalyria.com', news: 'https://www.aalyria.com/blog', x: 'https://x.com/search?q=Aalyria+Technologies+space+network+2026' },
          { rank: 8,  name: 'Kayhan Space',        ticker: 'Private',  mktcap: 'N/A',     detail: '위성 자율 충돌회피 소프트웨어 — AI 기반 기동 계획, 군집 위성 운용 자동화', ir: 'https://kayhan.space', news: 'https://kayhan.space/news', x: 'https://x.com/search?q=Kayhan+Space+collision+avoidance' },
          { rank: 9,  name: 'Tomorrow.io',         ticker: 'Private',  mktcap: 'N/A',     detail: '우주 기상 큐브샛 — 마이크로파 관측 위성 자체 운용, 강수·우주기상 예보 API 서비스', ir: 'https://www.tomorrow.io', news: 'https://www.tomorrow.io/blog', x: 'https://x.com/search?q=Tomorrow.io+weather+satellite+2026' },
          { rank: 10, name: 'Aurora Insight',      ticker: 'Private',  mktcap: 'N/A',     detail: '위성 스펙트럼 감시 — RF 주파수 분석·무선 네트워크 성능 측정 전문 데이터 서비스', ir: 'https://www.aurorainsight.com', news: 'https://www.aurorainsight.com/news', x: 'https://x.com/search?q=Aurora+Insight+spectrum+satellite' },
        ],
      },
    ],
  },
  {
    id: 'defense',
    layer: '🛡️ 우주 국방 / 시스템 통합',
    components: [
      {
        id: 'defense_space',
        icon: '🛡️',
        name: '우주 국방 / 시스템 통합',
        desc: '군사위성·미사일 방어·정보전',
        candidates: [
          { rank: 1,  name: 'Lockheed Martin',  ticker: 'LMT',       mktcap: '~$1000억', detail: 'GPS III·SBIRS·THAAD — 미 우주군·미사일 방어 핵심 시스템, F-35·우주전투기 통합 플랫폼', ir: 'https://www.lockheedmartin.com/en-us/investors.html', news: 'https://news.lockheedmartin.com', x: 'https://x.com/search?q=Lockheed+Martin+space+defense+2026' },
          { rank: 2,  name: 'Northrop Grumman', ticker: 'NOC',        mktcap: '~$700억',  detail: 'GBSD(차세대 ICBM)·위성 정보 수집 — 우주 조기경보·핵 억제력 현대화 핵심 계약', ir: 'https://investor.northropgrumman.com', news: 'https://news.northropgrumman.com', x: 'https://x.com/search?q=Northrop+Grumman+space+defense+2026' },
          { rank: 3,  name: 'Raytheon Technologies', ticker: 'RTX',   mktcap: '~$1500억', detail: '우주 기반 미사일 방어 센서·레이다 — SPY-6·SM-3 요격 미사일, 우주 상황인식 레이더', ir: 'https://investors.rtx.com', news: 'https://www.rtx.com/news', x: 'https://x.com/search?q=Raytheon+space+missile+defense+2026' },
          { rank: 4,  name: 'L3Harris Technologies', ticker: 'LHX',   mktcap: '~$380억',  detail: '군사 통신위성 탑재체·우주 전자전 시스템 — SDA 광통신 위성 계약, 탑재체 공급 1위', ir: 'https://investors.l3harris.com', news: 'https://www.l3harris.com/news', x: 'https://x.com/search?q=L3Harris+space+military+satellite+2026' },
          { rank: 5,  name: 'General Dynamics',  ticker: 'GD',        mktcap: '~$700억',  detail: '우주 지상 시스템·보안 통신 — 미 우주군 위성 지상국 운용·사이버 보안 솔루션', ir: 'https://investor.gd.com', news: 'https://www.gd.com/Articles', x: 'https://x.com/search?q=General+Dynamics+space+defense+2026' },
          { rank: 6,  name: 'Leidos',            ticker: 'LDOS',      mktcap: '~$200억',  detail: '우주 시스템 IT 통합·분석 — NASA·NRO·우주군 데이터 분석·운용 지원, 위성 지상 시스템', ir: 'https://ir.leidos.com', news: 'https://www.leidos.com/news', x: 'https://x.com/search?q=Leidos+space+defense+2026' },
          { rank: 7,  name: 'Booz Allen Hamilton', ticker: 'BAH',     mktcap: '~$170억',  detail: '우주 국방 컨설팅·AI 분석 — 위성 이미지 AI 분석, 우주 전략 정책 자문, 정보기관 계약', ir: 'https://investor.boozallen.com', news: 'https://www.boozallen.com/insights.html', x: 'https://x.com/search?q=Booz+Allen+Hamilton+space+AI+defense' },
          { rank: 8,  name: 'Palantir',          ticker: 'PLTR',      mktcap: '~$2000억', detail: '우주 데이터 융합 분석 — 위성 이미지·신호 데이터 AI 통합, 미 우주군·NATO 전술 플랫폼', ir: 'https://investors.palantir.com', news: 'https://www.palantir.com/newsroom', x: 'https://x.com/search?q=Palantir+space+military+AI+2026' },
          { rank: 9,  name: 'Sierra Space',       ticker: 'Private',  mktcap: 'N/A',      detail: 'Dream Chaser 우주왕복선 — NASA 화물운송 계약, 군사 궤도 플랫폼 LIFE 모듈 개발', ir: 'https://sierraspace.com', news: 'https://sierraspace.com/news', x: 'https://x.com/search?q=Sierra+Space+Dream+Chaser+2026' },
          { rank: 10, name: 'Elbit Systems',      ticker: 'ESLT',     mktcap: '~$90억',   detail: '이스라엘 위성 탑재체·정찰 위성 — OPTSAT-3000 군사정찰, 광전자·SAR 위성 탑재체 공급', ir: 'https://www.elbitsystems.com/investors', news: 'https://www.elbitsystems.com/news', x: 'https://x.com/search?q=Elbit+Systems+satellite+defense+2026' },
        ],
      },
    ],
  },
  {
    id: 'materials',
    layer: '🔩 우주 소재 / 부품 / 제조',
    components: [
      {
        id: 'propulsion',
        icon: '🔥',
        name: '로켓 추진 / 엔진',
        desc: '로켓 엔진·추진제·추력기',
        candidates: [
          { rank: 1,  name: 'Aerojet Rocketdyne', ticker: 'AJRD',    mktcap: '~$50억',   detail: 'RS-25 메인엔진·RL10 상단엔진 — NASA SLS·ULA Vulcan 엔진 공급, 미사일 추진체계 독점', ir: 'https://www.l3harris.com/news', news: 'https://www.aerojetrocketdyne.com/news', x: 'https://x.com/search?q=Aerojet+Rocketdyne+rocket+engine+2026' },
          { rank: 2,  name: 'Safran',             ticker: 'SAF.PA',   mktcap: '~$700억',  detail: 'Ariane 6 Vulcain·Vinci 엔진 — 유럽 발사체 엔진 독점 공급, 위성 추력기·항공우주 부품', ir: 'https://www.safran-group.com/investors', news: 'https://www.safran-group.com/media', x: 'https://x.com/search?q=Safran+Ariane+rocket+engine+2026' },
          { rank: 3,  name: 'Rocket Lab',         ticker: 'RKLB',     mktcap: '~$120억',  detail: 'Rutherford·Archimedes 엔진 — 전기식 터보펌프 혁신, 3D 프린팅 엔진 양산, 자사 로켓 탑재', ir: 'https://investors.rocketlabusa.com', news: 'https://www.rocketlabusa.com/updates', x: 'https://x.com/search?q=Rocket+Lab+engine+Archimedes+2026' },
          { rank: 4,  name: 'Ursa Major',         ticker: 'Private',  mktcap: 'N/A',      detail: 'Hadley·Ripley 로켓 엔진 전문 제조 — 미국 발사체 엔진 공급망 다변화, 국방부 투자 지원', ir: 'https://ursamajor.com', news: 'https://ursamajor.com/news', x: 'https://x.com/search?q=Ursa+Major+rocket+engine+2026' },
          { rank: 5,  name: 'Dawn Aerospace',     ticker: 'Private',  mktcap: 'N/A',      detail: '아산화질소 추진 위성 추력기 — 친환경 저독성 추진제, 큐브샛·소형위성 추력기 공급', ir: 'https://www.dawnaerospace.com', news: 'https://www.dawnaerospace.com/news', x: 'https://x.com/search?q=Dawn+Aerospace+propulsion+2026' },
          { rank: 6,  name: 'IHI Corporation',    ticker: '7013.T',   mktcap: '~$70억',   detail: 'LE-9 엔진(H3 로켓) — 일본 국산 발사체 엔진 주력 제조사, 항공우주 부품 수출', ir: 'https://www.ihi.co.jp/en/ir', news: 'https://www.ihi.co.jp/en/all_news', x: 'https://x.com/search?q=IHI+LE9+H3+rocket+engine+2026' },
          { rank: 7,  name: 'Bradford ECAPS',     ticker: 'Private',  mktcap: 'N/A',      detail: 'HPGP 고성능 그린 추진제 — 히드라진 대체 친환경 위성 추력기, 큐브샛~중형 위성 탑재', ir: 'https://www.bradford-space.com', news: 'https://www.bradford-space.com/news', x: 'https://x.com/search?q=Bradford+ECAPS+green+propulsion' },
        ],
      },
      {
        id: 'advanced_materials',
        icon: '🧪',
        name: '고성능 소재 / 구조재',
        desc: '탄소섬유·내열·경량 합금 소재',
        candidates: [
          { rank: 1,  name: 'Toray Industries',  ticker: '3402.T',   mktcap: '~$150억',  detail: '탄소섬유 세계 1위 — SpaceX·Boeing 로켓·위성 구조재 TORAYCA, 우주·항공 탄소복합재 독점 공급', ir: 'https://www.toray.com/investors', news: 'https://www.toray.com/news', x: 'https://x.com/search?q=Toray+carbon+fiber+aerospace+2026' },
          { rank: 2,  name: 'Hexcel',            ticker: 'HXL',      mktcap: '~$60억',   detail: '탄소섬유·복합재 항공우주 전문 — 로켓 페어링·위성 패널·발사체 구조재, Boeing·Airbus 주공급사', ir: 'https://investors.hexcel.com', news: 'https://www.hexcel.com/News', x: 'https://x.com/search?q=Hexcel+composite+aerospace+rocket+2026' },
          { rank: 3,  name: 'Allegheny Technologies', ticker: 'ATI', mktcap: '~$50억',   detail: '티타늄·니켈합금·특수강 — 로켓 엔진·발사체 고온 구조재, 우주 발사 소재 전문 업체', ir: 'https://ir.atimetals.com', news: 'https://www.atimetals.com/news', x: 'https://x.com/search?q=Allegheny+Technologies+titanium+aerospace+2026' },
          { rank: 4,  name: 'Carpenter Technology', ticker: 'CRS',   mktcap: '~$30억',   detail: '항공우주 특수합금·분말 야금 — 로켓 엔진 터빈 블레이드 소재, SLM 3D프린팅 분말 공급', ir: 'https://ir.cartech.com', news: 'https://www.carpentertechnology.com/about/press-releases', x: 'https://x.com/search?q=Carpenter+Technology+aerospace+alloy+2026' },
          { rank: 5,  name: 'Materion',           ticker: 'MTRN',     mktcap: '~$20억',   detail: '베릴륨·첨단 합금 소재 — 위성 광학 미러·발사체 경량 구조재, 우주망원경 핵심 소재 공급', ir: 'https://investors.materion.com', news: 'https://www.materion.com/news', x: 'https://x.com/search?q=Materion+beryllium+aerospace+space+2026' },
          { rank: 6,  name: 'BASF SE',            ticker: 'BAS.DE',   mktcap: '~$400억',  detail: '우주급 코팅·단열재·폴리머 — 로켓 단열 폼, 위성 구조 접착제·광학 코팅 소재 공급', ir: 'https://www.basf.com/global/en/investors.html', news: 'https://www.basf.com/global/en/media/news-releases.html', x: 'https://x.com/search?q=BASF+aerospace+material+space' },
          { rank: 7,  name: 'SGL Carbon',         ticker: 'SGL.DE',   mktcap: '~$15억',   detail: '탄소·흑연 소재 — 로켓 노즐·내열 구조재, 위성 열제어 탄소복합재, 유럽 발사체 공급', ir: 'https://www.sglcarbon.com/en/investors', news: 'https://www.sglcarbon.com/en/news', x: 'https://x.com/search?q=SGL+Carbon+aerospace+space+material' },
          { rank: 8,  name: 'Arcam (GE Additive)', ticker: 'GE',     mktcap: '~$1500억', detail: '전자빔 용융(EBM) 금속 3D프린팅 — 로켓 엔진·위성 부품 티타늄 적층제조 선도 기술', ir: 'https://www.ge.com/investor-relations', news: 'https://www.ge.com/news', x: 'https://x.com/search?q=GE+Additive+rocket+3D+printing+2026' },
        ],
      },
      {
        id: 'precision_parts',
        icon: '⚙️',
        name: '정밀 부품 / 전장 시스템',
        desc: '위성·발사체 전자 부품·시스템',
        candidates: [
          { rank: 1,  name: 'Moog Inc.',          ticker: 'MOG.A',    mktcap: '~$30억',   detail: '우주 추력기·자세제어 구동기 — 위성 자세제어·발사체 엔진 제어 정밀 유공압 시스템 1위', ir: 'https://ir.mooginc.com', news: 'https://www.moog.com/news', x: 'https://x.com/search?q=Moog+spacecraft+propulsion+actuator+2026' },
          { rank: 2,  name: 'Curtiss-Wright',     ticker: 'CW',       mktcap: '~$90억',   detail: '우주 전자·유공압 시스템 — 발사체 제어 밸브·위성 전원 공급 시스템, 국방·우주 부품 전문', ir: 'https://investor.curtisswright.com', news: 'https://www.curtisswright.com/news-and-events', x: 'https://x.com/search?q=Curtiss+Wright+aerospace+space+2026' },
          { rank: 3,  name: 'TransDigm Group',    ticker: 'TDG',      mktcap: '~$700억',  detail: '항공우주 독점 정밀 부품 — 위성·발사체 패스너·액추에이터·센서, 틈새 독점 M&A 전략', ir: 'https://ir.transdigm.com', news: 'https://www.transdigm.com/news', x: 'https://x.com/search?q=TransDigm+aerospace+space+parts+2026' },
          { rank: 4,  name: 'Teledyne Technologies', ticker: 'TDY',   mktcap: '~$200억',  detail: '위성 이미지 센서·우주 전자 시스템 — CCD/CMOS 이미지 센서, NASA·군사위성 탑재 전자', ir: 'https://www.teledyne.com/en-us/investor-relations', news: 'https://www.teledyne.com/en-us/news', x: 'https://x.com/search?q=Teledyne+space+satellite+sensor+2026' },
          { rank: 5,  name: 'Kratos Defense',     ticker: 'KTOS',     mktcap: '~$40억',   detail: '위성 지상국 시스템·우주 사이버 보안 — 저비용 공격형 무인기·우주군 통신 시스템 공급', ir: 'https://ir.kratosdefense.com', news: 'https://www.kratosdefense.com/news', x: 'https://x.com/search?q=Kratos+Defense+space+satellite+2026' },
          { rank: 6,  name: 'Comtech Telecom',    ticker: 'CMTL',     mktcap: '~$3억',    detail: '위성 지상 단말·모뎀 — SATCOM 지상 장비 전문, 군사·상업 위성통신 단말 공급', ir: 'https://ir.comtech.com', news: 'https://www.comtech.com/news-events', x: 'https://x.com/search?q=Comtech+satellite+terminal+2026' },
          { rank: 7,  name: 'TE Connectivity',    ticker: 'TEL',      mktcap: '~$400억',  detail: '우주급 커넥터·케이블 어셈블리 — 위성·발사체 내우주환경 전기 연결부품 세계 1위 공급', ir: 'https://investors.te.com', news: 'https://www.te.com/usa-en/about-te/news-center.html', x: 'https://x.com/search?q=TE+Connectivity+aerospace+space+connector+2026' },
          { rank: 8,  name: 'Ametek Inc.',        ticker: 'AME',      mktcap: '~$400억',  detail: '우주·항공 계측·전원장치 — 위성 전원공급(EPS)·정밀 계측 시스템, 발사체 비행계기 공급', ir: 'https://investors.ametek.com', news: 'https://www.ametek.com/news', x: 'https://x.com/search?q=Ametek+aerospace+space+2026' },
        ],
      },
    ],
  },
];

// 우주 섹터 국적 플래그
export const SPACE_FLAG_BY_NAME = {
  // 🇺🇸 미국
  'SpaceX': '🇺🇸', 'Rocket Lab': '🇺🇸', 'United Launch Alliance': '🇺🇸',
  'Blue Origin': '🇺🇸', 'Relativity Space': '🇺🇸', 'Astra Space': '🇺🇸',
  'ABL Space Systems': '🇺🇸', 'Firefly Aerospace': '🇺🇸', 'Virgin Galactic': '🇺🇸',
  'Exos Aerospace': '🇺🇸',
  'Lockheed Martin': '🇺🇸', 'Boeing': '🇺🇸', 'Northrop Grumman': '🇺🇸',
  'Maxar Technologies': '🇺🇸', 'Planet Labs': '🇺🇸', 'BlackSky': '🇺🇸',
  'Spire Global': '🇺🇸', 'HawkEye 360': '🇺🇸', 'Capella Space': '🇺🇸',
  'Umbra': '🇺🇸', 'Orbital Insight': '🇺🇸', 'Descartes Labs': '🇺🇸',
  'Terran Orbital': '🇺🇸', 'Swarm Technologies': '🇺🇸',
  'Viasat': '🇺🇸', 'Intelsat': '🇺🇸', 'EchoStar': '🇺🇸', 'Amazon (Kuiper)': '🇺🇸',
  'AST SpaceMobile': '🇺🇸', 'Iridium': '🇺🇸', 'Globalstar': '🇺🇸',
  'Ligado Networks': '🇺🇸',
  'Garmin': '🇺🇸', 'Trimble': '🇺🇸', 'LeoLabs': '🇺🇸',
  'ExoAnalytic Solutions': '🇺🇸', 'Slingshot Aerospace': '🇺🇸',
  'Aalyria Technologies': '🇺🇸', 'Kayhan Space': '🇺🇸', 'Aurora Insight': '🇺🇸',
  'Raytheon Technologies': '🇺🇸', 'L3Harris Technologies': '🇺🇸',
  'General Dynamics': '🇺🇸', 'Leidos': '🇺🇸', 'Booz Allen Hamilton': '🇺🇸',
  'Palantir': '🇺🇸', 'Sierra Space': '🇺🇸',
  'Aerojet Rocketdyne': '🇺🇸', 'Ursa Major': '🇺🇸', 'Dawn Aerospace': '🇳🇿',
  'Bradford ECAPS': '🇸🇪',
  'Hexcel': '🇺🇸', 'Allegheny Technologies': '🇺🇸', 'Carpenter Technology': '🇺🇸',
  'Materion': '🇺🇸',
  'Moog Inc.': '🇺🇸', 'Curtiss-Wright': '🇺🇸', 'TransDigm Group': '🇺🇸',
  'Teledyne Technologies': '🇺🇸', 'Kratos Defense': '🇺🇸', 'Comtech Telecom': '🇺🇸',
  'TE Connectivity': '🇺🇸', 'Ametek Inc.': '🇺🇸',
  // 🇬🇧 영국
  'Surrey Satellite Technology': '🇬🇧',
  // 🇫🇷 프랑스
  'Arianespace': '🇫🇷', 'Safran': '🇫🇷', 'Thales Alenia Space': '🇫🇷',
  // 🇩🇪 독일
  'SGL Carbon': '🇩🇪', 'BASF SE': '🇩🇪',
  // 🇯🇵 일본
  'Mitsubishi Heavy Industries': '🇯🇵', 'Mitsubishi Electric': '🇯🇵', 'IHI Corporation': '🇯🇵',
  'Toray Industries': '🇯🇵',
  // 🇨🇦 캐나다
  'Telesat': '🇨🇦', 'NovAtel (Hexagon)': '🇸🇪',
  // 🇪🇺 유럽 다국적
  'Airbus Defence & Space': '🇪🇺', 'SES': '🇱🇺', 'OneWeb (Eutelsat)': '🇪🇺',
  // 🇮🇱 이스라엘
  'Elbit Systems': '🇮🇱',
  // 🇺🇸 미국(GE 포함)
  'Arcam (GE Additive)': '🇺🇸',
  // 🇦🇷 아르헨티나
  'Satellogic': '🇦🇷',
  // 🇺🇸 (Hexagon 스웨덴계)
  'NovAtel (Hexagon)': '🇸🇪',
  // Tomorrow.io
  'Tomorrow.io': '🇺🇸',
};
