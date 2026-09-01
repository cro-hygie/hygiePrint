"use client";

import {
  FORM_HEIGHT_MM,
  FORM_MODEL,
  FORM_WIDTH_MM,
  PAGE1_HEIGHT_MM,
  PAGE2_HEIGHT_MM,
  PERFORATION_MM,
} from "@/lib/attestation-layout";

/** Scan G11 page 1 — haut du formulaire (0 → perforation), échelle 1:1 mm. */
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
        {FORM_MODEL} — attestation ({PAGE1_HEIGHT_MM} mm)
      </div>
    </div>
  );
}

/** Scan G11 page 2 — bas du formulaire (après perforation), échelle 1:1 mm. */
export function FormReceiptBackground() {
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
          marginTop: `-${PERFORATION_MM}mm`,
        }}
        draggable={false}
      />
      <div className="absolute bottom-1 right-2 z-10 text-[6pt] text-gray-400 opacity-60">
        {FORM_MODEL} — reçu ({PAGE2_HEIGHT_MM} mm)
      </div>
    </div>
  );
}
