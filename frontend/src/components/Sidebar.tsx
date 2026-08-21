import React from 'react';
import { 
  Globe, 
  Layers, 
  Sparkles, 
  BarChart3, 
  HelpCircle, 
  History,
  Plus,
  Bot,
  ShieldAlert
} from 'lucide-react';

interface SidebarProps {
  activeScreen: string;
  setActiveScreen: (id: string) => void;
  onInitiateAnalysis: () => void;
  onOpenAskAi?: () => void;
  onOpenLogs: () => void;
  onOpenHelp: () => void;
  alertCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeScreen,
  setActiveScreen,
  onInitiateAnalysis,
  onOpenAskAi,
  onOpenLogs,
  onOpenHelp,
  alertCount = 0
}) => {
  const navItems = [
    { id: 'analysis', label: 'MISSION ANALYSIS', sublabel: 'Before / After Differencing', symbol: '◈', icon: Layers },
    { id: 'change_map', label: 'CHANGE MAP', sublabel: 'Geographic Polygons', symbol: '◉', icon: Globe },
    { id: 'monitoring', label: 'GOVERNMENT ALERTS', sublabel: 'Field Verification Queue', symbol: '🛡️', icon: ShieldAlert, badge: alertCount > 0 ? alertCount : undefined },
    { id: 'government', label: 'CIVIC AUDIT', sublabel: 'Roads, Buildings & Trees Report', symbol: '🏛️', icon: Sparkles },
    { id: 'analytics', label: 'TIMELINE', sublabel: 'Multi-Year History', symbol: '▣', icon: BarChart3 },
  ];

  return (
    <aside style={{
      width: '270px',
      background: 'var(--bg-panel)',
      borderRight: '1px solid var(--border-amber)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: 'calc(100vh - 58px)',
      position: 'sticky',
      top: '58px',
      padding: '14px 12px',
      flexShrink: 0
    }}>
      
      {/* Top Section: Status Card, Actions & Navigation */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {/* Hydra Positioning System Status Card */}
        <div style={{
          border: '1px solid var(--border-dim)',
          background: 'rgba(10, 15, 26, 0.85)',
          padding: '10px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <img 
            src="/hydra_logo.png" 
            alt="Hydra Logo" 
            style={{ 
              width: '36px', 
              height: '36px', 
              objectFit: 'contain', 
              filter: 'drop-shadow(0 0 6px rgba(0, 240, 255, 0.4))' 
            }} 
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
            <div style={{
              fontFamily: 'var(--font-tech)',
              fontSize: '0.8rem',
              fontWeight: 800,
              color: '#00f0ff',
              letterSpacing: '0.06em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>HYDRA SYSTEM</span>
              <span style={{ fontSize: '0.6rem', color: '#10b981' }}>● ONLINE</span>
            </div>

            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.58rem',
              color: 'var(--accent-amber)',
              letterSpacing: '0.04em',
              fontWeight: 'bold'
            }}>
              EARTH OBSERVATION AI
            </div>
          </div>
        </div>

        {/* Action Buttons: New Analysis + Ask Hydra AI */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button
            onClick={onInitiateAnalysis}
            className="hud-btn-primary"
            style={{
              width: '100%',
              letterSpacing: '0.08em',
              padding: '8px 12px',
              fontSize: '0.78rem'
            }}
          >
            <Plus size={15} />
            NEW ANALYSIS
          </button>

          {onOpenAskAi && (
            <button
              onClick={onOpenAskAi}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '8px 12px',
                background: 'rgba(0, 240, 255, 0.12)',
                border: '1px solid rgba(0, 240, 255, 0.6)',
                color: '#00f0ff',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.74rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                cursor: 'pointer',
                boxShadow: '0 0 12px rgba(0, 240, 255, 0.15)',
                transition: 'all 0.2s ease'
              }}
            >
              <Bot size={15} />
              <span>ASK HYDRA AI</span>
            </button>
          )}
        </div>

        {/* Navigation Heading */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'var(--text-dim)',
          letterSpacing: '0.1em',
          padding: '2px 4px',
          textTransform: 'uppercase',
          borderTop: '1px solid var(--border-dim)',
          paddingTop: '8px'
        }}>
          ALL MISSION FEATURES
        </div>

        {/* Navigation Items in Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
                  padding: '9px 12px',
                  background: isActive ? '#ff9900' : 'rgba(10, 14, 20, 0.4)',
                  color: isActive ? '#07090e' : '#cbd5e1',
                  border: '1px solid ' + (isActive ? '#ff9900' : 'rgba(255, 255, 255, 0.04)'),
                  borderRadius: '2px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.76rem',
                  fontWeight: isActive ? 800 : 500,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.9rem', color: isActive ? '#07090e' : 'var(--accent-amber)' }}>
                    {item.symbol}
                  </span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{item.label}</span>
                      {item.badge && (
                        <span style={{
                          background: isActive ? '#07090e' : '#ef4444',
                          color: isActive ? '#ff9900' : '#fff',
                          fontSize: '0.58rem',
                          padding: '1px 5px',
                          borderRadius: '8px',
                          fontWeight: 'bold'
                        }}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div style={{
                      fontSize: '0.58rem',
                      color: isActive ? '#1c1917' : '#64748b',
                      marginTop: '1px'
                    }}>
                      {item.sublabel}
                    </div>
                  </div>
                </div>
                {isActive && <span style={{ width: '5px', height: '5px', backgroundColor: '#07090e' }} />}
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
            fontSize: '0.74rem',
            padding: '6px 8px',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <HelpCircle size={14} />
          <span>? Mission Documentation</span>
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
            fontSize: '0.74rem',
            padding: '6px 8px',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <History size={14} />
          <span>◷ Diagnostic Logs</span>
        </button>
      </div>

    </aside>
  );
};
