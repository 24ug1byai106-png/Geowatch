import React, { useEffect, useRef, useState } from 'react';

interface OrbitalTelemetryProps {
  coordinates: [number, number];
}

export const OrbitalTelemetry: React.FC<OrbitalTelemetryProps> = ({ coordinates }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [telemetry, setTelemetry] = useState({
    altitude: 642.15,
    velocity: 7.52,
    inclination: 97.8,
    lat: coordinates[0],
    lng: coordinates[1],
    downlink: 1.2
  });

  // Keep coords updated if preset changes
  useEffect(() => {
    setTelemetry(prev => ({
      ...prev,
      lat: coordinates[0],
      lng: coordinates[1]
    }));
  }, [coordinates]);

  // Subtle real-time orbital fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        ...prev,
        altitude: Number((642.10 + Math.random() * 0.12).toFixed(2)),
        velocity: Number((7.518 + Math.random() * 0.005).toFixed(2)),
        downlink: Number((1.18 + Math.random() * 0.05).toFixed(1))
      }));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Animated Radar Canvas
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
      const radius = Math.min(cx, cy) - 16;

      ctx.clearRect(0, 0, w, h);

      // Dark background
      ctx.fillStyle = '#06090e';
      ctx.fillRect(0, 0, w, h);

      // Concentric circles
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

      // Radar Sweep Line & Gradient
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
      grad.addColorStop(0, 'rgba(255, 153, 0, 0.6)');
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
      ctx.lineTo(radius, 0);
      ctx.stroke();
      ctx.restore();

      // Satellite blip dot
      const blipX = cx + Math.cos(angle * 0.7) * (radius * 0.6);
      const blipY = cy + Math.sin(angle * 0.7) * (radius * 0.6);
      ctx.fillStyle = '#ffaa00';
      ctx.beginPath();
      ctx.arc(blipX, blipY, 3, 0, Math.PI * 2);
      ctx.fill();

      // Target lock box
      ctx.strokeStyle = 'rgba(255, 153, 0, 0.8)';
      ctx.strokeRect(cx - 14, cy - 14, 28, 28);

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
        <span>ORBITAL TELEMETRY</span>
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

          {/* Alt tag overlay (bottom-right matching screenshot) */}
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
            ALT: 642KM
          </div>
        </div>

        {/* Telemetry Metrics Table (Matching Screenshot values) */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          fontSize: '0.78rem',
          fontFamily: 'var(--font-mono)'
        }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255, 255, 255, 0.06)', paddingBottom: '4px' }}>
            <span style={{ color: 'var(--text-dim)' }}>ALTITUDE</span>
            <span style={{ color: '#fff', fontWeight: 600 }}>{telemetry.altitude} km</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255, 255, 255, 0.06)', paddingBottom: '4px' }}>
            <span style={{ color: 'var(--text-dim)' }}>VELOCITY</span>
            <span style={{ color: '#fff', fontWeight: 600 }}>{telemetry.velocity} km/s</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255, 255, 255, 0.06)', paddingBottom: '4px' }}>
            <span style={{ color: 'var(--text-dim)' }}>INCLINATION</span>
            <span style={{ color: '#fff', fontWeight: 600 }}>{telemetry.inclination}°</span>
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
