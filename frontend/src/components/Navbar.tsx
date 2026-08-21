import React, { useState, useEffect } from 'react';
import { Bell, LogOut, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenLogs: () => void;
  userEmail?: string;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenLogs,
  userEmail,
  onLogout
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
        
        {/* Left: Hydra Mission Branding & Live Telemetry Clock */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img 
            src="/hydra_logo.png" 
            alt="Hydra Positioning System Logo" 
            style={{ 
              width: '44px', 
              height: '44px', 
              objectFit: 'contain', 
              borderRadius: '4px',
              filter: 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.45))',
              background: 'rgba(7, 10, 18, 0.8)',
              padding: '2px',
              border: '1px solid rgba(0, 240, 255, 0.3)'
            }} 
          />
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

        {/* Right: Officer Profile, Logs & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-dim)' }}>
          
          {userEmail && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(0, 240, 255, 0.08)',
              border: '1px solid rgba(0, 240, 255, 0.25)',
              padding: '4px 10px',
              borderRadius: '2px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem'
            }}>
              <ShieldCheck size={14} color="#10b981" />
              <span style={{ color: '#ffffff', fontWeight: 600 }}>{userEmail}</span>
            </div>
          )}

          <button 
            onClick={onOpenLogs} 
            title="Analysis Diagnostic Logs"
            style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-dim)', color: 'var(--text-dim)', padding: '6px 9px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}
          >
            <Bell size={14} />
            <span>LOGS</span>
          </button>

          {onLogout && (
            <button 
              onClick={onLogout}
              title="Logout from Hydra Portal"
              style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#f87171', padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}
            >
              <LogOut size={13} />
              <span>LOGOUT</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
