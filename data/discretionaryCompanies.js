// 임의소비재(Consumer Discretionary) 섹터 밸류체인 데이터 (2026년 기준)
// 밸류체인: 자동차/EV → 럭셔리/패션 → 외식/여행 → 가전/홈 → 미디어/엔터
// candidates[]: 각 카테고리별 후보풀 (10~12개)
// API로 시총 가져와 내림차순 정렬 → 상위 10개 동적 표시

export const DISCRETIONARY_LAYERS = [
  // ─── 레이어 1: 자동차 / EV ─────────────────────────────────────
  {
    id: 'auto_ev',
    layer: '🚗 자동차 / EV',
    components: [
      {
        id: 'auto_oems',
        icon: '🚗',
        name: '자동차 OEM (전통+EV)',
        desc: '글로벌 완성차·전기차 — 전동화 전환 가속',
        detail: [
          '자동차 산업은 100년 만에 가장 큰 구조 변화 중. 전기차(EV)로의 전환이 진행되면서 전통 OEM(Toyota·Ford·GM·Stellantis)은 거대한 자본투자를 통해 EV 라인업을 확장 중이다. Tesla는 EV 시장의 절대 강자로 글로벌 점유 20%+를 차지하지만, 중국 BYD·NIO·Xpeng 같은 신생 EV 메이커가 급성장하며 가격 경쟁이 격화.',
          'EV 보조금 축소·중국 시장 둔화·자율주행 R&D 부담 등으로 자동차 산업 마진은 압박받고 있다. 다만 픽업트럭(F-Series·Silverado)·하이브리드는 여전히 수익성 좋고, Tesla의 FSD(Full Self-Driving) 같은 자율주행 소프트웨어가 차세대 마진의 핵심 변수.',
        ],
        candidates: [
          { rank: 1,  name: 'Tesla',                  ticker: 'TSLA',    mktcap: '~$1조',     detail: 'EV 글로벌 1위. Model Y/3·Cybertruck·Semi. FSD·Optimus 로봇·에너지 사업까지 확장. 머스크 영향력 큼', ir: 'https://ir.tesla.com', news: 'https://www.tesla.com/blog', x: 'https://x.com/search?q=Tesla+2026' },
          { rank: 2,  name: 'Toyota Motor',           ticker: 'TM',      mktcap: '~$2,500억', detail: '글로벌 1위 완성차(판매량) — 하이브리드 강자. 전고체배터리 EV 2027 출시 예정. 일본·미국·중국 균형', ir: 'https://global.toyota/en/ir/', news: 'https://global.toyota/en/newsroom/', x: 'https://x.com/search?q=Toyota+Motor+2026' },
          { rank: 3,  name: 'Ferrari',                ticker: 'RACE',    mktcap: '~$870억',  detail: '이탈리아 — 럭셔리 슈퍼카. 연 1.5만 대만 생산. 매출당 수익률 25%+ — 자동차 업계 최고 마진. 첫 EV 2026', ir: 'https://www.ferrari.com/en-EN/corporate/investors', news: 'https://corporate.ferrari.com/en/news', x: 'https://x.com/search?q=Ferrari+EV+2026' },
          { rank: 4,  name: 'BYD',                    ticker: 'BYDDY',   mktcap: '~$1,000억', detail: '중국 EV·하이브리드 1위. Tesla 추월 성장. 배터리 자체 생산(BYD Blade). 글로벌 진출 가속 (유럽·동남아)', ir: 'https://www.bydglobal.com/en/index.html', news: 'https://www.bydglobal.com/en/news.html', x: 'https://x.com/search?q=BYD+EV+2026' },
          { rank: 5,  name: 'General Motors',         ticker: 'GM',      mktcap: '~$580억',  detail: '미국 — Chevrolet·Cadillac·GMC. EV(Ultium 플랫폼) 적자 지속. Cruise 자율주행 사업 축소', ir: 'https://investor.gm.com', news: 'https://news.gm.com', x: 'https://x.com/search?q=General+Motors+2026' },
          { rank: 6,  name: 'Ford Motor',             ticker: 'F',       mktcap: '~$420억',  detail: '미국 — F-150 픽업·Bronco·Mustang. F-150 Lightning EV·Mach-E. 픽업+EV 균형 전략', ir: 'https://shareholder.ford.com', news: 'https://media.ford.com', x: 'https://x.com/search?q=Ford+Motor+2026' },
          { rank: 7,  name: 'Stellantis',             ticker: 'STLA',    mktcap: '~$420억',  detail: 'Jeep·Ram·Dodge·Fiat·Peugeot·Chrysler 통합. 글로벌 4위 OEM. EV 14개 브랜드 출시 계획', ir: 'https://www.stellantis.com/en/investors', news: 'https://www.stellantis.com/en/news', x: 'https://x.com/search?q=Stellantis+2026' },
          { rank: 8,  name: 'Honda Motor',            ticker: 'HMC',     mktcap: '~$420억',  detail: '일본 — Honda·Acura. 하이브리드 강자. Sony와 EV 합작(Afeela). 닛산과 합병 협상 진행 중', ir: 'https://global.honda/en/investors/', news: 'https://global.honda/en/newsroom/', x: 'https://x.com/search?q=Honda+Motor+2026' },
          { rank: 9,  name: 'Volkswagen',             ticker: 'VWAGY',   mktcap: '~$540억',  detail: '독일 — VW·Audi·Porsche·Lamborghini·Bentley. ID. 시리즈 EV. Porsche 분리상장 후 가치 재평가', ir: 'https://www.volkswagenag.com/en/InvestorRelations.html', news: 'https://www.volkswagenag.com/en/news.html', x: 'https://x.com/search?q=Volkswagen+2026' },
          { rank: 10, name: 'Mercedes-Benz',          ticker: 'MBGYY',   mktcap: '~$700억',  detail: '독일 — 럭셔리 1위(BMW와 함께). EQS·EQE EV 라인업. 중국 시장 비중 30%+ — 중국 회복이 핵심', ir: 'https://group.mercedes-benz.com/investors/', news: 'https://group.mercedes-benz.com/news/', x: 'https://x.com/search?q=Mercedes-Benz+2026' },
          { rank: 11, name: 'BMW',                    ticker: 'BMWYY',   mktcap: '~$580억',  detail: '독일 — BMW·MINI·Rolls-Royce. iX·i7 럭셔리 EV. 중국 시장 강세, 전동화 보수적 접근', ir: 'https://www.bmwgroup.com/en/investor-relations.html', news: 'https://www.bmwgroup.com/en/news.html', x: 'https://x.com/search?q=BMW+2026' },
          { rank: 12, name: 'Rivian Automotive',      ticker: 'RIVN',    mktcap: '~$130억',  detail: '미국 EV 픽업·SUV(R1T·R1S) + 아마존 배달밴. VW 합작($58억). 적자 지속이지만 R2 모델로 대중화 시도', ir: 'https://rivian.com/investors', news: 'https://rivian.com/newsroom', x: 'https://x.com/search?q=Rivian+2026' },
          { rank: 13, name: 'Lucid Group',            ticker: 'LCID',    mktcap: '~$80억',   detail: '미국 럭셔리 EV(Air·Gravity SUV). PIF(사우디 국부펀드) 60%+ 보유. 사우디 공장 가동', ir: 'https://ir.lucidmotors.com', news: 'https://www.lucidmotors.com/news', x: 'https://x.com/search?q=Lucid+Motors+2026' },
          { rank: 14, name: 'Li Auto',                ticker: 'LI',      mktcap: '~$220억',  detail: '중국 — EREV(주행거리 연장형 EV) SUV 전문. 가족용 럭셔리 SUV로 차별화. 흑자 전환', ir: 'https://ir.lixiang.com', news: 'https://ir.lixiang.com/news', x: 'https://x.com/search?q=Li+Auto+2026' },
          { rank: 15, name: 'NIO',                    ticker: 'NIO',     mktcap: '~$70억',   detail: '중국 럭셔리 EV — 배터리 스왑 네트워크 1,500+ 거점. 자동차 OS·AI 자율주행 통합 모델', ir: 'https://ir.nio.com', news: 'https://www.nio.com/news', x: 'https://x.com/search?q=NIO+2026' },
        ],
      },
    ],
  },

  // ─── 레이어 2: 럭셔리 / 패션 ───────────────────────────────────
  {
    id: 'luxury_fashion',
    layer: '👗 럭셔리 / 패션',
    components: [
      {
        id: 'luxury',
        icon: '💎',
        name: '럭셔리 그룹',
        desc: '명품·시계·주얼리·향수 글로벌 메이저',
        detail: [
          '럭셔리 산업은 LVMH·Hermès·Kering이 주도하는 유럽 중심 시장이다. 이 산업의 본질은 "희소성 마케팅" — 가격 인상을 통해 마진을 끌어올리는 모델이다. LVMH(Louis Vuitton·Dior·Tiffany·Bulgari)는 글로벌 1위, Hermès는 가장 비싼 단일 브랜드, Kering(Gucci·Saint Laurent)은 경쟁 중.',
          '중국 럭셔리 수요가 성장 둔화·일본 엔저로 인한 일시적 매출 패턴 변화가 변수. 미국·중동 신부유층은 여전히 강력. 한편 LVMH는 시계·주얼리(TAG Heuer·Bulgari) 카테고리도 강화 중이고, Estée Lauder 같은 럭셔리 뷰티는 코로나 이후 회복이 더딤.',
          '주의: 일부 유럽 본주는 Finnhub 무료 플랜에서 데이터가 제한적이라 ADR 위주로 큐레이션',
        ],
        candidates: [
          { rank: 1,  name: 'LVMH',                   ticker: 'LVMUY',   mktcap: '~$3,800억', detail: '프랑스 — 글로벌 1위 럭셔리. Louis Vuitton·Dior·Tiffany·Bulgari·Moët·Hennessy. 75개+ 브랜드', ir: 'https://www.lvmh.com/investors/', news: 'https://www.lvmh.com/news-documents/news/', x: 'https://x.com/search?q=LVMH+2026' },
          { rank: 2,  name: 'Hermès',                 ticker: 'HESAY',   mktcap: '~$2,400억', detail: '프랑스 — 가장 비싼 단일 럭셔리 브랜드. Birkin·Kelly 백 대기시간 2~5년. 가족 통제, 성장 보수적', ir: 'https://finance.hermes.com/en/', news: 'https://finance.hermes.com/en/News', x: 'https://x.com/search?q=Hermes+Birkin+2026' },
          { rank: 3,  name: 'Ferrari',                ticker: 'RACE',    mktcap: '~$870억',  detail: '이탈리아 — 럭셔리 슈퍼카. 자동차 업계 최고 마진. 럭셔리 산업으로 분류 가능', ir: 'https://www.ferrari.com/en-EN/corporate/investors', news: 'https://corporate.ferrari.com/en/news', x: 'https://x.com/search?q=Ferrari+EV+2026' },
          { rank: 4,  name: 'Compagnie Financière Richemont', ticker: 'CFRUY', mktcap: '~$830억', detail: '스위스 — Cartier·Van Cleef·IWC·Vacheron Constantin. 시계·주얼리 전문 럭셔리 그룹', ir: 'https://www.richemont.com/en/home/investors-info/', news: 'https://www.richemont.com/en/home/news/', x: 'https://x.com/search?q=Richemont+Cartier+2026' },
          { rank: 5,  name: 'Kering',                 ticker: 'PPRUY',   mktcap: '~$330억',  detail: '프랑스 — Gucci·Saint Laurent·Bottega Veneta·Balenciaga. Gucci 부진으로 가치 반토막. 회복 중', ir: 'https://www.kering.com/en/finance/', news: 'https://www.kering.com/en/news/', x: 'https://x.com/search?q=Kering+Gucci+2026' },
          { rank: 6,  name: 'Prada',                  ticker: 'PRDSY',   mktcap: '~$190억',  detail: '이탈리아 — Prada·Miu Miu·Church\'s. Miu Miu 매출 폭발 성장. 홍콩·이탈리아 듀얼 상장', ir: 'https://www.pradagroup.com/en/investors.html', news: 'https://www.pradagroup.com/en/news-media.html', x: 'https://x.com/search?q=Prada+Miu+Miu+2026' },
          { rank: 7,  name: 'Estée Lauder',           ticker: 'EL',      mktcap: '~$280억',  detail: 'M.A.C·La Mer·Clinique·Bobbi Brown. 프리미엄 뷰티 메이저. 중국·면세점 회복 핵심 변수', ir: 'https://www.elcompanies.com/en/investors', news: 'https://www.elcompanies.com/en/news-and-media', x: 'https://x.com/search?q=Estee+Lauder+2026' },
          { rank: 8,  name: 'Tapestry',               ticker: 'TPR',     mktcap: '~$140억',  detail: '미국 — Coach·Kate Spade·Stuart Weitzman. Capri Holdings(Versace·Michael Kors) 인수 무산', ir: 'https://www.tapestry.com/investors', news: 'https://www.tapestry.com/news/', x: 'https://x.com/search?q=Tapestry+Coach+2026' },
          { rank: 9,  name: 'Capri Holdings',         ticker: 'CPRI',    mktcap: '~$30억',   detail: '미국 — Versace·Michael Kors·Jimmy Choo. Tapestry 인수 무산 후 독립. Versace·Jimmy Choo 매각 추진', ir: 'https://www.capriholdings.com/investor-relations/', news: 'https://www.capriholdings.com/news/', x: 'https://x.com/search?q=Capri+Holdings+2026' },
          { rank: 10, name: 'Burberry',               ticker: 'BURBY',   mktcap: '~$45억',   detail: '영국 — 트렌치코트·체크 패턴 클래식 럭셔리. 중국 부진 + 럭셔리 둔화로 매출 30%+ 감소. 회복 중', ir: 'https://www.burberryplc.com/en/investors.html', news: 'https://www.burberryplc.com/en/news.html', x: 'https://x.com/search?q=Burberry+2026' },
          { rank: 11, name: 'Movado Group',           ticker: 'MOV',     mktcap: '~$3억',    detail: '미국 — Movado·Coach Watches·Ferragamo Watches·Olivia Burton. 중저가 시계 메이저', ir: 'https://www.movadogroup.com/investors', news: 'https://www.movadogroup.com/news', x: 'https://x.com/search?q=Movado+Group+2026' },
          { rank: 12, name: 'Sotheby\'s',              ticker: 'Private', mktcap: 'N/A',      detail: '럭셔리 경매 — 미술품·시계·주얼리. Patrick Drahi 소유 비공개. 럭셔리 시장 사이클의 바로미터', ir: 'https://www.sothebys.com/en/about/about-us', news: 'https://www.sothebys.com/en/about/news', x: 'https://x.com/search?q=Sothebys+2026' },
        ],
      },
      {
        id: 'apparel',
        icon: '👟',
        name: '의류 / 신발 / 라이프스타일',
        desc: '스포츠·캐주얼·아웃도어 — 매스 마켓 패션',
        detail: [
          '대중 패션 시장은 NKE(Nike)·LULU(Lululemon)·UA·On Running·Adidas의 격전지다. 코로나 이후 운동복(athleisure) 트렌드가 정착했지만 NKE는 디자인 침체·중국 부진·온라인 판매 의존도 등으로 고전 중. LULU는 요가·러닝·골프 다양화로 성장 지속.',
          '중저가 패션(SPA: ZARA·H&M·UNIQLO)은 인플레이션 시기에 가격 경쟁력으로 강세. TJX(TJ Maxx·Marshalls 할인 매장)는 경기 둔화의 가장 큰 수혜주 — "재고 정리" 모델로 마진 안정. RL(Polo Ralph Lauren)·PVH(Calvin Klein·Tommy Hilfiger)는 클래식 미국 브랜드.',
        ],
        candidates: [
          { rank: 1,  name: 'Nike',                   ticker: 'NKE',     mktcap: '~$1,200억', detail: '글로벌 스포츠웨어 1위 — Air Jordan·Nike Air. 디자인 침체·중국 부진으로 매출 감소. CEO 교체 후 회복 시도', ir: 'https://investors.nike.com', news: 'https://news.nike.com', x: 'https://x.com/search?q=Nike+2026' },
          { rank: 2,  name: 'TJX Companies',          ticker: 'TJX',     mktcap: '~$1,400억', detail: 'TJ Maxx·Marshalls·HomeGoods 할인 매장. 재고 정리 비즈니스 모델 — 경기 둔화 시기 강세', ir: 'https://www.tjx.com/investors', news: 'https://www.tjx.com/news', x: 'https://x.com/search?q=TJX+Companies+2026' },
          { rank: 3,  name: 'Lululemon Athletica',    ticker: 'LULU',    mktcap: '~$420억',  detail: '캐나다 — 요가·러닝·골프 프리미엄. 여성 요가복으로 시작, 남성·골프·신발 확장. 중국 매출 폭발', ir: 'https://corporate.lululemon.com/investors', news: 'https://corporate.lululemon.com/media', x: 'https://x.com/search?q=Lululemon+2026' },
          { rank: 4,  name: 'Adidas',                 ticker: 'ADDYY',   mktcap: '~$430억',  detail: '독일 — 글로벌 2위 스포츠웨어. Yeezy 분리 후 회복. Samba·Gazelle 레트로 트렌드로 매출 회복', ir: 'https://www.adidas-group.com/en/investors/', news: 'https://www.adidas-group.com/en/media/news-archive/', x: 'https://x.com/search?q=Adidas+2026' },
          { rank: 5,  name: 'Inditex (Zara)',         ticker: 'IDEXY',   mktcap: '~$1,600억', detail: '스페인 — Zara·Pull&Bear·Massimo Dutti·Bershka. SPA(Speed-to-Retail) 모델 글로벌 1위', ir: 'https://www.inditex.com/itxcomweb/en/investors', news: 'https://www.inditex.com/itxcomweb/en/press', x: 'https://x.com/search?q=Inditex+Zara+2026' },
          { rank: 6,  name: 'Fast Retailing (UNIQLO)', ticker: 'FRCOY',  mktcap: '~$1,000억', detail: '일본 — UNIQLO 글로벌 SPA. 기능성 의류(HEATTECH·AIRism) 강자. 아시아 시장 강세', ir: 'https://www.fastretailing.com/eng/ir/', news: 'https://www.fastretailing.com/eng/group/news/', x: 'https://x.com/search?q=Uniqlo+Fast+Retailing+2026' },
          { rank: 7,  name: 'On Holding',             ticker: 'ONON',    mktcap: '~$170억',  detail: '스위스 — 프리미엄 러닝화 On Cloud. Roger Federer 투자자. NKE 대안으로 급성장', ir: 'https://investors.on-running.com', news: 'https://www.on-running.com/en-us/explore/news', x: 'https://x.com/search?q=On+Holding+running+2026' },
          { rank: 8,  name: 'Deckers Outdoor',        ticker: 'DECK',    mktcap: '~$300억',  detail: 'HOKA·UGG·Teva. HOKA 러닝화 폭발 성장으로 NKE 대체 부상. UGG 시즌 안정 매출', ir: 'https://ir.deckers.com', news: 'https://www.deckers.com/news/', x: 'https://x.com/search?q=Deckers+HOKA+UGG+2026' },
          { rank: 9,  name: 'Ralph Lauren',           ticker: 'RL',      mktcap: '~$160억',  detail: 'Polo·Lauren·Purple Label. 미국 클래식 럭셔리. 럭셔리 가격대로 포지션 강화', ir: 'https://corporate.ralphlauren.com/investors.html', news: 'https://corporate.ralphlauren.com/news.html', x: 'https://x.com/search?q=Ralph+Lauren+2026' },
          { rank: 10, name: 'PVH Corp',               ticker: 'PVH',     mktcap: '~$60억',   detail: 'Calvin Klein·Tommy Hilfiger. 중국·유럽 매출 비중 큼. 라이센스 비즈니스 모델', ir: 'https://www.pvh.com/investors', news: 'https://www.pvh.com/news', x: 'https://x.com/search?q=PVH+Calvin+Klein+2026' },
          { rank: 11, name: 'Birkenstock',            ticker: 'BIRK',    mktcap: '~$110억',  detail: '독일 250년 샌들 — 2023 IPO. Barbie 영화 효과로 글로벌 인지도 폭증. 럭셔리·헬스 포지셔닝', ir: 'https://www.birkenstock-holding.com/investors', news: 'https://www.birkenstock-holding.com/news', x: 'https://x.com/search?q=Birkenstock+2026' },
          { rank: 12, name: 'Crocs',                  ticker: 'CROX',    mktcap: '~$70억',   detail: 'Crocs 클로그·HEYDUDE 인수. 글로벌 매출 30% 신장. 협업·이모지 마케팅으로 Z세대 핵심', ir: 'https://investors.crocs.com', news: 'https://www.crocs.com/news.html', x: 'https://x.com/search?q=Crocs+2026' },
        ],
      },
    ],
  },

  // ─── 레이어 3: 외식 / 여행 ─────────────────────────────────────
  {
    id: 'restaurants_travel',
    layer: '🍔 외식 / 여행',
    components: [
      {
        id: 'restaurants',
        icon: '🍔',
        name: '외식 체인 (QSR·캐주얼·커피)',
        desc: '글로벌 패스트푸드·커피·캐주얼 다이닝',
        detail: [
          'QSR(Quick Service Restaurant)은 인플레이션 시기 가장 회복력 강한 카테고리다. McDonald\'s·Yum Brands(KFC·Pizza Hut·Taco Bell)·Chipotle 같은 메이저는 가격 인상력과 글로벌 프랜차이즈 모델로 마진을 방어한다. Starbucks는 글로벌 커피 1위지만 미국 노조·중국 부진으로 고전 중.',
          'GLP-1(Ozempic) 약물이 외식 산업에 미치는 영향은 제한적이지만 장기적으로 식사량 감소 우려. Chipotle·Cava 같은 프리미엄 패스트 캐주얼은 여전히 강력. 한편 인도네시아·인도·중국 같은 신흥국 외식 시장이 빠르게 성장 — McDonald\'s·KFC가 그 수혜를 본다.',
        ],
        candidates: [
          { rank: 1,  name: 'McDonald\'s',             ticker: 'MCD',     mktcap: '~$2,200억', detail: '글로벌 QSR 1위 — 100국+ 41,000+ 매장. 프랜차이즈 모델 95%. 부동산 가치 높음. 다국적 안정성', ir: 'https://corporate.mcdonalds.com/corpmcd/investors', news: 'https://corporate.mcdonalds.com/corpmcd/our-stories.html', x: 'https://x.com/search?q=McDonalds+2026' },
          { rank: 2,  name: 'Starbucks',              ticker: 'SBUX',    mktcap: '~$1,000억', detail: '글로벌 커피 1위 — 38,000+ 매장. 미국 매출 부진·중국 시장 둔화. 신임 CEO Brian Niccol(Chipotle 출신) 회복 시도', ir: 'https://investor.starbucks.com', news: 'https://stories.starbucks.com', x: 'https://x.com/search?q=Starbucks+2026' },
          { rank: 3,  name: 'Chipotle Mexican Grill', ticker: 'CMG',     mktcap: '~$870억',  detail: '미국 멕시코 패스트 캐주얼. 디지털 주문·로열티 프로그램 강력. CEO 변경 후 운영 효율 핵심', ir: 'https://ir.chipotle.com', news: 'https://newsroom.chipotle.com', x: 'https://x.com/search?q=Chipotle+2026' },
          { rank: 4,  name: 'Yum! Brands',            ticker: 'YUM',     mktcap: '~$390억',  detail: 'KFC·Pizza Hut·Taco Bell·Habit Burger. 글로벌 60,000+ 매장. 중국·인도 고성장 시장 강력', ir: 'https://www.yum.com/investors', news: 'https://www.yum.com/wps/portal/yumbrands/Yumbrands/news', x: 'https://x.com/search?q=Yum+Brands+2026' },
          { rank: 5,  name: 'Restaurant Brands International', ticker: 'QSR', mktcap: '~$220억', detail: 'Burger King·Tim Hortons·Popeyes·Firehouse Subs. 캐나다 본사. Popeyes 닭버거 폭발 성장', ir: 'https://www.rbi.com/English/investors/default.aspx', news: 'https://www.rbi.com/English/news/news-details/', x: 'https://x.com/search?q=Restaurant+Brands+RBI+2026' },
          { rank: 6,  name: 'Domino\'s Pizza',         ticker: 'DPZ',     mktcap: '~$160억',  detail: '글로벌 피자 배달 1위. 디지털 주문·차량 추적·드론 배달 실험. 신흥국 확장 활발', ir: 'https://ir.dominos.com', news: 'https://biz.dominos.com', x: 'https://x.com/search?q=Dominos+Pizza+2026' },
          { rank: 7,  name: 'Darden Restaurants',     ticker: 'DRI',     mktcap: '~$210억',  detail: 'Olive Garden·LongHorn·Capital Grille. 미국 캐주얼 다이닝 1위. Chuy\'s 인수', ir: 'https://www.darden.com/investors', news: 'https://www.darden.com/news/', x: 'https://x.com/search?q=Darden+Restaurants+2026' },
          { rank: 8,  name: 'Cava Group',             ticker: 'CAVA',    mktcap: '~$140억',  detail: '미국 — 지중해 패스트 캐주얼 (Chipotle 모델). 2023 IPO 후 폭발 성장. Z세대 헬시 트렌드 핵심', ir: 'https://investor.cava.com', news: 'https://cava.com/news', x: 'https://x.com/search?q=CAVA+Group+2026' },
          { rank: 9,  name: 'Wingstop',               ticker: 'WING',    mktcap: '~$80억',   detail: '미국 닭윙 전문 — 매장당 매출(AUV) 업계 최고 수준. 디지털 주문 70%+. 영국·중동 진출', ir: 'https://ir.wingstop.com', news: 'https://www.wingstop.com/about-us/', x: 'https://x.com/search?q=Wingstop+2026' },
          { rank: 10, name: 'Texas Roadhouse',        ticker: 'TXRH',    mktcap: '~$120억',  detail: '미국 캐주얼 스테이크하우스. 매출 성장률 업계 최고. 인플레이션 시기 가성비로 매장당 매출 증가', ir: 'https://investor.texasroadhouse.com', news: 'https://investor.texasroadhouse.com/news-and-events/news', x: 'https://x.com/search?q=Texas+Roadhouse+2026' },
          { rank: 11, name: 'Compass Group',          ticker: 'CMPGY',   mktcap: '~$580억',  detail: '영국 — 글로벌 1위 단체급식(B2B 식자재). 학교·병원·기업·이벤트 케이터링. 안정 성장', ir: 'https://www.compass-group.com/en/investors.html', news: 'https://www.compass-group.com/en/news.html', x: 'https://x.com/search?q=Compass+Group+2026' },
          { rank: 12, name: 'Aramark',                ticker: 'ARMK',    mktcap: '~$100억',  detail: '미국 단체급식·유니폼·의료시설 서비스. 학교·교도소·스포츠경기장. 분사 후 외식 집중', ir: 'https://www.aramark.com/investors', news: 'https://www.aramark.com/about-us/news', x: 'https://x.com/search?q=Aramark+2026' },
        ],
      },
      {
        id: 'travel_hotel',
        icon: '✈️',
        name: '여행 / 숙박 / OTA',
        desc: '항공·호텔·온라인 여행 플랫폼',
        detail: [
          '여행·숙박 산업은 코로나 후 강력한 펀트업 수요로 급반등했다. Booking·Expedia 같은 OTA(Online Travel Agency)가 호텔 예약을 지배하고, Airbnb는 단기 임대 시장을 장악. 호텔 체인(Marriott·Hilton·Hyatt)은 자산 경량화(franchise) 모델로 자본 효율을 끌어올렸다.',
          '중국 출국 회복·인도 신중산층 여행 폭증·미국 비즈니스 트래블 회복이 성장 동력. 한편 항공사는 연료비·인건비 변동성으로 마진 불안정. 크루즈(Carnival·RCL)는 코로나 충격에서 회복 중. 럭셔리 여행 트렌드가 강세.',
        ],
        candidates: [
          { rank: 1,  name: 'Booking Holdings',       ticker: 'BKNG',    mktcap: '~$1,700억', detail: '글로벌 OTA 1위 — Booking.com·Priceline·Kayak·OpenTable·Agoda. 유럽 호텔 시장 압도적', ir: 'https://www.bookingholdings.com/investors/', news: 'https://www.bookingholdings.com/press-releases/', x: 'https://x.com/search?q=Booking+Holdings+2026' },
          { rank: 2,  name: 'Airbnb',                 ticker: 'ABNB',    mktcap: '~$830억',  detail: '단기 임대 시장 장악 — 220국+. 럭셔리·체험(Airbnb Experiences) 확장. 호텔 산업 직접 위협', ir: 'https://investors.airbnb.com', news: 'https://news.airbnb.com', x: 'https://x.com/search?q=Airbnb+2026' },
          { rank: 3,  name: 'Marriott International', ticker: 'MAR',     mktcap: '~$700억',  detail: '글로벌 호텔 체인 1위 — 30+ 브랜드(Ritz-Carlton·St. Regis·W·Marriott). 9,000+ 호텔. 자산 경량화 모델', ir: 'https://www.marriott.com/investor.mi', news: 'https://news.marriott.com', x: 'https://x.com/search?q=Marriott+2026' },
          { rank: 4,  name: 'Hilton Worldwide',       ticker: 'HLT',     mktcap: '~$650억',  detail: '글로벌 호텔 2위 — Waldorf Astoria·Conrad·Hilton·Hampton·Embassy. 7,500+ 호텔. 신흥국 확장 적극', ir: 'https://ir.hilton.com', news: 'https://newsroom.hilton.com', x: 'https://x.com/search?q=Hilton+2026' },
          { rank: 5,  name: 'Expedia Group',          ticker: 'EXPE',    mktcap: '~$240억',  detail: 'Expedia·Vrbo·Hotels.com·Trivago. 미국 OTA 1위. AI 여행 어시스턴트 출시', ir: 'https://www.expediagroup.com/investors/', news: 'https://www.expediagroup.com/news/', x: 'https://x.com/search?q=Expedia+Group+2026' },
          { rank: 6,  name: 'Royal Caribbean',        ticker: 'RCL',     mktcap: '~$610억',  detail: '글로벌 크루즈 1위 — Royal Caribbean·Celebrity·Silversea. Icon of the Seas 세계 최대 크루즈선', ir: 'https://www.rclinvestor.com', news: 'https://www.royalcaribbeangroup.com/news/', x: 'https://x.com/search?q=Royal+Caribbean+2026' },
          { rank: 7,  name: 'Carnival Corporation',   ticker: 'CCL',     mktcap: '~$320억',  detail: '글로벌 크루즈 2위 — Carnival·Princess·Cunard·Holland America·AIDA. 코로나 부채 부담 회복 중', ir: 'https://www.carnivalcorp.com/investors', news: 'https://www.carnivalcorp.com/news/', x: 'https://x.com/search?q=Carnival+Cruise+2026' },
          { rank: 8,  name: 'Hyatt Hotels',           ticker: 'H',       mktcap: '~$160억',  detail: 'Park Hyatt·Andaz·Hyatt Regency·Thompson. 럭셔리 비중 높음. Apple Leisure Group 인수로 신흥국 확장', ir: 'https://investors.hyatt.com', news: 'https://newsroom.hyatt.com', x: 'https://x.com/search?q=Hyatt+Hotels+2026' },
          { rank: 9,  name: 'Las Vegas Sands',        ticker: 'LVS',     mktcap: '~$320억',  detail: '글로벌 카지노·리조트 1위(매출). 마카오·싱가포르 비중 큼. 미국 사업 매각 후 아시아 집중', ir: 'https://investor.sands.com', news: 'https://www.sands.com/news/', x: 'https://x.com/search?q=Las+Vegas+Sands+2026' },
          { rank: 10, name: 'Wynn Resorts',           ticker: 'WYNN',    mktcap: '~$80억',   detail: '럭셔리 카지노 — Wynn Las Vegas·Wynn Macau·Encore. UAE 진출 중. 럭셔리 포지셔닝 차별화', ir: 'https://www.wynnresorts.com/CorporateGovernance/InvestorRelations', news: 'https://www.wynnresorts.com/Newsroom', x: 'https://x.com/search?q=Wynn+Resorts+2026' },
          { rank: 11, name: 'United Airlines',        ticker: 'UAL',     mktcap: '~$310억',  detail: '미국 글로벌 항공사 — 미국·아시아·유럽 노선. 비즈니스 클래스·국제선 회복 강세', ir: 'https://ir.united.com', news: 'https://hub.united.com/category/news', x: 'https://x.com/search?q=United+Airlines+2026' },
          { rank: 12, name: 'Delta Air Lines',        ticker: 'DAL',     mktcap: '~$420억',  detail: '미국 1위 항공사 — 프리미엄 좌석·SkyMiles 로열티 강력. American Express 카드 파트너십', ir: 'https://ir.delta.com', news: 'https://news.delta.com', x: 'https://x.com/search?q=Delta+Airlines+2026' },
        ],
      },
    ],
  },

  // ─── 레이어 4: 가전 / 홈 ───────────────────────────────────────
  {
    id: 'home_appliances',
    layer: '🏠 가전 / 홈',
    components: [
      {
        id: 'home_retail',
        icon: '🏠',
        name: '홈·가전·DIY 소매',
        desc: '주택·인테리어·DIY·전자제품',
        detail: [
          '홈 카테고리는 주택 시장(부동산 거래량·신축 착공) 사이클에 강하게 연동된다. Home Depot·Lowe\'s 같은 DIY 소매는 부동산 시장 둔화 시 매출이 함께 떨어지지만, 인플레이션이 안정되고 금리가 내려가면 강한 반등을 보인다. Amazon은 모든 카테고리를 잠식 중이지만 건설자재·중장비 분야는 여전히 오프라인 우세.',
          '가전 메이저(Whirlpool·LG·Samsung)는 백색가전 시장의 가격 경쟁이 치열. Wayfair·Williams-Sonoma 같은 홈데코 소매는 럭셔리·트렌드 변화에 민감. 한편 Best Buy(전자제품)는 스트리밍·온라인 경쟁으로 구조적 압박, 헬스기기·서비스로 영역 확장 시도.',
        ],
        candidates: [
          { rank: 1,  name: 'Amazon',                 ticker: 'AMZN',    mktcap: '~$2,300억', detail: '글로벌 e커머스 1위 + AWS 클라우드. 가전·홈·의류·식료품 등 모든 카테고리 우위. AI 데이터센터 카드와 중복', ir: 'https://ir.aboutamazon.com', news: 'https://aws.amazon.com/blogs', x: 'https://x.com/search?q=Amazon+retail+2026' },
          { rank: 2,  name: 'Home Depot',             ticker: 'HD',      mktcap: '~$3,800억', detail: '미국 DIY·건축자재 1위 — 2,300+ 매장. Pro 고객(건설업자) 비중 50%+. SRS Distribution 인수', ir: 'https://ir.homedepot.com', news: 'https://corporate.homedepot.com/news', x: 'https://x.com/search?q=Home+Depot+2026' },
          { rank: 3,  name: 'Lowe\'s Companies',       ticker: 'LOW',     mktcap: '~$1,400억', detail: '미국 DIY 2위 — 1,700+ 매장. DIY 소비자 비중 높음. 디지털 전환·MyLowe\'s 회원제 강화', ir: 'https://corporate.lowes.com/investors', news: 'https://corporate.lowes.com/newsroom', x: 'https://x.com/search?q=Lowes+2026' },
          { rank: 4,  name: 'Best Buy',               ticker: 'BBY',     mktcap: '~$190억',  detail: '미국 전자제품 1위 체인 — Geek Squad 서비스 강력. 헬스 케어·연결 디지털 헬스 진입 중', ir: 'https://investors.bestbuy.com', news: 'https://corporate.bestbuy.com/news/', x: 'https://x.com/search?q=Best+Buy+2026' },
          { rank: 5,  name: 'Williams-Sonoma',        ticker: 'WSM',     mktcap: '~$220억',  detail: 'Williams-Sonoma·Pottery Barn·West Elm. 프리미엄 홈데코·가구. B2B(호텔·기업) 진출', ir: 'https://ir.williams-sonomainc.com', news: 'https://www.williams-sonomainc.com/press-releases/', x: 'https://x.com/search?q=Williams-Sonoma+2026' },
          { rank: 6,  name: 'Wayfair',                ticker: 'W',       mktcap: '~$60억',   detail: '미국 온라인 가구·홈데코 1위. 주택 시장 둔화로 적자 지속. AI 검색·VR 미리보기 차별화', ir: 'https://investor.wayfair.com', news: 'https://www.aboutwayfair.com/news', x: 'https://x.com/search?q=Wayfair+2026' },
          { rank: 7,  name: 'RH (Restoration Hardware)', ticker: 'RH',   mktcap: '~$80억',   detail: '미국 럭셔리 홈 인테리어 — Galleries 매장은 호텔·레스토랑 결합. 럭셔리 부동산 트렌드 직접 수혜', ir: 'https://ir.rh.com', news: 'https://ir.rh.com/news-events/press-releases', x: 'https://x.com/search?q=RH+Restoration+Hardware+2026' },
          { rank: 8,  name: 'Whirlpool',              ticker: 'WHR',     mktcap: '~$60억',   detail: '미국 백색가전 1위 — Whirlpool·KitchenAid·Maytag·JennAir. 주택 사이클·원자재 가격에 민감', ir: 'https://investors.whirlpoolcorp.com', news: 'https://www.whirlpoolcorp.com/news/', x: 'https://x.com/search?q=Whirlpool+2026' },
          { rank: 9,  name: 'Floor & Decor',          ticker: 'FND',     mktcap: '~$110억',  detail: '미국 타일·바닥재 전문 — 200+ 매장. Pro 고객 비중 50%+. Home Depot 외 차별화 포지션', ir: 'https://ir.flooranddecor.com', news: 'https://www.flooranddecor.com/about-us/news', x: 'https://x.com/search?q=Floor+Decor+2026' },
          { rank: 10, name: 'Tractor Supply',         ticker: 'TSCO',    mktcap: '~$280억',  detail: '미국 농촌·소도시 — 농기구·가축용품·DIY. 2,300+ 매장. 도시 외곽 라이프스타일 전문', ir: 'https://ir.tractorsupply.com', news: 'https://corporate.tractorsupply.com/newsroom.html', x: 'https://x.com/search?q=Tractor+Supply+2026' },
          { rank: 11, name: 'Pool Corp',              ticker: 'POOL',    mktcap: '~$140억',  detail: '미국 수영장·정원 용품 유통 1위. B2B 비중 큼. 럭셔리 주택·아웃도어 트렌드 수혜', ir: 'https://ir.poolcorp.com', news: 'https://www.poolcorp.com/news/', x: 'https://x.com/search?q=Pool+Corp+2026' },
          { rank: 12, name: 'Carrier Global',         ticker: 'CARR',    mktcap: '~$580억',  detail: 'HVAC(냉난방·환기) 글로벌 1위. 데이터센터 냉각 수요 폭증 수혜. AI 인프라 간접 수혜', ir: 'https://ir.carrier.com', news: 'https://www.corporate.carrier.com/news/', x: 'https://x.com/search?q=Carrier+Global+2026' },
        ],
      },
    ],
  },

  // ─── 레이어 5: 미디어 / 엔터 ───────────────────────────────────
  {
    id: 'media_entertainment',
    layer: '🎬 미디어 / 엔터',
    components: [
      {
        id: 'media_entertainment',
        icon: '🎬',
        name: '미디어·스트리밍·게임',
        desc: '영상·음악·게임·소셜 — 콘텐츠 메이저',
        detail: [
          '미디어 산업은 스트리밍 전쟁이 일단락된 후 통합 단계다. Netflix는 글로벌 1위로 흑자 안정, Disney+/Hulu는 ESPN 통합으로 라이브 스포츠 강화. Warner Bros·Paramount·Comcast는 케이블 TV 쇠퇴로 구조조정 진행. 한편 Spotify(음악)는 흑자 전환에 성공.',
          '게임 산업은 Microsoft의 Activision 인수($687억)로 거대화. EA·Take-Two는 모바일 + 콘솔 멀티플랫폼 전략. Roblox·Unity는 메타버스·UGC 플랫폼으로 차별화. 콘텐츠가 결국 IP(지적재산) 싸움 — Disney의 마블·픽사·스타워즈, Netflix의 오리지널이 핵심.',
        ],
        candidates: [
          { rank: 1,  name: 'Netflix',                ticker: 'NFLX',    mktcap: '~$3,500억', detail: '글로벌 스트리밍 1위 — 3억+ 가입자. 광고 요금제로 ARPU 상승. 라이브 스포츠(NFL·WWE) 진입', ir: 'https://ir.netflix.net', news: 'https://about.netflix.com/en/news', x: 'https://x.com/search?q=Netflix+2026' },
          { rank: 2,  name: 'Walt Disney',            ticker: 'DIS',     mktcap: '~$2,000억', detail: '엔터 IP 1위 — Marvel·Pixar·Star Wars·디즈니랜드. Disney+/Hulu/ESPN 스트리밍 통합', ir: 'https://thewaltdisneycompany.com/investor-relations/', news: 'https://thewaltdisneycompany.com/news/', x: 'https://x.com/search?q=Disney+2026' },
          { rank: 3,  name: 'Spotify',                ticker: 'SPOT',    mktcap: '~$1,200억', detail: '글로벌 음악 스트리밍 1위 — 6.4억+ 가입자. 흑자 전환 성공. 팟캐스트·오디오북 확장', ir: 'https://investors.spotify.com', news: 'https://newsroom.spotify.com', x: 'https://x.com/search?q=Spotify+2026' },
          { rank: 4,  name: 'Comcast',                ticker: 'CMCSA',   mktcap: '~$1,500억', detail: 'NBCUniversal(영화·TV)·Sky(영국)·Peacock 스트리밍·케이블. 케이블 TV 쇠퇴로 구조조정', ir: 'https://www.cmcsa.com', news: 'https://corporate.comcast.com/press', x: 'https://x.com/search?q=Comcast+2026' },
          { rank: 5,  name: 'Warner Bros. Discovery', ticker: 'WBD',     mktcap: '~$200억',  detail: 'HBO·Max·Discovery·CNN·Warner 스튜디오. WB Games(Mortal Kombat·Hogwarts Legacy). 부채 부담', ir: 'https://ir.wbd.com', news: 'https://wbd.com/news/', x: 'https://x.com/search?q=Warner+Bros+Discovery+2026' },
          { rank: 6,  name: 'Electronic Arts',        ticker: 'EA',      mktcap: '~$370억',  detail: 'FIFA(EA Sports FC)·Madden·Apex Legends·The Sims·Battlefield. 스포츠 게임 라이센스 강자', ir: 'https://ir.ea.com', news: 'https://www.ea.com/news', x: 'https://x.com/search?q=Electronic+Arts+2026' },
          { rank: 7,  name: 'Take-Two Interactive',   ticker: 'TTWO',    mktcap: '~$320억',  detail: 'GTA·Red Dead Redemption·NBA 2K·Civilization. GTA VI 출시 임박 — 게임 사상 최대 마케팅', ir: 'https://www.take2games.com/ir', news: 'https://www.take2games.com/news', x: 'https://x.com/search?q=Take-Two+Interactive+GTA6+2026' },
          { rank: 8,  name: 'Roblox',                 ticker: 'RBLX',    mktcap: '~$420억',  detail: '글로벌 UGC 게임 플랫폼 — 8천만+ 일일 활성. Z세대·알파세대 핵심. 광고·결제 다변화', ir: 'https://ir.roblox.com', news: 'https://corp.roblox.com/newsroom/', x: 'https://x.com/search?q=Roblox+2026' },
          { rank: 9,  name: 'Unity Software',         ticker: 'U',       mktcap: '~$80억',   detail: '게임 엔진 1위(모바일) — 가입제 + 광고. CEO 교체 후 회복 시도. AI 도구 통합', ir: 'https://investors.unity.com', news: 'https://unity.com/news', x: 'https://x.com/search?q=Unity+Software+2026' },
          { rank: 10, name: 'Live Nation Entertainment', ticker: 'LYV',  mktcap: '~$320억',  detail: '글로벌 1위 콘서트·티켓팅 — Ticketmaster 보유. Taylor Swift·Beyoncé 투어 등 라이브 엔터 회복', ir: 'https://investors.livenationentertainment.com', news: 'https://www.livenationentertainment.com/news/', x: 'https://x.com/search?q=Live+Nation+2026' },
          { rank: 11, name: 'Madison Square Garden Sports', ticker: 'MSGS', mktcap: '~$50억', detail: 'NY Knicks(NBA)·NY Rangers(NHL) 보유. 스포츠 미디어 권리·티켓 매출. NYC 부동산 가치', ir: 'https://www.msgsports.com/investors', news: 'https://www.msgsports.com/news/', x: 'https://x.com/search?q=Madison+Square+Garden+Sports+2026' },
          { rank: 12, name: 'TKO Group',              ticker: 'TKO',     mktcap: '~$200억',  detail: 'WWE + UFC 합병 회사. Endeavor 자회사. 글로벌 스포츠 엔터 — 미디어 권리·라이브 이벤트', ir: 'https://investors.tkogrp.com', news: 'https://www.tkogrp.com/news', x: 'https://x.com/search?q=TKO+Group+UFC+WWE+2026' },
          { rank: 13, name: 'Sony Group',             ticker: 'SONY',    mktcap: '~$1,100억', detail: '일본 — PlayStation·Sony Pictures·Sony Music·이미지센서. 게임·영화·음악·반도체 다각화', ir: 'https://www.sony.com/en/SonyInfo/IR/', news: 'https://www.sony.com/en/SonyInfo/News/', x: 'https://x.com/search?q=Sony+Group+2026' },
          { rank: 14, name: 'Nintendo',               ticker: 'NTDOY',   mktcap: '~$700억',  detail: '일본 — Switch·Mario·Zelda·Pokémon 슈퍼마리오IP. Switch 2 출시 임박. 모바일·테마파크 확장', ir: 'https://www.nintendo.co.jp/ir/en/', news: 'https://www.nintendo.com/about/news/', x: 'https://x.com/search?q=Nintendo+Switch2+2026' },
        ],
      },
    ],
  },
];

