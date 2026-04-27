'use client';

import { useState, useEffect } from 'react';

export default function QuantumNewsSection() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch(
          '/api/news?sectors=quantum-computing,quantum-computers&limit=20'
        );
        if (!response.ok) throw new Error('뉴스 데이터 조회 실패');
        const data = await response.json();
        setNews(data.articles || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="section">
        <h2 className="section-title">📰 뉴스 & 리포트</h2>
        <div style={{ textAlign: 'center', padding: 48, color: '#666' }}>
          양자컴퓨터 관련 뉴스를 불러오는 중입니다...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section">
        <h2 className="section-title">📰 뉴스 & 리포트</h2>
        <div style={{ textAlign: 'center', padding: 48, color: '#999' }}>
          뉴스 데이터를 불러올 수 없습니다. 나중에 다시 시도해주세요.
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <h2 className="section-title">📰 뉴스 & 리포트</h2>

      {news.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#666' }}>
          관련 뉴스가 없습니다.
        </div>
      ) : (
        <div className="news-grid">
          {news.map((article, idx) => (
            <a
              key={idx}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="news-card"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {article.imageUrl && (
                <div className="news-image">
                  <img src={article.imageUrl} alt={article.title} />
                </div>
              )}
              <div className="news-content">
                <h3 className="news-title">{article.title}</h3>
                <p className="news-desc">{article.description}</p>
                <div className="news-meta">
                  <span className="news-source">{article.source}</span>
                  <span className="news-date">
                    {new Date(article.publishedAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
