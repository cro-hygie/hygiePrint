import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { FORM_HEIGHT_MM, FORM_WIDTH_MM } from "./attestation-layout";

export async function exportElementToPdf(
  element: HTMLElement,
  filename: string,
): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 3,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  });

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [FORM_WIDTH_MM, FORM_HEIGHT_MM],
  });

  const imgData = canvas.toDataURL("image/png");
  pdf.addImage(imgData, "PNG", 0, 0, FORM_WIDTH_MM, FORM_HEIGHT_MM);
  pdf.save(filename);
}

export function pdfFilename(prefix: string): string {
  const date = new Date().toISOString().slice(0, 10);
  return `hygieprint-${prefix}-${date}.pdf`;
}
