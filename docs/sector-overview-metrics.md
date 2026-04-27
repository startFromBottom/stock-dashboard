# Sector Overview — 지표 로직 명세서

> 첫 화면 "전체 전망"의 7개 섹터 카드에 표시되는 지표들이 어떤 데이터로 어떻게 계산되는지 정리한 문서.
> 코드 위치: `app/api/sector-overview/route.js` (계산), `components/SectorOverview.jsx` (분류·표시)

---

## 0. 데이터 소스 개요

모든 지표는 **Finnhub** API 한 곳에서 가져온다. **무료 플랜에서 가용한 두 엔드포인트**만 사용한다 — `/stock/candle`은 무료 플랜에서 차단됐기 때문에 **사용하지 않는다**.

| 엔드포인트 | 용도 | 가용 |
|---|---|---|
| `GET /quote?symbol=...` | 1D 등락률, 현재가, 전일종가 | ✅ 무료 |
| `GET /stock/metric?symbol=...&metric=all` | 시총, PER, 기간별 수익률, 변동성, 평균거래량, 52주 가격대, beta | ✅ 무료 |
| ~~`GET /stock/candle`~~ | 일봉 캔들 (종가·거래량) | ❌ 유료 전용 |

### 캐시 전략

- **응답 전체 캐시 (15분)** — 모든 섹터에 회사 데이터가 채워진 경우(`X-Filled: full`)에만 유지. 부분 결측 시(`X-Filled: partial`)엔 캐시 안 함 → 다음 호출에서 누락분 재시도.
- **ticker별 개별 캐시 (15분)** — 어떤 ticker가 429 등으로 실패해도 다음 호출에 누락분만 재요청. 이미 받은 ticker는 재호출 안 함.
- **클라이언트 캐시 (15분)** — `useSectorOverview` 훅 내 메모리 캐시.

### 호출 부하

- ETF 7개(중복 제외 시 7개) × 2 req(quote+metric) = 14 req
- 회사 ~30개 (섹터당 5개 × 6섹터, raw 제외, 중복 제거) × 2 req = ~60 req
- batch 3 ticker × 1.5초 간격으로 분산 → 첫 호출 시 약 15~20초.
- Finnhub 무료 60 req/min 한도 안전권.

### 섹터 → 대표 ETF 매핑

각 섹터의 `SECTOR_ETFS` 배열 **첫 번째**가 대표 ETF로 자동 선정된다 (`data/etfs.js`).

| 섹터 | 대표 ETF |
|---|---|
| AI 데이터센터 (`ai-dc`) | SMH (VanEck Semiconductor) |
| 반도체 (`semi`) | SMH |
| 우주 (`space`) | UFO (Procure Space) |
| 원자재 (`raw`) | GDX (VanEck Gold Miners) |
| 에너지 (`energy`) | XLE (Energy Select Sector SPDR) |
| 바이오테크 (`biotech`) | IBB (iShares Biotechnology) |
| 핀테크 (`fintech`) | FINX (Global X FinTech) |

### 섹터 → 회사 ticker 풀

섹터당 **최대 5개**, 미국 상장 ticker만. `LAYERS → components → candidates` (또는 `companies`) rank 1~10에서 추출.

> **원자재 섹터(`raw`)는 회사 ticker 풀이 비어 있다.** 데이터 구조(`RAW_COMPANIES`)가 광물별 객체라 평탄화 규칙이 다르고, 섹터 ETF(GDX) 자체가 회사 가중을 잘 대표하기 때문. 카드의 "Top N 가중"·"PER" 행은 "—"로 표시된다.

---

## 1. 기간별 수익률 (1D / 5D / MTD / 3M / YTD / 1Y)

시간축 토글로 6개 기간 중 하나를 선택.

### 데이터

| 기간 | 출처 | Finnhub 필드 |
|---|---|---|
| **1D**  | `/quote` | `dp` (daily percent change) |
| **5D**  | `/stock/metric` | `5DayPriceReturnDaily` |
| **MTD** | `/stock/metric` | `monthToDatePriceReturnDaily` |
| **3M**  | `/stock/metric` | `13WeekPriceReturnDaily` |
| **YTD** | `/stock/metric` | `yearToDatePriceReturnDaily` |
| **1Y**  | `/stock/metric` | `52WeekPriceReturnDaily` |

