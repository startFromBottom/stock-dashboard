'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * 전역 회사 상세 모달 훅
 *
 * 어느 컴포넌트에서든 openCompanyModal({ ticker, name, sector }) 호출하면
 * 최상위에 마운트된 <CompanyDetailModal />이 자동으로 열림.
 *
 * 사용:
 *   const { open } = useCompanyModal();
 *   <div onClick={() => open({ ticker: 'NVDA', name: 'NVIDIA', sector: 'semi' })}>...</div>
 *
 * 그리고 어딘가 한 군데(layout.jsx 또는 Dashboard.jsx)에 <CompanyDetailModal />.
 */

let globalState = {
  isOpen: false,
  ticker: null,
  name: null,
  sector: null,
};
const subscribers = new Set();

function notify() {
  for (const s of subscribers) s();
}

export function openCompanyModal({ ticker, name, sector }) {
  if (!ticker) return;
  globalState = { isOpen: true, ticker: ticker.toUpperCase(), name: name ?? null, sector: sector ?? null };
  notify();
}

export function closeCompanyModal() {
  globalState = { ...globalState, isOpen: false };
  notify();
}

export default function useCompanyModal() {
  const [, force] = useState(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const sub = () => mountedRef.current && force(n => n + 1);
    subscribers.add(sub);
    return () => {
      mountedRef.current = false;
      subscribers.delete(sub);
    };
  }, []);

  return {
    isOpen: globalState.isOpen,
    ticker: globalState.ticker,
    name:   globalState.name,
    sector: globalState.sector,
    open:   openCompanyModal,
    close:  closeCompanyModal,
  };
}
