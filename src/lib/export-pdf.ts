import { domToCanvas } from "modern-screenshot";
import { jsPDF } from "jspdf";
import { FORM_HEIGHT_MM, FORM_WIDTH_MM } from "./attestation-layout";

const PX_PER_MM = 3.7795275591;

export interface PdfExportOptions {
  /** Inclure le scan du formulaire (pour vérifier l'alignement sur papier blanc). */
  includeScan?: boolean;
}

/**
 * Export PDF WYSIWYG — capture l'élément visible (pas un clone) pour
 * conserver le scan chargé et les positions exactes de l'aperçu.
 */
export async function exportElementToPdf(
  element: HTMLElement,
  filename: string,
  options: PdfExportOptions = {},
): Promise<void> {
  const sheet =
    element.querySelector<HTMLElement>(".attestation-sheet, .test-page") ??
    element;

  const pixelWidth = Math.round(FORM_WIDTH_MM * PX_PER_MM);
  const pixelHeight = Math.round(FORM_HEIGHT_MM * PX_PER_MM);
  const scale = 4;

  const hidden: Array<{ el: HTMLElement; prev: string }> = [];

  const hide = (selector: string) => {
    sheet.querySelectorAll<HTMLElement>(selector).forEach((el) => {
      hidden.push({ el, prev: el.style.visibility });
      el.style.visibility = "hidden";
    });
  };

  if (!options.includeScan) {
    hide(".form-scan-background");
  }
  hide(".pdf-exclude");

  try {
    const canvas = await domToCanvas(sheet, {
      width: pixelWidth,
      height: pixelHeight,
      scale,
      backgroundColor: "#ffffff",
      timeout: 30000,
      style: {
        width: `${pixelWidth}px`,
        height: `${pixelHeight}px`,
        fontFamily: "Courier New, Courier, monospace",
        overflow: "hidden",
      },
    });

    const pdf = new jsPDF({
      unit: "mm",
      format: [FORM_WIDTH_MM, FORM_HEIGHT_MM],
      orientation: "portrait",
      compress: true,
    });

    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      0,
      0,
      FORM_WIDTH_MM,
      FORM_HEIGHT_MM,
      undefined,
      "FAST",
    );
    pdf.save(filename);
  } finally {
    for (const { el, prev } of hidden) {
      el.style.visibility = prev;
    }
  }
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
