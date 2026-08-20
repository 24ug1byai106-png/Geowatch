import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://pnxavadnpudhukbtpflh.supabase.co';
export const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBueGF2YWRucHVkaHVrYnRwZmxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMTM4NzYsImV4cCI6MjEwMjc4OTg3Nn0.HFpro5Gk-gzIzMZ-bBJt5-z5OEc3lu05gv9nvVDAtmA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function saveAnalysisToSupabase(analysisData: {
  jobCode: string;
  locationName: string;
  beforeYear: string;
  afterYear: string;
  changePercentage: number;
  totalAreaSqm: number;
  structuresCount: number;
  vegetationCount: number;
  explanation: string;
  regions: any[];
}) {
  try {
    const { data, error } = await supabase
      .from('analysis_jobs')
      .insert([
        {
          job_code: analysisData.jobCode,
          location_name: analysisData.locationName,
          change_percentage: analysisData.changePercentage,
          total_area_sqm: analysisData.totalAreaSqm,
          structures_count: analysisData.structuresCount,
          vegetation_count: analysisData.vegetationCount,
          explanation: analysisData.explanation,
          status: 'COMPLETED'
        }
      ])
      .select();

    if (error) {
      console.warn('Supabase table save notice:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase sync notice:', err);
    return null;
  }
}
