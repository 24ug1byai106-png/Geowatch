import React, { useState } from 'react';
import { Scale, ArrowRight } from 'lucide-react';
import type { PresetDataset } from '../types';

interface GovernmentAuditPanelProps {
  dataset: PresetDataset;
  onNavigateToInsights?: () => void;
}

export const GovernmentAuditPanel: React.FC<GovernmentAuditPanelProps> = ({
  dataset,
  onNavigateToInsights
}) => {
  const [activeAuditTab, setActiveAuditTab] = useState<'roads' | 'structures' | 'ecology' | 'regulatory'>('roads');
  const result = dataset.analysisResult;
  const audit = result?.governmentAudit;

  if (!result || !audit) return null;

  return (
    <div className="hud-panel" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid rgba(0, 240, 255, 0.4)', background: 'rgba(10, 16, 26, 0.95)' }}>
      
      {/* Panel Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid rgba(0, 240, 255, 0.2)', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            padding: '6px 8px',
            background: 'rgba(0, 240, 255, 0.15)',
            border: '1px solid #00f0ff',
            color: '#00f0ff',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Scale size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{
                fontFamily: 'var(--font-tech)',
                fontSize: '1.15rem',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '0.06em',
                margin: 0
              }}>
                GOVERNMENT & CIVIC INFRASTRUCTURE AUDIT
              </h3>
              <span style={{
                fontSize: '0.65rem',
                fontFamily: 'var(--font-mono)',
                color: '#10b981',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                padding: '2px 6px',
                fontWeight: 'bold'
              }}>
                AUTONOMOUS CIVIC METRICS
              </span>
            </div>
            <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', marginTop: '2px' }}>
              Target AOI: <strong style={{ color: '#00f0ff' }}>{dataset.name}</strong> • Observation: {dataset.beforeYear} vs {dataset.afterYear}
            </div>
          </div>
        </div>

        {/* Tab Switchers */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {[
            { id: 'roads', label: '🛣️ ROADS EXPANDED', count: `+${audit.roadExpansionKm} km` },
            { id: 'structures', label: '🏢 BUILDINGS BUILT', count: `+${audit.newBuildingsConstructed}` },
            { id: 'ecology', label: '🌳 TREES FELLED', count: `~${audit.treesFelledEstimated.toLocaleString()}` },
            { id: 'regulatory', label: '🏛️ ZONING & TAX', count: `${audit.zoningComplianceScore}% Score` }
          ].map((tab) => {
            const isActive = activeAuditTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveAuditTab(tab.id as any)}
                style={{
                  background: isActive ? '#00f0ff' : 'rgba(255, 255, 255, 0.05)',
                  color: isActive ? '#07090e' : '#cbd5e1',
                  border: '1px solid ' + (isActive ? '#00f0ff' : 'var(--border-dim)'),
                  padding: '6px 12px',
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: isActive ? 800 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{tab.label}</span>
                <span style={{
                  fontSize: '0.62rem',
                  padding: '1px 5px',
                  background: isActive ? 'rgba(0,0,0,0.2)' : 'rgba(0, 240, 255, 0.15)',
                  color: isActive ? '#000' : '#00f0ff',
                  fontWeight: 'bold'
                }}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Transportation & Road Network Expansion */}
      {activeAuditTab === 'roads' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', fontFamily: 'var(--font-mono)' }}>
          <div style={{ background: 'rgba(96, 165, 250, 0.08)', border: '1px solid rgba(96, 165, 250, 0.3)', padding: '12px 14px' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>TOTAL ROAD EXPANSION</div>
            <div style={{ fontFamily: 'var(--font-tech)', fontSize: '1.6rem', color: '#60a5fa', fontWeight: 800, marginTop: '2px' }}>
              +{audit.roadExpansionKm} KM
            </div>
            <div style={{ fontSize: '0.65rem', color: '#cbd5e1', marginTop: '4px' }}>
              Linear transportation network expansion across surveyed sector.
            </div>
          </div>

          <div style={{ background: 'rgba(96, 165, 250, 0.08)', border: '1px solid rgba(96, 165, 250, 0.3)', padding: '12px 14px' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>TRANSPORT SURFACE FOOTPRINT</div>
            <div style={{ fontFamily: 'var(--font-tech)', fontSize: '1.6rem', color: '#ffffff', fontWeight: 800, marginTop: '2px' }}>
              ~{audit.roadWidenedAreaSqm.toLocaleString()} m²
            </div>
            <div style={{ fontSize: '0.65rem', color: '#cbd5e1', marginTop: '4px' }}>
              Asphalt and paved corridor surfacing for vehicular transit.
            </div>
          </div>

          <div style={{ background: 'rgba(96, 165, 250, 0.08)', border: '1px solid rgba(96, 165, 250, 0.3)', padding: '12px 14px' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>CORRIDOR CLASSIFICATION</div>
            <div style={{ fontFamily: 'var(--font-tech)', fontSize: '1.1rem', color: '#38bdf8', fontWeight: 'bold', marginTop: '4px' }}>
              Arterial & Metro Feeder
            </div>
            <div style={{ fontSize: '0.65rem', color: '#cbd5e1', marginTop: '4px' }}>
              Outer Ring Road access links & widened peripheral connections.
            </div>
          </div>

          <div style={{ background: 'rgba(96, 165, 250, 0.08)', border: '1px solid rgba(96, 165, 250, 0.3)', padding: '12px 14px' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>MUNICIPAL ACTION REQUIRED</div>
            <div style={{ fontFamily: 'var(--font-tech)', fontSize: '1.05rem', color: '#10b981', fontWeight: 'bold', marginTop: '4px' }}>
              Road Right-of-Way (RoW)
            </div>
            <div style={{ fontSize: '0.65rem', color: '#cbd5e1', marginTop: '4px' }}>
              Verify civic setbacks along newly widened {audit.roadExpansionKm} km segments.
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Structural & Urban Buildings */}
      {activeAuditTab === 'structures' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', fontFamily: 'var(--font-mono)' }}>
          <div style={{ background: 'rgba(255, 153, 0, 0.08)', border: '1px solid rgba(255, 153, 0, 0.3)', padding: '12px 14px' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>NEW BUILDINGS CONSTRUCTED</div>
            <div style={{ fontFamily: 'var(--font-tech)', fontSize: '1.6rem', color: '#ff9900', fontWeight: 800, marginTop: '2px' }}>
              +{audit.newBuildingsConstructed} UNITS
            </div>
            <div style={{ fontSize: '0.65rem', color: '#cbd5e1', marginTop: '4px' }}>
              Individual structural footprints detected via spectral delta.
            </div>
          </div>

          <div style={{ background: 'rgba(255, 153, 0, 0.08)', border: '1px solid rgba(255, 153, 0, 0.3)', padding: '12px 14px' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>BUILT-UP AREA EXPANSION</div>
            <div style={{ fontFamily: 'var(--font-tech)', fontSize: '1.6rem', color: '#ffffff', fontWeight: 800, marginTop: '2px' }}>
              ~{audit.builtUpAreaSqm.toLocaleString()} m²
            </div>
            <div style={{ fontSize: '0.65rem', color: '#cbd5e1', marginTop: '4px' }}>
              Concrete and impervious built ground surface addition.
            </div>
          </div>

          <div style={{ background: 'rgba(255, 153, 0, 0.08)', border: '1px solid rgba(255, 153, 0, 0.3)', padding: '12px 14px' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>HIGH-DENSITY CLUSTERS</div>
            <div style={{ fontFamily: 'var(--font-tech)', fontSize: '1.6rem', color: '#f59e0b', fontWeight: 800, marginTop: '2px' }}>
              {audit.highDensityClusters} CLUSTERS
            </div>
            <div style={{ fontSize: '0.65rem', color: '#cbd5e1', marginTop: '4px' }}>
              Commercial tech parks & multi-storey residential complexes.
            </div>
          </div>

          <div style={{ background: 'rgba(255, 153, 0, 0.08)', border: '1px solid rgba(255, 153, 0, 0.3)', padding: '12px 14px' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>CIVIC INFRASTRUCTURE NODES</div>
            <div style={{ fontFamily: 'var(--font-tech)', fontSize: '1.6rem', color: '#00f0ff', fontWeight: 800, marginTop: '2px' }}>
              +{audit.commercialInfrastructureCount} NODES
            </div>
            <div style={{ fontSize: '0.65rem', color: '#cbd5e1', marginTop: '4px' }}>
              Substations, logistical parks & commercial developments.
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Ecology & Trees Felled */}
      {activeAuditTab === 'ecology' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', fontFamily: 'var(--font-mono)' }}>
          <div style={{ background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '12px 14px' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>ESTIMATED TREES FELLED</div>
            <div style={{ fontFamily: 'var(--font-tech)', fontSize: '1.6rem', color: '#f43f5e', fontWeight: 800, marginTop: '2px' }}>
              ~{audit.treesFelledEstimated.toLocaleString()} TREES
            </div>
            <div style={{ fontSize: '0.65rem', color: '#cbd5e1', marginTop: '4px' }}>
              Estimated tree canopy displacement across cleared parcels.
            </div>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '12px 14px' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>DEFORESTED GREEN CANOPY</div>
            <div style={{ fontFamily: 'var(--font-tech)', fontSize: '1.6rem', color: '#10b981', fontWeight: 800, marginTop: '2px' }}>
              ~{audit.deforestedCanopySqm.toLocaleString()} m²
            </div>
            <div style={{ fontSize: '0.65rem', color: '#cbd5e1', marginTop: '4px' }}>
              Reduction in vegetative index (NDVI loss delta).
            </div>
          </div>

          <div style={{ background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '12px 14px' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>COMPENSATORY MANDATE</div>
            <div style={{ fontFamily: 'var(--font-tech)', fontSize: '1.4rem', color: '#fb7185', fontWeight: 'bold', marginTop: '2px' }}>
              1:10 Reforestation
            </div>
            <div style={{ fontSize: '0.65rem', color: '#cbd5e1', marginTop: '4px' }}>
              Target: Plant ~{(audit.treesFelledEstimated * 10).toLocaleString()} saplings in compensatory green belts.
            </div>
          </div>

          <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '12px 14px' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>WATER BODY / WETLAND SHIFT</div>
            <div style={{ fontFamily: 'var(--font-tech)', fontSize: '1.4rem', color: '#38bdf8', fontWeight: 'bold', marginTop: '2px' }}>
              ~{audit.waterBodyShrinkageSqm.toLocaleString()} m²
            </div>
            <div style={{ fontSize: '0.65rem', color: '#cbd5e1', marginTop: '4px' }}>
              Wetland Risk: <strong style={{ color: audit.wetlandEncroachmentRisk === 'Critical' ? '#f43f5e' : '#f59e0b' }}>{audit.wetlandEncroachmentRisk}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Zoning & Municipal Tax */}
      {activeAuditTab === 'regulatory' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', fontFamily: 'var(--font-mono)' }}>
          <div style={{ background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '12px 14px' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>ZONING COMPLIANCE RATING</div>
            <div style={{ fontFamily: 'var(--font-tech)', fontSize: '1.6rem', color: audit.zoningComplianceScore < 70 ? '#f43f5e' : '#a855f7', fontWeight: 800, marginTop: '2px' }}>
              {audit.zoningComplianceScore}%
            </div>
            <div style={{ fontSize: '0.65rem', color: '#cbd5e1', marginTop: '4px' }}>
              Calculated based on master plan land-use conformity.
            </div>
          </div>

          <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '12px 14px' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>POTENTIAL ENCROACHMENTS</div>
            <div style={{ fontFamily: 'var(--font-tech)', fontSize: '1.6rem', color: '#ef4444', fontWeight: 800, marginTop: '2px' }}>
              {audit.unauthorizedEncroachmentsCount} ZONES
            </div>
            <div style={{ fontSize: '0.65rem', color: '#cbd5e1', marginTop: '4px' }}>
              High-intensity shifts on peripheral buffer zones flagged for field inspection.
            </div>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '12px 14px' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>PROPERTY TAX ASSET BASE</div>
            <div style={{ fontFamily: 'var(--font-tech)', fontSize: '1.3rem', color: '#10b981', fontWeight: 'bold', marginTop: '2px' }}>
              {audit.propertyTaxImpactEstimate}
            </div>
            <div style={{ fontSize: '0.65rem', color: '#cbd5e1', marginTop: '4px' }}>
              Estimated municipal tax collection increment from new constructed floor space.
            </div>
          </div>

          <div style={{ background: 'rgba(255, 153, 0, 0.08)', border: '1px solid rgba(255, 153, 0, 0.3)', padding: '12px 14px' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>AUDIT ACTION DIRECTIVE</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--accent-amber)', fontWeight: 'bold', marginTop: '2px', lineHeight: 1.35 }}>
              {audit.actionableRecommendation}
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation to AI Insights */}
      {onNavigateToInsights && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(0, 240, 255, 0.15)', paddingTop: '10px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
          <span style={{ color: 'var(--text-dim)' }}>
            ✦ Deep Multi-Spectral Intelligence generated via <strong>Groq Llama 3.3 70B & Sentinel-2B MSI</strong>
          </span>
          <button
            onClick={onNavigateToInsights}
            style={{
              background: 'rgba(0, 240, 255, 0.1)',
              border: '1px solid #00f0ff',
              color: '#00f0ff',
              padding: '5px 12px',
              fontSize: '0.7rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>VIEW FULL GOVERNMENT REPORT & AI INSIGHTS</span>
            <ArrowRight size={13} />
          </button>
        </div>
      )}

    </div>
  );
};
