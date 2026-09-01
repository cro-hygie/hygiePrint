import type { PrinterModel } from "./types";

export interface PrinterModelInfo {
  id: PrinterModel;
  label: string;
  paperFormat: string;
  tips: string[];
  driverUrl?: string;
}

export const PRINTER_MODELS: Record<PrinterModel, PrinterModelInfo> = {
  "epson-lx-350": {
    id: "epson-lx-350",
    label: "Epson LX-350",
    paperFormat: "Std plié allemand",
    driverUrl: "https://www.epson.eu/en_EU/products/printers/dot-matrix/epson-lx-350/p/11848",
    tips: [
      "Chargez le papier continu par l'arrière (tracteur push) — largeur 241 mm compatible.",
      "Alignez le bord du papier sur la flèche indiquée sur l'imprimante.",
      "Branchez en USB et allumez l'imprimante avant d'ouvrir hygiePrint ou CareConnect.",
      "Dans le pilote : format « Std plié allemand », qualité Draft ou NLQ selon lisibilité.",
      "Si le texte est décalé après redémarrage : 2× bouton Load/Eject sur l'imprimante.",
      "Carnet multi-parties : jusqu'à 5 feuillets (original + 4 copies) — épaisseur max 0,39 mm.",
    ],
  },
  "epson-lq-350": {
    id: "epson-lq-350",
    label: "Epson LQ-350",
    paperFormat: "Std plié allemand",
    tips: [
      "Même configuration que la LX-350 : format Std plié allemand, USB, Load/Eject.",
    ],
  },
  oki: {
    id: "oki",
    label: "OKI Microline",
    paperFormat: "Std plié allemand",
    tips: [
      "Sur certaines OKI, le champ format papier peut rester vide — c'est normal.",
      "Vérifiez le format « Std plié allemand » dans les propriétés d'impression.",
    ],
  },
  autre: {
    id: "autre",
    label: "Autre imprimante matricielle",
    paperFormat: "Std plié allemand",
    tips: [
      "Utilisez une police monospace et le format papier recommandé par votre logiciel médical.",
    ],
  },
};

export function getPrinterModelInfo(model: PrinterModel): PrinterModelInfo {
  return PRINTER_MODELS[model] ?? PRINTER_MODELS.autre;
}

/** Rétrocompatibilité localStorage (ancienne valeur « epson »). */
export function normalizePrinterModel(model: string): PrinterModel {
  if (model === "epson") return "epson-lx-350";
  if (model in PRINTER_MODELS) return model as PrinterModel;
  return "epson-lx-350";
}
