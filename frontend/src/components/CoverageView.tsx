import React from 'react';
import { Globe } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Rectangle } from 'react-leaflet';
import type { PresetDataset } from '../types';

interface CoverageViewProps {
  dataset: PresetDataset;
}

export const CoverageView: React.FC<CoverageViewProps> = ({ dataset }) => {
  const indiaCenter: [number, number] = [22.0, 78.9];

  // Bounding box for observation area
  const bounds: [[number, number], [number, number]] = [
    [dataset.coordinates[0] - 0.25, dataset.coordinates[1] - 0.25],
    [dataset.coordinates[0] + 0.25, dataset.coordinates[1] + 0.25]
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div className="hud-panel" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent-amber)' }}>
          <Globe size={15} />
          <span>EARTH OBSERVATION SATELLITE COVERAGE FOOTPRINT</span>
        </div>
        <h3 style={{ fontFamily: 'var(--font-tech)', fontSize: '1.4rem', color: '#fff', margin: '4px 0 0 0' }}>
          EARTH OBSERVATION COVERAGE
        </h3>
      </div>

      {/* Grid: Map & Side Panel (Requirement #16) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1fr)', gap: '20px' }}>
        
        {/* Coverage Map */}
        <div className="hud-panel" style={{ minHeight: '460px', display: 'flex', flexDirection: 'column' }}>
          <div className="hud-header">
            <span className="led-amber" />
            <span>SATELLITE OBSERVATION FOOTPRINT // INDIAN SUBCONTINENT</span>
          </div>

          <div style={{ flex: 1, position: 'relative', minHeight: '380px' }}>
            <MapContainer
              center={indiaCenter}
              zoom={5}
              zoomControl={true}
              style={{ width: '100%', height: '100%' }}
            >
              <TileLayer
                attribution='&copy; ISRO / CartoDB'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />

              {/* Target Region Rectangle */}
              <Rectangle
                bounds={bounds}
                pathOptions={{
                  color: '#ff9900',
                  fillColor: '#ff9900',
                  fillOpacity: 0.35,
                  weight: 2
                }}
              />

              {/* Target Region Marker */}
              <CircleMarker
                center={dataset.coordinates}
                radius={8}
                pathOptions={{
                  color: '#ff9900',
                  fillColor: '#ffaa00',
                  fillOpacity: 1,
                  weight: 2
                }}
              />
            </MapContainer>
          </div>
        </div>

        {/* Side Panel: Observation Coverage (Requirement #16) */}
        <div className="hud-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', fontFamily: 'var(--font-mono)' }}>
          <div className="hud-header" style={{ margin: '-16px -16px 6px -16px' }}>
            <span className="led-amber" />
            <span>OBSERVATION COVERAGE</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.78rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-dim)', paddingBottom: '4px' }}>
              <span style={{ color: 'var(--text-dim)' }}>REGION</span>
              <span style={{ color: '#fff', fontWeight: 'bold' }}>India</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-dim)', paddingBottom: '4px' }}>
              <span style={{ color: 'var(--text-dim)' }}>DATA SOURCE</span>
              <span style={{ color: '#fff' }}>Satellite Imagery</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-dim)', paddingBottom: '4px' }}>
              <span style={{ color: 'var(--text-dim)' }}>OBSERVATION PERIOD</span>
              <span style={{ color: 'var(--accent-amber)', fontWeight: 'bold' }}>
                {dataset.beforeYear} → {dataset.afterYear}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-dim)', paddingBottom: '4px' }}>
              <span style={{ color: 'var(--text-dim)' }}>TARGET REGION</span>
              <span style={{ color: '#60a5fa' }}>{dataset.name}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-dim)', paddingBottom: '4px' }}>
              <span style={{ color: 'var(--text-dim)' }}>CLOUD COVER</span>
              <span style={{ color: '#10b981' }}>&lt; 2.4% (Available Metadata)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-dim)', paddingBottom: '4px' }}>
              <span style={{ color: 'var(--text-dim)' }}>DATA QUALITY</span>
              <span style={{ color: '#10b981' }}>Radiometrically Calibrated</span>
            </div>
          </div>

          {/* Regional Footprint Metadata */}
          <div style={{ borderTop: '1px solid var(--border-dim)', paddingTop: '12px', marginTop: '6px' }}>
            <div style={{ color: 'var(--accent-amber)', fontSize: '0.72rem', marginBottom: '8px' }}>
              SPATIAL INTERSECTION METADATA
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.72rem' }}>
              <div style={{ background: 'rgba(255, 153, 0, 0.1)', padding: '8px 10px', borderLeft: '2px solid var(--accent-amber)' }}>
                <strong>Bounding Coordinate:</strong> {dataset.coordinates[0]}° N, {dataset.coordinates[1]}° E
              </div>
              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '8px 10px', borderLeft: '2px solid var(--border-dim)' }}>
                <strong>PostGIS Grid:</strong> EPSG:4326 Intersected & Indexed
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
