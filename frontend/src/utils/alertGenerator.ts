import type { GovernmentAlert, PresetDataset, GovernmentAlertCategory, GovernmentAlertSeverity } from '../types';

/**
 * Derives structured Government Alerts from detected change regions
 */
export function generateGovernmentAlertsFromDataset(dataset: PresetDataset): GovernmentAlert[] {
  const regions = dataset.analysisResult?.regions || [];
  const baseLat = dataset.coordinates[0];
  const baseLng = dataset.coordinates[1];
  const span = 0.055;

  const alerts: GovernmentAlert[] = [];

  const categoryMap: { [key: string]: { cat: GovernmentAlertCategory; sev: GovernmentAlertSeverity; prefix: string } } = {
    structure: {
      cat: 'Potential Unauthorized Construction',
      sev: 'HIGH',
      prefix: 'Structural Footprint'
    },
    vegetation: {
      cat: 'Vegetation Clearing',
      sev: 'MEDIUM',
      prefix: 'Canopy Displacement'
    },
    high_intensity: {
      cat: 'Potential Road Expansion',
      sev: 'HIGH',
      prefix: 'Transportation Corridor'
    }
  };

  regions.forEach((region, index) => {
    const num = (index + 101).toString().padStart(6, '0');
    const alertId = `HPS-2026-${num}`;
    const mapping = categoryMap[region.category] || { cat: 'Major Land-Use Change', sev: 'MEDIUM', prefix: 'Land Alteration' };

    const relX = region.x / 100;
    const relY = region.y / 100;
    const lat = baseLat + (0.5 - relY) * span;
    const lng = baseLng + (relX - 0.5) * span;

    let beforeDesc = 'Pre-existing mixed land use with baseline surface reflectance characteristics in 2024 Sentinel-2 optical observation.';
    let afterDesc = `Newly observed physical alteration in 2026 Sentinel-2 optical pass with significant spectral reflectance shift.`;
    let observedChange = `${mapping.prefix} of ~${region.areaSqMeters.toLocaleString()} m² identified via Otsu morphological differencing.`;

    if (region.category === 'structure') {
      beforeDesc = 'Unpaved peripheral / vacant land parcel with minimal structural density in 2024 pass.';
      afterDesc = `Dense concrete / masonry spectral signature identified across ${region.areaSqMeters.toLocaleString()} m² in 2026 pass.`;
      observedChange = `Potential unapproved concrete construction or high-density structural addition (${region.areaSqMeters.toLocaleString()} m²).`;
    } else if (region.category === 'vegetation') {
      beforeDesc = 'Dense photosynthetic green canopy with high baseline NDVI spectral index (NDVI > 0.65) in 2024.';
      afterDesc = `Drastic reduction in chlorophyll absorption signature, indicating tree canopy clearing in 2026 pass.`;
      observedChange = `Suspected green cover displacement / vegetation loss (~${Math.round(region.areaSqMeters / 22)} estimated trees).`;
    } else if (region.category === 'high_intensity') {
      beforeDesc = 'Narrow unpaved shoulder / secondary right-of-way corridor in 2024 pass.';
      afterDesc = `Linear asphalt / bituminous surfacing signature with high reflectance across ${region.areaSqMeters.toLocaleString()} m² in 2026.`;
      observedChange = `Potential arterial transportation network expansion / road widening without verified zoning setback.`;
    }

    const recommendedActions = [
      `1. Cross-reference centroid coordinates (${lat.toFixed(5)}° N, ${lng.toFixed(5)}° E) with local municipal GIS cadastral parcel records.`,
      `2. Verify whether official statutory building/environmental clearance permits were issued for this ${region.areaSqMeters.toLocaleString()} m² parcel.`,
      `3. Dispatch zonal revenue / municipal inspection officer for physical on-ground survey.`,
      `4. Verify right-of-way setbacks and compensatory afforestation compliance if applicable.`,
      `5. Update Hydra Positioning System alert status to VERIFIED or RESOLVED post field inspection.`
    ];

    alerts.push({
      id: alertId,
      title: `${mapping.cat} #${(index + 1).toString().padStart(2, '0')}`,
      category: mapping.cat,
      status: index === 0 ? 'UNDER REVIEW' : index === 1 ? 'FIELD VERIFICATION REQUIRED' : 'NEW',
      severity: region.areaSqMeters > 3000 ? 'HIGH' : mapping.sev,
      confidence: region.confidence,
      affectedAreaSqm: region.areaSqMeters,
      location: `${dataset.region} (Sector ${(index % 5) + 1})`,
      coordinates: [lat, lng],
      aoiName: dataset.name,
      beforeDate: `Dec ${dataset.beforeYear}`,
      afterDate: `May ${dataset.afterYear}`,
      satelliteSource: 'Copernicus Sentinel-2B MSI (Level-1C)',
      processingMethod: 'Otsu Morphological Differencing + Cloud Masking (10m GSD)',
      description: region.explanation,
      beforeDescription: beforeDesc,
      afterDescription: afterDesc,
      observedChange,
      recommendedAction: recommendedActions,
      regionRef: region,
      documentHash: `HPS-HASH-${alertId}-${region.areaSqMeters}`,
      createdAt: new Date().toISOString()
    });
  });

  return alerts;
}
