"use client";

import { FORM_HEIGHT_MM, FORM_WIDTH_MM } from "@/lib/attestation-layout";
import type { Profession } from "@/lib/types";

interface FormTemplateBackgroundProps {
  profession?: Profession;
}

/** Simulation visuelle d'un formulaire pré-imprimé belge (attestation de soins). */
export function FormTemplateBackground({
  profession = "kine",
}: FormTemplateBackgroundProps) {
  const professionLabel =
    profession === "kine"
      ? "Kinésithérapeute"
      : profession === "dentiste"
        ? "Dentiste"
        : "Médecin";

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <svg
        viewBox={`0 0 ${FORM_WIDTH_MM} ${FORM_HEIGHT_MM}`}
        className="h-full w-full"
        preserveAspectRatio="none"
      >
        {/* Fond légèrement teinté (papier NCR) */}
        <rect width={FORM_WIDTH_MM} height={FORM_HEIGHT_MM} fill="#f8f6f0" />

        {/* En-tête */}
        <rect x="5" y="4" width="231" height="10" fill="none" stroke="#999" strokeWidth="0.3" />
        <text x="120.5" y="10.5" textAnchor="middle" fontSize="3.5" fill="#666" fontFamily="Arial, sans-serif" fontWeight="bold">
          ATTESTATION DE SOINS ACCORDÉS
        </text>
        <text x="120.5" y="13.5" textAnchor="middle" fontSize="2" fill="#999" fontFamily="Arial, sans-serif">
          {professionLabel} — Formulaire pré-imprimé (simulation)
        </text>

        {/* Zone patient */}
        <text x="8" y="19" fontSize="2" fill="#888" fontFamily="Arial, sans-serif">Nom</text>
        <rect x="42" y="16" width="75" height="4" fill="none" stroke="#bbb" strokeWidth="0.2" strokeDasharray="1 0.5" />
        <text x="120" y="19" fontSize="2" fill="#888" fontFamily="Arial, sans-serif">Prénom</text>
        <rect x="128" y="16" width="55" height="4" fill="none" stroke="#bbb" strokeWidth="0.2" strokeDasharray="1 0.5" />

        <text x="8" y="27" fontSize="2" fill="#888" fontFamily="Arial, sans-serif">NISS</text>
        <rect x="42" y="24" width="50" height="4" fill="none" stroke="#bbb" strokeWidth="0.2" strokeDasharray="1 0.5" />
        <text x="98" y="27" fontSize="2" fill="#888" fontFamily="Arial, sans-serif">Mutuelle</text>
        <rect x="108" y="24" width="75" height="4" fill="none" stroke="#bbb" strokeWidth="0.2" strokeDasharray="1 0.5" />

        <text x="8" y="39" fontSize="2" fill="#888" fontFamily="Arial, sans-serif">Date</text>
        <rect x="42" y="36" width="28" height="4" fill="none" stroke="#bbb" strokeWidth="0.2" strokeDasharray="1 0.5" />

        {/* Tableau prestations */}
        <rect x="5" y="44" width="231" height="34" fill="none" stroke="#999" strokeWidth="0.3" />
        <line x1="5" y1="48" x2="236" y2="48" stroke="#bbb" strokeWidth="0.2" />
        <text x="8" y="47" fontSize="2" fill="#888" fontFamily="Arial, sans-serif">Code</text>
        <text x="50" y="47" fontSize="2" fill="#888" fontFamily="Arial, sans-serif">Date</text>
        <text x="90" y="47" fontSize="2" fill="#888" fontFamily="Arial, sans-serif">Montant</text>
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <line x1="5" y1={52 + i * 6.5} x2="236" y2={52 + i * 6.5} stroke="#ddd" strokeWidth="0.15" />
            <rect x="8" y={49 + i * 6.5} width="175" height="5" fill="none" stroke="#ccc" strokeWidth="0.15" strokeDasharray="0.8 0.4" />
          </g>
        ))}

        {/* A.M 21.1.94 */}
        <text x="120" y="87" fontSize="2" fill="#888" fontFamily="Arial, sans-serif">A.M 21.1.94</text>
        <rect x="138" y="84" width="25" height="4" fill="none" stroke="#bbb" strokeWidth="0.2" strokeDasharray="1 0.5" />

        {/* Total */}
        <text x="120" y="97" fontSize="2" fill="#888" fontFamily="Arial, sans-serif">Total</text>
        <rect x="138" y="94" width="25" height="4" fill="none" stroke="#bbb" strokeWidth="0.2" strokeDasharray="1 0.5" />

        {/* Cachet */}
        <rect x="5" y="104" width="120" height="22" fill="none" stroke="#999" strokeWidth="0.3" />
        <text x="8" y="108" fontSize="2" fill="#888" fontFamily="Arial, sans-serif">Cachet prestataire</text>
        <line x1="5" y1="110" x2="125" y2="110" stroke="#ddd" strokeWidth="0.15" />

        {/* BCE */}
        <text x="8" y="122" fontSize="2" fill="#888" fontFamily="Arial, sans-serif">N° BCE</text>
        <rect x="25" y="119" width="45" height="4" fill="none" stroke="#bbb" strokeWidth="0.2" strokeDasharray="1 0.5" />

        {/* Bordure formulaire */}
        <rect x="2" y="2" width="237" height="136" fill="none" stroke="#aaa" strokeWidth="0.4" />
      </svg>
    </div>
  );
}
