'use client';

import { useState, useMemo, useEffect } from 'react';
import useWatchlist from '@/hooks/useWatchlist';
import useAuth from '@/hooks/useAuth';

const SECTOR_META = {
  'ai-dc':         { label: 'AI 데이터센터', icon: '🏢' },
  'semi':          { label: '반도체',         icon: '🔬' },
  'space':         { label: '우주',           icon: '🚀' },
  'raw':           { label: '원자재',         icon: '⛏️' },
  'energy':        { label: '에너지',         icon: '⚡' },
  'biotech':       { label: '바이오테크',     icon: '🧬' },
  'fintech':       { label: '핀테크',         icon: '💳' },
  'healthcare':    { label: '헬스케어',       icon: '🏥' },
  'quantum':       { label: '양자컴퓨터',     icon: '⚛️' },
  'staples':       { label: '필수소비재',     icon: '🥫' },
  'discretionary': { label: '임의소비재',     icon: '🛍️' },
};

const SORT_OPTIONS = [
  { id: 'added_desc', label: '최근 추가순' },
  { id: 'added_asc',  label: '오래된 순' },
  { id: 'gain_desc',  label: '수익률 높은 순' },
  { id: 'gain_asc',   label: '수익률 낮은 순' },
  { id: 'ticker',     label: '티커 알파벳' },
];

