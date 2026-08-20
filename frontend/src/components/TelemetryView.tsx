import React from 'react';
import { Activity, Camera, Cpu, ShieldCheck, Layers } from 'lucide-react';

export const TelemetryView: React.FC = () => {
  const telemetryCards = [
    {
      title: 'OPTICAL IMAGERY',
      status: 'READY',
      metric: '0.5m GSD',
      desc: 'Panchromatic & RGB high-resolution satellite tiles ingested and orthorectified.',
      color: '#10b981',
      icon: Camera
    },
    {
      title: 'MULTISPECTRAL DATA',
      status: 'AVAILABLE',
      metric: '4 Spectral Bands',
      desc: 'NIR & Red edge channels calibrated for surface canopy and vegetation index calculation.',
      color: '#10b981',
      icon: Layers
    },
    {
      title: 'IMAGE QUALITY',
      status: 'VALIDATED',
      metric: 'Cloud Cover < 2%',
      desc: 'Sub-pixel co-registration completed with zero cloud occlusion over ROI.',
      color: '#10b981',
      icon: ShieldCheck
    },
    {
      title: 'PROCESSING ENGINE',
      status: 'ONLINE',
      metric: 'Siamese UNet v2',
      desc: 'GPU inference server operational with PostGIS spatial pipeline.',
      color: '#ff9900',
      icon: Cpu
    }
  ];

  const pipelineStages = [
    { name: 'IMAGE INGESTION', status: 'COMPLETE', color: '#10b981' },
    { name: 'ASYNC PROCESSING', status: 'COMPLETE', color: '#10b981' },
    { name: 'AI INFERENCE', status: 'READY', color: 'var(--accent-amber)' },
    { name: 'CHANGE MAPPING', status: 'READY', color: 'var(--accent-amber)' },
    { name: 'GEOJSON DELIVERY', status: 'READY', color: '#60a5fa' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Banner */}
      <div className="hud-panel" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent-amber)' }}>
          <Activity size={15} />
          <span>DATA PIPELINE MONITORING & INSTRUMENTATION STATUS</span>
        </div>
        <h3 style={{ fontFamily: 'var(--font-tech)', fontSize: '1.4rem', color: '#fff', margin: '4px 0 0 0' }}>
          EARTH OBSERVATION DATA TELEMETRY
        </h3>
      </div>

      {/* Four Telemetry Cards (Requirement #17) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
        {telemetryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="hud-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon size={16} color="var(--accent-amber)" />
                  <span style={{ fontFamily: 'var(--font-tech)', color: 'var(--accent-amber)', fontSize: '0.85rem', fontWeight: 'bold' }}>
                    {card.title}
                  </span>
                </div>
                <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: card.color, fontFamily: 'var(--font-mono)', fontSize: '0.65rem', padding: '2px 6px', fontWeight: 600 }}>
                  STATUS: {card.status}
                </span>
              </div>

              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.3rem', color: '#ffffff', fontWeight: 800 }}>
                {card.metric}
              </div>

              <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0, lineHeight: 1.4, borderTop: '1px solid var(--border-dim)', paddingTop: '8px' }}>
                {card.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Data Pipeline Status (Requirement #17) */}
      <div className="hud-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="hud-header" style={{ margin: '-20px -20px 8px -20px' }}>
          <span className="led-amber" />
          <span>DATA PIPELINE STATUS // END-TO-END WORKFLOW</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', fontFamily: 'var(--font-mono)' }}>
          {pipelineStages.map((stage) => (
            <div
              key={stage.name}
              style={{
                background: 'rgba(10, 14, 20, 0.8)',
                border: '1px solid var(--border-dim)',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>STAGE</div>
              <div style={{ fontSize: '0.78rem', color: '#fff', fontWeight: 'bold' }}>{stage.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: stage.color, fontWeight: 600, marginTop: '2px' }}>
                <span style={{ width: '6px', height: '6px', backgroundColor: stage.color }} />
                ● {stage.status}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
