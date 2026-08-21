import React from 'react';
import { Plus } from 'lucide-react';

interface HeroStatusProps {
  onStartNewAnalysis?: () => void;
}

export const HeroStatus: React.FC<HeroStatusProps> = ({
  onStartNewAnalysis
}) => {
  return (
    <div 
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '260px',
        borderRadius: '4px',
        overflow: 'hidden',
        border: '1px solid rgba(0, 240, 255, 0.25)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        marginBottom: '18px',
        background: '#040711'
      }}
    >
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center right',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      >
        <source src="/videos/hydra-hero.mp4" type="video/mp4" />
      </video>

      {/* Subtle Readability Overlay */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(90deg, rgba(6, 10, 20, 0.88) 0%, rgba(6, 10, 20, 0.65) 45%, rgba(6, 10, 20, 0.2) 100%)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {/* Hero Content (Left-aligned, Earth/Satellite visible on Right/Center) */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '32px 36px',
          maxWidth: '680px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#00f0ff', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} />
          <span>HYDRA POSITIONING SYSTEM // ORBITAL INTELLIGENCE</span>
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-tech)',
            fontSize: '2.3rem',
            fontWeight: 900,
            letterSpacing: '0.05em',
            color: '#ffffff',
            lineHeight: 1.1,
            margin: 0,
            textTransform: 'uppercase'
          }}
        >
          HYDRA POSITIONING SYSTEM
        </h1>

        <h2
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--accent-amber)',
            margin: 0,
            letterSpacing: '0.04em'
          }}
        >
          Satellite Intelligence for a Changing Earth
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.88rem',
            color: '#cbd5e1',
            lineHeight: 1.5,
            margin: '2px 0 6px 0',
            maxWidth: '560px'
          }}
        >
          Monitor satellite imagery, detect meaningful human-made changes, and generate actionable geospatial alerts.
        </p>

        <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
          {onStartNewAnalysis && (
            <button
              onClick={onStartNewAnalysis}
              style={{
                background: '#00f0ff',
                color: '#050811',
                border: 'none',
                padding: '10px 22px',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                letterSpacing: '0.06em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderRadius: '2px',
                boxShadow: '0 0 16px rgba(0, 240, 255, 0.35)',
                transition: 'all 0.15s ease'
              }}
            >
              <Plus size={15} />
              <span>START NEW ANALYSIS & INGEST IMAGERY</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
