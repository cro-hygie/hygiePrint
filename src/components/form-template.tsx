"use client";

import { FORM_MODEL } from "@/lib/attestation-layout";

/** Scan Mod. G11 FR *15* fourni par l'utilisateur (public/forms/mod-g11-fr.png). */
export function FormTemplateBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/forms/mod-g11-fr.png"
        alt=""
        className="h-full w-full object-fill"
        draggable={false}
      />
      <div className="absolute bottom-1 right-2 z-10 text-[6pt] text-gray-500 opacity-70">
        {FORM_MODEL}
      </div>
    </div>
  );
}