// 회사명 → 국기 이모지 — 미매핑 시 컴포넌트에서 🌐 fallback
export const DISCRETIONARY_FLAG_BY_NAME = {
  'Tesla': '🇺🇸', 'Toyota Motor': '🇯🇵', 'Ferrari': '🇮🇹', 'BYD': '🇨🇳',
  'General Motors': '🇺🇸', 'Ford Motor': '🇺🇸', 'Stellantis': '🇳🇱',
  'Honda Motor': '🇯🇵', 'Volkswagen': '🇩🇪', 'Mercedes-Benz': '🇩🇪', 'BMW': '🇩🇪',
  'Rivian Automotive': '🇺🇸', 'Lucid Group': '🇺🇸', 'Li Auto': '🇨🇳', 'NIO': '🇨🇳',
  'LVMH': '🇫🇷', 'Hermès': '🇫🇷', 'Compagnie Financière Richemont': '🇨🇭',
  'Kering': '🇫🇷', 'Prada': '🇮🇹', 'Estée Lauder': '🇺🇸',
  'Tapestry': '🇺🇸', 'Capri Holdings': '🇺🇸', 'Burberry': '🇬🇧',
  'Movado Group': '🇺🇸', "Sotheby's": '🇺🇸',
  'Nike': '🇺🇸', 'TJX Companies': '🇺🇸', 'Lululemon Athletica': '🇨🇦',
  'Adidas': '🇩🇪', 'Inditex (Zara)': '🇪🇸', 'Fast Retailing (UNIQLO)': '🇯🇵',
  'On Holding': '🇨🇭', 'Deckers Outdoor': '🇺🇸', 'Ralph Lauren': '🇺🇸',
  'PVH Corp': '🇺🇸', 'Birkenstock': '🇩🇪', 'Crocs': '🇺🇸',
  "McDonald's": '🇺🇸', 'Starbucks': '🇺🇸', 'Chipotle Mexican Grill': '🇺🇸',
  'Yum! Brands': '🇺🇸', 'Restaurant Brands International': '🇨🇦',
  "Domino's Pizza": '🇺🇸', 'Darden Restaurants': '🇺🇸', 'Cava Group': '🇺🇸',
  'Wingstop': '🇺🇸', 'Texas Roadhouse': '🇺🇸',
  'Compass Group': '🇬🇧', 'Aramark': '🇺🇸',
  'Booking Holdings': '🇺🇸', 'Airbnb': '🇺🇸', 'Marriott International': '🇺🇸',
  'Hilton Worldwide': '🇺🇸', 'Expedia Group': '🇺🇸', 'Royal Caribbean': '🇺🇸',
  'Carnival Corporation': '🇺🇸', 'Hyatt Hotels': '🇺🇸',
  'Las Vegas Sands': '🇺🇸', 'Wynn Resorts': '🇺🇸',
  'United Airlines': '🇺🇸', 'Delta Air Lines': '🇺🇸',
  'Amazon': '🇺🇸', 'Home Depot': '🇺🇸', "Lowe's Companies": '🇺🇸',
  'Best Buy': '🇺🇸', 'Williams-Sonoma': '🇺🇸', 'Wayfair': '🇺🇸',
  'RH (Restoration Hardware)': '🇺🇸', 'Whirlpool': '🇺🇸',
  'Floor & Decor': '🇺🇸', 'Tractor Supply': '🇺🇸', 'Pool Corp': '🇺🇸',
  'Carrier Global': '🇺🇸',
  'Netflix': '🇺🇸', 'Walt Disney': '🇺🇸', 'Spotify': '🇸🇪', 'Comcast': '🇺🇸',
  'Warner Bros. Discovery': '🇺🇸', 'Electronic Arts': '🇺🇸', 'Take-Two Interactive': '🇺🇸',
  'Roblox': '🇺🇸', 'Unity Software': '🇺🇸', 'Live Nation Entertainment': '🇺🇸',
  'Madison Square Garden Sports': '🇺🇸', 'TKO Group': '🇺🇸',
  'Sony Group': '🇯🇵', 'Nintendo': '🇯🇵',
};
