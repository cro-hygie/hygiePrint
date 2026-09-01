"use client";

import { useCallback, useEffect, useState } from "react";
import { loadSettings, saveSettings } from "@/lib/storage";
import type { AppSettings } from "@/lib/types";
import { DEFAULT_SETTINGS } from "@/lib/types";

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
    setLoaded(true);
  }, []);

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = {
        ...prev,
        ...patch,
        printer: { ...prev.printer, ...patch.printer },
        practitioner: { ...prev.practitioner, ...patch.practitioner },
        attestation: {
          ...prev.attestation,
          ...patch.attestation,
          patient: {
            ...prev.attestation.patient,
            ...patch.attestation?.patient,
          },
          services:
            patch.attestation?.services ?? prev.attestation.services,
        },
        simulatePaper: patch.simulatePaper ?? prev.simulatePaper,
      };
      saveSettings(next);
      return next;
    });
  }, []);

  return { settings, updateSettings, loaded };
}
