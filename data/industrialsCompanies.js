// 산업재(Industrials) 섹터 밸류체인 데이터 (2026년 기준)
// 밸류체인: 항공우주·방산 → 중장비·기계 → 인프라·HVAC → 운송·물류 → 자동화·산업기술

export const INDUSTRIALS_LAYERS = [
  // ─── 레이어 1: 항공우주 / 방산 ─────────────────────
  {
    id: 'aerospace_defense',
    layer: '✈️ 항공우주 / 방산',
    components: [
      {
        id: 'aerospace_defense',
        icon: '✈️',
        name: '항공우주 / 방산',
        desc: '항공기·국방·미사일·우주·사이버안보',
        detail: [
          '미국 방산 산업은 LMT·RTX·NOC·GD·BA 5강이 펜타곤 예산의 60% 이상을 수주한다. 우크라이나 전쟁·중국 견제·중동 분쟁이 동시에 진행되면서 글로벌 방산 예산이 2020년 대비 30%+ 확대됐고, 미국 방산주는 5년 누적 +60%대 강세. F-35·THAAD·이지스·HIMARS·재블린 같은 무기는 다년간 백오더 지속.',
          '항공기 시장은 보잉(BA)이 737 MAX 안전 이슈로 고전하는 사이 에어버스가 시장 점유율 우위. 한편 우주 섹터의 ULA·SpaceX·Blue Origin과 맞물려 발사체 산업도 확장. RTX의 사이버보안 자회사·NOC의 위성·LMT의 극초음속 미사일 등 차세대 무기 R&D가 다음 격전지.',
          '본 섹터는 우주 섹터와 일부 회사가 겹치지만 (LMT·BA·RTX 등), 군사·항공기 중심으로 분류.',
        ],
        candidates: [
          { rank: 1,  name: 'RTX (Raytheon)',           ticker: 'RTX',  mktcap: '~$1,800억', detail: '미국 방산 1위. 패트리어트·THAAD·재블린·NASAMS. Pratt & Whitney 항공기 엔진. Collins Aerospace 자회사', ir: 'https://www.rtx.com/investors', news: 'https://www.rtx.com/news', x: 'https://x.com/search?q=RTX+Raytheon+2026' },
          { rank: 2,  name: 'Lockheed Martin',          ticker: 'LMT',  mktcap: '~$1,200억', detail: 'F-35 전투기·이지스·THAAD. Skunk Works 극초음속 미사일·차세대 무기 R&D 1위', ir: 'https://www.lockheedmartin.com/en-us/news/investor.html', news: 'https://news.lockheedmartin.com', x: 'https://x.com/search?q=LockheedMartin+LMT+2026' },
          { rank: 3,  name: 'Boeing',                   ticker: 'BA',   mktcap: '~$1,200억', detail: '글로벌 항공기 1위(Airbus와 양강). 737 MAX 회복·국방 비중 확대. 우주(SLS·Starliner) 부진', ir: 'https://www.boeing.com/investors', news: 'https://boeing.mediaroom.com', x: 'https://x.com/search?q=Boeing+BA+2026' },
          { rank: 4,  name: 'GE Aerospace',             ticker: 'GE',   mktcap: '~$2,000억', detail: 'GE 분사 후 항공엔진 집중. CFM(Safran 합작) LEAP 엔진이 상업기 시장 점유 1위', ir: 'https://www.geaerospace.com/investor-relations', news: 'https://www.geaerospace.com/press-releases', x: 'https://x.com/search?q=GE+Aerospace+2026' },
          { rank: 5,  name: 'Northrop Grumman',         ticker: 'NOC',  mktcap: '~$760억', detail: 'B-21 Raider 전략폭격기·글로벌호크 무인기·위성. ICBM(Sentinel) 등 차세대 무기 핵심 공급', ir: 'https://investor.northropgrumman.com', news: 'https://news.northropgrumman.com', x: 'https://x.com/search?q=NorthropGrumman+NOC+2026' },
          { rank: 6,  name: 'General Dynamics',         ticker: 'GD',   mktcap: '~$800억', detail: '잠수함(VA-class)·전차(M1 Abrams)·Gulfstream 비즈니스 제트기. IT 서비스 자회사', ir: 'https://www.gd.com/investor-relations', news: 'https://www.gd.com/news-events', x: 'https://x.com/search?q=GeneralDynamics+GD+2026' },
          { rank: 7,  name: 'L3Harris Technologies',    ticker: 'LHX',  mktcap: '~$420억', detail: '통신·전자전·정보보안. Aerojet Rocketdyne 인수로 추진체 사업 진입. 사이버 보안 강자', ir: 'https://investors.l3harris.com', news: 'https://www.l3harris.com/newsroom', x: 'https://x.com/search?q=L3Harris+LHX+2026' },
          { rank: 8,  name: 'TransDigm Group',          ticker: 'TDG',  mktcap: '~$700억', detail: '항공기 부품 메이저. 독점적 부품 라인업 + 가격 결정력. 영업이익률 50%+', ir: 'https://www.transdigm.com/investor-relations', news: 'https://www.transdigm.com/news', x: 'https://x.com/search?q=TransDigm+TDG+2026' },
          { rank: 9,  name: 'Howmet Aerospace',         ticker: 'HWM',  mktcap: '~$420억', detail: '항공기 엔진 부품·구조재 — 보잉·에어버스·GE Aerospace 1차 공급사. 항공기 회복 수혜', ir: 'https://www.howmet.com/investors/', news: 'https://www.howmet.com/news/', x: 'https://x.com/search?q=Howmet+HWM+2026' },
          { rank: 10, name: 'HEICO',                    ticker: 'HEI',  mktcap: '~$320억', detail: '항공기 부품 — 모방품(PMA) 1위. 가족경영 + 분권화 인수합병으로 장기 성장', ir: 'https://www.heico.com/investors', news: 'https://www.heico.com/news', x: 'https://x.com/search?q=HEICO+2026' },
          { rank: 11, name: 'Textron',                  ticker: 'TXT',  mktcap: '~$160억', detail: 'Bell 헬리콥터·Cessna·Beechcraft 비즈니스 제트기·차세대 헬리콥터 V-280', ir: 'https://investor.textron.com', news: 'https://investor.textron.com/news/news-releases.html', x: 'https://x.com/search?q=Textron+TXT+2026' },
          { rank: 12, name: 'Airbus',                   ticker: 'EADSY', mktcap: '~$1,400억', detail: '유럽 항공기 1위. A320neo·A350. 보잉 위기로 시장 점유율 우위. 방산·헬리콥터·우주 통합', ir: 'https://www.airbus.com/en/investors', news: 'https://www.airbus.com/en/newsroom', x: 'https://x.com/search?q=Airbus+2026' },
        ],
      },
    ],
  },

  // ─── 레이어 2: 중장비 / 기계 ───────────────────────
  {
    id: 'machinery',
    layer: '🚜 중장비 / 산업기계',
    components: [
      {
        id: 'machinery',
        icon: '🚜',
        name: '중장비 / 산업기계',
        desc: '건설장비·농기계·산업기계',
        detail: [
          '중장비 산업은 Caterpillar(CAT)·Deere(DE)·Komatsu의 글로벌 3강이 건설·광업·농업 장비 시장을 양분한다. CAT은 광업·건설 + 발전기·디젤엔진. DE는 농기계 글로벌 1위 + 정밀농업·자율주행 트랙터로 차세대 성장 동력. 미국 IIJA 인프라법 + 데이터센터 건설 + 친환경 인프라가 다년간 수요 견인.',
          '산업기계 메이저(EMR·ETN·ITW·DOV·PH)는 자동화·전력관리·유체이송·계측 등 다양한 분야에서 영업이익률 20%+의 안정적 비즈니스. 특히 ETN은 데이터센터 전력관리·EV 충전 인프라로 AI 인프라 수혜 직접 노출.',
        ],
        candidates: [
          { rank: 1,  name: 'Caterpillar',              ticker: 'CAT',  mktcap: '~$1,900억', detail: '글로벌 건설·광업 장비 1위. 디젤엔진·발전기·솔라터빈. 데이터센터 백업전력 수요 수혜', ir: 'https://www.caterpillar.com/en/investors.html', news: 'https://www.caterpillar.com/en/news.html', x: 'https://x.com/search?q=Caterpillar+CAT+2026' },
          { rank: 2,  name: 'Deere & Company',          ticker: 'DE',   mktcap: '~$1,100억', detail: '농기계 글로벌 1위. Smart Industrial 자율주행 트랙터·정밀농업. 산업재+staples 농업 겹침', ir: 'https://www.deere.com/en/our-company/investor-relations/', news: 'https://www.deere.com/en/news', x: 'https://x.com/search?q=Deere+John+2026' },
          { rank: 3,  name: 'Eaton Corporation',        ticker: 'ETN',  mktcap: '~$1,200억', detail: '전력관리 글로벌 1위. 데이터센터 UPS·전력분배·EV 충전. AI 인프라 직접 수혜주', ir: 'https://www.eaton.com/us/en-us/company/investor-relations.html', news: 'https://www.eaton.com/us/en-us/company/news-insights.html', x: 'https://x.com/search?q=Eaton+ETN+2026' },
          { rank: 4,  name: 'Emerson Electric',         ticker: 'EMR',  mktcap: '~$700억', detail: '산업자동화·계측·소프트웨어. AspenTech 인수. 공정제어·테스트&측정 글로벌 메이저', ir: 'https://www.emerson.com/en-us/investors', news: 'https://www.emerson.com/en-us/news', x: 'https://x.com/search?q=EmersonElectric+EMR+2026' },
          { rank: 5,  name: 'Illinois Tool Works',      ticker: 'ITW',  mktcap: '~$830억', detail: '다각화 산업기계 — 자동차·식품·건설·시험장비. 80/20 운영원칙으로 영업이익률 25%+', ir: 'https://investor.itw.com', news: 'https://www.itw.com/news/', x: 'https://x.com/search?q=ITW+2026' },
          { rank: 6,  name: 'Parker Hannifin',          ticker: 'PH',   mktcap: '~$800억', detail: '유체동력(공압·유압) 글로벌 1위. 항공우주·산업·자동차. Meggitt 인수로 항공우주 강화', ir: 'https://phx.corporate-ir.net/phoenix.zhtml?c=83205&p=irol-irhome', news: 'https://www.parker.com/parkerimages/Parker.com/news', x: 'https://x.com/search?q=ParkerHannifin+PH+2026' },
          { rank: 7,  name: 'Cummins',                  ticker: 'CMI',  mktcap: '~$520억', detail: '디젤·천연가스 엔진 글로벌 메이저. 트럭·발전기·해양. 수소·연료전지(Accelera) 진입', ir: 'https://investor.cummins.com', news: 'https://www.cummins.com/news', x: 'https://x.com/search?q=Cummins+CMI+2026' },
          { rank: 8,  name: 'AGCO',                     ticker: 'AGCO', mktcap: '~$60억', detail: 'Massey Ferguson·Fendt·Valtra 농기계 브랜드. Deere의 추격자. 정밀농업 Fuse', ir: 'https://investors.agcocorp.com', news: 'https://www.agcocorp.com/news', x: 'https://x.com/search?q=AGCO+2026' },
          { rank: 9,  name: 'Otis Worldwide',           ticker: 'OTIS', mktcap: '~$420억', detail: '엘리베이터·에스컬레이터 글로벌 1위. 신축·서비스 매출 균형. UTC에서 분사', ir: 'https://www.otisinvestors.com', news: 'https://www.otis.com/en/us/news', x: 'https://x.com/search?q=Otis+OTIS+2026' },
          { rank: 10, name: 'Dover Corporation',        ticker: 'DOV',  mktcap: '~$280억', detail: '다각화 산업기계 — 펌프·압축기·식품기계·연료시스템·인쇄기. 안정적 배당', ir: 'https://investors.dovercorporation.com', news: 'https://www.dovercorporation.com/news', x: 'https://x.com/search?q=Dover+DOV+2026' },
          { rank: 11, name: 'PACCAR',                   ticker: 'PCAR', mktcap: '~$580억', detail: '대형 트럭(Kenworth·Peterbilt·DAF) 글로벌 메이저. 미국·유럽 헤비트럭 시장 강자', ir: 'https://www.paccar.com/about-us/investor-relations/', news: 'https://www.paccar.com/news', x: 'https://x.com/search?q=PACCAR+PCAR+2026' },
          { rank: 12, name: 'Komatsu',                  ticker: 'KMTUY', mktcap: '~$420억', detail: '일본 — 글로벌 건설장비 2위(CAT 추격). 광산·자율주행 덤프트럭 선도', ir: 'https://www.komatsu.jp/en/ir', news: 'https://www.komatsu.jp/en/newsroom', x: 'https://x.com/search?q=Komatsu+2026' },
        ],
      },
    ],
  },

  // ─── 레이어 3: 인프라 / HVAC / 건설 ───────────────
  {
    id: 'infrastructure',
    layer: '🏗️ 인프라 / HVAC / 건설',
    components: [
      {
        id: 'hvac_construction',
        icon: '🏗️',
        name: 'HVAC / 건설자재 / 인프라',
        desc: '냉난방·공조·건설자재·인프라 EPC',
        detail: [
          'HVAC(Heating, Ventilation, Air Conditioning) 산업은 데이터센터 폭증의 직접 수혜를 받는다. AI 데이터센터 한 캠퍼스의 냉각 비용이 수억 달러 단위라 Carrier(CARR)·Trane(TT)·Lennox·Johnson Controls 같은 메이저는 다년 백오더 보유. 전력 효율·액침냉각·증발냉각 같은 차세대 기술이 매출 성장의 핵심.',
          '건설자재(Vulcan·Martin Marietta·Eagle Materials) 섹터는 IIJA 인프라법(미국 도로·교량·철도 $1조+)의 직접 수혜. 시멘트·골재·아스팔트 수요가 2026~2030 다년간 견고. EPC(Engineering·Procurement·Construction) 메이저는 글로벌 인프라 + 신재생 + 데이터센터 건설로 매출 다변화.',
        ],
        candidates: [
          { rank: 1,  name: 'Carrier Global',           ticker: 'CARR', mktcap: '~$580억', detail: 'HVAC 글로벌 1위. 데이터센터 냉각 수요 폭증. AI 인프라 간접 수혜주로 재평가. 분사 후 회복', ir: 'https://ir.carrier.com', news: 'https://www.corporate.carrier.com/news/', x: 'https://x.com/search?q=Carrier+CARR+2026' },
          { rank: 2,  name: 'Trane Technologies',       ticker: 'TT',   mktcap: '~$900억', detail: 'HVAC 메이저 — 상업·산업용 강자. 데이터센터 냉각·친환경 냉매(R-454B) 선도. ESG 평가 1위', ir: 'https://www.tranetechnologies.com/en/index/investors.html', news: 'https://www.tranetechnologies.com/en/index/news.html', x: 'https://x.com/search?q=Trane+TT+2026' },
          { rank: 3,  name: 'Johnson Controls',         ticker: 'JCI',  mktcap: '~$640억', detail: 'HVAC + 빌딩자동화·보안. 통합 빌딩 솔루션. AI 인프라 + 친환경 빌딩 수요', ir: 'https://www.johnsoncontrols.com/investors', news: 'https://www.johnsoncontrols.com/media-center', x: 'https://x.com/search?q=JohnsonControls+JCI+2026' },
          { rank: 4,  name: 'Honeywell International', ticker: 'HON',  mktcap: '~$1,500억', detail: '항공우주 + 빌딩자동화 + 산업자동화 + 첨단소재 콘글로머리트. SPGI·Buffett 보유주', ir: 'https://www.honeywell.com/us/en/investor-relations', news: 'https://www.honeywell.com/us/en/news', x: 'https://x.com/search?q=Honeywell+HON+2026' },
          { rank: 5,  name: 'Vulcan Materials',         ticker: 'VMC',  mktcap: '~$340억', detail: '미국 건설자재(골재·시멘트·아스팔트) 1위. IIJA 수혜 + 주택 건설 회복 직접 노출', ir: 'https://ir.vulcanmaterials.com', news: 'https://ir.vulcanmaterials.com/news-events/news-releases', x: 'https://x.com/search?q=VulcanMaterials+VMC+2026' },
          { rank: 6,  name: 'Martin Marietta',          ticker: 'MLM',  mktcap: '~$320억', detail: '미국 건설자재 2위. 골재·시멘트·콘크리트. M&A로 지역 시장 점유 확대 적극', ir: 'https://ir.martinmarietta.com', news: 'https://www.martinmarietta.com/about-us/news/', x: 'https://x.com/search?q=MartinMarietta+MLM+2026' },
          { rank: 7,  name: 'Eaton Corporation',        ticker: 'ETN',  mktcap: '~$1,200억', detail: '전력관리 — 데이터센터·EV 충전. machinery 레이어와 겹치지만 인프라 수혜 핵심', ir: 'https://www.eaton.com/us/en-us/company/investor-relations.html', news: 'https://www.eaton.com/us/en-us/company/news-insights.html', x: 'https://x.com/search?q=Eaton+ETN+2026' },
          { rank: 8,  name: 'Quanta Services',          ticker: 'PWR',  mktcap: '~$420억', detail: '전력 인프라·통신 EPC 메이저. 송배전·재생에너지·통신선 설치. 데이터센터 전력 인프라 수혜', ir: 'https://investors.quantaservices.com', news: 'https://www.quantaservices.com/news', x: 'https://x.com/search?q=Quanta+PWR+2026' },
          { rank: 9,  name: 'Fluor Corporation',        ticker: 'FLR',  mktcap: '~$80억', detail: '글로벌 EPC 메이저. 에너지·인프라·정부·재생에너지·SMR. NuScale 지분 보유', ir: 'https://investor.fluor.com', news: 'https://newsroom.fluor.com', x: 'https://x.com/search?q=Fluor+FLR+2026' },
          { rank: 10, name: 'Jacobs Solutions',         ticker: 'J',    mktcap: '~$170억', detail: '글로벌 EPC·컨설팅. 정부·인프라·환경·국방. CMS Energy 분사 후 EPC 집중', ir: 'https://invest.jacobs.com', news: 'https://www.jacobs.com/newsroom', x: 'https://x.com/search?q=Jacobs+Solutions+2026' },
          { rank: 11, name: 'Lennox International',     ticker: 'LII',  mktcap: '~$220억', detail: '미국 주택용 HVAC 메이저. 친환경 냉매 전환·고효율 시스템 선도', ir: 'https://investors.lennox.com', news: 'https://www.lennoxinternational.com/newsroom', x: 'https://x.com/search?q=Lennox+LII+2026' },
          { rank: 12, name: 'AECOM',                    ticker: 'ACM',  mktcap: '~$160억', detail: '글로벌 인프라 컨설팅·EPC. 도시계획·교통·환경·국방 시설. 정부 계약 비중 큼', ir: 'https://investors.aecom.com', news: 'https://aecom.com/press-releases/', x: 'https://x.com/search?q=AECOM+ACM+2026' },
        ],
      },
    ],
  },

  // ─── 레이어 4: 운송 / 물류 ────────────────────────
  {
    id: 'transport_logistics',
    layer: '🚚 운송 / 물류',
    components: [
      {
        id: 'transport',
        icon: '🚚',
        name: '운송 / 물류',
        desc: '철도·항공·트럭·해운·택배',
        detail: [
          '운송 산업은 미국 GDP의 약 8%를 차지하는 거대 시장이다. 철도(UNP·CSX·NSC)는 미국 동·서·중부를 양분 — 안정적 듀오폴리. 화물항공·택배는 UPS·FDX 양강. 해운(ZIM·MAERSK)은 글로벌 무역 사이클에 직접 노출되며 변동성 큼. 트럭(TFI·ODFL·KNX)은 미국 화물 시장을 양분.',
          'AI·자율주행·전동화가 운송 산업 전반을 재편 중. 철도는 이미 자동화 진행, 트럭은 자율주행 테스트 단계. EV 트럭(Tesla Semi·Daimler Truck)은 도시 배달부터 침투. 한편 미국·중국 디커플링과 nearshoring(멕시코 이전)은 멕시코 국경 무역 + 미국 내 운송 수요 증가 동력.',
        ],
        candidates: [
          { rank: 1,  name: 'Union Pacific',            ticker: 'UNP',  mktcap: '~$1,400억', detail: '미국 서부 철도 1위. 6개주 32,000km. 동부의 CSX·NSC와 미국 화물 철도 양분', ir: 'https://www.up.com/investor/index.htm', news: 'https://www.up.com/media/index.htm', x: 'https://x.com/search?q=UnionPacific+UNP+2026' },
          { rank: 2,  name: 'Canadian Pacific Kansas',  ticker: 'CP',   mktcap: '~$700억', detail: '북미 종단 철도(캐나다·미국·멕시코). KCS 합병으로 nearshoring 직접 수혜', ir: 'https://investor.cpr.ca', news: 'https://www.cpr.ca/en/media', x: 'https://x.com/search?q=CanadianPacific+CP+2026' },
          { rank: 3,  name: 'CSX Corporation',          ticker: 'CSX',  mktcap: '~$700억', detail: '미국 동부 철도 1위. 23개주 32,000km. 항만 운송·자동차 운송 강자', ir: 'https://investors.csx.com', news: 'https://www.csx.com/index.cfm/about-us/media/', x: 'https://x.com/search?q=CSX+2026' },
          { rank: 4,  name: 'Norfolk Southern',         ticker: 'NSC',  mktcap: '~$520억', detail: '미국 동부 철도 2위(CSX와 양분). 22개주 32,000km. Mark Zuckerberg 가족재단 투자', ir: 'https://www.norfolksouthern.com/en/investor-relations', news: 'https://www.norfolksouthern.com/en/news', x: 'https://x.com/search?q=NorfolkSouthern+NSC+2026' },
          { rank: 5,  name: 'United Parcel Service',    ticker: 'UPS',  mktcap: '~$1,200억', detail: '글로벌 택배 1위. UPS Supply Chain Solutions·UPS Capital. e커머스·헬스케어 물류 확장', ir: 'https://investors.ups.com', news: 'https://about.ups.com/us/en/newsroom.html', x: 'https://x.com/search?q=UPS+2026' },
          { rank: 6,  name: 'FedEx',                    ticker: 'FDX',  mktcap: '~$700억', detail: '글로벌 택배 2위. Express(항공)·Ground(육상)·Freight(LTL) 통합. 디지털·데이터 강화', ir: 'https://investors.fedex.com', news: 'https://newsroom.fedex.com', x: 'https://x.com/search?q=FedEx+FDX+2026' },
          { rank: 7,  name: 'Delta Air Lines',          ticker: 'DAL',  mktcap: '~$420억', detail: '미국 1위 항공사 — 프리미엄 좌석·SkyMiles 로열티 강력. 임의소비재 여행과 일부 겹침', ir: 'https://ir.delta.com', news: 'https://news.delta.com', x: 'https://x.com/search?q=Delta+DAL+2026' },
          { rank: 8,  name: 'United Airlines',          ticker: 'UAL',  mktcap: '~$310억', detail: '미국 글로벌 항공사. 비즈니스 클래스·국제선 회복 강세', ir: 'https://ir.united.com', news: 'https://hub.united.com/category/news', x: 'https://x.com/search?q=UnitedAirlines+UAL+2026' },
          { rank: 9,  name: 'Old Dominion Freight',     ticker: 'ODFL', mktcap: '~$420억', detail: '미국 LTL(소량 화물) 트럭 운송 1위. 영업이익률 25%+ — 운송 산업 최고 수익성', ir: 'https://ir.odfl.com', news: 'https://www.odfl.com/us/en/about/news', x: 'https://x.com/search?q=OldDominion+ODFL+2026' },
          { rank: 10, name: 'XPO',                      ticker: 'XPO',  mktcap: '~$160억', detail: 'LTL 트럭 운송 — Yellow 자산 인수로 시장 점유 확대. 미국 동부·중부 강세', ir: 'https://investors.xpo.com', news: 'https://news.xpo.com', x: 'https://x.com/search?q=XPO+2026' },
          { rank: 11, name: 'J.B. Hunt Transport',      ticker: 'JBHT', mktcap: '~$160억', detail: '미국 인터모달(철도+트럭) 1위. UNP와 파트너십. 미국 운송 인프라 효율화 선도', ir: 'https://investor.jbhunt.com', news: 'https://www.jbhunt.com/our-company/news', x: 'https://x.com/search?q=JBHunt+JBHT+2026' },
          { rank: 12, name: 'Expeditors International', ticker: 'EXPD', mktcap: '~$170억', detail: '글로벌 화물주선·로지스틱스. 항공·해운 + 통관·창고. 자산경량 모델 영업이익률 30%+', ir: 'https://investor.expeditors.com', news: 'https://newsroom.expeditors.com', x: 'https://x.com/search?q=Expeditors+EXPD+2026' },
        ],
      },
    ],
  },

  // ─── 레이어 5: 자동화 / 산업기술 ──────────────────
  {
    id: 'automation_tech',
    layer: '🤖 자동화 / 산업기술',
    components: [
      {
        id: 'automation',
        icon: '🤖',
        name: '자동화 / 로봇 / 산업IoT',
        desc: '공장 자동화·산업로봇·산업SW·계측',
        detail: [
          '자동화 산업은 ABB·Rockwell·Siemens·Mitsubishi Electric·Fanuc 5강이 글로벌 공장 자동화 시장을 양분한다. 미국 nearshoring + 중국 임금 상승 + AI 통합으로 자동화 수요가 다년간 견고. 산업 로봇은 Fanuc(일본)·KUKA(중국 Midea 소유)·ABB(스위스)가 글로벌 3강, Tesla Optimus 등 휴머노이드 로봇 진입이 차세대 변수.',
          '계측·테스트·검사 산업(Keysight·Teradyne·Trimble)은 반도체·항공우주·통신·EV에 핵심 인프라 공급. 산업SW(PTC·Aspen Technology·Autodesk)는 디지털 트윈·시뮬레이션으로 산업 데이터화의 핵심.',
        ],
        candidates: [
          { rank: 1,  name: 'ABB',                      ticker: 'ABBNY', mktcap: '~$1,200억', detail: '스위스/스웨덴 — 글로벌 산업자동화·로봇·전력자동화 메이저. 데이터센터 전력 인프라 강자', ir: 'https://global.abb/group/en/investors', news: 'https://global.abb/group/en/media/news', x: 'https://x.com/search?q=ABB+industrial+2026' },
          { rank: 2,  name: 'Siemens',                  ticker: 'SIEGY', mktcap: '~$1,500억', detail: '독일 — 글로벌 산업기업. 디지털 인더스트리·스마트빌딩·헬스케어·모빌리티. 산업SW·디지털 트윈', ir: 'https://www.siemens.com/global/en/company/investor-relations.html', news: 'https://www.siemens.com/global/en/company/press.html', x: 'https://x.com/search?q=Siemens+2026' },
          { rank: 3,  name: 'Schneider Electric',       ticker: 'SBGSY', mktcap: '~$1,400억', detail: '프랑스 — 에너지관리·자동화 글로벌 메이저. 데이터센터 인프라(EcoStruxure·UPS) 강자', ir: 'https://www.se.com/ww/en/about-us/investor-relations/', news: 'https://www.se.com/ww/en/about-us/newsroom/', x: 'https://x.com/search?q=Schneider+Electric+2026' },
          { rank: 4,  name: 'Rockwell Automation',      ticker: 'ROK',  mktcap: '~$340억', detail: '미국 공장 자동화 1위. PLC·MES·디지털 트윈. 미국 nearshoring 직접 수혜주', ir: 'https://ir.rockwellautomation.com', news: 'https://www.rockwellautomation.com/en-us/company/news.html', x: 'https://x.com/search?q=Rockwell+ROK+2026' },
          { rank: 5,  name: 'Fortive',                  ticker: 'FTV',  mktcap: '~$280억', detail: '계측·산업기술 콘글로머리트. Fluke·Tektronix·Industrial Scientific. Vontier 분사', ir: 'https://investors.fortive.com', news: 'https://www.fortive.com/news', x: 'https://x.com/search?q=Fortive+FTV+2026' },
          { rank: 6,  name: 'Roper Technologies',       ticker: 'ROP',  mktcap: '~$580억', detail: '산업SW·계측 다각화. 부동산·헬스케어·교통·물류 SaaS. 영업이익률 35%+', ir: 'https://investors.ropertech.com', news: 'https://www.ropertech.com/about-roper/news', x: 'https://x.com/search?q=Roper+ROP+2026' },
          { rank: 7,  name: 'Keysight Technologies',    ticker: 'KEYS', mktcap: '~$280억', detail: '전자 계측·테스트 글로벌 1위. 5G·반도체·자동차·항공우주 테스트 시스템. R&D 투자 비중 큼', ir: 'https://investor.keysight.com', news: 'https://www.keysight.com/us/en/about/newsroom.html', x: 'https://x.com/search?q=Keysight+KEYS+2026' },
          { rank: 8,  name: 'Trimble',                  ticker: 'TRMB', mktcap: '~$170억', detail: 'GPS·정밀측위·산업SW. 건설·농업·운송·매핑. AECO 산업의 디지털 트윈 선도', ir: 'https://investor.trimble.com', news: 'https://www.trimble.com/en/news', x: 'https://x.com/search?q=Trimble+TRMB+2026' },
          { rank: 9,  name: 'Teradyne',                 ticker: 'TER',  mktcap: '~$220억', detail: '반도체 자동테스트장비(ATE) 글로벌 메이저. Universal Robots(협동로봇) 자회사', ir: 'https://investors.teradyne.com', news: 'https://www.teradyne.com/news/', x: 'https://x.com/search?q=Teradyne+TER+2026' },
          { rank: 10, name: 'Fanuc',                    ticker: 'FANUY', mktcap: '~$400억', detail: '일본 — 글로벌 산업로봇 1위. CNC 공작기계·로봇 통합. 자동차 제조업 핵심 공급사', ir: 'https://www.fanuc.co.jp/en/ir/index.html', news: 'https://www.fanuc.co.jp/en/news/index.html', x: 'https://x.com/search?q=Fanuc+2026' },
          { rank: 11, name: 'PTC',                      ticker: 'PTC',  mktcap: '~$220억', detail: '산업SW(CAD·PLM·IoT) 메이저. ThingWorx 산업IoT 플랫폼. 디지털 트윈 선도', ir: 'https://investor.ptc.com', news: 'https://www.ptc.com/en/news', x: 'https://x.com/search?q=PTC+software+2026' },
          { rank: 12, name: 'Generac Holdings',         ticker: 'GNRC', mktcap: '~$80억', detail: '미국 백업 발전기 1위. 가정·상업·산업 전반. 전력망 불안정 + 데이터센터 백업 수요', ir: 'https://investors.generac.com', news: 'https://www.generac.com/about-us/news-info', x: 'https://x.com/search?q=Generac+GNRC+2026' },
        ],
      },
    ],
  },
];

