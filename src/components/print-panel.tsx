"use client";

import { AttestationSheet } from "@/components/attestation-sheet";
import { TestPage } from "@/components/test-page";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { exportAttestationToPdf, exportElementToPdf, pdfFilename } from "@/lib/export-pdf";
import { DEMO_ATTESTATION, DEMO_PRACTITIONER } from "@/lib/demo-data";
import type { AppSettings } from "@/lib/types";
import { Download, FileText, Printer, RotateCcw } from "lucide-react";
import { useRef, useState } from "react";

interface PrintPanelProps {
  settings: AppSettings;
  onChange: (patch: Partial<AppSettings>) => void;
  mode: "attestation" | "test";
}

export function PrintPanel({ settings, onChange, mode }: PrintPanelProps) {
  const printAreaRef = useRef<HTMLDivElement>(null);
  const [showGrid, setShowGrid] = useState(false);
  const [showFieldMarkers, setShowFieldMarkers] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const { attestation, simulatePaper } = settings;

  const handlePrint = () => {
    window.print();
  };

  const handleExportPdf = async () => {
    setExporting(true);
    setExportError(null);
    try {
      const prefix = mode === "test" ? "calibration" : "attestation";
      const filename = pdfFilename(prefix);
      if (mode === "attestation") {
        exportAttestationToPdf(settings, filename);
      } else {
        if (!printAreaRef.current) return;
        await exportElementToPdf(printAreaRef.current, filename);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "L'export PDF a échoué.";
      setExportError(message);
    } finally {
      setExporting(false);
    }
  };

  const handleResetDemo = () => {
    onChange({
      practitioner: { ...DEMO_PRACTITIONER },
      attestation: { ...DEMO_ATTESTATION },
    });
  };

  return (
    <div className="space-y-6">
      {mode === "attestation" && (
        <Card>
          <CardHeader>
            <CardTitle>Démo kiné — Philippe Henrard</CardTitle>
            <CardDescription>
              6 séances (code 567011) — données fictives mais réalistes pour
              tester l&apos;alignement sur le Mod. G11 FR *17*
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Nom patient</Label>
              <Input
                value={attestation.patient.lastName}
                onChange={(e) =>
                  onChange({
                    attestation: {
                      ...attestation,
                      patient: {
                        ...attestation.patient,
                        lastName: e.target.value,
                      },
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Prénom</Label>
              <Input
                value={attestation.patient.firstName}
                onChange={(e) =>
                  onChange({
                    attestation: {
                      ...attestation,
                      patient: {
                        ...attestation.patient,
                        firstName: e.target.value,
                      },
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>NISS</Label>
              <Input
                value={attestation.patient.niss}
                onChange={(e) =>
                  onChange({
                    attestation: {
                      ...attestation,
                      patient: {
                        ...attestation.patient,
                        niss: e.target.value,
                      },
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Mutuelle</Label>
              <Input
                value={attestation.patient.mutuelle}
                onChange={(e) =>
                  onChange({
                    attestation: {
                      ...attestation,
                      patient: {
                        ...attestation.patient,
                        mutuelle: e.target.value,
                      },
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Adresse patient</Label>
              <Input
                value={attestation.patient.address}
                onChange={(e) =>
                  onChange({
                    attestation: {
                      ...attestation,
                      patient: {
                        ...attestation.patient,
                        address: e.target.value,
                      },
                    },
                  })
                }
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-dashed">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            {mode === "attestation"
              ? "Votre formulaire Mod. G11 FR"
              : "Mode simulation (sans imprimante)"}
          </CardTitle>
          <CardDescription>
            {mode === "attestation"
              ? "Le scan que vous avez envoyé sert de fond. Ajustez les marges X/Y pour aligner le texte sur les pointillés."
              : "Superposez la page de test sur le formulaire pour calibrer l'imprimante."}
          </CardDescription>
        </CardHeader>
        {mode === "test" && (
          <CardContent className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch
                checked={simulatePaper}
                onCheckedChange={(v) => onChange({ simulatePaper: v })}
              />
              <Label>Afficher le scan du formulaire G11</Label>
            </div>
          </CardContent>
        )}
        {mode === "attestation" && (
          <CardContent className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch checked={showGrid} onCheckedChange={setShowGrid} />
              <Label>Grille d&apos;alignement (mm)</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={showFieldMarkers}
                onCheckedChange={setShowFieldMarkers}
              />
              <Label>Marqueurs de champs (points rouges)</Label>
            </div>
          </CardContent>
        )}
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={handlePrint} variant="default">
          <Printer className="mr-2 size-4" />
          {mode === "test"
            ? "Imprimer la page de test"
            : "Imprimer l'attestation"}
        </Button>

        <Button
          onClick={handleExportPdf}
          variant="secondary"
          disabled={exporting}
        >
          <Download className="mr-2 size-4" />
          {exporting ? "Export en cours…" : "Exporter en PDF"}
        </Button>

        {mode === "attestation" && (
          <Button onClick={handleResetDemo} variant="outline">
            <RotateCcw className="mr-2 size-4" />
            Recharger la démo
          </Button>
        )}
      </div>

      {exportError && (
        <p className="text-sm text-destructive" role="alert">
          {exportError}
        </p>
      )}

      <div className="overflow-x-auto rounded-lg border bg-muted/30 p-4 print:border-none print:bg-white print:p-0">
        <div
          ref={printAreaRef}
          className="print-area mx-auto inline-block shadow-lg print:shadow-none"
        >
          {mode === "test" ? (
            <TestPage
              printer={settings.printer}
              simulatePaper={simulatePaper}
            />
          ) : (
            <AttestationSheet
              settings={settings}
              showGrid={showGrid}
              showFieldMarkers={showFieldMarkers}
              simulatePaper
            />
          )}
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
        <FileText className="mt-0.5 size-4 shrink-0" />
        <p>
          {mode === "attestation"
            ? "À l'écran : scan visible pour calibrer. Export PDF / impression : texte seul (sans scan), pour votre carnet pré-imprimé."
            : simulatePaper
              ? "Le scan du formulaire G11 est affiché en fond. Alignez le carré rouge sur le coin d'impression."
              : "Activez « Afficher le scan du formulaire G11 » pour voir votre image en fond."}
        </p>
      </div>
    </div>
  );
}
