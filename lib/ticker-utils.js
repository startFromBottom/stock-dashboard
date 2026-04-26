/**
 * 각 거래소별 ticker를 FMP가 인식하는 형식으로 정규화합니다.
 * FMP는 미국 / 일부 국제 ticker를 지원하지만, "TYO:9613" 같은 자체 형식은 변환 필요.
 */
const TICKER_NORMALIZE = {
  // 일본
  'TYO:9613': '9613.T',    // NTT Data
  'TYO:285A': '285A.T',    // Kioxia
  '5802.T':   '5802.T',    // Sumitomo Electric
  // 홍콩
  'HKG:0992': '0992.HK',   // Lenovo
  // 대만
  'TPE:2317': '2317.TW',   // Foxconn
  '2382.TW':  '2382.TW',   // Quanta Computer
  '6669.TW':  '6669.TW',   // Wiwynn
  '2376.TW':  '2376.TW',   // Gigabyte
  '2357.TW':  '2357.TW',   // ASUS
  '2454.TW':  '2454.TW',   // MediaTek
  '2408.TW':  '2408.TW',   // Nanya Tech
  '2344.TW':  '2344.TW',   // Winbond
  // 한국
  '000660.KS': '000660.KS', // SK Hynix
  '005930.KS': '005930.KS', // Samsung
  '000977.SZ': '000977.SZ', // Inspur (중국)
  // 중국
  '300502.SZ': '300502.SZ', // Eoptolink
  '002281.SZ': '002281.SZ', // Accelink
  '301390.SZ': '301390.SZ', // HG Genuine
  // 유럽 (FMP 지원 여부 불확실 → 시도는 함)
  'SU.PA':    'SU.PA',      // Schneider Electric
  'LR.PA':    'LR.PA',      // Legrand
  'ENR.DE':   'ENR.DE',     // Siemens Energy
  'ABBN.SW':  'ABBN.SW',    // ABB
  'ALFA.ST':  'ALFA.ST',    // Alfa Laval
  'SKAB.ST':  'SKAB.ST',    // Skanska
  // 한국/대만 ADR 등 이미 US ticker인 것은 그대로
};

/**
 * ticker를 FMP 호환 형식으로 변환합니다.
 * 변환 불가 / 비상장이면 null 반환.
 */
export function normalizeTicker(raw) {
  if (!raw || raw === 'Private' || raw === '비상장 (국영)' || raw === '(AMD 합산)') return null;
  // 모스크바 거래소(.ME), 사우디 타다울(.SR) → FMP 미지원
  if (raw.endsWith('.ME') || raw.endsWith('.SR')) return null;
  return TICKER_NORMALIZE[raw] ?? raw;
}

/**
 * companies 배열에서 FMP로 조회 가능한 ticker 목록을 반환합니다.
 */
export function extractPublicTickers(companies) {
  const set = new Set();
  for (const c of companies) {
    const t = normalizeTicker(c.ticker);
    if (t) set.add(t);
  }
  return [...set];
}

/**
 * FMP에서 받은 USD 시가총액 원시값을 한국식 표기로 변환합니다.
 * 예: 2_700_000_000_000 → "~$2.7조"
 *     500_000_000_000   → "~$5000억"
 */
export function formatMktcap(usd) {
  if (!usd || usd <= 0) return null;
  const jo  = usd / 1e12;   // 1조 = 1 trillion
  const eok = usd / 1e8;    // 1억 = 100 million
  if (jo >= 0.5) {
    // 0.5조 이상 → X.X조
    return `~$${parseFloat(jo.toFixed(1))}조`;
  }
  if (eok >= 10) {
    // 10억 이상 → 반올림 10억 단위
    return `~$${Math.round(eok / 10) * 10}억`;
  }
  return `~$${Math.round(eok)}억`;
}
