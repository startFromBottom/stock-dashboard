'use client';

import { useState, useMemo } from 'react';
import {
  GLOSSARY_ITEMS,
  GLOSSARY_CAT_LABEL,
  countGlossaryByCat,
} from '@/data/semi-glossary';

/* ── 공정 카테고리 순서 ── */
const PROCESS_CATS  = ['silicon','materials','litho','deposition','etch','clean','metrology','packaging','test','distribution'];
const INDUSTRY_CATS = ['eda','fabless','foundry'];

/* ── 인라인 SVG 다이어그램 ── */
function DiagramSVG({ type }) {
  const svgs = {

    czochralski: (
      <svg viewBox="0 0 320 200" className="glos-diagram-svg">
        {/* 도가니 */}
        <rect x="80" y="90" width="160" height="90" rx="6" fill="#1a0f05" stroke="#b45309" strokeWidth="1.5"/>
        <ellipse cx="160" cy="90" rx="80" ry="16" fill="#2a1a08" stroke="#b45309" strokeWidth="1.5"/>
        {/* 용융 실리콘 */}
        <ellipse cx="160" cy="92" rx="72" ry="12" fill="#f97316" opacity="0.5"/>
        <text x="160" y="96" textAnchor="middle" fill="#fed7aa" fontSize="9">폴리실리콘 용융액</text>
        {/* 잉곳 */}
        <rect x="138" y="16" width="44" height="78" rx="22" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1.5"/>
        <text x="160" y="58" textAnchor="middle" fill="#1e293b" fontSize="9" fontWeight="bold">실리콘</text>
        <text x="160" y="70" textAnchor="middle" fill="#1e293b" fontSize="9" fontWeight="bold">잉곳</text>
        {/* 화살표 위로 */}
        <line x1="160" y1="14" x2="160" y2="4" stroke="#4ade80" strokeWidth="2"/>
        <polygon points="160,0 155,8 165,8" fill="#4ade80"/>
        <text x="195" y="10" fill="#86efac" fontSize="9">인상↑ + 회전</text>
        {/* 열원 */}
        <text x="30" y="140" fill="#fbbf24" fontSize="9">🔥 고주파 가열</text>
        {/* 종자결정 */}
        <rect x="145" y="10" width="30" height="8" rx="2" fill="#7c3aed"/>
        <text x="160" y="17" textAnchor="middle" fill="#e9d5ff" fontSize="7">종자결정</text>
        {/* 라벨 */}
        <text x="160" y="192" textAnchor="middle" fill="#64748b" fontSize="8">Czochralski (CZ) 공정</text>
      </svg>
    ),

    photoresist: (
      <svg viewBox="0 0 320 200" className="glos-diagram-svg">
        {/* 스텝 라벨 */}
        {[
          { x: 20,  label: '① 도포', sub: 'PR 스핀코팅' },
          { x: 100, label: '② 노광', sub: 'EUV/ArF 조사' },
          { x: 190, label: '③ 현상', sub: '용해·제거' },
          { x: 255, label: '④ 식각', sub: '패턴 전사' },
        ].map((s, i) => (
          <g key={i}>
            <text x={s.x + 25} y="18" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontWeight="bold">{s.label}</text>
            <text x={s.x + 25} y="28" textAnchor="middle" fill="#94a3b8" fontSize="7">{s.sub}</text>
          </g>
        ))}
        {/* 웨이퍼 단면들 */}
        {/* ① 도포: 웨이퍼+PR */}
        <rect x="10" y="100" width="70" height="14" rx="2" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1"/>
        <rect x="10" y="86" width="70" height="14" rx="2" fill="#7c2d12" stroke="#ea580c" strokeWidth="1" opacity="0.85"/>
        <text x="45" y="94" textAnchor="middle" fill="#fed7aa" fontSize="7">PR층</text>
        <text x="45" y="108" textAnchor="middle" fill="#93c5fd" fontSize="7">웨이퍼(SiO₂)</text>
        {/* ② 노광: 마스크+빔 */}
        <rect x="90" y="100" width="70" height="14" rx="2" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1"/>
        <rect x="90" y="86" width="70" height="14" rx="2" fill="#7c2d12" stroke="#ea580c" strokeWidth="1" opacity="0.85"/>
        {/* 마스크 */}
        <rect x="90" y="60" width="16" height="26" rx="1" fill="#334155"/>
        <rect x="126" y="60" width="34" height="26" rx="1" fill="#334155"/>
        {/* 광선 */}
        {[95,98,101,104].map(x => <line key={x} x1={x} y1="55" x2={x} y2="86" stroke="#a78bfa" strokeWidth="1" opacity="0.7"/>)}
        {[131,137,143,149,155].map(x => <line key={x} x1={x} y1="55" x2={x} y2="86" stroke="#a78bfa" strokeWidth="1" opacity="0.7"/>)}
        <text x="125" y="58" textAnchor="middle" fill="#c4b5fd" fontSize="7">EUV 13.5nm</text>
        <text x="125" y="108" textAnchor="middle" fill="#93c5fd" fontSize="7">웨이퍼</text>
        {/* ③ 현상 */}
        <rect x="180" y="100" width="70" height="14" rx="2" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1"/>
        <rect x="180" y="86" width="16" height="14" rx="1" fill="#7c2d12" stroke="#ea580c" strokeWidth="1" opacity="0.85"/>
        <rect x="234" y="86" width="16" height="14" rx="1" fill="#7c2d12" stroke="#ea580c" strokeWidth="1" opacity="0.85"/>
        <text x="215" y="80" textAnchor="middle" fill="#4ade80" fontSize="7">노출부 용해↓</text>
        {/* ④ 식각 결과 */}
        <rect x="250" y="100" width="60" height="14" rx="2" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1"/>
        <rect x="250" y="86" width="14" height="14" rx="1" fill="#0f172a" stroke="#3b82f6" strokeWidth="1"/>
        <rect x="296" y="86" width="14" height="14" rx="1" fill="#0f172a" stroke="#3b82f6" strokeWidth="1"/>
        <rect x="264" y="96" width="32" height="4" rx="1" fill="#64748b"/>
        <text x="280" y="80" textAnchor="middle" fill="#38bdf8" fontSize="7">패턴 완성</text>
        {/* 화살표 */}
        {[80,168,248].map(x => (
          <g key={x}>
            <line x1={x} y1="93" x2={x+8} y2="93" stroke="#475569" strokeWidth="1.5"/>
            <polygon points={`${x+10},93 ${x+6},90 ${x+6},96`} fill="#475569"/>
          </g>
        ))}
        <text x="160" y="135" textAnchor="middle" fill="#64748b" fontSize="8">포토레지스트 패터닝 공정 (Positive-tone PR)</text>
      </svg>
    ),

    euv: (
      <svg viewBox="0 0 320 200" className="glos-diagram-svg">
        {/* 파장 비교 막대 */}
        <text x="160" y="20" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="bold">파장(λ)과 패턴 크기</text>
        {/* ArF */}
        <rect x="30" y="40" width="193" height="32" rx="4" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5"/>
        <text x="37" y="56" fill="#93c5fd" fontSize="10" fontWeight="bold">ArF 액침</text>
        <text x="37" y="67" fill="#60a5fa" fontSize="9">λ = 193nm</text>
        <text x="225" y="60" fill="#94a3b8" fontSize="9">패턴 ≈ 38nm</text>
        {/* EUV */}
        <rect x="30" y="84" width="14" height="32" rx="4" fill="#4a044e" stroke="#d946ef" strokeWidth="1.5"/>
        <text x="48" y="100" fill="#f0abfc" fontSize="10" fontWeight="bold">EUV</text>
        <text x="48" y="111" fill="#e879f9" fontSize="9">λ = 13.5nm</text>
        <text x="225" y="104" fill="#94a3b8" fontSize="9">패턴 ≈ 13nm</text>
        {/* High-NA EUV */}
        <rect x="30" y="128" width="10" height="32" rx="4" fill="#2e1065" stroke="#818cf8" strokeWidth="1.5"/>
        <text x="44" y="144" fill="#c7d2fe" fontSize="10" fontWeight="bold">High-NA EUV</text>
        <text x="44" y="155" fill="#a5b4fc" fontSize="9">λ = 13.5nm, NA=0.55</text>
        <text x="225" y="148" fill="#94a3b8" fontSize="9">패턴 ≈ 8nm</text>
        {/* 스케일 라벨 */}
        <line x1="30" y1="175" x2="220" y2="175" stroke="#334155" strokeWidth="1"/>
        <text x="30" y="185" fill="#64748b" fontSize="8">0</text>
        <text x="215" y="185" fill="#64748b" fontSize="8">193nm</text>
        <text x="160" y="195" textAnchor="middle" fill="#64748b" fontSize="7">파장이 짧을수록 → 더 작은 패턴 가능 (분해능 ↑)</text>
      </svg>
    ),

    ald: (
      <svg viewBox="0 0 320 200" className="glos-diagram-svg">
        <text x="160" y="16" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">ALD 1 사이클 (= 원자층 1개)</text>
        {/* 4 스텝 */}
        {[
          { x:10,  color:'#1e3a5f', bd:'#3b82f6', label:'① 전구체 A 투입', sub:'표면 흡착 (self-limit)', dot:'#60a5fa' },
          { x:85,  color:'#1a0f05', bd:'#b45309', label:'② N₂ 퍼지',        sub:'과잉 전구체 제거',    dot:'#fbbf24' },
          { x:160, color:'#0f1a0a', bd:'#16a34a', label:'③ 반응가스 B 투입', sub:'표면 반응→ 박막 1층', dot:'#4ade80' },
          { x:235, color:'#1a0020', bd:'#9333ea', label:'④ N₂ 퍼지',        sub:'부산물 제거',         dot:'#c084fc' },
        ].map((s, i) => (
          <g key={i}>
            <rect x={s.x} y="28" width="72" height="100" rx="6" fill={s.color} stroke={s.bd} strokeWidth="1.5"/>
            {/* 웨이퍼 */}
            <rect x={s.x+6} y="88" width="60" height="10" rx="2" fill="#334155" stroke="#475569" strokeWidth="1"/>
            {/* 분자 점들 */}
            {i === 0 && [0,1,2,3,4].map(j => (
              <circle key={j} cx={s.x+14+j*11} cy="82" r="4" fill={s.dot} opacity="0.9"/>
            ))}
            {i === 2 && [0,1,2,3,4].map(j => (
              <circle key={j} cx={s.x+14+j*11} cy="80" r="3" fill={s.dot} opacity="0.8"/>
            ))}
            {(i === 2 || i === 3) && (
              <rect x={s.x+6} y="84" width="60" height="4" rx="1" fill="#4ade80" opacity="0.6"/>
            )}
            <text x={s.x+36} y="43" textAnchor="middle" fill="#e2e8f0" fontSize="8" fontWeight="bold">{s.label}</text>
            <text x={s.x+36} y="54" textAnchor="middle" fill="#94a3b8" fontSize="7">{s.sub}</text>
          </g>
        ))}
        {/* 화살표 */}
        {[82,157,232].map(x => (
          <g key={x}>
            <line x1={x} y1="78" x2={x+3} y2="78" stroke="#475569" strokeWidth="1.5"/>
            <polygon points={`${x+5},78 ${x+1},75 ${x+1},81`} fill="#475569"/>
          </g>
        ))}
        {/* 사이클 반복 화살표 */}
        <path d="M 307 78 Q 315 140 160 155 Q 5 140 13 78" fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="4,3"/>
        <polygon points="13,78 9,85 17,83" fill="#475569"/>
        <text x="160" y="172" textAnchor="middle" fill="#64748b" fontSize="8">반복 → 원하는 두께까지</text>
        <text x="160" y="185" textAnchor="middle" fill="#64748b" fontSize="8">결과: 1 사이클 ≈ 0.1~0.3Å 박막</text>
      </svg>
    ),

    rie: (
      <svg viewBox="0 0 320 200" className="glos-diagram-svg">
        <text x="160" y="16" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">RIE 식각 원리 (이방성)</text>
        {/* 플라즈마 영역 */}
        <rect x="40" y="25" width="240" height="60" rx="4" fill="#1a0020" stroke="#9333ea" strokeWidth="1.5"/>
        <text x="160" y="45" textAnchor="middle" fill="#c084fc" fontSize="9">플라즈마 (CF₄·Cl₂ 이온화)</text>
        <text x="160" y="58" textAnchor="middle" fill="#9333ea" fontSize="8">⚡ RF 전계 인가</text>
        {/* 이온 화살표들 */}
        {[80,105,130,155,180,205,230].map(x => (
          <g key={x}>
            <line x1={x} y1="88" x2={x} y2="105" stroke="#f0abfc" strokeWidth="1.5"/>
            <polygon points={`${x},107 ${x-3},100 ${x+3},100`} fill="#f0abfc"/>
          </g>
        ))}
        <text x="160" y="100" textAnchor="middle" fill="#e879f9" fontSize="8">이온 수직 충돌 ↓↓↓</text>
        {/* PR 마스크 */}
        <rect x="40" y="110" width="70" height="20" rx="2" fill="#7c2d12" stroke="#ea580c" strokeWidth="1.5"/>
        <rect x="210" y="110" width="70" height="20" rx="2" fill="#7c2d12" stroke="#ea580c" strokeWidth="1.5"/>
        <text x="75" y="123" textAnchor="middle" fill="#fed7aa" fontSize="8">PR 마스크</text>
        <text x="245" y="123" textAnchor="middle" fill="#fed7aa" fontSize="8">PR 마스크</text>
        {/* 식각 영역 */}
        <rect x="110" y="110" width="100" height="40" rx="2" fill="#0f172a" stroke="#334155" strokeWidth="1"/>
        <text x="160" y="134" textAnchor="middle" fill="#38bdf8" fontSize="8">수직 식각 ↓</text>
        {/* 하부 웨이퍼 */}
        <rect x="40" y="150" width="240" height="20" rx="2" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5"/>
        <rect x="110" y="150" width="100" height="20" rx="2" fill="#0c2340" stroke="#1d4ed8" strokeWidth="1"/>
        <text x="160" y="162" textAnchor="middle" fill="#93c5fd" fontSize="8">SiO₂ 기판</text>
        {/* 측벽 수직 강조 */}
        <line x1="110" y1="110" x2="110" y2="170" stroke="#4ade80" strokeWidth="2" strokeDasharray="3,2"/>
        <line x1="210" y1="110" x2="210" y2="170" stroke="#4ade80" strokeWidth="2" strokeDasharray="3,2"/>
        <text x="90" y="143" fill="#4ade80" fontSize="8" transform="rotate(-90,90,143)">수직</text>
        <text x="220" y="143" fill="#4ade80" fontSize="8">수직</text>
        <text x="160" y="190" textAnchor="middle" fill="#64748b" fontSize="8">이방성(anisotropic) 식각 → 수직 측벽 형성</text>
      </svg>
    ),

    cmp: (
      <svg viewBox="0 0 320 200" className="glos-diagram-svg">
        <text x="160" y="16" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">CMP 공정 원리</text>
        {/* 웨이퍼 (울퉁불퉁) */}
        <path d="M 30 80 Q 55 60 80 80 Q 105 100 130 75 Q 155 55 180 80 Q 205 100 230 70 Q 255 50 290 80 L 290 110 L 30 110 Z" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5"/>
        <text x="160" y="105" textAnchor="middle" fill="#93c5fd" fontSize="9">연마 전: 표면 울퉁불퉁</text>
        {/* 패드 회전 */}
        <rect x="30" y="38" width="260" height="18" rx="4" fill="#292524" stroke="#78716c" strokeWidth="1.5"/>
        <text x="160" y="50" textAnchor="middle" fill="#d6d3d1" fontSize="8">CMP 패드 (회전) ↻</text>
        {/* 슬러리 방울 */}
        {[60,90,120,150,180,210,240,270].map(x => (
          <ellipse key={x} cx={x} cy="58" rx="5" ry="3" fill="#059669" opacity="0.7"/>
        ))}
        <text x="30" y="75" fill="#4ade80" fontSize="7">슬러리↓</text>
        {/* 압력 화살표 */}
        <line x1="160" y1="22" x2="160" y2="36" stroke="#fbbf24" strokeWidth="2"/>
        <polygon points="160,38 156,32 164,32" fill="#fbbf24"/>
        <text x="175" y="32" fill="#fcd34d" fontSize="8">하중(압력)</text>
        {/* 연마 후 웨이퍼 */}
        <rect x="30" y="135" width="260" height="28" rx="4" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5"/>
        <text x="160" y="153" textAnchor="middle" fill="#93c5fd" fontSize="9">연마 후: 평탄화 완료 ✓</text>
        {/* 화살표 */}
        <line x1="160" y1="113" x2="160" y2="133" stroke="#475569" strokeWidth="1.5"/>
        <polygon points="160,135 156,129 164,129" fill="#475569"/>
        <text x="160" y="127" textAnchor="middle" fill="#64748b" fontSize="7">CMP 후</text>
        <text x="160" y="192" textAnchor="middle" fill="#64748b" fontSize="8">화학반응(산화) + 기계적 마모 → 원자 수준 평탄화</text>
      </svg>
    ),

    cowos: (
      <svg viewBox="0 0 320 200" className="glos-diagram-svg">
        <text x="160" y="16" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="bold">CoWoS-S 구조</text>
        {/* 기판 */}
        <rect x="20" y="165" width="280" height="20" rx="3" fill="#292524" stroke="#78716c" strokeWidth="1.5"/>
        <text x="160" y="178" textAnchor="middle" fill="#d6d3d1" fontSize="9">유기 기판 (Organic Substrate)</text>
        {/* 실리콘 인터포저 */}
        <rect x="20" y="125" width="280" height="30" rx="3" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2"/>
        <text x="160" y="143" textAnchor="middle" fill="#a5b4fc" fontSize="9">실리콘 인터포저 (RDL 배선층)</text>
        {/* 마이크로 범프 */}
        {[40,55,70,85,100,115,130,145,160,175,190,205,220,235,250,265,280].map(x => (
          <ellipse key={x} cx={x} cy="124" rx="4" ry="3" fill="#fbbf24" opacity="0.8"/>
        ))}
        {/* GPU 다이 */}
        <rect x="30" y="70" width="150" height="50" rx="4" fill="#0c2340" stroke="#0ea5e9" strokeWidth="2"/>
        <text x="105" y="91" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">GPU / AI 칩</text>
        <text x="105" y="106" textAnchor="middle" fill="#7dd3fc" fontSize="8">TSMC N3 / N2</text>
        {/* HBM 스택 */}
        {[0,1,2,3].map(i => (
          <rect key={i} x="190" y={70+i*11} width="95" height="11" rx="2"
            fill={i===0?'#0f172a':'#1e293b'} stroke="#38bdf8" strokeWidth="1"/>
        ))}
        <text x="237" y="80" textAnchor="middle" fill="#7dd3fc" fontSize="8">HBM3e</text>
        <text x="237" y="91" textAnchor="middle" fill="#64748b" fontSize="7">D램 다이 ×4~12</text>
        <text x="237" y="102" textAnchor="middle" fill="#64748b" fontSize="7">TSV 연결</text>
        <text x="237" y="113" textAnchor="middle" fill="#64748b" fontSize="7">1.2TB/s 대역폭</text>
        {/* 연결선 강조 */}
        <line x1="180" y1="95" x2="190" y2="95" stroke="#4ade80" strokeWidth="2" strokeDasharray="3,2"/>
        <text x="183" y="89" fill="#4ade80" fontSize="7">초광대역</text>
        <text x="160" y="195" textAnchor="middle" fill="#64748b" fontSize="8">AI 서버 핵심 패키징 — H100·B200 GPU 탑재 방식</text>
      </svg>
    ),

    hbm: (
      <svg viewBox="0 0 320 200" className="glos-diagram-svg">
        <text x="160" y="16" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="bold">HBM 수직 적층 구조</text>
        {/* 베이스 다이 */}
        <rect x="80" y="158" width="160" height="22" rx="4" fill="#0c2340" stroke="#0ea5e9" strokeWidth="2"/>
        <text x="160" y="172" textAnchor="middle" fill="#38bdf8" fontSize="9">베이스 로직 다이</text>
        {/* D램 다이 적층 */}
        {[0,1,2,3].map(i => (
          <g key={i}>
            <rect x="80" y={68+i*22} width="160" height="20" rx="3" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5"/>
            <text x="160" y={80+i*22} textAnchor="middle" fill="#93c5fd" fontSize="8">
              D램 다이 #{4-i} (LPDDR5X)
            </text>
            {/* TSV 핀 */}
            {[95,105,115,125,135,145,155,165,175,185,195,205,215,225].map(x => (
              <line key={x} x1={x} y1={88+i*22} x2={x} y2={90+i*22} stroke="#fbbf24" strokeWidth="1.5"/>
            ))}
          </g>
        ))}
        {/* 범프 */}
        {[95,110,125,140,155,170,185,200,215].map(x => (
          <ellipse key={x} cx={x} cy="156" rx="5" ry="4" fill="#fbbf24" opacity="0.9"/>
        ))}
        <text x="240" y="152" fill="#fcd34d" fontSize="7">마이크로 범프</text>
        {/* TSV 세로선 강조 */}
        {[110,140,180,210].map(x => (
          <line key={x} x1={x} y1="68" x2={x} y2="158" stroke="#fbbf24" strokeWidth="1" opacity="0.4" strokeDasharray="3,2"/>
        ))}
        <text x="60" y="108" fill="#fcd34d" fontSize="7" transform="rotate(-90,60,108)">TSV 관통배선</text>
        <text x="160" y="195" textAnchor="middle" fill="#64748b" fontSize="8">HBM3e: 2048bit 버스 · 최대 1.2TB/s · 24~36GB 용량</text>
      </svg>
    ),

    tsv: (
      <svg viewBox="0 0 320 200" className="glos-diagram-svg">
        <text x="160" y="16" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">TSV (Through-Silicon Via) 단면</text>
        {/* 상단 다이 */}
        <rect x="60" y="25" width="200" height="50" rx="4" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5"/>
        <text x="160" y="52" textAnchor="middle" fill="#93c5fd" fontSize="9">상단 실리콘 다이</text>
        {/* 하단 다이 */}
        <rect x="60" y="130" width="200" height="45" rx="4" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5"/>
        <text x="160" y="155" textAnchor="middle" fill="#93c5fd" fontSize="9">하단 실리콘 다이</text>
        {/* TSV 구리 기둥 */}
        {[120,160,200].map(x => (
          <g key={x}>
            {/* 절연막 */}
            <rect x={x-7} y="72" width="14" height="60" rx="2" fill="#1a0020" stroke="#9333ea" strokeWidth="1"/>
            {/* 구리 코어 */}
            <rect x={x-5} y="74" width="10" height="56" rx="1" fill="#b45309" stroke="#f97316" strokeWidth="0.5"/>
            <text x={x} y="107" textAnchor="middle" fill="#fed7aa" fontSize="6">Cu</text>
          </g>
        ))}
        {/* 마이크로 범프 */}
        {[120,160,200].map(x => (
          <ellipse key={x} cx={x} cy="130" rx="7" ry="5" fill="#fbbf24" opacity="0.9"/>
        ))}
        {[120,160,200].map(x => (
          <ellipse key={x} cx={x} cy="72" rx="7" ry="5" fill="#fbbf24" opacity="0.9"/>
        ))}
        <text x="230" y="102" fill="#fcd34d" fontSize="7">구리(Cu)</text>
        <text x="230" y="113" fill="#c084fc" fontSize="7">절연막(SiO₂)</text>
        {/* 크기 주석 */}
        <line x1="55" y1="72" x2="55" y2="132" stroke="#64748b" strokeWidth="1"/>
        <line x1="51" y1="72" x2="59" y2="72" stroke="#64748b" strokeWidth="1"/>
        <line x1="51" y1="132" x2="59" y2="132" stroke="#64748b" strokeWidth="1"/>
        <text x="42" y="105" fill="#64748b" fontSize="7" transform="rotate(-90,42,105)">~50μm</text>
        <text x="160" y="192" textAnchor="middle" fill="#64748b" fontSize="8">직경 2~10μm 구리 기둥 → 다이 간 초단거리 연결</text>
      </svg>
    ),

    finfet: (
      <svg viewBox="0 0 320 200" className="glos-diagram-svg">
        <text x="160" y="16" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">FinFET vs 평면 MOSFET 비교</text>
        {/* 평면 MOSFET */}
        <text x="80" y="38" textAnchor="middle" fill="#94a3b8" fontSize="9">평면 MOSFET</text>
        <rect x="30" y="80" width="100" height="30" rx="2" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5"/>
        <rect x="65" y="55" width="30" height="28" rx="2" fill="#4a044e" stroke="#9333ea" strokeWidth="2"/>
        <text x="80" y="73" textAnchor="middle" fill="#c084fc" fontSize="7">게이트</text>
        <rect x="30" y="70" width="25" height="12" rx="2" fill="#1a3a1a" stroke="#16a34a" strokeWidth="1"/>
        <rect x="105" y="70" width="25" height="12" rx="2" fill="#1a3a1a" stroke="#16a34a" strokeWidth="1"/>
        <text x="42" y="79" textAnchor="middle" fill="#86efac" fontSize="6">S</text>
        <text x="117" y="79" textAnchor="middle" fill="#86efac" fontSize="6">D</text>
        <text x="80" y="98" textAnchor="middle" fill="#64748b" fontSize="7">채널 (1면만 제어)</text>
        <text x="80" y="120" fill="#ef4444" fontSize="8" textAnchor="middle">누설전류 ↑</text>
        {/* FinFET */}
        <text x="230" y="38" textAnchor="middle" fill="#94a3b8" fontSize="9">FinFET (3D)</text>
        {/* Fin */}
        <rect x="215" y="58" width="30" height="60" rx="3" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="2"/>
        <text x="230" y="95" textAnchor="middle" fill="#93c5fd" fontSize="7">Fin</text>
        <text x="230" y="105" textAnchor="middle" fill="#93c5fd" fontSize="7">(채널)</text>
        {/* 게이트 (3면 wrap) */}
        <rect x="205" y="65" width="50" height="40" rx="4" fill="none" stroke="#9333ea" strokeWidth="3"/>
        <text x="185" y="88" fill="#c084fc" fontSize="7">게이트</text>
        <text x="185" y="97" fill="#c084fc" fontSize="7">3면</text>
        {/* S/D */}
        <rect x="208" y="50" width="44" height="10" rx="2" fill="#1a3a1a" stroke="#16a34a" strokeWidth="1"/>
        <rect x="208" y="108" width="44" height="10" rx="2" fill="#1a3a1a" stroke="#16a34a" strokeWidth="1"/>
        <text x="230" y="59" textAnchor="middle" fill="#86efac" fontSize="6">소스</text>
        <text x="230" y="116" textAnchor="middle" fill="#86efac" fontSize="6">드레인</text>
        <text x="230" y="135" textAnchor="middle" fill="#4ade80" fontSize="8">누설전류 ↓ 제어력 ↑</text>
        {/* 구분선 */}
        <line x1="160" y1="40" x2="160" y2="150" stroke="#334155" strokeWidth="1" strokeDasharray="4,3"/>
        <text x="160" y="165" textAnchor="middle" fill="#64748b" fontSize="8">16nm~5nm 주력 공정 — 삼성·TSMC·Intel 채택</text>
      </svg>
    ),

    gaa: (
      <svg viewBox="0 0 320 200" className="glos-diagram-svg">
        <text x="160" y="16" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">GAA 나노시트 구조 (3nm 이하)</text>
        {/* 게이트 외부 박스 */}
        <rect x="60" y="40" width="200" height="130" rx="8" fill="#1a0020" stroke="#9333ea" strokeWidth="2.5"/>
        <text x="160" y="185" textAnchor="middle" fill="#c084fc" fontSize="9">게이트 (4면 전체 제어)</text>
        {/* 나노시트 채널들 */}
        {[0,1,2].map(i => (
          <g key={i}>
            <rect x="80" y={62+i*32} width="160" height="18" rx="4" fill="#0c2340" stroke="#38bdf8" strokeWidth="2"/>
            <text x="160" y={73+i*32} textAnchor="middle" fill="#7dd3fc" fontSize="8">
              나노시트 채널 #{i+1} (SiGe/Si)
            </text>
          </g>
        ))}
        {/* 소스 드레인 */}
        <rect x="35" y="62" width="30" height="82" rx="4" fill="#1a3a1a" stroke="#16a34a" strokeWidth="1.5"/>
        <text x="50" y="106" textAnchor="middle" fill="#86efac" fontSize="8" transform="rotate(-90,50,106)">소스(S)</text>
        <rect x="255" y="62" width="30" height="82" rx="4" fill="#1a3a1a" stroke="#16a34a" strokeWidth="1.5"/>
        <text x="270" y="106" textAnchor="middle" fill="#86efac" fontSize="8" transform="rotate(-90,270,106)">드레인(D)</text>
        {/* 화살표로 4면 제어 강조 */}
        {[70,90,110,130,150].map(y => (
          <g key={y}>
            <line x1="63" y1={y} x2="78" y2={y} stroke="#d946ef" strokeWidth="1" opacity="0.5"/>
            <line x1="242" y1={y} x2="257" y2={y} stroke="#d946ef" strokeWidth="1" opacity="0.5"/>
          </g>
        ))}
        <text x="160" y="197" textAnchor="middle" fill="#64748b" fontSize="8">삼성 3nm(2022) · TSMC 2nm(2025) · Intel RibbonFET</text>
      </svg>
    ),

    chiplet: (
      <svg viewBox="0 0 320 200" className="glos-diagram-svg">
        <text x="160" y="16" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">칩렛 (Chiplet) 구성 예시</text>
        {/* 패키지 외곽 */}
        <rect x="15" y="28" width="290" height="145" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1.5"/>
        {/* 인터포저 */}
        <rect x="20" y="33" width="280" height="135" rx="4" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1" opacity="0.5"/>
        <text x="160" y="47" textAnchor="middle" fill="#6366f1" fontSize="7">실리콘 인터포저 / UCIe 인터커넥트</text>
        {/* CPU 코어 다이 */}
        <rect x="30" y="55" width="80" height="55" rx="4" fill="#0c2340" stroke="#0ea5e9" strokeWidth="2"/>
        <text x="70" y="78" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold">CPU 코어</text>
        <text x="70" y="90" textAnchor="middle" fill="#7dd3fc" fontSize="7">TSMC N3</text>
        <text x="70" y="101" textAnchor="middle" fill="#64748b" fontSize="7">8코어</text>
        {/* GPU 타일 */}
        <rect x="120" y="55" width="80" height="55" rx="4" fill="#1a0020" stroke="#9333ea" strokeWidth="2"/>
        <text x="160" y="78" textAnchor="middle" fill="#c084fc" fontSize="8" fontWeight="bold">GPU 타일</text>
        <text x="160" y="90" textAnchor="middle" fill="#a78bfa" fontSize="7">TSMC N3</text>
        <text x="160" y="101" textAnchor="middle" fill="#64748b" fontSize="7">그래픽</text>
        {/* I/O 다이 */}
        <rect x="210" y="55" width="80" height="55" rx="4" fill="#0f1a0a" stroke="#16a34a" strokeWidth="2"/>
        <text x="250" y="75" textAnchor="middle" fill="#86efac" fontSize="8" fontWeight="bold">I/O 다이</text>
        <text x="250" y="87" textAnchor="middle" fill="#4ade80" fontSize="7">성숙 노드</text>
        <text x="250" y="98" textAnchor="middle" fill="#64748b" fontSize="7">PCIe/DDR</text>
        {/* HBM */}
        <rect x="30" y="120" width="50" height="35" rx="3" fill="#082f49" stroke="#38bdf8" strokeWidth="1.5"/>
        <text x="55" y="136" textAnchor="middle" fill="#7dd3fc" fontSize="7">HBM</text>
        <text x="55" y="147" textAnchor="middle" fill="#64748b" fontSize="7">메모리</text>
        {/* 연결선 */}
        {[
          [110,82,120,82], [200,82,210,82],
          [70,110,70,120], [110,140,120,140],
        ].map(([x1,y1,x2,y2],i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3,2"/>
        ))}
        <text x="160" y="192" textAnchor="middle" fill="#64748b" fontSize="8">각 타일을 최적 공정으로 분리 제조 → 조합 → 수율·비용↑</text>
      </svg>
    ),
  };

  return svgs[type] ?? null;
}

