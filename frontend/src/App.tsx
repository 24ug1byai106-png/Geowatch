import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { HeroStatus } from './components/HeroStatus';
import { TemporalAnalysis } from './components/TemporalAnalysis';
import { DetectionResults } from './components/DetectionResults';
import { ChangeMapView } from './components/ChangeMapView';
import { AiInsightsView } from './components/AiInsightsView';
import { GeoDataView } from './components/GeoDataView';
import { AnalyticsView } from './components/AnalyticsView';
import { ApiConsoleView } from './components/ApiConsoleView';
import { AnalysisModal } from './components/AnalysisModal';
import { ObjectDetailModal } from './components/ObjectDetailModal';
import { DatabaseModal } from './components/DatabaseModal';
import { GovernmentAuditPanel } from './components/GovernmentAuditPanel';
import { AskGeoWatchModal } from './components/AskGeoWatchModal';
import { LogsDrawer } from './components/LogsDrawer';
import type { LogEntry } from './components/LogsDrawer';
import { HelpModal } from './components/HelpModal';
import { LandingHeroLogin } from './components/LandingHeroLogin';
import { SENTINEL_2024_2026_DATASET, apiClient } from './api/client';
import { performImageChangeDetection } from './utils/imageProcessing';
import { GovernmentMonitoringView } from './components/GovernmentMonitoringView';
import { GovernmentAlertDetailModal } from './components/GovernmentAlertDetailModal';
import { generateGovernmentAlertsFromDataset } from './utils/alertGenerator';
import type { PresetDataset, CalculatedChangeRegion, GovernmentAlert, GovernmentAlertStatus } from './types';

