/**
 * Layout calibré sur le scan G11 (1500×3600 px) en mm 1:1 — 241 × 578 mm.
 * Coordonnées = positions réelles sur le carnet (alignement fond scan).
 */
export const FORM_MODEL = "G11-FR";
export const FORM_IMAGE_WIDTH_PX = 1500;
export const FORM_IMAGE_HEIGHT_PX = 3600;
export const FORM_WIDTH_MM = 241;
export const FORM_HEIGHT_MM = 578;

/** Ligne de perforation « REÇU » mesurée sur le scan. */
export const PERFORATION_MM = 405;
export const PAGE1_HEIGHT_MM = PERFORATION_MM;
export const PAGE2_HEIGHT_MM = FORM_HEIGHT_MM - PERFORATION_MM;

const BASELINE_OFFSET_PX = 10;

function fromPx(
  x: number,
  y: number,
  widthPx?: number,
  fontSize = "8pt",
): { top: number; left: number; width?: number; fontSize: string } {
  const yMm = ((y - BASELINE_OFFSET_PX) / FORM_IMAGE_HEIGHT_PX) * FORM_HEIGHT_MM;
  return {
    top: yMm,
    left: (x / FORM_IMAGE_WIDTH_PX) * FORM_WIDTH_MM,
    width: widthPx
      ? (widthPx / FORM_IMAGE_WIDTH_PX) * FORM_WIDTH_MM
      : undefined,
    fontSize,
  };
}

function pageField(
  id: string,
  label: string,
  x: number,
  y: number,
  page: 1 | 2,
  opts: { widthPx?: number; fontSize?: string; multiline?: boolean } = {},
) {
  const pos = fromPx(x, y, opts.widthPx, opts.fontSize ?? "8pt");
  const top = page === 2 ? pos.top - PERFORATION_MM : pos.top;
  return {
    id,
    label,
    page,
    top,
    left: pos.left,
    width: pos.width,
    fontSize: pos.fontSize,
    multiline: opts.multiline,
  };
}

export const FONT_BODY = "9pt";
export const FONT_TABLE = "7pt";
export const FONT_EMPHASIS = "9pt";

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

export const STATIC_FIELDS: StaticField[] = [
  pageField("patient-full-header", "Nom (en-tête)", 283, 290, 1, {
    widthPx: 970,
    fontSize: FONT_BODY,
  }),
  pageField("mutuelle-header", "Mutuelle", 280, 312, 1, {
    widthPx: 1020,
    fontSize: FONT_BODY,
  }),
  pageField("niss-header", "NISS", 280, 346, 1, { widthPx: 300, fontSize: FONT_BODY }),
  pageField("patient-address", "Adresse", 582, 362, 1, {
    widthPx: 730,
    fontSize: "7pt",
  }),
  pageField("patient-full-main", "Nom (corps)", 286, 412, 1, {
    widthPx: 1020,
    fontSize: FONT_BODY,
  }),
  pageField("prescriber-name", "Prescrit par", 300, 1962, 1, {
    widthPx: 480,
    fontSize: FONT_BODY,
  }),
  pageField("prescriber-date", "Date prescription", 650, 2012, 1, {
    widthPx: 180,
    fontSize: FONT_BODY,
  }),
  pageField("prescriber-inami", "INAMI prescripteur", 300, 2061, 1, {
    widthPx: 880,
    fontSize: FONT_BODY,
  }),
  pageField("cachet", "Cachet", 180, 2098, 1, {
    widthPx: 600,
    fontSize: "7pt",
    multiline: true,
  }),
  pageField("total", "Total / OUI", 950, 2111, 1, {
    widthPx: 100,
    fontSize: FONT_EMPHASIS,
  }),
  pageField("invoice-ref", "Référence", 1050, 2380, 1, {
    widthPx: 200,
    fontSize: FONT_BODY,
  }),
  pageField("attestation-date", "Date attestation", 900, 2227, 1, {
    widthPx: 180,
    fontSize: FONT_BODY,
  }),
  pageField("receipt-payer", "Perçu pour le compte de", 300, 2860, 2, {
    widthPx: 700,
    fontSize: FONT_BODY,
  }),
  pageField("bce", "N° BCE", 300, 2981, 2, { widthPx: 340, fontSize: FONT_BODY }),
  pageField("receipt-sum", "Montant reçu", 300, 3001, 2, {
    widthPx: 340,
    fontSize: FONT_EMPHASIS,
  }),
  pageField("receipt-date", "Date reçu", 900, 3030, 2, {
    widthPx: 180,
    fontSize: FONT_BODY,
  }),
];

/** Grille prestations — positions scan */
export const TABLE_TOP_MM = fromPx(200, 744).top;
export const TABLE_LEFT_MM = fromPx(200, 744).left;
export const TABLE_ROW_HEIGHT_MM = 8.5;
export const TABLE_SPAN_WIDTH_MM = 17;
export const TABLE_COL_RIGHT_OFFSET_MM =
  fromPx(800, 744).left - fromPx(200, 744).left;

const SERVICE_ROW_Y_PX = [
  744, 797, 850, 904, 957, 1010, 1064, 1117, 1170, 1224,
];

export const SERVICE_ROWS = 10;
export const SERVICE_SLOT_COUNT = SERVICE_ROWS * 2;

export const SERVICE_DATE_X = {
  l: fromPx(200, 744).left,
  r: fromPx(800, 744).left,
};
export const SERVICE_CODE_X = {
  l: fromPx(360, 744).left,
  r: fromPx(960, 744).left,
};

export function serviceRowTopMm(rowIndex: number): number {
  const y = SERVICE_ROW_Y_PX[rowIndex];
  return fromPx(200, y).top;
}

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
    case "receipt-date":
      return attestation.attestationDate;
    case "invoice-ref":
      return attestation.invoiceRef ?? "";
    case "receipt-payer":
      return attestation.receiptText || patientFull;
    case "receipt-sum":
      return attestation.patientPaid > 0
        ? attestation.patientPaid.toFixed(2)
        : attestation.totalAmount.toFixed(2);
    case "total":
      return showAmount ? attestation.totalAmount.toFixed(2) : "OUI";
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

export const ATTESTATION_FIELDS = STATIC_FIELDS;

export function serviceSlotIndexFromFieldId(fieldId: string): number {
  const match = fieldId.match(/^service-([lr])(\d+)-(date|code)$/);
  if (!match) return -1;
  return serviceSlotIndex(match[1] as "l" | "r", parseInt(match[2]));
}

/** @deprecated */
export const CONTENT_WIDTH_MM = 102;
