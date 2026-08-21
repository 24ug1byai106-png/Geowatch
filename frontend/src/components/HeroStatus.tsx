import React from 'react';

interface HeroStatusProps {
  isProcessing: boolean;
}

export const HeroStatus: React.FC<HeroStatusProps> = ({ isProcessing }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 340px',
      gap: '20px',
      marginBottom: '16px',
      alignItems: 'stretch'
    }}>
      
      {/* Left: Main Mission Title & Stream Info */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          color: 'var(--accent-amber)',
          letterSpacing: '0.08em',
          marginBottom: '8px'
        }}>
          <span className="led-amber" />
          <span>LIVE ANALYSIS // SATELLITE CHANGE DETECTION // MULTI-TEMPORAL OBSERVATION</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '10px' }}>
          <img 
            src="/hydra_logo.png" 
            alt="Hydra Positioning System Logo" 
            style={{ 
              width: '64px', 
              height: '64px', 
              objectFit: 'contain', 
              filter: 'drop-shadow(0 0 16px rgba(0, 240, 255, 0.45))',
              background: 'rgba(7, 10, 18, 0.9)',
              padding: '4px',
              borderRadius: '6px',
              border: '1px solid rgba(0, 240, 255, 0.35)'
            }} 
          />
          <h2 style={{
            fontFamily: 'var(--font-tech)',
            fontSize: '2.3rem',
            fontWeight: 900,
            letterSpacing: '0.06em',
            color: '#ffffff',
            textTransform: 'uppercase',
            lineHeight: 1.05,
            margin: 0
          }}>
            HYDRA POSITIONING<br />SYSTEM
          </h2>
        </div>

        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.95rem',
          color: '#94a3b8',
          maxWidth: '720px',
          borderLeft: '2px solid var(--accent-amber)',
          paddingLeft: '12px',
          margin: 0
        }}>
          AI-powered satellite intelligence for detecting, mapping and explaining geographic changes over time.
        </p>
      </div>

      {/* Right: Hydra Positioning System Status HUD Card */}
      <div className="hud-panel" style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          letterSpacing: '0.12em',
          color: '#00f0ff',
          borderBottom: '1px solid rgba(0, 240, 255, 0.25)',
          paddingBottom: '5px',
          textTransform: 'uppercase',
          fontWeight: 'bold'
        }}>
          HYDRA SYSTEM STATUS
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-dim)' }}>PLATFORM</span>
            <span style={{ color: '#00f0ff', fontWeight: 700 }}>Hydra Positioning System</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-dim)' }}>MODE</span>
            <span style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>Change Detection</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-dim)' }}>DATA</span>
            <span style={{ color: '#fff' }}>Satellite Imagery</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-dim)' }}>STATUS</span>
            <span style={{ color: isProcessing ? '#ffaa00' : '#10b981', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '6px', height: '6px', backgroundColor: isProcessing ? '#ffaa00' : '#10b981' }} />
              {isProcessing ? 'Analyzing...' : '● ONLINE'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-dim)' }}>ANALYSIS</span>
            <span style={{ color: '#10b981', fontWeight: 600 }}>READY</span>
          </div>
        </div>

      </div>

    </div>
  );
};
