export type Profession = "medecin" | "kine" | "dentiste";

export type PrinterModel = "epson" | "oki" | "autre";

export interface PrinterConfig {
  model: PrinterModel;
  paperFormat: "std-plie-allemand";
  marginX: number;
  marginY: number;
  showAmountOnAttestation: boolean;
  strikeUnusedServices: boolean;
}

export interface PractitionerProfile {
  profession: Profession;
  lastName: string;
  firstName: string;
  inamiNumber: string;
  bceNumber: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

export interface PatientInfo {
  lastName: string;
  firstName: string;
  niss: string;
  mutuelle: string;
}

export interface ServiceLine {
  code: string;
  date: string;
  amount: number;
  used: boolean;
}

export interface AttestationData {
  patient: PatientInfo;
  services: ServiceLine[];
  totalAmount: number;
  patientPaid: number;
  attestationDate: string;
  receiptText: string;
}

export interface AppSettings {
  printer: PrinterConfig;
  practitioner: PractitionerProfile;
  attestation: AttestationData;
}

export const DEFAULT_PRINTER: PrinterConfig = {
  model: "epson",
  paperFormat: "std-plie-allemand",
  marginX: 0,
  marginY: 0,
  showAmountOnAttestation: false,
  strikeUnusedServices: true,
};

export const DEFAULT_PRACTITIONER: PractitionerProfile = {
  profession: "kine",
  lastName: "",
  firstName: "",
  inamiNumber: "",
  bceNumber: "",
  address: "",
  city: "",
  postalCode: "",
  phone: "",
};

export const DEFAULT_ATTESTATION: AttestationData = {
  patient: {
    lastName: "Dupont",
    firstName: "Marie",
    niss: "85.12.30-123.45",
    mutuelle: "Solidaris",
  },
  services: [
    { code: "567011", date: "01/09/2026", amount: 25.5, used: true },
    { code: "567012", date: "01/09/2026", amount: 25.5, used: true },
    { code: "", date: "", amount: 0, used: false },
    { code: "", date: "", amount: 0, used: false },
  ],
  totalAmount: 51.0,
  patientPaid: 15.3,
  attestationDate: "01/09/2026",
  receiptText: "",
};

export const DEFAULT_SETTINGS: AppSettings = {
  printer: DEFAULT_PRINTER,
  practitioner: DEFAULT_PRACTITIONER,
  attestation: DEFAULT_ATTESTATION,
};
