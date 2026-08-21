import React, { useState, useRef } from 'react';
import { Upload, ImagePlus, Play, Loader2 } from 'lucide-react';
import type { PresetDataset, CalculatedChangeRegion } from '../types';
import { decodeUploadedFile } from '../utils/fileDecoder';

interface TemporalAnalysisProps {
  dataset: PresetDataset;
  onSelectObject: (obj: CalculatedChangeRegion) => void;
  onUpdateDataset?: (newDataset: PresetDataset) => void;
  onTriggerAnalysis?: (targetDataset?: PresetDataset) => void;
  isAnalyzing?: boolean;
}

export const TemporalAnalysis: React.FC<TemporalAnalysisProps> = ({ 
  dataset, 
  onSelectObject,
  onUpdateDataset,
  onTriggerAnalysis,
  isAnalyzing = false
}) => {
  const [viewMode, setViewMode] = useState<'SPLIT VIEW' | 'SWIPE' | 'OVERLAY' | 'CHANGE MAP'>('SPLIT VIEW');
  const [swipePos, setSwipePos] = useState<number>(50);
  const [overlayOpacity, setOverlayOpacity] = useState<number>(50);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'structure' | 'vegetation' | 'high_intensity' | null>(null);
  const [isHoveringObject, setIsHoveringObject] = useState<string | null>(null);

  // File upload state
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Dragging states
  const [isDraggingBefore, setIsDraggingBefore] = useState<boolean>(false);
  const [isDraggingAfter, setIsDraggingAfter] = useState<boolean>(false);

  const handleProcessBeforeFile = async (file: File) => {
    try {
      setIsUploading(true);
      const decoded = await decodeUploadedFile(file);
      const updated: PresetDataset = {
        ...dataset,
        beforeImage: decoded.dataUrl,
        beforeTifName: file.name,
        beforeYear: 'T0 (Baseline)',
        analysisResult: null
      };
      if (onUpdateDataset) onUpdateDataset(updated);
    } catch (err) {
      console.error('Error processing before file:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleProcessAfterFile = async (file: File) => {
    try {
      setIsUploading(true);
      const decoded = await decodeUploadedFile(file);
      const updated: PresetDataset = {
        ...dataset,
        afterImage: decoded.dataUrl,
        afterTifName: file.name,
        afterYear: 'T1 (Observation)',
        analysisResult: null
      };
      if (onUpdateDataset) onUpdateDataset(updated);
    } catch (err) {
      console.error('Error processing after file:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadBefore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleProcessBeforeFile(file);
  };

  const handleUploadAfter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleProcessAfterFile(file);
  };

  const handleLoadSampleDataset = () => {
    const sample: PresetDataset = {
      id: 'bengaluru-sentinel-2024-2026',
      name: 'Bengaluru Metropolitan Corridor',
      region: 'Bengaluru, Karnataka, India',
      regionType: 'Metropolitan & Infrastructure Expansion',
      dataSource: 'Sentinel-2B MSI (Tile T43PGQ)',
      coordinates: [12.9716, 77.5946],
      beforeYear: '2024',
      afterYear: '2026',
      beforeImage: '/data/sentinel_2024_bengaluru.png',
      afterImage: '/data/sentinel_2026_bengaluru.png',
      beforeTifName: 'S2B_20241208_T43PGQ.jp2',
      afterTifName: 'S2B_20260512_T43PGQ.jp2',
      analysisResult: null
    };
    if (onUpdateDataset) onUpdateDataset(sample);
  };

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
  const changeRegions = activeCategoryFilter
    ? rawRegions.filter(r => r.category === activeCategoryFilter)
    : [];

  const hasBothImages = !!(dataset.beforeImage && dataset.afterImage);

  return (
    <div className="hud-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* Header & Controls */}
      <div className="hud-header" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="led-amber" />
          <span>TEMPORAL CHANGE ANALYSIS // {dataset.beforeYear || 'T0'} VS {dataset.afterYear || 'T1'}</span>
        </div>

        {/* View Mode Switcher */}
        {hasBothImages && (
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
        )}
      </div>

      {/* DIRECT SATELLITE PHOTO INGESTION BAR */}
      <div style={{
        background: 'rgba(6, 10, 20, 0.95)',
        borderBottom: '1px solid var(--border-dim)',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        
        {/* Upload Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Upload size={13} />
            <span>INGEST SATELLITE PHOTOS:</span>
          </div>

          {/* Hidden Native File Inputs */}
          <input 
            type="file" 
            ref={beforeInputRef} 
            onChange={handleUploadBefore} 
            accept=".png,.jpg,.jpeg,.tif,.tiff,.jp2,.webp,.zip" 
            style={{ display: 'none' }} 
          />
          <input 
            type="file" 
            ref={afterInputRef} 
            onChange={handleUploadAfter} 
            accept=".png,.jpg,.jpeg,.tif,.tiff,.jp2,.webp,.zip" 
            style={{ display: 'none' }} 
          />

          {/* Upload Before (T0) */}
          <button
            onClick={() => beforeInputRef.current?.click()}
            disabled={isUploading}
            style={{
              background: dataset.beforeImage ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.06)',
              border: `1px solid ${dataset.beforeImage ? '#00f0ff' : 'var(--border-dim)'}`,
              color: dataset.beforeImage ? '#00f0ff' : '#cbd5e1',
              padding: '5px 10px',
              fontSize: '0.68rem',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderRadius: '2px'
            }}
          >
            <ImagePlus size={13} />
            <span>{dataset.beforeImage ? '✓ T0 Photo Ingested' : '📁 Upload Before Photo (T0)'}</span>
          </button>

          {/* Upload After (T1) */}
          <button
            onClick={() => afterInputRef.current?.click()}
            disabled={isUploading}
            style={{
              background: dataset.afterImage ? 'rgba(255, 153, 0, 0.15)' : 'rgba(255, 255, 255, 0.06)',
              border: `1px solid ${dataset.afterImage ? 'var(--accent-amber)' : 'var(--border-dim)'}`,
              color: dataset.afterImage ? 'var(--accent-amber)' : '#cbd5e1',
              padding: '5px 10px',
              fontSize: '0.68rem',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderRadius: '2px'
            }}
          >
            <ImagePlus size={13} />
            <span>{dataset.afterImage ? '✓ T1 Photo Ingested' : '📁 Upload After Photo (T1)'}</span>
          </button>
        </div>

        {/* Action button if both present */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {!hasBothImages && (
            <button
              onClick={handleLoadSampleDataset}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                color: '#94a3b8',
                border: '1px solid var(--border-dim)',
                padding: '5px 10px',
                fontSize: '0.65rem',
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
                borderRadius: '2px'
              }}
            >
              ⚡ Load Sample Observation Pair
            </button>
          )}

          {hasBothImages && onTriggerAnalysis && (
            <button
              onClick={() => onTriggerAnalysis(dataset)}
              disabled={isAnalyzing || isUploading}
              style={{
                background: '#00f0ff',
                color: '#040711',
                border: 'none',
                padding: '6px 14px',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 900,
                letterSpacing: '0.06em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                borderRadius: '2px',
                boxShadow: '0 0 12px rgba(0, 240, 255, 0.35)',
                transition: 'all 0.15s ease'
              }}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={13} className="spin" />
                  <span>ANALYZING PIXELS...</span>
                </>
              ) : (
                <>
                  <Play size={13} fill="#040711" />
                  <span>ANALYZE PHOTOS</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>

      {/* Main Image Comparison Area */}
      <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        
        {/* Opacity slider for OVERLAY mode */}
        {hasBothImages && viewMode === 'OVERLAY' && (
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
            <span style={{ color: 'var(--text-dim)' }}>{dataset.beforeYear || 'T0'} BASELINE</span>
            <input
              type="range"
              min="0"
              max="100"
              value={overlayOpacity}
              onChange={(e) => setOverlayOpacity(Number(e.target.value))}
              style={{ flex: 1, accentColor: 'var(--accent-amber)', cursor: 'pointer' }}
            />
            <span style={{ color: 'var(--accent-amber)', fontWeight: 'bold' }}>
              {dataset.afterYear || 'T1'} COMPARISON ({overlayOpacity}%)
            </span>
          </div>
        )}

        {/* Dynamic Visualizer Canvas Container */}
        <div
          ref={containerRef}
          onMouseMove={viewMode === 'SWIPE' && hasBothImages ? handleSwipeMove : undefined}
          onTouchMove={viewMode === 'SWIPE' && hasBothImages ? handleSwipeMove : undefined}
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
          {/* STATE A: AWAITING BOTH SATELLITE PHOTOS (Clean Dropzones) */}
          {!hasBothImages && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '14px',
              padding: '20px',
              height: '100%',
              minHeight: '340px',
              boxSizing: 'border-box'
            }}>
              
              {/* Box 1: Before Satellite Image (T0) */}
              <div
                onClick={() => beforeInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDraggingBefore(true); }}
                onDragLeave={() => setIsDraggingBefore(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingBefore(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleProcessBeforeFile(file);
                }}
                style={{
                  border: `2px dashed ${dataset.beforeImage ? '#00f0ff' : (isDraggingBefore ? 'var(--accent-amber)' : 'rgba(0, 240, 255, 0.4)')}`,
                  background: dataset.beforeImage ? 'rgba(0, 240, 255, 0.05)' : 'rgba(6, 11, 22, 0.8)',
                  borderRadius: '4px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  padding: '20px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease'
                }}
              >
                {dataset.beforeImage ? (
                  <>
                    <img src={dataset.beforeImage} alt="Before Preview" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
                    <div style={{ position: 'relative', zIndex: 2, background: 'rgba(4, 7, 16, 0.9)', padding: '6px 12px', borderRadius: '3px', border: '1px solid #00f0ff', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#00f0ff', fontWeight: 'bold' }}>
                      ✓ BEFORE PHOTO (T0) LOADED
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(0, 240, 255, 0.1)', border: '1px solid rgba(0, 240, 255, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Upload size={22} color="#00f0ff" />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-tech)', fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.04em' }}>
                        BEFORE SATELLITE PHOTO (T0)
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                        Drag & Drop or Click to Ingest Baseline Image
                      </div>
                    </div>
                    <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontFamily: 'var(--font-mono)', background: 'rgba(255, 255, 255, 0.05)', padding: '3px 8px', borderRadius: '2px' }}>
                      GeoTIFF (.tif), JP2, PNG, JPG, ZIP
                    </div>
                  </>
                )}
              </div>

              {/* Box 2: After Satellite Image (T1) */}
              <div
                onClick={() => afterInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDraggingAfter(true); }}
                onDragLeave={() => setIsDraggingAfter(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingAfter(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleProcessAfterFile(file);
                }}
                style={{
                  border: `2px dashed ${dataset.afterImage ? 'var(--accent-amber)' : (isDraggingAfter ? '#00f0ff' : 'rgba(255, 153, 0, 0.4)')}`,
                  background: dataset.afterImage ? 'rgba(255, 153, 0, 0.05)' : 'rgba(6, 11, 22, 0.8)',
                  borderRadius: '4px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  padding: '20px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease'
                }}
              >
                {dataset.afterImage ? (
                  <>
                    <img src={dataset.afterImage} alt="After Preview" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
                    <div style={{ position: 'relative', zIndex: 2, background: 'rgba(4, 7, 16, 0.9)', padding: '6px 12px', borderRadius: '3px', border: '1px solid var(--accent-amber)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent-amber)', fontWeight: 'bold' }}>
                      ✓ AFTER PHOTO (T1) LOADED
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255, 153, 0, 0.1)', border: '1px solid rgba(255, 153, 0, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Upload size={22} color="var(--accent-amber)" />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-tech)', fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.04em' }}>
                        AFTER SATELLITE PHOTO (T1)
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                        Drag & Drop or Click to Ingest Comparison Image
                      </div>
                    </div>
                    <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontFamily: 'var(--font-mono)', background: 'rgba(255, 255, 255, 0.05)', padding: '3px 8px', borderRadius: '2px' }}>
                      GeoTIFF (.tif), JP2, PNG, JPG, ZIP
                    </div>
                  </>
                )}
              </div>

            </div>
          )}

          {/* STATE B: BOTH SATELLITE PHOTOS INGESTED */}
          {hasBothImages && viewMode === 'SPLIT VIEW' && (
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

                {/* Overlaid Detected Change Regions (Only when a category is clicked) */}
                {changeRegions.map((region) => {
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
                        width: `${Math.max(5, region.width)}%`,
                        height: `${Math.max(5, region.height)}%`,
                        border: `1.5px solid ${borderCol}`,
                        backgroundColor: isHov ? 'rgba(255, 153, 0, 0.35)' : 'rgba(255, 153, 0, 0.08)',
                        cursor: 'pointer',
                        zIndex: 20,
                        transition: 'all 0.15s ease',
                        boxShadow: isHov ? `0 0 14px ${borderCol}` : `0 0 5px ${borderCol}`,
                        borderRadius: '2px'
                      }}
                    >
                      {/* Discrete Emoji Pin */}
                      <div style={{
                        position: 'absolute',
                        top: '-10px',
                        left: '-10px',
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        background: '#07090e',
                        border: `1.5px solid ${borderCol}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        boxShadow: `0 0 8px ${borderCol}`,
                        zIndex: 22
                      }}>
                        {emoji}
                      </div>

                      {/* Tooltip on Hover Only */}
                      {isHov && (
                        <div style={{
                          position: 'absolute',
                          bottom: '100%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          marginBottom: '6px',
                          background: 'rgba(7, 9, 14, 0.95)',
                          border: `1px solid ${borderCol}`,
                          color: '#fff',
                          fontSize: '0.62rem',
                          fontFamily: 'var(--font-mono)',
                          padding: '3px 8px',
                          whiteSpace: 'nowrap',
                          fontWeight: 'bold',
                          zIndex: 30,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.8)'
                        }}>
                          {region.name} • {region.areaSqMeters.toLocaleString()} m² [Click to inspect]
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* MODE 2: SWIPE */}
          {viewMode === 'SWIPE' && (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <img
                src={dataset.afterImage}
                alt="Observation"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0, 0, 0, 0.85)', border: '1px solid var(--accent-amber)', padding: '3px 8px', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent-amber)', fontWeight: 'bold', zIndex: 5 }}>
                {dataset.afterYear} AFTER
              </div>

              {/* Overlaid Detected Regions on Swipe */}
              {changeRegions.map((region) => {
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

          {/* MODE 4: CHANGE MAP */}
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

              {changeRegions.map((region) => {
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
                  />
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

        {/* Interactive Legend: Click to Toggle Overlays */}
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
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            
            {/* 1. Structural Change */}
            <button
              onClick={() => setActiveCategoryFilter(activeCategoryFilter === 'structure' ? null : 'structure')}
              style={{
                background: activeCategoryFilter === 'structure' ? 'rgba(255, 153, 0, 0.25)' : 'transparent',
                color: activeCategoryFilter === 'structure' ? '#ff9900' : '#94a3b8',
                border: `1px solid ${activeCategoryFilter === 'structure' ? '#ff9900' : 'var(--border-dim)'}`,
                padding: '4px 10px',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                fontWeight: activeCategoryFilter === 'structure' ? 800 : 500,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                borderRadius: '2px',
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{ width: '8px', height: '8px', backgroundColor: '#ff9900', display: 'inline-block' }} />
              <span>🏢 Potential Structural Change ({rawRegions.filter(r => r.category === 'structure').length})</span>
            </button>

            {/* 2. Vegetation Change */}
            <button
              onClick={() => setActiveCategoryFilter(activeCategoryFilter === 'vegetation' ? null : 'vegetation')}
              style={{
                background: activeCategoryFilter === 'vegetation' ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
                color: activeCategoryFilter === 'vegetation' ? '#10b981' : '#94a3b8',
                border: `1px solid ${activeCategoryFilter === 'vegetation' ? '#10b981' : 'var(--border-dim)'}`,
                padding: '4px 10px',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                fontWeight: activeCategoryFilter === 'vegetation' ? 800 : 500,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                borderRadius: '2px',
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{ width: '8px', height: '8px', backgroundColor: '#10b981', display: 'inline-block' }} />
              <span>🌳 Potential Vegetation Change ({rawRegions.filter(r => r.category === 'vegetation').length})</span>
            </button>

            {/* 3. Surface Shift */}
            <button
              onClick={() => setActiveCategoryFilter(activeCategoryFilter === 'high_intensity' ? null : 'high_intensity')}
              style={{
                background: activeCategoryFilter === 'high_intensity' ? 'rgba(244, 63, 94, 0.25)' : 'transparent',
                color: activeCategoryFilter === 'high_intensity' ? '#f43f5e' : '#94a3b8',
                border: `1px solid ${activeCategoryFilter === 'high_intensity' ? '#f43f5e' : 'var(--border-dim)'}`,
                padding: '4px 10px',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                fontWeight: activeCategoryFilter === 'high_intensity' ? 800 : 500,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                borderRadius: '2px',
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{ width: '8px', height: '8px', backgroundColor: '#f43f5e', display: 'inline-block' }} />
              <span>🛣️ High-Intensity Surface Shift ({rawRegions.filter(r => r.category === 'high_intensity').length})</span>
            </button>

            {/* Clear button if any is active */}
            {activeCategoryFilter && (
              <button
                onClick={() => setActiveCategoryFilter(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#fff',
                  border: '1px solid var(--border-dim)',
                  padding: '4px 8px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.62rem',
                  borderRadius: '2px'
                }}
              >
                ✕ HIDE OVERLAYS
              </button>
            )}

          </div>

          <div style={{ color: activeCategoryFilter ? '#00f0ff' : 'var(--text-dim)', fontSize: '0.62rem' }}>
            {activeCategoryFilter
              ? '⚡ Click any detected box to inspect telemetry'
              : '👈 Click a category button to display change overlays'}
          </div>
        </div>

      </div>

    </div>
  );
};
