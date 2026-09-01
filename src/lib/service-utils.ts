import { SERVICE_SLOT_COUNT } from "./attestation-layout";
import type { ServiceLine } from "./types";

export const EMPTY_SERVICE: ServiceLine = {
  code: "",
  date: "",
  amount: 0,
  used: false,
};

/** Garantit exactement 20 emplacements (10 lignes × 2 colonnes sur le G11). */
export function normalizeServices(services: ServiceLine[]): ServiceLine[] {
  const normalized = services.map((s) => ({ ...s }));
  while (normalized.length < SERVICE_SLOT_COUNT) {
    normalized.push({ ...EMPTY_SERVICE });
  }
  return normalized.slice(0, SERVICE_SLOT_COUNT);
}

export function usedServiceCount(services: ServiceLine[]): number {
  return services.filter((s) => s.used).length;
}

export function recalculateTotal(services: ServiceLine[]): number {
  return services
    .filter((s) => s.used && s.amount > 0)
    .reduce((sum, s) => sum + s.amount, 0);
}

export function updateServiceAt(
  services: ServiceLine[],
  index: number,
  patch: Partial<ServiceLine>,
): ServiceLine[] {
  const next = normalizeServices(services);
  const current = next[index] ?? { ...EMPTY_SERVICE };
  const updated = { ...current, ...patch };

  if (patch.used === false) {
    next[index] = { ...EMPTY_SERVICE };
  } else {
    const active =
      patch.used === true ||
      updated.used ||
      Boolean(updated.date || updated.code || updated.amount > 0);
    next[index] = { ...updated, used: active };
  }

  return next;
}

export function addService(
  services: ServiceLine[],
  defaults: Partial<ServiceLine> = {},
): ServiceLine[] {
  const next = normalizeServices(services);
  const freeIndex =
    next.findIndex((s, i) => !s.used && i % 2 === 0) ??
    -1;
  const index =
    freeIndex >= 0 ? freeIndex : next.findIndex((s) => !s.used);
  if (index === -1) return next;

  next[index] = {
    code: defaults.code ?? "567011",
    date: defaults.date ?? "",
    amount: defaults.amount ?? 25.5,
    used: true,
  };
  return next;
}

export function removeServiceAt(
  services: ServiceLine[],
  index: number,
): ServiceLine[] {
  return updateServiceAt(services, index, { used: false });
}

export function withRecalculatedTotals(
  services: ServiceLine[],
  patientPaid?: number,
): { services: ServiceLine[]; totalAmount: number; patientPaid: number } {
  const normalized = normalizeServices(services);
  const totalAmount = recalculateTotal(normalized);
  return {
    services: normalized,
    totalAmount,
    patientPaid: patientPaid ?? totalAmount,
  };
}
