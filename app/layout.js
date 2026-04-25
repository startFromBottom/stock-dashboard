import './globals.css';

export const metadata = {
  title: 'Stock Dashboard',
  description: 'AI 데이터센터 · 반도체 밸류체인 시가총액 Top 10 기업 · 실시간 뉴스 & 리포트',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
