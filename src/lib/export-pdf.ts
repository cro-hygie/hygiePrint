import { domToCanvas } from "modern-screenshot";
import { jsPDF } from "jspdf";
import { FORM_HEIGHT_MM, FORM_WIDTH_MM } from "./attestation-layout";

const PX_PER_MM = 3.7795275591;
const MM_TO_PT = 2.83465;

export interface PdfExportOptions {
  /** Inclure le scan du formulaire (pour vérifier l'alignement sur papier blanc). */
  includeScan?: boolean;
}

/**
 * Export PDF fidèle à l'aperçu écran (WYSIWYG).
 * Le texte est rasterisé aux mêmes positions que le rendu HTML — plus de décalage jsPDF.
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
  const scale = 3; // ~288 DPI — net sur imprimante matricielle

  const container = document.createElement("div");
  container.setAttribute("aria-hidden", "true");
  container.style.cssText =
    "position:fixed;left:-20000px;top:0;overflow:hidden;background:#fff;";

  const clone = sheet.cloneNode(true) as HTMLElement;
  container.appendChild(clone);
  document.body.appendChild(container);

  try {
  if (!options.includeScan) {
    clone
      .querySelectorAll(".form-scan-background")
      .forEach((node) => node.remove());
  }
  clone.querySelectorAll(".pdf-exclude").forEach((node) => node.remove());

  prepareCloneForCapture(clone, pixelWidth, pixelHeight);

  const canvas = await domToCanvas(clone, {
    width: pixelWidth,
    height: pixelHeight,
    scale,
    backgroundColor: "#ffffff",
    timeout: 30000,
  });

  const pdf = new jsPDF({
    unit: "mm",
    format: [FORM_WIDTH_MM, FORM_HEIGHT_MM],
    orientation: "portrait",
    compress: true,
  });

  const imgData = canvas.toDataURL("image/png");
  pdf.addImage(
    imgData,
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
    document.body.removeChild(container);
  }
}

/** Alias explicite pour l'attestation — même pipeline WYSIWYG. */
export async function exportAttestationToPdf(
  element: HTMLElement,
  filename: string,
  options: PdfExportOptions = {},
): Promise<void> {
  return exportElementToPdf(element, filename, options);
}

function prepareCloneForCapture(
  root: HTMLElement,
  pixelWidth: number,
  pixelHeight: number,
): void {
  convertMmToPx(root);
  root.style.boxSizing = "border-box";
  root.style.width = `${pixelWidth}px`;
  root.style.height = `${pixelHeight}px`;
  root.style.background = "#ffffff";
  root.style.overflow = "hidden";
  root.style.position = "relative";
  root.style.fontFamily = "Courier New, Courier, monospace";
}

/** Convertit les styles mm/pt inline → px pour la capture raster. */
function convertMmToPx(root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>("*").forEach((el) => {
    const style = el.style;
    for (const prop of ["top", "left", "width", "height", "right", "bottom"] as const) {
      const val = style[prop];
      if (val?.endsWith("mm")) {
        style[prop] = `${parseFloat(val) * PX_PER_MM}px`;
      }
    }
    if (style.fontSize?.endsWith("pt")) {
      const pt = parseFloat(style.fontSize);
      style.fontSize = `${pt * (PX_PER_MM / MM_TO_PT)}px`;
    }
  });
}

export function pdfFilename(prefix: string, suffix = ""): string {
  const date = new Date().toISOString().slice(0, 10);
  const extra = suffix ? `-${suffix}` : "";
  return `hygieprint-${prefix}${extra}-${date}.pdf`;
}
