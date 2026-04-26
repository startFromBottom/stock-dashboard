// ── 원자재 광물별 시가총액 Top 기업 + 주요 광산 위치 ──
// SVG 좌표: viewBox="0 0 720 400" 기준
// 출처: Bloomberg, 각사 연간보고서 2024

const BASE_IR   = (t) => `https://finance.yahoo.com/quote/${t}`;
const BASE_NEWS = (t) => `https://finance.yahoo.com/quote/${t}/news`;
const BASE_X    = (n) => `https://x.com/search?q=${encodeURIComponent(n)}`;

// ── 광산 좌표 헬퍼 (대략적 지리 위치 → SVG 좌표)
// 북위/남위, 동경/서경을 viewBox에 매핑
// 경도: -180~180 → 0~720 (x = (lon+180)/360*720)
// 위도:  90~-90  → 0~400 (y = (90-lat)/180*400)
function xy(lat, lon) {
  return {
    x: Math.round((lon + 180) / 360 * 720),
    y: Math.round((90 - lat) / 180 * 400),
  };
}

// ═══════════════════��════════════════════
// 중국 Big 6 희토류 그룹 (국영) — 하드코딩 시총 기준 정렬
// 참고: A주(SS/SZ) 는 FMP API 미지원 → API 정렬 대신 staticRank로 고정
// ═════════════════════════════════���══════

// 각 기업별 광산 정의 (원소 태그 포함)
const CN_NORTH_MINES = [
  { name: 'Bayan Obo', country: '중국 내몽골', elements: ['La','Ce','Pr','Nd','Sm'], ...xy(41.8, 109.9) },
  { name: '바오터우 분리·제련', country: '중국 내몽골', elements: ['La','Ce','Nd','Pr'], ...xy(40.6, 109.8) },
];
const CN_SOUTH_MINES = [
  { name: '광둥 이온흡착광', country: '중국 광둥', elements: ['Nd','Pr','Dy','Tb','Eu'], ...xy(23.8, 113.6) },
  { name: '간저우 분리공장', country: '중국 장시', elements: ['Dy','Tb','Y','Gd'], ...xy(25.8, 114.9) },
];
const CHINALCO_RE_MINES = [
  { name: '장시 이온흡착광', country: '중국 장시', elements: ['Dy','Tb','Y','Nd','Pr'], ...xy(26.5, 115.8) },
  { name: '허난 분리공장', country: '중국 허난', elements: ['Ce','La','Nd'], ...xy(34.7, 113.6) },
];
const SHENGHE_MINES = [
  { name: 'Bayan Obo (협력)', country: '중국 내몽골', elements: ['Ce','La','Nd','Pr'], ...xy(41.8, 109.9) },
  { name: '쓰촨 미에야 광산', country: '중국 쓰촨', elements: ['La','Ce','Nd','Pr','Sm'], ...xy(29.0, 101.9) },
  { name: 'Mountain Pass (지분)', country: '미국 캘리포니아', elements: ['Nd','Pr','La','Ce'], ...xy(35.5, -115.5) },
];
const RISING_MINES = [
  { name: '난간 희토류 광산', country: '중국 후난', elements: ['Dy','Tb','Nd','Pr','Y'], ...xy(26.8, 111.7) },
  { name: '광저우 분리', country: '중국 광둥', elements: ['Dy','Tb','Y'], ...xy(23.1, 113.3) },
];
const CHINA_RE_GROUP_MINES = [
  { name: '산둥 광산군', country: '중국 산둥', elements: ['Ce','La','Nd','Sm'], ...xy(36.4, 117.1) },
  { name: '쓰촨 시창', country: '중국 쓰촨', elements: ['La','Ce','Nd','Pr','Sm'], ...xy(27.9, 102.3) },
];
const LYNAS_MINES = [
  { name: 'Mt Weld', country: '호주 WA', elements: ['Nd','Pr','La','Ce','Sm'], ...xy(-28.8, 122.2) },
  { name: 'LAMP 분리 (말레이시아)', country: '말레이시아', elements: ['Nd','Pr','La','Ce'], ...xy(3.8, 103.3) },
  { name: 'Kalgoorlie 처리', country: '호주 WA', elements: ['Nd','Pr'], ...xy(-30.7, 121.5) },
];
const MP_MINES = [
  { name: 'Mountain Pass', country: '미국 캘리포니아', elements: ['Nd','Pr','La','Ce','Sm'], ...xy(35.5, -115.5) },
  { name: 'Fort Worth 자석공장', country: '미국 텍사스', elements: ['Nd','Pr'], ...xy(32.7, -97.3) },
];

// 원소별 주력 기업 목록 (중국 Big 6 시총순 상단 고정)
function rareEarthList(elemFilter) {
  // 전체 후보풀 — staticRank로 정렬 (liveCap 없으면 이 순서 유지)
  return [
    {
      rank: 1, staticRank: 1,
      name: '北方稀土 China Northern Rare Earth', ticker: '600111.SS', flag: '🇨🇳',
      mktcap: '~$80억달러', note: '⚠ A주 · FMP 미지원 → 정적 시총',
      detail: '세계 최대 희토류 그룹 · Bayan Obo La/Ce/Nd 압도적 점유',
      mines: CN_NORTH_MINES.filter(m => m.elements.some(e => elemFilter.includes(e))),
      ir: BASE_IR('600111.SS'), news: BASE_NEWS('600111.SS'), x: BASE_X('China Northern Rare Earth'),
    },
    {
      rank: 2, staticRank: 2,
      name: '中国稀土集团 China Rare Earth Group', ticker: 'Private', flag: '🇨🇳',
      mktcap: '비상장 국영', note: '⚠ 비상장 · 2021년 국영 6개사 통합체',
      detail: '남방 중희토(Dy/Tb/Y) 생산 독점 — 이온흡착광 통합 관리',
      mines: CN_SOUTH_MINES.filter(m => m.elements.some(e => elemFilter.includes(e))),
      ir: 'https://www.cregc.com.cn', news: BASE_X('China Rare Earth Group'), x: BASE_X('China Rare Earth Group'),
    },
    {
      rank: 3, staticRank: 3,
      name: '盛和资源 Shenghe Resources', ticker: '600392.SS', flag: '🇨🇳',
      mktcap: '~$30억달러', note: '⚠ A주 · FMP 미지원',
      detail: 'Mountain Pass 지분 보유 · 중국↔서방 연결 희토류 트레이더',
      mines: SHENGHE_MINES.filter(m => m.elements.some(e => elemFilter.includes(e))),
      ir: BASE_IR('600392.SS'), news: BASE_NEWS('600392.SS'), x: BASE_X('Shenghe Resources'),
    },
    {
      rank: 4, staticRank: 4,
      name: '中铝稀土 Chinalco Rare Earth', ticker: '601600.SS', flag: '🇨🇳',
      mktcap: '~$25억달러', note: '⚠ A주 · FMP 미지원',
      detail: '중국알루미늄 계열 희토류 분리·정제 전문',
      mines: CHINALCO_RE_MINES.filter(m => m.elements.some(e => elemFilter.includes(e))),
      ir: BASE_IR('601600.SS'), news: BASE_NEWS('601600.SS'), x: BASE_X('Chinalco Rare Earth'),
    },
    {
      rank: 5, staticRank: 5,
      name: '广晟有色 Rising Nonferrous', ticker: '600259.SS', flag: '🇨🇳',
      mktcap: '~$20억달러', note: '⚠ A주 · FMP 미지원',
      detail: '광둥성 국영 · 중희토(Dy/Tb) 이온흡착광 핵심 운영사',
      mines: RISING_MINES.filter(m => m.elements.some(e => elemFilter.includes(e))),
      ir: BASE_IR('600259.SS'), news: BASE_NEWS('600259.SS'), x: BASE_X('Rising Nonferrous'),
    },
    {
      rank: 6, staticRank: 6,
      name: '中国稀有稀土 China Rare Earth Co.', ticker: '000831.SZ', flag: '🇨🇳',
      mktcap: '~$15억달러', note: '⚠ A주 · FMP 미지원',
      detail: '쓰촨·산둥 경희토류 채굴·분리',
      mines: CHINA_RE_GROUP_MINES.filter(m => m.elements.some(e => elemFilter.includes(e))),
      ir: BASE_IR('000831.SZ'), news: BASE_NEWS('000831.SZ'), x: BASE_X('China Rare Earth Co'),
    },
    {
      rank: 7, staticRank: 7,
      name: 'Lynas Rare Earths', ticker: 'LYC.AX', flag: '🇦🇺',
      mktcap: '~$50억달러',
      detail: '중국 外 최대 희토류 채굴·분리 통합 운영',
      mines: LYNAS_MINES.filter(m => m.elements.some(e => elemFilter.includes(e))),
      ir: BASE_IR('LYC.AX'), news: BASE_NEWS('LYC.AX'), x: BASE_X('Lynas Rare Earths'),
    },
    {
      rank: 8, staticRank: 8,
      name: 'MP Materials', ticker: 'MP', flag: '🇺🇸',
      mktcap: '~$20억달러',
      detail: '미국 Mountain Pass — 서방 탈중국 공급망 선봉',
      mines: MP_MINES.filter(m => m.elements.some(e => elemFilter.includes(e))),
      ir: BASE_IR('MP'), news: BASE_NEWS('MP'), x: BASE_X('MP Materials'),
    },
    {
      rank: 9, staticRank: 9,
      name: 'Energy Fuels', ticker: 'UUUU', flag: '🇺🇸',
      mktcap: '~$10억달러',
      detail: '미국 White Mesa · 탄자니아 모나자이트 → La/Ce/Nd/Pr 분리',
      mines: [
        { name: 'White Mesa Mill', country: '미국 유타', elements: ['La','Ce','Nd','Pr','Sm'], ...xy(37.5, -109.5) },
        { name: 'Donald 모나자이트', country: '호주 VIC', elements: ['La','Ce','Nd','Pr'], ...xy(-35.4, 142.5) },
      ].filter(m => m.elements.some(e => elemFilter.includes(e))),
      ir: BASE_IR('UUUU'), news: BASE_NEWS('UUUU'), x: BASE_X('Energy Fuels'),
    },
    {
      rank: 10, staticRank: 10,
      name: 'Arafura Rare Earths', ticker: 'ARU.AX', flag: '🇦🇺',
      mktcap: '~$3억달러',
      detail: '호주 Nolans — Nd·Pr 고순도 분리 개발 단계',
      mines: [
        { name: 'Nolans', country: '호주 NT', elements: ['Nd','Pr','La','Ce'], ...xy(-22.5, 134.5) },
      ].filter(m => m.elements.some(e => elemFilter.includes(e))),
      ir: BASE_IR('ARU.AX'), news: BASE_NEWS('ARU.AX'), x: BASE_X('Arafura RE'),
    },
  ].filter(co => co.mines.length > 0 || ['Private','600111.SS','600392.SS','601600.SS','600259.SS','000831.SZ'].includes(co.ticker));
}

