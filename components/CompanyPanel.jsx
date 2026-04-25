'use client';

const RANK_LABELS = ['🥇 1위', '🥈 2위', '🥉 3위', '4위', '5위'];

export default function CompanyPanel({ comp }) {
  if (!comp) return null;

  return (
    <div className="company-panel">
      <div className="panel-header">
        <div className="panel-icon">{comp.icon}</div>
        <div>
          <div className="panel-title">{comp.name}</div>
          <div className="panel-subtitle">시가총액 Top 5 기업 · 2025년 기준</div>
        </div>
      </div>

      <div className="companies-grid">
        {comp.companies.map((c) => (
          <div key={c.ticker} className="company-card">
            <span className={`rank-badge rank-${c.rank}`}>
              {RANK_LABELS[c.rank - 1]}
            </span>
            <div className="company-name">{c.name}</div>
            <div className="company-ticker">{c.ticker}</div>
            <div className="company-mktcap">{c.mktcap}</div>
            <div className="company-detail">{c.detail}</div>
            <div className="company-links">
              <a
                href={c.ir}
                target="_blank"
                rel="noopener noreferrer"
                className="link-btn"
              >
                📊 IR
              </a>
              <a
                href={c.news}
                target="_blank"
                rel="noopener noreferrer"
                className="link-btn"
              >
                📰 뉴스
              </a>
              <a
                href={c.x}
                target="_blank"
                rel="noopener noreferrer"
                className="link-btn"
              >
                𝕏 X
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