function fmt(n, digits = 2) {
  if (n === null || n === undefined || isNaN(n)) return '—';
  return n.toFixed(digits);
}
function fmtPct(pct) {
  if (pct === null || pct === undefined || isNaN(pct)) return '—';
  const sign = pct > 0 ? '+' : '';
  return `${sign}${pct.toFixed(2)}%`;
}
function fmtPrice(p) {
  if (!p) return '—';
  return `$${p.toFixed(2)}`;
}
function fmtDate(s) {
  if (!s) return '—';
  return new Date(s).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

/* ── 라이브 가격 fetch ─────────────────────────────────
   ETF quotes API 재활용 — 워치리스트 ticker 들을 한 번에 호출 */
function useLivePrices(tickers) {
  const [prices, setPrices] = useState({});
  const key = tickers.join(',');

  useEffect(() => {
    if (!tickers.length) return;
    const ctrl = new AbortController();
    fetch(`/api/etf-quotes?tickers=${encodeURIComponent(key)}`, { signal: ctrl.signal })
      .then(r => r.ok ? r.json() : null)
      .then(j => { if (j) setPrices(j); })
      .catch(() => {});
    return () => ctrl.abort();
  }, [key]); // eslint-disable-line

  return prices;
}

/* ══════════════════════════════════════════════════ */
export default function WatchlistDashboard({ onSelectSector }) {
  const { items, remove, update, loading, error, loaded, requiresAuth } = useWatchlist();
  const { isLoggedIn, initialized, signInWithGitHub, isConfigured } = useAuth();
  const [authBusy, setAuthBusy] = useState(false);

  const [view, setView]   = useState('table');     // 'table' | 'cards'
  const [sortBy, setSort] = useState('added_desc');
  const [filterSector, setFilterSector] = useState('all');
  const [editingId, setEditingId] = useState(null); // 메모/매수가 편집 중인 row id

  // 라이브 가격
  const tickers = useMemo(
    () => items.map(i => i.ticker).filter(Boolean),
    [items.length, items.map(i => i.ticker).join(',')] // eslint-disable-line
  );
  const livePrices = useLivePrices(tickers);

  /* ── 필터 + 정렬 ── */
  const display = useMemo(() => {
    let arr = items.map(it => {
      const live = livePrices[it.ticker];
      const livePrice = live?.price ?? null;
      // 수익률: live 대비 added_price (관심 시작 시점)
      const gainSinceAdded = (livePrice && it.added_price)
        ? ((livePrice / it.added_price) - 1) * 100
        : null;
      // 매수가 대비 손익
      const gainSinceBuy = (livePrice && it.buy_price)
        ? ((livePrice / it.buy_price) - 1) * 100
        : null;
      // 미실현 손익 (매수가·수량 둘 다 있을 때)
      const unrealizedPnl = (livePrice && it.buy_price && it.buy_shares)
        ? (livePrice - it.buy_price) * it.buy_shares
        : null;
      return { ...it, livePrice, gainSinceAdded, gainSinceBuy, unrealizedPnl };
    });

    if (filterSector !== 'all') {
      arr = arr.filter(it => it.sector === filterSector);
    }

    arr.sort((a, b) => {
      switch (sortBy) {
        case 'added_asc':  return new Date(a.added_at) - new Date(b.added_at);
        case 'gain_desc':  return (b.gainSinceAdded ?? -Infinity) - (a.gainSinceAdded ?? -Infinity);
        case 'gain_asc':   return (a.gainSinceAdded ?? Infinity) - (b.gainSinceAdded ?? Infinity);
        case 'ticker':     return a.ticker.localeCompare(b.ticker);
        case 'added_desc':
        default:           return new Date(b.added_at) - new Date(a.added_at);
      }
    });

    return arr;
  }, [items, livePrices, sortBy, filterSector]);

  /* ── 합계 (선택적 KPI) ── */
  const totals = useMemo(() => {
    const arr = display;
    const withPnl = arr.filter(it => typeof it.unrealizedPnl === 'number');
    const totalPnl = withPnl.reduce((s, it) => s + it.unrealizedPnl, 0);
    const totalCost = withPnl.reduce((s, it) => s + (it.buy_price * it.buy_shares), 0);
    const avgGainSinceAdded = (() => {
      const gains = arr.map(it => it.gainSinceAdded).filter(g => typeof g === 'number');
      if (gains.length === 0) return null;
      return gains.reduce((s, g) => s + g, 0) / gains.length;
    })();
    return {
      count: arr.length,
      withPnlCount: withPnl.length,
      totalPnl,
      totalCost,
      pnlPct: totalCost > 0 ? (totalPnl / totalCost) * 100 : null,
      avgGainSinceAdded,
    };
  }, [display]);

  /* ── 섹터별 카운트 (필터 라벨용) ── */
  const sectorCount = useMemo(() => {
    const map = { all: items.length };
    for (const it of items) {
      map[it.sector ?? '_'] = (map[it.sector ?? '_'] ?? 0) + 1;
    }
    return map;
  }, [items]);

  // ── 비로그인 잠금화면 ──
  if (initialized && !isLoggedIn) {
    return (
      <div className="wl-locked">
        <div className="wl-locked-icon">🔒</div>
        <h3 className="wl-locked-title">워치리스트는 로그인 후에 사용할 수 있어요</h3>
        <p className="wl-locked-desc">
          내 종목·메모·매수가는 계정에 묶여 저장됩니다. 다른 기기에서도 동일한 워치리스트를 보려면 로그인하세요.
        </p>
        {!isConfigured ? (
          <p className="wl-locked-hint">
            ⚠️ Supabase 인증이 설정되지 않았어요 — <code>.env.local</code> 확인이 필요합니다.
          </p>
        ) : (
          <div className="wl-locked-actions">
            <button
              className="wl-locked-btn wl-locked-btn-github"
              disabled={authBusy}
              onClick={async () => {
                setAuthBusy(true);
                const { error } = await signInWithGitHub();
                if (error) {
                  alert('GitHub 로그인 실패: ' + (error.message ?? error));
                  setAuthBusy(false);
                }
              }}
            >
              <span>🐙</span>
              {authBusy ? 'GitHub로 이동 중…' : 'GitHub로 로그인'}
            </button>
            <span className="wl-locked-soon">Google 로그인은 곧 추가됩니다</span>
          </div>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="wl-empty">
        <div className="wl-spinner">⟳</div>
        <p>워치리스트 불러오는 중…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wl-empty wl-error">
        <p>⚠️ 워치리스트 로드 실패</p>
        <p className="wl-error-msg">{error}</p>
        <p className="wl-error-hint">.env.local의 NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY 확인</p>
      </div>
    );
  }

  if (loaded && items.length === 0) {
    return (
      <div className="wl-empty">
        <div className="wl-empty-icon">⭐</div>
        <h3 className="wl-empty-title">아직 워치리스트가 비어있어요</h3>
        <p className="wl-empty-desc">
          섹터 화면의 회사 카드 우측 상단 ☆ 버튼을 누르면 추가됩니다.<br/>
          여기에서 메모·매수가·수익률을 한꺼번에 추적할 수 있어요.
        </p>
      </div>
    );
  }

  return (
    <div className="wl-wrap">
      {/* ── KPI 요약 ── */}
      <div className="wl-kpi-row">
        <div className="wl-kpi-card">
          <span className="wl-kpi-label">종목 수</span>
          <span className="wl-kpi-val">{totals.count}</span>
        </div>
        <div className="wl-kpi-card">
          <span className="wl-kpi-label">관심 시점부터 평균</span>
          <span className={`wl-kpi-val ${totals.avgGainSinceAdded > 0 ? 'wl-pos' : totals.avgGainSinceAdded < 0 ? 'wl-neg' : ''}`}>
            {fmtPct(totals.avgGainSinceAdded)}
          </span>
        </div>
        {totals.withPnlCount > 0 && (
          <>
            <div className="wl-kpi-card">
              <span className="wl-kpi-label">매수 비용 합계 ({totals.withPnlCount}종목)</span>
              <span className="wl-kpi-val">${fmt(totals.totalCost, 0)}</span>
            </div>
            <div className="wl-kpi-card">
              <span className="wl-kpi-label">미실현 손익</span>
              <span className={`wl-kpi-val ${totals.totalPnl > 0 ? 'wl-pos' : totals.totalPnl < 0 ? 'wl-neg' : ''}`}>
                ${fmt(totals.totalPnl, 0)}
                {totals.pnlPct !== null && <span className="wl-kpi-sub"> ({fmtPct(totals.pnlPct)})</span>}
              </span>
            </div>
          </>
        )}
      </div>

      {/* ── 컨트롤 바 ── */}
      <div className="wl-controls">
        <div className="wl-filter-group">
          <button
            className={`filter-btn${filterSector === 'all' ? ' active' : ''}`}
            onClick={() => setFilterSector('all')}
          >
            전체 ({sectorCount.all ?? 0})
          </button>
          {Object.entries(sectorCount)
            .filter(([k]) => k !== 'all' && k !== '_' && SECTOR_META[k])
            .sort((a, b) => b[1] - a[1])
            .map(([sid, cnt]) => (
              <button
                key={sid}
                className={`filter-btn${filterSector === sid ? ' active' : ''}`}
                onClick={() => setFilterSector(sid)}
              >
                {SECTOR_META[sid].icon} {SECTOR_META[sid].label} <span className="news-comp-count">{cnt}</span>
              </button>
            ))}
        </div>
        <div className="wl-control-right">
          <select className="wl-select" value={sortBy} onChange={e => setSort(e.target.value)}>
            {SORT_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
          <div className="wl-view-toggle">
            <button
              className={`wl-view-btn${view === 'table' ? ' active' : ''}`}
              onClick={() => setView('table')}
              title="표 보기"
            >☰</button>
            <button
              className={`wl-view-btn${view === 'cards' ? ' active' : ''}`}
              onClick={() => setView('cards')}
              title="카드 보기"
            >▦</button>
          </div>
        </div>
      </div>

      {/* ── 결과 요약 ── */}
      <div className="wl-result-summary">
        <span>{display.length}개 종목 표시</span>
      </div>

      {/* ── 본문 ── */}
      {view === 'table'
        ? <WatchlistTable items={display} editingId={editingId} setEditingId={setEditingId} update={update} remove={remove} onSelectSector={onSelectSector} />
        : <WatchlistCards items={display} editingId={editingId} setEditingId={setEditingId} update={update} remove={remove} onSelectSector={onSelectSector} />
      }
    </div>
  );
}

/* ══════════════════════════════════════════════════
   테이블 뷰
══════════════════════════════════════════════════ */
function WatchlistTable({ items, editingId, setEditingId, update, remove, onSelectSector }) {
  return (
    <div className="wl-table-wrap">
      <table className="wl-table">
        <thead>
          <tr>
            <th>섹터</th>
            <th>티커 / 회사</th>
            <th className="num">현재가</th>
            <th className="num">관심 시작가</th>
            <th className="num">관심 후</th>
            <th className="num">매수가 / 수량</th>
            <th className="num">미실현</th>
            <th>메모</th>
            <th>추가일</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map(it => {
            const meta = SECTOR_META[it.sector] ?? { label: '—', icon: '🌐' };
            const isEditing = editingId === it.id;
            const gainCls = it.gainSinceAdded > 0 ? 'wl-pos' : it.gainSinceAdded < 0 ? 'wl-neg' : '';
            const pnlCls  = it.unrealizedPnl > 0 ? 'wl-pos' : it.unrealizedPnl < 0 ? 'wl-neg' : '';
            return (
              <tr key={it.id} className={it._pending ? 'wl-row-pending' : ''}>
                <td>
                  <button
                    className="wl-sector-chip"
                    onClick={() => onSelectSector?.(it.sector)}
                    title={`${meta.label} 섹터로 이동`}
                  >
                    {meta.icon} {meta.label}
                  </button>
                </td>
                <td>
                  <div className="wl-name-cell">
                    <span className="wl-ticker">{it.ticker}</span>
                    {it.name && <span className="wl-name">{it.name}</span>}
                  </div>
                </td>
                <td className="num">{fmtPrice(it.livePrice)}</td>
                <td className="num">{fmtPrice(it.added_price)}</td>
                <td className={`num ${gainCls}`}>{fmtPct(it.gainSinceAdded)}</td>
                <td className="num">
                  {isEditing ? (
                    <BuyEditor row={it} update={update} />
                  ) : (
                    it.buy_price
                      ? <>
                          ${fmt(it.buy_price)}
                          {it.buy_shares ? <span className="wl-sub"> × {it.buy_shares}주</span> : null}
                        </>
                      : <span className="wl-muted">—</span>
                  )}
                </td>
                <td className={`num ${pnlCls}`}>
                  {it.unrealizedPnl !== null ? (
                    <>
                      ${fmt(it.unrealizedPnl, 0)}
                      <span className="wl-sub"> ({fmtPct(it.gainSinceBuy)})</span>
                    </>
                  ) : <span className="wl-muted">—</span>}
                </td>
                <td>
                  {isEditing ? (
                    <MemoEditor row={it} update={update} />
                  ) : (
                    it.memo
                      ? <span className="wl-memo-text">{it.memo}</span>
                      : <span className="wl-muted">—</span>
                  )}
                </td>
                <td className="wl-date">{fmtDate(it.added_at)}</td>
                <td className="wl-actions">
                  <button
                    className="wl-icon-btn"
                    onClick={() => setEditingId(isEditing ? null : it.id)}
                    title={isEditing ? '편집 닫기' : '편집'}
                  >{isEditing ? '✓' : '✎'}</button>
                  <button
                    className="wl-icon-btn wl-danger"
                    onClick={() => {
                      if (confirm(`${it.ticker}을(를) 워치리스트에서 제거하시겠어요?`)) {
                        remove(it.ticker);
                      }
                    }}
                    title="제거"
                  >✕</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   카드 뷰
══════════════════════════════════════════════════ */
function WatchlistCards({ items, editingId, setEditingId, update, remove, onSelectSector }) {
  return (
    <div className="wl-cards-grid">
      {items.map(it => {
        const meta = SECTOR_META[it.sector] ?? { label: '—', icon: '🌐' };
        const isEditing = editingId === it.id;
        const gainCls = it.gainSinceAdded > 0 ? 'wl-pos' : it.gainSinceAdded < 0 ? 'wl-neg' : '';
        const pnlCls  = it.unrealizedPnl > 0 ? 'wl-pos' : it.unrealizedPnl < 0 ? 'wl-neg' : '';
        return (
          <div key={it.id} className={`wl-card${it._pending ? ' wl-card-pending' : ''}`}>
            <div className="wl-card-head">
              <button
                className="wl-sector-chip"
                onClick={() => onSelectSector?.(it.sector)}
              >
                {meta.icon} {meta.label}
              </button>
              <div className="wl-card-actions">
                <button
                  className="wl-icon-btn"
                  onClick={() => setEditingId(isEditing ? null : it.id)}
                >{isEditing ? '✓' : '✎'}</button>
                <button
                  className="wl-icon-btn wl-danger"
                  onClick={() => {
                    if (confirm(`${it.ticker}을(를) 워치리스트에서 제거하시겠어요?`)) {
                      remove(it.ticker);
                    }
                  }}
                >✕</button>
              </div>
            </div>
            <div className="wl-card-title">
              <span className="wl-ticker">{it.ticker}</span>
              {it.name && <span className="wl-name">{it.name}</span>}
            </div>
            <div className="wl-card-price-row">
              <div className="wl-price-current">
                <span className="wl-sub">현재가</span>
                <span className="wl-price-val">{fmtPrice(it.livePrice)}</span>
              </div>
              <div className="wl-price-since">
                <span className="wl-sub">관심 시작 후</span>
                <span className={`wl-price-val ${gainCls}`}>{fmtPct(it.gainSinceAdded)}</span>
              </div>
            </div>

            <div className="wl-card-buy">
              <span className="wl-sub-label">매수가 / 수량</span>
              {isEditing ? (
                <BuyEditor row={it} update={update} />
              ) : (
                it.buy_price ? (
                  <span className="wl-buy-val">
                    ${fmt(it.buy_price)} × {it.buy_shares ?? '—'}주
                    {it.unrealizedPnl !== null && (
                      <span className={`wl-pnl ${pnlCls}`}>
                        {' · '}${fmt(it.unrealizedPnl, 0)} ({fmtPct(it.gainSinceBuy)})
                      </span>
                    )}
                  </span>
                ) : <span className="wl-muted">미입력 (편집해서 추가)</span>
              )}
            </div>

            <div className="wl-card-memo">
              <span className="wl-sub-label">메모</span>
              {isEditing ? (
                <MemoEditor row={it} update={update} />
              ) : (
                it.memo ? <span className="wl-memo-text">{it.memo}</span>
                        : <span className="wl-muted">메모 없음</span>
              )}
            </div>

            <div className="wl-card-foot">
              <span className="wl-sub">추가일 {fmtDate(it.added_at)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   매수가/수량 편집기
══════════════════════════════════════════════════ */
function BuyEditor({ row, update }) {
  const [price, setPrice]   = useState(row.buy_price  ?? '');
  const [shares, setShares] = useState(row.buy_shares ?? '');

  const submit = () => {
    update({
      ticker: row.ticker,
      buy_price:  price  === '' ? null : Number(price),
      buy_shares: shares === '' ? null : Number(shares),
    });
  };

  return (
    <div className="wl-buy-editor">
      <input
        type="number" step="0.01" placeholder="매수가"
        value={price} onChange={e => setPrice(e.target.value)}
        onBlur={submit} onKeyDown={e => e.key === 'Enter' && submit()}
        className="wl-input wl-input-num"
      />
      <span className="wl-sub">×</span>
      <input
        type="number" step="0.01" placeholder="수량"
        value={shares} onChange={e => setShares(e.target.value)}
        onBlur={submit} onKeyDown={e => e.key === 'Enter' && submit()}
        className="wl-input wl-input-num"
      />
    </div>
  );
}

function MemoEditor({ row, update }) {
  const [memo, setMemo] = useState(row.memo ?? '');

  const submit = () => {
    update({ ticker: row.ticker, memo: memo.trim() || null });
  };

  return (
    <input
      type="text" placeholder="메모 입력…"
      value={memo} onChange={e => setMemo(e.target.value)}
      onBlur={submit} onKeyDown={e => e.key === 'Enter' && submit()}
      className="wl-input wl-input-memo"
    />
  );
}