// 회사명 → 국기 이모지
export const INDUSTRIALS_FLAG_BY_NAME = {
  'RTX (Raytheon)': '🇺🇸', 'Lockheed Martin': '🇺🇸', 'Boeing': '🇺🇸',
  'GE Aerospace': '🇺🇸', 'Northrop Grumman': '🇺🇸', 'General Dynamics': '🇺🇸',
  'L3Harris Technologies': '🇺🇸', 'TransDigm Group': '🇺🇸',
  'Howmet Aerospace': '🇺🇸', 'HEICO': '🇺🇸', 'Textron': '🇺🇸', 'Airbus': '🇫🇷',
  'Caterpillar': '🇺🇸', 'Deere & Company': '🇺🇸', 'Eaton Corporation': '🇮🇪',
  'Emerson Electric': '🇺🇸', 'Illinois Tool Works': '🇺🇸',
  'Parker Hannifin': '🇺🇸', 'Cummins': '🇺🇸', 'AGCO': '🇺🇸',
  'Otis Worldwide': '🇺🇸', 'Dover Corporation': '🇺🇸', 'PACCAR': '🇺🇸',
  'Komatsu': '🇯🇵',
  'Carrier Global': '🇺🇸', 'Trane Technologies': '🇮🇪',
  'Johnson Controls': '🇮🇪', 'Honeywell International': '🇺🇸',
  'Vulcan Materials': '🇺🇸', 'Martin Marietta': '🇺🇸',
  'Quanta Services': '🇺🇸', 'Fluor Corporation': '🇺🇸',
  'Jacobs Solutions': '🇺🇸', 'Lennox International': '🇺🇸', 'AECOM': '🇺🇸',
  'Union Pacific': '🇺🇸', 'Canadian Pacific Kansas': '🇨🇦',
  'CSX Corporation': '🇺🇸', 'Norfolk Southern': '🇺🇸',
  'United Parcel Service': '🇺🇸', 'FedEx': '🇺🇸',
  'Delta Air Lines': '🇺🇸', 'United Airlines': '🇺🇸',
  'Old Dominion Freight': '🇺🇸', 'XPO': '🇺🇸',
  'J.B. Hunt Transport': '🇺🇸', 'Expeditors International': '🇺🇸',
  'ABB': '🇨🇭', 'Siemens': '🇩🇪', 'Schneider Electric': '🇫🇷',
  'Rockwell Automation': '🇺🇸', 'Fortive': '🇺🇸', 'Roper Technologies': '🇺🇸',
  'Keysight Technologies': '🇺🇸', 'Trimble': '🇺🇸', 'Teradyne': '🇺🇸',
  'Fanuc': '🇯🇵', 'PTC': '🇺🇸', 'Generac Holdings': '🇺🇸',
};
