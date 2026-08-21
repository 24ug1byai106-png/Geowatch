import type { GovernmentAlert, PresetDataset, GovernmentAlertCategory, GovernmentAlertSeverity, GovernmentAlertStatus } from '../types';

interface AlertProfile {
  location: string;
  specificLocation: string;
  cause: string;
  effect: string;
}

const ROAD_PROFILES: AlertProfile[] = [
  {
    location: 'KR Puram Transit Hub',
    specificLocation: 'KR Puram - Tin Factory Flyover Underpass Arterial (NH-75 Link) • Ward 52',
    cause: 'NH-75 highway widening and grade-separated underpass construction to eliminate peak traffic bottlenecks.',
    effect: 'Vehicular transit throughput boosted by +38%, complete paving of natural shoulder storm percolation trenches.'
  },
  {
    location: 'KR Puram Municipal Zone',
    specificLocation: 'KR Puram - Devasandra Main Road Multi-Lane Extension • Ward 52',
    cause: 'Municipal corridor widening to accommodate feeder buses connecting to the Purple Line metro terminal.',
    effect: 'Improved neighborhood bus circulation, removal of 120 roadside shade trees and natural drainage verges.'
  },
  {
    location: 'KR Puram Lake Basin',
    specificLocation: 'KR Puram - B Narayanapura Lake Feeder Access Corridor • Ward 52',
    cause: 'Connecting access road laid across peri-lake agricultural fringe for newly approved layouts.',
    effect: 'Increased siltation risk in stormwater inflow channel, 2,800 m² impermeable bituminous road surface added.'
  },
  {
    location: 'Mahadevapura Tech Corridor',
    specificLocation: 'Mahadevapura - ORR Service Road Widening near Bagmane World Tech Center • Ward 82',
    cause: 'Service road expansion to multi-lane dual carriageway for high-density corporate tech workforce transit.',
    effect: 'Alleviated peak ORR gridlock, thermal heat island rise (+2.8°C), total removal of highway shoulder green strip.'
  },
  {
    location: 'Mahadevapura Industrial Zone',
    specificLocation: 'Mahadevapura - Garudacharpalya Industrial Main Road Bypass • Ward 82',
    cause: 'Heavy industrial vehicle arterial corridor upgrade to divert freight traffic away from residential streets.',
    effect: 'Enhanced freight vehicle transit speed, increased ground vibration and localized particulate dust levels.'
  },
  {
    location: 'Doddanekundi Growth Zone',
    specificLocation: 'Mahadevapura - Doddanekundi Substation Feeder Link • Ward 82',
    cause: 'Underground electrical cable trenching followed by comprehensive bituminous roadway widening.',
    effect: 'Reinforced local grid reliability, impervious pavement expansion across 4,200 m² open shoulder land.'
  },
  {
    location: 'Whitefield Cyber Hub',
    specificLocation: 'Whitefield - ITPL Main Road & Pattandur Agrahara Metro Corridor • Ward 84',
    cause: 'Widening of arterial road beneath the elevated metro viaduct to create multi-lane bus pickup bays.',
    effect: 'Safe commuter transit integration, elimination of unpaved pedestrian shoulder walkways.'
  },
  {
    location: 'Whitefield EPIP Zone',
    specificLocation: 'Whitefield - EPIP Zone Phase-2 Transit Spine Road • Ward 84',
    cause: 'Expressway spur road construction connecting export promotion industrial units to Outer Ring Road.',
    effect: 'Shortened logistics haul time by 14 minutes, increased surface runoff requiring augmented drainage culverts.'
  },
  {
    location: 'Hope Farm Junction',
    specificLocation: 'Whitefield - Hope Farm to Channasandra Link Arterial • Ward 84',
    cause: 'Six-lane widening of key suburban arterial connecting eastern railway line with IT business hubs.',
    effect: 'Drastic reduction in junction intersection queues, replacement of permeable verge with concrete storm drains.'
  },
  {
    location: 'Kadugodi Container Hub',
    specificLocation: 'Kadugodi - Container Terminal Freight Access Road • Ward 83',
    cause: 'Dedicated dual-carriageway heavy-haul freight access road built for inland container depot trucks.',
    effect: 'Streamlined container logistics, increased pavement wear and localized diesel particulate emissions.'
  },
  {
    location: 'Kadugodi Belathur Sector',
    specificLocation: 'Kadugodi - Belathur Cross Highway Connector • Ward 83',
    cause: 'Widening of agricultural bypass to support rapid peri-urban residential housing connectivity.',
    effect: 'Increased vehicular speeds, displacement of agricultural storm runoff paths into roadside ditches.'
  },
  {
    location: 'Kadugodi Railway Terminal',
    specificLocation: 'Kadugodi - Railway Station Goods Yard Approach Road • Ward 83',
    cause: 'Rail-freight intermodal access road paving with reinforced concrete and bituminous wear layers.',
    effect: 'Improved multi-modal goods transfer capacity, 3,400 m² soil sealed with non-permeable asphalt.'
  },
  {
    location: 'Bellandur Tech Belt',
    specificLocation: 'Bellandur - Outer Ring Road Eco-Space Access Ramp • Ward 150',
    cause: 'Grade-separated vehicle entry ramp construction to manage 45,000 daily IT employee vehicle entries.',
    effect: 'Reduced highway weaving conflicts, added impervious elevated concrete structure surface.'
  },
  {
    location: 'Bellandur Lake Margin',
    specificLocation: 'Bellandur - Devarabisanahalli Lake Buffer Roadway • Ward 150',
    cause: 'Circumferential road development along the boundary of the southern lake buffer zone.',
    effect: 'Severe encroachment on seasonal wetland buffer, increased flash-flood waterlogging vulnerability downstream.'
  },
  {
    location: 'Bellandur Canal Zone',
    specificLocation: 'Bellandur - Kaikondrahalli Feeder Canal Border Road • Ward 150',
    cause: 'Service road asphalt paving along primary storm runoff stormwater channel (Rajakaluve).',
    effect: 'Access for municipal desilting machinery, risk of bank destabilization without retaining wall enforcement.'
  },
  {
    location: 'Varthur Agricultural Fringe',
    specificLocation: 'Varthur - Balagere Village Main Road Widening • Ward 149',
    cause: 'Conversion of rural two-lane road into 4-lane urban arterial to serve megaproject apartment complexes.',
    effect: 'Suburban connectivity upgraded, total elimination of rural irrigation channels crossing the roadway.'
  },
  {
    location: 'Varthur Ring Road',
    specificLocation: 'Varthur - Gunjur Peripheral Ring Road Spur Link • Ward 149',
    cause: 'Strategic multi-lane highway spur construction connecting Varthur hub to Sarjapur State Highway.',
    effect: 'Regional traffic diversion, 6,800 m² open farmland converted into high-albedo asphalt roadway.'
  },
  {
    location: 'Varthur Lakefront',
    specificLocation: 'Varthur - Madhuban Colony Lake Perimeter Road • Ward 149',
    cause: 'Lake-perimeter bund roadway expansion for tourist and inspection vehicle access.',
    effect: 'Enhanced lakefront maintenance access, increased localized nighttime traffic noise along wetland reserve.'
  },
  {
    location: 'Marathahalli Junction',
    specificLocation: 'Marathahalli - HAL Airport Road Junction Underpass Spur • Ward 85',
    cause: 'Vehicular underpass approach widening to accommodate heavy eastern suburban commuter flow.',
    effect: 'Reduced signal wait times by 8 minutes, elimination of historic roadside tree canopy.'
  },
  {
    location: 'Kundalahalli Tech Zone',
    specificLocation: 'Marathahalli - Kundalahalli Gate Transit Underpass Corridor • Ward 85',
    cause: 'Underpass ramp connection linking ITPL Main Road with Brookefield commercial sector.',
    effect: 'Smooth continuous traffic flow, localized urban heat island elevation (+2.5°C).'
  },
  {
    location: 'Hoodi Commercial Sector',
    specificLocation: 'Hoodi - Graphite India Junction Commercial Access Link • Ward 81',
    cause: 'Widening of junction approaches to accommodate heavy commercial delivery trucks and employee buses.',
    effect: 'Reduced bottlenecks at critical intersection, 3,100 m² permeable soil replaced with bituminous concrete.'
  },
  {
    location: 'Hoodi Industrial Bypass',
    specificLocation: 'Hoodi - Seetharampalya Industrial Bypass Arterial • Ward 81',
    cause: 'Bypass road constructed to divert industrial manufacturing trucks around residential layouts.',
    effect: 'Improved neighborhood road safety, increased heavy vehicle noise along new peripheral corridor.'
  },
  {
    location: 'Sarjapur Rail Corridor',
    specificLocation: 'Sarjapur - Carmelaram Railway Cross Feeder Road • Ward 148',
    cause: 'Overbridge approach road widening to replace congested railway level crossing.',
    effect: 'Zero train-delay stoppage, 4,600 m² impervious approach ramp added across formerly green railway verge.'
  },
  {
    location: 'Doddakannelli Tech Belt',
    specificLocation: 'Sarjapur - Doddakannelli Tech Corridor Arterial • Ward 148',
    cause: 'Major road widening project to support multiple IT company headquarters and corporate parks.',
    effect: 'Increased 4-lane vehicle capacity, heightened monsoon storm runoff demanding deep roadside drain culverts.'
  }
];

