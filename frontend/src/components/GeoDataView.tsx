import React, { useState } from 'react';
import { Database, Download, Copy, Check, FileText, FileDown, Layers, Search } from 'lucide-react';
import type { PresetDataset, GeoJsonCollection } from '../types';
import { generateMissionPdfReport } from '../utils/pdfGenerator';
import { generateChangeDetectionDocx } from '../utils/docxGenerator';

interface GeoDataViewProps {
  dataset: PresetDataset;
  onLog: (msg: string, type?: 'info' | 'success' | 'warn' | 'error') => void;
}

export const GeoDataView: React.FC<GeoDataViewProps> = ({ dataset, onLog }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [viewFormat, setViewFormat] = useState<'features' | 'geojson'>('features');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [isExportingDocx, setIsExportingDocx] = useState<boolean>(false);

  const analysis = dataset.analysisResult;
  const regions = analysis?.regions || [];
  const baseLat = dataset.coordinates[0];
  const baseLng = dataset.coordinates[1];
  const span = 0.045;

  // Build clean GeoJSON collection
  const dynamicGeoJson: GeoJsonCollection = {
    type: "FeatureCollection",
    features: regions.map(r => {
      const relX = r.x / 100;
      const relY = r.y / 100;
      const relW = r.width / 100;
      const relH = r.height / 100;

      return {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [Number((baseLng + (relX - 0.5) * span).toFixed(6)), Number((baseLat + (0.5 - relY) * span).toFixed(6))],
              [Number((baseLng + (relX + relW - 0.5) * span).toFixed(6)), Number((baseLat + (0.5 - relY) * span).toFixed(6))],
              [Number((baseLng + (relX + relW - 0.5) * span).toFixed(6)), Number((baseLat + (0.5 - relY - relH) * span).toFixed(6))],
              [Number((baseLng + (relX - 0.5) * span).toFixed(6)), Number((baseLat + (0.5 - relY - relH) * span).toFixed(6))],
              [Number((baseLng + (relX - 0.5) * span).toFixed(6)), Number((baseLat + (0.5 - relY) * span).toFixed(6))]
            ]
          ]
        },
        properties: {
          id: r.id,
          objectId: r.id.toUpperCase(),
          object_type: r.type,
          category: r.category,
          confidence: Number((r.confidence / 100).toFixed(3)),
          area: r.areaSqMeters,
          name: r.name,
          status: 'VERIFIED CONTOUR',
          explanation: r.explanation
        }
      };
    })
  };

  const geoJsonString = JSON.stringify(dynamicGeoJson, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(geoJsonString);
    setCopied(true);
    onLog('Copied GeoJSON dataset to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportGeoJson = () => {
    const blob = new Blob([geoJsonString], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Hydra_Positioning_System_${dataset.id}_Polygons.geojson`;
    a.click();
    URL.revokeObjectURL(url);
    onLog(`Exported ${regions.length} GeoJSON polygons to disk`, 'success');
  };

  const handleExportCsv = () => {
    const headers = ['ID', 'NAME', 'CATEGORY', 'TYPE', 'AREA_SQM', 'CONFIDENCE_PCT', 'EXPLANATION'];
    const rows = regions.map(r => [
      r.id,
      `"${r.name}"`,
      r.category,
      `"${r.type}"`,
      r.areaSqMeters,
      r.confidence,
      `"${r.explanation}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Hydra_Positioning_System_${dataset.id}_Attribute_Table.csv`;
    a.click();
    URL.revokeObjectURL(url);
    onLog(`Exported ${regions.length} attribute records as CSV`, 'success');
  };

  const handleDownloadPdf = async () => {
    try {
      setIsExportingPdf(true);
      const { pdfBlob, filename } = await generateMissionPdfReport(dataset);
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleDownloadDocx = async () => {
    try {
      setIsExportingDocx(true);
      const blob = await generateChangeDetectionDocx(dataset);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Hydra_Positioning_System_Dossier_${dataset.id}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExportingDocx(false);
    }
  };

  const filteredFeatures = dynamicGeoJson.features.filter(f => 
    !searchTerm || 
    (f.properties.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (f.properties.object_type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (f.properties.explanation || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Banner & Export Hub */}
      <div className="hud-panel" style={{ padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent-amber)' }}>
            <Database size={15} />
            <span>HYDRA POSITIONING SYSTEM // GEOSPATIAL DATA DISTRIBUTION & EXPORTS</span>
          </div>
          <h3 style={{ fontFamily: 'var(--font-tech)', fontSize: '1.4rem', color: '#fff', margin: '4px 0 0 0' }}>
            {dataset.name.toUpperCase()} // GIS EXPORT CENTER
          </h3>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
            Standard Formats: PDF Report • DOCX Dossier • GeoJSON (RFC 7946) • CSV Attributes
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          
          <button
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            style={{
              background: 'var(--accent-amber)',
              color: '#07090e',
              border: 'none',
              padding: '6px 12px',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              borderRadius: '2px'
            }}
          >
            <FileDown size={14} />
            <span>{isExportingPdf ? 'GENERATING PDF...' : '📄 PDF REPORT'}</span>
          </button>

          <button
            onClick={handleDownloadDocx}
            disabled={isExportingDocx}
            style={{
              background: 'rgba(0, 240, 255, 0.15)',
              color: '#00f0ff',
              border: '1px solid #00f0ff',
              padding: '6px 12px',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              borderRadius: '2px'
            }}
          >
            <FileText size={14} />
            <span>{isExportingDocx ? 'CREATING DOCX...' : '📊 DOCX'}</span>
          </button>

          <button
            onClick={handleExportGeoJson}
            style={{
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              border: '1px solid #10b981',
              padding: '6px 12px',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              borderRadius: '2px'
            }}
          >
            <Download size={14} />
            <span>🗺️ GEOJSON</span>
          </button>

          <button
            onClick={handleExportCsv}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#cbd5e1',
              border: '1px solid var(--border-dim)',
              padding: '6px 12px',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              borderRadius: '2px'
            }}
          >
            <Download size={14} />
            <span>💾 CSV</span>
          </button>

        </div>
      </div>

      {/* Dataset Status HUD Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontFamily: 'var(--font-mono)' }}>
        <div className="hud-panel" style={{ padding: '12px' }}>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)' }}>GIS DATA SOURCE</div>
          <div style={{ fontSize: '0.92rem', color: '#00f0ff', fontWeight: 'bold', marginTop: '4px' }}>Copernicus Sentinel-2B</div>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)', marginTop: '2px' }}>SRID: 4326 (WGS 84)</div>
        </div>

        <div className="hud-panel" style={{ padding: '12px' }}>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)' }}>MONITORED REGION</div>
          <div style={{ fontSize: '0.92rem', color: 'var(--accent-amber)', fontWeight: 'bold', marginTop: '4px' }}>{dataset.name}</div>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)', marginTop: '2px' }}>{dataset.beforeYear} vs {dataset.afterYear}</div>
        </div>

        <div className="hud-panel" style={{ padding: '12px' }}>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)' }}>CALCULATED PARCELS</div>
          <div style={{ fontSize: '1rem', color: '#ffffff', fontWeight: 'bold', marginTop: '4px' }}>{regions.length} Contours</div>
          <div style={{ fontSize: '0.62rem', color: '#10b981', marginTop: '2px' }}>10.0m Spatial Resolution</div>
        </div>

        <div className="hud-panel" style={{ padding: '12px' }}>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)' }}>TOTAL AREA MONITORED</div>
          <div style={{ fontSize: '1rem', color: '#ffffff', fontWeight: 'bold', marginTop: '4px' }}>~{(analysis?.totalChangedSqMeters || 0).toLocaleString()} m²</div>
          <div style={{ fontSize: '0.62rem', color: 'var(--accent-amber)', marginTop: '2px' }}>{analysis?.changedAreaPercentage}% Surface Modified</div>
        </div>
      </div>

      {/* Main Attribute Table (Default) & Optional Raw GeoJSON */}
      <div className="hud-panel" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="hud-header" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={14} />
            <span>GIS PARCEL ATTRIBUTE TABLE ({filteredFeatures.length} FEATURES)</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* Search Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-dim)', padding: '2px 8px', borderRadius: '2px' }}>
              <Search size={12} color="var(--text-dim)" />
              <input
                type="text"
                placeholder="Filter attributes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', outline: 'none', width: '130px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                className={`hud-btn ${viewFormat === 'features' ? 'active' : ''}`}
                onClick={() => setViewFormat('features')}
                style={{ fontSize: '0.65rem' }}
              >
                ATTRIBUTE TABLE
              </button>
              <button
                className={`hud-btn ${viewFormat === 'geojson' ? 'active' : ''}`}
                onClick={() => setViewFormat('geojson')}
                style={{ fontSize: '0.65rem' }}
              >
                RAW GEOJSON
              </button>
            </div>
          </div>
        </div>

        {viewFormat === 'features' ? (
          <div style={{ padding: '12px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-amber)', color: 'var(--accent-amber)', textAlign: 'left' }}>
                  <th style={{ padding: '8px 10px' }}>ID</th>
                  <th style={{ padding: '8px 10px' }}>CATEGORY</th>
                  <th style={{ padding: '8px 10px' }}>FOOTPRINT (m²)</th>
                  <th style={{ padding: '8px 10px' }}>CONFIDENCE</th>
                  <th style={{ padding: '8px 10px' }}>DESCRIPTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredFeatures.map((feat) => {
                  const isStruct = feat.properties.category === 'structure';
                  const isRoad = feat.properties.category === 'high_intensity';
                  const catColor = isStruct ? '#ff9900' : isRoad ? '#60a5fa' : '#10b981';

                  return (
                    <tr key={feat.properties.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '8px 10px', color: '#00f0ff', fontWeight: 'bold' }}>{feat.properties.objectId}</td>
                      <td style={{ padding: '8px 10px', color: catColor, fontWeight: 'bold' }}>
                        {feat.properties.object_type}
                      </td>
                      <td style={{ padding: '8px 10px', color: '#fff', fontWeight: 'bold' }}>
                        {feat.properties.area.toLocaleString()} m²
                      </td>
                      <td style={{ padding: '8px 10px', color: '#10b981' }}>
                        {(feat.properties.confidence * 100).toFixed(1)}%
                      </td>
                      <td style={{ padding: '8px 10px', color: '#cbd5e1', fontSize: '0.68rem' }}>
                        {feat.properties.explanation}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '6px 12px', background: '#070a12', borderBottom: '1px solid var(--border-dim)' }}>
              <button
                onClick={handleCopy}
                style={{ background: 'transparent', border: 'none', color: '#00f0ff', fontSize: '0.68rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)' }}
              >
                {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                <span>{copied ? 'COPIED TO CLIPBOARD' : 'COPY JSON'}</span>
              </button>
            </div>
            <pre style={{
              margin: 0,
              padding: '16px',
              background: '#04060b',
              color: '#38bdf8',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              overflowX: 'auto',
              maxHeight: '380px',
              lineHeight: 1.45
            }}>
              <code>{geoJsonString}</code>
            </pre>
          </div>
        )}
      </div>

    </div>
  );
};
