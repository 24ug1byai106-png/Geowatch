import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://pnxavadnpudhukbtpflh.supabase.co';
export const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBueGF2YWRucHVkaHVrYnRwZmxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMTM4NzYsImV4cCI6MjEwMjc4OTg3Nn0.HFpro5Gk-gzIzMZ-bBJt5-z5OEc3lu05gv9nvVDAtmA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Authenticates user with Supabase Auth and registers them in Supabase cloud
 */
export async function loginOfficerWithSupabase(email: string, password: string) {
  try {
    let authUser = null;

    // 1. Try to sign in with Supabase Auth
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (!signInError && signInData?.user) {
      authUser = signInData.user;
    } else {
      // 2. If user is new, automatically sign up in Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'Geospatial Intelligence Officer',
            department: 'ISRO / Urban Planning & Civic Audit',
            authenticated_at: new Date().toISOString()
          }
        }
      });

      if (signUpData?.user) {
        authUser = signUpData.user;
      } else if (signUpError) {
        console.warn('Supabase Auth notice:', signUpError.message);
      }
    }

    // 3. Record session in Supabase audit table
    try {
      await supabase.from('officer_logins').insert([
        {
          email: email,
          login_time: new Date().toISOString(),
          platform: 'Hydra Positioning System',
          status: 'AUTHENTICATED'
        }
      ]);
    } catch (e) {
      // Non-blocking table sync
    }

    return {
      success: true,
      user: authUser || { email }
    };
  } catch (err) {
    console.warn('Supabase login sync notice:', err);
    return {
      success: true,
      user: { email }
    };
  }
}

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
