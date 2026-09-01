/**
 * Modèle G11 FR *17* — Attestation de soins donnés (Belgique)
 * Fond : scan officiel propre public/forms/mod-g11-fr.png (1500×3600 px)
 * Papier continu Std plié allemand — 241 mm de large.
 */
export const FORM_MODEL = "G11-FR *17*";
export const FORM_WIDTH_MM = 241;
export const FORM_HEIGHT_MM = Math.round((FORM_WIDTH_MM * 3600) / 1500); // 578 mm

export interface FieldPosition {
  id: string;
  label: string;
  top: number;
  left: number;
  width?: number;
  fontSize?: string;
}

function pos(
  topPct: number,
  leftPct: number,
  widthPct?: number,
  fontSize = "8pt",
): Pick<FieldPosition, "top" | "left" | "width" | "fontSize"> {
  return {
    top: (FORM_HEIGHT_MM * topPct) / 100,
    left: (FORM_WIDTH_MM * leftPct) / 100,
    width: widthPct ? (FORM_WIDTH_MM * widthPct) / 100 : undefined,
    fontSize,
  };
}

const SERVICE_ROWS = 9;

function buildServiceFields(): FieldPosition[] {
  const fields: FieldPosition[] = [];
  const rowStartPct = 13.8;
  const rowStepPct = 2.25;
  const blocks = [
    { dateLeftPct: 7, codeLeftPct: 21, prefix: "l" },
    { dateLeftPct: 51, codeLeftPct: 65, prefix: "r" },
  ];

  for (let row = 0; row < SERVICE_ROWS; row++) {
    for (const block of blocks) {
      const n = row + 1;
      const topPct = rowStartPct + row * rowStepPct;
      fields.push(
        {
          id: `service-${block.prefix}${n}-date`,
          label: `Date ${block.prefix.toUpperCase()}${n}`,
          ...pos(topPct, block.dateLeftPct, 11),
        },
        {
          id: `service-${block.prefix}${n}-code`,
          label: `Nomenclature ${block.prefix.toUpperCase()}${n}`,
          ...pos(topPct, block.codeLeftPct, 14),
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
    ...pos(3.2, 20, 72, "9pt"),
  },
  {
    id: "mutuelle-header",
    label: "Organisme assureur",
    ...pos(5.0, 20, 72, "9pt"),
  },
  {
    id: "niss-header",
    label: "NISS",
    ...pos(6.8, 20, 34, "9pt"),
  },
  {
    id: "patient-address",
    label: "Adresse patient",
    ...pos(6.8, 55, 38, "8pt"),
  },
  {
    id: "patient-full-main",
    label: "Nom et prénom (corps)",
    ...pos(10.2, 20, 72, "9pt"),
  },
  ...buildServiceFields(),
  {
    id: "prescriber-name",
    label: "Prescrit par",
    ...pos(36.2, 20, 38),
  },
  {
    id: "prescriber-date",
    label: "Date prescription",
    ...pos(36.2, 62, 14),
  },
  {
    id: "prescriber-inami",
    label: "INAMI prescripteur",
    ...pos(38.2, 20, 55),
  },
  {
    id: "cachet",
    label: "Identification dispensateur",
    ...pos(42.5, 6, 40, "7pt"),
  },
  {
    id: "total",
    label: "Montant total EUR",
    ...pos(43.5, 80, 12, "9pt"),
  },
  {
    id: "attestation-date",
    label: "Date attestation",
    ...pos(50.5, 62, 14),
  },
  {
    id: "bce",
    label: "N° BCE",
    ...pos(66.5, 28, 28),
  },
  {
    id: "receipt-amount",
    label: "Montant reçu EUR",
    ...pos(70.5, 28, 30, "9pt"),
  },
  {
    id: "receipt-date",
    label: "Date reçu",
    ...pos(74.5, 62, 14),
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
