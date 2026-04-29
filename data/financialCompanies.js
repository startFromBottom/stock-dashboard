// 금융(Financial Services) 섹터 밸류체인 데이터 (2026년 기준)
// 밸류체인: 대형 은행 → 자산운용·증권 → 보험 → 결제 네트워크 → 거래소·인프라
// 핀테크와 별도: 핀테크는 신생 디지털 금융, 본 섹터는 전통 금융 메이저

export const FINANCIAL_LAYERS = [
  // ─── 레이어 1: 대형 은행 ───────────────────────────
  {
    id: 'banks',
    layer: '🏦 대형 은행 (Universal Banks)',
    components: [
      {
        id: 'big_banks',
        icon: '🏦',
        name: '글로벌 대형 은행',
        desc: '예금·대출·IB·트레이딩 통합 종합금융',
        detail: [
          '미국 대형 은행 4강(JPM·BAC·WFC·C)이 미국 예금·대출의 50% 이상을 차지한다. 이들은 소매뱅킹(예금·카드·주택담보)부터 투자은행(IB·트레이딩)·자산관리까지 수직통합한 universal bank 모델을 운영한다. 금리 사이클의 정점에서 순이자마진(NIM)이 두꺼워져 영업이익이 폭발적으로 증가하며, 매 분기 어닝 시즌의 시작은 늘 JPM이 알린다.',
          '2008 금융위기 이후 도입된 강화된 자본규제(Basel III, SLR, Stress Test)로 자기자본비율은 매우 견고해졌다. 2024년부터 이어진 고금리·강달러 환경 + 트레이딩 호황으로 대형 은행들의 ROE는 15%+ 수준 회복. JPM의 트레이딩·IB 부문은 GS·MS와 함께 월스트리트 정점을 형성한다.',
        ],
        candidates: [
          { rank: 1,  name: 'JPMorgan Chase',          ticker: 'JPM',  mktcap: '~$6,500억', detail: '미국 1위 종합금융. 자산 $4조+. 트레이딩·IB·소매·자산관리 균형. Jamie Dimon CEO 영향력 절대적. 어닝 시즌 시작', ir: 'https://www.jpmorganchase.com/ir', news: 'https://www.jpmorganchase.com/news', x: 'https://x.com/search?q=JPMorgan+JPM+2026' },
          { rank: 2,  name: 'Bank of America',         ticker: 'BAC',  mktcap: '~$3,500억', detail: '미국 2위 — 소매뱅킹 1위. Merrill Lynch 자산관리. Buffett 핵심 보유주. 금리 민감도 가장 큼', ir: 'https://investor.bankofamerica.com', news: 'https://newsroom.bankofamerica.com', x: 'https://x.com/search?q=BankofAmerica+BAC+2026' },
          { rank: 3,  name: 'Wells Fargo',             ticker: 'WFC',  mktcap: '~$2,400억', detail: '미국 3위 — 소매·주택담보 강자. 2018 자산상한 규제 해제 후 회복 본격화', ir: 'https://www.wellsfargo.com/about/investor-relations/', news: 'https://newsroom.wf.com', x: 'https://x.com/search?q=WellsFargo+WFC+2026' },
          { rank: 4,  name: 'Citigroup',               ticker: 'C',    mktcap: '~$1,500억', detail: '미국 4위 — 글로벌 트레이딩·기업금융. Jane Fraser CEO 구조조정 진행. 반등 기대주', ir: 'https://www.citigroup.com/global/investors', news: 'https://www.citigroup.com/global/news', x: 'https://x.com/search?q=Citigroup+C+2026' },
          { rank: 5,  name: 'HSBC',                    ticker: 'HSBC', mktcap: '~$2,000억', detail: '영국 본사·아시아 비중 큼. 글로벌 무역금융 강자. 중국 부동산 노출 부담', ir: 'https://www.hsbc.com/investors', news: 'https://www.hsbc.com/news-and-views', x: 'https://x.com/search?q=HSBC+2026' },
          { rank: 6,  name: 'Royal Bank of Canada',    ticker: 'RY',   mktcap: '~$1,800억', detail: '캐나다 1위 은행. 안정적 자본구조·고배당. 미국 진출(City National Bank) 확대', ir: 'https://www.rbc.com/investor-relations/', news: 'https://www.rbc.com/newsroom/', x: 'https://x.com/search?q=RBC+RoyalBankCanada+2026' },
          { rank: 7,  name: 'Toronto-Dominion Bank',   ticker: 'TD',   mktcap: '~$1,200억', detail: '캐나다 2위. TD Ameritrade 매각 후 미국 소매뱅킹 집중. AML 벌금 부담 일단락', ir: 'https://www.td.com/investors/', news: 'https://stories.td.com', x: 'https://x.com/search?q=TDBank+2026' },
          { rank: 8,  name: 'PNC Financial',           ticker: 'PNC',  mktcap: '~$800억', detail: '미국 슈퍼리저널 은행. BBVA 미국 인수로 6대 대형 은행 합류. 동·중부 강함', ir: 'https://www.pnc.com/en/about-pnc/corporate-information/investor-relations.html', news: 'https://www.pnc.com/en/about-pnc/news.html', x: 'https://x.com/search?q=PNC+Financial+2026' },
          { rank: 9,  name: 'U.S. Bancorp',            ticker: 'USB',  mktcap: '~$700억', detail: '미국 5위 슈퍼리저널. Union Bank 인수로 서부 확장. 결제·신용카드 비중도 큼', ir: 'https://ir.usbank.com', news: 'https://www.usbank.com/about-us-bank/company-blog/news.html', x: 'https://x.com/search?q=USBancorp+USB+2026' },
          { rank: 10, name: 'Truist Financial',        ticker: 'TFC',  mktcap: '~$580억', detail: 'BB&T·SunTrust 합병으로 출범. 동남부 슈퍼리저널. 보험 자회사 매각으로 자본 확충', ir: 'https://ir.truist.com', news: 'https://media.truist.com', x: 'https://x.com/search?q=Truist+TFC+2026' },
          { rank: 11, name: 'Capital One',             ticker: 'COF',  mktcap: '~$700억', detail: '미국 신용카드·소매뱅킹 메이저. Discover 인수 진행 중 — 결제 네트워크 통합', ir: 'https://investor.capitalone.com', news: 'https://www.capitalone.com/about/newsroom/', x: 'https://x.com/search?q=CapitalOne+COF+2026' },
          { rank: 12, name: 'Mitsubishi UFJ',          ticker: 'MUFG', mktcap: '~$1,400억', detail: '일본 1위 종합금융. Morgan Stanley 23% 보유. 글로벌 IB·자산관리 확장', ir: 'https://www.mufg.jp/english/ir/', news: 'https://www.mufg.jp/english/news/', x: 'https://x.com/search?q=MUFG+2026' },
        ],
      },
    ],
  },

  // ─── 레이어 2: 자산운용 / 증권 ─────────────────────
  {
    id: 'asset_management',
    layer: '💼 자산운용 / 증권 (IB·Wealth)',
    components: [
      {
        id: 'asset_managers',
        icon: '📊',
        name: '자산운용 / 증권',
        desc: '뮤추얼펀드·ETF·헤지펀드·증권사·IB',
        detail: [
          '자산운용 산업은 BlackRock·Vanguard 양강이 글로벌 ETF 시장의 60% 이상을 점유한다. BLK는 iShares ETF 시리즈로 운용자산(AUM) $11조+, Vanguard(비상장)는 $9조+. 두 회사의 ETF 자금 유입이 시장 흐름의 선행 지표로 사용된다. 한편 BX(Blackstone)는 사모펀드·부동산·신용 분야 글로벌 1위 대안투자.',
          '증권·IB는 골드만삭스(GS)·모건스탠리(MS)가 월스트리트 정점. GS는 트레이딩·M&A 자문 강자, MS는 자산관리(Wealth Management) 비중 70%+로 안정성 확보. SCHW(Charles Schwab)는 개인투자자 증권·뮤추얼펀드 인프라.',
        ],
        candidates: [
          { rank: 1,  name: 'Berkshire Hathaway',      ticker: 'BRK.B', mktcap: '~$1조', detail: 'Buffett 콘글로머리트 — 보험(GEICO)·철도(BNSF)·에너지·소비재 다각화. 현금 $3,000억+ 보유', ir: 'https://www.berkshirehathaway.com', news: 'https://www.berkshirehathaway.com/news/news.html', x: 'https://x.com/search?q=Berkshire+Hathaway+2026' },
          { rank: 2,  name: 'BlackRock',               ticker: 'BLK',  mktcap: '~$1,400억', detail: '세계 최대 자산운용사 — AUM $11조+. iShares ETF 시리즈. Aladdin 리스크 관리 플랫폼 산업표준', ir: 'https://ir.blackrock.com', news: 'https://www.blackrock.com/corporate/newsroom', x: 'https://x.com/search?q=BlackRock+2026' },
          { rank: 3,  name: 'Goldman Sachs',           ticker: 'GS',   mktcap: '~$1,800억', detail: '월스트리트 IB 1위. 트레이딩·M&A·IPO 자문. 자산관리(Marcus) 확장 중', ir: 'https://www.goldmansachs.com/investor-relations/', news: 'https://www.goldmansachs.com/insights/', x: 'https://x.com/search?q=GoldmanSachs+GS+2026' },
          { rank: 4,  name: 'Morgan Stanley',          ticker: 'MS',   mktcap: '~$1,800억', detail: 'Wealth Management 비중 70%+ — 안정 수익 모델. E*TRADE 인수로 디지털 자산관리 확대', ir: 'https://www.morganstanley.com/about-us-ir', news: 'https://www.morganstanley.com/press-releases', x: 'https://x.com/search?q=MorganStanley+MS+2026' },
          { rank: 5,  name: 'Charles Schwab',          ticker: 'SCHW', mktcap: '~$1,300억', detail: '개인투자자 증권·뮤추얼펀드 인프라. AUM $9조+. TD Ameritrade 합병 시너지. 무수수료 모델 선구자', ir: 'https://www.aboutschwab.com/investor-relations', news: 'https://www.aboutschwab.com/news', x: 'https://x.com/search?q=CharlesSchwab+SCHW+2026' },
          { rank: 6,  name: 'Blackstone',              ticker: 'BX',   mktcap: '~$2,000억', detail: '글로벌 1위 사모펀드·대안투자. AUM $1조+. 부동산·신용·인프라·헤지펀드 다각화', ir: 'https://ir.blackstone.com', news: 'https://www.blackstone.com/news/', x: 'https://x.com/search?q=Blackstone+BX+2026' },
          { rank: 7,  name: 'KKR',                     ticker: 'KKR',  mktcap: '~$1,200억', detail: 'PE 글로벌 2위. 보험(Global Atlantic) 인수 후 영구자본 확보. 인프라·신용 부문 강세', ir: 'https://ir.kkr.com', news: 'https://www.kkr.com/news', x: 'https://x.com/search?q=KKR+2026' },
          { rank: 8,  name: 'Apollo Global',           ticker: 'APO',  mktcap: '~$1,000억', detail: '신용·보험·PE. Athene Holdings(연금) 인수로 자산 기반 강화. 사모 신용 시장 1위', ir: 'https://www.apollo.com/investors', news: 'https://www.apollo.com/insights-news/', x: 'https://x.com/search?q=ApolloGlobal+APO+2026' },
          { rank: 9,  name: 'Brookfield',              ticker: 'BN',   mktcap: '~$1,000억', detail: '캐나다 — 부동산·인프라·재생에너지 글로벌 대안투자. Brookfield Asset Management(BAM) 자회사', ir: 'https://bn.brookfield.com', news: 'https://bn.brookfield.com/press-releases', x: 'https://x.com/search?q=Brookfield+BN+2026' },
          { rank: 10, name: 'T. Rowe Price',           ticker: 'TROW', mktcap: '~$280억', detail: '뮤추얼펀드 액티브 운용 메이저. AUM $1.5조. 펀드매니저 정평. 패시브 압박에 마진 압축', ir: 'https://investor.troweprice.com', news: 'https://www.troweprice.com/corporate/us/en/news.html', x: 'https://x.com/search?q=TRowePrice+TROW+2026' },
          { rank: 11, name: 'Ameriprise Financial',    ticker: 'AMP',  mktcap: '~$500억', detail: '재무설계·자산관리 전문. AUM $1.5조. RIA 채널 1위. Columbia Threadneedle 운용', ir: 'https://ir.ameriprise.com', news: 'https://newsroom.ameriprise.com', x: 'https://x.com/search?q=Ameriprise+AMP+2026' },
          { rank: 12, name: 'Raymond James',           ticker: 'RJF',  mktcap: '~$300억', detail: '미국 독립 IB·자산관리. 약 8,700명 RIA·증권사 네트워크. Tradition·디지털 통합', ir: 'https://www.raymondjames.com/our-company/about-us/investor-relations', news: 'https://www.raymondjames.com/news', x: 'https://x.com/search?q=RaymondJames+RJF+2026' },
        ],
      },
    ],
  },

  // ─── 레이어 3: 보험 ─────────────────────────────────
  {
    id: 'insurance',
    layer: '🛡️ 보험 (P&C·Life·Health)',
    components: [
      {
        id: 'insurers',
        icon: '🛡️',
        name: '보험',
        desc: '재산·생명·건강·재보험',
        detail: [
          '보험 산업은 P&C(Property & Casualty: 자동차·주택), Life(생명), Health(건강), Reinsurance(재보험) 4분야로 나뉜다. P&C 글로벌 1위는 Berkshire의 GEICO, Progressive(PGR)·Allstate(ALL)가 미국 자동차 보험 양강. 건강보험은 UNH(UnitedHealth)가 압도적 1위 — 보험·약국 PBM·의료서비스 수직통합.',
          '재보험(보험사를 위한 보험)은 Munich Re, Swiss Re가 글로벌 양강. 기후 변화로 자연재해 보험금 청구가 급증하면서 재보험료가 매년 두 자릿수 상승. AI·자율주행으로 자동차 보험 시장은 장기적으로 축소 위험.',
        ],
        candidates: [
          { rank: 1,  name: 'UnitedHealth Group',       ticker: 'UNH',  mktcap: '~$5,000억', detail: '미국 1위 건강보험. UnitedHealthcare(보험)+Optum(약국 PBM·의료서비스) 수직통합. Medicare·Medicaid 매출 비중 큼', ir: 'https://www.unitedhealthgroup.com/investors.html', news: 'https://www.unitedhealthgroup.com/newsroom.html', x: 'https://x.com/search?q=UnitedHealth+UNH+2026' },
          { rank: 2,  name: 'Berkshire Hathaway',       ticker: 'BRK.B', mktcap: '~$1조', detail: '보험 부문 — GEICO(자동차)·Berkshire Hathaway Reinsurance·General Re. P&C+재보험 통합', ir: 'https://www.berkshirehathaway.com', news: 'https://www.berkshirehathaway.com/news/news.html', x: 'https://x.com/search?q=Berkshire+GEICO+2026' },
          { rank: 3,  name: 'Progressive',              ticker: 'PGR',  mktcap: '~$1,500억', detail: '미국 자동차 보험 2위. Snapshot 텔레매틱스 선구자. AI·데이터 기반 가격책정 강자', ir: 'https://investors.progressive.com', news: 'https://progressive.mediaroom.com', x: 'https://x.com/search?q=Progressive+PGR+2026' },
          { rank: 4,  name: 'Chubb',                    ticker: 'CB',   mktcap: '~$1,200억', detail: 'P&C 글로벌 — 상업보험 메이저. Buffett 보유주. 사이버보험·기후재해 노출 관리', ir: 'https://investors.chubb.com', news: 'https://news.chubb.com', x: 'https://x.com/search?q=Chubb+insurance+2026' },
          { rank: 5,  name: 'Elevance Health',          ticker: 'ELV',  mktcap: '~$1,000억', detail: '미국 건강보험 2위(구 Anthem). Blue Cross Blue Shield 14개 주 라이선스. PBM·의료서비스 통합', ir: 'https://ir.elevancehealth.com', news: 'https://www.elevancehealth.com/newsroom', x: 'https://x.com/search?q=Elevance+Health+ELV+2026' },
          { rank: 6,  name: 'CIGNA',                    ticker: 'CI',   mktcap: '~$900억', detail: '글로벌 건강보험. Express Scripts 약국 PBM 통합. UNH/CVS와 미국 PBM 3강', ir: 'https://investors.cigna.com', news: 'https://www.cigna.com/about-us/newsroom', x: 'https://x.com/search?q=CIGNA+CI+2026' },
          { rank: 7,  name: 'Allstate',                 ticker: 'ALL',  mktcap: '~$500억', detail: '미국 자동차·주택 보험 메이저. AAII·Esurance·Squaretrade 다각화', ir: 'https://www.allstate.com/about/financial-investor-information.aspx', news: 'https://www.allstatenewsroom.com', x: 'https://x.com/search?q=Allstate+ALL+2026' },
          { rank: 8,  name: 'AIG',                      ticker: 'AIG',  mktcap: '~$500억', detail: '미국 글로벌 보험. 2008 위기 후 회복. P&C 상업보험·재보험 집중. Corebridge(생명) 분사', ir: 'https://www.aig.com/investors', news: 'https://www.aig.com/about-us/news', x: 'https://x.com/search?q=AIG+insurance+2026' },
          { rank: 9,  name: 'MetLife',                  ticker: 'MET',  mktcap: '~$700억', detail: '미국 생명보험 메이저. 단체보험·연금·자산관리. 일본·중남미 진출', ir: 'https://investor.metlife.com', news: 'https://www.metlife.com/about-us/newsroom/', x: 'https://x.com/search?q=MetLife+MET+2026' },
          { rank: 10, name: 'Prudential Financial',     ticker: 'PRU',  mktcap: '~$420억', detail: '미국 생명보험·연금 메이저. PGIM 자산운용 자회사 AUM $1.4조. 일본·아시아 비중 큼', ir: 'https://www.prudential.com/investors', news: 'https://news.prudential.com', x: 'https://x.com/search?q=Prudential+PRU+2026' },
          { rank: 11, name: 'Travelers Companies',      ticker: 'TRV',  mktcap: '~$580억', detail: '미국 P&C 보험 — 상업·개인 자동차·주택. 사이버보험 확장. Buffett 과거 보유', ir: 'https://investor.travelers.com', news: 'https://investor.travelers.com/news/default.aspx', x: 'https://x.com/search?q=Travelers+TRV+2026' },
          { rank: 12, name: 'Munich Re',                ticker: 'MURGY', mktcap: '~$700억', detail: '독일 — 글로벌 재보험 1위. 자연재해·생명재보험. 기후 변화 리스크 노출 가장 큼', ir: 'https://www.munichre.com/en/company/investors.html', news: 'https://www.munichre.com/en/company/media-relations.html', x: 'https://x.com/search?q=MunichRe+2026' },
        ],
      },
    ],
  },

  // ─── 레이어 4: 결제 네트워크 ───────────────────────
  {
    id: 'payments',
    layer: '💳 결제 네트워크 (Card·Network)',
    components: [
      {
        id: 'card_networks',
        icon: '💳',
        name: '카드 네트워크 / 결제 메이저',
        desc: '글로벌 카드·결제 처리 네트워크',
        detail: [
          '결제 네트워크 산업은 Visa·Mastercard 양강이 글로벌 카드 결제의 90% 이상을 처리한다. 두 회사 모두 거래마다 일부 수수료(interchange fee)를 가져가는 "디지털 통행료" 비즈니스로, 인플레이션·소비 증가에 직접 수혜. 영업이익률 50%+ — 세계에서 가장 수익성 높은 비즈니스 모델.',
          'American Express는 자체 카드 발행+네트워크 운영 통합으로 차별화. 고소득층 회원제로 평균 거래액이 높음. Discover는 미국 4위 — Capital One 인수 진행 중. 결제 산업의 다음 격전지는 BNPL(Buy Now Pay Later, AFRM·KLAR)·실시간 결제·디지털 지갑.',
          '핀테크 섹터(SQ·PYPL·SoFi)와 일부 겹치지만, 본 섹터는 전통 카드 네트워크에 집중.',
        ],
        candidates: [
          { rank: 1,  name: 'Visa',                    ticker: 'V',    mktcap: '~$5,500억', detail: '글로벌 카드 결제 1위. 200국 40억 카드. VisaNet 인프라 운영. 영업이익률 65%+', ir: 'https://investor.visa.com', news: 'https://usa.visa.com/about-visa/newsroom.html', x: 'https://x.com/search?q=Visa+payment+2026' },
          { rank: 2,  name: 'Mastercard',              ticker: 'MA',   mktcap: '~$4,500억', detail: '글로벌 2위. 실시간 결제·오픈뱅킹·사이버보안 솔루션 확장. AI 사기탐지 적용', ir: 'https://investor.mastercard.com', news: 'https://www.mastercard.com/news', x: 'https://x.com/search?q=Mastercard+MA+2026' },
          { rank: 3,  name: 'American Express',        ticker: 'AXP',  mktcap: '~$2,000억', detail: '프리미엄 카드 발행+네트워크 수직통합. 고소득층 특화. Buffett 핵심 보유주', ir: 'https://ir.americanexpress.com', news: 'https://about.americanexpress.com/newsroom', x: 'https://x.com/search?q=AmericanExpress+AXP+2026' },
          { rank: 4,  name: 'Capital One',             ticker: 'COF',  mktcap: '~$700억', detail: '미국 신용카드·소매뱅킹. Discover 인수 진행 — 미국 최대 발행+네트워크 통합 시도', ir: 'https://investor.capitalone.com', news: 'https://www.capitalone.com/about/newsroom/', x: 'https://x.com/search?q=CapitalOne+Discover+2026' },
          { rank: 5,  name: 'Discover Financial',      ticker: 'DFS',  mktcap: '~$500억', detail: '미국 4위 결제 네트워크 겸 발행사. Capital One 인수 진행 중. 직불·신용 통합 플레이어', ir: 'https://investorrelations.discover.com', news: 'https://ir.discover.com/news', x: 'https://x.com/search?q=Discover+DFS+2026' },
          { rank: 6,  name: 'Synchrony Financial',     ticker: 'SYF',  mktcap: '~$220억', detail: '미국 사적상표(private label) 신용카드 1위. Amazon·Lowe\'s 등 대형 소매 카드 발행', ir: 'https://investors.synchrony.com', news: 'https://newsroom.synchrony.com', x: 'https://x.com/search?q=Synchrony+SYF+2026' },
          { rank: 7,  name: 'Fiserv',                  ticker: 'FI',   mktcap: '~$1,200억', detail: '글로벌 결제 인프라·머천트 처리. Clover POS 시스템·디지털 뱅킹 인프라', ir: 'https://investors.fiserv.com', news: 'https://newsroom.fiserv.com', x: 'https://x.com/search?q=Fiserv+FI+2026' },
          { rank: 8,  name: 'Fidelity National Info',  ticker: 'FIS',  mktcap: '~$500억', detail: '글로벌 은행·결제 인프라 SW. Worldpay 머천트 결제. 핵심 뱅킹 시스템 공급', ir: 'https://investor.fisglobal.com', news: 'https://www.fisglobal.com/en/about-us/media-room', x: 'https://x.com/search?q=FIS+Fidelity+National+2026' },
          { rank: 9,  name: 'Global Payments',         ticker: 'GPN',  mktcap: '~$280억', detail: '글로벌 머천트 결제 — Worldpay·TSYS와 미국 결제 처리 3강. 통합·구조조정 진행', ir: 'https://investors.globalpayments.com', news: 'https://www.globalpayments.com/about-us/news', x: 'https://x.com/search?q=GlobalPayments+GPN+2026' },
          { rank: 10, name: 'PayPal',                  ticker: 'PYPL', mktcap: '~$700억', detail: '글로벌 디지털 결제 1위. Venmo·Braintree·Honey. 핀테크 카드와 일부 겹침', ir: 'https://investor.pypl.com', news: 'https://newsroom.paypal-corp.com', x: 'https://x.com/search?q=PayPal+PYPL+2026' },
          { rank: 11, name: 'Block (Square)',          ticker: 'SQ',   mktcap: '~$420억', detail: 'Square POS·Cash App·Bitcoin·BNPL(Afterpay 인수). Jack Dorsey 핀테크 대표주자', ir: 'https://investors.block.xyz', news: 'https://block.xyz/inside', x: 'https://x.com/search?q=Block+SQ+2026' },
          { rank: 12, name: 'Adyen',                   ticker: 'ADYEY', mktcap: '~$500억', detail: '네덜란드 — 글로벌 옴니채널 결제 처리. Uber·Airbnb·Spotify 등 대형 고객. 단일 플랫폼 모델', ir: 'https://www.adyen.com/investor-relations', news: 'https://www.adyen.com/press', x: 'https://x.com/search?q=Adyen+2026' },
        ],
      },
    ],
  },

  // ─── 레이어 5: 거래소 / 인프라 ─────────────────────
  {
    id: 'exchanges',
    layer: '📈 거래소 / 금융 인프라',
    components: [
      {
        id: 'exchanges_data',
        icon: '📈',
        name: '거래소 / 시장 데이터 / 신용평가',
        desc: '주식·파생·시장 데이터·신용평가',
        detail: [
          '거래소(ICE·CME·Nasdaq) 산업은 매 거래마다 수수료를 가져가는 안정적 수익 모델 + 시장 데이터·인덱스 라이선싱·청산결제 같은 부가가치 매출이 성장 동력. ICE는 NYSE·ICE Futures·MERS·Black Knight(주택담보), CME는 선물·옵션·금리·외환 글로벌 1위.',
          '시장 데이터·금융 정보 산업은 S&P Global(SPGI)·MSCI·Moody\'s가 핵심. SPGI는 S&P 500 인덱스 라이선스·신용평가, MSCI는 글로벌 인덱스(EAFE·EM)·ESG 평가, Moody\'s는 신용평가 양강. 이들은 진입장벽이 매우 높고(평판·규제·데이터 축적) 영업이익률 60%+의 스승급 비즈니스.',
        ],
        candidates: [
          { rank: 1,  name: 'S&P Global',              ticker: 'SPGI', mktcap: '~$1,500억', detail: 'S&P 500 인덱스 라이선스 + S&P Ratings(신용평가) + Capital IQ(데이터). Buffett 보유주', ir: 'https://investor.spglobal.com', news: 'https://www.spglobal.com/en/news', x: 'https://x.com/search?q=SPGlobal+SPGI+2026' },
          { rank: 2,  name: 'Moody\'s',                ticker: 'MCO',  mktcap: '~$900억', detail: '글로벌 신용평가 양강. ESG·리스크 분석 데이터 확장. Buffett 핵심 보유주(13%+)', ir: 'https://ir.moodys.com', news: 'https://www.moodys.com/newsroomtopical', x: 'https://x.com/search?q=Moodys+MCO+2026' },
          { rank: 3,  name: 'CME Group',               ticker: 'CME',  mktcap: '~$800억', detail: '글로벌 선물·옵션 거래소 1위. 금리·외환·곡물·원유. 청산결제 인프라', ir: 'https://www.cmegroup.com/investor-relations.html', news: 'https://www.cmegroup.com/media-room.html', x: 'https://x.com/search?q=CMEGroup+CME+2026' },
          { rank: 4,  name: 'Intercontinental Exch.',  ticker: 'ICE',  mktcap: '~$900억', detail: 'NYSE·ICE Futures·Black Knight(주택담보 SW)·시장 데이터. Sprecher CEO 다각화 적극', ir: 'https://ir.theice.com', news: 'https://ir.theice.com/press', x: 'https://x.com/search?q=ICE+Intercontinental+2026' },
          { rank: 5,  name: 'MSCI',                    ticker: 'MSCI', mktcap: '~$450억', detail: '글로벌 인덱스 1위(EAFE·EM·World). ESG 평가·리스크 분석 1위. AUM $14조 추종', ir: 'https://ir.msci.com', news: 'https://www.msci.com/who-we-are/news/', x: 'https://x.com/search?q=MSCI+2026' },
          { rank: 6,  name: 'Nasdaq',                  ticker: 'NDAQ', mktcap: '~$420억', detail: 'Nasdaq 거래소 + 시장 인프라 SW(SMARTS·Calypso). 핀테크·시장감시 시스템 강자', ir: 'https://ir.nasdaq.com', news: 'https://www.nasdaq.com/press-release', x: 'https://x.com/search?q=Nasdaq+NDAQ+2026' },
          { rank: 7,  name: 'CBOE Global Markets',     ticker: 'CBOE', mktcap: '~$220억', detail: '시카고 옵션거래소 — VIX 옵션 산실. S&P 500 옵션 1위. 디지털 자산 거래도 진출', ir: 'https://ir.cboe.com', news: 'https://ir.cboe.com/press-releases', x: 'https://x.com/search?q=CBOE+2026' },
          { rank: 8,  name: 'FactSet Research',        ticker: 'FDS',  mktcap: '~$170억', detail: '금융 데이터·분석 플랫폼. Bloomberg·Refinitiv 대안. 자산운용·IB 전문가용', ir: 'https://investor.factset.com', news: 'https://www.factset.com/about-us/news', x: 'https://x.com/search?q=FactSet+FDS+2026' },
          { rank: 9,  name: 'Marsh McLennan',          ticker: 'MMC',  mktcap: '~$1,100억', detail: '글로벌 보험 브로커·컨설팅 1위(Marsh·Mercer·Oliver Wyman·Guy Carpenter)', ir: 'https://www.marshmclennan.com/investors.html', news: 'https://www.marshmclennan.com/press-releases.html', x: 'https://x.com/search?q=MarshMclennan+MMC+2026' },
          { rank: 10, name: 'Aon',                     ticker: 'AON',  mktcap: '~$700억', detail: '글로벌 보험·컨설팅 2위. NFP 인수로 미국 미들마켓 확장. 인적자본·은퇴 컨설팅', ir: 'https://ir.aon.com', news: 'https://aon.com/about-aon/newsroom', x: 'https://x.com/search?q=Aon+2026' },
          { rank: 11, name: 'Tradeweb Markets',        ticker: 'TW',   mktcap: '~$300억', detail: '글로벌 채권·파생 전자거래 플랫폼. 미국 국채 1위. ETF 시장 확장', ir: 'https://www.tradeweb.com/investors/', news: 'https://www.tradeweb.com/newsroom/', x: 'https://x.com/search?q=Tradeweb+TW+2026' },
          { rank: 12, name: 'MarketAxess',             ticker: 'MKTX', mktcap: '~$80억', detail: '미국 회사채 전자거래 플랫폼 1위. AI 기반 채권 가격 추정 Algo 강자', ir: 'https://investor.marketaxess.com', news: 'https://www.marketaxess.com/news', x: 'https://x.com/search?q=MarketAxess+MKTX+2026' },
        ],
      },
    ],
  },
];