export const App: React.FC = () => {
  // Authentication & Officer Session State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [officerEmail, setOfficerEmail] = useState<string>('officer.bengaluru@isro.gov.in');

  // Screen state
  const [activeScreen, setActiveScreen] = useState<string>('analysis');
  const [selectedDataset, setSelectedDataset] = useState<PresetDataset>(SENTINEL_2024_2026_DATASET);
  const [selectedObject, setSelectedObject] = useState<CalculatedChangeRegion | null>(null);
  const [alerts, setAlerts] = useState<GovernmentAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<GovernmentAlert | null>(null);
  const [isAlertDetailOpen, setIsAlertDetailOpen] = useState<boolean>(false);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState<boolean>(false);
  const [isDatabaseModalOpen, setIsDatabaseModalOpen] = useState<boolean>(false);
  const [isAskAiOpen, setIsAskAiOpen] = useState<boolean>(false);
  const [isLogsOpen, setIsLogsOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  // Diagnostic Logs
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'log-1',
      time: new Date().toLocaleTimeString(),
      message: 'Hydra Positioning System Engine initialized. Target: Sentinel-2B (Tile T43PGQ) Bengaluru Metropolitan observation pair.',
      type: 'success'
    },
    {
      id: 'log-2',
      time: new Date().toLocaleTimeString(),
      message: 'Government monitoring queue & autonomous cloud masking filter engaged.',
      type: 'info'
    }
  ]);

  const addLog = (message: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    setLogs(prev => [
      ...prev,
      {
        id: `log-${Date.now()}-${Math.random()}`,
        time: new Date().toLocaleTimeString(),
        message,
        type
      }
    ]);
  };

  // Initial connection check
  useEffect(() => {
    const checkConnection = async () => {
      try {
        await apiClient.checkHealth();
      } catch {
        // Local mode
      }
    };
    checkConnection();
  }, []);

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const handleRunAnalysis = async (targetDataset: PresetDataset = selectedDataset) => {
    try {
      setIsAnalyzing(true);
      addLog(`Initiating multi-spectral differencing for ${targetDataset.name}...`, 'info');
      
      const result = await performImageChangeDetection(
        targetDataset.beforeImage,
        targetDataset.afterImage,
        38
      );

      const updatedDataset: PresetDataset = {
        ...targetDataset,
        analysisResult: result
      };

      setSelectedDataset(updatedDataset);
      const derivedAlerts = generateGovernmentAlertsFromDataset(updatedDataset);
      setAlerts(derivedAlerts);

      addLog(`Completed pixel differencing for ${targetDataset.name}: detected ${result.totalChangeRegions} change regions (${result.changedAreaPercentage}% area modified).`, 'success');
      addLog(`Generated ${derivedAlerts.length} government monitoring alerts requiring field review.`, 'info');
      setIsAnalyzing(false);
    } catch (err) {
      console.error('Analysis execution error:', err);
      setIsAnalyzing(false);
      addLog('Encountered an issue during image differencing pipeline.', 'error');
    }
  };

  const handleUpdateAlertStatus = (alertId: string, newStatus: GovernmentAlertStatus) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: newStatus } : a));
    if (selectedAlert && selectedAlert.id === alertId) {
      setSelectedAlert(prev => prev ? { ...prev, status: newStatus } : null);
    }
    addLog(`Updated compliance status for ${alertId} to ${newStatus}.`, 'info');
  };

  const handleDownloadReport = () => {
    const result = selectedDataset.analysisResult;
    const reportData = {
      project: "HYDRA POSITIONING SYSTEM - GEOSPATIAL CHANGE DETECTION",
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

  // Render Full Hero & Official Login Portal if unauthenticated
  if (!isAuthenticated) {
    return (
      <LandingHeroLogin
        onLoginSuccess={(email) => {
          setOfficerEmail(email);
          setIsAuthenticated(true);
          addLog(`Officer credentials authenticated: ${email}`, 'success');
        }}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-space)' }}>
      
      {/* Top Mission Navbar (Clean Header) */}
      <Navbar
        onOpenLogs={() => setIsLogsOpen(true)}
        userEmail={officerEmail}
        onLogout={() => {
          setIsAuthenticated(false);
          addLog('Officer logged out of portal', 'info');
        }}
      />

      {/* Main Body */}
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        
        {/* Left Sidebar (Houses all Mission Features & Tools) */}
        <Sidebar
          activeScreen={activeScreen}
          setActiveScreen={(id) => {
            setActiveScreen(id);
            addLog(`Switched view to: ${id.toUpperCase()}`, 'info');
          }}
          onInitiateAnalysis={() => setIsAnalysisModalOpen(true)}
          onOpenAskAi={() => {
            setIsAskAiOpen(true);
            addLog('Launched Ask Hydra AI Assistant.', 'info');
          }}
          onOpenLogs={() => setIsLogsOpen(true)}
          onOpenHelp={() => setIsHelpOpen(true)}
          alertCount={alerts.filter(a => a.status === 'NEW' || a.status === 'FIELD VERIFICATION REQUIRED').length}
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
          
          {/* SCREEN 1: MAIN ANALYSIS SCREEN */}
          {activeScreen === 'analysis' && (
            <>
              {/* Hero Banner with Satellite Video Background */}
              <HeroStatus
                onStartNewAnalysis={() => setIsAnalysisModalOpen(true)}
                onExploreMonitoring={() => setActiveScreen('monitoring')}
              />

              {/* Main Analysis Workspace: Temporal Change Viewer + Calculated Results */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1.85fr) minmax(320px, 1fr)',
                gap: '18px',
                alignItems: 'stretch',
                flex: 1
              }}>
                <TemporalAnalysis
                  dataset={selectedDataset}
                  onSelectObject={(obj) => setSelectedObject(obj)}
                  onUpdateDataset={(newDs) => {
                    setSelectedDataset(newDs);
                    addLog(`Updated satellite imagery for: ${newDs.name}`, 'info');
                  }}
                  onTriggerAnalysis={(targetDs) => handleRunAnalysis(targetDs || selectedDataset)}
                  isAnalyzing={isAnalyzing}
                />
                <DetectionResults
                  dataset={selectedDataset}
                  onDownloadReport={handleDownloadReport}
                  onRunAnalysis={() => handleRunAnalysis(selectedDataset)}
                  isAnalyzing={isAnalyzing}
                />
              </div>
            </>
          )}

          {/* SCREEN 2: DEDICATED CHANGE MAP & VECTOR POLYGON GIS SCREEN */}
          {activeScreen === 'change_map' && (
            <ChangeMapView
              dataset={selectedDataset}
              onSelectObject={(obj) => setSelectedObject(obj)}
            />
          )}

          {/* SCREEN 3: DEDICATED GOVERNMENT MONITORING & FIELD ALERTS SCREEN */}
          {activeScreen === 'monitoring' && (
            <GovernmentMonitoringView
              alerts={alerts}
              dataset={selectedDataset}
              onSelectAlert={(alert) => {
                setSelectedAlert(alert);
                setIsAlertDetailOpen(true);
              }}
              onOpenAskAi={() => setIsAskAiOpen(true)}
              onLog={addLog}
            />
          )}

          {/* SCREEN 4: DEDICATED CIVIC AUDIT SCREEN */}
          {(activeScreen === 'government' || activeScreen === 'ai_insights') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <GovernmentAuditPanel
                dataset={selectedDataset}
                onNavigateToInsights={() => {
                  setActiveScreen('government');
                }}
              />
              <AiInsightsView dataset={selectedDataset} />
            </div>
          )}

          {/* SCREEN 5: GEO DATA REPOSITORY */}
          {activeScreen === 'geo_data' && (
            <GeoDataView dataset={selectedDataset} onLog={addLog} />
          )}

          {/* SCREEN 6: HISTORICAL ANALYTICS SCREEN */}
          {activeScreen === 'analytics' && (
            <AnalyticsView
              onSelectDataset={(ds) => {
                setSelectedDataset(ds);
                setActiveScreen('analysis');
              }}
              onLog={addLog}
            />
          )}

          {/* SCREEN 7: API SYSTEM INTEGRATION CONSOLE */}
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
          if (ds.analysisResult) {
            setAlerts(generateGovernmentAlertsFromDataset(ds));
          }
          addLog(`Observation dataset loaded: ${ds.name}`, 'info');
        }}
        onLog={addLog}
      />

      <GovernmentAlertDetailModal
        alert={selectedAlert}
        dataset={selectedDataset}
        isOpen={isAlertDetailOpen}
        onClose={() => setIsAlertDetailOpen(false)}
        onUpdateStatus={handleUpdateAlertStatus}
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

      <AskGeoWatchModal
        isOpen={isAskAiOpen}
        onClose={() => setIsAskAiOpen(false)}
        dataset={selectedDataset}
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
