'use client';

import { useState } from 'react';

const ITEMS = [
  {
    id: 'rack',
    label: '🖥️ AI GPU 서버랙',
    body: '데이터센터의 핵심. NVIDIA H100/B200/Rubin GPU를 탑재한 서버들이 밀집 배치됩니다. GB200 NVL72 기준 랙 하나에 72개 GPU, 랙당 전력 소비 최대 120kW+에 달합니다.',
  },
  {
    id: 'network',
    label: '🔀 네트워크 스위치',
    body: 'GPU 간 초고속 데이터 전송을 위한 InfiniBand 또는 이더넷 스위치. NVIDIA Quantum-X800(3200Gb/s)나 Broadcom Tomahawk6 칩 기반으로 수천 개 GPU를 낮은 레이턴시로 연결합니다.',
  },
  {
    id: 'storage',
    label: '📦 스토리지 어레이',
    body: 'AI 학습 데이터셋과 모델 체크포인트를 저장. NVMe 올플래시 스토리지가 주로 사용되며, 수십 PB 용량에 초당 수백 GB의 I/O 처리 능력이 요구됩니다.',
  },
  {
    id: 'cooling',
    label: '❄️ 냉각 시스템',
    body: 'AI GPU는 랙당 40~120kW의 열을 발생. 전통 공냉(CRAC) 외에도 직접 액침냉각(DLC), 칩 수냉 방식이 확산 중. 냉각 효율은 PUE 지표(이상적 = 1.0)로 측정합니다.',
  },
  {
    id: 'power',
    label: '⚡ 전력 분배 (PDU/UPS)',
    body: '안정적인 전력 공급을 위한 배전반(PDU), 무정전전원장치(UPS). 대형 AI 데이터센터 한 곳이 수백~수천 MW를 소비하며, 이는 소형 도시 전체 소비량과 맞먹습니다.',
  },
  {
    id: 'monitor',
    label: '📊 모니터링 (NOC/DCIM)',
    body: '수천 대 서버의 온도·전력·네트워크 상태를 실시간 감시하는 DCIM 시스템. GPU 장애, 과열, 네트워크 이상을 즉각 탐지·대응합니다.',
  },
];

