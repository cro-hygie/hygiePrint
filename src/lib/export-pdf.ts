import { domToCanvas } from "modern-screenshot";
import { jsPDF } from "jspdf";
import {
  FORM_WIDTH_MM,
  PAGE1_HEIGHT_MM,
  PAGE2_HEIGHT_MM,
} from "./attestation-layout";

const PX_PER_MM = 3.7795275591;

export interface PdfExportOptions {
  includeScan?: boolean;
}

async function capturePage(
  pageEl: HTMLElement,
  includeScan: boolean,
): Promise<HTMLCanvasElement> {
  const hidden: Array<{ el: HTMLElement; prev: string }> = [];
  const hide = (selector: string) => {
    pageEl.querySelectorAll<HTMLElement>(selector).forEach((el) => {
      hidden.push({ el, prev: el.style.visibility });
      el.style.visibility = "hidden";
    });
  };

  if (!includeScan) hide(".form-scan-background");
  hide(".pdf-exclude");
  hide(".certificate-perforation");

  const heightMm = parseFloat(pageEl.style.height) || PAGE1_HEIGHT_MM;
  const pixelWidth = Math.round(FORM_WIDTH_MM * PX_PER_MM);
  const pixelHeight = Math.round(heightMm * PX_PER_MM);

  try {
    return await domToCanvas(pageEl, {
      width: pixelWidth,
      height: pixelHeight,
      scale: 4,
      backgroundColor: "#ffffff",
      timeout: 30000,
      style: {
        width: `${pixelWidth}px`,
        height: `${pixelHeight}px`,
        fontFamily: "Consolas, Courier New, monospace",
        overflow: "hidden",
      },
    });
  } finally {
    for (const { el, prev } of hidden) {
      el.style.visibility = prev;
    }
  }
}

/**
 * Export PDF 2 pages — même layout que hygie-soft (page 1 attestation + page 2 reçu).
 */
export async function exportElementToPdf(
  element: HTMLElement,
  filename: string,
  options: PdfExportOptions = {},
): Promise<void> {
  const sheet =
    element.querySelector<HTMLElement>(".attestation-sheet") ?? element;

  const pages = Array.from(
    sheet.querySelectorAll<HTMLElement>(".certificate-page"),
  ).slice(0, 2);

  if (pages.length === 0) {
    throw new Error("Aucune page à exporter.");
  }

  const heights = [PAGE1_HEIGHT_MM, PAGE2_HEIGHT_MM];

  const pdf = new jsPDF({
    unit: "mm",
    format: [FORM_WIDTH_MM, heights[0]],
    orientation: "portrait",
    compress: true,
  });

  for (let i = 0; i < pages.length; i++) {
    const pageEl = pages[i];
    const heightMm = heights[i] ?? PAGE2_HEIGHT_MM;

    pageEl.style.overflow = "hidden";
    const canvas = await capturePage(pageEl, options.includeScan ?? false);

    if (i > 0) {
      pdf.addPage([FORM_WIDTH_MM, heightMm], "portrait");
    }

    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      0,
      0,
      FORM_WIDTH_MM,
      heightMm,
      undefined,
      "SLOW",
    );
  }

  pdf.save(filename);
}

export async function exportAttestationToPdf(
  element: HTMLElement,
  filename: string,
  options: PdfExportOptions = {},
): Promise<void> {
  return exportElementToPdf(element, filename, options);
}

export function pdfFilename(prefix: string, suffix = ""): string {
  const date = new Date().toISOString().slice(0, 10);
  const extra = suffix ? `-${suffix}` : "";
  return `hygieprint-${prefix}${extra}-${date}.pdf`;
}
