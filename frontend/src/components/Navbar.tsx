import React, { useState, useEffect } from 'react';
import { Bell, User, Database, Globe2 } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isBackendConnected: boolean;
  onOpenLogs: () => void;
  onOpenDatabase: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isBackendConnected,
  onOpenLogs,
  onOpenDatabase
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

  const navItems = ['ANALYSIS', 'CHANGE MAP', 'AI INSIGHTS', 'ANALYTICS'];

  return (
    <header className="hud-panel" style={{ borderBottom: '1px solid var(--border-amber)', background: 'rgba(11, 15, 22, 0.96)', backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 24px' }}>
        
        {/* Left: GeoWatch Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '34px',
            height: '34px',
            border: '1px solid var(--accent-amber)',
            background: 'rgba(255, 153, 0, 0.1)',
            color: 'var(--accent-amber)',
            boxShadow: '0 0 12px rgba(255, 153, 0, 0.25)'
          }}>
            <Globe2 size={20} />
          </div>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-tech)',
              fontSize: '1.2rem',
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

        {/* Center: Main Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          {navItems.map((item) => {
            const isActive = activeTab === item;
            return (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isActive ? '#ff9900' : 'var(--text-dim)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  padding: '8px 4px',
                  position: 'relative',
                  transition: 'all 0.2s ease'
                }}
              >
                {item}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    bottom: '-9px',
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: '#ff9900',
                    boxShadow: '0 0 8px #ff9900'
                  }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Status Badges & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          
          {/* PostGIS Database Status */}
          <div
            onClick={onOpenDatabase}
            title="Click to view Geospatial PostGIS Database status"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: '1px solid rgba(255, 153, 0, 0.4)',
              padding: '4px 10px',
              background: 'rgba(255, 153, 0, 0.08)',
              fontSize: '0.7rem',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer'
            }}
          >
            <Database size={13} color="var(--accent-amber)" />
            <span style={{ color: 'var(--text-dim)' }}>POSTGIS</span>
            <span style={{ color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', backgroundColor: '#10b981', display: 'inline-block' }} />
              CONNECTED
            </span>
          </div>

          {/* Backend API Status */}
          <div 
            onClick={onOpenLogs}
            title={isBackendConnected ? "FastAPI Backend Connected" : "Running on Simulated Telemetry Mode (Click for logs)"}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: isBackendConnected ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-amber)',
              padding: '4px 10px',
              background: isBackendConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 153, 0, 0.08)',
              fontSize: '0.7rem',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer'
            }}
          >
            <span style={{
              width: '6px',
              height: '6px',
              backgroundColor: isBackendConnected ? '#10b981' : '#ff9900',
              boxShadow: isBackendConnected ? '0 0 6px #10b981' : '0 0 6px #ff9900'
            }} />
            <span style={{ color: isBackendConnected ? '#10b981' : '#ff9900', fontWeight: 600 }}>
              {isBackendConnected ? "API ONLINE" : "ENGINE READY"}
            </span>
          </div>

          {/* Quick Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dim)' }}>
            <button 
              onClick={onOpenLogs} 
              title="Analysis Logs"
              style={{ background: 'none', border: '1px solid var(--border-dim)', color: 'var(--text-dim)', padding: '5px 7px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <Bell size={14} />
            </button>
            <button 
              title="GeoWatch Mission Operator"
              style={{ background: 'none', border: '1px solid var(--border-dim)', color: 'var(--text-dim)', padding: '5px 7px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <User size={14} />
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
