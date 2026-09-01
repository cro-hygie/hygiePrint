export const DEMO_PRACTITIONER = {
  profession: "kine" as const,
  lastName: "Lambert",
  firstName: "Sophie",
  inamiNumber: "5/13946/57/527",
  bceNumber: "0788.186.168",
  address: "Avenue des Arts 8",
  city: "Liège",
  postalCode: "4000",
  phone: "+32 4 223 18 40",
};

function buildDemoServices() {
  const sessions = [
    { code: "785874858", date: "10/10/2025", amount: 25.5 },
    { code: "567011", date: "02/09", amount: 25.5 },
    { code: "567011", date: "04/09", amount: 25.5 },
    { code: "567011", date: "09/09", amount: 25.5 },
    { code: "567011", date: "11/09", amount: 25.5 },
    { code: "567011", date: "16/09", amount: 25.5 },
  ];

  const services = Array.from({ length: 20 }, () => ({
    code: "",
    date: "",
    amount: 0,
    used: false,
  }));

  sessions.forEach((s, i) => {
    services[i] = { ...s, used: true };
  });

  return services;
}

export const DEMO_ATTESTATION = {
  patient: {
    lastName: "Henrard",
    firstName: "Philippe",
    niss: "72.08.15-413.27",
    mutuelle: "0",
    address: "Rue des Wallons 42 4000 Liège",
  },
  services: buildDemoServices(),
  totalAmount: 153.0,
  patientPaid: 0,
  attestationDate: "01/09/2026",
  receiptText: "",
  invoiceRef: "Ref: 2026-2873",
  prescriberName: "Blin Aylin",
  prescriberDate: "12 12 2025",
  prescriberInami: "4/58789/68/545",
};