> 기존 `/stock/candle`로 자체 계산하던 방식에서 Finnhub의 사전계산 필드로 전환. 데이터 신뢰성은 Finnhub의 공식 산출 방식을 그대로 따름.

### 표시
숫자 색상으로 방향 표시:
- 양수(`+0.05` 초과) → 녹색 (`#4ade80`)
- 음수(`-0.05` 미만) → 빨강 (`#f87171`)
- 그 사이 → 회색

### 한계
- **5D는 영업일 기준 5일**, MTD는 월초 대비, 3M은 13주(영업일 기준) — Finnhub 정의를 그대로 따름.
- Finnhub의 `xxxPriceReturnDaily` 필드는 보통 매 거래일 종료 후 갱신됨. 장 중 실시간성은 1D만 보장.

---

## 2. Top N 시총 가중 등락 (오늘)

### 데이터
- 섹터의 미국 ticker 풀 (최대 5개)
- 각 ticker의 `quote.dp` (일간 등락률 %) — `/quote`
- 각 ticker의 `metric.marketCapitalization` (백만 USD) — `/stock/metric`

### 계산
표준 시총 가중 평균.

```
weighted_pct = Σ (changePct_i × marketCap_i) / Σ marketCap_i
```

`changePct`나 `marketCap` 둘 중 하나라도 없는 ticker는 합산에서 제외. 카드 라벨의 `Top {N} 가중`에서 N은 **실제로 합산에 사용된 회사 수** (`companiesUsed`).

### 의미
- ETF 수익률은 펀드의 가중 방식을 따라가지만, 이 값은 본 대시보드가 정의한 "섹터 핵심 회사들"의 가중 평균. ETF가 못 잡는 종목 구성의 미세 차이를 드러냄.
- ETF 1D 수익률과 이 값의 괴리가 크면 "ETF가 담지 못한 종목"이 그날 시장과 다르게 움직였다는 신호.

### 한계
- **항상 1D 기준** (시간축 토글과 무관). 회사별 historical 종가는 metric에 없음.
- 미국 상장만 잡으므로 ADR이 없는 외국 본주는 빠짐.
- 원자재 섹터는 풀이 비어서 항상 "—".

---

## 3. 모멘텀 신호 (이모지 배지)

### 데이터
대표 ETF의 **3개월 수익률** (`13WeekPriceReturnDaily`).

### 분류

| 조건 | 배지 | 의미 |
|---|---|---|
| `3M ≥ +20%` | 🔥 강세 | 강한 추세 매수 신호 |
| `+5% ≤ 3M < +20%` | 📈 상승 | 완만한 상승 |
| `-5% ≤ 3M < +5%` | ➡️ 보합 | 횡보 |
| `-20% ≤ 3M < -5%` | 📉 하락 | 완만한 하락 |
| `3M < -20%` | ❄️ 약세 | 강한 추세 매도 신호 |

### 표시
카드 우상단 라운드 배지 + 카드 좌측 보더 색도 같은 톤.

### 의미
- 시간축 토글이 무엇이든 **모멘텀은 항상 3M 기준**. 1M은 노이즈 큼, 6M+ 은 너무 느림.
- 카드 그리드를 훑을 때 "🔥/❄️"가 시선을 먼저 잡도록 하는 정체성 표시.

---

## 4. 밸류에이션 게이지

### 데이터
섹터 미국 ticker 풀 각각의 `metric.peNormalizedAnnual` (없으면 `peTTM` → `peExclExtraTTM` 폴백). 음수·결측·`> 200`인 값은 노이즈로 간주해 제외.

### 계산

```
sectorPeMedian = median(filtered_pe_values)
```

**중앙값**을 쓰는 이유: 섹터에 PER 200+ 의 고성장주(예: 신흥 AI 회사) 한두 개가 끼면 평균이 망가진다. 중앙값은 outlier에 강건.