export const RAW_COMPANIES = {

  // ════════════════��═══════════════════════
  // 희토류 — 원소별 특화 기업 리스트
  // ════════════════════════════════════════
  // Nd·Pr — 자석용 경희토류 (EV·풍력 핵심)
  'neodymium':     rareEarthList(['Nd','Pr','La','Ce','Sm']),
  'praseodymium':  rareEarthList(['Nd','Pr','La','Ce']),
  // Dy·Tb — 중희토류 (HREE, 고온 자석 보자력)
  'dysprosium':    rareEarthList(['Dy','Tb','Y','Gd']),
  'terbium':       rareEarthList(['Dy','Tb','Y']),
  // La·Ce — 경희토류 대량 원소 (촉매·형광체)
  'cerium':        rareEarthList(['La','Ce','Nd','Pr']),
  'lanthanum':     rareEarthList(['La','Ce','Nd','Pr']),
  // Y — 중희토류 형광체·레이저
  'yttrium':       rareEarthList(['Y','Dy','Tb','Gd']),
  // Sm — SmCo 자석 (항공우주)
  'samarium':      rareEarthList(['Sm','Nd','Pr','La','Ce']),

  // ════════════════════════════════════════
  // 귀금속
  // ════════════════════════════════════════
  'gold': [
    {
      rank: 1, name: 'Newmont', ticker: 'NEM', flag: '🇺🇸',
      mktcap: '~$46조', detail: '세계 최대 금 채굴사 · 5대륙 광산 운영',
      mines: [
        { name: 'Boddington', country: '호주', ...xy(-32.8, 116.4) },
        { name: 'Carlin', country: '미국 네바다', ...xy(40.7, -116.4) },
        { name: 'Peñasquito', country: '멕시코', ...xy(24.0, -101.5) },
        { name: 'Ahafo', country: '가나', ...xy(7.1, -2.5) },
        { name: 'Cerro Negro', country: '아르헨티나', ...xy(-46.7, -67.8) },
      ],
      ir: BASE_IR('NEM'), news: BASE_NEWS('NEM'), x: BASE_X('Newmont'),
    },
    {
      rank: 2, name: 'Barrick Gold', ticker: 'GOLD', flag: '🇨🇦',
      mktcap: '~$36조', detail: '캐나다 최대 금 광산 · Carlin·Nevada Joint Venture',
      mines: [
        { name: 'Nevada Gold Mines', country: '미국', ...xy(41.2, -117.0) },
        { name: 'Kibali', country: 'DRC', ...xy(3.0, 29.6) },
        { name: 'Loulo-Gounkoto', country: '말리', ...xy(13.8, -11.4) },
        { name: 'Lumwana', country: '잠비아', ...xy(-12.3, 25.9) },
        { name: 'Pueblo Viejo', country: '도미니카공화국', ...xy(18.7, -69.6) },
      ],
      ir: BASE_IR('GOLD'), news: BASE_NEWS('GOLD'), x: BASE_X('Barrick Gold'),
    },
    {
      rank: 3, name: 'Agnico Eagle', ticker: 'AEM', flag: '🇨🇦',
      mktcap: '~$38조', detail: '캐나다·핀란드·멕시코 저비용 금 생산',
      mines: [
        { name: 'Detour Lake', country: '캐나다 온타리오', ...xy(49.9, -80.2) },
        { name: 'Canadian Malartic', country: '캐나다 퀘벡', ...xy(48.1, -78.1) },
        { name: 'Kittilä', country: '핀란드', ...xy(67.6, 25.1) },
        { name: 'Pinos Altos', country: '멕시코', ...xy(29.0, -107.9) },
      ],
      ir: BASE_IR('AEM'), news: BASE_NEWS('AEM'), x: BASE_X('Agnico Eagle'),
    },
    {
      rank: 4, name: 'Wheaton Precious Metals', ticker: 'WPM', flag: '🇨🇦',
      mktcap: '~$30조', detail: '스트리밍·로열티 모델 — 광산 없이 수익',
      mines: [
        { name: 'Salobo (스트리밍)', country: '브라질', ...xy(-5.8, -50.8) },
        { name: 'Constancia (스트리밍)', country: '페루', ...xy(-14.1, -71.6) },
        { name: 'San Dimas (스트리밍)', country: '멕시코', ...xy(24.2, -105.9) },
      ],
      ir: BASE_IR('WPM'), news: BASE_NEWS('WPM'), x: BASE_X('Wheaton Precious Metals'),
    },
    {
      rank: 5, name: 'Gold Fields', ticker: 'GFI', flag: '🇿🇦',
      mktcap: '~$15조', detail: '남아공·가나·호주·페루 금광 운영',
      mines: [
        { name: 'South Deep', country: '남아공', ...xy(-26.4, 27.4) },
        { name: 'Tarkwa', country: '가나', ...xy(5.3, -1.9) },
        { name: 'St Ives', country: '호주', ...xy(-31.4, 121.6) },
        { name: 'Cerro Corona', country: '페루', ...xy(-6.7, -78.5) },
      ],
      ir: BASE_IR('GFI'), news: BASE_NEWS('GFI'), x: BASE_X('Gold Fields'),
    },
    {
      rank: 6, name: 'AngloGold Ashanti', ticker: 'AU', flag: '🇿🇦',
      mktcap: '~$12조', detail: '전 세계 10개국 금광 운영',
      mines: [
        { name: 'Geita', country: '탄자니아', ...xy(-2.8, 32.1) },
        { name: 'Kibali (지분)', country: 'DRC', ...xy(3.0, 29.6) },
        { name: 'Obuasi', country: '가나', ...xy(6.2, -1.7) },
        { name: 'Silicon', country: '미국 네바다', ...xy(39.8, -118.1) },
      ],
      ir: BASE_IR('AU'), news: BASE_NEWS('AU'), x: BASE_X('AngloGold Ashanti'),
    },
    {
      rank: 7, name: 'Kinross Gold', ticker: 'KGC', flag: '🇨🇦',
      mktcap: '~$12조', detail: '미국·브라질·서아프리카 금광',
      mines: [
        { name: 'Fort Knox', country: '미국 알래스카', ...xy(64.8, -147.5) },
        { name: 'Paracatu', country: '브라질', ...xy(-17.2, -46.9) },
        { name: 'Tasiast', country: '모리타니아', ...xy(21.0, -12.5) },
      ],
      ir: BASE_IR('KGC'), news: BASE_NEWS('KGC'), x: BASE_X('Kinross Gold'),
    },
    {
      rank: 8, name: 'Pan American Silver', ticker: 'PAAS', flag: '🇨🇦',
      mktcap: '~$7조', detail: '중남미 금·은 통합 생산',
      mines: [
        { name: 'La Colorada', country: '멕시코', ...xy(23.0, -102.2) },
        { name: 'Dolores', country: '멕시코', ...xy(29.0, -108.2) },
        { name: 'Shahuindo', country: '페루', ...xy(-7.5, -78.2) },
      ],
      ir: BASE_IR('PAAS'), news: BASE_NEWS('PAAS'), x: BASE_X('Pan American Silver'),
    },
    {
      rank: 9, name: 'Endeavour Mining', ticker: 'EDV', flag: '🇬🇧',
      mktcap: '~$6조', detail: '서아프리카 최대 금 채굴사',
      mines: [
        { name: 'Sabodala-Massawa', country: '세네갈', ...xy(13.6, -12.0) },
        { name: 'Ity', country: '코트디부아르', ...xy(7.5, -7.5) },
        { name: 'Houndé', country: '부르키나파소', ...xy(11.5, -3.5) },
      ],
      ir: BASE_IR('EDV.TO'), news: BASE_NEWS('EDV.TO'), x: BASE_X('Endeavour Mining'),
    },
    {
      rank: 10, name: 'Polyus', ticker: 'PLZL.ME', flag: '🇷🇺',
      mktcap: '~$18조', detail: '러시아 최대·세계 4위 금 생산',
      mines: [
        { name: 'Olimpiada', country: '러시아 크라스노야르스크', ...xy(59.0, 92.5) },
        { name: 'Blagodatnoye', country: '러시아', ...xy(58.5, 92.8) },
        { name: 'Verninskoye', country: '러시아 이르쿠츠크', ...xy(56.8, 103.2) },
      ],
      ir: BASE_IR('PLZL.ME'), news: BASE_NEWS('PLZL.ME'), x: BASE_X('Polyus'),
    },
  ],

  'silver': [
    {
      rank: 1, name: 'Fresnillo', ticker: 'FRES.L', flag: '🇲🇽',
      mktcap: '~$5조', detail: '세계 최대 은 생산·멕시코 국영 광산',
      mines: [
        { name: 'Fresnillo Mine', country: '멕시코 사카테카스', ...xy(23.2, -102.9) },
        { name: 'Saucito', country: '멕시코 사카테카스', ...xy(22.9, -102.6) },
        { name: 'Ciénega', country: '멕시코 두랑고', ...xy(25.5, -106.2) },
      ],
      ir: BASE_IR('FRES.L'), news: BASE_NEWS('FRES.L'), x: BASE_X('Fresnillo'),
    },
    {
      rank: 2, name: 'Pan American Silver', ticker: 'PAAS', flag: '🇨🇦',
      mktcap: '~$7조', detail: '중남미 1위 은 통합 생산사',
      mines: [
        { name: 'La Colorada', country: '멕시코', ...xy(23.0, -102.2) },
        { name: 'Manantial Espejo', country: '아르헨티나', ...xy(-48.7, -68.3) },
        { name: 'San Vicente', country: '볼리비아', ...xy(-16.8, -66.2) },
      ],
      ir: BASE_IR('PAAS'), news: BASE_NEWS('PAAS'), x: BASE_X('Pan American Silver'),
    },
    {
      rank: 3, name: 'Wheaton Precious Metals', ticker: 'WPM', flag: '🇨🇦',
      mktcap: '~$30조', detail: '은 스트리밍 세계 1위',
      mines: [
        { name: 'Antamina (스트리밍)', country: '페루', ...xy(-9.5, -77.2) },
        { name: 'Penasquito (스트리밍)', country: '멕시코', ...xy(24.0, -101.5) },
        { name: 'Constancia (스트리밍)', country: '페루', ...xy(-14.1, -71.6) },
      ],
      ir: BASE_IR('WPM'), news: BASE_NEWS('WPM'), x: BASE_X('Wheaton Precious Metals'),
    },
    {
      rank: 4, name: 'First Majestic Silver', ticker: 'AG', flag: '🇨🇦',
      mktcap: '~$2조', detail: '멕시코·미국 은 순수 채굴사',
      mines: [
        { name: 'San Dimas', country: '멕시코', ...xy(24.2, -105.9) },
        { name: 'Santa Elena', country: '멕시코 소노라', ...xy(29.5, -110.8) },
        { name: 'Jerritt Canyon', country: '미국 네바다', ...xy(41.5, -115.8) },
      ],
      ir: BASE_IR('AG'), news: BASE_NEWS('AG'), x: BASE_X('First Majestic Silver'),
    },
    {
      rank: 5, name: 'Coeur Mining', ticker: 'CDE', flag: '🇺🇸',
      mktcap: '~$2조', detail: '미국·캐나다·멕시코 은·금 채굴',
      mines: [
        { name: 'Rochester', country: '미국 네바다', ...xy(40.5, -118.0) },
        { name: 'Palmarejo', country: '멕시코 치와와', ...xy(27.7, -108.7) },
        { name: 'Silvertip', country: '캐나다 BC', ...xy(58.7, -130.4) },
      ],
      ir: BASE_IR('CDE'), news: BASE_NEWS('CDE'), x: BASE_X('Coeur Mining'),
    },
    {
      rank: 6, name: 'Hecla Mining', ticker: 'HL', flag: '🇺🇸',
      mktcap: '~$3조', detail: '미국 최대 은 생산 — 알래스카·아이다호',
      mines: [
        { name: 'Greens Creek', country: '미국 알래스카', ...xy(57.6, -134.8) },
        { name: 'Lucky Friday', country: '미국 아이다호', ...xy(47.5, -115.8) },
        { name: 'Casa Berardi', country: '캐나다 퀘벡', ...xy(49.2, -79.4) },
      ],
      ir: BASE_IR('HL'), news: BASE_NEWS('HL'), x: BASE_X('Hecla Mining'),
    },
    {
      rank: 7, name: 'MAG Silver', ticker: 'MAG', flag: '🇨🇦',
      mktcap: '~$2조', detail: '멕시코 Juanicipio 고품위 은광',
      mines: [
        { name: 'Juanicipio', country: '멕시코 사카테카스', ...xy(22.7, -102.4) },
      ],
      ir: BASE_IR('MAG'), news: BASE_NEWS('MAG'), x: BASE_X('MAG Silver'),
    },
    {
      rank: 8, name: 'Endeavour Silver', ticker: 'EXK', flag: '🇨🇦',
      mktcap: '~$0.5조', detail: '멕시코 중·소형 은광 전문',
      mines: [
        { name: 'Guanaceví', country: '멕시코 두랑고', ...xy(25.9, -106.0) },
        { name: 'Bolañitos', country: '멕시코 이달고', ...xy(20.5, -98.9) },
      ],
      ir: BASE_IR('EXK'), news: BASE_NEWS('EXK'), x: BASE_X('Endeavour Silver'),
    },
    {
      rank: 9, name: 'KGHM Polska Miedź', ticker: 'KGH.WA', flag: '🇵🇱',
      mktcap: '~$5조', detail: '폴란드 국영 — 구리 주력, 은 세계 2위 생산',
      mines: [
        { name: 'Lubin', country: '폴란드', ...xy(51.4, 16.2) },
        { name: 'Polkowice-Sieroszowice', country: '폴란드', ...xy(51.5, 16.1) },
        { name: 'Sierra Gorda', country: '칠레', ...xy(-22.8, -69.3) },
      ],
      ir: BASE_IR('KGH.WA'), news: BASE_NEWS('KGH.WA'), x: BASE_X('KGHM'),
    },
    {
      rank: 10, name: 'Silvercorp Metals', ticker: 'SVM', flag: '🇨🇦',
      mktcap: '~$0.8조', detail: '중국 Ying 광산 운영 — 저비용 은 생산',
      mines: [
        { name: 'Ying (YSK)', country: '중국 허난성', ...xy(34.2, 111.5) },
      ],
      ir: BASE_IR('SVM'), news: BASE_NEWS('SVM'), x: BASE_X('Silvercorp Metals'),
    },
  ],

  'platinum': [
    {
      rank: 1, name: 'Anglo American Platinum', ticker: 'AMS.JO', flag: '🇿🇦',
      mktcap: '~$10조', detail: '세계 1위 백금족 생산 · 남아공 부시벨트',
      mines: [
        { name: 'Mogalakwena', country: '남아공 림포포', ...xy(-23.8, 28.9) },
        { name: 'Amandelbult', country: '남아공', ...xy(-24.6, 27.3) },
        { name: 'Mototolo/Der Brochen', country: '남아공', ...xy(-25.1, 30.0) },
      ],
      ir: BASE_IR('AMS.JO'), news: BASE_NEWS('AMS.JO'), x: BASE_X('Amplats'),
    },
    {
      rank: 2, name: 'Impala Platinum (Implats)', ticker: 'IMP.JO', flag: '🇿🇦',
      mktcap: '~$5조', detail: '남아공·짐바브웨 백금족 2위',
      mines: [
        { name: 'Impala Rustenburg', country: '남아공', ...xy(-25.9, 27.2) },
        { name: 'Zimplats', country: '짐바브웨', ...xy(-17.9, 29.9) },
        { name: 'Marula', country: '남아공', ...xy(-24.0, 30.3) },
      ],
      ir: BASE_IR('IMP.JO'), news: BASE_NEWS('IMP.JO'), x: BASE_X('Implats'),
    },
    {
      rank: 3, name: 'Sibanye Stillwater', ticker: 'SBSW', flag: '🇿🇦',
      mktcap: '~$4조', detail: '남아공 금·PGM + 미국 팔라듐',
      mines: [
        { name: 'Stillwater', country: '미국 몬태나', ...xy(45.5, -109.9) },
        { name: 'Kroondal', country: '남아공', ...xy(-25.7, 27.4) },
        { name: 'Marikana', country: '남아공', ...xy(-25.7, 27.4) },
      ],
      ir: BASE_IR('SBSW'), news: BASE_NEWS('SBSW'), x: BASE_X('Sibanye Stillwater'),
    },
    {
      rank: 4, name: 'Northam Platinum', ticker: 'NPH.JO', flag: '🇿🇦',
      mktcap: '~$3조', detail: '남아공 Waterberg 차세대 PGM 프로젝트',
      mines: [
        { name: 'Zondereinde', country: '남아공', ...xy(-24.5, 27.5) },
        { name: 'Booysendal', country: '남아공', ...xy(-25.3, 30.4) },
      ],
      ir: BASE_IR('NPH.JO'), news: BASE_NEWS('NPH.JO'), x: BASE_X('Northam Platinum'),
    },
    {
      rank: 5, name: 'Norilsk Nickel (Nornickel)', ticker: 'GMKN.ME', flag: '🇷🇺',
      mktcap: '~$25조', detail: '러시아 세계 최대 팔라듐·니켈 생산',
      mines: [
        { name: 'Norilsk 광산군', country: '러시아 크라스노야르스크', ...xy(69.3, 88.2) },
        { name: 'Kola 반도', country: '러시아', ...xy(67.9, 33.1) },
      ],
      ir: BASE_IR('GMKN.ME'), news: BASE_NEWS('GMKN.ME'), x: BASE_X('Nornickel'),
    },
    {
      rank: 6, name: 'Royal Bafokeng Platinum', ticker: 'RBP.JO', flag: '🇿🇦',
      mktcap: '~$1조', detail: '남아공 부시벨트 중소형 PGM',
      mines: [
        { name: 'Rasimone (BRPM)', country: '남아공', ...xy(-25.8, 27.3) },
      ],
      ir: BASE_IR('RBP.JO'), news: BASE_NEWS('RBP.JO'), x: BASE_X('RB Plat'),
    },
    {
      rank: 7, name: 'Platinum Group Metals', ticker: 'PTM', flag: '🇨🇦',
      mktcap: '~$0.3조', detail: '남아공 Waterberg 팔라듐 개발',
      mines: [
        { name: 'Waterberg Project', country: '남아공', ...xy(-23.5, 28.3) },
      ],
      ir: BASE_IR('PTM'), news: BASE_NEWS('PTM'), x: BASE_X('Platinum Group Metals'),
    },
    {
      rank: 8, name: 'Zimplats Holdings', ticker: 'ZIM.ZW', flag: '🇿🇼',
      mktcap: '~$1조', detail: '짐바브웨 최대 PGM 생산사',
      mines: [
        { name: 'Ngezi', country: '짐바브웨', ...xy(-20.5, 29.8) },
        { name: 'Selous Metallurgical Complex', country: '짐바브웨', ...xy(-20.2, 30.0) },
      ],
      ir: BASE_IR('ZIM.ZW'), news: BASE_NEWS('ZIM.ZW'), x: BASE_X('Zimplats'),
    },
  ],

  // ════════════════════════════════════════
  // 배터리 금속
  // ════════════════════════════════════════
  'lithium': [
    {
      rank: 1, name: 'Albemarle', ticker: 'ALB', flag: '🇺🇸',
      mktcap: '~$10조', detail: '세계 1위 리튬 화학 · 칠레 염호·호주 스포듀민',
      mines: [
        { name: 'Atacama Salar', country: '칠레', ...xy(-23.3, -68.2) },
        { name: 'Greenbushes (지분)', country: '호주', ...xy(-33.8, 116.1) },
        { name: 'Silver Peak', country: '미국 네바다', ...xy(37.7, -117.6) },
      ],
      ir: BASE_IR('ALB'), news: BASE_NEWS('ALB'), x: BASE_X('Albemarle'),
    },
    {
      rank: 2, name: 'SQM', ticker: 'SQM', flag: '🇨🇱',
      mktcap: '~$12조', detail: '칠레 아타카마 염호 독점 · 세계 2위 리튬',
      mines: [
        { name: 'Salar de Atacama', country: '칠레', ...xy(-23.5, -68.2) },
      ],
      ir: BASE_IR('SQM'), news: BASE_NEWS('SQM'), x: BASE_X('SQM Chile'),
    },
    {
      rank: 3, name: 'Pilbara Minerals', ticker: 'PLS.AX', flag: '🇦🇺',
      mktcap: '~$5조', detail: '호주 Pilgangoora 세계 최대 스포듀민 광산',
      mines: [
        { name: 'Pilgangoora', country: '호주 서부', ...xy(-21.3, 118.9) },
      ],
      ir: BASE_IR('PLS.AX'), news: BASE_NEWS('PLS.AX'), x: BASE_X('Pilbara Minerals'),
    },
    {
      rank: 4, name: 'Liontown Resources', ticker: 'LTR.AX', flag: '🇦🇺',
      mktcap: '~$2조', detail: '호주 Kathleen Valley 스포듀민 신규 생산',
      mines: [
        { name: 'Kathleen Valley', country: '호주 서부', ...xy(-27.4, 119.3) },
      ],
      ir: BASE_IR('LTR.AX'), news: BASE_NEWS('LTR.AX'), x: BASE_X('Liontown Resources'),
    },
    {
      rank: 5, name: 'Arcadium Lithium', ticker: 'ALTM', flag: '🇺🇸',
      mktcap: '~$5조', detail: 'Allkem+Livent 합병 · 아르헨티나·호주',
      mines: [
        { name: 'Olaroz', country: '아르헨티나', ...xy(-23.5, -66.8) },
        { name: 'Mt Cattlin', country: '호주', ...xy(-33.6, 120.1) },
        { name: 'Fenix (염호)', country: '아르헨티나', ...xy(-29.4, -66.9) },
      ],
      ir: BASE_IR('ALTM'), news: BASE_NEWS('ALTM'), x: BASE_X('Arcadium Lithium'),
    },
    {
      rank: 6, name: 'Ganfeng Lithium', ticker: '002460.SZ', flag: '🇨🇳',
      mktcap: '~$8조', detail: '중국 최대 리튬 기업 · 전 세계 광산 투자',
      mines: [
        { name: 'Cauchari-Olaroz', country: '아르헨티나', ...xy(-23.6, -66.7) },
        { name: 'Xinyu 공장', country: '중국 장시', ...xy(27.8, 114.9) },
        { name: 'Marion (지분)', country: '호주', ...xy(-28.8, 122.0) },
      ],
      ir: BASE_IR('002460.SZ'), news: BASE_NEWS('002460.SZ'), x: BASE_X('Ganfeng Lithium'),
    },
    {
      rank: 7, name: 'Tianqi Lithium', ticker: '002466.SZ', flag: '🇨🇳',
      mktcap: '~$7조', detail: 'Greenbushes 지분·SQM 지분 · 중국 2위 리튬',
      mines: [
        { name: 'Greenbushes (지분)', country: '호주', ...xy(-33.8, 116.1) },
        { name: 'Kwinana 수산화리튬 공장', country: '호주', ...xy(-32.2, 115.8) },
      ],
      ir: BASE_IR('002466.SZ'), news: BASE_NEWS('002466.SZ'), x: BASE_X('Tianqi Lithium'),
    },
    {
      rank: 8, name: 'Lithium Americas', ticker: 'LAC', flag: '🇨🇦',
      mktcap: '~$1조', detail: '미국 Thacker Pass 개발 — IRA 수혜',
      mines: [
        { name: 'Thacker Pass', country: '미국 네바다', ...xy(41.8, -118.0) },
      ],
      ir: BASE_IR('LAC'), news: BASE_NEWS('LAC'), x: BASE_X('Lithium Americas'),
    },
    {
      rank: 9, name: 'Core Lithium', ticker: 'CXO.AX', flag: '🇦🇺',
      mktcap: '~$0.5조', detail: '호주 NT Finniss 리튬 광산',
      mines: [
        { name: 'Finniss', country: '호주 노던테리토리', ...xy(-13.1, 130.8) },
      ],
      ir: BASE_IR('CXO.AX'), news: BASE_NEWS('CXO.AX'), x: BASE_X('Core Lithium'),
    },
    {
      rank: 10, name: 'Sigma Lithium', ticker: 'SGML', flag: '🇧🇷',
      mktcap: '~$1조', detail: '브라질 Grota do Cirilo 고품위 스포듀민',
      mines: [
        { name: 'Grota do Cirilo', country: '브라질 미나스제라이스', ...xy(-17.2, -42.8) },
      ],
      ir: BASE_IR('SGML'), news: BASE_NEWS('SGML'), x: BASE_X('Sigma Lithium'),
    },
  ],

  'cobalt': [
    {
      rank: 1, name: 'Glencore', ticker: 'GLEN.L', flag: '🇨🇭',
      mktcap: '~$55조', detail: '세계 최대 코발트 생산 · DRC Katanga 등',
      mines: [
        { name: 'Katanga/KCC', country: 'DRC', ...xy(-10.8, 25.2) },
        { name: 'Mutanda', country: 'DRC', ...xy(-11.6, 26.7) },
        { name: 'Murrin Murrin (Ni-Co)', country: '호주', ...xy(-28.7, 121.9) },
      ],
      ir: BASE_IR('GLEN.L'), news: BASE_NEWS('GLEN.L'), x: BASE_X('Glencore'),
    },
    {
      rank: 2, name: 'China Molybdenum (CMOC)', ticker: '603993.SS', flag: '🇨🇳',
      mktcap: '~$15조', detail: 'DRC Tenke Fungurume — 세계 최대 단일 코발트광',
      mines: [
        { name: 'Tenke Fungurume', country: 'DRC', ...xy(-10.6, 26.1) },
        { name: 'Kisanfu', country: 'DRC', ...xy(-9.8, 26.7) },
      ],
      ir: BASE_IR('603993.SS'), news: BASE_NEWS('603993.SS'), x: BASE_X('CMOC Group'),
    },
    {
      rank: 3, name: 'Vale', ticker: 'VALE', flag: '🇧🇷',
      mktcap: '~$50조', detail: '브라질·캐나다 니켈-코발트 통합 생산',
      mines: [
        { name: 'Voisey\'s Bay', country: '캐나다 래브라도', ...xy(56.3, -61.7) },
        { name: 'Sudbury', country: '캐나다 온타리오', ...xy(46.5, -81.0) },
        { name: 'PTVI Sorowako', country: '인도네시아', ...xy(-2.5, 121.3) },
      ],
      ir: BASE_IR('VALE'), news: BASE_NEWS('VALE'), x: BASE_X('Vale'),
    },
    {
      rank: 4, name: 'Eurasian Resources Group', ticker: 'Private', flag: '🇰🇿',
      mktcap: '비상장', detail: '카자흐스탄·DRC 코발트·구리',
      mines: [
        { name: 'Boss Mining', country: 'DRC', ...xy(-10.4, 25.5) },
        { name: 'Metalkol RTR', country: 'DRC', ...xy(-10.8, 25.4) },
      ],
      ir: 'https://www.erg.kz', news: 'https://www.erg.kz/news', x: BASE_X('Eurasian Resources Group'),
    },
    {
      rank: 5, name: 'Umicore', ticker: 'UMI.BR', flag: '🇧🇪',
      mktcap: '~$4조', detail: '코발트 정제·배터리 재활용 선두',
      mines: [
        { name: 'Hoboken 제련소', country: '벨기에', ...xy(51.2, 4.3) },
      ],
      ir: BASE_IR('UMI.BR'), news: BASE_NEWS('UMI.BR'), x: BASE_X('Umicore'),
    },
    {
      rank: 6, name: 'Sherritt International', ticker: 'S.TO', flag: '🇨🇦',
      mktcap: '~$0.3조', detail: '쿠바 Moa Ni-Co 바닷속 광상',
      mines: [
        { name: 'Moa', country: '쿠바', ...xy(20.6, -74.9) },
      ],
      ir: BASE_IR('S.TO'), news: BASE_NEWS('S.TO'), x: BASE_X('Sherritt International'),
    },
    {
      rank: 7, name: 'IGO Limited', ticker: 'IGO.AX', flag: '🇦🇺',
      mktcap: '~$3조', detail: '호주 Nova·Forrestania Ni-Co',
      mines: [
        { name: 'Nova', country: '호주 서부', ...xy(-32.2, 123.4) },
        { name: 'Forrestania', country: '호주 서부', ...xy(-32.8, 118.5) },
      ],
      ir: BASE_IR('IGO.AX'), news: BASE_NEWS('IGO.AX'), x: BASE_X('IGO Limited'),
    },
    {
      rank: 8, name: 'Cobalt Blue Holdings', ticker: 'COB.AX', flag: '🇦🇺',
      mktcap: '~$0.2조', detail: '호주 Broken Hill 황철석 코발트 개발',
      mines: [
        { name: 'Broken Hill', country: '호주 NSW', ...xy(-31.9, 141.5) },
      ],
      ir: BASE_IR('COB.AX'), news: BASE_NEWS('COB.AX'), x: BASE_X('Cobalt Blue'),
    },
  ],

  'nickel': [
    {
      rank: 1, name: 'Norilsk Nickel (Nornickel)', ticker: 'GMKN.ME', flag: '🇷🇺',
      mktcap: '~$25조', detail: '세계 최대 고품위 니켈·팔라듐 생산',
      mines: [
        { name: 'Norilsk 광산군', country: '러시아', ...xy(69.3, 88.2) },
        { name: 'Kola 반도', country: '러시아', ...xy(67.9, 33.1) },
      ],
      ir: BASE_IR('GMKN.ME'), news: BASE_NEWS('GMKN.ME'), x: BASE_X('Nornickel'),
    },
    {
      rank: 2, name: 'Vale', ticker: 'VALE', flag: '🇧🇷',
      mktcap: '~$50조', detail: '브라질·캐나다·인도네시아 니켈 2위',
      mines: [
        { name: 'Sudbury', country: '캐나다', ...xy(46.5, -81.0) },
        { name: 'PTVI Sorowako', country: '인도네시아', ...xy(-2.5, 121.3) },
        { name: 'Onça Puma', country: '브라질', ...xy(-5.1, -51.1) },
      ],
      ir: BASE_IR('VALE'), news: BASE_NEWS('VALE'), x: BASE_X('Vale'),
    },
    {
      rank: 3, name: 'BHP', ticker: 'BHP', flag: '🇦🇺',
      mktcap: '~$130조', detail: '호주 Nickel West · 철광·구리도 세계 1위',
      mines: [
        { name: 'Nickel West', country: '호주 WA', ...xy(-27.7, 121.4) },
        { name: 'Mt Keith', country: '호주 WA', ...xy(-27.3, 120.5) },
      ],
      ir: BASE_IR('BHP'), news: BASE_NEWS('BHP'), x: BASE_X('BHP'),
    },
    {
      rank: 4, name: 'Glencore', ticker: 'GLEN.L', flag: '🇨🇭',
      mktcap: '~$55조', detail: '전 세계 니켈·코발트·구리 통합',
      mines: [
        { name: 'Koniambo', country: '뉴칼레도니아', ...xy(-20.9, 164.3) },
        { name: 'Raglan', country: '캐나다 퀘벡', ...xy(61.7, -73.7) },
      ],
      ir: BASE_IR('GLEN.L'), news: BASE_NEWS('GLEN.L'), x: BASE_X('Glencore'),
    },
    {
      rank: 5, name: 'PT Merdeka Copper Gold', ticker: 'MDKA.JK', flag: '🇮🇩',
      mktcap: '~$5조', detail: '인도네시아 HPAL 니켈 급성장',
      mines: [
        { name: 'Sulawesi HPAL', country: '인도네시아', ...xy(-2.1, 121.8) },
      ],
      ir: BASE_IR('MDKA.JK'), news: BASE_NEWS('MDKA.JK'), x: BASE_X('Merdeka Copper Gold'),
    },
    {
      rank: 6, name: 'Nickel Industries', ticker: 'NIC.AX', flag: '🇦🇺',
      mktcap: '~$2조', detail: '인도네시아 니켈 제련 — 중국 파트너십',
      mines: [
        { name: 'RKEF (Sulawesi)', country: '인도네시아', ...xy(-2.0, 121.6) },
      ],
      ir: BASE_IR('NIC.AX'), news: BASE_NEWS('NIC.AX'), x: BASE_X('Nickel Industries'),
    },
    {
      rank: 7, name: 'First Quantum Minerals', ticker: 'FM.TO', flag: '🇨🇦',
      mktcap: '~$8조', detail: '잠비아·파나마 구리 주력, 니켈 부산',
      mines: [
        { name: 'Ravensthorpe', country: '호주', ...xy(-33.5, 120.0) },
        { name: 'Trident', country: '잠비아', ...xy(-12.0, 27.9) },
      ],
      ir: BASE_IR('FM.TO'), news: BASE_NEWS('FM.TO'), x: BASE_X('First Quantum Minerals'),
    },
    {
      rank: 8, name: 'Western Areas (IGO 흡수)', ticker: 'IGO.AX', flag: '🇦🇺',
      mktcap: '~$3조', detail: '호주 니켈 채굴',
      mines: [
        { name: 'Nova', country: '호주', ...xy(-32.2, 123.4) },
      ],
      ir: BASE_IR('IGO.AX'), news: BASE_NEWS('IGO.AX'), x: BASE_X('IGO Limited'),
    },
  ],

  'manganese': [
    {
      rank: 1, name: 'South32', ticker: 'S32.AX', flag: '🇦🇺',
      mktcap: '~$12조', detail: '세계 최대 망간 생산 · 남아공·호주',
      mines: [
        { name: 'GEMCO (Groote Eylandt)', country: '호주 NT', ...xy(-14.0, 136.4) },
        { name: 'Hotazel (HMMZ)', country: '남아공', ...xy(-27.3, 22.9) },
      ],
      ir: BASE_IR('S32.AX'), news: BASE_NEWS('S32.AX'), x: BASE_X('South32'),
    },
    {
      rank: 2, name: 'Eramet', ticker: 'ERA.PA', flag: '🇫🇷',
      mktcap: '~$2조', detail: '가봉 Moanda 세계 최고품위 망간광',
      mines: [
        { name: 'Moanda', country: '가봉', ...xy(-1.5, 13.3) },
        { name: 'Comilog 처리', country: '가봉', ...xy(-1.4, 13.2) },
      ],
      ir: BASE_IR('ERA.PA'), news: BASE_NEWS('ERA.PA'), x: BASE_X('Eramet'),
    },
    {
      rank: 3, name: 'Assmang (Anglo/ARM JV)', ticker: 'Private', flag: '🇿🇦',
      mktcap: '비상장', detail: '남아공 Kalahari 망간 매장지',
      mines: [
        { name: 'Khumani', country: '남아공 북케이프', ...xy(-27.5, 22.7) },
        { name: 'Beeshoek', country: '남아공', ...xy(-27.7, 23.0) },
      ],
      ir: 'https://www.assmang.co.za', news: BASE_X('Assmang'), x: BASE_X('Assmang'),
    },
    {
      rank: 4, name: 'Consolidated Minerals', ticker: 'Private', flag: '🇦🇺',
      mktcap: '비상장', detail: '호주·가나 망간 생산',
      mines: [
        { name: 'Woodie Woodie', country: '호주 WA', ...xy(-21.7, 121.1) },
        { name: 'Yilgarn', country: '호주 WA', ...xy(-31.1, 119.7) },
      ],
      ir: 'https://www.consolidatedminerals.com.au', news: BASE_X('Consolidated Minerals'), x: BASE_X('Consolidated Minerals'),
    },
    {
      rank: 5, name: 'Graphite India / MOIL', ticker: 'MOIL.NS', flag: '🇮🇳',
      mktcap: '~$1조', detail: '인도 국영 망간 광산',
      mines: [
        { name: 'Balaghat', country: '인도 마디아프라데시', ...xy(21.8, 80.2) },
        { name: 'Dongri Buzurg', country: '인도', ...xy(20.0, 80.4) },
      ],
      ir: BASE_IR('MOIL.NS'), news: BASE_NEWS('MOIL.NS'), x: BASE_X('MOIL India'),
    },
  ],

  // ════════════════════════════════════════
  // 산업 금속
  // ════════════════════════════════════════
  'copper': [
    {
      rank: 1, name: 'BHP', ticker: 'BHP', flag: '🇦🇺',
      mktcap: '~$130조', detail: '칠레 Escondida 세계 최대 구리광산 50% 소유',
      mines: [
        { name: 'Escondida', country: '칠레', ...xy(-24.3, -69.1) },
        { name: 'Olympic Dam', country: '호주 SA', ...xy(-30.4, 136.9) },
        { name: 'Spence', country: '칠레', ...xy(-22.9, -69.6) },
      ],
      ir: BASE_IR('BHP'), news: BASE_NEWS('BHP'), x: BASE_X('BHP'),
    },
    {
      rank: 2, name: 'Freeport-McMoRan', ticker: 'FCX', flag: '🇺🇸',
      mktcap: '~$65조', detail: '인도네시아 Grasberg + 미국·남미 구리',
      mines: [
        { name: 'Grasberg', country: '인도네시아 파푸아', ...xy(-4.1, 137.1) },
        { name: 'Cerro Verde', country: '페루', ...xy(-16.5, -71.5) },
        { name: 'Morenci', country: '미국 애리조나', ...xy(33.1, -109.4) },
      ],
      ir: BASE_IR('FCX'), news: BASE_NEWS('FCX'), x: BASE_X('Freeport-McMoRan'),
    },
    {
      rank: 3, name: 'Codelco', ticker: 'Private', flag: '🇨🇱',
      mktcap: '비상장 (칠레 국영)', detail: '세계 최대 구리 생산 국영기업',
      mines: [
        { name: 'Chuquicamata', country: '칠레', ...xy(-22.3, -68.9) },
        { name: 'El Teniente', country: '칠레', ...xy(-34.1, -70.4) },
        { name: 'Radomiro Tomic', country: '칠레', ...xy(-22.7, -68.9) },
      ],
      ir: 'https://www.codelco.com', news: 'https://www.codelco.com/prensa', x: BASE_X('Codelco'),
    },
    {
      rank: 4, name: 'Glencore', ticker: 'GLEN.L', flag: '🇨🇭',
      mktcap: '~$55조', detail: '콩고·칠레·호주·카자흐스탄 구리',
      mines: [
        { name: 'Collahuasi (지분)', country: '칠레', ...xy(-20.9, -68.6) },
        { name: 'Antapaccay', country: '페루', ...xy(-14.3, -71.4) },
        { name: 'Katanga', country: 'DRC', ...xy(-10.8, 25.2) },
      ],
      ir: BASE_IR('GLEN.L'), news: BASE_NEWS('GLEN.L'), x: BASE_X('Glencore'),
    },
    {
      rank: 5, name: 'Rio Tinto', ticker: 'RIO', flag: '🇦🇺',
      mktcap: '~$100조', detail: '몽골 Oyu Tolgoi 차세대 대형 구리광',
      mines: [
        { name: 'Oyu Tolgoi', country: '몽골', ...xy(42.9, 106.8) },
        { name: 'Escondida (지분)', country: '칠레', ...xy(-24.3, -69.1) },
        { name: 'Kennecott', country: '미국 유타', ...xy(40.5, -112.1) },
      ],
      ir: BASE_IR('RIO'), news: BASE_NEWS('RIO'), x: BASE_X('Rio Tinto'),
    },
    {
      rank: 6, name: 'Southern Copper', ticker: 'SCCO', flag: '🇲🇽',
      mktcap: '~$60조', detail: '멕시코·페루 구리 · Grupo México 계열',
      mines: [
        { name: 'Buenavista (Cananea)', country: '멕시코', ...xy(30.9, -110.3) },
        { name: 'Toquepala', country: '페루', ...xy(-17.3, -70.6) },
        { name: 'Cuajone', country: '페루', ...xy(-17.0, -70.7) },
      ],
      ir: BASE_IR('SCCO'), news: BASE_NEWS('SCCO'), x: BASE_X('Southern Copper'),
    },
    {
      rank: 7, name: 'First Quantum Minerals', ticker: 'FM.TO', flag: '🇨🇦',
      mktcap: '~$8조', detail: '잠비아·파나마·호주 구리',
      mines: [
        { name: 'Kansanshi', country: '잠비아', ...xy(-12.1, 25.9) },
        { name: 'Sentinel', country: '잠비아', ...xy(-12.6, 26.3) },
        { name: 'Cobre Panamá (중단)', country: '파나마', ...xy(8.6, -80.1) },
      ],
      ir: BASE_IR('FM.TO'), news: BASE_NEWS('FM.TO'), x: BASE_X('First Quantum'),
    },
    {
      rank: 8, name: 'Antofagasta', ticker: 'ANTO.L', flag: '🇨🇱',
      mktcap: '~$20조', detail: '칠레 Los Pelambres · Centinela',
      mines: [
        { name: 'Los Pelambres', country: '칠레', ...xy(-31.8, -70.6) },
        { name: 'Centinela', country: '칠레', ...xy(-22.3, -69.3) },
        { name: 'Antucoya', country: '칠레', ...xy(-23.8, -69.9) },
      ],
      ir: BASE_IR('ANTO.L'), news: BASE_NEWS('ANTO.L'), x: BASE_X('Antofagasta'),
    },
    {
      rank: 9, name: 'Teck Resources', ticker: 'TECK', flag: '🇨🇦',
      mktcap: '~$20조', detail: '칠레 QB2 · 캐나다 Highland Valley',
      mines: [
        { name: 'Quebrada Blanca QB2', country: '칠레', ...xy(-20.8, -68.9) },
        { name: 'Highland Valley', country: '캐나다 BC', ...xy(50.5, -121.0) },
        { name: 'Carmen de Andacollo', country: '칠레', ...xy(-30.2, -71.1) },
      ],
      ir: BASE_IR('TECK'), news: BASE_NEWS('TECK'), x: BASE_X('Teck Resources'),
    },
    {
      rank: 10, name: 'KGHM Polska Miedź', ticker: 'KGH.WA', flag: '🇵🇱',
      mktcap: '~$5조', detail: '폴란드 국영 유럽 최대 구리 생산',
      mines: [
        { name: 'Lubin', country: '폴란드', ...xy(51.4, 16.2) },
        { name: 'Sierra Gorda', country: '칠레', ...xy(-22.8, -69.3) },
        { name: 'Robinson', country: '미국 네바다', ...xy(39.2, -115.0) },
      ],
      ir: BASE_IR('KGH.WA'), news: BASE_NEWS('KGH.WA'), x: BASE_X('KGHM'),
    },
  ],

  'iron': [
    {
      rank: 1, name: 'Vale', ticker: 'VALE', flag: '🇧🇷',
      mktcap: '~$50조', detail: '브라질 카라자스 세계 최대 철광석 생산',
      mines: [
        { name: 'Carajás', country: '브라질 파라', ...xy(-6.1, -50.2) },
        { name: 'Itabira', country: '브라질 MG', ...xy(-19.6, -43.2) },
        { name: 'S11D (Eliezer Batista)', country: '브라질', ...xy(-6.4, -50.3) },
      ],
      ir: BASE_IR('VALE'), news: BASE_NEWS('VALE'), x: BASE_X('Vale'),
    },
    {
      rank: 2, name: 'Rio Tinto', ticker: 'RIO', flag: '🇦🇺',
      mktcap: '~$100조', detail: '호주 필바라 Pilbara 세계 최대 철광 지대',
      mines: [
        { name: 'Pilbara Operations', country: '호주 WA', ...xy(-22.8, 119.8) },
        { name: 'Tom Price', country: '호주 WA', ...xy(-22.7, 117.8) },
        { name: 'Simandou (개발중)', country: '기니', ...xy(8.8, -9.3) },
      ],
      ir: BASE_IR('RIO'), news: BASE_NEWS('RIO'), x: BASE_X('Rio Tinto'),
    },
    {
      rank: 3, name: 'BHP', ticker: 'BHP', flag: '🇦🇺',
      mktcap: '~$130조', detail: '필바라 철광석 · WAIO 운영',
      mines: [
        { name: 'Mining Area C', country: '호주 WA', ...xy(-23.0, 119.8) },
        { name: 'Jimblebar', country: '호주 WA', ...xy(-23.3, 119.6) },
        { name: 'Newman', country: '호주 WA', ...xy(-23.4, 119.7) },
      ],
      ir: BASE_IR('BHP'), news: BASE_NEWS('BHP'), x: BASE_X('BHP'),
    },
    {
      rank: 4, name: 'Fortescue', ticker: 'FMG.AX', flag: '🇦🇺',
      mktcap: '~$50조', detail: '필바라 3대 철광 · 녹색수소 투자',
      mines: [
        { name: 'Chichester Hub', country: '호주 WA', ...xy(-22.3, 119.3) },
        { name: 'Solomon Hub', country: '호주 WA', ...xy(-22.6, 119.5) },
        { name: 'Iron Bridge (자철석)', country: '호주 WA', ...xy(-22.9, 119.0) },
      ],
      ir: BASE_IR('FMG.AX'), news: BASE_NEWS('FMG.AX'), x: BASE_X('Fortescue'),
    },
    {
      rank: 5, name: 'ArcelorMittal', ticker: 'MT', flag: '🇱🇺',
      mktcap: '~$20조', detail: '세계 최대 철강사 — 광산~제강 수직계열',
      mines: [
        { name: 'Mont-Wright', country: '캐나다 퀘벡', ...xy(52.9, -67.4) },
        { name: 'Liberia (AMMC)', country: '라이베리아', ...xy(7.4, -10.8) },
      ],
      ir: BASE_IR('MT'), news: BASE_NEWS('MT'), x: BASE_X('ArcelorMittal'),
    },
    {
      rank: 6, name: 'Kumba Iron Ore (Anglo)', ticker: 'KIO.JO', flag: '🇿🇦',
      mktcap: '~$5조', detail: '남아공 Sishen 고품위 철광',
      mines: [
        { name: 'Sishen', country: '남아공', ...xy(-27.8, 23.0) },
        { name: 'Kolomela', country: '남아공', ...xy(-29.4, 22.4) },
      ],
      ir: BASE_IR('KIO.JO'), news: BASE_NEWS('KIO.JO'), x: BASE_X('Kumba Iron Ore'),
    },
    {
      rank: 7, name: 'Champion Iron', ticker: 'CIA.AX', flag: '🇨🇦',
      mktcap: '~$2조', detail: '캐나다 퀘벡 고품위 철광석',
      mines: [
        { name: 'Bloom Lake', country: '캐나다 퀘벡', ...xy(52.5, -66.6) },
      ],
      ir: BASE_IR('CIA.AX'), news: BASE_NEWS('CIA.AX'), x: BASE_X('Champion Iron'),
    },
    {
      rank: 8, name: 'Mineral Resources', ticker: 'MIN.AX', flag: '🇦🇺',
      mktcap: '~$8조', detail: '호주 철광·리튬 다각화',
      mines: [
        { name: 'Yilgarn Hub', country: '호주 WA', ...xy(-30.5, 119.5) },
        { name: 'Iron Valley', country: '호주 WA', ...xy(-22.7, 119.4) },
      ],
      ir: BASE_IR('MIN.AX'), news: BASE_NEWS('MIN.AX'), x: BASE_X('Mineral Resources'),
    },
  ],

  'tungsten': [
    {
      rank: 1, name: 'Xiamen Tungsten', ticker: '600549.SS', flag: '🇨🇳',
      mktcap: '~$5조', detail: '중국 최대 텅스텐 생산·가공',
      mines: [
        { name: 'Jiangxi 광산', country: '중국 장시', ...xy(27.1, 115.0) },
        { name: 'Fujian 가공', country: '중국 푸젠', ...xy(26.1, 119.3) },
      ],
      ir: BASE_IR('600549.SS'), news: BASE_NEWS('600549.SS'), x: BASE_X('Xiamen Tungsten'),
    },
    {
      rank: 2, name: 'China Minmetals Tungsten', ticker: 'Private', flag: '🇨🇳',
      mktcap: '비상장', detail: '중국 5대 텅스텐 국영기업',
      mines: [
        { name: 'Hunan 광산', country: '중국 후난', ...xy(27.6, 111.7) },
      ],
      ir: 'https://www.minmetals.com', news: BASE_X('China Minmetals Tungsten'), x: BASE_X('China Minmetals'),
    },
    {
      rank: 3, name: 'Almonty Industries', ticker: 'AII.TO', flag: '🇨🇦',
      mktcap: '~$0.3조', detail: '한국 상동광산 개발 — 서방 최대 텅스텐 프로젝트',
      mines: [
        { name: '상동광산', country: '한국 강원', ...xy(37.3, 128.9) },
        { name: 'Panasqueira', country: '포르투갈', ...xy(40.1, -7.7) },
        { name: 'Valtreixal', country: '스페인', ...xy(41.9, -6.7) },
      ],
      ir: BASE_IR('AII.TO'), news: BASE_NEWS('AII.TO'), x: BASE_X('Almonty Industries'),
    },
    {
      rank: 4, name: 'Tungsten Mining NL', ticker: 'TGN.AX', flag: '🇦🇺',
      mktcap: '~$0.1조', detail: '호주 NSW 텅스텐 탐사',
      mines: [
        { name: 'Mt Mulgine', country: '호주 WA', ...xy(-26.6, 118.0) },
      ],
      ir: BASE_IR('TGN.AX'), news: BASE_NEWS('TGN.AX'), x: BASE_X('Tungsten Mining'),
    },
    {
      rank: 5, name: 'W Resources', ticker: 'WRES.L', flag: '🇬🇧',
      mktcap: '~$0.1조', detail: '스페인 La Parrilla 텅스텐·주석',
      mines: [
        { name: 'La Parrilla', country: '스페인', ...xy(39.3, -5.7) },
      ],
      ir: BASE_IR('WRES.L'), news: BASE_NEWS('WRES.L'), x: BASE_X('W Resources'),
    },
  ],

  'bauxite': [
    {
      rank: 1, name: 'Alcoa', ticker: 'AA', flag: '🇺🇸',
      mktcap: '~$6조', detail: '호주·브라질·기니 보크사이트 → 알루미나',
      mines: [
        { name: 'Huntly (Darling Range)', country: '호주 WA', ...xy(-32.6, 116.2) },
        { name: 'Juruti', country: '브라질', ...xy(-2.2, -56.1) },
        { name: 'MRN (지분)', country: '브라질', ...xy(-1.5, -56.4) },
      ],
      ir: BASE_IR('AA'), news: BASE_NEWS('AA'), x: BASE_X('Alcoa'),
    },
    {
      rank: 2, name: 'Rio Tinto (Alcan)', ticker: 'RIO', flag: '🇦🇺',
      mktcap: '~$100조', detail: '기니 Simandou 겸 보크사이트 · 캐나다 제련',
      mines: [
        { name: 'Weipa', country: '호주 QLD', ...xy(-12.6, 141.9) },
        { name: 'Gove (Nhulunbuy)', country: '호주 NT', ...xy(-12.2, 136.7) },
      ],
      ir: BASE_IR('RIO'), news: BASE_NEWS('RIO'), x: BASE_X('Rio Tinto'),
    },
    {
      rank: 3, name: 'Emirates Global Aluminium (EGA)', ticker: 'Private', flag: '🇦🇪',
      mktcap: '비상장', detail: 'UAE 국영 · 기니 GAC 보크사이트',
      mines: [
        { name: 'GAC (Guinea Alumina)', country: '기니', ...xy(10.9, -14.3) },
      ],
      ir: 'https://www.ega.ae', news: BASE_X('Emirates Global Aluminium'), x: BASE_X('EGA'),
    },
    {
      rank: 4, name: 'Rusal (En+ Group)', ticker: 'ENPL.ME', flag: '🇷🇺',
      mktcap: '~$8조', detail: '러시아 최대·세계 2위 알루미늄',
      mines: [
        { name: 'Timan (보크사이트)', country: '러시아', ...xy(62.9, 55.8) },
        { name: 'Urals 공장', country: '러시아', ...xy(56.8, 60.6) },
      ],
      ir: BASE_IR('ENPL.ME'), news: BASE_NEWS('ENPL.ME'), x: BASE_X('En+ Rusal'),
    },
    {
      rank: 5, name: 'South32', ticker: 'S32.AX', flag: '🇦🇺',
      mktcap: '~$12조', detail: '호주 보크사이트·알루미나·알루미늄',
      mines: [
        { name: 'Worsley Alumina', country: '호주 WA', ...xy(-33.5, 116.1) },
        { name: 'Brazil Alumina (MRN 지분)', country: '브라질', ...xy(-1.5, -56.4) },
      ],
      ir: BASE_IR('S32.AX'), news: BASE_NEWS('S32.AX'), x: BASE_X('South32'),
    },
  ],

  // ════════════════════════════════════════
  // 첨단 금속
  // ════════════════════════════════════════
  'gallium': [
    {
      rank: 1, name: 'Chinalco (중국알루미늄)', ticker: '601600.SS', flag: '🇨🇳',
      mktcap: '~$10조', detail: '중국 국영 · 갈륨 최대 생산',
      mines: [{ name: '정저우 제련', country: '중국 허난', ...xy(34.7, 113.6) }],
      ir: BASE_IR('601600.SS'), news: BASE_NEWS('601600.SS'), x: BASE_X('Chinalco'),
    },
    {
      rank: 2, name: 'Zhuhai Fangyuan', ticker: 'Private', flag: '🇨🇳',
      mktcap: '비상장', detail: '갈륨 전문 생산 · GaAs 기판 공급',
      mines: [{ name: '주하이 공장', country: '중국 광둥', ...xy(22.3, 113.6) }],
      ir: 'https://www.zhuhaifangyuan.com', news: BASE_X('Zhuhai Fangyuan'), x: BASE_X('Zhuhai Fangyuan'),
    },
    {
      rank: 3, name: 'Vital Metals', ticker: 'VML.AX', flag: '🇦🇺',
      mktcap: '~$0.1조', detail: '캐나다 Nechalacho 갈륨·희토류',
      mines: [{ name: 'Nechalacho', country: '캐나다 NWT', ...xy(62.9, -113.2) }],
      ir: BASE_IR('VML.AX'), news: BASE_NEWS('VML.AX'), x: BASE_X('Vital Metals'),
    },
    {
      rank: 4, name: 'Recylex (Campine)', ticker: 'Private', flag: '🇧🇪',
      mktcap: '비상장', detail: '유럽 유일 갈륨 회수 · 아연 제련 부산물',
      mines: [{ name: 'Beerse 제련소', country: '벨기에', ...xy(51.3, 4.9) }],
      ir: 'https://www.campine.be', news: BASE_X('Campine Belgium'), x: BASE_X('Campine'),
    },
    {
      rank: 5, name: 'Indium Corporation (비상장)', ticker: 'Private', flag: '🇺🇸',
      mktcap: '비상장', detail: '미국 갈륨·인듐 소재 전문',
      mines: [{ name: 'Clinton 가공', country: '미국 뉴욕', ...xy(43.0, -75.4) }],
      ir: 'https://www.indium.com', news: BASE_X('Indium Corporation'), x: BASE_X('Indium Corporation'),
    },
  ],

  'germanium': [
    {
      rank: 1, name: 'Yunnan Germanium', ticker: '002428.SZ', flag: '🇨🇳',
      mktcap: '~$3조', detail: '세계 최대 게르마늄 생산 · 중국 윈난',
      mines: [
        { name: '린창 광산', country: '중국 윈난', ...xy(23.9, 100.1) },
        { name: '자오퉁 아연광', country: '중국 윈난', ...xy(27.3, 103.7) },
      ],
      ir: BASE_IR('002428.SZ'), news: BASE_NEWS('002428.SZ'), x: BASE_X('Yunnan Germanium'),
    },
    {
      rank: 2, name: 'Umicore', ticker: 'UMI.BR', flag: '🇧🇪',
      mktcap: '~$4조', detail: '게르마늄 재활용·정제 유럽 1위',
      mines: [{ name: 'Hoboken 제련', country: '벨기에', ...xy(51.2, 4.3) }],
      ir: BASE_IR('UMI.BR'), news: BASE_NEWS('UMI.BR'), x: BASE_X('Umicore'),
    },
    {
      rank: 3, name: 'Teck Resources', ticker: 'TECK', flag: '🇨🇦',
      mktcap: '~$20조', detail: '아연 제련 부산물 게르마늄 회수',
      mines: [{ name: 'Trail Operations', country: '캐나다 BC', ...xy(49.1, -117.7) }],
      ir: BASE_IR('TECK'), news: BASE_NEWS('TECK'), x: BASE_X('Teck Resources'),
    },
    {
      rank: 4, name: 'Indium Corporation', ticker: 'Private', flag: '🇺🇸',
      mktcap: '비상장', detail: '게르마늄·인듐 소재 미국 전문사',
      mines: [{ name: 'Clinton 가공', country: '미국 뉴욕', ...xy(43.0, -75.4) }],
      ir: 'https://www.indium.com', news: BASE_X('Indium Corporation'), x: BASE_X('Indium Corporation'),
    },
  ],

  'indium': [
    {
      rank: 1, name: 'Korea Zinc', ticker: '010130.KS', flag: '🇰🇷',
      mktcap: '~$7조', detail: '세계 최대 아연 제련 → 인듐 최대 생산',
      mines: [
        { name: '온산제련소', country: '한국 울산', ...xy(35.4, 129.3) },
        { name: 'Sun Metal (호주)', country: '호주 QLD', ...xy(-19.7, 147.1) },
      ],
      ir: BASE_IR('010130.KS'), news: BASE_NEWS('010130.KS'), x: BASE_X('Korea Zinc'),
    },
    {
      rank: 2, name: 'Umicore', ticker: 'UMI.BR', flag: '🇧🇪',
      mktcap: '~$4조', detail: '인듐 재활용·ITO 타깃 소재',
      mines: [{ name: 'Hoboken 제련', country: '벨기에', ...xy(51.2, 4.3) }],
      ir: BASE_IR('UMI.BR'), news: BASE_NEWS('UMI.BR'), x: BASE_X('Umicore'),
    },
    {
      rank: 3, name: 'Nyrstar', ticker: 'Private', flag: '🇧🇪',
      mktcap: '비상장', detail: '아연 제련 인듐 부산 · Trafigura 계열',
      mines: [
        { name: 'Balen 제련소', country: '벨기에', ...xy(51.1, 4.9) },
        { name: 'Budel', country: '네덜란드', ...xy(51.3, 5.6) },
      ],
      ir: 'https://www.nyrstar.com', news: BASE_X('Nyrstar'), x: BASE_X('Nyrstar'),
    },
    {
      rank: 4, name: 'Dowa Holdings', ticker: '5714.T', flag: '🇯🇵',
      mktcap: '~$2조', detail: '일본 인듐 회수·ITO 소재 공급',
      mines: [{ name: '아키타 제련소', country: '일본 아키타', ...xy(39.7, 140.1) }],
      ir: BASE_IR('5714.T'), news: BASE_NEWS('5714.T'), x: BASE_X('Dowa Holdings'),
    },
  ],

  'sand': [
    {
      rank: 1, name: 'U.S. Silica', ticker: 'SLCA', flag: '🇺🇸',
      mktcap: '~$2조', detail: '미국 최대 규사 생산 · 오일샌드·유리',
      mines: [
        { name: 'Ottawa (IL)', country: '미국 일리노이', ...xy(41.3, -88.8) },
        { name: 'Sparta (WI)', country: '미국 위스콘신', ...xy(43.9, -90.8) },
        { name: 'Lovelock (NV)', country: '미국 네바다', ...xy(40.2, -118.5) },
      ],
      ir: BASE_IR('SLCA'), news: BASE_NEWS('SLCA'), x: BASE_X('US Silica'),
    },
    {
      rank: 2, name: 'Sibelco', ticker: 'Private', flag: '🇧🇪',
      mktcap: '비상장', detail: '글로벌 규사 1위 · 40개국 운영',
      mines: [
        { name: 'Mol (벨기에)', country: '벨기에', ...xy(51.2, 5.1) },
        { name: 'Frechen (독일)', country: '독일', ...xy(50.9, 6.8) },
      ],
      ir: 'https://www.sibelco.com', news: BASE_X('Sibelco'), x: BASE_X('Sibelco'),
    },
    {
      rank: 3, name: 'Fairmount Santrol (Covia)', ticker: 'Private', flag: '🇺🇸',
      mktcap: '비상장', detail: '미국 프래킹·유리용 규사',
      mines: [
        { name: 'Wedron (IL)', country: '미국 일리노이', ...xy(41.5, -88.7) },
      ],
      ir: 'https://www.coviaholdings.com', news: BASE_X('Covia Holdings'), x: BASE_X('Covia'),
    },
    {
      rank: 4, name: 'Emerge Energy Services', ticker: 'Private', flag: '🇺🇸',
      mktcap: '비상장', detail: '텍사스·위스콘신 고품위 규사',
      mines: [
        { name: 'Superior Silica Sands (WI)', country: '미국 위스콘신', ...xy(44.5, -91.4) },
      ],
      ir: 'https://www.emergeenergy.com', news: BASE_X('Emerge Energy'), x: BASE_X('Emerge Energy'),
    },
    {
      rank: 5, name: 'VRX Silica', ticker: 'VRX.AX', flag: '🇦🇺',
      mktcap: '~$0.2조', detail: '호주 고순도 규사 — 반도체·태양광용',
      mines: [
        { name: 'Arrowsmith North', country: '호주 WA', ...xy(-29.5, 115.1) },
      ],
      ir: BASE_IR('VRX.AX'), news: BASE_NEWS('VRX.AX'), x: BASE_X('VRX Silica'),
    },
  ],

  // ════════════════════════════════════════
  // 에너지 자원
  // ════════════════════════════════════════

  /* ── 석유 ── */
  oil: [
    {
      rank: 1, staticRank: 1,
      name: 'Saudi Aramco (أرامكو)', ticker: '2222.SR', flag: '🇸🇦',
      mktcap: '~$1,800조', detail: '세계 최대 석유회사 — 확인매장량 2,600억 배럴',
      note: 'Tadawul 상장, FMP 미지원 → 시총 하드코딩',
      mines: [
        { name: 'Ghawar Field', country: '사우디 동부주', ...xy(24.8, 49.2) },
        { name: 'Safaniya Field', country: '사우디 페르시아만', ...xy(27.9, 48.7) },
        { name: 'Shaybah Field', country: '사우디 루브알할리', ...xy(22.5, 54.0) },
      ],
      ir: 'https://www.aramco.com/en/investors', news: BASE_X('Saudi Aramco'), x: BASE_X('Saudi Aramco'),
    },
    {
      rank: 2, name: 'ExxonMobil', ticker: 'XOM', flag: '🇺🇸',
      mktcap: '~$500조', detail: '美 최대 메이저 — 퍼미안·가이아나·LNG',
      mines: [
        { name: 'Permian Basin', country: '미국 텍사스', ...xy(31.5, -103.0) },
        { name: 'Stabroek Block', country: '가이아나', ...xy(7.0, -58.0) },
        { name: 'Mozambique LNG', country: '모잠비크', ...xy(-13.0, 40.7) },
      ],
      ir: BASE_IR('XOM'), news: BASE_NEWS('XOM'), x: BASE_X('ExxonMobil'),
    },
    {
      rank: 3, name: 'Chevron', ticker: 'CVX', flag: '🇺🇸',
      mktcap: '~$280조', detail: '카자흐스탄 텡기즈·퍼미안·호주 LNG',
      mines: [
        { name: 'Tengiz Field', country: '카자흐스탄', ...xy(45.5, 53.1) },
        { name: 'Permian Basin', country: '미국 텍사스', ...xy(32.0, -102.0) },
        { name: 'Gorgon LNG', country: '호주 WA', ...xy(-22.0, 114.0) },
      ],
      ir: BASE_IR('CVX'), news: BASE_NEWS('CVX'), x: BASE_X('Chevron'),
    },
    {
      rank: 4, name: 'Shell', ticker: 'SHEL', flag: '🇬🇧',
      mktcap: '~$230조', detail: '세계 최대 LNG 거래 — 심해유전·풍력·충전',
      mines: [
        { name: 'Prelude FLNG', country: '호주 북서', ...xy(-14.0, 123.5) },
        { name: 'Brent Field', country: '영국 북해', ...xy(61.0, 1.7) },
        { name: 'Pearl GTL', country: '카타르', ...xy(25.1, 51.5) },
      ],
      ir: BASE_IR('SHEL'), news: BASE_NEWS('SHEL'), x: BASE_X('Shell'),
    },
    {
      rank: 5, name: 'BP', ticker: 'BP', flag: '🇬🇧',
      mktcap: '~$100조', detail: '북해·아제르바이잔 ACG·이라크 루마일라',
      mines: [
        { name: 'ACG Field', country: '아제르바이잔', ...xy(40.6, 50.4) },
        { name: 'Rumaila Field', country: '이라크', ...xy(30.4, 47.4) },
        { name: 'Clair Field', country: '영국 북해', ...xy(60.4, -1.8) },
      ],
      ir: BASE_IR('BP'), news: BASE_NEWS('BP'), x: BASE_X('BP'),
    },
    {
      rank: 6, staticRank: 2,
      name: '中国石油 PetroChina', ticker: '601857.SS', flag: '🇨🇳',
      mktcap: '~$220조', detail: '중국 최대 E&P — 다칭·신장·중앙아시아 파이프라인',
      note: 'SSE 상장(A주), FMP 미지원 → 시총 하드코딩',
      mines: [
        { name: 'Daqing Oil Field', country: '중국 헤이룽장', ...xy(46.6, 125.0) },
        { name: 'Tarim Basin', country: '중국 신장', ...xy(39.0, 83.0) },
        { name: 'Karamay Field', country: '중국 신장', ...xy(45.6, 84.9) },
      ],
      ir: 'https://www.petrochina.com.cn', news: BASE_X('PetroChina'), x: BASE_X('PetroChina'),
    },
    {
      rank: 7, name: 'TotalEnergies', ticker: 'TTE', flag: '🇫🇷',
      mktcap: '~$160조', detail: '프랑스 메이저 — 아프리카·LNG·재생에너지',
      mines: [
        { name: 'Kashagan Field', country: '카자흐스탄', ...xy(45.4, 52.8) },
        { name: 'Egina Field', country: '나이지리아 심해', ...xy(3.6, 5.0) },
        { name: 'Papua LNG', country: '파푸아뉴기니', ...xy(-6.3, 144.0) },
      ],
      ir: BASE_IR('TTE'), news: BASE_NEWS('TTE'), x: BASE_X('TotalEnergies'),
    },
    {
      rank: 8, staticRank: 3,
      name: 'Rosneft (Роснефть)', ticker: 'ROSN.ME', flag: '🇷🇺',
      mktcap: '~$60조', detail: '러시아 최대 석유사 — 서시베리아·사할린',
      note: '모스크바 거래소 상장, 서방 제재로 시총 불안정 → 하드코딩',
      mines: [
        { name: 'Yuganskneftegas', country: '러시아 서시베리아', ...xy(61.1, 72.4) },
        { name: 'Vankor Field', country: '러시아 크라스노야르스크', ...xy(67.0, 83.3) },
        { name: 'Sakhalin-1', country: '러시아 사할린', ...xy(52.5, 143.0) },
      ],
      ir: 'https://www.rosneft.com/Investors/', news: BASE_X('Rosneft'), x: BASE_X('Rosneft'),
    },
    {
      rank: 9, name: 'ConocoPhillips', ticker: 'COP', flag: '🇺🇸',
      mktcap: '~$130조', detail: '미국 최대 독립계 E&P — 알래스카·퍼미안·노르웨이',
      mines: [
        { name: 'Willow Project', country: '미국 알래스카', ...xy(70.3, -152.0) },
        { name: 'Eagle Ford', country: '미국 텍사스', ...xy(28.8, -99.0) },
        { name: 'Ekofisk Field', country: '노르웨이 북해', ...xy(56.5, 3.2) },
      ],
      ir: BASE_IR('COP'), news: BASE_NEWS('COP'), x: BASE_X('ConocoPhillips'),
    },
    {
      rank: 10, name: 'Equinor', ticker: 'EQNR', flag: '🇳🇴',
      mktcap: '~$80조', detail: '노르웨이 국영 — 북해 최대 운영사, 해상 풍력 선도',
      mines: [
        { name: 'Johan Sverdrup', country: '노르웨이 북해', ...xy(58.9, 2.4) },
        { name: 'Sleipner Field', country: '노르웨이 북해', ...xy(58.4, 1.9) },
        { name: 'Snøhvit LNG', country: '노르웨이 바렌츠해', ...xy(71.3, 22.2) },
      ],
      ir: BASE_IR('EQNR'), news: BASE_NEWS('EQNR'), x: BASE_X('Equinor'),
    },
  ],

  /* ── 천연가스 ── */
  naturalgas: [
    {
      rank: 1, staticRank: 1,
      name: 'Gazprom (Газпром)', ticker: 'GAZP.ME', flag: '🇷🇺',
      mktcap: '~$50조', detail: '세계 최대 천연가스 매장량 — 시베리아~유럽 파이프라인',
      note: '모스크바 거래소 상장, 서방 제재로 데이터 제한 → 하드코딩',
      mines: [
        { name: 'Urengoy Gas Field', country: '러시아 서시베리아', ...xy(66.1, 76.6) },
        { name: 'Yamburg Field', country: '러시아 야말', ...xy(67.9, 75.1) },
        { name: 'Bovanenkovo Field', country: '러시아 야말반도', ...xy(70.3, 68.2) },
      ],
      ir: 'https://www.gazprom.com/investors/', news: BASE_X('Gazprom'), x: BASE_X('Gazprom'),
    },
    {
      rank: 2, name: 'QatarEnergy', ticker: 'Private', flag: '🇶🇦',
      mktcap: '비상장 (국영)', detail: '세계 최대 LNG 수출국 — 노스돔 세계 최대 가스전',
      mines: [
        { name: 'North Dome Field', country: '카타르', ...xy(25.9, 51.8) },
        { name: 'Ras Laffan LNG', country: '카타르', ...xy(25.9, 51.6) },
      ],
      ir: 'https://www.qatarenergy.qa', news: BASE_X('QatarEnergy'), x: BASE_X('QatarEnergy'),
    },
    {
      rank: 3, name: 'ExxonMobil', ticker: 'XOM', flag: '🇺🇸',
      mktcap: '~$500조', detail: '퍼미안 연계 가스·LNG·Papua New Guinea',
      mines: [
        { name: 'PNG LNG', country: '파푸아뉴기니', ...xy(-6.5, 143.8) },
        { name: 'Permian Gas', country: '미국 텍사스', ...xy(31.5, -103.0) },
      ],
      ir: BASE_IR('XOM'), news: BASE_NEWS('XOM'), x: BASE_X('ExxonMobil'),
    },
    {
      rank: 4, name: 'Shell', ticker: 'SHEL', flag: '🇬🇧',
      mktcap: '~$230조', detail: '세계 1위 LNG 트레이더 — Prelude FLNG',
      mines: [
        { name: 'Prelude FLNG', country: '호주 북서', ...xy(-14.0, 123.5) },
        { name: 'QGC (Queensland)', country: '호주 퀸즐랜드', ...xy(-26.5, 150.5) },
      ],
      ir: BASE_IR('SHEL'), news: BASE_NEWS('SHEL'), x: BASE_X('Shell'),
    },
    {
      rank: 5, name: 'Chevron', ticker: 'CVX', flag: '🇺🇸',
      mktcap: '~$280조', detail: '고르곤·휘트스톤 LNG — 호주 최대 LNG',
      mines: [
        { name: 'Gorgon LNG', country: '호주 WA', ...xy(-22.0, 114.0) },
        { name: 'Wheatstone LNG', country: '호주 WA', ...xy(-21.5, 115.0) },
      ],
      ir: BASE_IR('CVX'), news: BASE_NEWS('CVX'), x: BASE_X('Chevron'),
    },
    {
      rank: 6, name: 'TotalEnergies', ticker: 'TTE', flag: '🇫🇷',
      mktcap: '~$160조', detail: '모잠비크·카타르·호주 LNG 포트폴리오',
      mines: [
        { name: 'Mozambique LNG', country: '모잠비크', ...xy(-13.0, 40.7) },
        { name: 'Ichthys LNG', country: '호주 NT', ...xy(-14.5, 124.0) },
      ],
      ir: BASE_IR('TTE'), news: BASE_NEWS('TTE'), x: BASE_X('TotalEnergies'),
    },
    {
      rank: 7, name: 'Equinor', ticker: 'EQNR', flag: '🇳🇴',
      mktcap: '~$80조', detail: '스노히트 LNG·슬라이프너 CCS',
      mines: [
        { name: 'Snøhvit LNG', country: '노르웨이 바렌츠해', ...xy(71.3, 22.2) },
        { name: 'Troll Field', country: '노르웨이 북해', ...xy(60.6, 3.7) },
      ],
      ir: BASE_IR('EQNR'), news: BASE_NEWS('EQNR'), x: BASE_X('Equinor'),
    },
    {
      rank: 8, name: 'Woodside Energy', ticker: 'WDS', flag: '🇦🇺',
      mktcap: '~$30조', detail: '호주 LNG 선두 — Pluto·Northwest Shelf',
      mines: [
        { name: 'Pluto LNG', country: '호주 WA', ...xy(-20.6, 116.7) },
        { name: 'Northwest Shelf', country: '호주 WA', ...xy(-20.3, 116.8) },
      ],
      ir: BASE_IR('WDS'), news: BASE_NEWS('WDS'), x: BASE_X('Woodside Energy'),
    },
    {
      rank: 9, staticRank: 2,
      name: 'NOVATEK (НОВАТЭК)', ticker: 'NVTK.ME', flag: '🇷🇺',
      mktcap: '~$40조', detail: '러시아 독립 가스사 — 야말 LNG·Arctic LNG 2',
      note: '모스크바 거래소 상장, 서방 제재 영향 → 하드코딩',
      mines: [
        { name: 'Yamal LNG', country: '러시아 야말반도', ...xy(71.4, 72.3) },
        { name: 'Arctic LNG 2', country: '러시아 기단반도', ...xy(71.8, 82.0) },
      ],
      ir: 'https://www.novatek.ru/en/investors/', news: BASE_X('NOVATEK'), x: BASE_X('NOVATEK'),
    },
    {
      rank: 10, name: 'ConocoPhillips', ticker: 'COP', flag: '🇺🇸',
      mktcap: '~$130조', detail: '알래스카 LNG·퍼미안 가스 연계',
      mines: [
        { name: 'Alaska LNG Project', country: '미국 알래스카', ...xy(70.3, -152.0) },
        { name: 'Montney (Canada)', country: '캐나다 BC주', ...xy(56.0, -122.0) },
      ],
      ir: BASE_IR('COP'), news: BASE_NEWS('COP'), x: BASE_X('ConocoPhillips'),
    },
  ],

  /* ── 석탄 ── */
  coal: [
    {
      rank: 1, staticRank: 1,
      name: '中国神华 China Shenhua', ticker: '601088.SS', flag: '🇨🇳',
      mktcap: '~$100조', detail: '세계 최대 석탄 생산사 — 내몽골·산시성 열탄',
      note: 'SSE 상장(A주), FMP 미지원 → 시총 하드코딩',
      mines: [
        { name: 'Shendong Mine', country: '중국 내몽골/산시', ...xy(39.4, 110.5) },
        { name: 'Wanli Mine', country: '중국 내몽골', ...xy(40.2, 111.8) },
      ],
      ir: 'https://www.csec.com', news: BASE_X('China Shenhua'), x: BASE_X('China Shenhua'),
    },
    {
      rank: 2, name: 'Coal India', ticker: 'COALINDIA.NS', flag: '🇮🇳',
      mktcap: '~$30조', detail: '세계 최대 석탄 채굴 기업 — 인도 정부 소유 90%',
      mines: [
        { name: 'Jharia Coalfield', country: '인도 자르칸드', ...xy(23.7, 86.4) },
        { name: 'Korba Coalfield', country: '인도 차티스가르', ...xy(22.4, 82.7) },
        { name: 'Singareni Collieries', country: '인도 텔랑가나', ...xy(17.9, 80.1) },
      ],
      ir: BASE_IR('COALINDIA.NS'), news: BASE_NEWS('COALINDIA.NS'), x: BASE_X('Coal India'),
    },
    {
      rank: 3, name: 'Glencore', ticker: 'GLEN.L', flag: '🇨🇭',
      mktcap: '~$60조', detail: '세계 최대 석탄 트레이더 — 호주·콜롬비아·남아공',
      mines: [
        { name: 'Hail Creek Mine', country: '호주 퀸즐랜드', ...xy(-21.5, 148.3) },
        { name: 'Cerrejón Mine', country: '콜롬비아', ...xy(11.1, -72.7) },
        { name: 'Prodeco Mine', country: '콜롬비아', ...xy(10.5, -73.5) },
      ],
      ir: BASE_IR('GLEN.L'), news: BASE_NEWS('GLEN.L'), x: BASE_X('Glencore'),
    },
    {
      rank: 4, name: 'Peabody Energy', ticker: 'BTU', flag: '🇺🇸',
      mktcap: '~$4조', detail: '美 최대 석탄사 — 와이오밍 파우더리버·호주 메탈코크',
      mines: [
        { name: 'North Antelope Rochelle', country: '미국 와이오밍', ...xy(43.8, -105.4) },
        { name: 'Wilpinjong Mine', country: '호주 NSW', ...xy(-32.5, 149.8) },
      ],
      ir: BASE_IR('BTU'), news: BASE_NEWS('BTU'), x: BASE_X('Peabody Energy'),
    },
    {
      rank: 5, name: 'Yancoal Australia', ticker: 'YAL.AX', flag: '🇦🇺',
      mktcap: '~$5조', detail: '호주 최대 순수 석탄사 — 헌터밸리·NSW 열탄',
      mines: [
        { name: 'Hunter Valley Ops', country: '호주 NSW', ...xy(-32.4, 151.0) },
        { name: 'Mount Thorley', country: '호주 NSW', ...xy(-32.7, 151.2) },
      ],
      ir: BASE_IR('YAL.AX'), news: BASE_NEWS('YAL.AX'), x: BASE_X('Yancoal'),
    },
    {
      rank: 6, name: 'Whitehaven Coal', ticker: 'WHC.AX', flag: '🇦🇺',
      mktcap: '~$7조', detail: '호주 고품위 반무연탄 — 아시아 수출 전문',
      mines: [
        { name: 'Narrabri Mine', country: '호주 NSW', ...xy(-30.3, 149.7) },
        { name: 'Maules Creek Mine', country: '호주 NSW', ...xy(-30.5, 150.2) },
      ],
      ir: BASE_IR('WHC.AX'), news: BASE_NEWS('WHC.AX'), x: BASE_X('Whitehaven Coal'),
    },
    {
      rank: 7, name: 'Arch Resources', ticker: 'ARCH', flag: '🇺🇸',
      mktcap: '~$3조', detail: '미국 메탈코킹콜 선두 — 와이오밍·웨스트버지니아',
      mines: [
        { name: 'Black Thunder Mine', country: '미국 와이오밍', ...xy(43.5, -105.2) },
        { name: 'Leer Mine (WV)', country: '미국 웨스트버지니아', ...xy(39.5, -80.5) },
      ],
      ir: BASE_IR('ARCH'), news: BASE_NEWS('ARCH'), x: BASE_X('Arch Resources'),
    },
    {
      rank: 8, name: 'South32', ticker: 'S32.AX', flag: '🇦🇺',
      mktcap: '~$11조', detail: '호주·남아공 석탄+알루미늄+아연 다각화',
      mines: [
        { name: 'Illawarra Metallurgical Coal', country: '호주 NSW', ...xy(-34.4, 150.9) },
        { name: 'South Africa Energy Coal', country: '남아공', ...xy(-26.3, 29.5) },
      ],
      ir: BASE_IR('S32.AX'), news: BASE_NEWS('S32.AX'), x: BASE_X('South32'),
    },
    {
      rank: 9, staticRank: 2,
      name: 'SUEK (СУЭК)', ticker: 'Private', flag: '🇷🇺',
      mktcap: '비상장', detail: '러시아 최대 석탄사 — 시베리아 크라스노야르스크',
      note: '비상장 러시아 국영기업',
      mines: [
        { name: 'Borodinsky Mine', country: '러시아 크라스노야르스크', ...xy(55.9, 94.0) },
        { name: 'Tugnuisky Mine', country: '러시아 부랴티아', ...xy(51.1, 107.2) },
      ],
      ir: 'https://www.suek.com', news: BASE_X('SUEK Coal'), x: BASE_X('SUEK'),
    },
    {
      rank: 10, name: 'CONSOL Energy', ticker: 'CEIX', flag: '🇺🇸',
      mktcap: '~$4조', detail: '애팔래치아 고품위 석탄 — 수출 전문',
      mines: [
        { name: 'Pennsylvania Mining Complex', country: '미국 펜실베이니아', ...xy(40.0, -80.0) },
      ],
      ir: BASE_IR('CEIX'), news: BASE_NEWS('CEIX'), x: BASE_X('CONSOL Energy'),
    },
  ],
};

