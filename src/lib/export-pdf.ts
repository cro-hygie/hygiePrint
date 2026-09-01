import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
  ATTESTATION_FIELDS,
  FORM_HEIGHT_MM,
  FORM_WIDTH_MM,
  getFieldValue,
} from "./attestation-layout";
import type { AppSettings } from "./types";

const MM_TO_PT = 2.83465;

function parseFontSizePt(fontSize?: string): number {
  if (!fontSize) return 8;
  return parseFloat(fontSize.replace("pt", ""));
}

/**
 * Export PDF texte seul — mêmes coordonnées mm que l'aperçu écran.
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

    const fontSizePt = parseFontSizePt(field.fontSize);
    pdf.setFontSize(fontSizePt);

    const x = field.left + marginX;
    const y = field.top + marginY;
    const lineHeightMm = (fontSizePt / MM_TO_PT) * 1.15;
    const lines = value.split("\n");

    lines.forEach((line, index) => {
      const textY = y + index * lineHeightMm;
      const options: { maxWidth?: number; baseline?: "top" } = {
        baseline: "top",
      };
      if (field.width) options.maxWidth = field.width;
      pdf.text(line, x, textY, options);
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
      convertMmToPx(clonedDoc.body);
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

/** Convertit les styles mm → px pour html2canvas (calibration). */
function convertMmToPx(root: HTMLElement): void {
  const pxPerMm = 3.7795275591;
  root.querySelectorAll<HTMLElement>("*").forEach((el) => {
    const style = el.style;
    for (const prop of ["top", "left", "width", "height"] as const) {
      const val = style[prop];
      if (val.endsWith("mm")) {
        const mm = parseFloat(val);
        style[prop] = `${mm * pxPerMm}px`;
      }
    }
    if (style.fontSize.endsWith("pt")) {
      const pt = parseFloat(style.fontSize);
      style.fontSize = `${pt * (pxPerMm / MM_TO_PT)}px`;
    }
  });
  const sheet = root.querySelector<HTMLElement>(".attestation-sheet, .test-page");
  if (sheet) {
    sheet.style.width = `${FORM_WIDTH_MM * pxPerMm}px`;
    sheet.style.height = `${FORM_HEIGHT_MM * pxPerMm}px`;
  }
}

export function pdfFilename(prefix: string): string {
  const date = new Date().toISOString().slice(0, 10);
  return `hygieprint-${prefix}-${date}.pdf`;
}
