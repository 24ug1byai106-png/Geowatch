import React, { useState } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  Filter, 
  Layers, 
  MapPin,
  Building2,
  Trees,
  Route
} from 'lucide-react';
import type { PresetDataset, CalculatedChangeRegion } from '../types';

interface ChangeMapViewProps {
  dataset: PresetDataset;
  onSelectObject: (obj: CalculatedChangeRegion) => void;
}

// Helper component to center and fly to coordinates
const MapController: React.FC<{ targetCoords: [number, number] | null; defaultCoords: [number, number] }> = ({ targetCoords, defaultCoords }) => {
  const map = useMap();
  React.useEffect(() => {
    if (targetCoords) {
      map.flyTo(targetCoords, 15, { duration: 0.8 });
    } else {
      map.setView(defaultCoords, 13);
    }
  }, [targetCoords, defaultCoords, map]);
  return null;
};

// Create custom SVG GIS symbols for Buildings, Trees, and Roads
const getFeatureIcon = (category: string) => {
  if (category === 'structure') {
    return L.divIcon({
      className: 'gis-bldg-marker',
      html: `<div style="background: rgba(10, 14, 23, 0.95); border: 2px solid #ff9900; border-radius: 6px; padding: 3px 8px; font-size: 11px; display: flex; align-items: center; gap: 6px; color: #ffaa00; box-shadow: 0 0 14px rgba(255,153,0,0.7); font-family: monospace; font-weight: 800; cursor: pointer; white-space: nowrap;">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ff9900" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v8h4"/><path d="M18 9h2a2 2 0 0 1 2 2v11h-4"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
        <span>BUILDING</span>
      </div>`,
      iconSize: [98, 24],
      iconAnchor: [49, 12]
    });
  }
  if (category === 'vegetation') {
    return L.divIcon({
      className: 'gis-tree-marker',
      html: `<div style="background: rgba(4, 30, 20, 0.95); border: 2px solid #10b981; border-radius: 6px; padding: 3px 8px; font-size: 11px; display: flex; align-items: center; gap: 6px; color: #10b981; box-shadow: 0 0 14px rgba(16,185,129,0.7); font-family: monospace; font-weight: 800; cursor: pointer; white-space: nowrap;">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 10v10"/><path d="M12 14l3-3"/><path d="M12 17l-3-3"/><path d="M12 3a7 7 0 0 0-7 7c0 4 7 10 7 10s7-6 7-10a7 7 0 0 0-7-7z"/></svg>
        <span>TREES</span>
      </div>`,
      iconSize: [82, 24],
      iconAnchor: [41, 12]
    });
  }
  return L.divIcon({
    className: 'gis-road-marker',
    html: `<div style="background: rgba(10, 25, 47, 0.95); border: 2px solid #00f0ff; border-radius: 6px; padding: 3px 8px; font-size: 11px; display: flex; align-items: center; gap: 6px; color: #00f0ff; box-shadow: 0 0 14px rgba(0,240,255,0.7); font-family: monospace; font-weight: 800; cursor: pointer; white-space: nowrap;">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></svg>
      <span>ROAD</span>
    </div>`,
    iconSize: [78, 24],
    iconAnchor: [39, 12]
  });
};

