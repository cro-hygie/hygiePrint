import { DEFAULT_SETTINGS, type AppSettings } from "./types";
import { normalizePrinterModel } from "./printer-models";

const STORAGE_KEY = "hygieprint-settings";

export function loadSettings(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      printer: {
        ...DEFAULT_SETTINGS.printer,
        ...parsed.printer,
        model: normalizePrinterModel(parsed.printer?.model ?? "epson-lx-350"),
      },
      practitioner: { ...DEFAULT_SETTINGS.practitioner, ...parsed.practitioner },
      attestation: {
        ...DEFAULT_SETTINGS.attestation,
        ...parsed.attestation,
        patient: {
          ...DEFAULT_SETTINGS.attestation.patient,
          ...parsed.attestation?.patient,
        },
      },
      simulatePaper: parsed.simulatePaper ?? DEFAULT_SETTINGS.simulatePaper,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
