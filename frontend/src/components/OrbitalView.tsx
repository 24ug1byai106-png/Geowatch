import React from 'react';
import { Globe } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Polyline } from 'react-leaflet';

export const OrbitalView: React.FC = () => {
  // Simulated orbital ground-track across India
  const groundTrack: [number, number][] = [
    [35.0, 72.0],
    [30.0, 74.5],
    [25.0, 77.0],
    [20.0, 79.2],
    [15.0, 81.5],
    [10.0, 83.8],
    [5.0, 86.0],
    [0.0, 88.0]
  ];

  const currentSatPos: [number, number] = [20.5937, 78.9629]; // Over Central India

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div className="hud-panel" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-amber)' }}>
          <Globe size={15} />
          <span>SUN-SYNCHRONOUS ORBITAL TRAJECTORY TRACKER</span>
        </div>
        <h3 style={{ fontFamily: 'var(--font-tech)', fontSize: '1.4rem', color: '#fff', margin: '4px 0 0 0' }}>
          EOS-1 GROUND-TRACK & COVERAGE PASS PREDICTIONS
        </h3>
      </div>

      {/* Orbital Map & Ephemeris Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1fr)', gap: '20px' }}>
        
        {/* Orbital Ground Track Map */}
        <div className="hud-panel" style={{ minHeight: '460px', display: 'flex', flexDirection: 'column' }}>
          <div className="hud-header">
            <span className="led-amber" />
            <span>REAL-TIME SATELLITE PASS OVER INDIAN REGION</span>
          </div>

          <div style={{ flex: 1, position: 'relative', minHeight: '380px' }}>
            <MapContainer
              center={currentSatPos}
              zoom={4}
              zoomControl={true}
              style={{ width: '100%', height: '100%' }}
            >
              <TileLayer
                attribution='&copy; CartoDB'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />

              {/* Orbital Ground Track Line */}
              <Polyline
                positions={groundTrack}
                pathOptions={{
                  color: '#ff9900',
                  weight: 2,
                  dashArray: '6, 6'
                }}
              />

              {/* Current Satellite Marker */}
              <CircleMarker
                center={currentSatPos}
                radius={8}
                pathOptions={{
                  color: '#ff9900',
                  fillColor: '#ffaa00',
                  fillOpacity: 1,
                  weight: 2
                }}
              />
            </MapContainer>
          </div>
        </div>

        {/* Keplerian Orbital Ephemeris */}
        <div className="hud-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', fontFamily: 'var(--font-mono)' }}>
          <div className="hud-header" style={{ margin: '-16px -16px 6px -16px' }}>
            <span className="led-amber" />
            <span>KEPLERIAN ORBITAL PARAMETERS</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.78rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-dim)', paddingBottom: '4px' }}>
              <span style={{ color: 'var(--text-dim)' }}>ORBIT TYPE</span>
              <span style={{ color: '#fff', fontWeight: 'bold' }}>Sun-Synchronous (SSO)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-dim)', paddingBottom: '4px' }}>
              <span style={{ color: 'var(--text-dim)' }}>APOGEE / PERIGEE</span>
              <span style={{ color: '#fff' }}>648 km / 636 km</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-dim)', paddingBottom: '4px' }}>
              <span style={{ color: 'var(--text-dim)' }}>ORBITAL PERIOD</span>
              <span style={{ color: '#fff' }}>97.4 minutes</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-dim)', paddingBottom: '4px' }}>
              <span style={{ color: 'var(--text-dim)' }}>INCLINATION</span>
              <span style={{ color: '#fff' }}>97.89°</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-dim)', paddingBottom: '4px' }}>
              <span style={{ color: 'var(--text-dim)' }}>GROUND VELOCITY</span>
              <span style={{ color: 'var(--accent-amber)', fontWeight: 'bold' }}>7.52 km/s (27,072 km/h)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-dim)', paddingBottom: '4px' }}>
              <span style={{ color: 'var(--text-dim)' }}>REVISIT TIME</span>
              <span style={{ color: '#fff' }}>4 Days (Steerable Roll ±45°)</span>
            </div>
          </div>

          {/* Next Ground Station Passes */}
          <div style={{ borderTop: '1px solid var(--border-dim)', paddingTop: '10px', marginTop: '6px' }}>
            <div style={{ color: 'var(--accent-amber)', fontSize: '0.72rem', marginBottom: '8px' }}>
              UPCOMING GROUND STATION PASSES (ISTRAC)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.72rem' }}>
              <div style={{ background: 'rgba(255, 153, 0, 0.1)', padding: '6px 8px', borderLeft: '2px solid var(--accent-amber)' }}>
                <strong>Bengaluru (TTC-1):</strong> In 18 mins (Elevation: 68°, Duration: 9m 40s)
              </div>
              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '6px 8px', borderLeft: '2px solid var(--border-dim)' }}>
                <strong>Shadnagar (NRSC):</strong> In 1h 52m (Elevation: 42°, Duration: 8m 15s)
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
