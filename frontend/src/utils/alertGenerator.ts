import type { GovernmentAlert, PresetDataset, GovernmentAlertCategory, GovernmentAlertSeverity, GovernmentAlertStatus } from '../types';

/**
 * Derives realistic, structured Government Alerts from detected change regions
 */
/**
 * Resolves authentic geographic locality, ward, landmark, and local drivers
 * based on the spatial coordinate offset within the Sentinel-2 observation footprint
 */
function resolveGeographicSector(x: number, y: number) {
  // x: 0 (West) -> 100 (East)
  // y: 0 (North) -> 100 (South)

  if (y < 35 && x > 55) {
    return {
      sectorName: 'Kadugodi Industrial Hub & Container Depot',
      landmark: 'Kadugodi Industrial Area (Zone 4) • Ward 83',
      structCause: 'Large-span industrial manufacturing warehouse and logistics cold-storage addition.',
      structEffect: 'Addition of 8,400 m² non-permeable roof surface, substantial increase in surface stormwater peak volume.',
      vegCause: 'Scrub forest and uncultivated perimeter clearing for container storage yard.',
      vegEffect: 'Topsoil erosion during heavy monsoon rainfall, reduction of green buffer surrounding industrial zone.',
      roadCause: 'Freight transportation heavy-haul access road widening for container trucks.',
      roadEffect: 'Enhanced freight logistics throughput, increased heavy axle load road vibration, localized dust dispersion.'
    };
  } else if (y < 40 && x <= 55) {
    return {
      sectorName: 'KR Puram - Old Madras Road Transit Hub',
      landmark: 'KR Puram Junction & Outer Ring Road Interchange • Ward 52',
      structCause: 'Multi-story transit commercial complex and terminal passenger facilities.',
      structEffect: 'High peak-hour pedestrian & vehicular congestion, microclimate thermal increase (+2.4°C).',
      vegCause: 'Road median tree removal and shoulder clearance for metro viaduct integration.',
      vegEffect: 'Loss of 140 mature roadside shade trees, increased particulate matter (PM10) exposure for commuters.',
      roadCause: 'Arterial roadway expansion to accommodate metro feeder routes and bus rapid transit lanes.',
      roadEffect: 'Improved intersection throughput, elimination of natural roadside percolation ditch.'
    };
  } else if (y >= 35 && y < 70 && x > 60) {
    return {
      sectorName: 'Whitefield ITPL & EPIP Cyber Corridor',
      landmark: 'EPIP Zone Block 2 / Hope Farm Junction • Ward 84',
      structCause: 'Commercial multistory IT technology campus construction on vacant conversion parcel.',
      structEffect: 'Increased municipal water and power demand, local thermal heat island buildup (+2.9°C).',
      vegCause: 'Site clearing and ground excavation for corporate building basement parking.',
      vegEffect: 'Displacement of mature canopy trees (~280 trees), loss of urban bird nesting habitat.',
      roadCause: 'Secondary expressway connector linking ITPL Main Road with Kadugodi road network.',
      roadEffect: 'Reduced commuter bottle-necking, increased surface runoff requiring augmented stormwater culverts.'
    };
  } else if (y >= 35 && y < 70 && x <= 60) {
    return {
      sectorName: 'Mahadevapura Outer Ring Road Tech Belt',
      landmark: 'ORR Tech Corridor (Near Bagmane / Marathahalli) • Ward 82',
      structCause: 'High-density commercial office tower expansion with multi-level parking structure.',
      structEffect: 'High thermal heat emission, loss of 4,100 m² permeable soil, increased HVAC thermal exhaust.',
      vegCause: 'Shoulder clearing and tree cutting along expressway service road expansion.',
      vegEffect: 'Loss of ~220 canopy trees, reduction in natural noise attenuation buffer between highway and residences.',
      roadCause: 'Service lane widening and elevated corridor access ramp construction.',
      roadEffect: 'Increased traffic carrying capacity, complete paving of permeable roadside shoulder.'
    };
  } else if (y >= 70 && x <= 50) {
    return {
      sectorName: 'Bellandur Wetland Basin & Eco-Space Zone',
      landmark: 'Bellandur Lake Southern Catchment Buffer • Ward 150',
      structCause: 'Unauthorized concrete staging sheds and commercial vehicle depots near drainage channel.',
      structEffect: 'Severe encroachment on seasonal stormwater buffer, heightened downstream flood risk.',
      vegCause: 'Heavy earthmoving machinery grading and wetland buffer vegetation clearance.',
      vegEffect: 'Loss of natural marshland sponge filtration, groundwater recharge depletion, loss of wetland biodiversity.',
      roadCause: 'Unapproved heavy vehicle access road laid through wetland catchment margin.',
      roadEffect: 'Soil compaction in wetland zone, disruption of natural stormwater inflow paths to lake.'
    };
  } else {
    return {
      sectorName: 'Varthur Lake Catchment & Gunjur Urban Fringe',
      landmark: 'Varthur Lake Peripheral Green Belt • Ward 149',
      structCause: 'High-rise residential housing development on agricultural-to-urban conversion parcel.',
      structEffect: 'Encroachment on lake 75m buffer regulation line, localized groundwater table drawdown.',
      vegCause: 'Riparian tree and shoreline vegetation removal for residential landscaping and boundary fencing.',
      vegEffect: 'Accelerated shoreline erosion, loss of lake breeze cooling effect, increased nutrient runoff into water body.',
      roadCause: 'Lake-perimeter ring road expansion linking Varthur with Sarjapur Road.',
      roadEffect: 'Enhanced inter-neighborhood connectivity, increased impervious surface along lake watershed.'
    };
  }
}

