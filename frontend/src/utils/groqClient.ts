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
  governmentAudit?: {
    newBuildingsConstructed: number;
    builtUpAreaSqm: number;
    roadExpansionKm: number;
    treesFelledEstimated: number;
    deforestedCanopySqm: number;
    zoningComplianceScore: number;
    unauthorizedEncroachmentsCount: number;
    actionableRecommendation: string;
    propertyTaxImpactEstimate: string;
  };
}

/**
 * Generates an intelligent, authentic Earth-observation change detection analysis summary
 * formatted for municipal/government oversight using Groq's high-speed Llama 3.3 70B model.
 */
export async function generateGroqAiSummary(params: GroqExplanationParams): Promise<string> {
  const audit = params.governmentAudit;
  const prompt = `
You are the GeoWatch ISRO & SIH Earth Observation Government AI Intelligence Engine.
Analyze the following multi-temporal satellite change detection metrics and write an authoritative, professional 2-3 sentence technical executive summary suitable for municipal planning, public administration, and environmental governance.

METRICS & GOVERNMENT AUDIT:
- Target Geographic Region: ${params.locationName}
- Total Detected Change Regions: ${params.totalChangeRegions}
- Modified Surface Area: ${params.changedAreaPercentage}% (~${params.totalChangedSqMeters.toLocaleString()} m²)
- New Buildings / Built-up Structures: ~${audit?.newBuildingsConstructed || params.structuralCount} units (~${(audit?.builtUpAreaSqm || 0).toLocaleString()} m²)
- Road & Transport Network Expansion: ~${audit?.roadExpansionKm || 0} km
- Estimated Tree Canopy Clearing / Trees Felled: ~${audit?.treesFelledEstimated || 0} trees (~${(audit?.deforestedCanopySqm || 0).toLocaleString()} m²)
- Zoning Compliance Score: ${audit?.zoningComplianceScore || 85}% (Unauthorized Encroachments: ~${audit?.unauthorizedEncroachmentsCount || 0})
- Estimated Property / Municipal Value Addition: ${audit?.propertyTaxImpactEstimate || 'Substantial'}
- Overall Change Severity: ${params.changeIntensityLabel}

INSTRUCTIONS:
- Specifically mention the structural expansion (buildings constructed), transportation widening, and environmental canopy impact.
- Maintain an authoritative civic audit and remote-sensing intelligence tone.
- Output ONLY the 2-3 sentence paragraph.
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
