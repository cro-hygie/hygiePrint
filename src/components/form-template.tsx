"use client";

import {
  FORM_HEIGHT_MM,
  FORM_MODEL,
  FORM_WIDTH_MM,
  PAGE1_HEIGHT_MM,
} from "@/lib/attestation-layout";

/** Scan G11 — partie haute (page 1 attestation) uniquement. */
export function FormTemplateBackground() {
  return (
    <div
      className="form-scan-background pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/forms/mod-g11-fr.png"
        alt=""
        style={{
          width: `${FORM_WIDTH_MM}mm`,
          height: `${FORM_HEIGHT_MM}mm`,
          display: "block",
        }}
        draggable={false}
      />
      <div className="absolute bottom-1 right-2 z-10 text-[6pt] text-gray-400 opacity-60">
        {FORM_MODEL} — page 1 ({PAGE1_HEIGHT_MM} mm)
      </div>
    </div>
  );
}
