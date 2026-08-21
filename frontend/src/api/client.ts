import type { AnalysisJob, GeoJsonCollection, AnalysisExplanation, PresetDataset } from '../types';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const SENTINEL_2024_2026_DATASET: PresetDataset = {
  id: 'bengaluru-sentinel-2024-2026',
  name: 'Bengaluru Metropolitan Corridor',
  region: 'Bengaluru, Karnataka, India',
  regionType: 'Metropolitan & Infrastructure Expansion',
  dataSource: 'Sentinel-2B MSI (Tile T43PGQ)',
  coordinates: [12.9716, 77.5946],
  beforeYear: '2024',
  afterYear: '2026',
  beforeImage: '/data/sentinel_2024_bengaluru.png',
  afterImage: '/data/sentinel_2026_bengaluru.png',
  beforeTifName: 'S2B_20241208_T43PGQ.jp2',
  afterTifName: 'S2B_20260512_T43PGQ.jp2',
  analysisResult: null
};

export const WHITEFIELD_DATASET: PresetDataset = {
  id: 'whitefield-bengaluru',
  name: 'Whitefield — IT & Urban Expansion',
  region: 'Bengaluru, Karnataka, India',
  regionType: 'Urban / Infrastructure Expansion',
  dataSource: 'Sentinel-2 L2A',
  coordinates: [12.9698, 77.7499],
  beforeYear: '2024',
  afterYear: '2025',
  beforeImage: '/data/whitefield_2024_preview.png',
  afterImage: '/data/whitefield_2025_preview.png',
  beforeTifName: 'whitefield_2024_optimized.tif',
  afterTifName: 'whitefield_2025_optimized.tif',
  analysisResult: null
};

export const GEOWATCH_DATASETS: PresetDataset[] = [
  SENTINEL_2024_2026_DATASET,
  WHITEFIELD_DATASET
];

export const apiClient = {
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch('http://localhost:8000/', { method: 'GET', signal: AbortSignal.timeout(2000) });
      return res.ok;
    } catch {
      return false;
    }
  },

  async uploadImage(file: File): Promise<{ id: string; file_path: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE_URL}/images/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);
    return res.json();
  },

  async startAnalysis(beforeImageId: string, afterImageId: string, locationId?: string): Promise<AnalysisJob> {
    const res = await fetch(`${API_BASE_URL}/analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        before_image_id: beforeImageId,
        after_image_id: afterImageId,
        location_id: locationId
      }),
    });
    if (!res.ok) throw new Error(`Analysis creation failed: ${res.statusText}`);
    return res.json();
  },

  async getAnalysisStatus(jobId: string): Promise<AnalysisJob> {
    const res = await fetch(`${API_BASE_URL}/analysis/${jobId}`);
    if (!res.ok) throw new Error(`Status check failed: ${res.statusText}`);
    return res.json();
  },

  async listAnalyses(): Promise<AnalysisJob[]> {
    const res = await fetch(`${API_BASE_URL}/analysis?skip=0&limit=50`);
    if (!res.ok) throw new Error(`List analysis failed: ${res.statusText}`);
    return res.json();
  },

  async getAnalysisMap(jobId: string): Promise<GeoJsonCollection> {
    const res = await fetch(`${API_BASE_URL}/analysis/${jobId}/map`);
    if (!res.ok) throw new Error(`Map data fetch failed: ${res.statusText}`);
    return res.json();
  },

  async getAnalysisExplanation(jobId: string): Promise<AnalysisExplanation> {
    const res = await fetch(`${API_BASE_URL}/analysis/${jobId}/explanation`);
    if (!res.ok) throw new Error(`Explanation fetch failed: ${res.statusText}`);
    return res.json();
  },

  async getAnalysisReport(jobId: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/reports/${jobId}`);
    if (!res.ok) throw new Error(`Report fetch failed: ${res.statusText}`);
    return res.json();
  },

  async getLocationTimeline(locationId: string): Promise<AnalysisJob[]> {
    const res = await fetch(`${API_BASE_URL}/timeline/${locationId}`);
    if (!res.ok) throw new Error(`Timeline fetch failed: ${res.statusText}`);
    return res.json();
  }
};
