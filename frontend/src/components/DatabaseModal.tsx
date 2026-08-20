import React from 'react';
import { X, Database } from 'lucide-react';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2500,
      padding: '20px'
    }}>
      <div className="hud-panel" style={{
        width: '520px',
        maxWidth: '100%',
        background: 'var(--bg-panel)',
        border: '1px solid var(--accent-amber)',
        boxShadow: '0 0 30px rgba(255, 153, 0, 0.3)'
      }}>
        
        {/* Header */}
        <div className="hud-header" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={16} />
            <span>GEOSPATIAL DATABASE // POSTGIS</span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content (Requirement #19) */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: 'var(--font-mono)' }}>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            background: 'rgba(10, 14, 20, 0.8)',
            padding: '16px',
            border: '1px solid var(--border-dim)',
            fontSize: '0.8rem'
          }}>
            <div>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.68rem' }}>RELATIONAL ENGINE</div>
              <div style={{ color: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                <span style={{ width: '6px', height: '6px', backgroundColor: '#10b981' }} />
                POSTGRESQL 15
              </div>
              <div style={{ color: '#10b981', fontSize: '0.65rem' }}>● ONLINE</div>
            </div>

            <div>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.68rem' }}>SPATIAL EXTENSION</div>
              <div style={{ color: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                <span style={{ width: '6px', height: '6px', backgroundColor: '#10b981' }} />
                POSTGIS 3.4
              </div>
              <div style={{ color: '#10b981', fontSize: '0.65rem' }}>● CONNECTED</div>
            </div>

            <div>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.68rem' }}>SPATIAL QUERIES</div>
              <div style={{ color: 'var(--accent-amber)', fontWeight: 'bold', marginTop: '4px' }}>● READY</div>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.65rem' }}>ST_Area, ST_Intersects, ST_AsGeoJSON</div>
            </div>

            <div>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.68rem' }}>GEOJSON CONVERSION</div>
              <div style={{ color: '#38bdf8', fontWeight: 'bold', marginTop: '4px' }}>● ENABLED</div>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.65rem' }}>WGS84 EPSG:4326 Output</div>
            </div>
          </div>

          <div style={{ fontSize: '0.75rem', color: '#cbd5e1', lineHeight: 1.5, fontFamily: 'var(--font-sans)', borderLeft: '3px solid var(--accent-amber)', paddingLeft: '10px' }}>
            The GeoWatch spatial engine uses GeoAlchemy2 to map Shapely geometric polygons directly into PostGIS binary tables. This provides instant spatial intersection indexing and timeline querying across observations.
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
            <button onClick={onClose} className="hud-btn-primary" style={{ padding: '6px 16px', fontSize: '0.75rem' }}>
              CLOSE
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
