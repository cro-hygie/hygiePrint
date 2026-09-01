export type Profession = "medecin" | "kine" | "dentiste";

export type PrinterModel =
  | "epson-lx-350"
  | "epson-lq-350"
  | "oki"
  | "autre";

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
  address: string;
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
  prescriberName: string;
  prescriberDate: string;
  prescriberInami: string;
}

export interface AppSettings {
  printer: PrinterConfig;
  practitioner: PractitionerProfile;
  attestation: AttestationData;
  simulatePaper: boolean;
}

export const DEFAULT_PRINTER: PrinterConfig = {
  model: "epson-lx-350",
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
    address: "Rue Neuve 12, 1000 Bruxelles",
  },
  services: [
    { code: "567011", date: "01/09", amount: 25.5, used: true },
    { code: "567012", date: "03/09", amount: 25.5, used: true },
    { code: "567013", date: "05/09", amount: 25.5, used: true },
    { code: "567014", date: "08/09", amount: 25.5, used: true },
    { code: "567015", date: "10/09", amount: 25.5, used: true },
    { code: "567016", date: "12/09", amount: 25.5, used: true },
    { code: "", date: "", amount: 0, used: false },
    { code: "", date: "", amount: 0, used: false },
    { code: "", date: "", amount: 0, used: false },
    { code: "", date: "", amount: 0, used: false },
    { code: "", date: "", amount: 0, used: false },
    { code: "", date: "", amount: 0, used: false },
  ],
  totalAmount: 153.0,
  patientPaid: 45.9,
  attestationDate: "12/09/2026",
  receiptText: "",
  prescriberName: "Dr Martin",
  prescriberDate: "01/08/2026",
  prescriberInami: "1-11111-22-333",
};

export const DEFAULT_SETTINGS: AppSettings = {
  printer: DEFAULT_PRINTER,
  practitioner: DEFAULT_PRACTITIONER,
  attestation: DEFAULT_ATTESTATION,
  simulatePaper: true,
};
