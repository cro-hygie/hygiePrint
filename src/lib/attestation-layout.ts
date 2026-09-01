/** Positions approximatives (mm) pour formulaire attestation INAMI sur papier Std plié allemand (241 mm). */
export const FORM_WIDTH_MM = 241;
export const FORM_HEIGHT_MM = 140;

export interface FieldPosition {
  id: string;
  label: string;
  top: number;
  left: number;
  width?: number;
}

export const ATTESTATION_FIELDS: FieldPosition[] = [
  { id: "patient-name", label: "Nom patient", top: 18, left: 45, width: 80 },
  { id: "patient-first", label: "Prénom", top: 18, left: 130, width: 60 },
  { id: "niss", label: "NISS", top: 26, left: 45, width: 55 },
  { id: "mutuelle", label: "Mutuelle", top: 26, left: 110, width: 80 },
  { id: "date-soins", label: "Date soins", top: 38, left: 45, width: 30 },
  { id: "service-1", label: "Prestation 1", top: 50, left: 20, width: 180 },
  { id: "service-2", label: "Prestation 2", top: 58, left: 20, width: 180 },
  { id: "service-3", label: "Prestation 3", top: 66, left: 20, width: 180 },
  { id: "service-4", label: "Prestation 4", top: 74, left: 20, width: 180 },
  { id: "am-field", label: "A.M 21.1.94", top: 86, left: 140, width: 30 },
  { id: "total", label: "Montant total", top: 96, left: 140, width: 30 },
  { id: "cachet", label: "Cachet prestataire", top: 108, left: 20, width: 120 },
  { id: "bce", label: "N° BCE", top: 120, left: 20, width: 50 },
];

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
    };
    services: Array<{ code: string; date: string; amount: number; used: boolean }>;
    totalAmount: number;
    attestationDate: string;
    receiptText: string;
  },
  showAmount: boolean,
): string {
  switch (fieldId) {
    case "patient-name":
      return attestation.patient.lastName.toUpperCase();
    case "patient-first":
      return attestation.patient.firstName;
    case "niss":
      return attestation.patient.niss;
    case "mutuelle":
      return attestation.patient.mutuelle;
    case "date-soins":
      return attestation.attestationDate;
    case "service-1":
    case "service-2":
    case "service-3":
    case "service-4": {
      const idx = parseInt(fieldId.split("-")[1]) - 1;
      const s = attestation.services[idx];
      if (!s?.code) return "";
      return `${s.code}  ${s.date}  ${s.amount.toFixed(2)} €`;
    }
    case "am-field":
      return showAmount ? `${attestation.totalAmount.toFixed(2)} €` : "OUI";
    case "total":
      return `${attestation.totalAmount.toFixed(2)} €`;
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
    default:
      return "";
  }
}
