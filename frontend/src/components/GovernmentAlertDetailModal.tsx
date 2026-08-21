import React, { useState } from 'react';
import { 
  X, 
  FileDown, 
  Mail, 
  Share2, 
  Check, 
  ShieldCheck, 
  Navigation, 
  Layers 
} from 'lucide-react';
import type { GovernmentAlert, GovernmentAlertStatus, PresetDataset } from '../types';
import { generateGovernmentPdfReport } from '../utils/pdfGenerator';
import { EmailShareModal } from './EmailShareModal';

interface GovernmentAlertDetailModalProps {
  alert: GovernmentAlert | null;
  dataset: PresetDataset;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (alertId: string, newStatus: GovernmentAlertStatus) => void;
  onLog: (msg: string, type: 'info' | 'success' | 'warn' | 'error') => void;
}

export const GovernmentAlertDetailModal: React.FC<GovernmentAlertDetailModalProps> = ({
  alert,
  dataset,
  isOpen,
  onClose,
  onUpdateStatus,
  onLog
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  if (!isOpen || !alert) return null;

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const { pdfBlob, filename } = await generateGovernmentPdfReport(alert);
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onLog(`Generated and downloaded official dossier: ${filename}`, 'success');
    } catch (err) {
      console.error('PDF Generation failed', err);
      onLog('Failed to generate PDF dossier.', 'error');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleCopyShareLink = () => {
    const shareUrl = `${window.location.origin}/?alertId=${alert.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    onLog(`Copied secure alert link to clipboard: ${alert.id}`, 'info');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const getStatusColor = (status: GovernmentAlertStatus) => {
    switch (status) {
      case 'FIELD VERIFICATION REQUIRED': return '#ff9900';
      case 'UNDER REVIEW': return '#38bdf8';
      case 'VERIFIED': return '#10b981';
      case 'RESOLVED': return '#22c55e';
      case 'DISMISSED': return '#94a3b8';
      default: return '#f59e0b';
    }
  };

  return (
    <>
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.88)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9990,
        padding: '20px'
      }}>
        <div className="hud-panel" style={{
          width: '100%',
          maxWidth: '1000px',
          background: '#070b14',
          border: '1.5px solid var(--accent-amber)',
          boxShadow: '0 0 50px rgba(0, 0, 0, 0.95)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh',
          overflow: 'hidden'
        }}>
          
          {/* Header */}
          <div className="hud-header" style={{ justifyContent: 'space-between', padding: '12px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: 'rgba(0, 240, 255, 0.1)',
                border: '1px solid #00f0ff',
                padding: '3px 8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: '#00f0ff',
                fontWeight: 'bold'
              }}>
                {alert.id}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontFamily: 'var(--font-tech)', color: '#fff' }}>
                  GOVERNMENT ALERT // {alert.category.toUpperCase()}
                </h3>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                  AOI: {alert.aoiName} • COORDS: {alert.coordinates[0].toFixed(5)}° N, {alert.coordinates[1].toFixed(5)}° E
                </span>
              </div>
            </div>

            {/* Status & Close */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              
              {/* Status Selector Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>STATUS:</span>
                <select
                  value={alert.status}
                  onChange={(e) => onUpdateStatus(alert.id, e.target.value as GovernmentAlertStatus)}
                  style={{
                    background: '#0a0f1d',
                    border: `1.5px solid ${getStatusColor(alert.status)}`,
                    color: getStatusColor(alert.status),
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 'bold',
                    padding: '3px 8px',
                    cursor: 'pointer',
                    borderRadius: '2px'
                  }}
                >
                  <option value="NEW">NEW</option>
                  <option value="UNDER REVIEW">UNDER REVIEW</option>
                  <option value="FIELD VERIFICATION REQUIRED">FIELD VERIFICATION REQUIRED</option>
                  <option value="VERIFIED">VERIFIED</option>
                  <option value="DISMISSED">DISMISSED</option>
                  <option value="RESOLVED">RESOLVED</option>
                </select>
              </div>

              <button
                onClick={onClose}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-dim)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Action Toolbar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 18px',
            background: 'rgba(15, 23, 42, 0.75)',
            borderBottom: '1px solid var(--border-dim)',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                background: alert.severity === 'HIGH' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                border: `1px solid ${alert.severity === 'HIGH' ? '#ef4444' : '#eab308'}`,
                color: alert.severity === 'HIGH' ? '#ef4444' : '#eab308',
                padding: '2px 7px',
                fontSize: '0.62rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 'bold'
              }}>
                SEVERITY: {alert.severity}
              </span>
              <span style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid #10b981',
                color: '#10b981',
                padding: '2px 7px',
                fontSize: '0.62rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 'bold'
              }}>
                CONFIDENCE: {alert.confidence}%
              </span>
              <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                EST. FOOTPRINT: <strong style={{ color: '#fff' }}>{alert.affectedAreaSqm.toLocaleString()} m²</strong>
              </span>
            </div>

            {/* Document Action Buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              
              {/* Copy Share Link Button */}
              <button
                onClick={handleCopyShareLink}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-dim)',
                  color: copiedLink ? '#10b981' : 'var(--text-dim)',
                  padding: '4px 10px',
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                {copiedLink ? <Check size={13} /> : <Share2 size={13} />}
                <span>{copiedLink ? 'LINK COPIED' : 'SHARE ALERT'}</span>
              </button>

              {/* Share via Email Button */}
              <button
                onClick={() => setIsEmailModalOpen(true)}
                style={{
                  background: 'rgba(0, 240, 255, 0.1)',
                  border: '1px solid #00f0ff',
                  color: '#00f0ff',
                  padding: '4px 10px',
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Mail size={13} />
                <span>SHARE VIA EMAIL</span>
              </button>

              {/* Generate PDF Button */}
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                style={{
                  background: 'var(--accent-amber)',
                  border: 'none',
                  color: '#07090e',
                  padding: '4px 12px',
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 800,
                  cursor: isGeneratingPdf ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <FileDown size={14} />
                <span>{isGeneratingPdf ? 'GENERATING PDF...' : 'GENERATE GOVERNMENT REPORT'}</span>
              </button>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div style={{ padding: '16px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Split Satellite Optical Imagery Evidence */}
            <div>
              <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={14} />
                <span>MULTI-TEMPORAL SATELLITE EVIDENCE (COPERNICUS SENTINEL-2B MSI)</span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px'
              }}>
                {/* 2024 Optical Granule */}
                <div style={{
                  position: 'relative',
                  border: '1px solid var(--border-dim)',
                  background: '#040711',
                  overflow: 'hidden',
                  aspectRatio: '16/10'
                }}>
                  <img
                    src={dataset.beforeImage}
                    alt="2024 Baseline"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  
                  {/* North Arrow & Metadata Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    background: 'rgba(0, 0, 0, 0.85)',
                    border: '1px solid #ff9900',
                    padding: '3px 8px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.62rem',
                    color: '#ff9900',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Navigation size={10} />
                    <span>▲ N • T1: {alert.beforeDate}</span>
                  </div>

                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '8px',
                    background: 'rgba(0, 0, 0, 0.85)',
                    padding: '2px 6px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.58rem',
                    color: 'var(--text-dim)'
                  }}>
                    SCALE: 100m • GSD: 10m
                  </div>
                </div>

                {/* 2026 Optical Granule */}
                <div style={{
                  position: 'relative',
                  border: '1px solid #00f0ff',
                  background: '#040711',
                  overflow: 'hidden',
                  aspectRatio: '16/10'
                }}>
                  <img
                    src={dataset.afterImage}
                    alt="2026 Shift"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  
                  {/* North Arrow & Metadata Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    background: 'rgba(0, 0, 0, 0.85)',
                    border: '1px solid #00f0ff',
                    padding: '3px 8px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.62rem',
                    color: '#00f0ff',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Navigation size={10} />
                    <span>▲ N • T2: {alert.afterDate}</span>
                  </div>

                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '8px',
                    background: 'rgba(0, 0, 0, 0.85)',
                    padding: '2px 6px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.58rem',
                    color: 'var(--text-dim)'
                  }}>
                    SCALE: 100m • GSD: 10m
                  </div>
                </div>
              </div>
            </div>

            {/* Evidence Analysis Breakdown Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px'
            }}>
              <div style={{ background: '#0a0f1d', border: '1px solid var(--border-dim)', padding: '10px 14px' }}>
                <div style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)', fontWeight: 'bold', marginBottom: '4px' }}>
                  BEFORE CONDITION (2024)
                </div>
                <p style={{ fontSize: '0.72rem', color: '#cbd5e1', margin: 0, lineHeight: 1.4 }}>
                  {alert.beforeDescription}
                </p>
              </div>

              <div style={{ background: '#0a0f1d', border: '1px solid var(--border-dim)', padding: '10px 14px' }}>
                <div style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: '#00f0ff', fontWeight: 'bold', marginBottom: '4px' }}>
                  AFTER CONDITION (2026)
                </div>
                <p style={{ fontSize: '0.72rem', color: '#cbd5e1', margin: 0, lineHeight: 1.4 }}>
                  {alert.afterDescription}
                </p>
              </div>

              <div style={{ background: '#0a0f1d', border: '1px solid var(--border-dim)', padding: '10px 14px' }}>
                <div style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: '#10b981', fontWeight: 'bold', marginBottom: '4px' }}>
                  OBSERVED PHYSICAL CHANGE
                </div>
                <p style={{ fontSize: '0.72rem', color: '#cbd5e1', margin: 0, lineHeight: 1.4 }}>
                  {alert.observedChange}
                </p>
              </div>
            </div>

            {/* Recommended Government Action Checklist */}
            <div style={{
              background: '#090e1a',
              border: '1px solid var(--border-dim)',
              padding: '12px 16px'
            }}>
              <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={14} />
                <span>RECOMMENDED GOVERNMENT VERIFICATION PROTOCOL</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {alert.recommendedAction.map((action, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.72rem', color: '#e2e8f0', lineHeight: 1.4 }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#00f0ff', marginTop: '6px', flexShrink: 0 }} />
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mandatory Statutory Legal Disclaimer */}
            <div style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              padding: '10px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <div style={{ color: '#ef4444', fontSize: '0.65rem', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>
                MANDATORY STATUTORY DISCLAIMER
              </div>
              <p style={{ fontSize: '0.68rem', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
                Hydra Positioning System provides satellite-based geospatial observations and AI-assisted change analysis. Satellite imagery alone cannot establish legal ownership, authorization, or illegality. This report is intended to support government review and field verification. Final determination should be made using applicable official records, regulations, and on-ground verification.
              </p>
            </div>

            {/* Copernicus & Authenticity Metadata */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.62rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-dim)',
              borderTop: '1px solid var(--border-dim)',
              paddingTop: '8px'
            }}>
              <span>Contains modified Copernicus Sentinel data [2024-2026] • Processed via Hydra Positioning System</span>
              <span>SHA-256 HASH: {alert.documentHash.substring(0, 20)}...</span>
            </div>

          </div>

        </div>
      </div>

      {/* Email Transmittal Dialog */}
      <EmailShareModal
        alert={alert}
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onLog={onLog}
      />
    </>
  );
};
