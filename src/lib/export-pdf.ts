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

  // Limite navigateur ~8192 px — scale adaptatif pour le formulaire long (578 mm)
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
    onclone: (_doc, clone) => {
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
  pdf.addImage(imgData, "JPEG", 0, 0, FORM_WIDTH_MM, FORM_HEIGHT_MM, undefined, "FAST");
  pdf.save(filename);
}

export function pdfFilename(prefix: string): string {
  const date = new Date().toISOString().slice(0, 10);
  return `hygieprint-${prefix}-${date}.pdf`;
}
