import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { FORM_HEIGHT_MM, FORM_WIDTH_MM } from "./attestation-layout";

async function waitForImages(element: HTMLElement): Promise<void> {
  const images = Array.from(element.querySelectorAll("img"));
  await Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) {
            resolve();
            return;
          }
          img.onload = () => resolve();
          img.onerror = () => resolve();
        }),
    ),
  );
}

/** Retire les CSS Tailwind (oklch/lab) qui font planter html2canvas. */
function sanitizeCloneForExport(clonedDoc: Document): void {
  clonedDoc
    .querySelectorAll('style, link[rel="stylesheet"]')
    .forEach((node) => node.remove());

  // Export = texte seul (pas le scan — le carnet est déjà pré-imprimé)
  clonedDoc.querySelectorAll(".form-scan-background").forEach((node) => node.remove());

  const safeStyle = clonedDoc.createElement("style");
  safeStyle.textContent = `
    * {
      color: #000000 !important;
      background-color: transparent !important;
      border-color: #cccccc !important;
      outline-color: #000000 !important;
      box-shadow: none !important;
    }
    .attestation-sheet, .test-page {
      background-color: #ffffff !important;
      color: #000000 !important;
    }
    img {
      display: block !important;
      width: 100% !important;
      height: 100% !important;
      object-fit: fill !important;
    }
  `;
  clonedDoc.head.appendChild(safeStyle);
}

export async function exportElementToPdf(
  element: HTMLElement,
  filename: string,
): Promise<void> {
  await waitForImages(element);

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
    onclone: (clonedDoc, clone) => {
      sanitizeCloneForExport(clonedDoc);
      clone.querySelectorAll("img").forEach((img) => {
        img.style.display = "block";
      });
    },
  });

  const pdf = new jsPDF({
    unit: "mm",
    format: [FORM_WIDTH_MM, FORM_HEIGHT_MM],
    orientation: "portrait",
    compress: true,
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.95);
  pdf.addImage(
    imgData,
    "JPEG",
    0,
    0,
    FORM_WIDTH_MM,
    FORM_HEIGHT_MM,
    undefined,
    "FAST",
  );
  pdf.save(filename);
}

export function pdfFilename(prefix: string): string {
  const date = new Date().toISOString().slice(0, 10);
  return `hygieprint-${prefix}-${date}.pdf`;
}
