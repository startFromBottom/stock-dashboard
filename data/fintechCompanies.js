// 핀테크/금융 인프라 섹터 밸류체인 기업 데이터 (2026년 기준)
// 레이어 구조:
//   Layer 1 — 결제 인프라 (Payment Infrastructure)
//   Layer 2 — 은행/신용 인프라 (Banking & Credit)
//   Layer 3 — 투자/자산관리 인프라 (Investment & Wealth)
//   Layer 4 — 블록체인/크립토 (Blockchain & Crypto)
//   Layer 5 — AI 금융/데이터 (AI Finance & Data)
//
// candidates[]: 각 카테고리의 후보풀
// ticker: 'Private' = 비상장, 거래소 접두사 없으면 미국 상장

export const FINTECH_LAYERS = [
  {
    id: 'payment',
    layer: '💳 결제 인프라',
    components: [
      {
        id: 'network',
        icon: '🌐',
        name: '결제 네트워크',
        desc: '카드·전송 네트워크 운영',
        candidates: [
          { rank: 1,  name: 'Visa',              ticker: 'V',        mktcap: '~$5500억', detail: '전 세계 카드 결제 네트워크 1위 — 200개국 40억 장 카드, 연간 2,400억 건 거래 처리, VisaNet 인프라 운영', ir: 'https://investor.visa.com', news: 'https://usa.visa.com/about-visa/newsroom.html', x: 'https://x.com/search?q=Visa+payment+2026' },
          { rank: 2,  name: 'Mastercard',        ticker: 'MA',       mktcap: '~$4500억', detail: '글로벌 카드 결제 네트워크 2위 — 실시간 결제·오픈 뱅킹·사이버보안 솔루션 확장, AI 사기탐지 적용', ir: 'https://investor.mastercard.com', news: 'https://www.mastercard.com/news', x: 'https://x.com/search?q=Mastercard+payment+2026' },
          { rank: 3,  name: 'American Express',  ticker: 'AXP',      mktcap: '~$2000억', detail: '프리미엄 카드 발행사 겸 네트워크 — 자체 발행·취득·네트워크 수직통합, 고소득층 특화 비즈니스 모델', ir: 'https://ir.americanexpress.com', news: 'https://about.americanexpress.com/newsroom', x: 'https://x.com/search?q=AmericanExpress+payment+2026' },
          { rank: 4,  name: 'UnionPay (CUP)',    ticker: 'Private',  mktcap: 'N/A',      detail: '중국 최대·세계 최다 발행 카드 네트워크 — 중국 내 독점적 지위, 아시아·유럽 100국+ 수용', ir: 'https://www.unionpayintl.com', news: 'https://www.unionpayintl.com/en/mediaCenter/newsCenter', x: 'https://x.com/search?q=UnionPay+CUP+payment+2026' },
          { rank: 5,  name: 'Discover Financial', ticker: 'DFS',     mktcap: '~$500억',  detail: '미국 4위 결제 네트워크 겸 발행사 — Capital One 인수 추진 중, 직불·신용 네트워크 통합 플레이어', ir: 'https://investorrelations.discover.com', news: 'https://ir.discover.com/news', x: 'https://x.com/search?q=Discover+Financial+payment+2026' },
        ],
      },
      {
        id: 'processor',
        icon: '⚡',
        name: '결제 처리 / 게이트웨이',
        desc: '거래 승인·정산·게이트웨이',
        candidates: [
          { rank: 1,  name: 'Stripe',            ticker: 'Private',  mktcap: '~$700억',  detail: '개발자 중심 결제 처리 플랫폼 — API 우선 설계, 전 세계 수백만 기업 결제 인프라, IPO 준비 중', ir: 'https://stripe.com/newsroom', news: 'https://stripe.com/newsroom', x: 'https://x.com/search?q=Stripe+payment+IPO+2026' },
          { rank: 2,  name: 'Fiserv',            ticker: 'FI',       mktcap: '~$800억',  detail: '금융 기술·결제 처리 인프라 — 은행·신협·상점 결제 처리 솔루션, Clover POS 시스템 운영', ir: 'https://investors.fiserv.com', news: 'https://www.fiserv.com/en/about-fiserv/newsroom.html', x: 'https://x.com/search?q=Fiserv+fintech+2026' },
          { rank: 3,  name: 'FIS (Worldpay)',    ticker: 'FIS',      mktcap: '~$450억',  detail: '금융 서비스 IT 인프라 1위 — 은행 코어 시스템·카드 처리·자본시장 기술, Worldpay 분리 매각 진행', ir: 'https://investors.fisglobal.com', news: 'https://www.fisglobal.com/en/about-us/media', x: 'https://x.com/search?q=FIS+Worldpay+payment+2026' },
          { rank: 4,  name: 'Global Payments',   ticker: 'GPN',      mktcap: '~$250억',  detail: '글로벌 상인 결제 솔루션 — POS·이커머스·소프트웨어 통합 결제, 170개국 350만+ 상인 서비스', ir: 'https://investors.globalpayments.com', news: 'https://www.globalpayments.com/about-us/news-and-events', x: 'https://x.com/search?q=GlobalPayments+payment+2026' },
          { rank: 5,  name: 'Adyen',             ticker: 'ADYEN.AS', mktcap: '~$500억',  detail: '유럽 최대 결제 플랫폼 — 단일 플랫폼 온·오프라인 통합, Meta·Spotify·McDonald\'s 결제 파트너', ir: 'https://investors.adyen.com', news: 'https://www.adyen.com/knowledge-hub/latest-news', x: 'https://x.com/search?q=Adyen+payment+platform+2026' },
          { rank: 6,  name: 'PayPal',            ticker: 'PYPL',     mktcap: '~$700억',  detail: '온라인 결제·디지털 지갑 선구자 — Venmo·PayPal·Braintree·Honey 생태계, 월 4억 명 활성 계정', ir: 'https://investor.pypl.com', news: 'https://newsroom.paypal-corp.com', x: 'https://x.com/search?q=PayPal+digital+wallet+2026' },
          { rank: 7,  name: 'Square (Block)',    ticker: 'SQ',       mktcap: '~$450억',  detail: 'SMB 결제·금융 생태계 — Cash App·Square POS·Afterpay BNPL·비트코인 거래 통합 플랫폼', ir: 'https://investors.block.xyz', news: 'https://block.xyz/news', x: 'https://x.com/search?q=Block+Square+CashApp+2026' },
          { rank: 8,  name: 'Shopify Payments',  ticker: 'SHOP',     mktcap: '~$1200억', detail: '이커머스 내장 결제 — Shopify 플랫폼 기반 결제 처리, Balance·Capital 금융 서비스 확장', ir: 'https://investors.shopify.com', news: 'https://news.shopify.com', x: 'https://x.com/search?q=Shopify+payments+2026' },
          { rank: 9,  name: 'Klarna',            ticker: 'Private',  mktcap: '~$150억',  detail: 'BNPL(선구매 후결제) 유럽 1위 — 2억 명 소비자·50만 상인 파트너, 미국 시장 확장 중', ir: 'https://www.klarna.com/international/press', news: 'https://www.klarna.com/international/press', x: 'https://x.com/search?q=Klarna+BNPL+2026' },
          { rank: 10, name: 'Affirm',            ticker: 'AFRM',     mktcap: '~$200억',  detail: '미국 BNPL 1위 상장사 — Amazon·Shopify 파트너십, 신용 리스크 자체 인수·데이터 기반 심사', ir: 'https://investors.affirm.com', news: 'https://www.affirm.com/press', x: 'https://x.com/search?q=Affirm+BNPL+2026' },
          { rank: 11, name: 'Brex',              ticker: 'Private',  mktcap: '~$120억',  detail: '스타트업 특화 기업카드·결제 — 벤처 기반 신용 평가, AI 지출관리 플랫폼, 글로벌 확장 중', ir: 'https://www.brex.com/newsroom', news: 'https://www.brex.com/newsroom', x: 'https://x.com/search?q=Brex+corporate+card+2026' },
          { rank: 12, name: 'Checkout.com',      ticker: 'Private',  mktcap: '~$110억',  detail: '글로벌 기업 결제 처리 — 대형 이커머스·마켓플레이스 특화, 150개 통화 지원, 결제 성공률 최적화', ir: 'https://checkout.com/company/newsroom', news: 'https://checkout.com/company/newsroom', x: 'https://x.com/search?q=Checkout.com+payment+2026' },
        ],
      },
    ],
  },

  {
    id: 'banking',
    layer: '🏦 은행 / 신용 인프라',
    components: [
      {
        id: 'neobank',
        icon: '📱',
        name: '네오뱅크 / 챌린저뱅크',
        desc: '모바일 퍼스트 디지털 은행',
        candidates: [
          { rank: 1,  name: 'Nubank',            ticker: 'NU',       mktcap: '~$700억',  detail: '라틴아메리카 최대 디지털 은행 — 브라질·멕시코·콜롬비아 1억 명 고객, 신용카드·저축·투자 통합 앱', ir: 'https://ir.nu.com.br', news: 'https://international.nubank.com.br/news', x: 'https://x.com/search?q=Nubank+neobank+2026' },
          { rank: 2,  name: 'Revolut',           ticker: 'Private',  mktcap: '~$450억',  detail: '유럽 최대 네오뱅크 — 50개국 4,000만 명 이상 고객, 환전·주식·암호화폐·여행보험 올인원 앱', ir: 'https://www.revolut.com/en-US/news', news: 'https://www.revolut.com/en-US/news', x: 'https://x.com/search?q=Revolut+neobank+2026' },
          { rank: 3,  name: 'Chime',             ticker: 'Private',  mktcap: '~$250억',  detail: '미국 최대 네오뱅크 — 무료 당좌계좌·조기 급여 수령, 2,200만+ 계좌, IPO 재추진 중', ir: 'https://www.chime.com/press', news: 'https://www.chime.com/press', x: 'https://x.com/search?q=Chime+neobank+IPO+2026' },
          { rank: 4,  name: 'SoFi Technologies', ticker: 'SOFI',     mktcap: '~$100억',  detail: '미국 디지털 금융 플랫폼 — 학자금·주택·개인 대출·투자·은행 서비스, 갈릴레오 결제 인프라 자회사', ir: 'https://investors.sofi.com', news: 'https://www.sofi.com/press-releases', x: 'https://x.com/search?q=SoFi+digital+bank+2026' },
          { rank: 5,  name: 'N26',               ticker: 'Private',  mktcap: '~$90억',   detail: '독일 네오뱅크 — 유럽 24개국 800만 고객, 완전 디지털 EU 은행 라이선스 보유', ir: 'https://n26.com/en-eu/blog/tag/press', news: 'https://n26.com/en-eu/blog/tag/press', x: 'https://x.com/search?q=N26+neobank+2026' },
          { rank: 6,  name: 'Monzo',             ticker: 'Private',  mktcap: '~$70억',   detail: '영국 네오뱅크 1위 — FCA 라이선스, 900만 개인·기업 고객, 대출·저축·투자 확장', ir: 'https://monzo.com/blog/2024', news: 'https://monzo.com/blog', x: 'https://x.com/search?q=Monzo+neobank+2026' },
          { rank: 7,  name: 'Starling Bank',     ticker: 'Private',  mktcap: '~$35억',   detail: '영국 네오뱅크·B2B 뱅킹 — 개인·SMB 계좌, Banking-as-a-Service 솔루션 타 핀테크에 제공', ir: 'https://www.starlingbank.com/news', news: 'https://www.starlingbank.com/news', x: 'https://x.com/search?q=Starling+Bank+neobank+2026' },
          { rank: 8,  name: 'Dave',              ticker: 'DAVE',     mktcap: '~$15억',   detail: '미국 초기 대출·금융 건강 앱 — 무이자 선불 $500 ExtraCash, AI 기반 지출 예측 서비스', ir: 'https://investors.dave.com', news: 'https://dave.com/newsroom', x: 'https://x.com/search?q=Dave+fintech+2026' },
          { rank: 9,  name: 'Bunq',              ticker: 'Private',  mktcap: '~$18억',   detail: '네덜란드 디지털 은행 — 탄소 발자국 추적·트리 심기 연동, EU 유목민 특화 다중계좌 서비스', ir: 'https://www.bunq.com/blog', news: 'https://www.bunq.com/blog', x: 'https://x.com/search?q=Bunq+neobank+2026' },
        ],
      },
      {
        id: 'lending',
        icon: '💰',
        name: '대출 / 인슈어테크',
        desc: 'AI 기반 신용평가·온라인 대출',
        candidates: [
          { rank: 1,  name: 'LoanDepot',         ticker: 'LDI',      mktcap: '~$10억',   detail: '미국 최대 비은행 모기지 대출사 중 하나 — AI 디지털 모기지 플랫폼, 금리 사이클 회복 수혜 기대', ir: 'https://ir.loandepot.com', news: 'https://www.loandepot.com/about/newsroom', x: 'https://x.com/search?q=LoanDepot+mortgage+2026' },
          { rank: 2,  name: 'Upstart',           ticker: 'UPST',     mktcap: '~$80억',   detail: 'AI 신용 평가 대출 플랫폼 — FICO 대신 AI·머신러닝 기반 2,500개 변수 활용, 자동차·주택 대출 확장', ir: 'https://ir.upstart.com', news: 'https://www.upstart.com/blog', x: 'https://x.com/search?q=Upstart+AI+lending+2026' },
          { rank: 3,  name: 'LendingClub',       ticker: 'LC',       mktcap: '~$25억',   detail: '미국 최초 P2P 대출 상장사 → 은행으로 전환 — 개인 대출·예금 통합 디지털 마켓플레이스 은행', ir: 'https://ir.lendingclub.com', news: 'https://www.lendingclub.com/info/press-room.action', x: 'https://x.com/search?q=LendingClub+lending+2026' },
          { rank: 4,  name: 'Oscar Health',      ticker: 'OSCR',     mktcap: '~$30억',   detail: '기술 기반 건강보험 — AI 가입자 매칭·디지털 진료 안내, ACA 시장 집중 인슈어테크 선두', ir: 'https://investors.hioscar.com', news: 'https://www.hioscar.com/blog', x: 'https://x.com/search?q=Oscar+Health+insurtech+2026' },
          { rank: 5,  name: 'Root Insurance',    ticker: 'ROOT',     mktcap: '~$15억',   detail: '운전 행동 기반 자동차 보험 — 스마트폰 센서로 운전 스타일 측정, 안전 운전자에 저렴한 보험료 제공', ir: 'https://ir.joinroot.com', news: 'https://www.joinroot.com/blog', x: 'https://x.com/search?q=Root+Insurance+insurtech+2026' },
          { rank: 6,  name: 'Hippo Holdings',    ticker: 'HIPO',     mktcap: '~$5억',    detail: 'AI 홈 보험 — IoT 센서 연동 예방적 홈 보험, 전통 보험 대비 5배 빠른 가입 프로세스', ir: 'https://ir.hippo.com', news: 'https://www.hippo.com/blog', x: 'https://x.com/search?q=Hippo+home+insurance+insurtech+2026' },
          { rank: 7,  name: 'Lemonade',          ticker: 'LMND',     mktcap: '~$20억',   detail: 'AI 기반 손해보험 — 챗봇 Maya가 90초 가입·3분 청구 처리, 주택·자동차·반려동물 보험, 기부 모델', ir: 'https://investors.lemonade.com', news: 'https://www.lemonade.com/blog', x: 'https://x.com/search?q=Lemonade+AI+insurance+2026' },
          { rank: 8,  name: 'Green Dot',         ticker: 'GDOT',     mktcap: '~$10억',   detail: '프리페이드 카드·Banking-as-a-Service — Walmart MoneyCard 파트너, 소외계층 금융 접근성 특화', ir: 'https://ir.greendot.com', news: 'https://www.greendot.com/about-us/news', x: 'https://x.com/search?q=Green+Dot+prepaid+fintech+2026' },
        ],
      },
    ],
  },

  {
    id: 'investment',
    layer: '📈 투자 / 자산관리 인프라',
    components: [
      {
        id: 'brokerage',
        icon: '🏛️',
        name: '리테일 브로커리지 / 투자 플랫폼',
        desc: '개인 투자 플랫폼·자산관리',
        candidates: [
          { rank: 1,  name: 'Charles Schwab',    ticker: 'SCHW',     mktcap: '~$1400억', detail: '미국 최대 리테일 브로커리지 — TD Ameritrade 합병, 무수수료 거래·은행·자산관리 통합 플랫폼', ir: 'https://www.aboutschwab.com/investor-relations', news: 'https://pressroom.aboutschwab.com', x: 'https://x.com/search?q=Charles+Schwab+brokerage+2026' },
          { rank: 2,  name: 'Fidelity Investments', ticker: 'Private', mktcap: 'N/A',    detail: '미국 최대 자산운용사 중 하나(비상장) — 뮤추얼펀드·ETF·리테일 브로커리지·401k 관리, $12조+ AUM', ir: 'https://www.fidelity.com/about-fidelity/our-company', news: 'https://newsroom.fidelity.com', x: 'https://x.com/search?q=Fidelity+Investments+2026' },
          { rank: 3,  name: 'Robinhood',         ticker: 'HOOD',     mktcap: '~$200억',  detail: '무수수료 리테일 투자 혁신 — 주식·옵션·크립토 통합, 24시간 거래·AI 투자 조언 기능 추가', ir: 'https://investors.robinhood.com', news: 'https://newsroom.robinhood.com', x: 'https://x.com/search?q=Robinhood+investing+2026' },
          { rank: 4,  name: 'eToro',             ticker: 'ETOR',     mktcap: '~$40억',   detail: '소셜 트레이딩 플랫폼 — 투자 복제 기능, 3,000만 명 사용자, 주식·크립토·CFD 통합', ir: 'https://www.etoro.com/news-and-analysis/etoro-news', news: 'https://www.etoro.com/news-and-analysis/etoro-news', x: 'https://x.com/search?q=eToro+social+trading+2026' },
          { rank: 5,  name: 'Interactive Brokers', ticker: 'IBKR',   mktcap: '~$700억',  detail: '프로 트레이더·기관 브로커리지 — 150개국 접속, 최저 수수료, API 트레이딩·마진 우수', ir: 'https://investors.ibkr.com', news: 'https://www.interactivebrokers.com/en/trading/news.php', x: 'https://x.com/search?q=InteractiveBrokers+trading+2026' },
          { rank: 6,  name: 'Betterment',        ticker: 'Private',  mktcap: '~$13억',   detail: '미국 최대 로보어드바이저 — 자동 포트폴리오 관리·세금 최적화, $450억+ AUM, 절세 중심 설계', ir: 'https://www.betterment.com/press', news: 'https://www.betterment.com/press', x: 'https://x.com/search?q=Betterment+robo+advisor+2026' },
          { rank: 7,  name: 'Wealthfront',       ticker: 'Private',  mktcap: '~$14억',   detail: '기술 중심 로보어드바이저 — Tax-Loss Harvesting 자동화, Direct Indexing 개인화 지수 투자', ir: 'https://www.wealthfront.com/about/news', news: 'https://www.wealthfront.com/about/news', x: 'https://x.com/search?q=Wealthfront+robo+advisor+2026' },
          { rank: 8,  name: 'Tradeweb',          ticker: 'TW',       mktcap: '~$350억',  detail: '전자채권·파생상품 거래 플랫폼 — 기관투자자 채권·금리 스왑·레포 전자거래, 일평균 $2조+ 거래', ir: 'https://ir.tradeweb.com', news: 'https://www.tradeweb.com/news', x: 'https://x.com/search?q=Tradeweb+bond+trading+2026' },
          { rank: 9,  name: 'MarketAxess',       ticker: 'MKTX',     mktcap: '~$80억',   detail: '회사채 전자거래 플랫폼 — 기관투자자 회사채·신흥국 채권 거래, Open Trading 프로토콜로 유동성 혁신', ir: 'https://ir.marketaxess.com', news: 'https://www.marketaxess.com/about/press-releases', x: 'https://x.com/search?q=MarketAxess+bond+trading+2026' },
          { rank: 10, name: 'Acorns',            ticker: 'Private',  mktcap: '~$20억',   detail: '마이크로 투자 앱 — 잔돈 자동 투자·자녀 투자 계좌, 1,000만 사용자, 구독 기반 핀테크', ir: 'https://www.acorns.com/blog', news: 'https://www.acorns.com/blog', x: 'https://x.com/search?q=Acorns+micro+investing+2026' },
        ],
      },
      {
        id: 'market_infra',
        icon: '🏗️',
        name: '거래소 / 시장 인프라',
        desc: '증권거래소·청산소·데이터',
        candidates: [
          { rank: 1,  name: 'CME Group',         ticker: 'CME',      mktcap: '~$850억',  detail: '세계 최대 파생상품 거래소 — 금리·에너지·농산물·FX·암호화폐 선물·옵션, 일평균 2,500만 계약', ir: 'https://investor.cmegroup.com', news: 'https://www.cmegroup.com/media-room/press-releases.html', x: 'https://x.com/search?q=CME+Group+derivatives+2026' },
          { rank: 2,  name: 'Intercontinental Exchange (ICE)', ticker: 'ICE', mktcap: '~$900억', detail: 'NYSE 모회사 — 증권·에너지·크립토 거래소 운영, Mortgage Technology 플랫폼(ICE Mortgage)까지 확장', ir: 'https://ir.theice.com', news: 'https://www.theice.com/about/media-room', x: 'https://x.com/search?q=ICE+NYSE+exchange+2026' },
          { rank: 3,  name: 'Nasdaq (Nasdaq Inc.)', ticker: 'NDAQ',  mktcap: '~$450억',  detail: 'Nasdaq 거래소·금융 기술 솔루션 — 거래소 외 위험관리·감시 기술 B2B SaaS로 수익 다각화', ir: 'https://ir.nasdaq.com', news: 'https://www.nasdaq.com/about/press-center', x: 'https://x.com/search?q=Nasdaq+exchange+technology+2026' },
          { rank: 4,  name: 'London Stock Exchange Group (LSEG)', ticker: 'LSEG.L', mktcap: '~$700억', detail: 'Refinitiv 인수로 금융 데이터 거대 기업 — 거래소·청산소·금융 데이터·Analytics 통합', ir: 'https://www.lseg.com/en/investor-relations', news: 'https://www.lseg.com/en/media-centre/press-releases', x: 'https://x.com/search?q=LSEG+financial+data+2026' },
          { rank: 5,  name: 'DTCC',              ticker: 'Private',  mktcap: 'N/A',      detail: '미국 증권 청산·결제 인프라 독점 — 연간 $2.5경 규모 주식·채권·파생상품 청산·결제 처리', ir: 'https://www.dtcc.com/news', news: 'https://www.dtcc.com/news', x: 'https://x.com/search?q=DTCC+clearing+settlement+2026' },
          { rank: 6,  name: 'Cboe Global Markets', ticker: 'CBOE',   mktcap: '~$230억',  detail: 'VIX·S&P500 옵션 거래소 — 주식·옵션·FX·크립토 거래소 운영, 24시간 주식 거래 추진', ir: 'https://ir.cboe.com', news: 'https://www.cboe.com/insights', x: 'https://x.com/search?q=Cboe+options+exchange+2026' },
          { rank: 7,  name: 'FactSet Research',  ticker: 'FDS',      mktcap: '~$200억',  detail: '기관투자자 금융 데이터·분석 플랫폼 — 포트폴리오 분석·ESG 데이터·리서치 통합, Bloomberg 경쟁자', ir: 'https://investor.factset.com', news: 'https://www.factset.com/press-releases', x: 'https://x.com/search?q=FactSet+financial+data+2026' },
          { rank: 8,  name: 'SS&C Technologies',  ticker: 'SSNC',    mktcap: '~$220억',  detail: '자산운용 기술·서비스 — 헤지펀드·사모펀드 운용관리 소프트웨어, Fund Administration 아웃소싱 1위', ir: 'https://ir.ssctech.com', news: 'https://www.ssctech.com/news', x: 'https://x.com/search?q=SSC+Technologies+asset+management+2026' },
        ],
      },
    ],
  },

  {
    id: 'crypto',
    layer: '🔗 블록체인 / 크립토',
    components: [
      {
        id: 'crypto_exchange',
        icon: '🪙',
        name: '크립토 거래소 / 수탁',
        desc: '디지털 자산 거래·보관 인프라',
        candidates: [
          { rank: 1,  name: 'Coinbase',          ticker: 'COIN',     mktcap: '~$700억',  detail: '미국 최대 상장 크립토 거래소 — 기관 수탁(Coinbase Custody)·스테이킹·Base L2 체인 운영', ir: 'https://investor.coinbase.com', news: 'https://www.coinbase.com/blog/category/company-news', x: 'https://x.com/search?q=Coinbase+crypto+exchange+2026' },
          { rank: 2,  name: 'Binance',           ticker: 'Private',  mktcap: 'N/A',      detail: '세계 최대 크립토 거래소(거래량 기준) — BNB Chain·Launchpad·바이낸스 카드 생태계, 규제 리스크 관리 중', ir: 'https://www.binance.com/en/blog', news: 'https://www.binance.com/en/blog', x: 'https://x.com/search?q=Binance+crypto+2026' },
          { rank: 3,  name: 'Kraken',            ticker: 'Private',  mktcap: '~$200억',  detail: '미국 2위 크립토 거래소 — 기관 서비스·크립토 은행 라이선스 추진, NinjaTrader 인수로 선물 확장', ir: 'https://blog.kraken.com/news', news: 'https://blog.kraken.com/news', x: 'https://x.com/search?q=Kraken+crypto+exchange+2026' },
          { rank: 4,  name: 'Gemini',            ticker: 'Private',  mktcap: '~$80억',   detail: 'Winklevoss 형제 설립 크립토 거래소 — NY DFS 규제 준수, 기관 수탁·이자 서비스, GUSD 스테이블코인', ir: 'https://www.gemini.com/blog', news: 'https://www.gemini.com/blog', x: 'https://x.com/search?q=Gemini+crypto+exchange+2026' },
          { rank: 5,  name: 'Bakkt',             ticker: 'BKKT',     mktcap: '~$5억',    detail: 'ICE 자회사 기관 크립토 플랫폼 — 비트코인 현물 선물 청산·디지털 자산 충성 포인트 통합', ir: 'https://ir.bakkt.com', news: 'https://www.bakkt.com/news', x: 'https://x.com/search?q=Bakkt+crypto+institutional+2026' },
          { rank: 6,  name: 'Fireblocks',        ticker: 'Private',  mktcap: '~$80억',   detail: '기관용 디지털 자산 인프라 — MPC 지갑 기술, 1,800+ 기관 고객, 크립토 이전·결제·DeFi 연결', ir: 'https://www.fireblocks.com/blog', news: 'https://www.fireblocks.com/blog', x: 'https://x.com/search?q=Fireblocks+digital+asset+custody+2026' },
          { rank: 7,  name: 'Chainalysis',       ticker: 'Private',  mktcap: '~$85억',   detail: '블록체인 데이터 분석·컴플라이언스 — 정부·거래소 KYC/AML 솔루션, 온체인 거래 추적 1위', ir: 'https://www.chainalysis.com/blog', news: 'https://www.chainalysis.com/blog', x: 'https://x.com/search?q=Chainalysis+blockchain+analytics+2026' },
          { rank: 8,  name: 'Ripple (XRP)',      ticker: 'Private',  mktcap: '~$300억',  detail: 'XRP Ledger 기반 국제 송금 솔루션 — RippleNet 은행 파트너십, On-Demand Liquidity 서비스', ir: 'https://ripple.com/insights', news: 'https://ripple.com/insights', x: 'https://x.com/search?q=Ripple+XRP+payment+2026' },
          { rank: 9,  name: 'Circle Internet',   ticker: 'Private',  mktcap: '~$50억',   detail: 'USDC 스테이블코인 발행사 — $45억+ USDC 발행, 결제·DeFi·B2B 송금 인프라, IPO 준비 중', ir: 'https://www.circle.com/blog', news: 'https://www.circle.com/blog', x: 'https://x.com/search?q=Circle+USDC+stablecoin+2026' },
          { rank: 10, name: 'Tether (USDT)',     ticker: 'Private',  mktcap: 'N/A',      detail: '세계 최대 스테이블코인 USDT 발행 — $1,000억+ 유통, 글로벌 암호화폐 결제·유동성 기반 인프라', ir: 'https://tether.to/en/news', news: 'https://tether.to/en/news', x: 'https://x.com/search?q=Tether+USDT+stablecoin+2026' },
          { rank: 11, name: 'MicroStrategy (Strategy)', ticker: 'MSTR', mktcap: '~$1000억', detail: '비트코인 기업 재무 전략 선구자 — 50만 BTC+ 보유, 주식 발행으로 BTC 축적, 기업 BTC 트렌드 선도', ir: 'https://www.microstrategy.com/en/investor-relations', news: 'https://www.microstrategy.com/en/newsroom', x: 'https://x.com/search?q=MicroStrategy+Bitcoin+2026' },
          { rank: 12, name: 'Galaxy Digital',   ticker: 'GLXY.TO',  mktcap: '~$80억',   detail: '기관 크립토 금융 서비스 — 트레이딩·자산관리·투자은행·마이닝 토탈 솔루션, 미국 상장 전환 추진', ir: 'https://ir.galaxydigital.com', news: 'https://www.galaxy.com/news', x: 'https://x.com/search?q=Galaxy+Digital+crypto+2026' },
        ],
      },
    ],
  },

  {
    id: 'ai_finance',
    layer: '🤖 AI 금융 / 데이터 인프라',
    components: [
      {
        id: 'financial_data',
        icon: '📊',
        name: '금융 데이터 / 정보 인프라',
        desc: '시장 데이터·분석·터미널',
        candidates: [
          { rank: 1,  name: 'Bloomberg L.P.',    ticker: 'Private',  mktcap: 'N/A',      detail: '금융 정보 터미널·뉴스 1위(비상장) — Bloomberg Terminal 33만 구독, 연매출 $140억+, AI 기능 통합 중', ir: 'https://www.bloomberg.com/company', news: 'https://www.bloomberg.com/company/press', x: 'https://x.com/search?q=Bloomberg+terminal+AI+2026' },
          { rank: 2,  name: 'Morningstar',       ticker: 'MORN',     mktcap: '~$150억',  detail: '투자 리서치·데이터 — 펀드 등급·ESG 평가·크레딧 분석, PitchBook(VC 데이터)·DBRS 신용평가 자회사', ir: 'https://shareholders.morningstar.com', news: 'https://newsroom.morningstar.com', x: 'https://x.com/search?q=Morningstar+investment+research+2026' },
          { rank: 3,  name: 'MSCI Inc.',         ticker: 'MSCI',     mktcap: '~$550억',  detail: '글로벌 지수 및 분석 — MSCI World·EM 지수, ESG·기후 리스크 분석, Blackrock 패시브 자금 기반', ir: 'https://ir.msci.com', news: 'https://www.msci.com/news', x: 'https://x.com/search?q=MSCI+index+ESG+2026' },
          { rank: 4,  name: 'S&P Global',        ticker: 'SPGI',     mktcap: '~$1600억', detail: '신용평가·금융 데이터·지수 — S&P500 지수, Platts 에너지 데이터, Market Intelligence AI 통합', ir: 'https://investor.spglobal.com', news: 'https://www.spglobal.com/en/news-insights', x: 'https://x.com/search?q=SPGlobal+financial+data+2026' },
          { rank: 5,  name: "Moody's",           ticker: 'MCO',      mktcap: '~$900억',  detail: '신용평가·리스크 분석 — S&P와 양대 신용평가사, Moody\'s Analytics AI 리스크 모델링 확장', ir: 'https://ir.moodys.com', news: 'https://www.moodys.com/newsandevents', x: 'https://x.com/search?q=Moodys+credit+rating+AI+2026' },
          { rank: 6,  name: 'Verisk Analytics',  ticker: 'VRSK',     mktcap: '~$400억',  detail: '보험·에너지·금융 데이터 분석 — 보험사 리스크 평가 데이터 독점, AI 기반 자연재해 모델링', ir: 'https://ir.verisk.com', news: 'https://www.verisk.com/news', x: 'https://x.com/search?q=Verisk+insurance+data+2026' },
          { rank: 7,  name: 'Broadridge Financial', ticker: 'BR',    mktcap: '~$350억',  detail: '금융 서비스 기술 솔루션 — 주주총회 의결권·증권 처리·자산관리 백오피스, 업계 표준 인프라', ir: 'https://ir.broadridge.com', news: 'https://www.broadridge.com/news', x: 'https://x.com/search?q=Broadridge+financial+technology+2026' },
          { rank: 8,  name: 'ION Group',         ticker: 'Private',  mktcap: '~$350억',  detail: '자본시장 거래 기술 솔루션 — 채권·파생상품·외환 트레이딩 시스템, M&A 공격적 확장 전략', ir: 'https://iongroup.com/news', news: 'https://iongroup.com/news', x: 'https://x.com/search?q=ION+Group+capital+markets+technology' },
        ],
      },
      {
        id: 'ai_fintech',
        icon: '🧠',
        name: 'AI 금융 기술 / 레그테크',
        desc: 'AI 트레이딩·RegTech·사기탐지',
        candidates: [
          { rank: 1,  name: 'Palantir',          ticker: 'PLTR',     mktcap: '~$2000억', detail: '금융 AI 데이터 플랫폼 — AI Platform(AIP) 은행·보험사 도입 급증, 사기탐지·AML·위험관리 솔루션', ir: 'https://investors.palantir.com', news: 'https://www.palantir.com/newsroom', x: 'https://x.com/search?q=Palantir+AI+finance+2026' },
          { rank: 2,  name: 'Plaid',             ticker: 'Private',  mktcap: '~$60억',   detail: '오픈뱅킹 금융 데이터 연결 인프라 — 8,000+ 앱·7,000+ 금융기관 연결, Visa 인수 무산 후 독자 성장', ir: 'https://plaid.com/blog', news: 'https://plaid.com/blog', x: 'https://x.com/search?q=Plaid+open+banking+2026' },
          { rank: 3,  name: 'Blend Labs',        ticker: 'BLND',     mktcap: '~$5억',    detail: '모기지·소비자 대출 디지털 플랫폼 — 은행용 AI 대출 심사 워크플로우, Wells Fargo 등 대형 은행 파트너', ir: 'https://ir.blend.com', news: 'https://blend.com/company/press', x: 'https://x.com/search?q=Blend+Labs+mortgage+AI+2026' },
          { rank: 4,  name: 'Temenos',           ticker: 'TEMN.SW',  mktcap: '~$50억',   detail: '은행 코어 뱅킹 소프트웨어 1위 — 전 세계 3,000+ 은행 코어 시스템 공급, SaaS 전환 중', ir: 'https://www.temenos.com/investors', news: 'https://www.temenos.com/news', x: 'https://x.com/search?q=Temenos+core+banking+2026' },
          { rank: 5,  name: 'Mambu',             ticker: 'Private',  mktcap: '~$55억',   detail: '클라우드 네이티브 코어 뱅킹 SaaS — 구성 가능한 API 기반 뱅킹 플랫폼, 핀테크·네오뱅크 인프라', ir: 'https://www.mambu.com/newsroom', news: 'https://www.mambu.com/newsroom', x: 'https://x.com/search?q=Mambu+cloud+banking+platform+2026' },
          { rank: 6,  name: 'Featurespace',      ticker: 'Private',  mktcap: '~$10억',   detail: 'AI 사기 탐지·AML — 적응적 머신러닝(ARIC 엔진), Visa 인수, 실시간 트랜잭션 이상 탐지', ir: 'https://www.featurespace.com/newsroom', news: 'https://www.featurespace.com/newsroom', x: 'https://x.com/search?q=Featurespace+fraud+detection+AI+2026' },
          { rank: 7,  name: 'ComplyAdvantage',   ticker: 'Private',  mktcap: '~$10억',   detail: 'AI 기반 AML·컴플라이언스 데이터 — 실시간 제재·PEP·부정거래 스크리닝, 은행 RegTech 자동화', ir: 'https://complyadvantage.com/blog', news: 'https://complyadvantage.com/blog', x: 'https://x.com/search?q=ComplyAdvantage+AML+RegTech+2026' },
          { rank: 8,  name: 'Quantexa',          ticker: 'Private',  mktcap: '~$19억',   detail: '네트워크 분석 AI — 금융범죄·사기·고객 인텔리전스, 거래 패턴 그래프 AI 분석 플랫폼', ir: 'https://www.quantexa.com/blog', news: 'https://www.quantexa.com/blog', x: 'https://x.com/search?q=Quantexa+AI+financial+crime+2026' },
          { rank: 9,  name: 'Symphony AyasdiAI', ticker: 'Private',  mktcap: 'N/A',      detail: '토폴로지 데이터 분석 — AML 자동화·거래 모니터링, 대형 은행 RegTech 솔루션 공급', ir: 'https://www.ayasdi.com/news', news: 'https://www.ayasdi.com/news', x: 'https://x.com/search?q=Ayasdi+AI+AML+compliance' },
          { rank: 10, name: 'Kensho (S&P Global)', ticker: 'SPGI',   mktcap: 'N/A(자회사)', detail: 'S&P Global AI 자회사 — 자연어 처리·ML 기반 금융 분석, 뉴스→시장 영향 자동 분석', ir: 'https://www.kensho.com/news', news: 'https://www.kensho.com/news', x: 'https://x.com/search?q=Kensho+AI+finance+SPGlobal' },
          { rank: 11, name: 'Two Sigma',         ticker: 'Private',  mktcap: 'N/A',      detail: '퀀트 헤지펀드 AI 선두 — 데이터 과학·ML 기반 체계적 투자, $600억+ AUM, AI 리서치 발표 활발', ir: 'https://www.twosigma.com/insights', news: 'https://www.twosigma.com/insights', x: 'https://x.com/search?q=Two+Sigma+quant+AI+finance' },
        ],
      },
    ],
  },
];

