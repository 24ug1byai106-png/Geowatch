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
  const changeRegions = analysis?.regions || [];

  return (
    <div className="hud-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* Header & Controls */}
      <div className="hud-header" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="led-amber" />
          <span>TEMPORAL CHANGE ANALYSIS // {dataset.beforeYear} VS {dataset.afterYear}</span>
        </div>

        {/* View Mode Switcher */}
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
            <span style={{ color: 'var(--text-dim)' }}>2024 BASELINE</span>
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
              {/* Left: 2024 Baseline */}
              <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
                <img
                  src={dataset.beforeImage}
                  alt="2024 Baseline Satellite Observation"
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
                  fontWeight: 'bold'
                }}>
                  {dataset.beforeYear} SATELLITE OBSERVATION (BASELINE)
                </div>
              </div>

              {/* Right: 2025 Comparison */}
              <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
                <img
                  src={dataset.afterImage}
                  alt="2025 Comparison Satellite Observation"
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
                  fontWeight: 'bold'
                }}>
                  {dataset.afterYear} SATELLITE OBSERVATION (COMPARISON)
                </div>
              </div>
            </div>
          )}

          {/* MODE 2: SWIPE */}
          {viewMode === 'SWIPE' && (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              {/* Underneath: 2025 */}
              <img
                src={dataset.afterImage}
                alt="2025 Observation"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0, 0, 0, 0.85)', border: '1px solid var(--accent-amber)', padding: '3px 8px', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent-amber)', fontWeight: 'bold', zIndex: 5 }}>
                {dataset.afterYear} AFTER
              </div>

              {/* Clipped Top: 2024 */}
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
                  alt="2024 Observation"
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
                alt="2024 Baseline"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <img
                src={dataset.afterImage}
                alt="2025 Overlay"
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

          {/* MODE 4: CHANGE MAP (Real Calculated Differential Mask Overlay) */}
          {viewMode === 'CHANGE MAP' && (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              {/* Baseline background image */}
              <img
                src={dataset.afterImage}
                alt="2025 Background"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.65)' }}
              />

              {/* Real Computed Differential Mask */}
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

              {/* Detected Change Region Bounding Boxes */}
              {changeRegions.map((region) => {
                const isHov = isHoveringObject === region.id;
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
                      border: `1.5px solid ${region.color}`,
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
                      border: `1px solid ${region.color}`,
                      color: region.color,
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

        {/* Legend strip */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(10, 14, 20, 0.6)',
          border: '1px solid var(--border-dim)',
          padding: '6px 12px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem'
        }}>
          <div style={{ display: 'flex', gap: '14px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', backgroundColor: '#ff9900' }} />
              Potential Structural Change
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', backgroundColor: '#10b981' }} />
              Potential Vegetation Change
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', backgroundColor: '#f43f5e' }} />
              High-Intensity Surface Shift
            </span>
          </div>

          <div style={{ color: 'var(--text-dim)' }}>
            [Click detected region to inspect telemetry]
          </div>
        </div>

      </div>

    </div>
  );
};
