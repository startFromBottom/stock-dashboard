# AI 데이터센터 인프라 대시보드

AI 데이터센터 구성 요소별 **시가총액 Top 5 기업** 및 **최신 뉴스·레포트**를 한눈에 볼 수 있는 Next.js 대시보드.

## 주요 기능

- **🗺️ 레이어 맵** — 데이터센터 5개 레이어 × 13개 구성 요소를 클릭하면 Top 5 기업 상세 정보(시가총액, IR, 뉴스, X 링크) 표시
- **🏢 데이터센터 일러스트** — 데이터센터 내부 SVG 그림, 각 요소 클릭 시 설명
- **📰 뉴스 & 레포트** — 카테고리·유형별 필터링, 원문 링크 포함

## 커버 범위 (13개 구성 요소 × 각 5개 기업)

| 레이어 | 구성 요소 |
|---|---|
| ☁️ 클라우드 | 클라우드 플랫폼, 데이터센터 시설 |
| ⚡ 컴퓨트 | AI 가속기/GPU, 메모리(HBM), 서버, 스토리지 |
| 🔗 네트워킹 | AI 네트워킹, 광트랜시버 |
| 🔋 전력·냉각 | 전력 인프라, 냉각 시스템 |
| 🏭 물리 인프라 | 건설/엔지니어링, 에너지 공급 |

## 시작하기

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행
npm run dev
# → http://localhost:3000

# 3. 프로덕션 빌드
npm run build
npm start
```

## 프로젝트 구조

```
ai-datacenter-dashboard/
├── app/
│   ├── layout.js        # 루트 레이아웃
│   ├── page.js          # 메인 페이지
│   └── globals.css      # 전역 스타일 (다크 테마)
├── components/
│   ├── Dashboard.jsx    # 탭 네비게이션 + 레이아웃
│   ├── LayerMap.jsx     # 레이어 맵 (클릭 인터랙션)
│   ├── CompanyPanel.jsx # 기업 상세 패널
│   ├── NewsSection.jsx  # 뉴스 필터·목록
│   └── Illustration.jsx # SVG 데이터센터 일러스트
└── data/
    ├── companies.js     # 13개 카테고리 × Top 5 기업
    └── news.js          # 최신 뉴스·레포트 데이터
```

## 데이터 업데이트

- **기업 데이터** — `data/companies.js` 수정
- **뉴스 데이터** — `data/news.js`에 항목 추가 (향후 NewsAPI/RSS 자동화 예정)

## 기술 스택

- **Next.js 15** (App Router)
- **React 19**
- 외부 라이브러리 없음 — 순수 CSS + SVG