export const ChangeMapView: React.FC<ChangeMapViewProps> = ({ dataset, onSelectObject }) => {
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(75);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'structure' | 'vegetation' | 'high_intensity'>('all');
  const [activeBasemap, setActiveBasemap] = useState<'satellite' | 'osm' | 'dark'>('satellite');
  const [flyToCoords, setFlyToCoords] = useState<[number, number] | null>(null);

  const analysis = dataset.analysisResult;
  const rawRegions = analysis?.regions || [];

  // Filter regions by confidence and category
  const filteredRegions = rawRegions.filter(r => {
    const matchesConfidence = r.confidence >= confidenceThreshold;
    const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
    return matchesConfidence && matchesCategory;
  });

  const baseLat = dataset.coordinates[0];
  const baseLng = dataset.coordinates[1];
  const span = 0.055;

  const basemapUrls = {
    satellite: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    osm: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
  };

  const structCount = rawRegions.filter(r => r.category === 'structure').length;
  const vegCount = rawRegions.filter(r => r.category === 'vegetation').length;
  const highCount = rawRegions.filter(r => r.category === 'high_intensity').length;

  const handleCardClick = (region: CalculatedChangeRegion) => {
    const relX = region.x / 100;
    const relY = region.y / 100;
    const centerLat = baseLat + (0.5 - relY) * span;
    const centerLng = baseLng + (relX - 0.5) * span;
    setFlyToCoords([centerLat, centerLng]);
    onSelectObject(region);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
      
      {/* Top Banner & Control Strip */}
      <div className="hud-panel" style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent-amber)' }}>
            <MapPin size={15} />
            <span>INTERACTIVE GEOSPATIAL VECTOR MAP • EPSG:4326</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-tech)', fontSize: '1.4rem', color: '#fff', margin: '4px 0 0 0' }}>
            CHANGE MAP // {dataset.name.toUpperCase()}
          </h2>
        </div>

        {/* Controls: Basemap + Confidence Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          
          {/* Basemap Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.6)', padding: '4px 8px', border: '1px solid var(--border-dim)' }}>
            <Layers size={13} color="var(--accent-amber)" />
            <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>BASEMAP:</span>
            {(['satellite', 'osm', 'dark'] as const).map((b) => (
              <button
                key={b}
                onClick={() => setActiveBasemap(b)}
                style={{
                  background: activeBasemap === b ? 'var(--accent-amber)' : 'transparent',
                  color: activeBasemap === b ? '#000' : 'var(--text-dim)',
                  border: '1px solid ' + (activeBasemap === b ? 'var(--accent-amber)' : 'rgba(255,255,255,0.06)'),
                  padding: '3px 8px',
                  fontSize: '0.65rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: activeBasemap === b ? 800 : 500,
                  cursor: 'pointer',
                  textTransform: 'uppercase'
                }}
              >
                {b}
              </button>
            ))}
          </div>

          {/* Confidence Slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.6)', padding: '4px 10px', border: '1px solid var(--border-dim)' }}>
            <Filter size={13} color="#00f0ff" />
            <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>MIN CONFIDENCE:</span>
            <input
              type="range"
              min={50}
              max={95}
              step={1}
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
              style={{ width: '100px', accentColor: '#00f0ff', cursor: 'pointer' }}
            />
            <span style={{ color: '#00f0ff', fontFamily: 'var(--font-mono)', fontWeight: 'bold', fontSize: '0.74rem', minWidth: '32px' }}>
              &ge;{confidenceThreshold}%
            </span>
          </div>

        </div>
      </div>

      {/* Main Map + Side Polygon Inspector Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 2.5fr) minmax(320px, 1fr)',
        gap: '16px',
        alignItems: 'stretch',
        minHeight: '620px'
      }}>
        
        {/* Left: Full Leaflet GIS Map Container */}
        <div className="hud-panel" style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          
          {/* Category Filter Pills Bar */}
          <div style={{
            display: 'flex',
            gap: '8px',
            padding: '8px 14px',
            background: 'rgba(10, 14, 20, 0.9)',
            borderBottom: '1px solid var(--border-dim)',
            flexWrap: 'wrap'
          }}>
            {[
              { id: 'all', label: `ALL SITES (${filteredRegions.length}/${rawRegions.length})` },
              { id: 'structure', label: `🏢 BUILDING STRUCTURES (${structCount})` },
              { id: 'vegetation', label: `🌳 TREES & VEGETATION (${vegCount})` },
              { id: 'high_intensity', label: `🛣️ ROAD CORRIDORS (${highCount})` }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                style={{
                  background: selectedCategory === cat.id ? 'var(--accent-amber)' : 'rgba(255, 255, 255, 0.04)',
                  color: selectedCategory === cat.id ? '#07090e' : 'var(--text-dim)',
                  border: '1px solid ' + (selectedCategory === cat.id ? 'var(--accent-amber)' : 'var(--border-dim)'),
                  padding: '4px 10px',
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: selectedCategory === cat.id ? 800 : 500,
                  cursor: 'pointer',
                  borderRadius: '2px',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Leaflet Map Canvas */}
          <div style={{ flex: 1, minHeight: '520px', position: 'relative' }}>
            <MapContainer
              center={dataset.coordinates}
              zoom={13}
              zoomControl={true}
              style={{ width: '100%', height: '100%' }}
            >
              <MapController 
                targetCoords={flyToCoords} 
                defaultCoords={dataset.coordinates} 
              />
              
              <TileLayer
                key={activeBasemap}
                attribution='&copy; ISRO / Copernicus Sentinel-2 / CartoDB'
                url={basemapUrls[activeBasemap]}
              />

              {filteredRegions.map((region) => {
                const relX = region.x / 100;
                const relY = region.y / 100;
                const relW = region.width / 100;
                const relH = region.height / 100;

                const centerLat = baseLat + (0.5 - relY) * span;
                const centerLng = baseLng + (relX - 0.5) * span;

                const polyCoords: [number, number][] = [
                  [centerLat, centerLng],
                  [centerLat, centerLng + relW * span],
                  [centerLat - relH * span, centerLng + relW * span],
                  [centerLat - relH * span, centerLng]
                ];

                const isBuilding = region.category === 'structure';
                const isTree = region.category === 'vegetation';

                return (
                  <React.Fragment key={region.id}>
                    {/* Geometric Vector Boundary */}
                    <Polygon
                      positions={polyCoords}
                      eventHandlers={{
                        click: () => onSelectObject(region)
                      }}
                      pathOptions={{
                        color: region.color,
                        weight: isBuilding ? 2 : 2.5,
                        fillColor: region.color,
                        fillOpacity: 0.15,
                        dashArray: isBuilding ? '5, 3' : isTree ? '2, 3' : undefined
                      }}
                    >
                      <Popup>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', padding: '4px' }}>
                          <div style={{ color: region.color, fontWeight: 'bold', marginBottom: '3px' }}>
                            {region.name}
                          </div>
                          <div>CLASSIFICATION: <strong>{region.type}</strong></div>
                          <div>CONFIDENCE: <strong style={{ color: '#10b981' }}>{region.confidence}%</strong></div>
                          <div>FOOTPRINT: <strong>{region.areaSqMeters.toLocaleString()} m²</strong></div>
                          <div 
                            onClick={() => onSelectObject(region)}
                            style={{ marginTop: '6px', fontSize: '0.65rem', color: '#00f0ff', cursor: 'pointer', textDecoration: 'underline' }}
                          >
                            [Click to inspect full region telemetry]
                          </div>
                        </div>
                      </Popup>
                    </Polygon>

                    {/* Structural & Ecological Badge Pin Marker */}
                    <Marker
                      position={[centerLat - (relH * span) / 2, centerLng + (relW * span) / 2]}
                      icon={getFeatureIcon(region.category)}
                      eventHandlers={{
                        click: () => onSelectObject(region)
                      }}
                    />
                  </React.Fragment>
                );
              })}
            </MapContainer>
          </div>
        </div>

        {/* Right: Detected Polygons Vector List */}
        <div className="hud-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          <div className="hud-header">
            <span className="led-amber" />
            <span>DETECTED STRUCTURES & SITES ({filteredRegions.length})</span>
          </div>

          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            maxHeight: '560px'
          }}>
            {filteredRegions.length === 0 ? (
              <div style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textAlign: 'center', padding: '30px 10px' }}>
                No sites match the current filter (&ge;{confidenceThreshold}%).
              </div>
            ) : (
              filteredRegions.map((region) => {
                const isBldg = region.category === 'structure';
                const isTree = region.category === 'vegetation';

                return (
                  <div
                    key={region.id}
                    onClick={() => handleCardClick(region)}
                    style={{
                      border: `1px solid ${region.color}50`,
                      background: 'rgba(10, 14, 20, 0.75)',
                      padding: '10px 12px',
                      cursor: 'pointer',
                      borderRadius: '2px',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = region.color;
                      e.currentTarget.style.background = 'rgba(255, 153, 0, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = `${region.color}50`;
                      e.currentTarget.style.background = 'rgba(10, 14, 20, 0.75)';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-tech)', fontWeight: 800, fontSize: '0.8rem', color: region.color, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {isBldg ? <Building2 size={14} /> : isTree ? <Trees size={14} /> : <Route size={14} />}
                        {region.name}
                      </span>
                      <span style={{
                        fontSize: '0.62rem',
                        fontFamily: 'var(--font-mono)',
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#10b981',
                        padding: '1px 5px',
                        border: '1px solid rgba(16, 185, 129, 0.3)'
                      }}>
                        {region.confidence}% CONF
                      </span>
                    </div>

                    <div style={{ fontSize: '0.68rem', color: '#cbd5e1', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                      {region.type}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                      <span>AREA: <strong>{region.areaSqMeters.toLocaleString()} m²</strong></span>
                      <span>DELTA: <strong>{region.intensity} / 255</strong></span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
