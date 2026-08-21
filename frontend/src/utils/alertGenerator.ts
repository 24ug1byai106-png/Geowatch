import type { GovernmentAlert, PresetDataset, GovernmentAlertCategory, GovernmentAlertSeverity, GovernmentAlertStatus } from '../types';

/**
 * Derives realistic, structured Government Alerts from detected change regions
 */
export function generateGovernmentAlertsFromDataset(dataset: PresetDataset): GovernmentAlert[] {
  const regions = dataset.analysisResult?.regions || [];
  const baseLat = dataset.coordinates[0];
  const baseLng = dataset.coordinates[1];
  const span = 0.045;

  const alerts: GovernmentAlert[] = [];

  const locations = [
    'Whitefield IT Corridor (Sector 2)',
    'Kadugodi Industrial Area (Zone 4)',
    'Outer Ring Road Expressway Corridor',
    'Bellandur Catchment Green Buffer',
    'Varthur Lake Peripheral Zone',
    'Hoodi Commercial Development Hub',
    'Hope Farm Transportation Junction',
    'Channasandra Residential Sector'
  ];

  regions.forEach((region, index) => {
    const num = (index + 101).toString().padStart(6, '0');
    const alertId = `HPS-2026-${num}`;

    // Realistic Category Mapping
    let category: GovernmentAlertCategory = 'Potential Unauthorized Construction';
    let prefix = 'Structural Addition';
    if (region.category === 'vegetation') {
      category = 'Vegetation Clearing';
      prefix = 'Canopy Deforestation';
    } else if (region.category === 'high_intensity') {
      category = 'Potential Road Expansion';
      prefix = 'Transportation Corridor';
    }

    // Realistic Severity Distribution (High: ~25%, Medium: ~55%, Low: ~20%)
    let severity: GovernmentAlertSeverity = 'MEDIUM';
    if (region.areaSqMeters > 7500 || (region.category === 'vegetation' && region.areaSqMeters > 5500)) {
      severity = 'HIGH';
    } else if (region.areaSqMeters < 3200) {
      severity = 'LOW';
    }

    // Realistic Status Distribution
    let status: GovernmentAlertStatus = 'NEW';
    const statusMod = index % 10;
    if (statusMod === 0 || statusMod === 5) {
      status = 'FIELD VERIFICATION REQUIRED';
    } else if (statusMod === 1 || statusMod === 6 || statusMod === 8) {
      status = 'UNDER REVIEW';
    } else if (statusMod === 2 || statusMod === 7) {
      status = 'NEW';
    } else if (statusMod === 3) {
      status = 'VERIFIED';
    } else if (statusMod === 4) {
      status = 'RESOLVED';
    }

    const relX = region.x / 100;
    const relY = region.y / 100;
    const lat = baseLat + (0.5 - relY) * span;
    const lng = baseLng + (relX - 0.5) * span;
    const locName = locations[index % locations.length];

    let beforeDesc = `Pre-existing baseline land parcel with minimal structural disturbance recorded in ${dataset.beforeYear} Sentinel-2 pass.`;
    let afterDesc = `Substantial radiometric and spatial reflectance shift identified in ${dataset.afterYear} Sentinel-2 observation pass.`;
    let observedChange = `${prefix} of ~${region.areaSqMeters.toLocaleString()} m² identified via Otsu morphological differencing.`;

    if (region.category === 'structure') {
      beforeDesc = `Unpaved vacant / low-density land parcel in ${dataset.beforeYear} observation (NDVI ~0.38).`;
      afterDesc = `Dense concrete / masonry spectral reflectance signature across ${region.areaSqMeters.toLocaleString()} m² in ${dataset.afterYear} pass.`;
      observedChange = `Potential structural construction without verified setback authorization (${region.areaSqMeters.toLocaleString()} m²).`;
    } else if (region.category === 'vegetation') {
      const treesCount = Math.round(region.areaSqMeters / 22);
      beforeDesc = `Dense photosynthetic green canopy in ${dataset.beforeYear} (baseline NDVI > 0.68).`;
      afterDesc = `Drastic reduction in chlorophyll absorption signature in ${dataset.afterYear} pass (NDVI dropped to ~0.19).`;
      observedChange = `Suspected green cover displacement / tree canopy clearing (~${treesCount} estimated trees).`;
    } else if (region.category === 'high_intensity') {
      beforeDesc = `Secondary unpaved shoulder corridor in ${dataset.beforeYear} observation.`;
      afterDesc = `Linear asphalt / bituminous surfacing signature with high reflectance across ${region.areaSqMeters.toLocaleString()} m² in ${dataset.afterYear}.`;
      observedChange = `Potential transportation corridor right-of-way expansion / road network widening.`;
    }

    const recommendedActions = [
      `1. Cross-reference centroid coordinates (${lat.toFixed(5)}° N, ${lng.toFixed(5)}° E) with local municipal GIS cadastral parcel records.`,
      `2. Verify whether statutory development approval or environmental clearance was issued for this ${region.areaSqMeters.toLocaleString()} m² parcel.`,
      `3. Dispatch zonal revenue / municipal inspection officer for physical on-ground survey.`,
      `4. Verify right-of-way setbacks and compensatory afforestation compliance if applicable.`,
      `5. Update Hydra Positioning System alert status to VERIFIED or RESOLVED post field inspection.`
    ];

    alerts.push({
      id: alertId,
      title: `${category} #${(index + 1).toString().padStart(2, '0')}`,
      category,
      status,
      severity,
      confidence: region.confidence,
      affectedAreaSqm: region.areaSqMeters,
      location: locName,
      coordinates: [lat, lng],
      aoiName: dataset.name,
      beforeDate: `Dec ${dataset.beforeYear}`,
      afterDate: `May ${dataset.afterYear}`,
      satelliteSource: dataset.dataSource,
      processingMethod: 'Otsu Morphological Differencing + Spectral Cloud Mask (10m GSD)',
      description: region.explanation,
      beforeDescription: beforeDesc,
      afterDescription: afterDesc,
      observedChange,
      recommendedAction: recommendedActions,
      regionRef: region,
      documentHash: `HPS-HASH-${alertId}-${region.areaSqMeters}`,
      createdAt: new Date(Date.now() - (index * 86400000 * 1.5)).toISOString()
    });
  });

  return alerts;
}
