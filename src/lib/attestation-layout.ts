/**
 * Modèle G11 FR — Attestation de soins donnés (Belgique)
 * Positions calibrées sur le scan public/forms/mod-g11-fr.png (1500×3600 px).
 */
export const FORM_MODEL = "G11-FR";
export const FORM_IMAGE_WIDTH_PX = 1500;
export const FORM_IMAGE_HEIGHT_PX = 3600;
export const FORM_WIDTH_MM = 241;
export const FORM_HEIGHT_MM = Math.round(
  (FORM_WIDTH_MM * FORM_IMAGE_HEIGHT_PX) / FORM_IMAGE_WIDTH_PX,
); // 578 mm

/** Décalage vertical : le texte s'aligne sur les pointillés (baseline au-dessus de la ligne). */
const BASELINE_OFFSET_PX = 12;

export interface FieldPosition {
  id: string;
  label: string;
  top: number;
  left: number;
  width?: number;
  fontSize?: string;
}

/** Convertit des coordonnées pixel du scan en mm. */
function fromPx(
  x: number,
  y: number,
  widthPx?: number,
  fontSize = "8pt",
): Pick<FieldPosition, "top" | "left" | "width" | "fontSize"> {
  const adjustedY = y - BASELINE_OFFSET_PX;
  return {
    top: (adjustedY / FORM_IMAGE_HEIGHT_PX) * FORM_HEIGHT_MM,
    left: (x / FORM_IMAGE_WIDTH_PX) * FORM_WIDTH_MM,
    width: widthPx
      ? (widthPx / FORM_IMAGE_WIDTH_PX) * FORM_WIDTH_MM
      : undefined,
    fontSize,
  };
}

/** 10 lignes × 2 colonnes — centres de cellules mesurés sur le scan */
const SERVICE_ROW_Y_PX = [
  744, 795, 852, 918, 969, 1020, 1071, 1122, 1173, 1224,
];

const SERVICE_ROWS = 10;

function buildServiceFields(): FieldPosition[] {
  const fields: FieldPosition[] = [];
  const blocks = [
    { dateX: 195, codeX: 365, prefix: "l" },
    { dateX: 795, codeX: 965, prefix: "r" },
  ];

  for (let row = 0; row < SERVICE_ROWS; row++) {
    const y = SERVICE_ROW_Y_PX[row];
    for (const block of blocks) {
      const n = row + 1;
      fields.push(
        {
          id: `service-${block.prefix}${n}-date`,
          label: `Date ${block.prefix.toUpperCase()}${n}`,
          ...fromPx(block.dateX, y, 130),
        },
        {
          id: `service-${block.prefix}${n}-code`,
          label: `Nomenclature ${block.prefix.toUpperCase()}${n}`,
          ...fromPx(block.codeX, y, 150),
        },
      );
    }
  }
  return fields;
}

export const ATTESTATION_FIELDS: FieldPosition[] = [
  {
    id: "patient-full-header",
    label: "Nom et prénom (en-tête)",
    ...fromPx(300, 290, 1020, "9pt"),
  },
  {
    id: "mutuelle-header",
    label: "Organisme assureur",
    ...fromPx(300, 312, 1020, "9pt"),
  },
  {
    id: "niss-header",
    label: "NISS",
    ...fromPx(185, 346, 380, "9pt"),
  },
  {
    id: "patient-address",
    label: "Adresse patient",
    ...fromPx(560, 362, 780, "8pt"),
  },
  {
    id: "patient-full-main",
    label: "Nom et prénom (corps)",
    ...fromPx(300, 412, 1020, "9pt"),
  },
  ...buildServiceFields(),
  {
    id: "prescriber-name",
    label: "Prescrit par",
    ...fromPx(300, 1962, 520),
  },
  {
    id: "prescriber-date",
    label: "Date prescription",
    ...fromPx(650, 2012, 200),
  },
  {
    id: "prescriber-inami",
    label: "INAMI prescripteur",
    ...fromPx(300, 2061, 900),
  },
  {
    id: "cachet",
    label: "Identification dispensateur",
    ...fromPx(180, 2149, 620, "7pt"),
  },
  {
    id: "total",
    label: "Montant total EUR",
    ...fromPx(950, 2111, 120, "9pt"),
  },
  {
    id: "attestation-date",
    label: "Date attestation",
    ...fromPx(900, 2242, 200),
  },
  {
    id: "bce",
    label: "N° BCE",
    ...fromPx(300, 2980, 350),
  },
  {
    id: "receipt-amount",
    label: "Montant reçu EUR",
    ...fromPx(300, 3012, 350, "9pt"),
  },
  {
    id: "receipt-date",
    label: "Date reçu",
    ...fromPx(900, 3032, 200),
  },
];

export const SERVICE_SLOT_COUNT = SERVICE_ROWS * 2;

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
