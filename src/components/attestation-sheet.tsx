"use client";

import type { ReactNode } from "react";
import {
  CONTENT_WIDTH_MM,
  FONT_BODY,
  FONT_TABLE,
  FORM_WIDTH_MM,
  getFieldValue,
  getServiceCell,
  PAGE1_HEIGHT_MM,
  PAGE2_HEIGHT_MM,
  SERVICE_ROWS,
  serviceSlotIndex,
  STATIC_FIELDS,
  TABLE_COL_RIGHT_OFFSET_MM,
  TABLE_LEFT_MM,
  TABLE_ROW_HEIGHT_MM,
  TABLE_SPAN_WIDTH_MM,
  TABLE_TOP_MM,
} from "@/lib/attestation-layout";
import type { AppSettings } from "@/lib/types";
import { FormTemplateBackground } from "@/components/form-template";

interface AttestationSheetProps {
  settings: AppSettings;
  showGrid?: boolean;
  showFieldMarkers?: boolean;
  simulatePaper?: boolean;
  className?: string;
}

const FONT = "Consolas, Courier New, Courier, monospace";

function FieldBlock({
  top,
  left,
  width,
  fontSize = FONT_BODY,
  multiline,
  children,
}: {
  top: number;
  left: number;
  width?: number;
  fontSize?: string;
  multiline?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`absolute z-10 text-black ${multiline ? "whitespace-pre-wrap" : "whitespace-nowrap"}`}
      style={{
        top: `${top}mm`,
        left: `${left}mm`,
        width: width ? `${width}mm` : undefined,
        fontSize,
        fontFamily: FONT,
        lineHeight: multiline ? 1.2 : 1,
      }}
    >
      {children}
    </div>
  );
}

function ServiceTable({
  attestation,
  offsetX,
  offsetY,
  showPlaceholders,
}: {
  attestation: AppSettings["attestation"];
  offsetX: number;
  offsetY: number;
  showPlaceholders: boolean;
}) {
  const renderColumn = (column: "l" | "r") => (
    <div
      className="inline-block align-top"
      style={{
        marginLeft: column === "r" ? `${TABLE_COL_RIGHT_OFFSET_MM}mm` : undefined,
      }}
    >
      {Array.from({ length: SERVICE_ROWS }, (_, i) => {
        const slot = serviceSlotIndex(column, i + 1);
        const { date, code } = getServiceCell(slot, attestation);
        const used = attestation.services[slot]?.used;
        return (
          <div
            key={`${column}-${i}`}
            style={{ height: `${TABLE_ROW_HEIGHT_MM}mm`, overflow: "hidden" }}
          >
            <span
              className="inline-block"
              style={{ width: `${TABLE_SPAN_WIDTH_MM}mm` }}
            >
              {date}
            </span>
            <span
              className="inline-block"
              style={{ width: `${TABLE_SPAN_WIDTH_MM}mm` }}
            >
              {code}
            </span>
            {!used && (
              <span className="sr-only">ligne vide</span>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div
      className="absolute z-10"
      style={{
        top: `${TABLE_TOP_MM + offsetY}mm`,
        left: `${TABLE_LEFT_MM + offsetX}mm`,
        fontSize: FONT_TABLE,
        fontFamily: FONT,
      }}
    >
      {renderColumn("l")}
      {renderColumn("r")}
    </div>
  );
}

function CertificatePage({
  page,
  settings,
  offsetX,
  offsetY,
  simulatePaper,
  showGrid,
  showFieldMarkers,
  heightMm,
}: {
  page: 1 | 2;
  settings: AppSettings;
  offsetX: number;
  offsetY: number;
  simulatePaper: boolean;
  showGrid: boolean;
  showFieldMarkers: boolean;
  heightMm: number;
}) {
  const { printer, practitioner, attestation } = settings;
  const fields = STATIC_FIELDS.filter((f) => f.page === page);

  return (
    <div
      className="certificate-page relative bg-white text-black"
      style={{
        width: `${FORM_WIDTH_MM}mm`,
        height: `${heightMm}mm`,
        fontFamily: FONT,
        fontSize: FONT_BODY,
      }}
    >
      {simulatePaper && page === 1 && <FormTemplateBackground />}

      {showGrid && (
        <div className="pdf-exclude pointer-events-none absolute inset-0 z-20 opacity-20">
          {Array.from({ length: 25 }).map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute top-0 bottom-0 border-l border-blue-400"
              style={{ left: `${i * 10}mm` }}
            />
          ))}
        </div>
      )}

      {page === 1 && (
        <ServiceTable
          attestation={attestation}
          offsetX={offsetX}
          offsetY={offsetY}
        />
      )}

      {showFieldMarkers &&
        fields.map((field) => (
          <div
            key={`m-${field.id}`}
            className="pdf-exclude pointer-events-none absolute z-30 size-1.5 rounded-full bg-red-500"
            style={{
              top: `${field.top + offsetY}mm`,
              left: `${field.left + offsetX}mm`,
            }}
          />
        ))}

      {fields.map((field) => {
        const value = getFieldValue(
          field.id,
          practitioner,
          attestation,
          printer.showAmountOnAttestation,
        );
        if (!value) return null;
        return (
          <FieldBlock
            key={field.id}
            top={field.top + offsetY}
            left={field.left + offsetX}
            width={field.width}
            fontSize={field.fontSize}
            multiline={field.multiline}
          >
            {value}
          </FieldBlock>
        );
      })}
    </div>
  );
}

export function AttestationSheet({
  settings,
  showGrid = false,
  showFieldMarkers = false,
  simulatePaper = false,
  className = "",
}: AttestationSheetProps) {
  const { printer } = settings;
  const offsetX = printer.marginX;
  const offsetY = printer.marginY;

  return (
    <div
      className={`attestation-sheet flex flex-col ${className}`}
      style={{ width: `${FORM_WIDTH_MM}mm` }}
    >
      <CertificatePage
        page={1}
        settings={settings}
        offsetX={offsetX}
        offsetY={offsetY}
        simulatePaper={simulatePaper}
        showGrid={showGrid}
        showFieldMarkers={showFieldMarkers}
        heightMm={PAGE1_HEIGHT_MM}
      />
      <div
        className="certificate-perforation border-t border-dashed border-gray-300 print:border-none"
        aria-hidden
      />
      <CertificatePage
        page={2}
        settings={settings}
        offsetX={offsetX}
        offsetY={offsetY}
        simulatePaper={false}
        showGrid={false}
        showFieldMarkers={showFieldMarkers}
        heightMm={PAGE2_HEIGHT_MM}
      />
    </div>
  );
}

export { CONTENT_WIDTH_MM };
