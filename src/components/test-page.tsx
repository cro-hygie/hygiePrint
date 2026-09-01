"use client";

import { FormTemplateBackground } from "@/components/form-template";
import { getPrinterModelInfo } from "@/lib/printer-models";
import { FORM_HEIGHT_MM, FORM_WIDTH_MM } from "@/lib/attestation-layout";
import type { PrinterConfig, Profession } from "@/lib/types";

interface TestPageProps {
  printer: PrinterConfig;
  simulatePaper?: boolean;
  profession?: Profession;
}

export function TestPage({
  printer,
  simulatePaper = false,
  profession = "kine",
}: TestPageProps) {
  const { marginX, marginY, model } = printer;
  const modelLabel = getPrinterModelInfo(model).label;

  return (
    <div
      className="test-page relative bg-white text-black"
      style={{
        width: `${FORM_WIDTH_MM}mm`,
        height: `${FORM_HEIGHT_MM}mm`,
        fontFamily: "Courier New, Courier, monospace",
        fontSize: "9pt",
      }}
    >
      {simulatePaper && <FormTemplateBackground profession={profession} />}
      <div className="absolute left-2 top-2 z-10 text-xs font-bold">
        PAGE DE TEST — hygiePrint
      </div>
      <div className="absolute right-2 top-2 z-10 text-xs">
        Marge X: {marginX} mm | Marge Y: {marginY} mm
      </div>

      {Array.from({ length: 25 }).map((_, i) => (
        <div key={`col-${i}`} className="absolute z-10" style={{ left: `${i * 10}mm`, top: 0, bottom: 0 }}>
          <div className="h-full border-l border-gray-400" />
          <span
            className="absolute -top-0 text-[7pt] text-gray-500"
            style={{ left: "1mm" }}
          >
            {i * 10}
          </span>
        </div>
      ))}

      {Array.from({ length: 15 }).map((_, i) => (
        <div key={`row-${i}`} className="absolute z-10" style={{ top: `${i * 10}mm`, left: 0, right: 0 }}>
          <div className="w-full border-t border-gray-400" />
          <span
            className="absolute left-0 text-[7pt] text-gray-500"
            style={{ top: "1mm" }}
          >
            {i * 10}
          </span>
        </div>
      ))}

      <div
        className="absolute z-10 border-2 border-red-500"
        style={{
          top: `${marginY}mm`,
          left: `${marginX}mm`,
          width: "20mm",
          height: "10mm",
        }}
      >
        <span className="absolute inset-0 flex items-center justify-center text-[8pt] text-red-600">
          ORIGINE
        </span>
      </div>

      <div
        className="absolute z-10 text-[8pt]"
        style={{ top: `${marginY + 15}mm`, left: `${marginX}mm` }}
      >
        <p>Alignez ce carré rouge avec le coin supérieur gauche</p>
        <p>de la zone d&apos;impression de votre formulaire pré-imprimé.</p>
        <p className="mt-2">Modèle: {modelLabel}</p>
        <p>Format: Std plié allemand ({FORM_WIDTH_MM} × {FORM_HEIGHT_MM} mm)</p>
      </div>

      <div
        className="absolute bottom-2 right-2 z-10 text-[8pt] text-gray-500"
      >
        {new Date().toLocaleDateString("fr-BE")}
      </div>
    </div>
  );
}