### 게이지 위치 매핑

PER 절대값을 0~60 범위에 매핑 → 0~100% 위치.

```
position = min(100, max(0, (PE / 60) × 100))
```

### 분류

| PER | 라벨 | 색상 |
|---|---|---|
| `< 15` | 저평가 | 그린 그라디언트 |
| `15 ≤ PER < 25` | 적정 | 옐로우 그린 |
| `25 ≤ PER < 40` | 고평가 | 오렌지 |
| `≥ 40` | 거품권 | 레드 |

### 한계 — 중요
- **섹터별 정상 PER 범위가 다르다.** 바이오·기술은 본질적으로 PER이 높고, 에너지·금융은 낮다. 절대값 기준은 거친 휴리스틱.
- 더 정확하려면 각 섹터의 자기 5년 PER 분포 백분위가 필요. 향후 개선 후보.
- 적자 회사는 PER이 음수/N/A → 필터에서 빠짐 → 적자 비중 높은 섹터(우주·일부 바이오)는 표본 작아 신뢰도 낮음.

---

## 5. 거래 활성도 (10일 평균 ÷ 3개월 평균 거래량)

### 데이터
대표 ETF의 `metric.10DayAverageTradingVolume` 과 `metric.3MonthAverageTradingVolume`. (Finnhub가 사전 계산해서 줌, 단위는 백만주)

### 계산

```
ratio = 10DayAverageTradingVolume / 3MonthAverageTradingVolume
```

### 분류

| ratio | 라벨 | 톤 | 의미 |
|---|---|---|---|
| `≥ 1.30` | 활발 | 🔥 오렌지 | 평소보다 30% 이상 거래 폭증 |
| `1.00 ≤ ratio < 1.30` | 보통 | 📈 그린 | 평소 수준 또는 약간 활발 |
| `0.70 ≤ ratio < 1.00` | 둔화 | ➡️ 그레이 | 평소 대비 거래 감소 |
| `< 0.70` | 저조 | ❄️ 블루 | 거래 가뭄 |

### 의미 — "자금 유입"이라 부르지 않은 이유
- 진정한 ETF 자금 유입은 발행/환매(creation/redemption) 데이터 — 무료 API에선 안 잡힘.
- 거래량이 많아진다는 건 매수자·매도자 모두 활발하다는 뜻이지 일방적 유입은 아님.
- 모멘텀(🔥)과 같이 보면 "활발 + 🔥"는 매수 유입 추정, "활발 + ❄️"는 매도 유출 추정으로 해석.

### 한계
- 거래량이 5~10일 안에 일시적으로 튀는 경우(어닝 발표 등) 비율이 왜곡될 수 있음.
- ETF의 거래량이지 보유 종목의 거래량이 아님.

> 이전 버전에서는 `/stock/candle`로 종가×거래량 = 거래대금 시계열을 직접 산출했으나, candle 차단으로 거래량 단순 비교로 전환. 거래대금이 더 정확하지만 거래량만으로도 활성도 신호로는 충분.

---

## 6. 변동성 (σ, 일간 수익률 표준편차)

### 데이터
대표 ETF의 `metric.3MonthADReturnStd` (3-Month Annualized Daily Return Standard Deviation, 단위 %, 연율화).

### 계산
Finnhub가 연율화한 값을 일간 변동성으로 환산:

```
σ_daily = σ_annual / sqrt(252)   # 252는 연간 영업일 수
```

응답에는 `volatilityPct`(일간 %)와 `annualVolPct`(연율 %) 둘 다 포함.

### 분류

| σ_daily | 톤 | 의미 |
|---|---|---|
| `< 1.5%` | 그린 (낮음) | 안정적 |
| `1.5 ≤ σ < 2.5%` | 옐로우 (보통) | 일반적인 주식 변동성 |
| `≥ 2.5%` | 레드 (높음) | 변동성 큼 — 작은 포지션 권장 |

