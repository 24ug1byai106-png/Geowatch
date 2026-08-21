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

export interface GovernmentCivicAudit {
  newBuildingsConstructed: number;
  builtUpAreaSqm: number;
  highDensityClusters: number;
  roadExpansionKm: number;
  roadWidenedAreaSqm: number;
  commercialInfrastructureCount: number;
  treesFelledEstimated: number;
  deforestedCanopySqm: number;
  greenCoverLossPercent: number;
  waterBodyShrinkageSqm: number;
  wetlandEncroachmentRisk: 'Low' | 'Moderate' | 'Critical';
  zoningComplianceScore: number;
  unauthorizedEncroachmentsCount: number;
  actionableRecommendation: string;
  propertyTaxImpactEstimate: string;
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
  governmentAudit: GovernmentCivicAudit;
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

export type GovernmentAlertStatus = 
  | 'NEW' 
  | 'UNDER REVIEW' 
  | 'FIELD VERIFICATION REQUIRED' 
  | 'VERIFIED' 
  | 'DISMISSED' 
  | 'RESOLVED';

export type GovernmentAlertSeverity = 'HIGH' | 'MEDIUM' | 'LOW';

export type GovernmentAlertCategory =
  | 'Potential Unauthorized Construction'
  | 'Potential Road Encroachment'
  | 'Potential Road Expansion'
  | 'Vegetation Clearing'
  | 'Potential Deforestation'
  | 'Potential Land Encroachment'
  | 'Water Body Encroachment'
  | 'New Construction'
  | 'Major Land-Use Change'
  | 'Infrastructure Expansion';

export interface GovernmentAlert {
  id: string; // e.g. HPS-2026-000124
  title: string;
  category: GovernmentAlertCategory;
  status: GovernmentAlertStatus;
  severity: GovernmentAlertSeverity;
  confidence: number;
  affectedAreaSqm: number;
  location: string;
  coordinates: [number, number];
  aoiName: string;
  beforeDate: string;
  afterDate: string;
  satelliteSource: string;
  processingMethod: string;
  description: string;
  beforeDescription: string;
  afterDescription: string;
  observedChange: string;
  recommendedAction: string[];
  regionRef?: CalculatedChangeRegion;
  documentHash: string;
  createdAt: string;
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

