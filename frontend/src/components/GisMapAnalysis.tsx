import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
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

// Create custom SVG GIS symbols for Buildings, Trees, and Roads
const getFeatureIcon = (category: string) => {
  if (category === 'structure') {
    return L.divIcon({
      className: 'gis-bldg-marker',
      html: `<div style="background: rgba(10, 14, 23, 0.95); border: 2px solid #ff9900; border-radius: 5px; padding: 2px 6px; font-size: 10px; display: flex; align-items: center; gap: 4px; color: #ffaa00; box-shadow: 0 0 10px rgba(255,153,0,0.6); font-family: monospace; font-weight: 800; cursor: pointer; white-space: nowrap;">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ff9900" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v8h4"/><path d="M18 9h2a2 2 0 0 1 2 2v11h-4"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
        <span>BUILDING</span>
      </div>`,
      iconSize: [84, 20],
      iconAnchor: [42, 10]
    });
  }
  if (category === 'vegetation') {
    return L.divIcon({
      className: 'gis-tree-marker',
      html: `<div style="background: rgba(4, 30, 20, 0.95); border: 2px solid #10b981; border-radius: 5px; padding: 2px 6px; font-size: 10px; display: flex; align-items: center; gap: 4px; color: #10b981; box-shadow: 0 0 10px rgba(16,185,129,0.6); font-family: monospace; font-weight: 800; cursor: pointer; white-space: nowrap;">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 10v10"/><path d="M12 14l3-3"/><path d="M12 17l-3-3"/><path d="M12 3a7 7 0 0 0-7 7c0 4 7 10 7 10s7-6 7-10a7 7 0 0 0-7-7z"/></svg>
        <span>TREES</span>
      </div>`,
      iconSize: [72, 20],
      iconAnchor: [36, 10]
    });
  }
  return L.divIcon({
    className: 'gis-road-marker',
    html: `<div style="background: rgba(10, 25, 47, 0.95); border: 2px solid #00f0ff; border-radius: 5px; padding: 2px 6px; font-size: 10px; display: flex; align-items: center; gap: 4px; color: #00f0ff; box-shadow: 0 0 10px rgba(0,240,255,0.6); font-family: monospace; font-weight: 800; cursor: pointer; white-space: nowrap;">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></svg>
      <span>ROAD</span>
    </div>`,
    iconSize: [68, 20],
    iconAnchor: [34, 10]
  });
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
  const span = 0.055;

  return (
    <div className="hud-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* Header & Controls */}
      <div className="hud-header" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="led-amber" />
          <span>GIS CHANGE MAP // {dataset.name.toUpperCase()}</span>
        </div>

        {/* Confidence Threshold Slider Control */}
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
            ({filteredRegions.length}/{rawRegions.length} sites)
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
            { id: 'all', label: 'ALL SITES' },
            { id: 'structure', label: '🏢 BUILDINGS' },
            { id: 'vegetation', label: '🌳 TREES' },
            { id: 'high_intensity', label: '🛣️ ROADS' }
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
          zoom={13}
          zoomControl={true}
          style={{ width: '100%', height: '100%' }}
        >
          <MapRecenter coords={dataset.coordinates} />
          
          <TileLayer
            attribution='&copy; ISRO / OpenStreetMap'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {/* Render Vector Polygons and Building/Tree Symbols */}
          {(activeStage === 'DETECTION' || activeStage === 'COMPARISON') && filteredRegions.map((region) => {
            const relX = region.x / 100;
            const relY = region.y / 100;
            const relW = region.width / 100;
            const relH = region.height / 100;

            const centerLat = baseLat + (0.5 - relY) * span;
            const centerLng = baseLng + (relX - 0.5) * span;

            const polyCoords: [number, number][] = [
              [centerLat, centerLng],
              [centerLat, centerLng + relW * span],
              [centerLat - relH * span, centerLng + relW * span],
              [centerLat - relH * span, centerLng]
            ];

            const isBuilding = region.category === 'structure';
            const isTree = region.category === 'vegetation';

            return (
              <React.Fragment key={region.id}>
                <Polygon
                  positions={polyCoords}
                  eventHandlers={{
                    click: () => onSelectObject(region)
                  }}
                  pathOptions={{
                    color: region.color,
                    weight: isBuilding ? 2 : 2.5,
                    fillColor: region.color,
                    fillOpacity: 0.15,
                    dashArray: isBuilding ? '5, 3' : isTree ? '2, 3' : undefined
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

                {/* Building / Tree Badge Marker */}
                <Marker
                  position={[centerLat - (relH * span) / 2, centerLng + (relW * span) / 2]}
                  icon={getFeatureIcon(region.category)}
                  eventHandlers={{
                    click: () => onSelectObject(region)
                  }}
                />
              </React.Fragment>
            );
          })}
        </MapContainer>

      </div>

    </div>
  );
};
