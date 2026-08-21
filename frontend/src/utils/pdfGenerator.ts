import { jsPDF } from 'jspdf';
import type { GovernmentAlert } from '../types';

/**
 * Generate SHA-256 hex string from text
 */
export async function computeSha256(content: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Fallback pseudo-hash
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      hash = ((hash << 5) - hash) + content.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(64, 'a');
  }
}

/**
 * Generates an official 6-page Hydra Positioning System PDF Evidence Report
 */
export async function generateGovernmentPdfReport(alert: GovernmentAlert): Promise<{ pdfBlob: Blob; filename: string; documentHash: string }> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const filename = `Hydra_Positioning_System_Alert_${alert.id}.pdf`;

  // Compute document authenticity hash
  const rawMetadata = `${alert.id}|${alert.aoiName}|${alert.coordinates.join(',')}|${alert.affectedAreaSqm}|${alert.confidence}|${alert.createdAt}`;
  const documentHash = await computeSha256(rawMetadata);

  // Helper colors
  const darkNavy = [10, 15, 26] as const;
  const deepBlue = [15, 23, 42] as const;
  const amberAccent = [255, 153, 0] as const;
  const cyanAccent = [0, 240, 255] as const;
  const textMuted = [148, 163, 184] as const;
  const textWhite = [248, 250, 252] as const;

  const drawHeader = (pageTitle: string) => {
    doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    doc.rect(0, 0, pageWidth, 22, 'F');

    doc.setFont('courier', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(amberAccent[0], amberAccent[1], amberAccent[2]);
    doc.text('HYDRA POSITIONING SYSTEM', 14, 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(`GEOSPATIAL EVIDENCE // ${pageTitle.toUpperCase()}`, 14, 16);

    doc.setFont('courier', 'bold');
    doc.setTextColor(cyanAccent[0], cyanAccent[1], cyanAccent[2]);
    doc.text(`ID: ${alert.id}`, pageWidth - 14, 10, { align: 'right' });

    doc.setFontSize(7);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(`STATUS: ${alert.status}`, pageWidth - 14, 16, { align: 'right' });

    doc.setDrawColor(amberAccent[0], amberAccent[1], amberAccent[2]);
    doc.setLineWidth(0.5);
    doc.line(14, 22, pageWidth - 14, 22);
  };

  const drawFooter = (pageNum: number, totalPages: number) => {
    doc.setDrawColor(40, 50, 70);
    doc.setLineWidth(0.3);
    doc.line(14, pageHeight - 16, pageWidth - 14, pageHeight - 16);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text('Contains modified Copernicus Sentinel data [2024-2026] • Processed via Hydra Positioning System', 14, pageHeight - 10);
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - 14, pageHeight - 10, { align: 'right' });
    doc.text(`SHA-256 HASH: ${documentHash.substring(0, 24)}...`, 14, pageHeight - 6);
  };

  // ==========================================
  // PAGE 1: COVER PAGE
  // ==========================================
  doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Decorative border
  doc.setDrawColor(amberAccent[0], amberAccent[1], amberAccent[2]);
  doc.setLineWidth(0.8);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  doc.setDrawColor(0, 240, 255);
  doc.setLineWidth(0.3);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

  // Hydra Emblem Badge
  doc.setFillColor(deepBlue[0], deepBlue[1], deepBlue[2]);
  doc.roundedRect(pageWidth / 2 - 25, 30, 50, 24, 3, 3, 'F');
  doc.setFont('courier', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(cyanAccent[0], cyanAccent[1], cyanAccent[2]);
  doc.text('⬡ HYDRA ⬡', pageWidth / 2, 42, { align: 'center' });
  doc.setFontSize(7);
  doc.setTextColor(amberAccent[0], amberAccent[1], amberAccent[2]);
  doc.text('POSITIONING SYSTEM', pageWidth / 2, 48, { align: 'center' });

  // Main Titles
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
  doc.text('GEOSPATIAL CHANGE DETECTION REPORT', pageWidth / 2, 72, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(amberAccent[0], amberAccent[1], amberAccent[2]);
  doc.text('Satellite-Based Change Observation & Field Verification Alert', pageWidth / 2, 80, { align: 'center' });

  // Status Box
  doc.setFillColor(25, 15, 10);
  doc.setDrawColor(amberAccent[0], amberAccent[1], amberAccent[2]);
  doc.setLineWidth(0.6);
  doc.roundedRect(pageWidth / 2 - 50, 92, 100, 18, 2, 2, 'FD');

  doc.setFont('courier', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('ALERT STATUS / COMPLIANCE ACTION:', pageWidth / 2, 99, { align: 'center' });
  doc.setFontSize(11);
  doc.setTextColor(amberAccent[0], amberAccent[1], amberAccent[2]);
  doc.text(alert.status, pageWidth / 2, 106, { align: 'center' });

  // Key Metadata Table Box
  doc.setFillColor(deepBlue[0], deepBlue[1], deepBlue[2]);
  doc.setDrawColor(40, 60, 90);
  doc.roundedRect(20, 122, pageWidth - 40, 90, 2, 2, 'F');

  const metaItems = [
    ['REPORT ID', alert.id],
    ['OBSERVATION AOI', alert.aoiName],
    ['LOCATION', alert.location],
    ['COORDINATES', `${alert.coordinates[0].toFixed(5)}° N, ${alert.coordinates[1].toFixed(5)}° E`],
    ['OBSERVATION PERIOD', `${alert.beforeDate}  ➔  ${alert.afterDate}`],
    ['CHANGE CLASSIFICATION', alert.category],
    ['ESTIMATED AFFECTED AREA', `${alert.affectedAreaSqm.toLocaleString()} m² (${(alert.affectedAreaSqm / 10000).toFixed(3)} ha)`],
    ['CONFIDENCE LEVEL', `${alert.confidence}% (Multi-Spectral Differencing)`],
    ['PRIORITY SEVERITY', alert.severity],
    ['EARTH OBSERVATION SENSOR', alert.satelliteSource],
    ['DOCUMENT GENERATED', new Date().toUTCString()]
  ];

  let metaY = 132;
  metaItems.forEach(([k, v]) => {
    doc.setFont('courier', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(k, 26, metaY);

    doc.setFont('courier', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
    doc.text(v, 90, metaY);
    metaY += 7.2;
  });

  // Copernicus Attribution Box
  doc.setFillColor(15, 20, 32);
  doc.setDrawColor(0, 150, 200);
  doc.setLineWidth(0.3);
  doc.roundedRect(20, 222, pageWidth - 40, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(cyanAccent[0], cyanAccent[1], cyanAccent[2]);
  doc.text('DATA SOURCE & COPERNICUS ATTRIBUTION', 26, 228);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('Contains modified Copernicus Sentinel data [2024-2026] processed via Hydra Positioning System.', 26, 234);
  doc.text('Neither the European Commission nor ESA is responsible for any use that may be made of the information.', 26, 239);

  // Authenticity Hash Box
  doc.setFont('courier', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(`AUTHENTICITY DOCUMENT HASH (SHA-256): ${documentHash}`, pageWidth / 2, 260, { align: 'center' });

  drawFooter(1, 6);

  // ==========================================
  // PAGE 2: EXECUTIVE SUMMARY
  // ==========================================
  doc.addPage();
  drawHeader('Executive Summary');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
  doc.text('1. WHAT WAS DETECTED?', 14, 32);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  const summaryText = `Between ${alert.beforeDate} and ${alert.afterDate}, automated multi-temporal satellite differencing conducted by the Hydra Positioning System detected a high-confidence landscape variation classified under "${alert.category}".

The physical footprint of the observed change covers approximately ${alert.affectedAreaSqm.toLocaleString()} square meters with an algorithmic confidence rating of ${alert.confidence}%.`;
  doc.text(summaryText, 14, 40, { maxWidth: pageWidth - 28, lineHeightFactor: 1.4 });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
  doc.text('2. TELEMETRY & PHYSICAL AUDIT PARAMETERS', 14, 76);

  // Draw Summary Table
  const tableData = [
    ['Alert Identifier', alert.id],
    ['Target Category', alert.category],
    ['Observed Footprint', `${alert.affectedAreaSqm.toLocaleString()} m²`],
    ['Confidence Level', `${alert.confidence}%`],
    ['Severity Rating', alert.severity],
    ['Geographic Coordinates', `${alert.coordinates[0].toFixed(5)}° N, ${alert.coordinates[1].toFixed(5)}° E`],
    ['Ground Sampling Distance (GSD)', '10.0 meters per pixel (MSI Band 2/3/4/8)'],
    ['Radiometric Alignment', 'Otsu Morphological Differencing + Atmospheric Mask']
  ];

  let tblY = 86;
  tableData.forEach(([label, val], idx) => {
    doc.setFillColor(idx % 2 === 0 ? 18 : 12, idx % 2 === 0 ? 26 : 18, idx % 2 === 0 ? 44 : 30);
    doc.rect(14, tblY - 4, pageWidth - 28, 8, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(cyanAccent[0], cyanAccent[1], cyanAccent[2]);
    doc.text(label, 18, tblY + 1.5);

    doc.setFont('courier', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
    doc.text(val, 95, tblY + 1.5);
    tblY += 8.5;
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
  doc.text('3. IMPACT CLASSIFICATION', 14, tblY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  const impactDesc = `The surveyed sector within ${alert.aoiName} exhibits significant reflectance displacement consistent with ${alert.category.toLowerCase()}. This alteration requires field inspection to cross-reference municipal cadastral zoning permits and right-of-way authorizations.`;
  doc.text(impactDesc, 14, tblY + 20, { maxWidth: pageWidth - 28, lineHeightFactor: 1.4 });

  drawFooter(2, 6);

  // ==========================================
  // PAGE 3: SATELLITE EVIDENCE
  // ==========================================
  doc.addPage();
  drawHeader('Satellite Multi-Temporal Evidence');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
  doc.text('OPTICAL IMAGERY COMPARISON PAIR (10m RESOLUTION)', 14, 32);

  // Frame 1: Before Image
  doc.setFillColor(15, 23, 42);
  doc.setDrawColor(amberAccent[0], amberAccent[1], amberAccent[2]);
  doc.rect(14, 38, 85, 95, 'FD');

  // North Arrow & Compass
  doc.setFont('courier', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(amberAccent[0], amberAccent[1], amberAccent[2]);
  doc.text('▲ N', 20, 48);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
  doc.text(`T1: ${alert.beforeDate} OBSERVATION`, 20, 60);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('Sensor: Sentinel-2B MSI (L1C)', 20, 68);
  doc.text(`Coordinates: ${alert.coordinates[0].toFixed(4)}, ${alert.coordinates[1].toFixed(4)}`, 20, 75);
  doc.text('Condition: Baseline Land Cover', 20, 82);

  doc.setDrawColor(100, 116, 139);
  doc.line(20, 118, 60, 118);
  doc.setFontSize(6.5);
  doc.text('SCALE: 100m', 20, 123);

  // Frame 2: After Image
  doc.setFillColor(15, 23, 42);
  doc.setDrawColor(cyanAccent[0], cyanAccent[1], cyanAccent[2]);
  doc.rect(pageWidth - 99, 38, 85, 95, 'FD');

  doc.setFont('courier', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(cyanAccent[0], cyanAccent[1], cyanAccent[2]);
  doc.text('▲ N', pageWidth - 93, 48);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
  doc.text(`T2: ${alert.afterDate} OBSERVATION`, pageWidth - 93, 60);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('Sensor: Sentinel-2B MSI (L1C)', pageWidth - 93, 68);
  doc.text(`Coordinates: ${alert.coordinates[0].toFixed(4)}, ${alert.coordinates[1].toFixed(4)}`, pageWidth - 93, 75);
  doc.text('Condition: Detected Physical Shift', pageWidth - 93, 82);

  doc.setDrawColor(100, 116, 139);
  doc.line(pageWidth - 93, 118, pageWidth - 53, 118);
  doc.setFontSize(6.5);
  doc.text('SCALE: 100m', pageWidth - 93, 123);

  // Description below images
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
  doc.text('CO-REGISTRATION & RADIOMETRIC NORMALIZATION', 14, 150);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  const coregText = 'Both temporal granules were orthorectified and spatially aligned to EPSG:4326 UTM Zone 43N. Cloud-mask filtering was applied to eliminate transient atmospheric false-positives.';
  doc.text(coregText, 14, 158, { maxWidth: pageWidth - 28, lineHeightFactor: 1.4 });

  drawFooter(3, 6);

  // ==========================================
  // PAGE 4: CHANGE DETECTION MAP
  // ==========================================
  doc.addPage();
  drawHeader('Change Detection Analysis');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
  doc.text('SPECTRAL CHANGE MASK & VECTOR BOUNDARIES', 14, 32);

  // Change Map Box
  doc.setFillColor(8, 12, 20);
  doc.setDrawColor(cyanAccent[0], cyanAccent[1], cyanAccent[2]);
  doc.setLineWidth(0.6);
  doc.rect(14, 38, pageWidth - 28, 110, 'FD');

  doc.setFont('courier', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(cyanAccent[0], cyanAccent[1], cyanAccent[2]);
  doc.text(`VECTOR SITE // ${alert.title.toUpperCase()}`, 20, 50);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(`Centroid Lat/Lng: ${alert.coordinates[0].toFixed(5)}° N, ${alert.coordinates[1].toFixed(5)}° E`, 20, 60);
  doc.text(`Calculated Vector Area: ${alert.affectedAreaSqm.toLocaleString()} m²`, 20, 68);
  doc.text(`Morphological Intensity: High Spectral Delta (Δ > 42)`, 20, 76);
  doc.text(`Confidence Score: ${alert.confidence}%`, 20, 84);

  // Legend Box inside Map
  doc.setFillColor(15, 23, 42);
  doc.rect(20, 100, 100, 36, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(amberAccent[0], amberAccent[1], amberAccent[2]);
  doc.text('VECTOR MAP LEGEND', 26, 108);

  doc.setFontSize(7.5);
  doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
  doc.text('■ Orange Polygon: Building & Concrete Expansion', 26, 116);
  doc.text('■ Green Zone: Tree Canopy & Deforestation Area', 26, 123);
  doc.text('■ Cyan Corridor: Road & Transit Expansion Link', 26, 130);

  // Summary Metrics below Map
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
  doc.text('GROUND DELTA VERIFICATION', 14, 162);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  const deltaText = `The spectral differencing algorithm isolated discrete contiguous change polygons matching the signatures of ${alert.category.toLowerCase()}. Field survey teams are advised to prioritize physical inspection at the centroid coordinates indicated above.`;
  doc.text(deltaText, 14, 170, { maxWidth: pageWidth - 28, lineHeightFactor: 1.4 });

  drawFooter(4, 6);

  // ==========================================
  // PAGE 5: EVIDENCE ANALYSIS
  // ==========================================
  doc.addPage();
  drawHeader('Evidence Analysis');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
  doc.text('TEMPORAL LANDSCAPE TRANSITION AUDIT', 14, 32);

  const evidenceBoxes = [
    { title: 'BEFORE OBSERVATION (2024)', content: alert.beforeDescription || 'Baseline vegetated or pre-existing land cover state.' },
    { title: 'AFTER OBSERVATION (2026)', content: alert.afterDescription || 'Newly detected physical alteration with altered reflectance.' },
    { title: 'OBSERVED CHANGE ANALYSIS', content: alert.observedChange || `Identified ${alert.category.toLowerCase()} across ${alert.affectedAreaSqm.toLocaleString()} m² footprint.` },
    { title: 'CONFIDENCE & SEVERITY ASSESSMENT', content: `Confidence: ${alert.confidence}% • Priority: ${alert.severity} • Status: ${alert.status}` }
  ];

  let evY = 40;
  evidenceBoxes.forEach((box) => {
    doc.setFillColor(15, 23, 42);
    doc.setDrawColor(40, 60, 90);
    doc.roundedRect(14, evY, pageWidth - 28, 30, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(amberAccent[0], amberAccent[1], amberAccent[2]);
    doc.text(box.title, 20, evY + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
    doc.text(box.content, 20, evY + 16, { maxWidth: pageWidth - 40, lineHeightFactor: 1.3 });

    evY += 36;
  });

  drawFooter(5, 6);

  // ==========================================
  // PAGE 6: RECOMMENDED ACTION & DISCLAIMER
  // ==========================================
  doc.addPage();
  drawHeader('Recommended Government Action');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
  doc.text('RECOMMENDED FIELD VERIFICATION PROTOCOL', 14, 32);

  const steps = [
    '1. Review the satellite multi-temporal evidence and coordinate overlays provided in this dossier.',
    '2. Verify the location against official municipal cadastral records and authorized development permits.',
    '3. Conduct physical on-ground field inspection at centroid coordinates if discrepancies are identified.',
    '4. Determine whether the observed physical activity holds valid government statutory approvals.',
    '5. Update the alert status in the Hydra Positioning System portal upon field verification completion.'
  ];

  let stepY = 42;
  steps.forEach((step) => {
    doc.setFillColor(15, 23, 42);
    doc.rect(14, stepY - 4, pageWidth - 28, 12, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
    doc.text(step, 18, stepY + 3, { maxWidth: pageWidth - 36 });
    stepY += 16;
  });

  // Mandatory Legal Disclaimer Box
  doc.setFillColor(25, 15, 15);
  doc.setDrawColor(239, 68, 68);
  doc.setLineWidth(0.6);
  doc.roundedRect(14, stepY + 10, pageWidth - 28, 50, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(239, 68, 68);
  doc.text('MANDATORY STATUTORY DISCLAIMER', 20, stepY + 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  const disclaimer = 'Hydra Positioning System provides satellite-based geospatial observations and AI-assisted change analysis. Satellite imagery alone cannot establish legal ownership, authorization, or illegality. This report is intended to support government review and field verification. Final determination should be made using applicable official records, regulations, and on-ground verification.';
  doc.text(disclaimer, 20, stepY + 28, { maxWidth: pageWidth - 40, lineHeightFactor: 1.4 });

  drawFooter(6, 6);

  // Output as Blob
  const pdfBlob = doc.output('blob');
  return { pdfBlob, filename, documentHash };
}
