import { DEMO_ATTESTATION, DEMO_PRACTITIONER } from "./demo-data";

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
  invoiceRef: string;
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
  ...DEMO_PRACTITIONER,
};

export const DEFAULT_ATTESTATION: AttestationData = {
  ...DEMO_ATTESTATION,
};

export const DEFAULT_SETTINGS: AppSettings = {
  printer: DEFAULT_PRINTER,
  practitioner: DEFAULT_PRACTITIONER,
  attestation: DEFAULT_ATTESTATION,
  simulatePaper: true,
};
