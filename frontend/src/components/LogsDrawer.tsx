import React from 'react';
import { X, Terminal, Trash2 } from 'lucide-react';

export interface LogEntry {
  id: string;
  time: string;
  message: string;
  type: 'info' | 'success' | 'warn' | 'error';
}

interface LogsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  logs: LogEntry[];
  onClearLogs: () => void;
}

export const LogsDrawer: React.FC<LogsDrawerProps> = ({
  isOpen,
  onClose,
  logs,
  onClearLogs
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '61px',
      right: 0,
      width: '420px',
      maxWidth: '100%',
      height: 'calc(100vh - 61px)',
      background: 'rgba(8, 12, 18, 0.98)',
      borderLeft: '1px solid var(--accent-amber)',
      zIndex: 1500,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(10px)'
    }}>
      
      {/* Header */}
      <div className="hud-header" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Terminal size={15} />
          <span>MISSION TELEMETRY & API LOGS</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onClearLogs}
            title="Clear Log History"
            style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <Trash2 size={14} />
          </button>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Logs List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.72rem'
      }}>
        {logs.map((log) => {
          let color = '#94a3b8';
          if (log.type === 'success') color = '#10b981';
          if (log.type === 'error') color = '#f43f5e';
          if (log.type === 'warn') color = '#ff9900';

          return (
            <div
              key={log.id}
              style={{
                borderLeft: `2px solid ${color}`,
                background: 'rgba(15, 23, 42, 0.4)',
                padding: '6px 10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}
            >
              <div style={{ color: 'var(--text-dim)', fontSize: '0.62rem' }}>
                [{log.time}] [{log.type.toUpperCase()}]
              </div>
              <div style={{ color: color, wordBreak: 'break-word' }}>
                {log.message}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div style={{
        padding: '10px 14px',
        borderTop: '1px solid var(--border-dim)',
        fontSize: '0.65rem',
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-dim)',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <span>PROTOCOL: REST / PostGIS</span>
        <span>LATENCY: ~12ms</span>
      </div>

    </div>
  );
};
