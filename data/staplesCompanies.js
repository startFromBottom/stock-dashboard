// 필수소비재(Consumer Staples) 섹터 밸류체인 데이터 (2026년 기준)
// 밸류체인: 농업/원료 → 식품/음료 → 담배/주류 → 생필품/유통
// candidates[]: 각 카테고리별 후보풀 (10~12개)
// API로 시총 가져와 내림차순 정렬 → 상위 10개 동적 표시

export const STAPLES_LAYERS = [
  // ─── 레이어 1: 농업 / 원료 ─────────────────────────────────────
  {
    id: 'agriculture',
    layer: '🌾 농업 / 원료',
    components: [
      {
        id: 'agri_input',
        icon: '🌱',
        name: '비료·종자·작물보호',
        desc: '농업 생산성의 출발점 — 종자·비료·농약 메이저',
        detail: [
          '식량 가치사슬의 가장 위 — 종자(Corteva·Bayer Crop), 비료(Nutrien·Mosaic·CF Industries), 작물보호제(농약)가 농업 생산성을 결정한다. 비료는 천연가스 가격에 직접 연동되고, 종자/유전자 변형 작물(GMO)은 R&D 집약적이며 진입장벽이 높다.',
          '인구 증가·기후 변화·우크라이나 전쟁 같은 공급망 리스크로 식량 가격 변동성이 커지면서 농업 원료 기업들은 인플레이션 헷지 자산으로 주목받는다. 정밀농업(AI·드론·센서)과 결합한 디지털 농업으로 차세대 성장을 노린다.',
        ],
        candidates: [
          { rank: 1,  name: 'Nutrien',                ticker: 'NTR',     mktcap: '~$280억',  detail: '캐나다 — 세계 최대 비료 생산사. 칼륨·질소·인 비료 통합. 농업 소매(Agrium) 보유로 농가 직접 판매', ir: 'https://www.nutrien.com/investors', news: 'https://www.nutrien.com/news', x: 'https://x.com/search?q=Nutrien+fertilizer+2026' },
          { rank: 2,  name: 'Corteva',                ticker: 'CTVA',    mktcap: '~$430억',  detail: 'Pioneer 종자 + Crop Protection — 옥수수·콩 종자 글로벌 1위. DowDuPont 분사 후 농업 전문', ir: 'https://investors.corteva.com', news: 'https://www.corteva.com/news.html', x: 'https://x.com/search?q=Corteva+seeds+2026' },
          { rank: 3,  name: 'CF Industries',          ticker: 'CF',      mktcap: '~$160억',  detail: '북미 최대 질소 비료(요소·암모니아) 생산. 천연가스 저비용 활용. 청정 암모니아·수소 사업 진입', ir: 'https://www.cfindustries.com/investors', news: 'https://www.cfindustries.com/newsroom', x: 'https://x.com/search?q=CF+Industries+ammonia+2026' },
          { rank: 4,  name: 'Mosaic',                 ticker: 'MOS',     mktcap: '~$110억',  detail: '북미 최대 인산·칼륨 비료. 플로리다·서스캐처원 광산. 사료 첨가 인산 사업도 보유', ir: 'https://investors.mosaicco.com', news: 'https://www.mosaicco.com/news', x: 'https://x.com/search?q=Mosaic+fertilizer+2026' },
          { rank: 5,  name: 'Bayer (Crop Science)',   ticker: 'BAYRY',   mktcap: '~$300억',  detail: '독일 — Monsanto 인수 후 종자·작물보호 글로벌 1위. 글리포세이트 소송 부담 지속, 분사 검토 중', ir: 'https://www.bayer.com/en/investors', news: 'https://www.bayer.com/en/news', x: 'https://x.com/search?q=Bayer+Monsanto+crop+2026' },
          { rank: 6,  name: 'FMC Corporation',        ticker: 'FMC',     mktcap: '~$70억',   detail: '작물보호(농약) 전문 — 곤충/잡초/병해 관리 솔루션. 신규 모드 작용 농약 R&D 집중', ir: 'https://investors.fmc.com', news: 'https://www.fmc.com/en/news', x: 'https://x.com/search?q=FMC+crop+protection+2026' },
          { rank: 7,  name: 'Archer Daniels Midland', ticker: 'ADM',     mktcap: '~$320억',  detail: '곡물 트레이딩·가공 글로벌 1위. 옥수수·콩 가공·식물성 단백질·바이오연료. 가축 사료까지 수직통합', ir: 'https://www.adm.com/investors', news: 'https://www.adm.com/news', x: 'https://x.com/search?q=ADM+grain+2026' },
          { rank: 8,  name: 'Bunge',                  ticker: 'BG',      mktcap: '~$140억',  detail: '곡물·유지(植油) 가공 글로벌. Viterra 합병 후 시장 점유 확대. 식물성 단백질·바이오연료 진입', ir: 'https://investors.bunge.com', news: 'https://www.bunge.com/news', x: 'https://x.com/search?q=Bunge+Viterra+grain+2026' },
          { rank: 9,  name: 'Tyson Foods',            ticker: 'TSN',     mktcap: '~$210억',  detail: '미국 최대 단백질(닭·소·돼지) 가공. 가공식품·간편식·식물성 단백질도 확장. 사료비 변동에 민감', ir: 'https://ir.tyson.com', news: 'https://www.tysonfoods.com/news', x: 'https://x.com/search?q=Tyson+Foods+protein+2026' },
          { rank: 10, name: 'Deere & Company',        ticker: 'DE',      mktcap: '~$1,100억', detail: '농기계 글로벌 1위(트랙터·콤바인). 정밀농업·자율주행 트랙터(Smart Industrial). 농업+건설+산림', ir: 'https://www.deere.com/en/our-company/investor-relations/', news: 'https://www.deere.com/en/news', x: 'https://x.com/search?q=Deere+John+autonomous+2026' },
          { rank: 11, name: 'AGCO',                   ticker: 'AGCO',    mktcap: '~$60억',   detail: 'Massey Ferguson·Fendt·Valtra 농기계 브랜드. 정밀농업 Fuse 플랫폼. 유럽·신흥국 비중 큼', ir: 'https://investors.agcocorp.com', news: 'https://www.agcocorp.com/news', x: 'https://x.com/search?q=AGCO+precision+farming+2026' },
          { rank: 12, name: 'Yara International',     ticker: 'YARIY',   mktcap: '~$80억',   detail: '노르웨이 — 글로벌 질소 비료 1위. 디지털 농업(Atfarm)·청정 암모니아(녹색 수소) 투자 확대', ir: 'https://www.yara.com/investor-relations/', news: 'https://www.yara.com/news-and-media/', x: 'https://x.com/search?q=Yara+green+ammonia+2026' },
        ],
      },
    ],
  },

  // ─── 레이어 2: 식품 / 음료 ─────────────────────────────────────
  {
    id: 'food_beverage',
    layer: '🍫 식품 / 음료',
    components: [
      {
        id: 'beverage_brands',
        icon: '🥤',
        name: '음료 브랜드',
        desc: '글로벌 음료 — 탄산·커피·에너지·생수',
        detail: [
          '음료 산업은 KO·PEP의 양강이 100년 넘게 글로벌 시장을 양분해왔다. 두 회사 모두 "농축액 → 보틀러 → 유통"의 분산 모델로 자본 효율을 극대화한다. 최근에는 헬스 트렌드로 무설탕·기능성 음료(에너지·기능성 워터)가 빠르게 성장하고, 알코올 음료(맥주·증류주)까지 영역을 확장한다.',
          '커피는 SBUX가 지배하지만 패키지 커피(Keurig Dr Pepper, Nestlé Nespresso)와 글로벌 브랜드 경쟁이 격화. 에너지 드링크(Monster·Celsius·Red Bull)는 Z세대 중심으로 폭발적 성장. 기능성 음료·식물성 음료가 다음 격전지.',
        ],
        candidates: [
          { rank: 1,  name: 'Coca-Cola',              ticker: 'KO',      mktcap: '~$2,800억', detail: '세계 최대 음료 — 200개국 30억+ 일일 음용. 무설탕·생수·주스 다각화. Buffett 핵심 보유주', ir: 'https://investors.coca-colacompany.com', news: 'https://www.coca-colacompany.com/news', x: 'https://x.com/search?q=Coca-Cola+2026' },
          { rank: 2,  name: 'PepsiCo',                ticker: 'PEP',     mktcap: '~$2,200억', detail: '음료(Pepsi·Gatorade·Mountain Dew) + 스낵(Frito-Lay·Quaker) 결합. 음료+스낵 시너지로 KO 견제', ir: 'https://www.pepsico.com/investors', news: 'https://www.pepsico.com/news', x: 'https://x.com/search?q=PepsiCo+2026' },
          { rank: 3,  name: 'Monster Beverage',       ticker: 'MNST',    mktcap: '~$580억',  detail: '에너지 드링크 글로벌 2위. KO 지분 19%로 유통 시너지. Bang Energy 인수로 라인업 확장', ir: 'https://investors.monsterbevcorp.com', news: 'https://www.monsterbevcorp.com/news', x: 'https://x.com/search?q=Monster+Energy+2026' },
          { rank: 4,  name: 'Keurig Dr Pepper',       ticker: 'KDP',     mktcap: '~$450억',  detail: '커피 캡슐(K-Cup) + 탄산음료(Dr Pepper·7UP·Snapple). 북미 음료 3강 중 하나', ir: 'https://investors.keurigdrpepper.com', news: 'https://news.keurigdrpepper.com', x: 'https://x.com/search?q=Keurig+Dr+Pepper+2026' },
          { rank: 5,  name: 'Celsius Holdings',       ticker: 'CELH',    mktcap: '~$80억',   detail: '기능성 에너지 드링크 — 무설탕·천연 카페인. PEP 유통 파트너십으로 급성장. Z세대 핵심', ir: 'https://www.celsiusholdingsinc.com/investors/', news: 'https://www.celsiusholdingsinc.com/news/', x: 'https://x.com/search?q=Celsius+CELH+2026' },
          { rank: 6,  name: 'Starbucks',              ticker: 'SBUX',    mktcap: '~$1,000억', detail: '글로벌 커피 체인 1위. 38,000+ 매장. Reserve·Roastery 프리미엄 라인 확대. AI 주문·자동화 투자', ir: 'https://investor.starbucks.com', news: 'https://stories.starbucks.com', x: 'https://x.com/search?q=Starbucks+2026' },
          { rank: 7,  name: 'Constellation Brands',   ticker: 'STZ',     mktcap: '~$420억',  detail: '맥주(Modelo·Corona) 미국 1위. 와인·증류주 Mexican 카테고리 지배. 카나비스(Canopy) 투자', ir: 'https://www.cbrands.com/investors', news: 'https://news.cbrands.com', x: 'https://x.com/search?q=Constellation+Brands+Modelo+2026' },
          { rank: 8,  name: 'Nestlé',                 ticker: 'NSRGY',   mktcap: '~$2,500억', detail: '스위스 — 세계 최대 식품·음료 회사. Nespresso·Nescafé·생수(Perrier)·간편식 광범위', ir: 'https://www.nestle.com/investors', news: 'https://www.nestle.com/media/news', x: 'https://x.com/search?q=Nestle+2026' },
          { rank: 9,  name: 'Anheuser-Busch InBev',   ticker: 'BUD',     mktcap: '~$1,200억', detail: '벨기에 — 세계 최대 맥주(Budweiser·Stella·Corona·AB). 신흥국 진출 적극. M&A로 성장', ir: 'https://www.ab-inbev.com/investors/', news: 'https://www.ab-inbev.com/news/', x: 'https://x.com/search?q=AB+InBev+Budweiser+2026' },
          { rank: 10, name: 'Diageo',                 ticker: 'DEO',     mktcap: '~$700억',  detail: '영국 — 프리미엄 증류주 글로벌 1위(Johnnie Walker·Smirnoff·Guinness·Don Julio). 텀블러 시장도 확대', ir: 'https://www.diageo.com/en/investors/', news: 'https://www.diageo.com/en/news-and-media/', x: 'https://x.com/search?q=Diageo+2026' },
          { rank: 11, name: 'Brown-Forman',           ticker: 'BF.B',    mktcap: '~$160억',  detail: 'Jack Daniel\'s 본가. 미국 위스키·테킬라(El Jimador) 글로벌 마케팅. 가족 통제 기업', ir: 'https://www.brown-forman.com/investors', news: 'https://www.brown-forman.com/news', x: 'https://x.com/search?q=Brown-Forman+Jack+Daniels+2026' },
          { rank: 12, name: 'Molson Coors',           ticker: 'TAP',     mktcap: '~$120억',  detail: 'Coors Light·Miller·Blue Moon. 북미 2위 맥주. 무알콜·증류주(RTD) 라인업 확장', ir: 'https://www.molsoncoors.com/investors', news: 'https://www.molsoncoors.com/news', x: 'https://x.com/search?q=Molson+Coors+2026' },
        ],
      },
      {
        id: 'food_brands',
        icon: '🍫',
        name: '식품 브랜드',
        desc: '간편식·과자·시리얼·유제품 글로벌 브랜드',
        detail: [
          '식품 브랜드의 강점은 100년 누적된 브랜드 자산과 유통 채널이다. 코로나 이후 인플레이션·건강 트렌드가 동시에 작용해 가격 인상력(Pricing Power)이 핵심 경쟁력이 됐다. 미국 가공식품(Mondelez·Kraft Heinz·General Mills)은 GLP-1 다이어트 약 영향을 받지만, 프리미엄 라인과 신흥국 확장으로 방어 중.',
          '한편 신흥 트렌드인 식물성 단백질(Beyond Meat·Impossible Foods)·기능성 식품은 적자 지속 중이지만 거대 식품사들이 인수·자체 출시로 진입. 헬시 트렌드의 GLP-1 영향은 식품주에 구조적 역풍으로 작용 가능성.',
        ],
        candidates: [
          { rank: 1,  name: 'Mondelez International', ticker: 'MDLZ',    mktcap: '~$960억',  detail: 'Oreo·Cadbury·Toblerone 등 스낵 브랜드. 글로벌 시장 점유 — 신흥국 매출 비중 큼. 카카오 가격 변동에 민감', ir: 'https://ir.mondelezinternational.com', news: 'https://www.mondelezinternational.com/news', x: 'https://x.com/search?q=Mondelez+Oreo+2026' },
          { rank: 2,  name: 'Kraft Heinz',            ticker: 'KHC',     mktcap: '~$400억',  detail: 'Kraft·Heinz·Philadelphia·Oscar Mayer. 미국 가공식품 메이저. Buffett·3G Capital 보유, 구조조정 진행', ir: 'https://ir.kraftheinzcompany.com', news: 'https://www.kraftheinzcompany.com/news', x: 'https://x.com/search?q=Kraft+Heinz+2026' },
          { rank: 3,  name: 'General Mills',          ticker: 'GIS',     mktcap: '~$340억',  detail: 'Cheerios·Pillsbury·Häagen-Dazs·Blue Buffalo(반려동물). 시리얼·간편식·반려동물 다각화', ir: 'https://investors.generalmills.com', news: 'https://www.generalmills.com/news', x: 'https://x.com/search?q=General+Mills+2026' },
          { rank: 4,  name: 'Kellanova',              ticker: 'K',       mktcap: '~$280억',  detail: 'Pringles·Cheez-It·Pop-Tarts. Kellogg\'s에서 분사. Mars가 인수 합의 — 2025 마무리 예상', ir: 'https://investor.kellanova.com', news: 'https://www.kellanova.com/news', x: 'https://x.com/search?q=Kellanova+Mars+merger+2026' },
          { rank: 5,  name: 'Hershey',                ticker: 'HSY',     mktcap: '~$370억',  detail: '미국 초콜릿 1위(Hershey\'s·Reese\'s·Kit Kat 미국). 코코아 가격 폭등으로 마진 압박. 신흥국 확장', ir: 'https://www.thehersheycompany.com/en_us/home/investors.html', news: 'https://www.thehersheycompany.com/en_us/home/news.html', x: 'https://x.com/search?q=Hershey+chocolate+2026' },
          { rank: 6,  name: 'McCormick',              ticker: 'MKC',     mktcap: '~$190억',  detail: '향신료·소스 글로벌 1위. French\'s·Frank\'s RedHot·Cholula. B2B 식품 서비스 50% 비중', ir: 'https://ir.mccormick.com', news: 'https://www.mccormickcorporation.com/news', x: 'https://x.com/search?q=McCormick+spices+2026' },
          { rank: 7,  name: 'J.M. Smucker',           ticker: 'SJM',     mktcap: '~$130억',  detail: 'Smucker\'s 잼·Jif 땅콩버터·Folgers 커피·Hostess(Twinkies) 인수. 가족 경영', ir: 'https://www.jmsmucker.com/investors', news: 'https://www.jmsmucker.com/news', x: 'https://x.com/search?q=Smucker+Hostess+2026' },
          { rank: 8,  name: 'Conagra Brands',         ticker: 'CAG',     mktcap: '~$130억',  detail: 'Healthy Choice·Marie Callender\'s·Slim Jim·Reddi-wip. 냉동식품·간편식 강자. 인수합병 활발', ir: 'https://www.conagrabrands.com/investor-relations', news: 'https://www.conagrabrands.com/news', x: 'https://x.com/search?q=Conagra+Brands+2026' },
          { rank: 9,  name: 'Hormel Foods',           ticker: 'HRL',     mktcap: '~$170억',  detail: 'Spam·Skippy·Jennie-O 칠면조·Planters 견과. 미국 가공육·견과 메이저. 가족재단 통제', ir: 'https://www.hormelfoods.com/investors/', news: 'https://www.hormelfoods.com/newsroom/', x: 'https://x.com/search?q=Hormel+Spam+2026' },
          { rank: 10, name: 'Unilever',               ticker: 'UL',      mktcap: '~$1,500억', detail: '영국·네덜란드 — 식품(Hellmann\'s·Knorr·Magnum) + 생필품(Dove·Axe). 식품·뷰티 분사 검토', ir: 'https://www.unilever.com/investor-relations/', news: 'https://www.unilever.com/news/', x: 'https://x.com/search?q=Unilever+2026' },
          { rank: 11, name: 'Danone',                 ticker: 'DANOY',   mktcap: '~$450억',  detail: '프랑스 — 유제품·요거트(Activia·Oikos)·생수(Evian)·이유식(Aptamil). 식물성 유제품(Silk·Alpro)도 보유', ir: 'https://www.danone.com/investor-relations.html', news: 'https://www.danone.com/media/press-releases.html', x: 'https://x.com/search?q=Danone+2026' },
          { rank: 12, name: 'Lamb Weston',            ticker: 'LW',      mktcap: '~$80억',   detail: '냉동 감자(프렌치프라이) 글로벌 1위. McDonald\'s 등 외식 체인 핵심 공급. 곡물 가격 변동에 민감', ir: 'https://investors.lambweston.com', news: 'https://www.lambweston.com/news', x: 'https://x.com/search?q=Lamb+Weston+fries+2026' },
        ],
      },
    ],
  },

  // ─── 레이어 3: 담배 / 주류 ─────────────────────────────────────
  {
    id: 'tobacco_alcohol',
    layer: '🚬 담배 / 주류',
    components: [
      {
        id: 'tobacco',
        icon: '🚬',
        name: '담배 / 차세대 니코틴',
        desc: '전통 담배 + 가열식·전자담배 (HnB·E-cig)',
        detail: [
          '담배 산업은 흡연율 감소로 전통 궐련(combustible) 매출이 매년 5~7% 줄지만, 가열식 담배(HnB: IQOS·Glo)와 전자담배(E-cig·Vape·니코틴 파우치)가 빠르게 그 자리를 채우고 있다. PM의 IQOS는 일본·유럽에서 시장 점유 20%+, 미국 출시 본격화. BTI·MO도 차세대 니코틴 제품 라인업 확대.',
          '담배주는 ESG 리스크가 크지만, 강력한 가격 결정력과 고배당으로 장기 보유 매력은 여전. 다만 GLP-1·니코틴 파우치(ZYN) 같은 트렌드가 새 변수.',
        ],
        candidates: [
          { rank: 1,  name: 'Philip Morris International', ticker: 'PM',  mktcap: '~$1,800억', detail: 'IQOS 글로벌 마케팅 — 차세대 니코틴 매출 비중 40%+ 달성. ZYN(Swedish Match) 인수로 니코틴 파우치 미국 1위', ir: 'https://www.pmi.com/investor-relations', news: 'https://www.pmi.com/media-center', x: 'https://x.com/search?q=Philip+Morris+IQOS+ZYN+2026' },
          { rank: 2,  name: 'Altria Group',           ticker: 'MO',      mktcap: '~$960억',  detail: '미국 마부 — Marlboro 미국 점유 50%+. NJOY 전자담배·on! 니코틴 파우치. JUUL 투자 손실', ir: 'https://www.altria.com/investors', news: 'https://www.altria.com/news-and-insights', x: 'https://x.com/search?q=Altria+Marlboro+NJOY+2026' },
          { rank: 3,  name: 'British American Tobacco', ticker: 'BTI',   mktcap: '~$870억',  detail: '영국 — 글로벌 2위. Glo HnB·Vuse Vape·Velo 니코틴 파우치. 미국 시장 강력', ir: 'https://www.bat.com/investors', news: 'https://www.bat.com/news', x: 'https://x.com/search?q=BAT+Glo+Vuse+2026' },
          { rank: 4,  name: 'Imperial Brands',         ticker: 'IMBBY',   mktcap: '~$280억',  detail: '영국 — Davidoff·Gauloises·Winston. blu Vape·Pulze HnB. 가격 결정력으로 안정 배당', ir: 'https://www.imperialbrandsplc.com/investors.html', news: 'https://www.imperialbrandsplc.com/news.html', x: 'https://x.com/search?q=Imperial+Brands+blu+2026' },
          { rank: 5,  name: 'Japan Tobacco',           ticker: 'JAPAY',   mktcap: '~$420억',  detail: '일본 — 일본·러시아 점유 압도적. Ploom HnB·Camel·Winston. 음료·식품·의약품 다각화', ir: 'https://www.jt.com/investors/index.html', news: 'https://www.jt.com/media/news/index.html', x: 'https://x.com/search?q=Japan+Tobacco+Ploom+2026' },
          { rank: 6,  name: 'Reynolds American',       ticker: 'Private', mktcap: 'N/A',      detail: 'BTI 자회사 — Camel·Newport·VUSE 미국 마케팅. Pall Mall·Natural American Spirit. 니코틴 파우치 선도', ir: 'https://www.reynoldsamerican.com', news: 'https://www.reynoldsamerican.com/newsroom', x: 'https://x.com/search?q=Reynolds+American+VUSE+2026' },
          { rank: 7,  name: 'Universal Corporation',   ticker: 'UVV',     mktcap: '~$15억',   detail: '글로벌 잎담배 가공·유통. PM·BTI·Altria 등 메이저에 원료 공급. 안정 배당주', ir: 'https://www.universalcorp.com/investors', news: 'https://www.universalcorp.com/news', x: 'https://x.com/search?q=Universal+Corporation+leaf+tobacco' },
          { rank: 8,  name: 'Pyxus International',     ticker: 'Private', mktcap: 'N/A',      detail: '미국 — 잎담배 가공·유통 2위. Alliance One 자회사. PM 등 메이저 공급', ir: 'https://www.pyxus.com', news: 'https://www.pyxus.com/news', x: 'https://x.com/search?q=Pyxus+leaf+tobacco' },
          { rank: 9,  name: '22nd Century Group',     ticker: 'XXII',    mktcap: '~$0.2억',  detail: '저니코틴 담배 R&D — FDA 승인 받은 VLN 브랜드. 진통·니코틴 의존 치료 연구', ir: 'https://ir.xxiicentury.com', news: 'https://www.xxiicentury.com/news', x: 'https://x.com/search?q=22nd+Century+VLN+2026' },
          { rank: 10, name: 'Turning Point Brands',    ticker: 'TPB',     mktcap: '~$8억',    detail: 'Zig-Zag 롤링 페이퍼·Stoker\'s 무연 담배. 캐나비스 액세서리(롤링 페이퍼) 시장 진입', ir: 'https://investors.turningpointbrands.com', news: 'https://www.turningpointbrands.com/news', x: 'https://x.com/search?q=Turning+Point+Brands+Zig-Zag+2026' },
        ],
      },
      {
        id: 'spirits_brewers',
        icon: '🥃',
        name: '주류 (증류주·맥주·와인)',
        desc: '글로벌 알코올 메이저 — 위스키·테킬라·맥주·와인',
        detail: [
          '주류 시장은 프리미엄화 흐름이 강력하다. 위스키(아시아 수요)·테킬라(미국 폭발적 성장)·증류주가 맥주를 압도하는 성장률을 보인다. Diageo·Brown-Forman·Constellation Brands 같은 메이저는 프리미엄 라인업으로 마진을 끌어올리고, 신흥국 중산층 소비 확대로 장기 성장 동력 확보.',
          'GLP-1 약물 영향으로 알코올 소비 감소 우려가 있지만 아직 정량적 영향은 제한적. 무알콜 음료(0.0%)·기능성 칵테일(RTD: Ready to Drink) 트렌드가 새 카테고리로 부상.',
        ],
        candidates: [
          { rank: 1,  name: 'Diageo',                 ticker: 'DEO',     mktcap: '~$700억',  detail: '영국 — Johnnie Walker·Smirnoff·Guinness·Don Julio·Tanqueray. 프리미엄 증류주 글로벌 1위', ir: 'https://www.diageo.com/en/investors/', news: 'https://www.diageo.com/en/news-and-media/', x: 'https://x.com/search?q=Diageo+JohnnieWalker+2026' },
          { rank: 2,  name: 'Anheuser-Busch InBev',   ticker: 'BUD',     mktcap: '~$1,200억', detail: '벨기에 — 세계 최대 맥주(Budweiser·Stella·Corona·AB·Hoegaarden). 신흥국 비중 큼', ir: 'https://www.ab-inbev.com/investors/', news: 'https://www.ab-inbev.com/news/', x: 'https://x.com/search?q=AB+InBev+Budweiser+2026' },
          { rank: 3,  name: 'Constellation Brands',   ticker: 'STZ',     mktcap: '~$420억',  detail: '미국 — 맥주(Modelo·Corona) 미국 점유 1위. 와인(Robert Mondavi)·증류주. Canopy Growth(카나비스) 투자', ir: 'https://www.cbrands.com/investors', news: 'https://news.cbrands.com', x: 'https://x.com/search?q=Constellation+Brands+Modelo+2026' },
          { rank: 4,  name: 'Heineken',               ticker: 'HEINY',   mktcap: '~$520억',  detail: '네덜란드 — 글로벌 2위 맥주. Heineken·Amstel·Tiger·Birra Moretti. 아프리카·아시아 강력', ir: 'https://www.theheinekencompany.com/investors', news: 'https://www.theheinekencompany.com/newsroom', x: 'https://x.com/search?q=Heineken+2026' },
          { rank: 5,  name: 'Pernod Ricard',          ticker: 'PDRDY',   mktcap: '~$420억',  detail: '프랑스 — 글로벌 2위 증류주. Absolut·Jameson·Chivas·Martell·Ballantine\'s. 아시아 위스키 수요 강세', ir: 'https://www.pernod-ricard.com/en/investors/', news: 'https://www.pernod-ricard.com/en/media/news', x: 'https://x.com/search?q=Pernod+Ricard+Jameson+2026' },
          { rank: 6,  name: 'Brown-Forman',           ticker: 'BF.B',    mktcap: '~$160억',  detail: '미국 — Jack Daniel\'s 본가. 위스키·테킬라(El Jimador·Herradura). 가족 통제. 안정 배당', ir: 'https://www.brown-forman.com/investors', news: 'https://www.brown-forman.com/news', x: 'https://x.com/search?q=Brown-Forman+Jack+Daniels+2026' },
          { rank: 7,  name: 'Molson Coors',           ticker: 'TAP',     mktcap: '~$120억',  detail: '미국·캐나다 — Coors Light·Miller·Blue Moon. 북미 2위 맥주. Topo Chico Hard Seltzer', ir: 'https://www.molsoncoors.com/investors', news: 'https://www.molsoncoors.com/news', x: 'https://x.com/search?q=Molson+Coors+2026' },
          { rank: 8,  name: 'Boston Beer Company',    ticker: 'SAM',     mktcap: '~$30억',   detail: 'Sam Adams·Truly·Twisted Tea·Angry Orchard. 크래프트 맥주·Hard Seltzer 시장 선도', ir: 'https://investor.bostonbeer.com', news: 'https://www.bostonbeer.com/news', x: 'https://x.com/search?q=Boston+Beer+SamAdams+2026' },
          { rank: 9,  name: 'Carlsberg',              ticker: 'CABGY',   mktcap: '~$170억',  detail: '덴마크 — 4위 맥주(Carlsberg·Tuborg·1664 Blanc). 러시아 시장 철수 후 아시아·인도 확장 가속', ir: 'https://www.carlsberggroup.com/investor-relations/', news: 'https://www.carlsberggroup.com/newsroom/', x: 'https://x.com/search?q=Carlsberg+2026' },
          { rank: 10, name: 'Davide Campari Group',   ticker: 'DVCMY',   mktcap: '~$110억',  detail: '이탈리아 — Aperol·Campari·Wild Turkey·Skyy Vodka. 칵테일 트렌드 수혜. M&A 활발', ir: 'https://www.camparigroup.com/en/investors', news: 'https://www.camparigroup.com/en/news', x: 'https://x.com/search?q=Campari+Aperol+2026' },
          { rank: 11, name: 'Treasury Wine Estates',  ticker: 'TSRYY',   mktcap: '~$80억',   detail: '호주 — Penfolds·Wolf Blass·19 Crimes. 프리미엄 와인 글로벌. 중국 관세 해제로 회복', ir: 'https://www.tweglobal.com/investors', news: 'https://www.tweglobal.com/news', x: 'https://x.com/search?q=Treasury+Wine+Penfolds+2026' },
          { rank: 12, name: 'Becle (Cuervo)',         ticker: 'BCKLY',   mktcap: '~$65억',   detail: '멕시코 — 글로벌 1위 테킬라(Jose Cuervo). 1758년 설립 가족 기업. 미국 테킬라 붐 직접 수혜', ir: 'https://ir.becle.com', news: 'https://www.becleworld.com/news', x: 'https://x.com/search?q=Becle+Jose+Cuervo+2026' },
        ],
      },
    ],
  },

  // ─── 레이어 4: 생필품 / 유통 ───────────────────────────────────
  {
    id: 'household_retail',
    layer: '🏪 생필품 / 유통',
    components: [
      {
        id: 'household',
        icon: '🧴',
        name: '생필품 / 헬스·뷰티',
        desc: '세제·종이·치약·뷰티 — 일상 필수 브랜드',
        detail: [
          '생필품 메이저(Procter & Gamble·Colgate·Kimberly-Clark·Estée Lauder)는 100년 이상의 브랜드 자산과 글로벌 유통망으로 안정적 현금흐름을 만든다. 인플레이션 시기에 강력한 가격 결정력으로 마진을 지키지만, 신흥국 통화 약세·원자재 가격 변동성에는 노출돼 있다.',
          '뷰티 카테고리(스킨케어·메이크업)는 럭셔리 트렌드와 한국·중국 K뷰티 경쟁이 격화. Estée Lauder는 중국 매출 부진으로 고전 중이며, L\'Oréal은 럭셔리·과학 기반 스킨케어로 차별화. 헬스 트렌드(GLP-1)가 화장품 시장에 미치는 영향은 아직 제한적.',
        ],
        candidates: [
          { rank: 1,  name: 'Procter & Gamble',       ticker: 'PG',      mktcap: '~$3,800억', detail: '글로벌 생필품 1위 — Tide·Pampers·Gillette·Crest·Bounty. 65개 브랜드 글로벌 유통. 안정 배당의 정석', ir: 'https://us.pg.com/investors/', news: 'https://us.pg.com/news/', x: 'https://x.com/search?q=Procter+Gamble+2026' },
          { rank: 2,  name: 'Colgate-Palmolive',      ticker: 'CL',      mktcap: '~$770억',  detail: '치약(Colgate)·세제·반려동물식품(Hill\'s Pet Nutrition). 신흥국 매출 50%+. 헬스·뷰티 다각화', ir: 'https://investor.colgatepalmolive.com', news: 'https://www.colgatepalmolive.com/en-us/who-we-are/news', x: 'https://x.com/search?q=Colgate+Palmolive+2026' },
          { rank: 3,  name: 'Kimberly-Clark',         ticker: 'KMB',     mktcap: '~$460억',  detail: '티슈·생리대·기저귀(Kleenex·Huggies·Kotex·Cottonelle). 펄프 가격에 민감. 안정 배당', ir: 'https://investor.kimberly-clark.com', news: 'https://news.kimberly-clark.com', x: 'https://x.com/search?q=Kimberly-Clark+2026' },
          { rank: 4,  name: 'Estée Lauder',           ticker: 'EL',      mktcap: '~$280억',  detail: 'M.A.C·La Mer·Clinique·Bobbi Brown. 프리미엄 뷰티. 중국 회복 + 면세점 회복이 핵심 변수', ir: 'https://www.elcompanies.com/en/investors', news: 'https://www.elcompanies.com/en/news-and-media', x: 'https://x.com/search?q=Estee+Lauder+2026' },
          { rank: 5,  name: 'L\'Oréal',                ticker: 'LRLCY',   mktcap: '~$2,400억', detail: '프랑스 — 세계 최대 뷰티. Lancôme·Maybelline·Garnier·Kérastase·CeraVe. 럭셔리·매스 균형', ir: 'https://www.loreal-finance.com/en', news: 'https://www.loreal.com/en/news', x: 'https://x.com/search?q=Loreal+2026' },
          { rank: 6,  name: 'Church & Dwight',        ticker: 'CHD',     mktcap: '~$280억',  detail: 'Arm & Hammer·Trojan·OxiClean·Vitafusion. 세제·구강·콘돔·비타민 다각화', ir: 'https://churchdwight.com/investors/', news: 'https://www.churchdwight.com/news/', x: 'https://x.com/search?q=Church+Dwight+2026' },
          { rank: 7,  name: 'Clorox',                 ticker: 'CLX',     mktcap: '~$180억',  detail: 'Clorox 표백제·Pine-Sol·Brita·Burt\'s Bees·Kingsford 숯. 청소·홈케어 메이저', ir: 'https://investors.thecloroxcompany.com', news: 'https://www.thecloroxcompany.com/news/', x: 'https://x.com/search?q=Clorox+2026' },
          { rank: 8,  name: 'Coty',                   ticker: 'COTY',    mktcap: '~$60억',   detail: '향수·메이크업 글로벌 — Calvin Klein·Hugo Boss 라이선스 + Cover Girl·Rimmel. 중국 회복 변수', ir: 'https://investors.coty.com', news: 'https://www.coty.com/news', x: 'https://x.com/search?q=Coty+2026' },
          { rank: 9,  name: 'Edgewell Personal Care', ticker: 'EPC',     mktcap: '~$15억',   detail: 'Schick·Edge·Banana Boat·Hawaiian Tropic·Wet Ones. 면도기·자외선차단·기저귀(Playtex)', ir: 'https://www.edgewell.com/investors', news: 'https://www.edgewell.com/news', x: 'https://x.com/search?q=Edgewell+Schick+2026' },
          { rank: 10, name: 'Ulta Beauty',            ticker: 'ULTA',    mktcap: '~$170억',  detail: '미국 최대 뷰티 전문점. 프리미엄+매스 동시 취급. 1,400+ 매장. Target 콜라보 매장 확장', ir: 'https://investor.ulta.com', news: 'https://www.ulta.com/discover/news', x: 'https://x.com/search?q=Ulta+Beauty+2026' },
          { rank: 11, name: 'e.l.f. Beauty',          ticker: 'ELF',     mktcap: '~$60억',   detail: '저가 뷰티 브랜드 — Z세대 SNS 마케팅으로 폭발 성장. 비건·동물실험 반대 포지셔닝', ir: 'https://investor.elfbeauty.com', news: 'https://www.elfbeauty.com/news/', x: 'https://x.com/search?q=elf+Beauty+2026' },
          { rank: 12, name: 'Bath & Body Works',      ticker: 'BBWI',    mktcap: '~$70억',   detail: '미국 — 향초·바디워시·홈프래그런스 전문. 1,800+ 매장. 매장 경험 + 온라인 결합 모델', ir: 'https://www.bbwinc.com/investors', news: 'https://www.bbwinc.com/news', x: 'https://x.com/search?q=Bath+Body+Works+2026' },
        ],
      },
      {
        id: 'mass_retail',
        icon: '🛒',
        name: '대형 유통 / 식료품 소매',
        desc: '대형마트·창고형·식료품 체인',
        detail: [
          '대형 유통(WMT·COST·KR·TGT)은 가장 큰 매출 규모와 가장 얇은 마진을 동시에 가진 사업이다. 인플레이션 시기에 가격 경쟁력으로 시장 점유를 늘리고, 자체 브랜드(PB) 비중을 높여 마진을 방어한다. WMT·COST는 디지털·옴니채널·회원제·약국·헬스케어로 사업 영역을 확장 중.',
          '아마존(AMZN)이 식료품(Whole Foods)·물류(Prime)로 위협하지만 오프라인 대형마트는 신선식품·즉시성에서 여전히 유리. COST의 회원제 모델은 가장 견고한 비즈니스 — 회원 갱신율 90%+. 한편 약국 체인(WBA·CVS)은 의료비 부담과 온라인 처방으로 구조적 위기.',
        ],
        candidates: [
          { rank: 1,  name: 'Walmart',                ticker: 'WMT',     mktcap: '~$8,000억', detail: '세계 최대 소매 — 매출 6,500억 달러+. Walmart+ 회원제·디지털 광고·옴니채널 디지털 전환 가속', ir: 'https://corporate.walmart.com/about/investors', news: 'https://corporate.walmart.com/news', x: 'https://x.com/search?q=Walmart+2026' },
          { rank: 2,  name: 'Costco Wholesale',       ticker: 'COST',    mktcap: '~$4,200억', detail: '창고형 회원제 — 전 세계 880+ 매장, 회원 갱신율 90%+. PB(Kirkland) 비중 큼. 가장 안정적 소매주', ir: 'https://investor.costco.com', news: 'https://investor.costco.com/news', x: 'https://x.com/search?q=Costco+2026' },
          { rank: 3,  name: 'Target',                 ticker: 'TGT',     mktcap: '~$680억',  detail: '미국 대형마트 3위 — 트렌디 PB(Cat & Jack·Goodfellow). Walmart·Amazon 압박으로 마진 압박', ir: 'https://corporate.target.com/investors', news: 'https://corporate.target.com/news-features', x: 'https://x.com/search?q=Target+TGT+2026' },
          { rank: 4,  name: 'Kroger',                 ticker: 'KR',      mktcap: '~$430억',  detail: '미국 최대 식료품 체인 — 2,700+ 매장. Albertsons 합병 무산 후 배당·자사주 매입. 자체 브랜드 강화', ir: 'https://ir.kroger.com', news: 'https://ir.kroger.com/news', x: 'https://x.com/search?q=Kroger+2026' },
          { rank: 5,  name: 'Dollar General',         ticker: 'DG',      mktcap: '~$200억',  detail: '미국 농촌·소도시 할인점 — 19,000+ 매장. 인플레이션 시기 강세. 신선식품 진출 확대', ir: 'https://investor.dollargeneral.com', news: 'https://www.dollargeneral.com/about-us/newsroom', x: 'https://x.com/search?q=Dollar+General+2026' },
          { rank: 6,  name: 'Dollar Tree',            ticker: 'DLTR',    mktcap: '~$150억',  detail: 'Family Dollar 자회사 — 16,000+ 매장. 1.25달러 균일가 모델. Family Dollar 분리 검토 중', ir: 'https://corporate.dollartree.com/investors', news: 'https://corporate.dollartree.com/newsroom/', x: 'https://x.com/search?q=Dollar+Tree+2026' },
          { rank: 7,  name: 'Walgreens Boots Alliance', ticker: 'WBA',   mktcap: '~$80억',   detail: '미국 약국 체인 — Boots 영국 보유. 의료비·처방 마진 압박으로 구조조정 중. 매장 폐쇄·의료 진출', ir: 'https://investor.walgreensbootsalliance.com', news: 'https://news.walgreens.com', x: 'https://x.com/search?q=Walgreens+2026' },
          { rank: 8,  name: 'CVS Health',             ticker: 'CVS',     mktcap: '~$700억',  detail: '미국 1위 약국 + Aetna 보험 + 의료서비스(MinuteClinic). 헬스케어 통합 전략 — 약국·보험·진료 결합', ir: 'https://investors.cvshealth.com', news: 'https://www.cvshealth.com/news', x: 'https://x.com/search?q=CVS+Health+2026' },
          { rank: 9,  name: 'Albertsons Companies',   ticker: 'ACI',     mktcap: '~$130억',  detail: '미국 식료품 체인 — Safeway·Vons·Jewel-Osco. Kroger 합병 무산. 자체 디지털·로열티 강화', ir: 'https://www.albertsonscompanies.com/investors/', news: 'https://www.albertsonscompanies.com/newsroom/', x: 'https://x.com/search?q=Albertsons+2026' },
          { rank: 10, name: 'BJ\'s Wholesale Club',   ticker: 'BJ',      mktcap: '~$130억',  detail: '미국 동부 창고형 회원제 — Costco 대비 1/4 규모. 수익성 개선·매장 확장 중', ir: 'https://investors.bjs.com', news: 'https://newsroom.bjs.com', x: 'https://x.com/search?q=BJs+Wholesale+2026' },
          { rank: 11, name: 'Performance Food Group', ticker: 'PFGC',    mktcap: '~$130억',  detail: '미국 식자재 유통 3위 — 외식·편의점 공급. Sysco·USFD에 이은 메이저. 헬스케어 식자재 확장', ir: 'https://www.pfgc.com/Investors', news: 'https://www.pfgc.com/News', x: 'https://x.com/search?q=Performance+Food+Group+2026' },
          { rank: 12, name: 'Sysco Corporation',      ticker: 'SYY',     mktcap: '~$370억',  detail: '미국 식자재 유통 1위 — 외식 체인·호텔·병원·학교 공급. 식자재 가격 상승의 직접 수혜', ir: 'https://investors.sysco.com', news: 'https://www.sysco.com/news/', x: 'https://x.com/search?q=Sysco+2026' },
        ],
      },
    ],
  },
];

