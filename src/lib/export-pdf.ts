import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
  ATTESTATION_FIELDS,
  FORM_HEIGHT_MM,
  FORM_WIDTH_MM,
  getFieldValue,
} from "./attestation-layout";
import type { AppSettings } from "./types";

function parseFontSizePt(fontSize?: string): number {
  if (!fontSize) return 8;
  return parseFloat(fontSize.replace("pt", ""));
}

/**
 * Export PDF texte seul — placement direct en mm (fiable pour carnet pré-imprimé).
 * html2canvas ne gère pas les unités mm → tout finissait en haut à gauche.
 */
export function exportAttestationToPdf(
  settings: AppSettings,
  filename: string,
): void {
  const { printer, practitioner, attestation } = settings;
  const { marginX, marginY } = printer;

  const pdf = new jsPDF({
    unit: "mm",
    format: [FORM_WIDTH_MM, FORM_HEIGHT_MM],
    orientation: "portrait",
    compress: true,
  });

  pdf.setFont("courier", "normal");

  for (const field of ATTESTATION_FIELDS) {
    const value = getFieldValue(
      field.id,
      practitioner,
      attestation,
      printer.showAmountOnAttestation,
    );
    if (!value) continue;

    const fontSize = parseFontSizePt(field.fontSize);
    pdf.setFontSize(fontSize);

    const x = field.left + marginX;
    const y = field.top + marginY;
    const lineHeightMm = fontSize * 0.3527; // pt → mm
    const lines = value.split("\n");

    lines.forEach((line, index) => {
      const baselineY = y + lineHeightMm * (index + 1);
      if (field.width) {
        pdf.text(line, x, baselineY, { maxWidth: field.width });
      } else {
        pdf.text(line, x, baselineY);
      }
    });
  }

  pdf.save(filename);
}

/** Export page de calibration (capture visuelle). */
export async function exportElementToPdf(
  element: HTMLElement,
  filename: string,
): Promise<void> {
  const width = element.offsetWidth;
  const height = element.offsetHeight;
  if (width === 0 || height === 0) {
    throw new Error("La zone d'export est vide — rechargez la page.");
  }

  const maxCanvasDim = 8192;
  const scale = Math.min(2, maxCanvasDim / Math.max(width, height));

  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff",
    logging: false,
    imageTimeout: 20000,
    width,
    height,
    onclone: (clonedDoc) => {
      clonedDoc
        .querySelectorAll('style, link[rel="stylesheet"]')
        .forEach((node) => node.remove());
      clonedDoc.querySelectorAll(".form-scan-background").forEach((node) => node.remove());
    },
  });

  const pdf = new jsPDF({
    unit: "mm",
    format: [FORM_WIDTH_MM, FORM_HEIGHT_MM],
    orientation: "portrait",
    compress: true,
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.95);
  pdf.addImage(imgData, "JPEG", 0, 0, FORM_WIDTH_MM, FORM_HEIGHT_MM, undefined, "FAST");
  pdf.save(filename);
}

export function pdfFilename(prefix: string): string {
  const date = new Date().toISOString().slice(0, 10);
  return `hygieprint-${prefix}-${date}.pdf`;
}
