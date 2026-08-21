import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType, 
  AlignmentType 
} from 'docx';
import type { PresetDataset } from '../types';

/**
 * Generates a formal Microsoft Word (.docx) Earth Change Detection Report
 */
export async function generateChangeDetectionDocx(dataset: PresetDataset): Promise<Blob> {
  const result = dataset.analysisResult;
  const audit = result?.governmentAudit;

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Header / Brand Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "HYDRA POSITIONING SYSTEM",
                bold: true,
                size: 32,
                color: "00B4D8",
                font: "Calibri"
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "EARTH OBSERVATION & SATELLITE CHANGE DETECTION DOSSIER",
                bold: true,
                size: 20,
                color: "555555",
                font: "Calibri"
              })
            ]
          }),
          new Paragraph({ text: "" }),

          // Section 1: Executive Summary
          new Paragraph({
            text: "1. Executive Summary & Overview",
            heading: HeadingLevel.HEADING_1
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `This report summarizes multi-temporal satellite change detection performed by the Hydra Positioning System for `,
                font: "Calibri"
              }),
              new TextRun({
                text: `${dataset.name} (${dataset.region})`,
                bold: true,
                font: "Calibri"
              }),
              new TextRun({
                text: ` across the observation baseline of `,
                font: "Calibri"
              }),
              new TextRun({
                text: `${dataset.beforeYear} vs ${dataset.afterYear}.`,
                bold: true,
                font: "Calibri"
              })
            ]
          }),
          new Paragraph({ text: "" }),

          // Metadata Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Parameter", bold: true })] })],
                    width: { size: 35, type: WidthType.PERCENTAGE }
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Specification", bold: true })] })],
                    width: { size: 65, type: WidthType.PERCENTAGE }
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Target Location / AOI")] }),
                  new TableCell({ children: [new Paragraph(`${dataset.name}, ${dataset.region}`)] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Geographic Coordinates")] }),
                  new TableCell({ children: [new Paragraph(`${dataset.coordinates[0].toFixed(5)}°N, ${dataset.coordinates[1].toFixed(5)}°E`)] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Satellite Sensor")] }),
                  new TableCell({ children: [new Paragraph(dataset.dataSource)] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Observation Window")] }),
                  new TableCell({ children: [new Paragraph(`${dataset.beforeYear} vs ${dataset.afterYear}`)] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Ground Sampling Distance (GSD)")] }),
                  new TableCell({ children: [new Paragraph("10.0 meters / pixel (MSI Band B02, B03, B04, B08)")] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Surface Area Modified")] }),
                  new TableCell({ children: [new Paragraph(`${result?.changedAreaPercentage || 0}% (~${(result?.totalChangedSqMeters || 0).toLocaleString()} m²)`)] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Identified Change Contours")] }),
                  new TableCell({ children: [new Paragraph(`${result?.totalChangeRegions || 0} discrete regions`)] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Change Severity Classification")] }),
                  new TableCell({ children: [new Paragraph(result?.changeIntensityLabel || "Moderate")] })
                ]
              })
            ]
          }),
          new Paragraph({ text: "" }),

          // Section 2: AI Analytical Derivation
          new Paragraph({
            text: "2. AI Multimodal Analytical Explanation",
            heading: HeadingLevel.HEADING_1
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: result?.aiSummary || "Analysis completed based on multi-temporal radiometric differencing.",
                font: "Calibri"
              })
            ]
          }),
          new Paragraph({ text: "" }),

          // Section 3: Physical Metric Breakdown
          new Paragraph({
            text: "3. Physical Land-Use Metric Breakdown",
            heading: HeadingLevel.HEADING_1
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Metric", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Estimated Value", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Physical Footprint", bold: true })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Potential Built Structures")] }),
                  new TableCell({ children: [new Paragraph(`+${audit?.newBuildingsConstructed || result?.structuralCount || 0} structures`)] }),
                  new TableCell({ children: [new Paragraph(`~${(audit?.builtUpAreaSqm || (result?.structuralCount || 0) * 1200).toLocaleString()} m²`)] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Transportation Corridor Expansion")] }),
                  new TableCell({ children: [new Paragraph(`+${audit?.roadExpansionKm || 0} km`)] }),
                  new TableCell({ children: [new Paragraph(`~${(audit?.roadWidenedAreaSqm || 0).toLocaleString()} m²`)] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Vegetation & Canopy Clearing")] }),
                  new TableCell({ children: [new Paragraph(`~${audit?.treesFelledEstimated || (result?.vegetationCount || 0) * 150} trees`)] }),
                  new TableCell({ children: [new Paragraph(`~${(audit?.deforestedCanopySqm || (result?.vegetationCount || 0) * 2000).toLocaleString()} m²`)] })
                ]
              })
            ]
          }),
          new Paragraph({ text: "" }),

          // Section 4: Statutory Legal Disclaimer
          new Paragraph({
            text: "4. Statutory Legal Notice",
            heading: HeadingLevel.HEADING_1
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Hydra Positioning System provides satellite-based geospatial observations and AI-assisted change analysis. Satellite imagery alone cannot establish legal ownership, authorization, or illegality. This report is intended to support technical review and field verification. Final determinations should be corroborated with ground inspections and statutory records.",
                italics: true,
                size: 18,
                color: "666666"
              })
            ]
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Report generated on ${new Date().toLocaleString('en-IN')} | Copernicus Sentinel Data Attribution`,
                size: 16,
                color: "888888"
              })
            ]
          })
        ]
      }
    ]
  });

  return await Packer.toBlob(doc);
}
