import React from 'react';
import { 
  Globe, 
  Layers, 
  Sparkles, 
  Database, 
  BarChart3, 
  Terminal, 
  HelpCircle, 
  History,
  Plus
} from 'lucide-react';

interface SidebarProps {
  activeScreen: string;
  setActiveScreen: (id: string) => void;
  onInitiateAnalysis: () => void;
  onOpenLogs: () => void;
  onOpenHelp: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeScreen,
  setActiveScreen,
  onInitiateAnalysis,
  onOpenLogs,
  onOpenHelp
}) => {
  const navItems = [
    { id: 'analysis', label: 'ANALYSIS', sublabel: 'Before / After', symbol: '◈', icon: Layers },
    { id: 'change_map', label: 'CHANGE MAP', sublabel: 'Detected Changes', symbol: '◉', icon: Globe },
    { id: 'ai_insights', label: 'AI INSIGHTS', sublabel: 'AI Explanation', symbol: '◎', icon: Sparkles },
    { id: 'geo_data', label: 'GEO DATA', sublabel: 'GeoJSON / Polygons', symbol: '◇', icon: Database },
    { id: 'analytics', label: 'ANALYTICS', sublabel: 'Historical Changes', symbol: '▣', icon: BarChart3 },
    { id: 'api', label: 'API', sublabel: 'System Integration', symbol: '⌘', icon: Terminal },
  ];

  return (
    <aside style={{
      width: '240px',
      background: 'var(--bg-panel)',
      borderRight: '1px solid var(--border-amber)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: 'calc(100vh - 55px)',
      position: 'sticky',
      top: '55px',
      padding: '14px 10px',
      flexShrink: 0
    }}>
      
      {/* Top Section: GeoWatch Status Card & Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        
        {/* GeoWatch Earth Observation Card */}
        <div style={{
          border: '1px solid var(--border-dim)',
          background: 'rgba(19, 27, 40, 0.6)',
          padding: '10px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <div style={{
            fontFamily: 'var(--font-tech)',
            fontSize: '0.85rem',
            fontWeight: 800,
            color: 'var(--accent-amber)',
            letterSpacing: '0.08em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>GEOWATCH</span>
            <span style={{ fontSize: '0.65rem', color: '#10b981' }}>● ONLINE</span>
          </div>

          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem',
            color: '#cbd5e1',
            letterSpacing: '0.04em'
          }}>
            EARTH OBSERVATION SYSTEM
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            borderTop: '1px solid rgba(255, 153, 0, 0.15)',
            paddingTop: '4px',
            marginTop: '2px',
            color: 'var(--text-dim)'
          }}>
            <span>ENGINE: <strong style={{ color: 'var(--accent-amber)' }}>READY</strong></span>
            <span>POSTGIS: <strong style={{ color: '#10b981' }}>CONNECTED</strong></span>
          </div>
        </div>

        {/* New Analysis Action Button */}
        <button
          onClick={onInitiateAnalysis}
          className="hud-btn-primary"
          style={{
            width: '100%',
            letterSpacing: '0.08em',
            padding: '9px 12px',
            fontSize: '0.78rem'
          }}
        >
          <Plus size={15} />
          NEW ANALYSIS
        </button>

        {/* Navigation Heading */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'var(--text-dim)',
          letterSpacing: '0.1em',
          padding: '0 4px',
          textTransform: 'uppercase'
        }}>
          MISSION CONTROL
        </div>

        {/* Navigation Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {navItems.map((item) => {
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveScreen(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  background: isActive ? '#ff9900' : 'transparent',
                  color: isActive ? '#07090e' : 'var(--text-dim)',
                  border: 'none',
                  borderRadius: '2px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.85rem' }}>{item.symbol}</span>
                  <div>
                    <div>{item.label}</div>
                    <div style={{
                      fontSize: '0.58rem',
                      color: isActive ? '#1c1917' : '#64748b',
                      marginTop: '1px'
                    }}>
                      {item.sublabel}
                    </div>
                  </div>
                </div>
                {isActive && <span style={{ width: '4px', height: '4px', backgroundColor: '#07090e' }} />}
              </button>
            );
          })}
        </div>

      </div>

      {/* Bottom Section: Help & Logs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid var(--border-dim)', paddingTop: '10px' }}>
        <button
          onClick={onOpenHelp}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: 'var(--text-dim)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            padding: '6px 8px',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <HelpCircle size={14} />
          <span>? Help</span>
        </button>

        <button
          onClick={onOpenLogs}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: 'var(--text-dim)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            padding: '6px 8px',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <History size={14} />
          <span>◷ Analysis Logs</span>
        </button>
      </div>

    </aside>
  );
};
