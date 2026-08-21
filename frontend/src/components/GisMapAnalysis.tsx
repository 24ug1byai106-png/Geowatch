import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, useMap } from 'react-leaflet';
import { Filter } from 'lucide-react';
import type { PresetDataset, CalculatedChangeRegion } from '../types';

interface GisMapAnalysisProps {
  dataset: PresetDataset;
  onSelectObject: (obj: CalculatedChangeRegion) => void;
}

const MapRecenter: React.FC<{ coords: [number, number] }> = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, 14);
  }, [coords, map]);
  return null;
};

export const GisMapAnalysis: React.FC<GisMapAnalysisProps> = ({ dataset, onSelectObject }) => {
  const [activeStage, setActiveStage] = useState<string>('DETECTION');
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(75);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'structure' | 'vegetation' | 'high_intensity'>('all');
  
  const stages = ['RAW IMAGE', 'ALIGNMENT', 'EXTRACTION', 'DETECTION', 'COMPARISON'];

  const analysis = dataset.analysisResult;
  const rawRegions = analysis?.regions || [];

  // Filter polygons based on Confidence Threshold and Category
  const filteredRegions = rawRegions.filter(r => {
    const matchesConfidence = r.confidence >= confidenceThreshold;
    const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
    return matchesConfidence && matchesCategory;
  });

  const baseLat = dataset.coordinates[0];
  const baseLng = dataset.coordinates[1];
  const span = 0.015;

  return (
    <div className="hud-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* Header & Controls */}
      <div className="hud-header" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="led-amber" />
          <span>GIS CHANGE MAP // {dataset.name.toUpperCase()}</span>
        </div>

        {/* Confidence Threshold Slider Control (Mitigating False Positives) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.68rem', fontFamily: 'var(--font-mono)' }}>
          <Filter size={12} color="var(--accent-amber)" />
          <span style={{ color: 'var(--text-dim)' }}>CONFIDENCE:</span>
          <input
            type="range"
            min={50}
            max={95}
            step={1}
            value={confidenceThreshold}
            onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
            style={{ width: '80px', accentColor: 'var(--accent-amber)', cursor: 'pointer' }}
          />
          <span style={{ color: '#00f0ff', fontWeight: 'bold', minWidth: '32px' }}>
            &ge;{confidenceThreshold}%
          </span>
          <span style={{ color: '#10b981', fontSize: '0.62rem' }}>
            ({filteredRegions.length}/{rawRegions.length} polygons)
          </span>
        </div>
      </div>

      {/* Category Filters & Pipeline Stages */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '6px 12px',
        borderBottom: '1px solid var(--border-dim)',
        background: 'rgba(10, 14, 20, 0.7)',
        overflowX: 'auto',
        gap: '10px'
      }}>
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {[
            { id: 'all', label: 'ALL CHANGES' },
            { id: 'structure', label: '🏢 BUILDINGS' },
            { id: 'vegetation', label: '🌳 VEGETATION' },
            { id: 'high_intensity', label: '⚡ HIGH-DELTA' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              style={{
                background: selectedCategory === cat.id ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
                color: selectedCategory === cat.id ? '#00f0ff' : 'var(--text-dim)',
                border: '1px solid ' + (selectedCategory === cat.id ? '#00f0ff' : 'var(--border-dim)'),
                padding: '2px 7px',
                fontSize: '0.62rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: selectedCategory === cat.id ? 700 : 500,
                cursor: 'pointer'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Pipeline Stages */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {stages.map((stage) => {
            const isActive = activeStage === stage;
            return (
              <button
                key={stage}
                onClick={() => setActiveStage(stage)}
                style={{
                  background: isActive ? '#ff9900' : 'transparent',
                  color: isActive ? '#07090e' : 'var(--text-dim)',
                  border: '1px solid ' + (isActive ? '#ff9900' : 'var(--border-dim)'),
                  padding: '3px 7px',
                  fontSize: '0.62rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {stage}
              </button>
            );
          })}
        </div>
      </div>

      {/* Leaflet GIS Map Container */}
      <div style={{ position: 'relative', flex: 1, minHeight: '290px', background: '#090e17' }}>
        
        {/* HUD Target Overlay Badge */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 1000,
          background: 'rgba(0, 0, 0, 0.88)',
          border: '1px solid #00f0ff',
          padding: '6px 12px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.68rem',
          pointerEvents: 'none'
        }}>
          <div style={{ color: '#00f0ff', fontWeight: 'bold' }}>
            AOI: {dataset.name.toUpperCase()}
          </div>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.62rem', marginTop: '2px' }}>
            COORDS: {dataset.coordinates.join(', ')} • RESOLUTION: 10m GSD
          </div>
        </div>

        <MapContainer
          center={dataset.coordinates}
          zoom={14}
          zoomControl={true}
          style={{ width: '100%', height: '100%' }}
        >
          <MapRecenter coords={dataset.coordinates} />
          
          <TileLayer
            attribution='&copy; ISRO / OpenStreetMap'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {/* Calculated Geographic Polygons from Image Differencing */}
          {(activeStage === 'DETECTION' || activeStage === 'COMPARISON') && filteredRegions.map((region) => {
            const relX = region.x / 100;
            const relY = region.y / 100;
            const relW = region.width / 100;
            const relH = region.height / 100;

            const polyCoords: [number, number][] = [
              [baseLat + (0.5 - relY) * span, baseLng + (relX - 0.5) * span],
              [baseLat + (0.5 - relY) * span, baseLng + (relX + relW - 0.5) * span],
              [baseLat + (0.5 - relY - relH) * span, baseLng + (relX + relW - 0.5) * span],
              [baseLat + (0.5 - relY - relH) * span, baseLng + (relX - 0.5) * span]
            ];

            return (
              <Polygon
                key={region.id}
                positions={polyCoords}
                eventHandlers={{
                  click: () => onSelectObject(region)
                }}
                pathOptions={{
                  color: region.color,
                  fillColor: region.color,
                  fillOpacity: 0.45,
                  weight: 2
                }}
              >
                <Popup>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', padding: '4px' }}>
                    <div style={{ color: region.color, fontWeight: 'bold', marginBottom: '2px' }}>
                      {region.name}
                    </div>
                    <div>TYPE: <strong>{region.type}</strong></div>
                    <div>CONFIDENCE: <strong style={{ color: '#10b981' }}>{region.confidence}%</strong></div>
                    <div>EST. AREA: <strong>{region.areaSqMeters.toLocaleString()} m²</strong></div>
                    <div>INTENSITY: <strong>{region.intensity} / 255</strong></div>
                    <div style={{ marginTop: '4px', fontSize: '0.65rem', color: '#60a5fa' }}>
                      [Click to inspect full region telemetry]
                    </div>
                  </div>
                </Popup>
              </Polygon>
            );
          })}
        </MapContainer>

      </div>

    </div>
  );
};