/**
 * Derives realistic, structured Government Alerts from detected change regions
 */
export function generateGovernmentAlertsFromDataset(dataset: PresetDataset): GovernmentAlert[] {
  const regions = dataset.analysisResult?.regions || [];
  const baseLat = dataset.coordinates[0];
  const baseLng = dataset.coordinates[1];
  const span = 0.045;

  const alerts: GovernmentAlert[] = [];

  regions.forEach((region, index) => {
    const num = (index + 101).toString().padStart(6, '0');
    const alertId = `HPS-2026-${num}`;

    const relX = region.x / 100;
    const relY = region.y / 100;
    const lat = baseLat + (0.5 - relY) * span;
    const lng = baseLng + (relX - 0.5) * span;

    // Authentic spatial resolution based on exact image position
    const geo = resolveGeographicSector(region.x, region.y);

    // Realistic Category Mapping
    let category: GovernmentAlertCategory = 'Potential Unauthorized Construction';
    let prefix = 'Structural Addition';
    let driverCause = geo.structCause;
    let civicImpactEffects = geo.structEffect;

    if (region.category === 'vegetation') {
      category = 'Vegetation Clearing';
      prefix = 'Canopy Deforestation';
      driverCause = geo.vegCause;
      civicImpactEffects = geo.vegEffect;
    } else if (region.category === 'high_intensity') {
      category = 'Potential Road Expansion';
      prefix = 'Transportation Corridor';
      driverCause = geo.roadCause;
      civicImpactEffects = geo.roadEffect;
    }

    // Realistic Severity Distribution
    let severity: GovernmentAlertSeverity = 'MEDIUM';
    if (region.areaSqMeters > 7500 || (region.category === 'vegetation' && region.areaSqMeters > 5500) || geo.sectorName.includes('Wetland') || geo.sectorName.includes('Catchment')) {
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

    let beforeDesc = `Pre-existing baseline land parcel recorded in ${dataset.beforeYear} Sentinel-2 observation pass.`;
    let afterDesc = `Substantial radiometric and spatial reflectance shift identified in ${dataset.afterYear} Sentinel-2 pass.`;
    let observedChange = `${prefix} of ~${region.areaSqMeters.toLocaleString()} m² identified via Otsu morphological differencing.`;

    if (region.category === 'structure') {
      beforeDesc = `Vacant / low-density land parcel in ${dataset.beforeYear} pass (NDVI ~0.36).`;
      afterDesc = `Dense concrete / masonry spectral reflectance signature across ${region.areaSqMeters.toLocaleString()} m² in ${dataset.afterYear} pass.`;
      observedChange = `Potential structural construction without verified setback authorization (${region.areaSqMeters.toLocaleString()} m²).`;
    } else if (region.category === 'vegetation') {
      const treesCount = Math.round(region.areaSqMeters / 22);
      beforeDesc = `Photosynthetic green canopy in ${dataset.beforeYear} (baseline NDVI > 0.68).`;
      afterDesc = `Significant reduction in chlorophyll absorption signature in ${dataset.afterYear} pass (NDVI dropped to ~0.19).`;
      observedChange = `Suspected green cover displacement / tree canopy clearing (~${treesCount} estimated trees).`;
    } else if (region.category === 'high_intensity') {
      beforeDesc = `Secondary unpaved shoulder corridor in ${dataset.beforeYear} observation.`;
      afterDesc = `Linear asphalt / bituminous surfacing signature with high reflectance across ${region.areaSqMeters.toLocaleString()} m² in ${dataset.afterYear}.`;
      observedChange = `Potential transportation corridor right-of-way expansion / road network widening.`;
    }

    const recommendedActions = [
      `1. Cross-reference centroid coordinates (${lat.toFixed(5)}° N, ${lng.toFixed(5)}° E) with BBMP / BDA cadastral parcel records for ${geo.landmark}.`,
      `2. Verify whether official statutory building or environmental clearance permits were issued for this ${region.areaSqMeters.toLocaleString()} m² parcel.`,
      `3. Dispatch zonal revenue / municipal inspection officer for on-ground physical inspection.`,
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
      location: geo.sectorName,
      specificLocation: geo.landmark,
      driverCause,
      civicImpactEffects,
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
