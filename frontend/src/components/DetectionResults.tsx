import React from 'react';
import { Download, Sparkles } from 'lucide-react';
import type { PresetDataset } from '../types';

interface DetectionResultsProps {
  dataset: PresetDataset;
  onDownloadReport: () => void;
}

export const DetectionResults: React.FC<DetectionResultsProps> = ({ dataset, onDownloadReport }) => {
  const result = dataset.analysisResult;
  const isAnalyzed = !!result;

  return (
    <div className="hud-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* Header */}
      <div className="hud-header">
        <span className="led-amber" />
        <span>CALCULATED CHANGE DETECTION RESULTS</span>
      </div>

      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        
        {/* Results Grid - Calculated directly from image comparison */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          
          {/* Card 1: Total Change Regions */}
          <div style={{
            background: 'rgba(10, 14, 20, 0.8)',
            border: '1px solid var(--border-dim)',
            padding: '10px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}>
            <div style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
              DETECTED CHANGE REGIONS
            </div>
            <div style={{ fontFamily: 'var(--font-tech)', fontSize: '1.4rem', color: isAnalyzed ? '#ff9900' : 'var(--text-dim)', fontWeight: 800 }}>
              {isAnalyzed ? `${result.totalChangeRegions} Regions` : 'NOT ANALYZED'}
            </div>
            <div style={{ fontSize: '0.6rem', fontFamily: 'var(--font-mono)', color: '#10b981' }}>
              {isAnalyzed ? `${result.structuralCount} struct • ${result.vegetationCount} veg` : 'Pending execution'}
            </div>
          </div>

          {/* Card 2: Changed Area % */}
          <div style={{
            background: 'rgba(10, 14, 20, 0.8)',
            border: '1px solid var(--border-dim)',
            padding: '10px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}>
            <div style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
              CHANGED AREA
            </div>
            <div style={{ fontFamily: 'var(--font-tech)', fontSize: '1.4rem', color: isAnalyzed ? '#ffffff' : 'var(--text-dim)', fontWeight: 800 }}>
              {isAnalyzed ? `${result.changedAreaPercentage}%` : 'NOT ANALYZED'}
            </div>
            <div style={{ fontSize: '0.6rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
              {isAnalyzed ? `~${result.totalChangedSqMeters.toLocaleString()} m² footprint` : 'Pending differencing'}
            </div>
          </div>

          {/* Card 3: Change Intensity */}
          <div style={{
            background: 'rgba(10, 14, 20, 0.8)',
            border: '1px solid var(--border-dim)',
            padding: '10px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}>
            <div style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
              CHANGE INTENSITY
            </div>
            <div style={{ fontFamily: 'var(--font-tech)', fontSize: '1.2rem', color: isAnalyzed ? (result.changeIntensityLabel === 'High' || result.changeIntensityLabel === 'Severe' ? '#f43f5e' : '#ff9900') : 'var(--text-dim)', fontWeight: 800 }}>
              {isAnalyzed ? result.changeIntensityLabel : 'PENDING'}
            </div>
            <div style={{ fontSize: '0.6rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
              {isAnalyzed ? 'Spectral delta magnitude' : 'Requires image pair'}
            </div>
          </div>

          {/* Card 4: Largest Change Region */}
          <div style={{
            background: 'rgba(10, 14, 20, 0.8)',
            border: '1px solid var(--border-dim)',
            padding: '10px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}>
            <div style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
              LARGEST CHANGE REGION
            </div>
            <div style={{ fontFamily: 'var(--font-tech)', fontSize: '0.95rem', color: isAnalyzed ? '#60a5fa' : 'var(--text-dim)', fontWeight: 'bold' }}>
              {isAnalyzed ? result.largestRegionName : 'AVAILABLE AFTER ANALYSIS'}
            </div>
            <div style={{ fontSize: '0.6rem', fontFamily: 'var(--font-mono)', color: '#10b981' }}>
              {isAnalyzed ? `${result.largestRegionArea.toLocaleString()} m²` : '—'}
            </div>
          </div>

        </div>

        {/* Dynamic AI Summary derived strictly from computed results */}
        <div style={{
          background: 'rgba(255, 153, 0, 0.05)',
          border: '1px solid var(--border-amber)',
          padding: '10px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-tech)', color: 'var(--accent-amber)', fontSize: '0.75rem', fontWeight: 'bold' }}>
            <Sparkles size={13} />
            <span>AI CHANGE SUMMARY // COMPUTED DERIVATION</span>
          </div>

          <p style={{
            fontSize: '0.72rem',
            fontFamily: 'var(--font-mono)',
            color: '#cbd5e1',
            margin: 0,
            lineHeight: 1.45
          }}>
            {isAnalyzed
              ? result.aiSummary
              : 'Execute "INITIATE ANALYSIS" to run pixel differencing and generate dynamic statistical explanation from the observation pair.'}
          </p>
        </div>

        {/* Algorithm & Pipeline Parameters */}
        <div style={{
          borderTop: '1px solid var(--border-dim)',
          paddingTop: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem'
        }}>
          <div style={{ color: 'var(--accent-amber)' }}>IMAGE DIFFERENCING PROTOCOL:</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)' }}>
            <span>METHOD:</span>
            <span style={{ color: '#fff' }}>Pixel-wise Delta (Otsu Morphological)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)' }}>
            <span>SOURCE DATA:</span>
            <span style={{ color: '#60a5fa' }}>{dataset.dataSource} ({dataset.beforeYear} / {dataset.afterYear})</span>
          </div>
        </div>

        {/* Export Report Action */}
        <button
          onClick={onDownloadReport}
          disabled={!isAnalyzed}
          className="hud-btn-primary"
          style={{
            marginTop: 'auto',
            width: '100%',
            fontSize: '0.72rem',
            opacity: !isAnalyzed ? 0.4 : 1,
            cursor: !isAnalyzed ? 'not-allowed' : 'pointer'
          }}
        >
          <Download size={13} />
          EXPORT DERIVED CHANGE REPORT (JSON)
        </button>

      </div>

    </div>
  );
};
