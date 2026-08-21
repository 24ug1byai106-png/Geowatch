import React, { useState, useEffect } from 'react';
import { Bell, User } from 'lucide-react';

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
            width: '38px',
            height: '38px',
            border: '1px solid #00f0ff',
            background: 'rgba(0, 240, 255, 0.12)',
            color: '#00f0ff',
            boxShadow: '0 0 14px rgba(0, 240, 255, 0.4)',
            borderRadius: '3px'
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-tech)',
              fontSize: '1.25rem',
              fontWeight: 900,
              letterSpacing: '0.12em',
              color: '#00f0ff',
              textShadow: '0 0 12px rgba(0, 240, 255, 0.45)',
              margin: 0,
              lineHeight: 1.1
            }}>
              HYDRA POSITIONING SYSTEM
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.68rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
              <span style={{ color: 'var(--accent-amber)', letterSpacing: '0.06em', fontWeight: 'bold' }}>EARTH OBSERVATION & GEOSPATIAL INTELLIGENCE</span>
              <span>•</span>
              <span>IST: <strong style={{ color: '#fff' }}>{time}</strong></span>
              <span>•</span>
              <span>UTC: <strong style={{ color: '#fff' }}>{utcTime}</strong></span>
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
