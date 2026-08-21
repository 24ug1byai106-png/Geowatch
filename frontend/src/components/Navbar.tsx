import React, { useState, useEffect } from 'react';
import { Bell, User, Globe2 } from 'lucide-react';

interface NavbarProps {
  onOpenLogs: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenLogs
}) => {
  const [time, setTime] = useState<string>('');
  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-IN', { hour12: false }));
      setUtcTime(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="hud-panel" style={{ borderBottom: '1px solid var(--border-amber)', background: 'rgba(11, 15, 22, 0.96)', backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 24px' }}>
        
        {/* Left: GeoWatch Mission Branding & Live Telemetry Clock */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            border: '1px solid var(--accent-amber)',
            background: 'rgba(255, 153, 0, 0.12)',
            color: 'var(--accent-amber)',
            boxShadow: '0 0 12px rgba(255, 153, 0, 0.3)'
          }}>
            <Globe2 size={22} />
          </div>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-tech)',
              fontSize: '1.25rem',
              fontWeight: 800,
              letterSpacing: '0.1em',
              color: '#ff9900',
              textShadow: '0 0 10px rgba(255, 153, 0, 0.35)',
              margin: 0,
              lineHeight: 1.1
            }}>
              GEOWATCH // EARTH OBSERVATION MISSION
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.68rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
              <span style={{ color: '#e2e8f0', letterSpacing: '0.06em' }}>AI GEOSPATIAL CHANGE DETECTION</span>
              <span>•</span>
              <span>IST: <strong style={{ color: '#fff' }}>{time}</strong></span>
              <span>•</span>
              <span>{utcTime}</span>
            </div>
          </div>
        </div>

        {/* Right: Mission Operator & Logs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dim)' }}>
          <button 
            onClick={onOpenLogs} 
            title="Analysis Diagnostic Logs"
            style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-dim)', color: 'var(--text-dim)', padding: '6px 9px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}
          >
            <Bell size={14} />
            <span>LOGS</span>
          </button>
          <button 
            title="GeoWatch Mission Operator"
            style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-dim)', color: 'var(--text-dim)', padding: '6px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <User size={15} />
          </button>
        </div>

      </div>
    </header>
  );
};
