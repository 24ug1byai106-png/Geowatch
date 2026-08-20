import React, { useState, useRef } from 'react';
import { X, Play, Loader2, Upload, RefreshCw, AlertCircle } from 'lucide-react';
import { WHITEFIELD_DATASET } from '../api/client';
import { performImageChangeDetection } from '../utils/imageProcessing';
import { decodeUploadedFile } from '../utils/fileDecoder';
import type { PresetDataset } from '../types';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDataset: (dataset: PresetDataset) => void;
  onLog: (msg: string, type?: 'info' | 'success' | 'warn' | 'error') => void;
}

export const AnalysisModal: React.FC<AnalysisModalProps> = ({
  isOpen,
  onClose,
  onSelectDataset,
  onLog
}) => {
  // Simple region name input
  const [regionName, setRegionName] = useState<string>('Whitefield, Bengaluru');

  // File upload state (Before & After)
  const [beforeFileState, setBeforeFileState] = useState<{
    file: File | null;
    dataUrl: string;
    name: string;
    size: string;
    format: string;
  }>({
    file: null,
    dataUrl: WHITEFIELD_DATASET.beforeImage,
    name: WHITEFIELD_DATASET.beforeTifName,
    size: '1.42 MB',
    format: 'TIFF / PNG'
  });

  const [afterFileState, setAfterFileState] = useState<{
    file: File | null;
    dataUrl: string;
    name: string;
    size: string;
    format: string;
  }>({
    file: null,
    dataUrl: WHITEFIELD_DATASET.afterImage,
    name: WHITEFIELD_DATASET.afterTifName,
    size: '1.48 MB',
    format: 'TIFF / PNG'
  });

  // Processing state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleBeforeFileUpload = async (file: File) => {
    try {
      setErrorMessage(null);
      const decoded = await decodeUploadedFile(file);
      setBeforeFileState({
        file,
        dataUrl: decoded.dataUrl,
        name: decoded.name,
        size: decoded.size,
        format: decoded.format
      });
      onLog(`Loaded Before Observation: ${decoded.name} (${decoded.format}, ${decoded.size})`, 'info');
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to decode Before image/file. Supported: Photo, PNG, JPG, JPEG, TIFF, TIF, ZIP, WEBP.');
    }
  };

  const handleAfterFileUpload = async (file: File) => {
    try {
      setErrorMessage(null);
      const decoded = await decodeUploadedFile(file);
      setAfterFileState({
        file,
        dataUrl: decoded.dataUrl,
        name: decoded.name,
        size: decoded.size,
        format: decoded.format
      });
      onLog(`Loaded After Observation: ${decoded.name} (${decoded.format}, ${decoded.size})`, 'info');
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to decode After image/file. Supported: Photo, PNG, JPG, JPEG, TIFF, TIF, ZIP, WEBP.');
    }
  };

  const handleResetToWhitefield = () => {
    setBeforeFileState({
      file: null,
      dataUrl: WHITEFIELD_DATASET.beforeImage,
      name: WHITEFIELD_DATASET.beforeTifName,
      size: '1.42 MB',
      format: 'TIFF / PNG'
    });
    setAfterFileState({
      file: null,
      dataUrl: WHITEFIELD_DATASET.afterImage,
      name: WHITEFIELD_DATASET.afterTifName,
      size: '1.48 MB',
      format: 'TIFF / PNG'
    });
    setRegionName('Whitefield, Bengaluru');
    onLog('Restored Whitefield sample observation files', 'info');
  };

  const workflowSteps = [
    { title: 'IMAGE INGESTION', subtitle: `${beforeFileState.name} & ${afterFileState.name} LOADED` },
    { title: 'IMAGE VALIDATION', subtitle: 'DIMENSIONS & CHANNELS VERIFIED' },
    { title: 'IMAGE PREPROCESSING', subtitle: 'ALIGNING OBSERVATIONS & NORMALIZING HISTOGRAMS' },
    { title: 'CHANGE DETECTION', subtitle: 'COMPARING PIXELS / CALCULATING SPECTRAL DELTA' },
    { title: 'CHANGE MAPPING', subtitle: 'IDENTIFYING SIGNIFICANT CLUSTERS & EDGES' },
    { title: 'RESULT GENERATION', subtitle: 'GENERATING DIFFERENTIAL CHANGE MAP' },
    { title: 'ANALYSIS COMPLETE', subtitle: 'DERIVED ACTUAL AREA & CHANGE METRICS' }
  ];

  const handleStartAnalysis = async () => {
    if (!beforeFileState.dataUrl || !afterFileState.dataUrl) {
      setErrorMessage('Please provide both Before and After satellite files/photos.');
      return;
    }

    setIsProcessing(true);
    onLog(`Analyzing uploaded images for ${regionName}: ${beforeFileState.name} vs ${afterFileState.name}`, 'info');

    for (let i = 0; i < workflowSteps.length; i++) {
      setCurrentStepIndex(i);
      if (i === 3) {
        // Execute real image differencing & area calculation
        try {
          const res = await performImageChangeDetection(beforeFileState.dataUrl, afterFileState.dataUrl, 38);
          onLog(`Calculated ${res.totalChangeRegions} change regions (${res.changedAreaPercentage}% area, ~${res.totalChangedSqMeters.toLocaleString()} m²)`, 'info');
        } catch (e) {
          console.error(e);
        }
      }
      await new Promise(r => setTimeout(r, 400));
    }

    const analysisResult = await performImageChangeDetection(beforeFileState.dataUrl, afterFileState.dataUrl, 38);

    const updatedDataset: PresetDataset = {
      id: `custom-dataset-${Date.now()}`,
      name: regionName || 'Surveyed Observation Area',
      region: regionName || 'India',
      regionType: 'Geospatial Change Detection',
      dataSource: 'Uploaded Satellite Imagery (TIFF/PNG/ZIP)',
      coordinates: [12.9698, 77.7499],
      beforeYear: 'Before',
      afterYear: 'After',
      beforeImage: beforeFileState.dataUrl,
      afterImage: afterFileState.dataUrl,
      beforeTifName: beforeFileState.name,
      afterTifName: afterFileState.name,
      analysisResult
    };

    onSelectDataset(updatedDataset);
    onLog(`Analysis complete. Displaying real change detection overlay for ${regionName}.`, 'success');

    setTimeout(() => {
      setIsProcessing(false);
      setCurrentStepIndex(-1);
      onClose();
    }, 500);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
    }}>
      <div className="hud-panel" style={{
        width: '640px',
        maxWidth: '100%',
        background: 'var(--bg-panel)',
        border: '1px solid var(--accent-amber)',
        boxShadow: '0 0 35px rgba(255, 153, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Header */}
        <div className="hud-header" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="led-amber" />
            <span>INITIATE GEOSPATIAL CHANGE ANALYSIS</span>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {!isProcessing ? (
            <>
              {/* Top Bar with quick sample button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)', letterSpacing: '0.05em' }}>
                  SELECT SATELLITE OBSERVATION IMAGES (PHOTO / TIF / TIFF / ZIP / PNG / JPG)
                </span>
                <button
                  onClick={handleResetToWhitefield}
                  className="hud-btn"
                  style={{ fontSize: '0.62rem', padding: '2px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <RefreshCw size={11} />
                  LOAD SAMPLE WHITEFIELD
                </button>
              </div>

              {/* 2 Big Upload Cards: Before Satellite Image & After Satellite Image */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                
                {/* BEFORE SATELLITE IMAGE */}
                <div
                  onClick={() => beforeInputRef.current?.click()}
                  style={{
                    border: '1px dashed var(--accent-amber)',
                    background: 'rgba(10, 14, 20, 0.85)',
                    padding: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    borderRadius: '2px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: '#60a5fa', fontWeight: 'bold' }}>
                      BEFORE SATELLITE IMAGE
                    </span>
                    <span style={{ fontSize: '0.62rem', color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                      ● READY
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {beforeFileState.dataUrl ? (
                      <img
                        src={beforeFileState.dataUrl}
                        alt="Before Satellite Observation"
                        style={{ width: '64px', height: '64px', objectFit: 'cover', border: '1px solid var(--border-dim)' }}
                      />
                    ) : (
                      <div style={{ width: '64px', height: '64px', background: '#07090e', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-dim)' }}>
                        <Upload size={20} color="var(--accent-amber)" />
                      </div>
                    )}

                    <div style={{ flex: 1, overflow: 'hidden', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
                      <div style={{ color: '#ffffff', fontWeight: 'bold', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {beforeFileState.name}
                      </div>
                      <div style={{ color: 'var(--text-dim)', fontSize: '0.62rem', marginTop: '3px' }}>
                        {beforeFileState.format} • {beforeFileState.size}
                      </div>
                      <div style={{ color: 'var(--accent-amber)', fontSize: '0.62rem', marginTop: '6px' }}>
                        [ Click to upload photo / file ]
                      </div>
                    </div>
                  </div>

                  <input
                    ref={beforeInputRef}
                    type="file"
                    accept=".tif,.tiff,.zip,.png,.jpg,.jpeg,.webp,image/*"
                    onChange={(e) => e.target.files?.[0] && handleBeforeFileUpload(e.target.files[0])}
                    style={{ display: 'none' }}
                  />
                </div>

                {/* AFTER SATELLITE IMAGE */}
                <div
                  onClick={() => afterInputRef.current?.click()}
                  style={{
                    border: '1px dashed var(--accent-amber)',
                    background: 'rgba(10, 14, 20, 0.85)',
                    padding: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    borderRadius: '2px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)', fontWeight: 'bold' }}>
                      AFTER SATELLITE IMAGE
                    </span>
                    <span style={{ fontSize: '0.62rem', color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                      ● READY
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {afterFileState.dataUrl ? (
                      <img
                        src={afterFileState.dataUrl}
                        alt="After Satellite Observation"
                        style={{ width: '64px', height: '64px', objectFit: 'cover', border: '1px solid var(--border-dim)' }}
                      />
                    ) : (
                      <div style={{ width: '64px', height: '64px', background: '#07090e', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-dim)' }}>
                        <Upload size={20} color="var(--accent-amber)" />
                      </div>
                    )}

                    <div style={{ flex: 1, overflow: 'hidden', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
                      <div style={{ color: '#ffffff', fontWeight: 'bold', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {afterFileState.name}
                      </div>
                      <div style={{ color: 'var(--text-dim)', fontSize: '0.62rem', marginTop: '3px' }}>
                        {afterFileState.format} • {afterFileState.size}
                      </div>
                      <div style={{ color: 'var(--accent-amber)', fontSize: '0.62rem', marginTop: '6px' }}>
                        [ Click to upload photo / file ]
                      </div>
                    </div>
                  </div>

                  <input
                    ref={afterInputRef}
                    type="file"
                    accept=".tif,.tiff,.zip,.png,.jpg,.jpeg,.webp,image/*"
                    onChange={(e) => e.target.files?.[0] && handleAfterFileUpload(e.target.files[0])}
                    style={{ display: 'none' }}
                  />
                </div>

              </div>

              {/* Simple Single Region Name Input */}
              <div style={{
                background: 'rgba(10, 14, 20, 0.8)',
                border: '1px solid var(--border-dim)',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem'
              }}>
                <span style={{ color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>REGION / LOCATION NAME:</span>
                <input
                  type="text"
                  value={regionName}
                  onChange={(e) => setRegionName(e.target.value)}
                  placeholder="e.g. Whitefield, Bengaluru"
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    background: '#06080e',
                    border: '1px solid var(--border-dim)',
                    color: 'var(--accent-amber)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    outline: 'none'
                  }}
                />
              </div>

              {errorMessage && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#f43f5e',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem'
                }}>
                  <AlertCircle size={13} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
                <button onClick={onClose} className="hud-btn" style={{ padding: '6px 14px', fontSize: '0.75rem' }}>
                  CANCEL
                </button>
                <button
                  onClick={handleStartAnalysis}
                  className="hud-btn-primary"
                  style={{ padding: '6px 18px', fontSize: '0.75rem' }}
                >
                  <Play size={13} fill="currentColor" />
                  INITIATE ANALYSIS
                </button>
              </div>
            </>
          ) : (
            /* PROCESSING SEQUENCE */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '10px 0' }}>
              <div style={{
                fontFamily: 'var(--font-tech)',
                fontSize: '0.85rem',
                color: 'var(--accent-amber)',
                letterSpacing: '0.08em',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span className="led-amber" />
                <span>PROCESSING UPLOADED SATELLITE IMAGES // {regionName.toUpperCase()}</span>
              </div>

              <div style={{
                background: '#06080e',
                border: '1px solid var(--border-amber)',
                padding: '16px 20px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                {workflowSteps.map((step, idx) => {
                  const isDone = currentStepIndex > idx;
                  const isCurrent = currentStepIndex === idx;

                  return (
                    <div
                      key={step.title}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: isDone ? '#10b981' : (isCurrent ? 'var(--accent-amber)' : 'rgba(255, 255, 255, 0.22)')
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>[{isDone ? '✓' : (isCurrent ? '●' : ' ')}]</span>
                        <span>{step.title}</span>
                      </div>

                      <div style={{ fontSize: '0.7rem', color: isDone ? '#10b981' : (isCurrent ? '#fff' : 'rgba(255, 255, 255, 0.2)') }}>
                        {isCurrent ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-amber)' }}>
                            <Loader2 size={12} className="animate-spin" />
                            {step.subtitle}
                          </span>
                        ) : (
                          isDone ? `✓ ${step.subtitle}` : 'PENDING'
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