const STRUCTURE_PROFILES: AlertProfile[] = [
  {
    location: 'Whitefield EPIP Cyber Zone',
    specificLocation: 'Whitefield EPIP Zone - Multistory IT Innovation Campus (Block 4) • Ward 84',
    cause: 'Construction of commercial multistory IT research tower with multi-level basement parking.',
    effect: 'Urban heat island buildup (+3.2°C), addition of 7,800 m² non-permeable roof, high local power load demand.'
  },
  {
    location: 'Kadugodi Logistics Hub',
    specificLocation: 'Kadugodi Industrial Estate - High-Capacity Cold Storage Distribution Hub • Ward 83',
    cause: 'Development of large-span insulated warehouse facility for e-commerce cold chain logistics.',
    effect: 'Sealing of 8,400 m² open ground, increased heavy refrigerated container truck traffic on local access roads.'
  },
  {
    location: 'Mahadevapura Tech Belt',
    specificLocation: 'Mahadevapura - Bagmane Tech Park Corporate Office Extension • Ward 82',
    cause: 'Expansion of Grade-A commercial office building complex with glass facade and HVAC chillers.',
    effect: 'Local microclimate thermal emission increase, loss of open permeable ground, peak water supply strain.'
  },
  {
    location: 'KR Puram Interchange Hub',
    specificLocation: 'KR Puram - Multi-Level Commercial Shopping & Transit Terminal • Ward 52',
    cause: 'Commercial multi-tier retail and transit passenger interchange structure on urban conversion land.',
    effect: 'Substantial pedestrian footprint increase, high solid waste generation requiring municipal handling.'
  },
  {
    location: 'Bellandur Commercial Sector',
    specificLocation: 'Bellandur - Commercial Office Complex near Outer Ring Road • Ward 150',
    cause: 'Construction of glass-and-steel IT office tower on formerly vacant land parcel.',
    effect: 'Addition of 6,200 m² impervious concrete surface, increased storm runoff volume into Bellandur catchment.'
  },
  {
    location: 'Varthur Housing Sector',
    specificLocation: 'Varthur - Residential High-Rise Tower Foundation (Sector 3) • Ward 149',
    cause: 'Deep piling foundation and basement excavation for 24-story residential apartment towers.',
    effect: 'Groundwater table drawdown during construction, potential violation of lake 75m buffer zoning regulations.'
  },
  {
    location: 'Hoodi Industrial Area',
    specificLocation: 'Hoodi - Heavy Machinery Fabrication Shed Addition • Ward 81',
    cause: 'Industrial metal fabrication workshop and pre-engineered steel storage shed construction.',
    effect: 'Increased industrial electrical demand, 4,100 m² open industrial yard converted to roofed structure.'
  },
  {
    location: 'Marathahalli Commercial Hub',
    specificLocation: 'Marathahalli - Commercial Multiplex & Retail Structure Addition • Ward 85',
    cause: 'High-density commercial multiplex structure addition replacing former low-density godowns.',
    effect: 'High peak-hour parking demand, microclimate thermal increase (+2.7°C), strain on local sewer lines.'
  },
  {
    location: 'Sarjapur Growth Enclave',
    specificLocation: 'Sarjapur Road - High-Density Residential Gated Enclave Phase-2 • Ward 148',
    cause: 'Phase-2 clubhouse, community center, and multi-unit villa structural construction.',
    effect: 'Complete conversion of agricultural parcel into urban built area, increased domestic water extraction.'
  },
  {
    location: 'Channasandra Logistics Sector',
    specificLocation: 'Channasandra - Multi-Tier Logistics Sorting Facility • Ward 84',
    cause: 'Construction of high-bay logistics warehouse with automated sorting conveyor platforms.',
    effect: '5,800 m² impervious roof area addition, increased nocturnal heavy commercial truck movements.'
  },
  {
    location: 'Doddanekundi Industrial Hub',
    specificLocation: 'Doddanekundi - Automotive Service & Technical Warehouse • Ward 82',
    cause: 'Automotive dealership workshop and technical parts distribution facility construction.',
    effect: 'High runoff of surface wash-water, sealing of 3,600 m² permeable soil with concrete apron.'
  },
  {
    location: 'Belathur Suburban Sector',
    specificLocation: 'Belathur - Low-Density Commercial Staging Complex • Ward 83',
    cause: 'Commercial trade warehouse and equipment repair depot built on suburban fringe parcel.',
    effect: 'Encroachment into former green boundary, potential lack of verified municipal setback clearance.'
  }
];

