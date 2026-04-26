'use client';

import { useState } from 'react';
import { SPACE_LAYERS } from '@/data/spaceCompanies';
import SpaceCompanyPanel from './SpaceCompanyPanel';

export default function SpaceLayerMap({ filterLayerId, filterComponentId } = {}) {
  const [activeComp, setActiveComp] = useState(null);

  // filterLayerId가 있으면 해당 레이어만, 없으면 전체 표시
  const visibleLayers = filterLayerId
    ? SPACE_LAYERS.filter(l => l.id === filterLayerId).map(layer =>
        filterComponentId
          ? { ...layer, components: layer.components.filter(c => c.id === filterComponentId) }
          : layer
      )
    : SPACE_LAYERS;

  const handleSelect = (comp) => {
    setActiveComp(prev => prev?.id === comp.id ? null : comp);
  };

  return (
    <div>
      {visibleLayers.map((layer, li) => (
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
            <SpaceCompanyPanel comp={activeComp} />
          )}

          {/* Divider between layers */}
          {li < visibleLayers.length - 1 && (
            <div className="layer-divider">↕</div>
          )}
        </div>
      ))}

      {!activeComp && (
        <p className="hint-text" style={{ marginTop: 20 }}>
          🚀 카드를 클릭하면 시가총액 Top 기업 상세 정보를 확인할 수 있습니다
        </p>
      )}
    </div>
  );
}
