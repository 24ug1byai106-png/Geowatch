import React, { useState } from 'react';
import { Database, CheckCircle2, RefreshCw, Eye, Download } from 'lucide-react';
import { GEOWATCH_DATASETS } from '../api/client';
import type { PresetDataset } from '../types';

interface AnalyticsViewProps {
  onSelectDataset: (dataset: PresetDataset) => void;
  onLog: (msg: string, type?: 'info' | 'success' | 'warn' | 'error') => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ onSelectDataset, onLog }) => {
  const [selectedJobId, setSelectedJobId] = useState<string>('GW-001');

  const historyJobs = [
    {
      jobId: 'GW-001',
      date: '2025-08-20',
      before: '2024',
      after: '2025',
      changePct: 18.4,
      status: 'COMPLETED',
      structures: '+29',
      vegetation: '-126 HA',
      infra: '+2.5 KM',
      region: 'New Delhi Urban Corridor (Region Alpha)',
      explanation: 'Major urban expansion and commercial corridor construction identified.'
    },
    {
      jobId: 'GW-002',
      date: '2025-08-18',
      before: '2024',
      after: '2025',
      changePct: 24.1,
      status: 'COMPLETED',
      structures: '+42',
      vegetation: '-84 HA',
      infra: '+5.1 KM',
      region: 'Bengaluru Tech Corridor Expansion',
      explanation: 'Industrial technology park expansion and ring road junction additions.'
    },
    {
      jobId: 'GW-003',
      date: '2025-08-15',
      before: '2022',
      after: '2025',
      changePct: 31.8,
      status: 'COMPLETED',
      structures: '+14',
      vegetation: '-42 HA',
      infra: '+11.8 KM',
      region: 'Mumbai Coastal Reclamation & Expressway',
      explanation: 'Extensive coastal reclamation for multi-lane elevated sea link.'
    }
  ];

  const timelineYears = [
    { year: '2022', change: '+4.2%', note: 'Initial baseline survey' },
    { year: '2023', change: '+8.7%', note: 'Ground preparation & zoning' },
    { year: '2024', change: '+14.1%', note: 'Arterial road construction' },
    { year: '2025', change: '+18.4%', note: 'Commercial high-density expansion' },
    { year: '2026', change: 'Projected', note: 'Metropolitan corridor linkage' },
  ];

  const currentJob = historyJobs.find(j => j.jobId === selectedJobId) || historyJobs[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Banner */}
      <div className="hud-panel" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent-amber)' }}>
            <Database size={15} />
            <span>POSTGRESQL + POSTGIS SPATIAL DATABASE REPOSITORY</span>
          </div>
          <h3 style={{ fontFamily: 'var(--font-tech)', fontSize: '1.4rem', color: '#fff', margin: '4px 0 0 0' }}>
            HISTORICAL CHANGE DETECTION ANALYTICS
          </h3>
        </div>

        <button
          onClick={() => onLog('Refreshed spatial analysis history from PostGIS DB', 'success')}
          className="hud-btn-primary"
          style={{ fontSize: '0.75rem', padding: '6px 14px' }}
        >
          <RefreshCw size={14} />
          REFRESH HISTORY
        </button>
      </div>

      {/* Visual Change Metrics Over Time (Requirement #15) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', fontFamily: 'var(--font-mono)' }}>
        
        <div className="hud-panel" style={{ padding: '14px' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>STRUCTURAL CHANGE OVER TIME</div>
          <div style={{ fontFamily: 'var(--font-tech)', fontSize: '1.6rem', color: '#ff9900', fontWeight: 800, marginTop: '4px' }}>
            +85 Units
          </div>
          <div style={{ width: '100%', height: '4px', background: 'rgba(255, 153, 0, 0.15)', marginTop: '8px' }}>
            <div style={{ width: '78%', height: '100%', backgroundColor: '#ff9900' }} />
          </div>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)', marginTop: '4px' }}>Across 3 target observation zones</div>
        </div>

        <div className="hud-panel" style={{ padding: '14px' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>VEGETATION CHANGE</div>
          <div style={{ fontFamily: 'var(--font-tech)', fontSize: '1.6rem', color: '#f43f5e', fontWeight: 800, marginTop: '4px' }}>
            -252 HA
          </div>
          <div style={{ width: '100%', height: '4px', background: 'rgba(244, 63, 94, 0.15)', marginTop: '8px' }}>
            <div style={{ width: '64%', height: '100%', backgroundColor: '#f43f5e' }} />
          </div>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)', marginTop: '4px' }}>Canopy reduction rate: 12.4% / yr</div>
        </div>

        <div className="hud-panel" style={{ padding: '14px' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>INFRASTRUCTURE CHANGE</div>
          <div style={{ fontFamily: 'var(--font-tech)', fontSize: '1.6rem', color: '#ffffff', fontWeight: 800, marginTop: '4px' }}>
            +19.4 KM
          </div>
          <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.15)', marginTop: '8px' }}>
            <div style={{ width: '85%', height: '100%', backgroundColor: '#ffffff' }} />
          </div>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)', marginTop: '4px' }}>New multi-lane highways & sea links</div>
        </div>

        <div className="hud-panel" style={{ padding: '14px' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>TOTAL AFFECTED AREA</div>
          <div style={{ fontFamily: 'var(--font-tech)', fontSize: '1.6rem', color: '#60a5fa', fontWeight: 800, marginTop: '4px' }}>
            4.82 km²
          </div>
          <div style={{ width: '100%', height: '4px', background: 'rgba(96, 165, 250, 0.15)', marginTop: '8px' }}>
            <div style={{ width: '92%', height: '100%', backgroundColor: '#60a5fa' }} />
          </div>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)', marginTop: '4px' }}>Geospatial polygon intersection sum</div>
        </div>

      </div>

      {/* Multi-Year Timeline Evolution Strip (Requirement #15: 2022 -> 2023 -> 2024 -> 2025 -> 2026) */}
      <div className="hud-panel" style={{ padding: '16px 20px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent-amber)', marginBottom: '12px' }}>
          TEMPORAL EVOLUTION TIMELINE // REGIONAL DYNAMICS
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', fontFamily: 'var(--font-mono)' }}>
          {timelineYears.map((item) => (
            <div
              key={item.year}
              style={{
                background: item.year === '2025' ? 'rgba(255, 153, 0, 0.15)' : 'rgba(10, 14, 20, 0.6)',
                border: item.year === '2025' ? '1px solid var(--accent-amber)' : '1px solid var(--border-dim)',
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: item.year === '2025' ? 'var(--accent-amber)' : '#fff' }}>
                  {item.year}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>{item.change}</span>
              </div>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)', marginTop: '4px' }}>{item.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis History Table (Requirement #15) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1fr)', gap: '20px' }}>
        
        <div className="hud-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="hud-header">
            <span className="led-amber" />
            <span>ANALYSIS HISTORY</span>
          </div>

          <div style={{ padding: '12px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-amber)', color: 'var(--accent-amber)', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>JOB ID</th>
                  <th style={{ padding: '8px' }}>DATE</th>
                  <th style={{ padding: '8px' }}>BEFORE</th>
                  <th style={{ padding: '8px' }}>AFTER</th>
                  <th style={{ padding: '8px' }}>CHANGE %</th>
                  <th style={{ padding: '8px' }}>STATUS</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {historyJobs.map((job) => {
                  const isSel = selectedJobId === job.jobId;
                  return (
                    <tr
                      key={job.jobId}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        background: isSel ? 'rgba(255, 153, 0, 0.12)' : 'transparent',
                        cursor: 'pointer'
                      }}
                      onClick={() => setSelectedJobId(job.jobId)}
                    >
                      <td style={{ padding: '10px 8px', color: '#60a5fa', fontWeight: 'bold' }}>{job.jobId}</td>
                      <td style={{ padding: '10px 8px', color: 'var(--text-dim)' }}>{job.date}</td>
                      <td style={{ padding: '10px 8px', color: '#fff' }}>{job.before}</td>
                      <td style={{ padding: '10px 8px', color: 'var(--accent-amber)', fontWeight: 'bold' }}>{job.after}</td>
                      <td style={{ padding: '10px 8px', color: '#fff', fontWeight: 'bold' }}>{job.changePct}%</td>
                      <td style={{ padding: '10px 8px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '2px 6px',
                          background: 'rgba(16, 185, 129, 0.15)',
                          color: '#10b981',
                          fontSize: '0.68rem',
                          fontWeight: 600
                        }}>
                          <CheckCircle2 size={11} />
                          {job.status}
                        </span>
                      </td>
                      <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const ds = GEOWATCH_DATASETS.find(d => job.region.includes(d.name.split(' ')[0])) || GEOWATCH_DATASETS[0];
                            onSelectDataset(ds);
                            onLog(`Switched active live view to: ${ds.name}`, 'info');
                          }}
                          className="hud-btn"
                          style={{ padding: '3px 8px', fontSize: '0.65rem' }}
                        >
                          <Eye size={11} style={{ display: 'inline', marginRight: '3px' }} />
                          LOAD
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Job Inspector Panel */}
        <div className="hud-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: 'var(--font-mono)' }}>
          <div className="hud-header" style={{ margin: '-16px -16px 4px -16px' }}>
            <span className="led-amber" />
            <span>JOB DETAILS // {currentJob.jobId}</span>
          </div>

          <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
            <div><strong>Region:</strong> <span style={{ color: '#fff' }}>{currentJob.region}</span></div>
            <div style={{ marginTop: '4px' }}><strong>Observation:</strong> {currentJob.before} ➔ {currentJob.after}</div>
            <div style={{ marginTop: '4px' }}><strong>Net Change:</strong> <span style={{ color: 'var(--accent-amber)', fontWeight: 'bold' }}>{currentJob.changePct}%</span></div>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '10px', border: '1px solid var(--border-dim)', fontSize: '0.72rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div>• New Structures: <strong style={{ color: '#ff9900' }}>{currentJob.structures}</strong></div>
            <div>• Vegetation Impact: <strong style={{ color: '#f43f5e' }}>{currentJob.vegetation}</strong></div>
            <div>• Infrastructure Growth: <strong style={{ color: '#ffffff' }}>{currentJob.infra}</strong></div>
          </div>

          <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontStyle: 'italic', borderLeft: '2px solid var(--accent-amber)', paddingLeft: '8px' }}>
            "{currentJob.explanation}"
          </div>

          <button
            onClick={() => {
              const blob = new Blob([JSON.stringify(currentJob, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `GEOWATCH_REPORT_${currentJob.jobId}.json`;
              a.click();
            }}
            className="hud-btn-primary"
            style={{ marginTop: 'auto', width: '100%', fontSize: '0.72rem' }}
          >
            <Download size={13} />
            EXPORT JOB REPORT
          </button>
        </div>

      </div>

    </div>
  );
};
