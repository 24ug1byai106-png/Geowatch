import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Popup, useMap } from 'react-leaflet';
import { 
  Flame, 
  Leaf, 
  Droplets
} from 'lucide-react';
import type { PresetDataset } from '../types';

interface EnvironmentalHeatmapProps {
  dataset: PresetDataset;
}

const MapRecenter: React.FC<{ coords: [number, number] }> = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, 13);
  }, [coords, map]);
  return null;
};

export const EnvironmentalHeatmapAnalysis: React.FC<EnvironmentalHeatmapProps> = ({ dataset }) => {
  const [activeLayer, setActiveLayer] = useState<'ndvi' | 'lst' | 'ndwi'>('ndvi');
  const [activeBasemap, setActiveBasemap] = useState<'satellite' | 'dark'>('satellite');

  const baseLat = dataset.coordinates[0];
  const baseLng = dataset.coordinates[1];

  const basemapUrls = {
    satellite: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
  };

  // Generate synthetic multi-spectral environmental heatmap points across Bengaluru
  const environmentalPoints = [
    // Core Urban Heat Island (Commercial / New Concrete)
    { id: 'env-1', offset: [-0.012, 0.008], ndvi: 0.18, lst: 36.4, ndwi: -0.32, label: 'CBD Concrete Core' },
    { id: 'env-2', offset: [-0.004, -0.015], ndvi: 0.22, lst: 35.8, ndwi: -0.28, label: 'Tech Park Expressway Link' },
    { id: 'env-3', offset: [0.018, 0.012], ndvi: 0.16, lst: 37.1, ndwi: -0.35, label: 'Outer Ring Road Industrial Expansion' },
    { id: 'env-4', offset: [0.024, -0.008], ndvi: 0.25, lst: 34.9, ndwi: -0.22, label: 'Hebbal Infrastructure Junction' },
    
    // Deforested / Transitioning Canopy Zones
    { id: 'env-5', offset: [-0.022, -0.018], ndvi: 0.29, lst: 33.2, ndwi: -0.15, label: 'Peripheral Forest Edge' },
    { id: 'env-6', offset: [0.008, 0.025], ndvi: 0.31, lst: 32.8, ndwi: -0.12, label: 'Whitefield Green Buffer' },
    { id: 'env-7', offset: [-0.030, 0.020], ndvi: 0.34, lst: 31.9, ndwi: -0.08, label: 'Koramangala Valley Zone' },
    
    // Preserved Lush Vegetation / Parks
    { id: 'env-8', offset: [-0.008, 0.002], ndvi: 0.74, lst: 26.2, ndwi: 0.14, label: 'Cubbon Park Botanical Reserve' },
    { id: 'env-9', offset: [-0.025, 0.004], ndvi: 0.78, lst: 25.8, ndwi: 0.18, label: 'Lalbagh Botanical Gardens' },
    
    // Water Bodies / Wetlands
    { id: 'env-10', offset: [0.005, 0.028], ndvi: 0.12, lst: 27.4, ndwi: 0.65, label: 'Ulsoor Lake Water Body' },
    { id: 'env-11', offset: [-0.035, -0.025], ndvi: 0.15, lst: 28.1, ndwi: 0.58, label: 'Bellandur Catchment Wetland' },
  ];

  const getColor = (pt: typeof environmentalPoints[0]) => {
    if (activeLayer === 'ndvi') {
      // NDVI: High = Green (0.75), Medium = Amber (0.35), Low/Deforested = Red (0.15)
      if (pt.ndvi > 0.60) return '#10b981'; // Lush Green
      if (pt.ndvi > 0.30) return '#eab308'; // Moderate Canopy
      return '#ef4444'; // Deforested / Impervious Surface
    }
    if (activeLayer === 'lst') {
      // Thermal LST: High = Red-Orange (37°C), Cool = Cyan/Blue (26°C)
      if (pt.lst > 35.0) return '#f43f5e'; // Extreme Heat Island
      if (pt.lst > 31.0) return '#f97316'; // Moderate Surface Temp
      return '#06b6d4'; // Cool Vegetated Microclimate
    }
    // NDWI Water Index
    if (pt.ndwi > 0.40) return '#00f0ff'; // Active Lake / Reservoir
    if (pt.ndwi > 0.0) return '#3b82f6'; // Moist Soil
    return '#64748b'; // Dry Impervious Ground
  };

  return (
    <div className="hud-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* Top Header */}
      <div className="hud-header" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="led-amber" />
          <span>ECOLOGICAL NDVI & SURFACE TEMPERATURE (LST) // {dataset.name.toUpperCase()}</span>
        </div>

        {/* Controls: Basemap + Multi-Spectral Layer Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          
          <div style={{ display: 'flex', gap: '3px', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', border: '1px solid var(--border-dim)' }}>
            {(['satellite', 'dark'] as const).map((b) => (
              <button
                key={b}
                onClick={() => setActiveBasemap(b)}
                style={{
                  background: activeBasemap === b ? 'var(--accent-amber)' : 'transparent',
                  color: activeBasemap === b ? '#000' : 'var(--text-dim)',
                  border: 'none',
                  padding: '2px 5px',
                  fontSize: '0.6rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: activeBasemap === b ? 700 : 400,
                  cursor: 'pointer',
                  textTransform: 'uppercase'
                }}
              >
                {b}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '4px' }}>
            {[
              { id: 'ndvi', label: '🌱 NDVI VEGETATION', color: '#10b981' },
              { id: 'lst', label: '🌡️ THERMAL LST', color: '#f43f5e' },
              { id: 'ndwi', label: '💧 WATER NDWI', color: '#00f0ff' }
            ].map((layer) => {
              const isActive = activeLayer === layer.id;
              return (
                <button
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id as any)}
                  style={{
                    background: isActive ? layer.color : 'rgba(255,255,255,0.05)',
                    color: isActive ? '#000' : 'var(--text-dim)',
                    border: '1px solid ' + (isActive ? layer.color : 'var(--border-dim)'),
                    padding: '3px 8px',
                    fontSize: '0.64rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: isActive ? 800 : 500,
                    cursor: 'pointer',
                    borderRadius: '2px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {layer.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Environmental Telemetry Metrics Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
        padding: '8px 12px',
        background: 'rgba(10, 14, 20, 0.85)',
        borderBottom: '1px solid var(--border-dim)',
        fontSize: '0.68rem',
        fontFamily: 'var(--font-mono)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981' }}>
          <Leaf size={14} />
          <div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.58rem' }}>MEAN CANOPY NDVI</div>
            <strong>0.34 (-31.2% Shift)</strong>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f43f5e' }}>
          <Flame size={14} />
          <div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.58rem' }}>URBAN HEAT DELTA</div>
            <strong>+2.8°C Microclimate Rise</strong>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00f0ff' }}>
          <Droplets size={14} />
          <div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.58rem' }}>SURFACE MOISTURE</div>
            <strong>-4.2% Wetland Loss</strong>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div style={{ position: 'relative', flex: 1, minHeight: '300px', background: '#090e17' }}>
        
        {/* Dynamic Map Legend Badge */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          zIndex: 1000,
          background: 'rgba(0, 0, 0, 0.88)',
          border: '1px solid var(--border-amber)',
          padding: '6px 10px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.62rem',
          pointerEvents: 'none'
        }}>
          <div style={{ color: 'var(--accent-amber)', fontWeight: 'bold', marginBottom: '3px' }}>
            {activeLayer === 'ndvi' ? '🌱 NDVI CANOPY DENSITY SCALE' : activeLayer === 'lst' ? '🌡️ LAND SURFACE TEMPERATURE (LST)' : '💧 NDWI WATER SATURATION'}
          </div>
          {activeLayer === 'ndvi' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#ef4444' }}>■ Deforested (0.15)</span>
              <span style={{ color: '#eab308' }}>■ Moderate (0.35)</span>
              <span style={{ color: '#10b981' }}>■ Dense Forest (0.78)</span>
            </div>
          )}
          {activeLayer === 'lst' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#06b6d4' }}>■ Cool Park (25°C)</span>
              <span style={{ color: '#f97316' }}>■ Urban (32°C)</span>
              <span style={{ color: '#f43f5e' }}>■ Heat Island (37°C)</span>
            </div>
          )}
          {activeLayer === 'ndwi' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#64748b' }}>■ Dry Ground</span>
              <span style={{ color: '#3b82f6' }}>■ Moist Zone</span>
              <span style={{ color: '#00f0ff' }}>■ Lake / Reservoir</span>
            </div>
          )}
        </div>

        <MapContainer
          center={dataset.coordinates}
          zoom={13}
          zoomControl={true}
          style={{ width: '100%', height: '100%' }}
        >
          <MapRecenter coords={dataset.coordinates} />
          
          <TileLayer
            attribution='&copy; ISRO / Copernicus Sentinel-2 / CartoDB'
            url={basemapUrls[activeBasemap]}
          />

          {/* Environmental Heatmap Discs */}
          {environmentalPoints.map((pt) => {
            const lat = baseLat + pt.offset[0];
            const lng = baseLng + pt.offset[1];
            const color = getColor(pt);

            return (
              <Circle
                key={pt.id}
                center={[lat, lng]}
                radius={900}
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: 0.38,
                  weight: 1.5
                }}
              >
                <Popup>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', padding: '4px' }}>
                    <div style={{ fontWeight: 'bold', color, marginBottom: '4px' }}>
                      {pt.label}
                    </div>
                    <div>🌱 NDVI Index: <strong>{pt.ndvi}</strong></div>
                    <div>🌡️ Surface Temp: <strong>{pt.lst}°C</strong></div>
                    <div>💧 NDWI Moisture: <strong>{pt.ndwi}</strong></div>
                  </div>
                </Popup>
              </Circle>
            );
          })}
        </MapContainer>

      </div>

    </div>
  );
};
