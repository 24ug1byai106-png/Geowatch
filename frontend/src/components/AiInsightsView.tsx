import React from 'react';
import { Sparkles } from 'lucide-react';
import type { PresetDataset } from '../types';

interface AiInsightsViewProps {
  dataset: PresetDataset;
}

export const AiInsightsView: React.FC<AiInsightsViewProps> = ({ dataset }) => {
  const result = dataset.analysisResult;
  const isAnalyzed = !!result;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Banner */}
      <div className="hud-panel" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent-amber)' }}>
          <Sparkles size={15} />
          <span>AI CHANGE INTELLIGENCE // DERIVED PIXEL DIFFERENCING</span>
        </div>
        <h3 style={{ fontFamily: 'var(--font-tech)', fontSize: '1.4rem', color: '#fff', margin: '4px 0 0 0' }}>
          AI CHANGE INSIGHTS & SUMMARY
        </h3>
      </div>

      {/* Metric Breakdown Cards (Calculated from Image Differencing) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', fontFamily: 'var(--font-mono)' }}>
        
        <div className="hud-panel" style={{ padding: '14px' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>TOTAL CHANGE REGIONS</div>
          <div style={{ fontFamily: 'var(--font-tech)', fontSize: '1.8rem', color: isAnalyzed ? '#ff9900' : 'var(--text-dim)', fontWeight: 800, marginTop: '2px' }}>
            {isAnalyzed ? result.totalChangeRegions : '—'}
          </div>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            {isAnalyzed ? 'Connected pixel clusters' : 'Requires image analysis'}
          </div>
        </div>

        <div className="hud-panel" style={{ padding: '14px' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>POTENTIAL STRUCTURAL SHIFTS</div>
          <div style={{ fontFamily: 'var(--font-tech)', fontSize: '1.8rem', color: isAnalyzed ? '#ff9900' : 'var(--text-dim)', fontWeight: 800, marginTop: '2px' }}>
            {isAnalyzed ? result.structuralCount : '—'}
          </div>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            {isAnalyzed ? 'Reflectance & built edge variance' : 'Requires image analysis'}
          </div>
        </div>

        <div className="hud-panel" style={{ padding: '14px' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>POTENTIAL VEGETATION CHANGES</div>
          <div style={{ fontFamily: 'var(--font-tech)', fontSize: '1.8rem', color: isAnalyzed ? '#10b981' : 'var(--text-dim)', fontWeight: 800, marginTop: '2px' }}>
            {isAnalyzed ? result.vegetationCount : '—'}
          </div>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            {isAnalyzed ? 'Green canopy spectral reduction' : 'Requires image analysis'}
          </div>
        </div>

        <div className="hud-panel" style={{ padding: '14px' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>HIGH-INTENSITY SHIFTS</div>
          <div style={{ fontFamily: 'var(--font-tech)', fontSize: '1.8rem', color: isAnalyzed ? '#f43f5e' : 'var(--text-dim)', fontWeight: 800, marginTop: '2px' }}>
            {isAnalyzed ? result.highIntensityCount : '—'}
          </div>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            {isAnalyzed ? 'Severe delta > 110 threshold' : 'Requires image analysis'}
          </div>
        </div>

      </div>

      {/* AI Human-Readable Summary & Severity */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)', gap: '20px' }}>
        
        {/* Natural Language Summary Card */}
        <div className="hud-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="hud-header" style={{ margin: '-20px -20px 4px -20px' }}>
            <span className="led-amber" />
            <span>AI NATURAL LANGUAGE SYNTHESIS</span>
          </div>

          <div style={{
            background: 'rgba(0, 0, 0, 0.4)',
            borderLeft: '3px solid var(--accent-amber)',
            padding: '14px 16px',
            fontSize: '0.85rem',
            lineHeight: 1.6,
            color: '#e2e8f0',
            fontFamily: 'var(--font-mono)'
          }}>
            {isAnalyzed ? (
              result.aiSummary
            ) : (
              'No analysis data available yet. Please click "INITIATE ANALYSIS" to run the Sentinel-2 observation differencing pipeline for Whitefield, Bengaluru.'
            )}
          </div>

          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            * Note: In this prototype stage, classifications represent image differencing spectral shifts and potential structural variations.
          </div>
        </div>

        {/* Change Severity Gauge */}
        <div className="hud-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', fontFamily: 'var(--font-mono)' }}>
          <div className="hud-header" style={{ margin: '-20px -20px 4px -20px' }}>
            <span className="led-amber" />
            <span>CHANGE SEVERITY LEVEL</span>
          </div>

          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{
              fontSize: '1.8rem',
              fontWeight: 900,
              color: isAnalyzed ? (result.changeIntensityLabel === 'High' || result.changeIntensityLabel === 'Severe' ? '#f43f5e' : '#ff9900') : 'var(--text-dim)'
            }}>
              {isAnalyzed ? result.changeIntensityLabel.toUpperCase() : 'PENDING'}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '4px' }}>
              {isAnalyzed ? `${result.changedAreaPercentage}% of surveyed area modified` : 'Awaiting baseline differencing'}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.72rem', borderTop: '1px solid var(--border-dim)', paddingTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-dim)' }}>BASELINE:</span>
              <span style={{ color: '#60a5fa' }}>{dataset.beforeTifName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-dim)' }}>COMPARISON:</span>
              <span style={{ color: 'var(--accent-amber)' }}>{dataset.afterTifName}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