export default function Illustration() {
  const [active, setActive] = useState('rack');

  return (
    <div className="illust-wrap">
      {/* SVG */}
      <div className="illust-svg">
        <svg viewBox="0 0 560 440" xmlns="http://www.w3.org/2000/svg">
          <rect width="560" height="440" fill="#0f172a" />
          <defs>
            <pattern id="g" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0L0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="560" height="440" fill="url(#g)" />

          {/* Ceiling cable tray */}
          <rect x="0" y="30" width="560" height="18" fill="#1e293b" rx="2" />
          <rect x="10" y="34" width="540" height="3" fill="#334155" rx="1" />
          <line x1="60"  y1="30" x2="60"  y2="48" stroke="#f59e0b" strokeWidth="2" opacity=".7" />
          <line x1="100" y1="30" x2="100" y2="48" stroke="#3b82f6" strokeWidth="2" opacity=".7" />
          <line x1="200" y1="30" x2="200" y2="48" stroke="#10b981" strokeWidth="2" opacity=".7" />
          <line x1="340" y1="30" x2="340" y2="48" stroke="#f59e0b" strokeWidth="2" opacity=".7" />
          <line x1="460" y1="30" x2="460" y2="48" stroke="#3b82f6" strokeWidth="2" opacity=".7" />

          {/* ── GPU Server Racks ── */}
          <g onClick={() => setActive('rack')} style={{ cursor: 'pointer' }}>
            {[30, 100, 170].map((x, i) => (
              <g key={i}>
                <rect x={x} y="80" width="60" height="200" rx="4"
                  fill={active === 'rack' ? '#1e3a5f' : '#172135'}
                  stroke="#3b82f6" strokeWidth={active === 'rack' ? 2 : 1} />
                {[90,102,114,126,138,150,162,174,186].map((y, j) => (
                  <rect key={j} x={x+5} y={y} width="50" height="8" rx="2"
                    fill={j % 3 === 2 ? '#7c3aed' : '#1d4ed8'} opacity="0.85" />
                ))}
                <circle cx={x+46} cy="94"  r="2" fill="#22c55e" className="pulse" />
                <circle cx={x+46} cy="130" r="2" fill="#f59e0b" className="blink" />
                <text x={x+30} y="292" textAnchor="middle" fill="#64748b" fontSize="8">
                  RACK {String.fromCharCode(65 + i)}
                </text>
              </g>
            ))}
            <rect x="28" y="60" width="206" height="18" rx="4"
              fill={active === 'rack' ? '#1e3a5f' : '#172135'}
              stroke="#3b82f6" strokeWidth={active === 'rack' ? 2 : 1} />
            <text x="131" y="72" textAnchor="middle" fill="#93c5fd" fontSize="9" fontWeight="bold">
              🖥 AI GPU 서버랙
            </text>
          </g>

          {/* ── Network Switch ── */}
          <g onClick={() => setActive('network')} style={{ cursor: 'pointer' }}>
            <rect x="248" y="80" width="80" height="200" rx="4"
              fill={active === 'network' ? '#14532d' : '#0f2820'}
              stroke="#22c55e" strokeWidth={active === 'network' ? 2 : 1} />
            {[95,107,119,131].map((y, i) => (
              <rect key={i} x="254" y={y} width="68" height="6" rx="1" fill="#166534" />
            ))}
            {[258,265,272,279,286,293,300,307,314].map((cx, i) => (
              <circle key={i} cx={cx} cy="98" r="2"
                fill={i === 4 ? '#fbbf24' : '#4ade80'}
                className={i === 4 ? 'blink' : 'pulse'} />
            ))}
            {[256,270,284,298].map((x, i) => (
              <rect key={i} x={x} y="153" width="12" height="8" rx="1"
                fill={i < 2 ? '#0ea5e9' : '#22c55e'} />
            ))}
            <rect x="254" y="200" width="68" height="20" rx="2" fill="#0f172a" />
            <text x="288" y="213" textAnchor="middle" fill="#4ade80" fontSize="7" fontFamily="monospace">
              SW&gt; ACTIVE
            </text>
            <rect x="246" y="60" width="84" height="18" rx="4"
              fill={active === 'network' ? '#14532d' : '#0f2820'}
              stroke="#22c55e" strokeWidth={active === 'network' ? 2 : 1} />
            <text x="288" y="72" textAnchor="middle" fill="#86efac" fontSize="9" fontWeight="bold">
              🔀 네트워크 스위치
            </text>
          </g>

          {/* ── Storage ── */}
          <g onClick={() => setActive('storage')} style={{ cursor: 'pointer' }}>
            <rect x="348" y="80" width="80" height="200" rx="4"
              fill={active === 'storage' ? '#3b1f0f' : '#200e07'}
              stroke="#f97316" strokeWidth={active === 'storage' ? 2 : 1} />
            {[90,104,118,132,146,160,174,188].map((y, i) => (
              <g key={i}>
                <rect x="353" y={y} width="70" height="10" rx="2" fill="#431407" />
                <circle cx="415" cy={y + 5} r="2"
                  fill={i % 2 === 0 ? '#f97316' : '#22c55e'}
                  className={i % 2 === 0 ? 'blink' : 'pulse'} />
              </g>
            ))}
            <rect x="353" y="215" width="70" height="28" rx="2" fill="#0f172a" />
            <text x="388" y="226" textAnchor="middle" fill="#fb923c" fontSize="7" fontFamily="monospace">
              USED: 78%
            </text>
            <rect x="355" y="229" width="66" height="4" rx="2" fill="#1f2937" />
            <rect x="355" y="229" width="52" height="4" rx="2" fill="#f97316" />
            <rect x="346" y="60" width="84" height="18" rx="4"
              fill={active === 'storage' ? '#3b1f0f' : '#200e07'}
              stroke="#f97316" strokeWidth={active === 'storage' ? 2 : 1} />
            <text x="388" y="72" textAnchor="middle" fill="#fdba74" fontSize="9" fontWeight="bold">
              📦 스토리지 어레이
            </text>
          </g>

          {/* ── Cooling ── */}
          <g onClick={() => setActive('cooling')} style={{ cursor: 'pointer' }}>
            <rect x="448" y="80" width="90" height="200" rx="4"
              fill={active === 'cooling' ? '#0c1e3a' : '#080f1d'}
              stroke="#0ea5e9" strokeWidth={active === 'cooling' ? 2 : 1} />
            <rect x="453" y="90" width="80" height="60" rx="2" fill="#0f2d4a" />
            <g className="spin-fan">
              {[0, 60, 120].map((rot, i) => (
                <ellipse key={i} cx="493" cy="120" rx="24" ry="6"
                  fill="#0369a1" opacity="0.7"
                  transform={`rotate(${rot}, 493, 120)`} />
              ))}
            </g>
            <circle cx="493" cy="120" r="5" fill="#0c1e3a" />
            <rect x="453" y="158" width="80" height="22" rx="2" fill="#0f172a" />
            <text x="493" y="170" textAnchor="middle" fill="#38bdf8" fontSize="8" fontFamily="monospace">
              INLET: 18°C
            </text>
            <rect x="453" y="190" width="80" height="35" rx="2" fill="#0f172a" opacity=".7" />
            {[460,472,484,496].map((x, i) => (
              <rect key={i} x={x} y="197" width="8" height="22" rx="3"
                fill={i % 2 === 0 ? '#0369a1' : '#0ea5e9'} />
            ))}
            <text x="493" y="242" textAnchor="middle" fill="#7dd3fc" fontSize="7">냉수 IN/OUT</text>
            <rect x="446" y="60" width="94" height="18" rx="4"
              fill={active === 'cooling' ? '#0c1e3a' : '#080f1d'}
              stroke="#0ea5e9" strokeWidth={active === 'cooling' ? 2 : 1} />
            <text x="493" y="72" textAnchor="middle" fill="#7dd3fc" fontSize="9" fontWeight="bold">
              ❄️ 냉각 시스템
            </text>
          </g>

          {/* Connector cables */}
          {[90, 160, 230].map((x, i) => (
            <path key={i} d={`M ${x} 175 L 248 175`}
              stroke="#22c55e" strokeWidth="1.5" fill="none" opacity=".4" strokeDasharray="4 3" />
          ))}
          <path d="M 328 175 L 348 175" stroke="#f97316" strokeWidth="1.5" fill="none" opacity=".4" strokeDasharray="4 3" />
          <path d="M 428 175 L 448 175" stroke="#0ea5e9" strokeWidth="1.5" fill="none" opacity=".4" strokeDasharray="4 3" />

          {/* ── Power PDU ── */}
          <g onClick={() => setActive('power')} style={{ cursor: 'pointer' }}>
            <rect x="30" y="320" width="220" height="70" rx="6"
              fill={active === 'power' ? '#1e1b3a' : '#12102a'}
              stroke="#a855f7" strokeWidth={active === 'power' ? 2 : 1} />
            <text x="140" y="338" textAnchor="middle" fill="#c4b5fd" fontSize="9" fontWeight="bold">
              ⚡ 전력 분배 (PDU / UPS)
            </text>
            {[40,62,84,106,128,150].map((x, i) => (
              <g key={i}>
                <rect x={x} y="344" width="18" height="30" rx="3" fill="#2e1065" />
                <rect x={x+4} y="348" width="10" height="4" rx="1"
                  fill={i === 3 ? '#f59e0b' : '#a855f7'}
                  className={i === 3 ? 'blink' : undefined} />
              </g>
            ))}
            <rect x="178" y="344" width="62" height="30" rx="3" fill="#0f172a" />
            <text x="209" y="355" textAnchor="middle" fill="#c4b5fd" fontSize="7" fontFamily="monospace">2.4 MW</text>
            <text x="209" y="365" textAnchor="middle" fill="#7c3aed" fontSize="7" fontFamily="monospace">PUE: 1.18</text>
          </g>

          {/* ── Monitoring ── */}
          <g onClick={() => setActive('monitor')} style={{ cursor: 'pointer' }}>
            <rect x="270" y="320" width="260" height="70" rx="6"
              fill={active === 'monitor' ? '#1a1a2e' : '#0f0f1d'}
              stroke="#f59e0b" strokeWidth={active === 'monitor' ? 2 : 1} />
            <text x="400" y="338" textAnchor="middle" fill="#fcd34d" fontSize="9" fontWeight="bold">
              📊 운영 & 모니터링 (NOC / DCIM)
            </text>
            <rect x="280" y="344" width="100" height="36" rx="3" fill="#0f172a" />
            <polyline
              points="283,375 290,365 298,370 306,358 314,362 322,352 330,356 338,345 346,349 354,355 362,350 370,358 378,352"
              stroke="#22c55e" strokeWidth="1.5" fill="none" />
            <text x="284" y="353" fill="#64748b" fontSize="6">CPU %</text>
            <rect x="390" y="344" width="130" height="36" rx="3" fill="#0f172a" />
            <text x="394" y="354" fill="#4ade80" fontSize="7" fontFamily="monospace">✓ GPU TEMP: OK</text>
            <text x="394" y="363" fill="#4ade80" fontSize="7" fontFamily="monospace">✓ NETWORK: OK</text>
            <text x="394" y="372" fill="#fbbf24" fontSize="7" fontFamily="monospace">⚠ RACK B2: 42°C</text>
          </g>

          {/* Power lines */}
          {[60, 130, 200, 288, 388, 493].map((x, i) => (
            <line key={i} x1="140" y1="320" x2={x} y2="280"
              stroke="#a855f7" strokeWidth="1" opacity="0.25" strokeDasharray="3 3" />
          ))}

          {/* Legend */}
          <rect x="10" y="405" width="540" height="28" rx="4" fill="#1e293b" opacity=".8" />
          {[
            { cx: 22,  color: '#3b82f6', label: 'GPU 서버' },
            { cx: 82,  color: '#22c55e', label: '네트워크' },
            { cx: 148, color: '#f97316', label: '스토리지' },
            { cx: 208, color: '#0ea5e9', label: '냉각' },
            { cx: 258, color: '#a855f7', label: '전력' },
            { cx: 308, color: '#f59e0b', label: '모니터링' },
          ].map(({ cx, color, label }) => (
            <g key={cx}>
              <circle cx={cx} cy="419" r="4" fill={color} />
              <text x={cx + 8} y="423" fill="#94a3b8" fontSize="8">{label}</text>
            </g>
          ))}
          <text x="540" y="423" textAnchor="end" fill="#475569" fontSize="8">▶ 클릭으로 설명 확인</text>
        </svg>
      </div>

      {/* Description panel */}
      <div className="illust-panel">
        <div className="illust-panel-title">📋 구성 요소 설명</div>
        {ITEMS.map(item => (
          <div
            key={item.id}
            className={`illust-item${active === item.id ? ' active' : ''}`}
            onClick={() => setActive(item.id)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && setActive(item.id)}
          >
            <div className="illust-item-label">{item.label}</div>
            <div className="illust-item-body">{item.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
