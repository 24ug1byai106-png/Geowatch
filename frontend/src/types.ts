export type ChangeCategory = 'structure' | 'modified_structure' | 'removed_structure' | 'vegetation' | 'infrastructure' | 'water' | 'high_intensity';

export interface CalculatedChangeRegion {
  id: string;
  name: string;
  category: 'structure' | 'vegetation' | 'high_intensity';
  color: string;
  type: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage
  height: number; // percentage
  areaSqMeters: number;
  intensity: number;
  confidence: number;
  explanation: string;
}

export interface ImageAnalysisResult {
  totalChangeRegions: number;
  changedAreaPercentage: number;
  totalChangedSqMeters: number;
  changeIntensityLabel: 'Low' | 'Moderate' | 'High' | 'Severe';
  largestRegionName: string;
  largestRegionArea: number;
  changeMaskDataUrl: string;
  regions: CalculatedChangeRegion[];
  aiSummary: string;
  structuralCount: number;
  vegetationCount: number;
  highIntensityCount: number;
}

export interface GeoJsonFeature {
  type: "Feature";
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
  properties: {
    id: string;
    objectId: string;
    object_type: string;
    category: ChangeCategory;
    confidence: number;
    area: number;
    name?: string;
    status?: string;
    explanation?: string;
  };
}

export interface GeoJsonCollection {
  type: "FeatureCollection";
  features: GeoJsonFeature[];
}

export interface AnalysisJob {
  id: string;
  job_code: string;
  date: string;
  before_year: string;
  after_year: string;
  location_name: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  created_at: string;
  completed_at?: string;
  change_percentage?: number;
  explanation?: string;
  structures_count: number;
  vegetation_ha: number;
  infrastructure_km: number;
  polygons_count: number;
}

export interface AnalysisExplanation {
  explanation: string;
  change_percentage: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface PresetDataset {
  id: string;
  name: string;
  region: string;
  regionType: string;
  dataSource: string;
  coordinates: [number, number]; // [lat, lng]
  beforeYear: string;
  afterYear: string;
  beforeImage: string;
  afterImage: string;
  beforeTifName: string;
  afterTifName: string;
  analysisResult?: ImageAnalysisResult | null;
}
