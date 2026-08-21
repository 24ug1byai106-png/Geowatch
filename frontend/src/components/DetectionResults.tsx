import React, { useState } from 'react';
import { Sparkles, FileText, FileDown, Code2, Loader2, Play, Cpu } from 'lucide-react';
import type { PresetDataset } from '../types';
import { generateMissionPdfReport } from '../utils/pdfGenerator';
import { generateChangeDetectionDocx } from '../utils/docxGenerator';

interface DetectionResultsProps {
  dataset: PresetDataset;
  onDownloadReport: () => void;
  onRunAnalysis?: () => void;
  isAnalyzing?: boolean;
}

export const DetectionResults: React.FC<DetectionResultsProps> = ({ 
  dataset, 
  onDownloadReport,
  onRunAnalysis,
  isAnalyzing = false
}) => {
  const result = dataset.analysisResult;
  const isAnalyzed = !!result;
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [isGeneratingDocx, setIsGeneratingDocx] = useState<boolean>(false);

  const handleDownloadPdf = async () => {
    if (!isAnalyzed) return;
    setIsGeneratingPdf(true);
    try {
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
      console.error('PDF export error:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadDocx = async () => {
    if (!isAnalyzed) return;
    setIsGeneratingDocx(true);
    try {
      const docxBlob = await generateChangeDetectionDocx(dataset);
      const url = URL.createObjectURL(docxBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Hydra_Change_Report_${dataset.id}_${Date.now()}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('DOCX export error:', err);
    } finally {
      setIsGeneratingDocx(false);
    }
  };

  return (
    <div className="hud-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* Header */}
      <div className="hud-header">
        <span className="led-amber" />
        <span>CALCULATED CHANGE DETECTION RESULTS</span>
      </div>

      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        
        {/* Unanalyzed State Action Banner */}
        {!isAnalyzed && onRunAnalysis && (
          <div style={{
            background: 'rgba(0, 240, 255, 0.08)',
            border: '1px solid rgba(0, 240, 255, 0.35)',
            padding: '12px 14px',
            borderRadius: '2px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            boxShadow: '0 0 16px rgba(0, 240, 255, 0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#00f0ff', fontWeight: 'bold' }}>
              <Cpu size={15} />
              <span>AWAITING SATELLITE PIXEL DIFFERENCING</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.72rem', color: '#cbd5e1', fontFamily: 'var(--font-sans)', lineHeight: 1.4 }}>
              Click below to execute radiometric comparison, detect 34 changed corridors, and generate Groq Llama 3.3 AI intelligence.
            </p>
            <button
              onClick={onRunAnalysis}
              disabled={isAnalyzing}
              style={{
                background: '#00f0ff',
                color: '#040711',
                border: 'none',
                padding: '10px 16px',
                fontSize: '0.76rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 900,
                letterSpacing: '0.08em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                borderRadius: '2px',
                boxShadow: '0 0 16px rgba(0, 240, 255, 0.35)',
                transition: 'all 0.15s ease'
              }}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={14} className="spin" />
                  <span>ANALYZING MULTI-SPECTRAL BANDS...</span>
                </>
              ) : (
                <>
                  <Play size={14} fill="#040711" />
                  <span>EXECUTE CHANGE DETECTION ANALYSIS</span>
                </>
              )}
            </button>
          </div>
        )}

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

        {/* Multi-Format Export Actions: PDF, DOCX, JSON */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', letterSpacing: '0.06em' }}>
            EXPORT ANALYSIS DOSSIER (MULTI-FORMAT):
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
            
            {/* 1. PDF Report */}
            <button
              onClick={handleDownloadPdf}
              disabled={!isAnalyzed || isGeneratingPdf}
              style={{
                background: 'rgba(0, 240, 255, 0.12)',
                border: '1px solid #00f0ff',
                color: '#00f0ff',
                padding: '8px 4px',
                fontSize: '0.66rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                cursor: !isAnalyzed || isGeneratingPdf ? 'not-allowed' : 'pointer',
                opacity: !isAnalyzed ? 0.4 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                borderRadius: '2px',
                transition: 'all 0.15s ease'
              }}
            >
              {isGeneratingPdf ? <Loader2 size={12} className="animate-spin" /> : <FileDown size={12} />}
              <span>PDF</span>
            </button>

            {/* 2. DOCX Word Report */}
            <button
              onClick={handleDownloadDocx}
              disabled={!isAnalyzed || isGeneratingDocx}
              style={{
                background: 'rgba(96, 165, 250, 0.12)',
                border: '1px solid #60a5fa',
                color: '#60a5fa',
                padding: '8px 4px',
                fontSize: '0.66rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                cursor: !isAnalyzed || isGeneratingDocx ? 'not-allowed' : 'pointer',
                opacity: !isAnalyzed ? 0.4 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                borderRadius: '2px',
                transition: 'all 0.15s ease'
              }}
            >
              {isGeneratingDocx ? <Loader2 size={12} className="animate-spin" /> : <FileText size={12} />}
              <span>DOCX</span>
            </button>

            {/* 3. JSON Raw Telemetry */}
            <button
              onClick={onDownloadReport}
              disabled={!isAnalyzed}
              style={{
                background: 'rgba(255, 153, 0, 0.12)',
                border: '1px solid var(--accent-amber)',
                color: 'var(--accent-amber)',
                padding: '8px 4px',
                fontSize: '0.66rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                cursor: !isAnalyzed ? 'not-allowed' : 'pointer',
                opacity: !isAnalyzed ? 0.4 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                borderRadius: '2px',
                transition: 'all 0.15s ease'
              }}
            >
              <Code2 size={12} />
              <span>JSON</span>
            </button>

          </div>
        </div>

      </div>

    </div>
  );
};
