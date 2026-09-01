"use client";

import Image from "next/image";
import { FORM_HEIGHT_MM, FORM_MODEL, FORM_WIDTH_MM } from "@/lib/attestation-layout";

/** Fond scan du formulaire Mod. G11 FR (attestation de soins donnés). */
export function FormTemplateBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <Image
        src="/forms/mod-g11-fr.png"
        alt=""
        fill
        className="object-fill"
        priority
        sizes={`${FORM_WIDTH_MM}mm`}
      />
      <div className="absolute bottom-1 right-2 text-[6pt] text-gray-400 opacity-60">
        {FORM_MODEL} — simulation hygiePrint
      </div>
    </div>
  );
}
