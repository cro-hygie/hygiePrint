export const DEMO_PRACTITIONER = {
  profession: "kine" as const,
  lastName: "Lambert",
  firstName: "Sophie",
  inamiNumber: "6-71234-56-789",
  bceNumber: "BE0634982154",
  address: "Avenue des Arts 8",
  city: "Liège",
  postalCode: "4000",
  phone: "+32 4 223 18 40",
};

/** Séances kiné — 6 prestations sur 16 emplacements (semaine type). */
export const DEMO_ATTESTATION = {
  patient: {
    lastName: "Henrard",
    firstName: "Philippe",
    niss: "72.08.15-413.27",
    mutuelle: "Partenamut",
    address: "Rue des Wallons 42, 4000 Liège",
  },
  services: [
    { code: "567011", date: "02/09", amount: 25.5, used: true },
    { code: "567011", date: "04/09", amount: 25.5, used: true },
    { code: "567011", date: "09/09", amount: 25.5, used: true },
    { code: "567011", date: "11/09", amount: 25.5, used: true },
    { code: "567011", date: "16/09", amount: 25.5, used: true },
    { code: "567011", date: "18/09", amount: 25.5, used: true },
    ...Array.from({ length: 14 }, () => ({
      code: "",
      date: "",
      amount: 0,
      used: false,
    })),
  ],
  totalAmount: 153.0,
  patientPaid: 45.9,
  attestationDate: "18/09/2026",
  receiptText: "",
  prescriberName: "Dr Pierre Durand",
  prescriberDate: "15/07/2026",
  prescriberInami: "1-47821-09-345",
};
