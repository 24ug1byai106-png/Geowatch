import React, { useState } from 'react';
import { Database, Download, Copy, Check, Code } from 'lucide-react';
import type { PresetDataset, GeoJsonCollection } from '../types';

interface GeoDataViewProps {
  dataset: PresetDataset;
  onLog: (msg: string, type?: 'info' | 'success' | 'warn' | 'error') => void;
}

export const GeoDataView: React.FC<GeoDataViewProps> = ({ dataset, onLog }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [viewFormat, setViewFormat] = useState<'geojson' | 'features'>('geojson');

  const analysis = dataset.analysisResult;
  const regions = analysis?.regions || [];
  const baseLat = dataset.coordinates[0];
  const baseLng = dataset.coordinates[1];
  const span = 0.015;

  // Build real GeoJSON collection from computed regions
  const dynamicGeoJson: GeoJsonCollection = {
    type: "FeatureCollection",
    features: regions.map(r => {
      const relX = r.x / 100;
      const relY = r.y / 100;
      const relW = r.width / 100;
      const relH = r.height / 100;

      return {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [Number((baseLng + (relX - 0.5) * span).toFixed(6)), Number((baseLat + (0.5 - relY) * span).toFixed(6))],
              [Number((baseLng + (relX + relW - 0.5) * span).toFixed(6)), Number((baseLat + (0.5 - relY) * span).toFixed(6))],
              [Number((baseLng + (relX + relW - 0.5) * span).toFixed(6)), Number((baseLat + (0.5 - relY - relH) * span).toFixed(6))],
              [Number((baseLng + (relX - 0.5) * span).toFixed(6)), Number((baseLat + (0.5 - relY - relH) * span).toFixed(6))],
              [Number((baseLng + (relX - 0.5) * span).toFixed(6)), Number((baseLat + (0.5 - relY) * span).toFixed(6))]
            ]
          ]
        },
        properties: {
          id: r.id,
          objectId: r.id.toUpperCase(),
          object_type: r.type,
          category: r.category,
          confidence: Number((r.confidence / 100).toFixed(3)),
          area: r.areaSqMeters,
          name: r.name,
          status: 'NEWLY DETECTED',
          explanation: r.explanation
        }
      };
    })
  };

  const geoJsonString = JSON.stringify(dynamicGeoJson, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(geoJsonString);
    setCopied(true);
    onLog('Copied GeoJSON FeatureCollection to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    const blob = new Blob([geoJsonString], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GEOWATCH_WHITEFIELD_CALCULATED_POLYGONS.geojson`;
    a.click();
    URL.revokeObjectURL(url);
    onLog(`Exported ${regions.length} GeoJSON polygons to disk`, 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Banner */}
      <div className="hud-panel" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent-amber)' }}>
            <Database size={15} />
            <span>POSTGIS SPATIAL STORAGE & GEOJSON API DELIVERY</span>
          </div>
          <h3 style={{ fontFamily: 'var(--font-tech)', fontSize: '1.4rem', color: '#fff', margin: '4px 0 0 0' }}>
            GEOSPATIAL DATA REPOSITORY
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleCopy}
            className="hud-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}
          >
            {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            <span>{copied ? 'COPIED' : 'COPY GEOJSON'}</span>
          </button>

          <button
            onClick={handleExport}
            className="hud-btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}
          >
            <Download size={14} />
            <span>EXPORT GEOJSON</span>
          </button>
        </div>
      </div>

      {/* Geospatial Architecture Badges */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '14px', fontFamily: 'var(--font-mono)' }}>
        
        <div className="hud-panel" style={{ padding: '12px' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>POSTGRESQL + POSTGIS</div>
          <div style={{ fontSize: '1rem', color: '#10b981', fontWeight: 'bold', marginTop: '4px' }}>● CONNECTED</div>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)', marginTop: '2px' }}>SRID: 4326 (WGS 84)</div>
        </div>

        <div className="hud-panel" style={{ padding: '12px' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>ANALYSIS TARGET</div>
          <div style={{ fontSize: '0.95rem', color: 'var(--accent-amber)', fontWeight: 'bold', marginTop: '4px' }}>Whitefield, Bengaluru</div>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)', marginTop: '2px' }}>Sentinel-2 Observation</div>
        </div>

        <div className="hud-panel" style={{ padding: '12px' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>CALCULATED POLYGONS</div>
          <div style={{ fontSize: '1rem', color: '#ffffff', fontWeight: 'bold', marginTop: '4px' }}>{regions.length}</div>
          <div style={{ fontSize: '0.62rem', color: '#10b981', marginTop: '2px' }}>Derived from Pixel Differencing</div>
        </div>

        <div className="hud-panel" style={{ padding: '12px' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>GEOJSON SPEC</div>
          <div style={{ fontSize: '1rem', color: '#ffffff', fontWeight: 'bold', marginTop: '4px' }}>RFC 7946</div>
          <div style={{ fontSize: '0.62rem', color: 'var(--accent-amber)', marginTop: '2px' }}>FeatureCollection</div>
        </div>

      </div>

      {/* Formatted GeoJSON Code Viewer */}
      <div className="hud-panel" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="hud-header" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Code size={14} />
            <span>GEOJSON FEATURECOLLECTION (CALCULATED FROM SATELLITE PIXEL DIFFERENCE)</span>
          </div>

          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              className={`hud-btn ${viewFormat === 'geojson' ? 'active' : ''}`}
              onClick={() => setViewFormat('geojson')}
            >
              RAW GEOJSON
            </button>
            <button
              className={`hud-btn ${viewFormat === 'features' ? 'active' : ''}`}
              onClick={() => setViewFormat('features')}
            >
              FEATURE PROPERTIES
            </button>
          </div>
        </div>

        {viewFormat === 'geojson' ? (
          <pre style={{
            margin: 0,
            padding: '16px',
            background: '#06080e',
            color: '#38bdf8',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            overflowX: 'auto',
            maxHeight: '440px',
            lineHeight: 1.5
          }}>
            <code>{geoJsonString}</code>
          </pre>
        ) : (
          <div style={{ padding: '14px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-amber)', color: 'var(--accent-amber)', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>FEATURE ID</th>
                  <th style={{ padding: '8px' }}>OBJECT TYPE</th>
                  <th style={{ padding: '8px' }}>CONFIDENCE</th>
                  <th style={{ padding: '8px' }}>EST. AREA</th>
                  <th style={{ padding: '8px' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {dynamicGeoJson.features.map((feat) => (
                  <tr key={feat.properties.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '8px', color: '#60a5fa' }}>{feat.properties.objectId}</td>
                    <td style={{ padding: '8px', color: '#fff', fontWeight: 'bold' }}>{feat.properties.object_type}</td>
                    <td style={{ padding: '8px', color: 'var(--accent-amber)' }}>{(feat.properties.confidence * 100).toFixed(1)}%</td>
                    <td style={{ padding: '8px', color: '#cbd5e1' }}>{feat.properties.area.toLocaleString()} m²</td>
                    <td style={{ padding: '8px', color: '#10b981' }}>{feat.properties.status || 'DETECTED'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
