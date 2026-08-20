import React, { useEffect, useRef, useState } from 'react';

interface ObservationTelemetryProps {
  coordinates: [number, number];
}

export const ObservationTelemetry: React.FC<ObservationTelemetryProps> = ({ coordinates }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [telemetry, setTelemetry] = useState({
    resolution: '0.5m/px',
    confidenceAvg: '95.5%',
    delta: '12 Months',
    lat: coordinates[0],
    lng: coordinates[1],
    downlink: 1.2
  });

  useEffect(() => {
    setTelemetry(prev => ({
      ...prev,
      lat: coordinates[0],
      lng: coordinates[1]
    }));
  }, [coordinates]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let angle = 0;
    let animId: number;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(cx, cy) - 14;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#06090e';
      ctx.fillRect(0, 0, w, h);

      // Radar rings
      ctx.strokeStyle = 'rgba(255, 153, 0, 0.2)';
      ctx.lineWidth = 1;
      for (let r = radius / 3; r <= radius; r += radius / 3) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(cx - radius, cy);
      ctx.lineTo(cx + radius, cy);
      ctx.moveTo(cx, cy - radius);
      ctx.lineTo(cx, cy + radius);
      ctx.stroke();

      // Radar Sweep
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
      grad.addColorStop(0, 'rgba(255, 153, 0, 0.5)');
      grad.addColorStop(1, 'rgba(255, 153, 0, 0)');

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, 0, Math.PI / 4);
      ctx.lineTo(0, 0);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.strokeStyle = '#ff9900';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, 0, 0.05);
      ctx.stroke();
      ctx.restore();

      // Target lock box
      ctx.strokeStyle = 'rgba(255, 153, 0, 0.8)';
      ctx.strokeRect(cx - 12, cy - 12, 24, 24);

      angle += 0.035;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="hud-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* Header */}
      <div className="hud-header">
        <span className="led-amber" />
        <span>OBSERVATION TELEMETRY</span>
      </div>

      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        
        {/* Radar Screen Area with Alt Tag */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '140px',
          border: '1px solid var(--border-dim)',
          background: '#06090e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          <canvas
            ref={canvasRef}
            width={320}
            height={140}
            style={{ width: '100%', height: '100%' }}
          />

          <div style={{
            position: 'absolute',
            bottom: '6px',
            right: '8px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--accent-amber)',
            background: 'rgba(0, 0, 0, 0.75)',
            padding: '2px 6px',
            border: '1px solid rgba(255, 153, 0, 0.3)'
          }}>
            GSD: 0.5M/PX
          </div>
        </div>

        {/* Telemetry Metrics Table */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          fontSize: '0.78rem',
          fontFamily: 'var(--font-mono)'
        }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255, 255, 255, 0.06)', paddingBottom: '4px' }}>
            <span style={{ color: 'var(--text-dim)' }}>SPATIAL RESOLUTION</span>
            <span style={{ color: '#fff', fontWeight: 600 }}>{telemetry.resolution}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255, 255, 255, 0.06)', paddingBottom: '4px' }}>
            <span style={{ color: 'var(--text-dim)' }}>AVERAGE CONFIDENCE</span>
            <span style={{ color: '#10b981', fontWeight: 600 }}>{telemetry.confidenceAvg}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255, 255, 255, 0.06)', paddingBottom: '4px' }}>
            <span style={{ color: 'var(--text-dim)' }}>TEMPORAL DELTA</span>
            <span style={{ color: '#fff', fontWeight: 600 }}>{telemetry.delta}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255, 255, 255, 0.06)', paddingBottom: '4px' }}>
            <span style={{ color: 'var(--text-dim)' }}>LATITUDE</span>
            <span style={{ color: '#60a5fa', fontWeight: 600 }}>{telemetry.lat.toFixed(4)}° N</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255, 255, 255, 0.06)', paddingBottom: '4px' }}>
            <span style={{ color: 'var(--text-dim)' }}>LONGITUDE</span>
            <span style={{ color: '#60a5fa', fontWeight: 600 }}>{telemetry.lng.toFixed(4)}° E</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '2px' }}>
            <span style={{ color: 'var(--text-dim)' }}>DOWNLINK</span>
            <span style={{ color: 'var(--accent-amber)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="led-amber" />
              {telemetry.downlink} Gbps
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};