// 회사명 → 국기 이모지
export const FINANCIAL_FLAG_BY_NAME = {
  'JPMorgan Chase': '🇺🇸', 'Bank of America': '🇺🇸', 'Wells Fargo': '🇺🇸',
  'Citigroup': '🇺🇸', 'HSBC': '🇬🇧', 'Royal Bank of Canada': '🇨🇦',
  'Toronto-Dominion Bank': '🇨🇦', 'PNC Financial': '🇺🇸', 'U.S. Bancorp': '🇺🇸',
  'Truist Financial': '🇺🇸', 'Capital One': '🇺🇸', 'Mitsubishi UFJ': '🇯🇵',
  'Berkshire Hathaway': '🇺🇸', 'BlackRock': '🇺🇸', 'Goldman Sachs': '🇺🇸',
  'Morgan Stanley': '🇺🇸', 'Charles Schwab': '🇺🇸', 'Blackstone': '🇺🇸',
  'KKR': '🇺🇸', 'Apollo Global': '🇺🇸', 'Brookfield': '🇨🇦',
  'T. Rowe Price': '🇺🇸', 'Ameriprise Financial': '🇺🇸', 'Raymond James': '🇺🇸',
  'UnitedHealth Group': '🇺🇸', 'Progressive': '🇺🇸', 'Chubb': '🇺🇸',
  'Elevance Health': '🇺🇸', 'CIGNA': '🇺🇸', 'Allstate': '🇺🇸', 'AIG': '🇺🇸',
  'MetLife': '🇺🇸', 'Prudential Financial': '🇺🇸', 'Travelers Companies': '🇺🇸',
  'Munich Re': '🇩🇪',
  'Visa': '🇺🇸', 'Mastercard': '🇺🇸', 'American Express': '🇺🇸',
  'Discover Financial': '🇺🇸', 'Synchrony Financial': '🇺🇸', 'Fiserv': '🇺🇸',
  'Fidelity National Info': '🇺🇸', 'Global Payments': '🇺🇸',
  'PayPal': '🇺🇸', 'Block (Square)': '🇺🇸', 'Adyen': '🇳🇱',
  'S&P Global': '🇺🇸', "Moody's": '🇺🇸', 'CME Group': '🇺🇸',
  'Intercontinental Exch.': '🇺🇸', 'MSCI': '🇺🇸', 'Nasdaq': '🇺🇸',
  'CBOE Global Markets': '🇺🇸', 'FactSet Research': '🇺🇸',
  'Marsh McLennan': '🇺🇸', 'Aon': '🇮🇪',
  'Tradeweb Markets': '🇺🇸', 'MarketAxess': '🇺🇸',
};
