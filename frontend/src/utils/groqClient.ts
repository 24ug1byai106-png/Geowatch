export const GROQ_API_KEY = (import.meta as any).env?.VITE_GROQ_API_KEY || '';

export interface GroqExplanationParams {
  locationName: string;
  totalChangeRegions: number;
  changedAreaPercentage: number;
  totalChangedSqMeters: number;
  structuralCount: number;
  vegetationCount: number;
  highIntensityCount: number;
  changeIntensityLabel: string;
  largestRegionName: string;
  largestRegionArea: number;
}

/**
 * Generates an intelligent, authentic Earth-observation change detection analysis summary
 * using Groq's high-speed Llama 3.3 70B model.
 */
export async function generateGroqAiSummary(params: GroqExplanationParams): Promise<string> {
  const prompt = `
You are the GeoWatch Earth Observation AI Analysis Engine (ISRO/SIH satellite intelligence).
Analyze the following calculated satellite change detection metrics and write a concise, professional, 2-3 sentence technical summary of human-made changes and environmental impacts.

METRICS:
- Location / Target Region: ${params.locationName}
- Total Detected Change Regions: ${params.totalChangeRegions}
- Modified Surface Area: ${params.changedAreaPercentage}% (~${params.totalChangedSqMeters.toLocaleString()} m²)
- Potential Structural / Built-up Variations: ${params.structuralCount}
- Potential Vegetation / Canopy Shifts: ${params.vegetationCount}
- High-Intensity Surface Shifts: ${params.highIntensityCount}
- Overall Change Severity: ${params.changeIntensityLabel}
- Largest Contiguous Change Cluster: ${params.largestRegionName} (${params.largestRegionArea.toLocaleString()} m²)

INSTRUCTIONS:
- Be precise, authoritative, and professional in an aerospace/remote-sensing style.
- Highlight specific human activities (such as urban construction, road infrastructure, or canopy clearing).
- Output ONLY the 2-3 sentence paragraph. Do not include markdown bullet points or extra commentary.
`;

  try {
    const key = GROQ_API_KEY || (window as any).__GROQ_KEY__;
    if (key) {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are the GeoWatch ISRO-inspired AI Geospatial Change Detection expert.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 300
        })
      });

      if (response.ok) {
        const data = await response.json();
        const summary = data.choices?.[0]?.message?.content?.trim();
        if (summary) {
          return summary;
        }
      }
    }
  } catch (err) {
    console.warn('Groq API notice, using local fallback:', err);
  }

  // Fallback if network is unreachable
  return `Satellite differencing across ${params.locationName} revealed ${params.totalChangeRegions} distinct geographic change clusters over ${params.changedAreaPercentage}% of the surveyed footprint (~${params.totalChangedSqMeters.toLocaleString()} m²). The analysis identified ${params.structuralCount} potential structural variations and ${params.vegetationCount} canopy shifts, indicating active peri-urban development and land conversion.`;
}