// 회사명 → 국기 이모지 (FLAG_BY_NAME 매핑) — 미매핑 시 컴포넌트에서 🌐 fallback
export const STAPLES_FLAG_BY_NAME = {
  // 미국
  'Nutrien': '🇨🇦', 'Corteva': '🇺🇸', 'CF Industries': '🇺🇸', 'Mosaic': '🇺🇸',
  'Bayer (Crop Science)': '🇩🇪', 'FMC Corporation': '🇺🇸', 'Archer Daniels Midland': '🇺🇸',
  'Bunge': '🇺🇸', 'Tyson Foods': '🇺🇸', 'Deere & Company': '🇺🇸', 'AGCO': '🇺🇸',
  'Yara International': '🇳🇴',
  'Coca-Cola': '🇺🇸', 'PepsiCo': '🇺🇸', 'Monster Beverage': '🇺🇸',
  'Keurig Dr Pepper': '🇺🇸', 'Celsius Holdings': '🇺🇸', 'Starbucks': '🇺🇸',
  'Constellation Brands': '🇺🇸', 'Nestlé': '🇨🇭', 'Anheuser-Busch InBev': '🇧🇪',
  'Diageo': '🇬🇧', 'Brown-Forman': '🇺🇸', 'Molson Coors': '🇺🇸',
  'Mondelez International': '🇺🇸', 'Kraft Heinz': '🇺🇸', 'General Mills': '🇺🇸',
  'Kellanova': '🇺🇸', 'Hershey': '🇺🇸', 'McCormick': '🇺🇸',
  'J.M. Smucker': '🇺🇸', 'Conagra Brands': '🇺🇸', 'Hormel Foods': '🇺🇸',
  'Unilever': '🇬🇧', 'Danone': '🇫🇷', 'Lamb Weston': '🇺🇸',
  'Philip Morris International': '🇺🇸', 'Altria Group': '🇺🇸',
  'British American Tobacco': '🇬🇧', 'Imperial Brands': '🇬🇧', 'Japan Tobacco': '🇯🇵',
  'Reynolds American': '🇺🇸', 'Universal Corporation': '🇺🇸', 'Pyxus International': '🇺🇸',
  '22nd Century Group': '🇺🇸', 'Turning Point Brands': '🇺🇸',
  'Heineken': '🇳🇱', 'Pernod Ricard': '🇫🇷', 'Boston Beer Company': '🇺🇸',
  'Carlsberg': '🇩🇰', 'Davide Campari Group': '🇮🇹', 'Treasury Wine Estates': '🇦🇺',
  'Becle (Cuervo)': '🇲🇽',
  'Procter & Gamble': '🇺🇸', 'Colgate-Palmolive': '🇺🇸', 'Kimberly-Clark': '🇺🇸',
  'Estée Lauder': '🇺🇸', "L'Oréal": '🇫🇷', 'Church & Dwight': '🇺🇸', 'Clorox': '🇺🇸',
  'Coty': '🇺🇸', 'Edgewell Personal Care': '🇺🇸', 'Ulta Beauty': '🇺🇸',
  'e.l.f. Beauty': '🇺🇸', 'Bath & Body Works': '🇺🇸',
  'Walmart': '🇺🇸', 'Costco Wholesale': '🇺🇸', 'Target': '🇺🇸', 'Kroger': '🇺🇸',
  'Dollar General': '🇺🇸', 'Dollar Tree': '🇺🇸', 'Walgreens Boots Alliance': '🇺🇸',
  'CVS Health': '🇺🇸', 'Albertsons Companies': '🇺🇸', "BJ's Wholesale Club": '🇺🇸',
  'Performance Food Group': '🇺🇸', 'Sysco Corporation': '🇺🇸',
};
