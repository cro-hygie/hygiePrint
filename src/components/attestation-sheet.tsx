"use client";

import {
  ATTESTATION_FIELDS,
  FORM_HEIGHT_MM,
  FORM_WIDTH_MM,
  getFieldValue,
} from "@/lib/attestation-layout";
import type { AppSettings } from "@/lib/types";
import { FormTemplateBackground } from "@/components/form-template";

interface AttestationSheetProps {
  settings: AppSettings;
  showGrid?: boolean;
  simulatePaper?: boolean;
  className?: string;
}

export function AttestationSheet({
  settings,
  showGrid = false,
  simulatePaper = false,
  className = "",
}: AttestationSheetProps) {
  const { printer, practitioner, attestation } = settings;
  const offsetX = printer.marginX;
  const offsetY = printer.marginY;

  return (
    <div
      className={`attestation-sheet relative bg-white text-black ${className}`}
      style={{
        width: `${FORM_WIDTH_MM}mm`,
        height: `${FORM_HEIGHT_MM}mm`,
        fontFamily: "Courier New, Courier, monospace",
        fontSize: "10pt",
        lineHeight: 1.2,
      }}
    >
      {simulatePaper && (
        <FormTemplateBackground profession={practitioner.profession} />
      )}
      {showGrid && (
        <div className="pointer-events-none absolute inset-0 opacity-20">
          {Array.from({ length: 25 }).map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute top-0 bottom-0 border-l border-blue-400"
              style={{ left: `${i * 10}mm` }}
            />
          ))}
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute left-0 right-0 border-t border-blue-400"
              style={{ top: `${i * 10}mm` }}
            />
          ))}
        </div>
      )}

      <div
        className="absolute inset-0 border border-dashed border-gray-300 print:border-none"
        aria-hidden
      />

      {ATTESTATION_FIELDS.map((field) => {
        const value = getFieldValue(
          field.id,
          practitioner,
          attestation,
          printer.showAmountOnAttestation,
        );
        if (!value) return null;

        const isService = field.id.startsWith("service-");
        const serviceIdx = isService
          ? parseInt(field.id.split("-")[1]) - 1
          : -1;
        const service = attestation.services[serviceIdx];
        const strikethrough =
          isService && service && !service.used && printer.strikeUnusedServices;

        return (
          <div
            key={field.id}
            className={`absolute whitespace-pre-wrap ${simulatePaper ? "z-10" : ""}`}
            style={{
              top: `${field.top + offsetY}mm`,
              left: `${field.left + offsetX}mm`,
              width: field.width ? `${field.width}mm` : undefined,
              textDecoration: strikethrough ? "line-through" : undefined,
            }}
            title={field.label}
          >
            {value}
          </div>
        );
      })}
    </div>
  );
}