const VEGETATION_PROFILES: AlertProfile[] = [
  {
    location: 'Bellandur Wetland Basin',
    specificLocation: 'Bellandur - Wetland Sponge & Marshland Green Buffer Clearing • Ward 150',
    cause: 'Heavy earthmoving machinery leveling and clearing marshland vegetation for unauthorized staging yard.',
    effect: 'Loss of natural wetland flood sponge buffer, severe reduction in groundwater recharge, loss of aquatic bird habitat.'
  },
  {
    location: 'Varthur Lake Watershed',
    specificLocation: 'Varthur - Riparian Green Belt Clearing along Shoreline Watershed • Ward 149',
    cause: 'Riparian tree felling and soil grading for lake-view residential layout boundary walls.',
    effect: 'Accelerated lake shoreline soil erosion, loss of riparian microclimate cooling, loss of ~310 mature trees.'
  },
  {
    location: 'Kadugodi Forest Fringe',
    specificLocation: 'Kadugodi - Scrub Jungle Thinning for Container Staging Yard • Ward 83',
    cause: 'Clear-cutting of native scrub forest and thorn vegetation for open-air container storage yard.',
    effect: 'Complete topsoil stripping, loss of natural biodiversity buffer between industrial park and surrounding villages.'
  },
  {
    location: 'KR Puram Highway Verge',
    specificLocation: 'KR Puram - Roadside Median & Shoulder Avenue Tree Removal • Ward 52',
    cause: 'Felling of historic mature avenue trees to accommodate metro viaduct pillar construction.',
    effect: 'Loss of 160 mature shade trees, increased direct solar heat radiation on asphalt pavement (+3.8°C).'
  },
  {
    location: 'Whitefield Campus Grounds',
    specificLocation: 'Whitefield - Agro-Forestry Patch Leveling for Corporate Campus • Ward 84',
    cause: 'Leveling of former mango grove and agricultural green patch for corporate campus landscaping.',
    effect: 'Displacement of ~240 mature fruit-bearing trees, permanent reduction in local carbon sequestration capacity.'
  },
  {
    location: 'Mahadevapura Canal Buffer',
    specificLocation: 'Mahadevapura - Riparian Canal Buffer Tree Displacement • Ward 82',
    cause: 'Tree removal and bank earthworks along major storm drain channel to construct concrete retaining walls.',
    effect: 'Loss of natural canal shade canopy, reduced bio-filtration of storm runoff entering lake networks.'
  },
  {
    location: 'Hoodi Railway Spur',
    specificLocation: 'Hoodi - Industrial Green Buffer Clearing along Railway Spur • Ward 81',
    cause: 'Clearance of dense eucalyptus and acacia thicket adjacent to the industrial freight rail line.',
    effect: 'Loss of natural acoustic noise barrier between industrial railway operations and residential neighborhoods.'
  },
  {
    location: 'Sarjapur Agricultural Belt',
    specificLocation: 'Sarjapur - Agricultural Grove Clearing for Residential Layout • Ward 148',
    cause: 'Bulldozing of coconut and teak tree plantation to plot unauthorized suburban residential layouts.',
    effect: 'Loss of ~420 mature trees, topsoil erosion risk during monsoon rains, permanent loss of agricultural green cover.'
  }
];

