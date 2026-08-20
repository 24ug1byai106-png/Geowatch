import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, useMap } from 'react-leaflet';
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
  const stages = ['RAW IMAGE', 'ALIGNMENT', 'EXTRACTION', 'DETECTION', 'COMPARISON'];

  const analysis = dataset.analysisResult;
  const regions = analysis?.regions || [];

  // Generate geographic polygons for each calculated region centered on Whitefield
  const baseLat = dataset.coordinates[0];
  const baseLng = dataset.coordinates[1];
  const span = 0.015;

  return (
    <div className="hud-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* Header */}
      <div className="hud-header">
        <span className="led-amber" />
        <span>AI VISION ANALYSIS & MAPPING // WHITEFIELD SECTOR</span>
      </div>

      {/* Pipeline Stage Buttons */}
      <div style={{
        display: 'flex',
        gap: '4px',
        padding: '6px 12px',
        borderBottom: '1px solid var(--border-dim)',
        background: 'rgba(10, 14, 20, 0.6)',
        overflowX: 'auto'
      }}>
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
                padding: '4px 8px',
                fontSize: '0.65rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{
                width: '5px',
                height: '5px',
                backgroundColor: isActive ? '#07090e' : (stage === 'DETECTION' ? '#ff9900' : 'var(--text-dim)')
              }} />
              {stage}
            </button>
          );
        })}
      </div>

      {/* Leaflet GIS Map Container */}
      <div style={{ position: 'relative', flex: 1, minHeight: '290px', background: '#090e17' }}>
        
        {/* HUD Target Overlay Badge */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 1000,
          background: 'rgba(0, 0, 0, 0.85)',
          border: '1px solid var(--accent-amber)',
          padding: '5px 10px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          pointerEvents: 'none'
        }}>
          <div style={{ color: 'var(--accent-amber)', fontWeight: 'bold' }}>
            TARGET: {dataset.name.toUpperCase()}
          </div>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.6rem' }}>
            SOURCE: SENTINEL-2 L2A • EPSG:4326
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
          {(activeStage === 'DETECTION' || activeStage === 'COMPARISON') && regions.map((region) => {
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
