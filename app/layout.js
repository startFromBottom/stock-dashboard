import './globals.css';

export const metadata = {
  title: 'AI 데이터센터 대시보드',
  description: 'AI 데이터센터 구성 요소별 시가총액 Top 5 기업 및 최신 뉴스',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
