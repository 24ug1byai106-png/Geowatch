import React, { useState, useRef } from 'react';
import type { PresetDataset, CalculatedChangeRegion } from '../types';

interface TemporalAnalysisProps {
  dataset: PresetDataset;
  onSelectObject: (obj: CalculatedChangeRegion) => void;
}

export const TemporalAnalysis: React.FC<TemporalAnalysisProps> = ({ dataset, onSelectObject }) => {
  const [viewMode, setViewMode] = useState<'SPLIT VIEW' | 'SWIPE' | 'OVERLAY' | 'CHANGE MAP'>('SPLIT VIEW');
  const [swipePos, setSwipePos] = useState<number>(50);
  const [overlayOpacity, setOverlayOpacity] = useState<number>(50);
  const [showOverlays, setShowOverlays] = useState<boolean>(true);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'structure' | 'vegetation' | 'high_intensity'>('all');
  const [isHoveringObject, setIsHoveringObject] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleSwipeMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const offsetX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
    setSwipePos(percentage);
  };

  const analysis = dataset.analysisResult;
  const rawRegions = analysis?.regions || [];
  const changeRegions = rawRegions.filter(r => 
    activeCategoryFilter === 'all' || r.category === activeCategoryFilter
  );

  return (
    <div className="hud-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* Header & Controls */}
      <div className="hud-header" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="led-amber" />
          <span>TEMPORAL CHANGE ANALYSIS // {dataset.beforeYear} VS {dataset.afterYear}</span>
        </div>

        {/* View Mode Switcher + Overlays Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          
          <button
            onClick={() => setShowOverlays(!showOverlays)}
            style={{
              background: showOverlays ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              color: showOverlays ? '#00f0ff' : 'var(--text-dim)',
              border: `1px solid ${showOverlays ? '#00f0ff' : 'var(--border-dim)'}`,
              padding: '3px 8px',
              fontSize: '0.65rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              cursor: 'pointer',
              borderRadius: '2px',
              transition: 'all 0.15s ease'
            }}
          >
            OVERLAYS: {showOverlays ? '● ON' : '○ OFF'}
          </button>

          <div style={{ display: 'flex', gap: '4px' }}>
            {(['SPLIT VIEW', 'SWIPE', 'OVERLAY', 'CHANGE MAP'] as const).map((mode) => {
              const isActive = viewMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  style={{
                    background: isActive ? 'var(--accent-amber)' : 'transparent',
                    color: isActive ? '#07090e' : 'var(--text-dim)',
                    border: '1px solid ' + (isActive ? 'var(--accent-amber)' : 'var(--border-dim)'),
                    padding: '3px 8px',
                    fontSize: '0.65rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {mode}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Image Comparison Area */}
      <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        
        {/* Opacity slider for OVERLAY mode */}
        {viewMode === 'OVERLAY' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(10, 14, 20, 0.8)',
            padding: '6px 12px',
            border: '1px solid var(--border-dim)',
            fontSize: '0.7rem',
            fontFamily: 'var(--font-mono)'
          }}>
            <span style={{ color: 'var(--text-dim)' }}>{dataset.beforeYear} BASELINE</span>
            <input
              type="range"
              min="0"
              max="100"
              value={overlayOpacity}
              onChange={(e) => setOverlayOpacity(Number(e.target.value))}
              style={{ flex: 1, accentColor: 'var(--accent-amber)', cursor: 'pointer' }}
            />
            <span style={{ color: 'var(--accent-amber)', fontWeight: 'bold' }}>
              {dataset.afterYear} COMPARISON ({overlayOpacity}%)
            </span>
          </div>
        )}

        {/* Dynamic Visualizer Canvas Container */}
        <div
          ref={containerRef}
          onMouseMove={viewMode === 'SWIPE' ? handleSwipeMove : undefined}
          onTouchMove={viewMode === 'SWIPE' ? handleSwipeMove : undefined}
          style={{
            position: 'relative',
            flex: 1,
            minHeight: '340px',
            background: '#04060a',
            border: '1px solid var(--border-dim)',
            overflow: 'hidden',
            userSelect: 'none'
          }}
        >
          {/* MODE 1: SPLIT VIEW */}
          {viewMode === 'SPLIT VIEW' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: '100%', gap: '2px', background: 'var(--border-dim)' }}>
              {/* Left: Baseline */}
              <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
                <img
                  src={dataset.beforeImage}
                  alt="Baseline Satellite Observation"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  background: 'rgba(0, 0, 0, 0.85)',
                  border: '1px solid #60a5fa',
                  padding: '3px 8px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  color: '#60a5fa',
                  fontWeight: 'bold',
                  zIndex: 10
                }}>
                  {dataset.beforeYear} SATELLITE OBSERVATION (BASELINE)
                </div>
              </div>

              {/* Right: Comparison with Interactive Overlays */}
              <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
                <img
                  src={dataset.afterImage}
                  alt="Comparison Satellite Observation"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: 'rgba(0, 0, 0, 0.85)',
                  border: '1px solid var(--accent-amber)',
                  padding: '3px 8px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  color: 'var(--accent-amber)',
                  fontWeight: 'bold',
                  zIndex: 10
                }}>
                  {dataset.afterYear} SATELLITE OBSERVATION (COMPARISON)
                </div>

                {/* Overlaid Detected Change Regions */}
                {showOverlays && changeRegions.map((region) => {
                  const isHov = isHoveringObject === region.id;
                  const borderCol = region.category === 'structure' ? '#ff9900' : (region.category === 'vegetation' ? '#10b981' : '#f43f5e');
                  const emoji = region.category === 'structure' ? '🏢' : (region.category === 'vegetation' ? '🌳' : '🛣️');

                  return (
                    <div
                      key={region.id}
                      onClick={() => onSelectObject(region)}
                      onMouseEnter={() => setIsHoveringObject(region.id)}
                      onMouseLeave={() => setIsHoveringObject(null)}
                      title={`Click to inspect ${region.name} (${region.areaSqMeters} m²)`}
                      style={{
                        position: 'absolute',
                        left: `${region.x}%`,
                        top: `${region.y}%`,
                        width: `${Math.max(4, region.width)}%`,
                        height: `${Math.max(4, region.height)}%`,
                        border: `2px solid ${borderCol}`,
                        backgroundColor: isHov ? 'rgba(255, 153, 0, 0.35)' : 'rgba(255, 153, 0, 0.1)',
                        cursor: 'pointer',
                        zIndex: 20,
                        transition: 'all 0.15s ease',
                        boxShadow: isHov ? `0 0 14px ${borderCol}` : `0 0 4px ${borderCol}`
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        bottom: '100%',
                        left: 0,
                        background: 'rgba(0, 0, 0, 0.92)',
                        border: `1px solid ${borderCol}`,
                        color: borderCol,
                        fontSize: '0.58rem',
                        fontFamily: 'var(--font-mono)',
                        padding: '1px 5px',
                        whiteSpace: 'nowrap',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}>
                        <span>{emoji}</span>
                        <span>{region.type} ({region.areaSqMeters} m²)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* MODE 2: SWIPE */}
          {viewMode === 'SWIPE' && (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              {/* Underneath: After */}
              <img
                src={dataset.afterImage}
                alt="Observation"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0, 0, 0, 0.85)', border: '1px solid var(--accent-amber)', padding: '3px 8px', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent-amber)', fontWeight: 'bold', zIndex: 5 }}>
                {dataset.afterYear} AFTER
              </div>

              {/* Overlaid Detected Regions on Swipe */}
              {showOverlays && changeRegions.map((region) => {
                const borderCol = region.category === 'structure' ? '#ff9900' : (region.category === 'vegetation' ? '#10b981' : '#f43f5e');
                return (
                  <div
                    key={region.id}
                    onClick={() => onSelectObject(region)}
                    style={{
                      position: 'absolute',
                      left: `${region.x}%`,
                      top: `${region.y}%`,
                      width: `${region.width}%`,
                      height: `${region.height}%`,
                      border: `1.5px solid ${borderCol}`,
                      backgroundColor: 'rgba(255, 153, 0, 0.15)',
                      cursor: 'pointer',
                      zIndex: 8
                    }}
                  />
                );
              })}

              {/* Clipped Top: Baseline */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: `${swipePos}%`,
                height: '100%',
                overflow: 'hidden',
                borderRight: '2px solid var(--accent-amber)'
              }}>
                <img
                  src={dataset.beforeImage}
                  alt="Baseline Observation"
                  style={{
                    width: containerRef.current ? containerRef.current.clientWidth : '100%',
                    height: '100%',
                    maxWidth: 'none',
                    objectFit: 'cover'
                  }}
                />
                <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(0, 0, 0, 0.85)', border: '1px solid #60a5fa', padding: '3px 8px', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#60a5fa', fontWeight: 'bold' }}>
                  {dataset.beforeYear} BEFORE
                </div>
              </div>

              {/* Slider Handle Divider */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: `${swipePos}%`,
                bottom: 0,
                width: '3px',
                background: 'var(--accent-amber)',
                transform: 'translateX(-50%)',
                cursor: 'ew-resize',
                zIndex: 10,
                boxShadow: '0 0 10px rgba(255, 153, 0, 0.8)'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: '#ff9900',
                  color: '#07090e',
                  padding: '3px 6px',
                  fontSize: '0.6rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 900,
                  borderRadius: '2px'
                }}>
                  ↔
                </div>
              </div>
            </div>
          )}

          {/* MODE 3: OVERLAY */}
          {viewMode === 'OVERLAY' && (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <img
                src={dataset.beforeImage}
                alt="Baseline"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <img
                src={dataset.afterImage}
                alt="Overlay"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: overlayOpacity / 100
                }}
              />
            </div>
          )}

          {/* MODE 4: CHANGE MAP (Calculated Differential Mask Overlay) */}
          {viewMode === 'CHANGE MAP' && (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <img
                src={dataset.afterImage}
                alt="Background"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.65)' }}
              />

              {analysis?.changeMaskDataUrl && (
                <img
                  src={analysis.changeMaskDataUrl}
                  alt="Calculated Pixel Change Mask"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    mixBlendMode: 'screen',
                    pointerEvents: 'none'
                  }}
                />
              )}

              {showOverlays && changeRegions.map((region) => {
                const isHov = isHoveringObject === region.id;
                const borderCol = region.category === 'structure' ? '#ff9900' : (region.category === 'vegetation' ? '#10b981' : '#f43f5e');
                return (
                  <div
                    key={region.id}
                    onClick={() => onSelectObject(region)}
                    onMouseEnter={() => setIsHoveringObject(region.id)}
                    onMouseLeave={() => setIsHoveringObject(null)}
                    style={{
                      position: 'absolute',
                      left: `${region.x}%`,
                      top: `${region.y}%`,
                      width: `${region.width}%`,
                      height: `${region.height}%`,
                      border: `1.5px solid ${borderCol}`,
                      backgroundColor: isHov ? 'rgba(255, 153, 0, 0.35)' : 'rgba(255, 153, 0, 0.12)',
                      cursor: 'pointer',
                      zIndex: 20,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      bottom: '100%',
                      left: 0,
                      background: 'rgba(0, 0, 0, 0.9)',
                      border: `1px solid ${borderCol}`,
                      color: borderCol,
                      fontSize: '0.58rem',
                      fontFamily: 'var(--font-mono)',
                      padding: '1px 4px',
                      whiteSpace: 'nowrap'
                    }}>
                      {region.type} ({region.areaSqMeters} m²)
                    </div>
                  </div>
                );
              })}

              <div style={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                background: 'rgba(0, 0, 0, 0.85)',
                border: '1px solid var(--accent-amber)',
                padding: '4px 8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                color: 'var(--accent-amber)',
                zIndex: 25
              }}>
                CALCULATED CHANGE MAP (PIXEL DIFFERENCING)
              </div>
            </div>
          )}
        </div>

        {/* Interactive Legend Strip with Category Filter buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(10, 14, 20, 0.85)',
          border: '1px solid var(--border-dim)',
          padding: '8px 12px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.68rem',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveCategoryFilter('all')}
              style={{
                background: activeCategoryFilter === 'all' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                color: activeCategoryFilter === 'all' ? '#fff' : 'var(--text-dim)',
                border: `1px solid ${activeCategoryFilter === 'all' ? '#fff' : 'transparent'}`,
                padding: '2px 6px',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                borderRadius: '2px'
              }}
            >
              ALL ({rawRegions.length})
            </button>

            <button
              onClick={() => setActiveCategoryFilter(activeCategoryFilter === 'structure' ? 'all' : 'structure')}
              style={{
                background: activeCategoryFilter === 'structure' ? 'rgba(255, 153, 0, 0.2)' : 'transparent',
                color: activeCategoryFilter === 'structure' ? '#ff9900' : '#cbd5e1',
                border: `1px solid ${activeCategoryFilter === 'structure' ? '#ff9900' : 'rgba(255, 153, 0, 0.3)'}`,
                padding: '2px 8px',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                borderRadius: '2px'
              }}
            >
              <span style={{ width: '8px', height: '8px', backgroundColor: '#ff9900' }} />
              <span>🏢 Potential Structural Change ({rawRegions.filter(r => r.category === 'structure').length})</span>
            </button>

            <button
              onClick={() => setActiveCategoryFilter(activeCategoryFilter === 'vegetation' ? 'all' : 'vegetation')}
              style={{
                background: activeCategoryFilter === 'vegetation' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                color: activeCategoryFilter === 'vegetation' ? '#10b981' : '#cbd5e1',
                border: `1px solid ${activeCategoryFilter === 'vegetation' ? '#10b981' : 'rgba(16, 185, 129, 0.3)'}`,
                padding: '2px 8px',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                borderRadius: '2px'
              }}
            >
              <span style={{ width: '8px', height: '8px', backgroundColor: '#10b981' }} />
              <span>🌳 Potential Vegetation Change ({rawRegions.filter(r => r.category === 'vegetation').length})</span>
            </button>

            <button
              onClick={() => setActiveCategoryFilter(activeCategoryFilter === 'high_intensity' ? 'all' : 'high_intensity')}
              style={{
                background: activeCategoryFilter === 'high_intensity' ? 'rgba(244, 63, 94, 0.2)' : 'transparent',
                color: activeCategoryFilter === 'high_intensity' ? '#f43f5e' : '#cbd5e1',
                border: `1px solid ${activeCategoryFilter === 'high_intensity' ? '#f43f5e' : 'rgba(244, 63, 94, 0.3)'}`,
                padding: '2px 8px',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                borderRadius: '2px'
              }}
            >
              <span style={{ width: '8px', height: '8px', backgroundColor: '#f43f5e' }} />
              <span>🛣️ High-Intensity Surface Shift ({rawRegions.filter(r => r.category === 'high_intensity').length})</span>
            </button>
          </div>

          <div style={{ color: '#00f0ff', fontSize: '0.62rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>⚡ Click any region overlay to inspect telemetry</span>
          </div>
        </div>

      </div>

    </div>
  );
};