### 의미
- "이 섹터가 얼마나 출렁이는가" — 같은 +5% 수익이라도 σ 1%인 섹터에서 얻는 것과 σ 4%인 섹터에서 얻는 것은 의미가 다름 (위험조정 수익률).
- 모멘텀(🔥)이 강해도 변동성이 높으면 진입 타이밍을 더 신중히, 변동성이 낮으면 추세 신뢰도가 높음.
- 응답엔 `beta`도 같이 들어옴 (시장 대비 변동성). 카드 표시는 안 하지만 hover tooltip이나 향후 확장에 사용 가능.

### 한계
- 3개월 lookback. 장기 구조적 변동성은 다른 척도가 필요.
- ETF의 변동성이지 개별 회사의 변동성이 아님.

> 이전 버전에서는 `/stock/candle`의 30일치 종가로 직접 산출. candle 차단으로 Finnhub의 사전 계산 필드(3개월 윈도우)로 전환. 더 긴 윈도우라 안정적이지만 단기 변화에 둔감.

---

## 7. 52주 가격 위치 (스파크라인 대체)

이전 스파크라인(30일 종가 라인)은 candle 의존이라 제거. 대신 **52주 고가–저가 범위 안에서 현재가의 위치**를 가로 마커로 표시.

### 데이터
- `metric.52WeekHigh` — 52주 최고가
- `metric.52WeekLow` — 52주 최저가
- `quote.c` — 현재가

### 계산

```
position = (price - low52) / (high52 - low52) × 100   # 0~100
```

### 표시
- 가로 트랙(저점→고점) 위에 색 마커 점.
- 색: 위치 < 33 그린(저점부근) / < 66 옐로우 / < 90 오렌지 / 그 외 레드.
- 우측에 위치 % 텍스트.
- Hover 시 "52주 범위: $low ~ $high · 현재 $price · 위치 N%" 툴팁.

### 의미
- "이 ETF가 52주 신고가 근처인가/저점 부근인가"를 한눈에. 모멘텀(🔥)과 함께 보면 진입 부담을 가늠하기 좋음.
- 99% 같은 극값은 추세 강함의 신호인 동시에 단기 과열 가능성도.

---

## 부록 A. 카드 좌측 보더 색의 결정

카드 좌측 보더 3px 색은 **모멘텀 신호의 톤**을 그대로 따라간다. 즉 시간축 토글을 1D나 1Y로 바꿔도 카드 보더 색은 항상 3M 기준.

"모멘텀이 카드의 정체성"이라는 디자인 철학에 따른 것. 사용자가 카드 그리드를 훑을 때 가장 먼저 잡혀야 할 정보는 "이 섹터가 지금 뜨거운가/식었나".

## 부록 B. 첫 진입 시 로딩 시간

첫 호출에서 약 15~20초 소요(quote+metric 약 70 req, batch 3 × 1.5초 간격).
- 두 번째 진입부터는 서버 캐시 히트로 즉시 응답.
- 부분 결측 발생 시 응답 캐시 안 잡고 다음 호출에 누락분만 재시도하므로, 한 번에 다 안 들어와도 몇 번 새로고침하면 모두 채워짐.

## 부록 C. 향후 개선 후보

1. **밸류에이션의 자가 분포 백분위화** — 섹터 자기 5년 PER 분포에서의 위치로 전환.
2. **시총 가중 등락의 기간 확장** — 회사별 historical 수익률을 metric에서 받아 1W/1M/3M까지 확장.
3. **자금 유입의 진짜 측정** — ETF.com 또는 유료 API로 net flow.
4. **섹터 PER 정규화** — 각 섹터 5년 PER 평균/표준편차 z-score 게이지.
5. **회사 풀 확장** — 글로벌 ticker 커버리지 (.HK/.T/.KS 등). 유료 플랜 또는 대체 데이터 소스.
6. **`beta` 표시 추가** — 변동성 옆에 시장 대비 베타. "활발 + β1.7" 같은 정보 밀도 향상.

---

*문서 최종 수정: 2026-04-27*
*관련 코드:*
- `app/api/sector-overview/route.js`
- `hooks/useSectorOverview.js`
- `components/SectorOverview.jsx`
- `data/etfs.js` (대표 ETF 매핑)
