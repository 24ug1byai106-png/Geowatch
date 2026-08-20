import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { HeroStatus } from './components/HeroStatus';
import { TemporalAnalysis } from './components/TemporalAnalysis';
import { DetectionResults } from './components/DetectionResults';
import { ObservationTelemetry } from './components/ObservationTelemetry';
import { GisMapAnalysis } from './components/GisMapAnalysis';
import { AiInsightsView } from './components/AiInsightsView';
import { GeoDataView } from './components/GeoDataView';
import { AnalyticsView } from './components/AnalyticsView';
import { ApiConsoleView } from './components/ApiConsoleView';
import { AnalysisModal } from './components/AnalysisModal';
import { ObjectDetailModal } from './components/ObjectDetailModal';
import { DatabaseModal } from './components/DatabaseModal';
import { LogsDrawer } from './components/LogsDrawer';
import type { LogEntry } from './components/LogsDrawer';
import { HelpModal } from './components/HelpModal';
import { WHITEFIELD_DATASET, apiClient } from './api/client';
import { performImageChangeDetection } from './utils/imageProcessing';
import type { PresetDataset, CalculatedChangeRegion } from './types';

export const App: React.FC = () => {
  // Screen state
  const [activeScreen, setActiveScreen] = useState<string>('analysis');
  const [selectedDataset, setSelectedDataset] = useState<PresetDataset>(WHITEFIELD_DATASET);
  const [selectedObject, setSelectedObject] = useState<CalculatedChangeRegion | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState<boolean>(false);
  const [isDatabaseModalOpen, setIsDatabaseModalOpen] = useState<boolean>(false);
  const [isLogsOpen, setIsLogsOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  // Diagnostic Logs
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'log-1',
      time: new Date().toLocaleTimeString(),
      message: 'GeoWatch Engine initialized. Target: Whitefield Sentinel-2 L2A observation dataset.',
      type: 'success'
    },
    {
      id: 'log-2',
      time: new Date().toLocaleTimeString(),
      message: 'Loaded Whitefield baseline (whitefield_2024_optimized.tif) and comparison (whitefield_2025_optimized.tif).',
      type: 'info'
    }
  ]);

  const addLog = (message: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    const newEntry: LogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      time: new Date().toLocaleTimeString(),
      message,
      type
    };
    setLogs(prev => [newEntry, ...prev]);
  };

  // Perform initial real image differencing on load
  useEffect(() => {
    const initAnalysis = async () => {
      try {
        const result = await performImageChangeDetection(
          WHITEFIELD_DATASET.beforeImage,
          WHITEFIELD_DATASET.afterImage,
          38
        );
        setSelectedDataset(prev => ({
          ...prev,
          analysisResult: result
        }));
        addLog(`Completed pixel differencing for Whitefield: detected ${result.totalChangeRegions} change regions (${result.changedAreaPercentage}% area modified).`, 'success');
      } catch (err) {
        console.error('Initial analysis error', err);
      }
    };
    initAnalysis();
  }, []);

  // Heartbeat backend check
  useEffect(() => {
    const checkBackend = async () => {
      const ok = await apiClient.checkHealth();
      setIsBackendConnected(ok);
      if (ok) {
        addLog('FastAPI GeoWatch backend connected on localhost:8000', 'success');
      }
    };
    checkBackend();
    const interval = setInterval(checkBackend, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleDownloadReport = () => {
    const result = selectedDataset.analysisResult;
    const reportData = {
      project: "GEOWATCH - AI GEOSPATIAL CHANGE DETECTION",
      target_region: selectedDataset.name,
      city: selectedDataset.region,
      data_source: selectedDataset.dataSource,
      coordinates: selectedDataset.coordinates,
      observation_files: {
        before_tif: selectedDataset.beforeTifName,
        after_tif: selectedDataset.afterTifName,
        before_year: selectedDataset.beforeYear,
        after_year: selectedDataset.afterYear
      },
      calculated_results: result ? {
        total_change_regions: result.totalChangeRegions,
        changed_area_percentage: result.changedAreaPercentage,
        total_changed_sq_meters: result.totalChangedSqMeters,
        change_intensity: result.changeIntensityLabel,
        largest_change_region: result.largestRegionName,
        largest_change_area_sqm: result.largestRegionArea,
        structural_shifts_count: result.structuralCount,
        vegetation_changes_count: result.vegetationCount,
        high_intensity_shifts_count: result.highIntensityCount,
        ai_summary: result.aiSummary,
        regions: result.regions
      } : "NOT ANALYZED"
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GEOWATCH_WHITEFIELD_REPORT_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addLog(`Exported calculated JSON report for ${selectedDataset.name}`, 'success');
  };

  // Mapping top nav tab to screen
  const getNavTab = () => {
    if (activeScreen === 'analysis') return 'ANALYSIS';
    if (activeScreen === 'change_map') return 'CHANGE MAP';
    if (activeScreen === 'ai_insights') return 'AI INSIGHTS';
    if (activeScreen === 'analytics') return 'ANALYTICS';
    return 'ANALYSIS';
  };

  const handleNavTabClick = (tab: string) => {
    if (tab === 'ANALYSIS') setActiveScreen('analysis');
    if (tab === 'CHANGE MAP') setActiveScreen('change_map');
    if (tab === 'AI INSIGHTS') setActiveScreen('ai_insights');
    if (tab === 'ANALYTICS') setActiveScreen('analytics');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-space)' }}>
      
      {/* Top Mission Navbar */}
      <Navbar
        activeTab={getNavTab()}
        setActiveTab={handleNavTabClick}
        isBackendConnected={isBackendConnected}
        onOpenLogs={() => setIsLogsOpen(true)}
        onOpenDatabase={() => setIsDatabaseModalOpen(true)}
      />

      {/* Main Body */}
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        
        {/* Left Sidebar */}
        <Sidebar
          activeScreen={activeScreen}
          setActiveScreen={(id) => {
            setActiveScreen(id);
            addLog(`Switched view to: ${id.toUpperCase()}`, 'info');
          }}
          onInitiateAnalysis={() => setIsAnalysisModalOpen(true)}
          onOpenLogs={() => setIsLogsOpen(true)}
          onOpenHelp={() => setIsHelpOpen(true)}
        />

        {/* Center Dashboard View Area */}
        <main style={{
          flex: 1,
          padding: '22px 24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}>
          
          {/* SCREEN 1 & 2: MAIN ANALYSIS / CHANGE MAP SCREEN */}
          {(activeScreen === 'analysis' || activeScreen === 'change_map') && (
            <>
              {/* Hero Banner & Status */}
              <HeroStatus
                currentRegionName={selectedDataset.name}
                isProcessing={false}
              />

              {/* Top Section: Temporal Analysis (Left) + Detection Results (Right) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1.85fr) minmax(320px, 1fr)',
                gap: '18px',
                alignItems: 'stretch'
              }}>
                <TemporalAnalysis
                  dataset={selectedDataset}
                  onSelectObject={(obj) => setSelectedObject(obj)}
                />
                <DetectionResults
                  dataset={selectedDataset}
                  onDownloadReport={handleDownloadReport}
                />
              </div>

              {/* Bottom Section: Observation Telemetry (Left) + AI Vision GIS Map (Right) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(300px, 1fr) minmax(0, 1.85fr)',
                gap: '18px',
                alignItems: 'stretch'
              }}>
                <ObservationTelemetry
                  coordinates={selectedDataset.coordinates}
                />
                <GisMapAnalysis
                  dataset={selectedDataset}
                  onSelectObject={(obj) => setSelectedObject(obj)}
                />
              </div>
            </>
          )}

          {/* SCREEN 3: AI INSIGHTS SCREEN */}
          {activeScreen === 'ai_insights' && (
            <AiInsightsView dataset={selectedDataset} />
          )}

          {/* SCREEN 4: GEO DATA REPOSITORY */}
          {activeScreen === 'geo_data' && (
            <GeoDataView dataset={selectedDataset} onLog={addLog} />
          )}

          {/* SCREEN 5: HISTORICAL ANALYTICS SCREEN */}
          {activeScreen === 'analytics' && (
            <AnalyticsView
              onSelectDataset={(ds) => {
                setSelectedDataset(ds);
                setActiveScreen('analysis');
              }}
              onLog={addLog}
            />
          )}

          {/* SCREEN 6: API SYSTEM INTEGRATION CONSOLE */}
          {activeScreen === 'api' && (
            <ApiConsoleView />
          )}

        </main>

      </div>

      {/* Modals & Sliding Drawers */}
      <AnalysisModal
        isOpen={isAnalysisModalOpen}
        onClose={() => setIsAnalysisModalOpen(false)}
        onSelectDataset={(ds) => {
          setSelectedDataset(ds);
          addLog(`Updated observation dataset: ${ds.name}`, 'info');
        }}
        onLog={addLog}
      />

      <ObjectDetailModal
        object={selectedObject}
        onClose={() => setSelectedObject(null)}
      />

      <DatabaseModal
        isOpen={isDatabaseModalOpen}
        onClose={() => setIsDatabaseModalOpen(false)}
      />

      <LogsDrawer
        isOpen={isLogsOpen}
        onClose={() => setIsLogsOpen(false)}
        logs={logs}
        onClearLogs={() => setLogs([])}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

    </div>
  );
};

export default App;
