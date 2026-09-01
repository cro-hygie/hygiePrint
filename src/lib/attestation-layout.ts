/**
 * Layout calibré sur hygie-soft (careCertificatePrint.css) — production belge G11.
 * Coordonnées en mm (1 cm hygie = 10 mm).
 */
export const FORM_MODEL = "G11-FR";
export const FORM_WIDTH_MM = 241;
export const FORM_HEIGHT_MM = 578;
/** Hauteur page 1 — attestation (avant perforation). */
export const PAGE1_HEIGHT_MM = 261;
/** Hauteur page 2 — reçu (moitié basse du carnet, 578 − 261 mm). */
export const PAGE2_HEIGHT_MM = FORM_HEIGHT_MM - PAGE1_HEIGHT_MM;

/** Largeur zone de contenu hygie-soft (body 10,2 cm). */
export const CONTENT_WIDTH_MM = 102;

export const FONT_BODY = "11pt";
export const FONT_TABLE = "8pt";
export const FONT_EMPHASIS = "12pt";

export interface StaticField {
  id: string;
  label: string;
  page: 1 | 2;
  top: number;
  left: number;
  width?: number;
  fontSize?: string;
  multiline?: boolean;
}

/** Champs positionnés en absolu — valeurs tirées de careCertificatePrint.css */
export const STATIC_FIELDS: StaticField[] = [
  { id: "patient-full-header", label: "Nom patient (en-tête)", page: 1, top: 27, left: 42, fontSize: FONT_BODY },
  { id: "mutuelle-header", label: "Mutuelle", page: 1, top: 40, left: 35, fontSize: FONT_BODY },
  { id: "niss-header", label: "NISS", page: 1, top: 45, left: 20, fontSize: FONT_BODY },
  { id: "patient-address", label: "Adresse", page: 1, top: 52, left: 35, width: 70, fontSize: FONT_BODY, multiline: true },
  { id: "patient-full-main", label: "Nom patient (corps)", page: 1, top: 74, left: 45, fontSize: FONT_BODY },
  { id: "prescriber-name", label: "Prescrit par", page: 1, top: 163, left: 25, fontSize: FONT_BODY },
  { id: "prescriber-date", label: "Date prescription", page: 1, top: 167, left: 25, fontSize: FONT_BODY },
  { id: "prescriber-inami", label: "INAMI prescripteur", page: 1, top: 171, left: 68, fontSize: FONT_BODY },
  { id: "total", label: "Montant / OUI", page: 1, top: 209, left: 65, fontSize: FONT_EMPHASIS },
  { id: "cachet", label: "Identification dispensateur", page: 1, top: 217, left: 10, fontSize: FONT_EMPHASIS, multiline: true },
  { id: "invoice-ref", label: "Référence", page: 1, top: 242, left: 70, fontSize: FONT_BODY },
  { id: "attestation-date", label: "Date attestation", page: 1, top: 251, left: 58, fontSize: FONT_BODY },
  { id: "bce", label: "N° BCE (reçu)", page: 2, top: 10, left: 55, fontSize: FONT_BODY },
  { id: "receipt-date", label: "Date reçu", page: 2, top: 20, left: 60, fontSize: FONT_BODY },
  { id: "receipt-amount", label: "Montant reçu", page: 2, top: 26, left: 35, fontSize: FONT_EMPHASIS },
  {
    id: "receipt-payer",
    label: "Perçu pour le compte de",
    page: 2,
    top: 148,
    left: 35,
    width: 70,
    fontSize: FONT_BODY,
  },
  {
    id: "receipt-bce-line",
    label: "N° BCE (ligne reçu)",
    page: 2,
    top: 218,
    left: 48,
    width: 55,
    fontSize: FONT_BODY,
  },
  {
    id: "receipt-sum",
    label: "Reçu la somme de",
    page: 2,
    top: 221,
    left: 48,
    width: 55,
    fontSize: FONT_EMPHASIS,
  },
  {
    id: "receipt-date-bottom",
    label: "Date signature reçu",
    page: 2,
    top: 226,
    left: 145,
    width: 40,
    fontSize: FONT_BODY,
  },
];

/** Grille prestations — tableCode hygie-soft */
export const TABLE_TOP_MM = 121;
export const TABLE_LEFT_MM = 5;
export const TABLE_ROW_HEIGHT_MM = 4.2;
export const TABLE_SPAN_WIDTH_MM = 17;
export const TABLE_COL_RIGHT_OFFSET_MM = -3;

export const SERVICE_ROWS = 10;
export const SERVICE_SLOT_COUNT = SERVICE_ROWS * 2;

/** Slot 0-9 = colonne gauche, 10-19 = colonne droite (comme hygie-soft). */
export function serviceSlotIndex(column: "l" | "r", row: number): number {
  return column === "l" ? row - 1 : 10 + row - 1;
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
    invoiceRef?: string;
    prescriberName?: string;
    prescriberDate?: string;
    prescriberInami?: string;
  },
  showAmount: boolean,
): string {
  const patientFull = `${attestation.patient.lastName} ${attestation.patient.firstName}`;

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
      return attestation.attestationDate;
    case "receipt-date":
    case "receipt-date-bottom":
      return attestation.attestationDate;
    case "invoice-ref":
      return attestation.invoiceRef ?? "";
    case "receipt-payer":
      return attestation.receiptText || patientFull;
    case "receipt-bce-line":
      return practitioner.bceNumber || attestation.receiptText;
    case "receipt-sum":
      return attestation.patientPaid > 0
        ? attestation.patientPaid.toFixed(2)
        : attestation.totalAmount.toFixed(2);
    case "total":
      return showAmount ? attestation.totalAmount.toFixed(2) : "OUI";
    case "receipt-amount":
      return attestation.patientPaid > 0
        ? String(attestation.patientPaid)
        : "0";
    case "cachet":
      return [
        `${practitioner.lastName.toUpperCase()} ${practitioner.firstName}`,
        practitioner.inamiNumber,
      ]
        .filter(Boolean)
        .join("\n");
    case "bce":
      return practitioner.bceNumber || attestation.receiptText;
    default:
      return "";
  }
}

export function getServiceCell(
  slot: number,
  attestation: {
    services: Array<{ code: string; date: string; amount: number; used: boolean }>;
  },
  showPlaceholders = false,
): { date: string; code: string } {
  const s = attestation.services[slot];
  if (!s?.used) {
    return showPlaceholders
      ? { date: "xxxxxxxxxx", code: "xxxxxx" }
      : { date: "", code: "" };
  }
  return { date: s.date, code: s.code };
}

/** @deprecated compatibilité */
export const ATTESTATION_FIELDS = STATIC_FIELDS;
export const FORM_IMAGE_WIDTH_PX = 1500;
export const FORM_IMAGE_HEIGHT_PX = 3600;

export function serviceSlotIndexFromFieldId(fieldId: string): number {
  const match = fieldId.match(/^service-([lr])(\d+)-(date|code)$/);
  if (!match) return -1;
  return serviceSlotIndex(match[1] as "l" | "r", parseInt(match[2]));
}
