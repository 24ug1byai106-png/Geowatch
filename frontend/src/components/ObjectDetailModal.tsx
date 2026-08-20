import React from 'react';
import { X, Sparkles } from 'lucide-react';
import type { CalculatedChangeRegion } from '../types';

interface ObjectDetailModalProps {
  object: CalculatedChangeRegion | null;
  onClose: () => void;
}

export const ObjectDetailModal: React.FC<ObjectDetailModalProps> = ({ object, onClose }) => {
  if (!object) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2200,
      padding: '20px'
    }}>
      <div className="hud-panel" style={{
        width: '520px',
        maxWidth: '100%',
        background: 'var(--bg-panel)',
        border: `1px solid ${object.color}`,
        boxShadow: `0 0 25px ${object.color}33`,
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Header */}
        <div className="hud-header" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', backgroundColor: object.color, display: 'inline-block' }} />
            <span>CHANGE REGION TELEMETRY // {object.id.toUpperCase()}</span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '14px', fontFamily: 'var(--font-mono)' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-dim)', paddingBottom: '10px' }}>
            <div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>IDENTIFIER</div>
              <div style={{ fontSize: '1.1rem', color: '#ffffff', fontWeight: 'bold' }}>{object.name}</div>
            </div>
            <div style={{
              background: `${object.color}22`,
              border: `1px solid ${object.color}`,
              color: object.color,
              padding: '3px 8px',
              fontSize: '0.7rem',
              fontWeight: 'bold'
            }}>
              {object.type.toUpperCase()}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.75rem' }}>
            <div>
              <span style={{ color: 'var(--text-dim)' }}>ESTIMATED AREA:</span><br />
              <strong style={{ color: '#fff' }}>{object.areaSqMeters.toLocaleString()} m²</strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-dim)' }}>PIXEL DELTA INTENSITY:</span><br />
              <strong style={{ color: object.color }}>{object.intensity} / 255</strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-dim)' }}>CONFIDENCE SCORE:</span><br />
              <strong style={{ color: '#10b981' }}>{object.confidence}%</strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-dim)' }}>RELATIVE POSITION:</span><br />
              <strong style={{ color: '#60a5fa' }}>X: {object.x}% | Y: {object.y}%</strong>
            </div>
          </div>

          <div style={{
            background: 'rgba(0, 0, 0, 0.5)',
            borderLeft: `3px solid ${object.color}`,
            padding: '10px 12px',
            fontSize: '0.72rem',
            color: '#cbd5e1',
            lineHeight: 1.5
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: object.color, fontWeight: 'bold', marginBottom: '2px' }}>
              <Sparkles size={12} />
              <span>AI SPECTRAL EXPLANATION</span>
            </div>
            {object.explanation}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
            <button onClick={onClose} className="hud-btn-primary" style={{ padding: '5px 14px', fontSize: '0.72rem' }}>
              CLOSE INSPECTOR
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
