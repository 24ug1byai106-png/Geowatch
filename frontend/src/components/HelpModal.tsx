import React from 'react';
import { X, BookOpen } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2500,
      padding: '20px'
    }}>
      <div className="hud-panel" style={{
        width: '720px',
        maxWidth: '100%',
        background: 'var(--bg-panel)',
        border: '1px solid var(--accent-amber)',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Header */}
        <div className="hud-header" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={16} />
            <span>GEOWATCH // SYSTEM ARCHITECTURE & USER GUIDE</span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.8rem', lineHeight: 1.6 }}>
          
          <div>
            <h4 style={{ color: 'var(--accent-amber)', fontFamily: 'var(--font-tech)', marginBottom: '4px' }}>
              1. Project Overview: GeoWatch
            </h4>
            <p style={{ color: '#cbd5e1' }}>
              <strong>GeoWatch</strong> is an AI-powered geospatial change detection platform built for the Smart India Hackathon. It monitors geographic changes caused by human activity (new construction, modified structures, infrastructure expansion, deforestation, and water body variations) using satellite Earth-observation imagery.
            </p>
          </div>

          <div>
            <h4 style={{ color: 'var(--accent-amber)', fontFamily: 'var(--font-tech)', marginBottom: '4px' }}>
              2. End-to-End System Workflow
            </h4>
            <div style={{ background: 'rgba(0, 0, 0, 0.6)', padding: '12px', border: '1px solid var(--border-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#60a5fa' }}>
              IMAGE INGESTION (T0 & T1)<br />
              ➔ ASYNC PROCESSING (FastAPI BackgroundTasks)<br />
              ➔ AI INFERENCE (Siamese UNet + Mask Generation)<br />
              ➔ SPATIAL CONVERSION (Shapely Geometry to PostGIS Polygon)<br />
              ➔ GEOSPATIAL STORAGE (PostgreSQL / PostGIS SRID 4326)<br />
              ➔ GEOJSON DELIVERY & AI HUMAN-READABLE EXPLANATION
            </div>
          </div>

          <div>
            <h4 style={{ color: 'var(--accent-amber)', fontFamily: 'var(--font-tech)', marginBottom: '4px' }}>
              3. Visual Comparison & Color Codes
            </h4>
            <ul style={{ paddingLeft: '20px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li><strong style={{ color: '#ff9900' }}>ORANGE:</strong> New building construction / structural addition.</li>
              <li><strong style={{ color: '#f43f5e' }}>RED:</strong> Removed structure / demolished building.</li>
              <li><strong style={{ color: '#10b981' }}>GREEN:</strong> Vegetation loss / canopy conversion.</li>
              <li><strong style={{ color: '#ffffff' }}>WHITE:</strong> Infrastructure / newly paved transport corridors.</li>
              <li><strong style={{ color: '#38bdf8' }}>BLUE:</strong> Water body expansion or shrinkage.</li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-dim)', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="hud-btn-primary">
            CLOSE GUIDE
          </button>
        </div>

      </div>
    </div>
  );
};