/* ── 용어 카드 ── */
function GlossaryCard({ item, isOpen, onToggle }) {
  const catInfo = GLOSSARY_CAT_LABEL[item.category];
  const hasDiagram = !!item.diagram;

  return (
    <div
      className={`glos-card${isOpen ? ' open' : ''}`}
      onClick={onToggle}
    >
      {/* 헤더 */}
      <div className="glos-card-header">
        <span className="glos-icon">{item.icon}</span>
        <div className="glos-term-wrap">
          <span className="glos-term">{item.term}</span>
          {item.abbr && <span className="glos-abbr">{item.abbr}</span>}
        </div>
        <span className="glos-cat-badge">
          {catInfo?.icon} {catInfo?.name}
        </span>
        {hasDiagram && <span className="glos-diagram-badge">📊 그림</span>}
        <span className="glos-chevron">{isOpen ? '▲' : '▼'}</span>
      </div>

      {/* 한 줄 요약 */}
      <p className="glos-short">{item.short}</p>

      {/* 펼쳤을 때 상세 + 다이어그램 */}
      {isOpen && (
        <div className="glos-body">
          <p className="glos-detail">{item.body}</p>
          {hasDiagram && (
            <div className="glos-diagram-wrap">
              <DiagramSVG type={item.diagram} />
            </div>
          )}
          {item.relatedTickers?.length > 0 && (
            <div className="glos-tickers">
              <span className="glos-tickers-label">관련 기업</span>
              {item.relatedTickers.map(t => (
                <span key={t} className="news-ticker-badge">{t}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── 메인 컴포넌트 ── */
export default function SemiGlossary() {
  const [activeGroup, setActiveGroup] = useState('all');
  const [activeCat,   setActiveCat]   = useState('all');
  const [openId,      setOpenId]      = useState(null);
  const [search,      setSearch]      = useState('');

  const catCount = useMemo(() => countGlossaryByCat(GLOSSARY_ITEMS), []);

  const visibleCats = useMemo(() => {
    if (activeGroup === 'all')      return [...PROCESS_CATS, ...INDUSTRY_CATS];
    if (activeGroup === 'process')  return PROCESS_CATS;
    if (activeGroup === 'industry') return INDUSTRY_CATS;
    return [];
  }, [activeGroup]);

  const catsWithItems = useMemo(() =>
    visibleCats.filter(c => (catCount[c] ?? 0) > 0),
  [visibleCats, catCount]);

  const groupCount = useMemo(() => ({
    all:      GLOSSARY_ITEMS.length,
    process:  GLOSSARY_ITEMS.filter(n => PROCESS_CATS.includes(n.category)).length,
    industry: GLOSSARY_ITEMS.filter(n => INDUSTRY_CATS.includes(n.category)).length,
  }), []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return GLOSSARY_ITEMS.filter(item => {
      const groupOk = activeGroup === 'all'
        ? true
        : activeGroup === 'process'
          ? PROCESS_CATS.includes(item.category)
          : INDUSTRY_CATS.includes(item.category);
      const catOk  = activeCat === 'all' || item.category === activeCat;
      const searchOk = !q || [item.term, item.abbr, item.short, item.body].some(
        t => t?.toLowerCase().includes(q)
      );
      return groupOk && catOk && searchOk;
    });
  }, [activeGroup, activeCat, search]);

  function handleGroupClick(g) {
    setActiveGroup(g);
    setActiveCat('all');
    setOpenId(null);
  }

  return (
    <div>
      {/* 상단 바 */}
      <div className="news-live-bar">
        <span className="news-total-count">총 {GLOSSARY_ITEMS.length}개 핵심 용어 · 그림 포함 {GLOSSARY_ITEMS.filter(i=>i.diagram).length}개</span>
      </div>

      {/* 검색 */}
      <div className="glos-search-wrap">
        <input
          className="glos-search"
          type="text"
          placeholder="🔍  용어·약어·설명 검색..."
          value={search}
          onChange={e => { setSearch(e.target.value); setOpenId(null); }}
        />
        {search && (
          <button className="glos-search-clear" onClick={() => setSearch('')}>✕</button>
        )}
      </div>

      {/* 그룹 탭 */}
      <div className="news-layer-tabs">
        {[
          { id: 'all',      label: '전체',          cnt: groupCount.all },
          { id: 'process',  label: '⚙ 공정 흐름',   cnt: groupCount.process },
          { id: 'industry', label: '🏢 산업 플레이어', cnt: groupCount.industry },
        ].map(g => (
          <button
            key={g.id}
            className={`news-layer-tab${activeGroup === g.id ? ' active' : ''}`}
            onClick={() => handleGroupClick(g.id)}
          >
            {g.label}
            <span className="news-count-badge">{g.cnt}</span>
          </button>
        ))}
      </div>

      {/* 카테고리 필터 */}
      <div className="news-comp-filters">
        <button
          className={`filter-btn${activeCat === 'all' ? ' active' : ''}`}
          onClick={() => { setActiveCat('all'); setOpenId(null); }}
        >
          전체 ({activeGroup === 'all' ? groupCount.all : activeGroup === 'process' ? groupCount.process : groupCount.industry})
        </button>
        {catsWithItems.map(catId => {
          const info = GLOSSARY_CAT_LABEL[catId];
          if (!info) return null;
          return (
            <button
              key={catId}
              className={`filter-btn${activeCat === catId ? ' active' : ''}`}
              onClick={() => { setActiveCat(catId); setOpenId(null); }}
            >
              {info.icon} {info.name}
              <span className="news-comp-count">{catCount[catId] ?? 0}</span>
            </button>
          );
        })}
      </div>

      {/* 결과 수 */}
      <div className="news-result-summary">
        <span>{filtered.length}개 용어</span>
        {filtered.filter(i => i.diagram).length > 0 && (
          <span style={{ color: '#94a3b8', fontSize: 12 }}>
            📊 그림 {filtered.filter(i => i.diagram).length}개 포함
          </span>
        )}
      </div>

      {/* 용어 카드 목록 */}
      {filtered.length === 0 ? (
        <p className="hint-text">해당 조건의 용어가 없습니다.</p>
      ) : (
        <div className="glos-list">
          {filtered.map(item => (
            <GlossaryCard
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={() => setOpenId(openId === item.id ? null : item.id)}
            />
          ))}
        </div>
      )}

      <p className="hint-text" style={{ marginTop: 24 }}>
        반도체 밸류체인 핵심 용어 {GLOSSARY_ITEMS.length}개 · 2025~2026 기준 · 클릭하면 상세 설명 & 그림 확인
      </p>
    </div>
  );
}