// 핀테크 섹터 국적 플래그
export const FINTECH_FLAG_BY_NAME = {
  // 🇺🇸 미국
  'Visa': '🇺🇸', 'Mastercard': '🇺🇸', 'American Express': '🇺🇸',
  'Stripe': '🇺🇸', 'Fiserv': '🇺🇸', 'FIS (Worldpay)': '🇺🇸',
  'Global Payments': '🇺🇸', 'PayPal': '🇺🇸', 'Square (Block)': '🇺🇸',
  'Shopify Payments': '🇨🇦', 'Affirm': '🇺🇸', 'Brex': '🇺🇸', 'Checkout.com': '🇬🇧',
  'Nubank': '🇧🇷', 'Chime': '🇺🇸', 'SoFi Technologies': '🇺🇸',
  'LoanDepot': '🇺🇸', 'Upstart': '🇺🇸', 'LendingClub': '🇺🇸',
  'Oscar Health': '🇺🇸', 'Root Insurance': '🇺🇸', 'Hippo Holdings': '🇺🇸', 'Lemonade': '🇺🇸',
  'Green Dot': '🇺🇸',
  'Charles Schwab': '🇺🇸', 'Fidelity Investments': '🇺🇸', 'Robinhood': '🇺🇸',
  'Interactive Brokers': '🇺🇸', 'Betterment': '🇺🇸', 'Wealthfront': '🇺🇸',
  'Tradeweb': '🇺🇸', 'MarketAxess': '🇺🇸', 'Acorns': '🇺🇸',
  'CME Group': '🇺🇸', 'Intercontinental Exchange (ICE)': '🇺🇸', 'Nasdaq (Nasdaq Inc.)': '🇺🇸',
  'Cboe Global Markets': '🇺🇸', 'FactSet Research': '🇺🇸', 'SS&C Technologies': '🇺🇸',
  'DTCC': '🇺🇸',
  'Coinbase': '🇺🇸', 'Bakkt': '🇺🇸', 'Fireblocks': '🇺🇸', 'Chainalysis': '🇺🇸',
  'Gemini': '🇺🇸', 'Circle Internet': '🇺🇸',
  'MicroStrategy (Strategy)': '🇺🇸',
  'Bloomberg L.P.': '🇺🇸', 'Morningstar': '🇺🇸', 'MSCI Inc.': '🇺🇸',
  'S&P Global': '🇺🇸', "Moody's": '🇺🇸', 'Verisk Analytics': '🇺🇸',
  'Broadridge Financial': '🇺🇸',
  'Palantir': '🇺🇸', 'Plaid': '🇺🇸', 'Blend Labs': '🇺🇸',
  'Featurespace': '🇬🇧', 'Two Sigma': '🇺🇸',
  'Kensho (S&P Global)': '🇺🇸',
  // 🇬🇧 영국
  'Revolut': '🇬🇧', 'Monzo': '🇬🇧', 'Starling Bank': '🇬🇧',
  // 🇩🇪 독일
  'N26': '🇩🇪',
  // 🇳🇱 네덜란드
  'Adyen': '🇳🇱', 'Bunq': '🇳🇱',
  // 🇸🇪 스웨덴
  'Klarna': '🇸🇪',
  // 🇨🇳 중국
  'UnionPay (CUP)': '🇨🇳',
  // 🇧🇷 브라질
  'Discover Financial': '🇺🇸',
  // 🇨🇦 캐나다
  'Galaxy Digital': '🇨🇦',
  // 🇬🇧 영국 (ION)
  'ION Group': '🇬🇧',
  // 🇨🇭 스위스
  'Temenos': '🇨🇭',
  // 🇬🇧 영국
  'ComplyAdvantage': '🇬🇧', 'Quantexa': '🇬🇧', 'Symphony AyasdiAI': '🇺🇸',
  // 🇦🇺 호주
  'Mambu': '🇳🇱',
  // 국제 (크립토)
  'Binance': '🌐', 'Kraken': '🇺🇸', 'Ripple (XRP)': '🇺🇸',
  'Tether (USDT)': '🌐',
  // 이토로
  'eToro': '🇮🇱',
  // Dave
  'Dave': '🇺🇸',
  // LSEG
  'London Stock Exchange Group (LSEG)': '🇬🇧',
};
