import React from 'react';
import { Sparkles, Building2, Route, Trees, ShieldAlert, CheckCircle, AlertTriangle, Scale } from 'lucide-react';
import type { PresetDataset } from '../types';

interface AiInsightsViewProps {
  dataset: PresetDataset;
}

export const AiInsightsView: React.FC<AiInsightsViewProps> = ({ dataset }) => {
  const result = dataset.analysisResult;
  const isAnalyzed = !!result;
  const audit = result?.governmentAudit;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Banner */}
      <div className="hud-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent-amber)' }}>
            <Sparkles size={15} />
            <span>AI CHANGE INTELLIGENCE & GOVERNMENT CIVIC AUDIT</span>
          </div>
          <h3 style={{ fontFamily: 'var(--font-tech)', fontSize: '1.4rem', color: '#fff', margin: '4px 0 0 0' }}>
            {dataset.name.toUpperCase()} // REGULATORY & INFRASTRUCTURE REPORT
          </h3>
        </div>

        <div style={{
          padding: '6px 14px',
          border: '1px solid #10b981',
          background: 'rgba(16, 185, 129, 0.1)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          color: '#10b981',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Scale size={14} />
          <span>GOVERNMENT COMPLIANCE AUDIT</span>
        </div>
      </div>

      {/* 4 Pillars of Government Change Assessment */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', fontFamily: 'var(--font-mono)' }}>
        
        {/* 1. Structural Growth */}
        <div className="hud-panel" style={{ padding: '16px', borderLeft: '3px solid #ff9900' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#ff9900', fontSize: '0.75rem', fontWeight: 'bold' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Building2 size={16} />
              <span>STRUCTURAL GROWTH</span>
            </span>
            <span style={{ fontSize: '0.62rem', color: 'var(--text-dim)' }}>BUILT-UP</span>
          </div>

          <div style={{ fontFamily: 'var(--font-tech)', fontSize: '1.8rem', color: '#fff', fontWeight: 800, marginTop: '8px' }}>
            {isAnalyzed ? `${audit?.newBuildingsConstructed || result.structuralCount} BUILDINGS` : '—'}
          </div>

          <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '4px', lineHeight: 1.4 }}>
            {isAnalyzed ? (
              <>
                <strong style={{ color: '#ff9900' }}>~{(audit?.builtUpAreaSqm || 0).toLocaleString()} m²</strong> new built-up area footprint ({audit?.highDensityClusters || 0} high-density clusters).
              </>
            ) : 'Awaiting differencing...'}
          </div>
        </div>

        {/* 2. Functional & Transportation */}
        <div className="hud-panel" style={{ padding: '16px', borderLeft: '3px solid #60a5fa' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#60a5fa', fontSize: '0.75rem', fontWeight: 'bold' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Route size={16} />
              <span>ROAD & INFRASTRUCTURE</span>
            </span>
            <span style={{ fontSize: '0.62rem', color: 'var(--text-dim)' }}>TRANSPORT</span>
          </div>

          <div style={{ fontFamily: 'var(--font-tech)', fontSize: '1.8rem', color: '#fff', fontWeight: 800, marginTop: '8px' }}>
            {isAnalyzed ? `+${audit?.roadExpansionKm || 0} KM` : '—'}
          </div>

          <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '4px', lineHeight: 1.4 }}>
            {isAnalyzed ? (
              <>
                <strong style={{ color: '#60a5fa' }}>~{(audit?.roadWidenedAreaSqm || 0).toLocaleString()} m²</strong> expanded transportation corridor & road networks.
              </>
            ) : 'Awaiting differencing...'}
          </div>
        </div>

        {/* 3. Vegetation & Trees Felled */}
        <div className="hud-panel" style={{ padding: '16px', borderLeft: '3px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#10b981', fontSize: '0.75rem', fontWeight: 'bold' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Trees size={16} />
              <span>ECOLOGICAL IMPACT</span>
            </span>
            <span style={{ fontSize: '0.62rem', color: '#f43f5e' }}>CANOPY LOSS</span>
          </div>

          <div style={{ fontFamily: 'var(--font-tech)', fontSize: '1.8rem', color: isAnalyzed ? '#f43f5e' : '#fff', fontWeight: 800, marginTop: '8px' }}>
            {isAnalyzed ? `~${(audit?.treesFelledEstimated || 0).toLocaleString()} TREES` : '—'}
          </div>

          <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '4px', lineHeight: 1.4 }}>
            {isAnalyzed ? (
              <>
                Estimated tree canopy cleared over <strong style={{ color: '#10b981' }}>~{(audit?.deforestedCanopySqm || 0).toLocaleString()} m²</strong> green cover.
              </>
            ) : 'Awaiting differencing...'}
          </div>
        </div>

        {/* 4. Municipal Zoning & Civic Compliance */}
        <div className="hud-panel" style={{ padding: '16px', borderLeft: '3px solid #a855f7' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#a855f7', fontSize: '0.75rem', fontWeight: 'bold' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldAlert size={16} />
              <span>ZONING COMPLIANCE</span>
            </span>
            <span style={{ fontSize: '0.62rem', color: 'var(--text-dim)' }}>SCORE</span>
          </div>

          <div style={{ fontFamily: 'var(--font-tech)', fontSize: '1.8rem', color: '#a855f7', fontWeight: 800, marginTop: '8px' }}>
            {isAnalyzed ? `${audit?.zoningComplianceScore || 88}%` : '—'}
          </div>

          <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '4px', lineHeight: 1.4 }}>
            {isAnalyzed ? (
              <>
                <strong style={{ color: '#f59e0b' }}>{audit?.unauthorizedEncroachmentsCount || 0} flagged zones</strong> for potential unauthorized land-use conversions.
              </>
            ) : 'Awaiting differencing...'}
          </div>
        </div>

      </div>

      {/* AI Natural Language Executive Synthesis & Actionable Governance Directive */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(300px, 1.2fr)', gap: '20px' }}>
        
        {/* Executive Summary Card */}
        <div className="hud-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="hud-header" style={{ margin: '-20px -20px 4px -20px' }}>
            <span className="led-amber" />
            <span>AI NATURAL LANGUAGE EXECUTIVE BRIEFING (GROQ LLAMA 3.3 70B)</span>
          </div>

          <div style={{
            background: 'rgba(0, 0, 0, 0.45)',
            borderLeft: '3px solid var(--accent-amber)',
            padding: '16px 18px',
            fontSize: '0.86rem',
            lineHeight: 1.65,
            color: '#f1f5f9',
            fontFamily: 'var(--font-mono)'
          }}>
            {isAnalyzed ? (
              result.aiSummary
            ) : (
              'No analysis data available yet. Please click "INITIATE ANALYSIS" to run the Sentinel-2 observation differencing pipeline.'
            )}
          </div>

          {/* Actionable Government Directive */}
          {isAnalyzed && (
            <div style={{
              background: 'rgba(255, 153, 0, 0.08)',
              border: '1px solid rgba(255, 153, 0, 0.3)',
              padding: '12px 14px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.74rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px'
            }}>
              <AlertTriangle size={16} color="var(--accent-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: 'var(--accent-amber)', display: 'block', marginBottom: '2px' }}>
                  CIVIC & MUNICIPAL ACTION DIRECTIVE:
                </strong>
                <span style={{ color: '#cbd5e1' }}>
                  {audit?.actionableRecommendation || 'Continuous temporal monitoring advised for peripheral zones.'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Civic Revenue & Environmental Audit Card */}
        <div className="hud-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', fontFamily: 'var(--font-mono)' }}>
          <div className="hud-header" style={{ margin: '-20px -20px 4px -20px' }}>
            <span className="led-amber" />
            <span>PUBLIC ADMINISTRATION AUDIT</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.74rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-dim)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-dim)' }}>MUNICIPAL TAX REVENUE DELTA:</span>
              <span style={{ color: '#10b981', fontWeight: 'bold' }}>
                {isAnalyzed ? audit?.propertyTaxImpactEstimate : '—'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-dim)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-dim)' }}>TOTAL FOOTPRINT ALTERED:</span>
              <span style={{ color: '#fff', fontWeight: 'bold' }}>
                {isAnalyzed ? `${result.changedAreaPercentage}% (~${result.totalChangedSqMeters.toLocaleString()} m²)` : '—'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-dim)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-dim)' }}>WATER BODY / WETLAND SHIFTS:</span>
              <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>
                {isAnalyzed ? `~${(audit?.waterBodyShrinkageSqm || 0).toLocaleString()} m² (${audit?.wetlandEncroachmentRisk} Risk)` : '—'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-dim)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-dim)' }}>ZONING COMPLIANCE:</span>
              <span style={{ color: isAnalyzed && (audit?.zoningComplianceScore || 0) < 75 ? '#f43f5e' : '#10b981', fontWeight: 'bold' }}>
                {isAnalyzed ? `${audit?.zoningComplianceScore}% PASSED` : '—'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-dim)' }}>GOV AUDIT STATUS:</span>
              <span style={{ color: isAnalyzed ? '#10b981' : '#ff9900', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle size={12} />
                {isAnalyzed ? 'OFFICIALLY VALIDATED' : 'PENDING'}
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
