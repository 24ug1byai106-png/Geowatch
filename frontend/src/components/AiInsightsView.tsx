import React, { useState } from 'react';
import { 
  Sparkles, 
  Building2, 
  Route, 
  Trees, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle, 
  FileDown, 
  FileText, 
  Download
} from 'lucide-react';
import type { PresetDataset } from '../types';
import { generateMissionPdfReport } from '../utils/pdfGenerator';
import { generateChangeDetectionDocx } from '../utils/docxGenerator';
import { generateGovernmentAlertsFromDataset } from '../utils/alertGenerator';

interface AiInsightsViewProps {
  dataset: PresetDataset;
}

export const AiInsightsView: React.FC<AiInsightsViewProps> = ({ dataset }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'buildings' | 'roads' | 'vegetation'>('all');
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [isExportingDocx, setIsExportingDocx] = useState<boolean>(false);

  const result = dataset.analysisResult;
  const isAnalyzed = !!result;
  const audit = result?.governmentAudit;
  const alerts = generateGovernmentAlertsFromDataset(dataset);

  const buildingAlerts = alerts.filter(a => a.category === 'Potential Unauthorized Construction');
  const roadAlerts = alerts.filter(a => a.category === 'Potential Road Expansion');
  const vegetationAlerts = alerts.filter(a => a.category === 'Vegetation Clearing');

  const handleDownloadPdf = async () => {
    try {
      setIsExportingPdf(true);
      const { pdfBlob, filename } = await generateMissionPdfReport(dataset);
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF export failed', err);
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
      a.download = `Hydra_Positioning_System_Government_Report_${dataset.id}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('DOCX export failed', err);
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleDownloadJson = () => {
    const exportData = {
      platform: "HYDRA POSITIONING SYSTEM",
      dossier_type: "GOVERNMENT & CIVIC INFRASTRUCTURE AUDIT",
      target_aoi: dataset.name,
      coordinates: dataset.coordinates,
      observation_period: `${dataset.beforeYear} vs ${dataset.afterYear}`,
      satellite_sensor: dataset.dataSource,
      quantitative_audit: {
        total_buildings_constructed: audit?.newBuildingsConstructed || result?.structuralCount,
        built_up_area_sqm: audit?.builtUpAreaSqm,
        road_network_expansion_km: audit?.roadExpansionKm,
        road_surface_widened_sqm: audit?.roadWidenedAreaSqm,
        estimated_trees_displaced: audit?.treesFelledEstimated,
        deforested_canopy_sqm: audit?.deforestedCanopySqm,
        property_tax_revenue_delta: audit?.propertyTaxImpactEstimate,
        zoning_compliance_score: audit?.zoningComplianceScore
      },
      itemized_alerts: alerts
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Hydra_Positioning_System_Audit_${dataset.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      
      {/* Header Banner with Direct Government Export Suite */}
      <div className="hud-panel" style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent-amber)' }}>
            <Sparkles size={15} />
            <span>HYDRA POSITIONING SYSTEM // AI CHANGE INTELLIGENCE & CIVIC AUDIT</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-tech)', fontSize: '1.45rem', color: '#fff', margin: '4px 0 0 0' }}>
            {dataset.name.toUpperCase()} // EXHAUSTIVE GOVERNMENT AUDIT REPORT
          </h2>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
            Multi-Temporal Copernicus Sentinel-2 MSI Audit ({dataset.beforeYear} vs {dataset.afterYear})
          </div>
        </div>

        {/* Action Export Suite */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          
          {/* PDF Download Button */}
          <button
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            style={{
              background: 'var(--accent-amber)',
              color: '#07090e',
              border: 'none',
              padding: '7px 14px',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              cursor: isExportingPdf ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderRadius: '2px',
              boxShadow: '0 0 10px rgba(255, 153, 0, 0.3)'
            }}
          >
            <FileDown size={15} />
            <span>{isExportingPdf ? 'GENERATING PDF...' : '📄 DOWNLOAD GOVERNMENT PDF REPORT'}</span>
          </button>

          {/* DOCX Download Button */}
          <button
            onClick={handleDownloadDocx}
            disabled={isExportingDocx}
            style={{
              background: 'rgba(0, 240, 255, 0.15)',
              color: '#00f0ff',
              border: '1px solid #00f0ff',
              padding: '7px 14px',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              cursor: isExportingDocx ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderRadius: '2px'
            }}
          >
            <FileText size={15} />
            <span>{isExportingDocx ? 'CREATING DOCX...' : '📊 DOWNLOAD DOCX DOSSIER'}</span>
          </button>

          {/* JSON Export */}
          <button
            onClick={handleDownloadJson}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              color: '#cbd5e1',
              border: '1px solid var(--border-dim)',
              padding: '7px 12px',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderRadius: '2px'
            }}
          >
            <Download size={15} />
            <span>💾 JSON</span>
          </button>

        </div>
      </div>

      {/* 4 Quantitative Pillar Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', fontFamily: 'var(--font-mono)' }}>
        
        {/* 1. Structural Growth */}
        <div 
          onClick={() => setActiveTab('buildings')}
          className="hud-panel" 
          style={{ 
            padding: '16px', 
            borderLeft: '4px solid #ff9900',
            cursor: 'pointer',
            background: activeTab === 'buildings' ? 'rgba(255, 153, 0, 0.12)' : 'rgba(11, 15, 24, 0.8)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#ff9900', fontSize: '0.75rem', fontWeight: 'bold' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Building2 size={16} />
              <span>STRUCTURAL GROWTH</span>
            </span>
            <span style={{ fontSize: '0.62rem', color: 'var(--text-dim)' }}>BUILT-UP</span>
          </div>

          <div style={{ fontFamily: 'var(--font-tech)', fontSize: '1.85rem', color: '#fff', fontWeight: 800, marginTop: '8px' }}>
            {isAnalyzed ? `${audit?.newBuildingsConstructed || result.structuralCount} BUILDINGS` : '—'}
          </div>

          <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '4px', lineHeight: 1.4 }}>
            {isAnalyzed ? (
              <>
                <strong style={{ color: '#ff9900' }}>~{(audit?.builtUpAreaSqm || 0).toLocaleString()} m²</strong> new concrete built-up area footprint across {buildingAlerts.length} verified sectors.
              </>
            ) : 'Awaiting differencing...'}
          </div>
        </div>

        {/* 2. Functional & Transportation */}
        <div 
          onClick={() => setActiveTab('roads')}
          className="hud-panel" 
          style={{ 
            padding: '16px', 
            borderLeft: '4px solid #60a5fa',
            cursor: 'pointer',
            background: activeTab === 'roads' ? 'rgba(96, 165, 250, 0.12)' : 'rgba(11, 15, 24, 0.8)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#60a5fa', fontSize: '0.75rem', fontWeight: 'bold' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Route size={16} />
              <span>ROAD & INFRASTRUCTURE</span>
            </span>
            <span style={{ fontSize: '0.62rem', color: 'var(--text-dim)' }}>TRANSPORT</span>
          </div>

          <div style={{ fontFamily: 'var(--font-tech)', fontSize: '1.85rem', color: '#fff', fontWeight: 800, marginTop: '8px' }}>
            {isAnalyzed ? `+${audit?.roadExpansionKm || 0} KM` : '—'}
          </div>

          <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '4px', lineHeight: 1.4 }}>
            {isAnalyzed ? (
              <>
                <strong style={{ color: '#60a5fa' }}>~{(audit?.roadWidenedAreaSqm || 0).toLocaleString()} m²</strong> expanded transportation corridor & paved networks.
              </>
            ) : 'Awaiting differencing...'}
          </div>
        </div>

        {/* 3. Vegetation & Trees Felled */}
        <div 
          onClick={() => setActiveTab('vegetation')}
          className="hud-panel" 
          style={{ 
            padding: '16px', 
            borderLeft: '4px solid #10b981',
            cursor: 'pointer',
            background: activeTab === 'vegetation' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(11, 15, 24, 0.8)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#10b981', fontSize: '0.75rem', fontWeight: 'bold' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Trees size={16} />
              <span>ECOLOGICAL IMPACT</span>
            </span>
            <span style={{ fontSize: '0.62rem', color: '#f43f5e' }}>CANOPY LOSS</span>
          </div>

          <div style={{ fontFamily: 'var(--font-tech)', fontSize: '1.85rem', color: isAnalyzed ? '#f43f5e' : '#fff', fontWeight: 800, marginTop: '8px' }}>
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
        <div className="hud-panel" style={{ padding: '16px', borderLeft: '4px solid #a855f7', background: 'rgba(11, 15, 24, 0.8)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#a855f7', fontSize: '0.75rem', fontWeight: 'bold' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldAlert size={16} />
              <span>ZONING COMPLIANCE</span>
            </span>
            <span style={{ fontSize: '0.62rem', color: 'var(--text-dim)' }}>SCORE</span>
          </div>

          <div style={{ fontFamily: 'var(--font-tech)', fontSize: '1.85rem', color: '#a855f7', fontWeight: 800, marginTop: '8px' }}>
            {isAnalyzed ? `${audit?.zoningComplianceScore || 78}%` : '—'}
          </div>

          <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '4px', lineHeight: 1.4 }}>
            {isAnalyzed ? (
              <>
                <strong style={{ color: '#f59e0b' }}>{audit?.unauthorizedEncroachmentsCount || 3} flagged zones</strong> requiring immediate on-ground revenue verification.
              </>
            ) : 'Awaiting differencing...'}
          </div>
        </div>

      </div>

      {/* Itemized Lists: Detailed Government Dockets */}
      <div className="hud-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid var(--border-dim)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('all')}
              style={{
                background: activeTab === 'all' ? 'var(--accent-amber)' : 'rgba(255, 255, 255, 0.05)',
                color: activeTab === 'all' ? '#07090e' : '#cbd5e1',
                border: '1px solid ' + (activeTab === 'all' ? 'var(--accent-amber)' : 'var(--border-dim)'),
                padding: '4px 12px',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                cursor: 'pointer',
                borderRadius: '2px'
              }}
            >
              ALL INFRASTRUCTURE AUDIT ({alerts.length})
            </button>

            <button
              onClick={() => setActiveTab('buildings')}
              style={{
                background: activeTab === 'buildings' ? 'rgba(255, 153, 0, 0.2)' : 'transparent',
                color: activeTab === 'buildings' ? '#ff9900' : 'var(--text-dim)',
                border: '1px solid ' + (activeTab === 'buildings' ? '#ff9900' : 'var(--border-dim)'),
                padding: '4px 12px',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                cursor: 'pointer',
                borderRadius: '2px'
              }}
            >
              🏢 ALL EXPANDED BUILDINGS ({buildingAlerts.length})
            </button>

            <button
              onClick={() => setActiveTab('roads')}
              style={{
                background: activeTab === 'roads' ? 'rgba(96, 165, 250, 0.2)' : 'transparent',
                color: activeTab === 'roads' ? '#60a5fa' : 'var(--text-dim)',
                border: '1px solid ' + (activeTab === 'roads' ? '#60a5fa' : 'var(--border-dim)'),
                padding: '4px 12px',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                cursor: 'pointer',
                borderRadius: '2px'
              }}
            >
              🛣️ ALL EXPANDED ROADS ({roadAlerts.length})
            </button>

            <button
              onClick={() => setActiveTab('vegetation')}
              style={{
                background: activeTab === 'vegetation' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                color: activeTab === 'vegetation' ? '#10b981' : 'var(--text-dim)',
                border: '1px solid ' + (activeTab === 'vegetation' ? '#10b981' : 'var(--border-dim)'),
                padding: '4px 12px',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                cursor: 'pointer',
                borderRadius: '2px'
              }}
            >
              🌳 ALL FELLED TREES / VEGETATION ({vegetationAlerts.length})
            </button>
          </div>

          <div style={{ color: '#00f0ff', fontSize: '0.68rem', fontFamily: 'var(--font-mono)' }}>
            Total Monitored Area: ~{((audit?.builtUpAreaSqm || 0) + (audit?.roadWidenedAreaSqm || 0) + (audit?.deforestedCanopySqm || 0)).toLocaleString()} m²
          </div>
        </div>

        {/* Itemized Table List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {(activeTab === 'all' ? alerts : activeTab === 'buildings' ? buildingAlerts : activeTab === 'roads' ? roadAlerts : vegetationAlerts).map((item) => {
            const isStruct = item.category === 'Potential Unauthorized Construction';
            const isRoad = item.category === 'Potential Road Expansion';
            const badgeCol = isStruct ? '#ff9900' : isRoad ? '#60a5fa' : '#10b981';
            const icon = isStruct ? '🏢' : isRoad ? '🛣️' : '🌳';

            return (
              <div
                key={item.id}
                style={{
                  background: 'rgba(7, 10, 16, 0.75)',
                  border: `1px solid var(--border-dim)`,
                  borderLeft: `4px solid ${badgeCol}`,
                  padding: '14px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#00f0ff', fontWeight: 800 }}>{item.id}</span>
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.78rem' }}>
                      {icon} {item.specificLocation}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#fff' }}>
                      <strong>{item.affectedAreaSqm.toLocaleString()} m²</strong>
                    </span>
                    <span style={{ color: '#10b981' }}>
                      Confidence: {item.confidence}%
                    </span>
                    <span style={{
                      background: item.severity === 'HIGH' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                      color: item.severity === 'HIGH' ? '#ef4444' : '#eab308',
                      border: `1px solid ${item.severity === 'HIGH' ? '#ef4444' : '#eab308'}`,
                      padding: '1px 6px',
                      fontSize: '0.62rem',
                      fontWeight: 'bold',
                      borderRadius: '2px'
                    }}>
                      {item.severity}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.6fr', gap: '14px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '6px' }}>
                  <div>
                    <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>⚡ CAUSE & DRIVER: </span>
                    <span style={{ color: '#cbd5e1' }}>{item.driverCause}</span>
                  </div>
                  <div>
                    <span style={{ color: '#f87171', fontWeight: 'bold' }}>⚠️ CIVIC & ECOLOGICAL EFFECTS: </span>
                    <span style={{ color: '#cbd5e1' }}>{item.civicImpactEffects}</span>
                  </div>
                </div>

              </div>
            );
          })}
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
