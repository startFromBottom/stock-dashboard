'use client';

import { useState } from 'react';
import { LAYERS } from '@/data/companies';
import CompanyPanel from './CompanyPanel';

export default function LayerMap() {
  const [activeComp, setActiveComp] = useState(null);

  const handleSelect = (comp) => {
    setActiveComp(prev => prev?.id === comp.id ? null : comp);
  };

  return (
    <div>
      {LAYERS.map((layer, li) => (
        <div key={layer.id}>
          {/* Layer block */}
          <div className="layer-section">
            <div className="layer-label">{layer.layer}</div>
            <div className="comp-row">
              {layer.components.map(comp => (
                <div
                  key={comp.id}
                  className={`comp-card${activeComp?.id === comp.id ? ' active' : ''}`}
                  onClick={() => handleSelect(comp)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && handleSelect(comp)}
                >
                  <div className="comp-icon">{comp.icon}</div>
                  <div className="comp-name">{comp.name}</div>
                  <div className="comp-desc">{comp.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Show company panel right below active component's layer */}
          {activeComp && layer.components.some(c => c.id === activeComp.id) && (
            <CompanyPanel comp={activeComp} />
          )}

          {/* Divider between layers */}
          {li < LAYERS.length - 1 && (
            <div className="layer-divider">↕</div>
          )}
        </div>
      ))}

      {!activeComp && (
        <p className="hint-text" style={{ marginTop: 20 }}>
          💡 카드를 클릭하면 시가총액 Top 5 기업 상세 정보를 확인할 수 있습니다
        </p>
      )}
    </div>
  );
}