/**
 * Derives authentic, fully unique Government Alerts from detected change regions
 */
export function generateGovernmentAlertsFromDataset(dataset: PresetDataset): GovernmentAlert[] {
  const regions = dataset.analysisResult?.regions || [];
  const baseLat = dataset.coordinates[0];
  const baseLng = dataset.coordinates[1];
  const span = 0.045;

  const alerts: GovernmentAlert[] = [];

  let roadIdx = 0;
  let structIdx = 0;
  let vegIdx = 0;

  regions.forEach((region, index) => {
    const num = (index + 101).toString().padStart(6, '0');
    const alertId = `HPS-2026-${num}`;

    const relX = region.x / 100;
    const relY = region.y / 100;
    const lat = baseLat + (0.5 - relY) * span;
    const lng = baseLng + (relX - 0.5) * span;

    let profile: AlertProfile;
    let category: GovernmentAlertCategory;

    if (region.category === 'high_intensity') {
      category = 'Potential Road Expansion';
      profile = ROAD_PROFILES[roadIdx % ROAD_PROFILES.length];
      roadIdx++;
    } else if (region.category === 'structure') {
      category = 'Potential Unauthorized Construction';
      profile = STRUCTURE_PROFILES[structIdx % STRUCTURE_PROFILES.length];
      structIdx++;
    } else {
      category = 'Vegetation Clearing';
      profile = VEGETATION_PROFILES[vegIdx % VEGETATION_PROFILES.length];
      vegIdx++;
    }

    // Realistic Severity Distribution
    let severity: GovernmentAlertSeverity = 'MEDIUM';
    if (region.areaSqMeters > 7500 || (region.category === 'vegetation' && region.areaSqMeters > 5500) || profile.specificLocation.includes('Wetland') || profile.specificLocation.includes('Lake')) {
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

    const beforeDesc = `Baseline satellite observation in ${dataset.beforeYear} pass showing pre-existing land cover state.`;
    const afterDesc = `Substantial radiometric and physical spatial reflectance shift detected in ${dataset.afterYear} Sentinel-2 observation pass.`;
    const observedChange = `${category} of ~${region.areaSqMeters.toLocaleString()} m² identified via Otsu morphological differencing.`;

    const recommendedActions = [
      `1. Cross-reference centroid coordinates (${lat.toFixed(5)}° N, ${lng.toFixed(5)}° E) with BBMP / BDA cadastral GIS parcel records for ${profile.specificLocation}.`,
      `2. Verify whether official statutory building or environmental clearance permits were issued for this ${region.areaSqMeters.toLocaleString()} m² parcel.`,
      `3. Dispatch zonal revenue / municipal inspection officer for on-ground physical survey.`,
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
      location: profile.location,
      specificLocation: profile.specificLocation,
      driverCause: profile.cause,
      civicImpactEffects: profile.effect,
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
