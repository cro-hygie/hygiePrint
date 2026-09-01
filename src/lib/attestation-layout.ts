/**
 * Modèle G11 FR — Attestation de soins donnés (Belgique)
 * Dimensions basées sur le formulaire continu 241 mm (Std plié allemand).
 * Positions calibrées sur scan réel ; affiner via marges X/Y dans l'app.
 */
export const FORM_MODEL = "G11-FR";
export const FORM_WIDTH_MM = 241;
/** Ratio scan 1536×2048 → hauteur proportionnelle à 241 mm */
export const FORM_HEIGHT_MM = 321;

export interface FieldPosition {
  id: string;
  label: string;
  top: number;
  left: number;
  width?: number;
  fontSize?: string;
}

/** Zone imprimable (après bande perforée gauche) */
export const PRINTABLE_OFFSET_X = 20;

export const ATTESTATION_FIELDS: FieldPosition[] = [
  // --- En-tête patient (vignette O.A.) ---
  {
    id: "patient-full-header",
    label: "Nom et prénom (en-tête)",
    top: 14,
    left: 52,
    width: 165,
    fontSize: "9pt",
  },
  {
    id: "mutuelle-header",
    label: "Organisme assureur",
    top: 22,
    left: 52,
    width: 165,
    fontSize: "9pt",
  },
  {
    id: "niss-header",
    label: "NISS",
    top: 30,
    left: 52,
    width: 70,
    fontSize: "9pt",
  },
  {
    id: "patient-address",
    label: "Adresse patient",
    top: 30,
    left: 128,
    width: 90,
    fontSize: "8pt",
  },

  // --- Titre attestation ---
  {
    id: "patient-full-main",
    label: "Nom et prénom (corps)",
    top: 50,
    left: 52,
    width: 165,
    fontSize: "9pt",
  },

  // --- Tableau prestations (6 lignes × 2 colonnes Date | Nomenclature) ---
  ...buildServiceFields(),

  // --- Prescripteur ---
  {
    id: "prescriber-name",
    label: "Prescrit par",
    top: 132,
    left: 52,
    width: 90,
    fontSize: "8pt",
  },
  {
    id: "prescriber-date",
    label: "Date prescription",
    top: 132,
    left: 148,
    width: 35,
    fontSize: "8pt",
  },
  {
    id: "prescriber-inami",
    label: "INAMI prescripteur",
    top: 140,
    left: 52,
    width: 100,
    fontSize: "8pt",
  },

  // --- Dispensateur ---
  {
    id: "cachet",
    label: "Identification dispensateur",
    top: 158,
    left: 24,
    width: 115,
    fontSize: "8pt",
  },
  {
    id: "total",
    label: "Montant total EUR",
    top: 162,
    left: 198,
    width: 28,
    fontSize: "9pt",
  },
  {
    id: "attestation-date",
    label: "Date attestation",
    top: 188,
    left: 148,
    width: 35,
    fontSize: "8pt",
  },

  // --- Reçu (partie inférieure) ---
  {
    id: "bce",
    label: "N° BCE",
    top: 214,
    left: 70,
    width: 55,
    fontSize: "8pt",
  },
  {
    id: "receipt-date",
    label: "Date reçu",
    top: 214,
    left: 148,
    width: 35,
    fontSize: "8pt",
  },
  {
    id: "receipt-amount",
    label: "Montant reçu EUR",
    top: 222,
    left: 70,
    width: 50,
    fontSize: "9pt",
  },
];

function buildServiceFields(): FieldPosition[] {
  const fields: FieldPosition[] = [];
  const rowStart = 62;
  const rowHeight = 5.6;
  const blocks = [
    { dateLeft: 24, codeLeft: 58, prefix: "l" },
    { dateLeft: 126, codeLeft: 160, prefix: "r" },
  ];

  for (let row = 0; row < 6; row++) {
    for (const block of blocks) {
      const n = row + 1;
      const top = rowStart + row * rowHeight;
      fields.push(
        {
          id: `service-${block.prefix}${n}-date`,
          label: `Date prestation ${block.prefix.toUpperCase()}${n}`,
          top,
          left: block.dateLeft,
          width: 28,
          fontSize: "8pt",
        },
        {
          id: `service-${block.prefix}${n}-code`,
          label: `Code nomenclature ${block.prefix.toUpperCase()}${n}`,
          top,
          left: block.codeLeft,
          width: 38,
          fontSize: "8pt",
        },
      );
    }
  }
  return fields;
}

export function serviceSlotIndex(fieldId: string): number {
  const match = fieldId.match(/^service-([lr])(\d+)-(date|code)$/);
  if (!match) return -1;
  const col = match[1] === "l" ? 0 : 1;
  const row = parseInt(match[2]) - 1;
  return row * 2 + col;
}

export function getFieldValue(
  fieldId: string,
  practitioner: {
    lastName: string;
    firstName: string;
    inamiNumber: string;
    bceNumber: string;
    address: string;
    city: string;
    postalCode: string;
  },
  attestation: {
    patient: {
      lastName: string;
      firstName: string;
      niss: string;
      mutuelle: string;
      address?: string;
    };
    services: Array<{ code: string; date: string; amount: number; used: boolean }>;
    totalAmount: number;
    patientPaid: number;
    attestationDate: string;
    receiptText: string;
    prescriberName?: string;
    prescriberDate?: string;
    prescriberInami?: string;
  },
  showAmount: boolean,
): string {
  const patientFull = `${attestation.patient.lastName.toUpperCase()} ${attestation.patient.firstName}`;

  switch (fieldId) {
    case "patient-full-header":
    case "patient-full-main":
      return patientFull;
    case "mutuelle-header":
      return attestation.patient.mutuelle;
    case "niss-header":
      return attestation.patient.niss;
    case "patient-address":
      return attestation.patient.address ?? "";
    case "prescriber-name":
      return attestation.prescriberName ?? "";
    case "prescriber-date":
      return attestation.prescriberDate ?? "";
    case "prescriber-inami":
      return attestation.prescriberInami ?? "";
    case "attestation-date":
    case "receipt-date":
      return attestation.attestationDate;
    case "total":
      return showAmount ? attestation.totalAmount.toFixed(2) : "OUI";
    case "receipt-amount":
      return attestation.patientPaid > 0
        ? attestation.patientPaid.toFixed(2)
        : attestation.totalAmount.toFixed(2);
    case "cachet":
      return [
        `${practitioner.firstName} ${practitioner.lastName}`,
        `INAMI: ${practitioner.inamiNumber}`,
        `${practitioner.address}`,
        `${practitioner.postalCode} ${practitioner.city}`,
      ]
        .filter(Boolean)
        .join("\n");
    case "bce":
      return practitioner.bceNumber || attestation.receiptText;
    default: {
      const match = fieldId.match(/^service-([lr])(\d+)-(date|code)$/);
      if (match) {
        const slot = serviceSlotIndex(fieldId);
        const s = attestation.services[slot];
        if (!s?.used) return "";
        return match[3] === "date" ? s.date : s.code;
      }
      return "";
    }
  }
}
