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
import { exportElementToPdf, pdfFilename } from "@/lib/export-pdf";
import type { AppSettings } from "@/lib/types";
import { Download, FileText, Printer } from "lucide-react";
import { useRef, useState } from "react";

interface PrintPanelProps {
  settings: AppSettings;
  onChange: (patch: Partial<AppSettings>) => void;
  mode: "attestation" | "test";
}

export function PrintPanel({ settings, onChange, mode }: PrintPanelProps) {
  const printAreaRef = useRef<HTMLDivElement>(null);
  const [showGrid, setShowGrid] = useState(false);
  const [exporting, setExporting] = useState(false);
  const { attestation, simulatePaper } = settings;

  const handlePrint = () => {
    window.print();
  };

  const handleExportPdf = async () => {
    if (!printAreaRef.current) return;
    setExporting(true);
    try {
      const prefix = mode === "test" ? "calibration" : "attestation";
      await exportElementToPdf(printAreaRef.current, pdfFilename(prefix));
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {mode === "attestation" && (
        <Card>
          <CardHeader>
            <CardTitle>Données de démonstration</CardTitle>
            <CardDescription>
              Modifiez les champs pour tester l&apos;alignement sur le formulaire
              simulé ou pré-imprimé
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
          </CardContent>
        </Card>
      )}

      <Card className="border-dashed">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Mode simulation (sans imprimante)</CardTitle>
          <CardDescription>
            Superposez le texte sur un formulaire pré-imprimé simulé, puis
            exportez en PDF pour archiver vos réglages avant le test réel.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <Switch
              checked={simulatePaper}
              onCheckedChange={(v) => onChange({ simulatePaper: v })}
            />
            <Label>Formulaire pré-imprimé simulé</Label>
          </div>

          {mode === "attestation" && (
            <div className="flex items-center gap-2">
              <Switch checked={showGrid} onCheckedChange={setShowGrid} />
              <Label>Grille d&apos;alignement (mm)</Label>
            </div>
          )}
        </CardContent>
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
      </div>

      <div className="overflow-x-auto rounded-lg border bg-muted/30 p-4 print:border-none print:bg-white print:p-0">
        <div
          ref={printAreaRef}
          className="print-area mx-auto inline-block shadow-lg print:shadow-none"
        >
          {mode === "test" ? (
            <TestPage
              printer={settings.printer}
              simulatePaper={simulatePaper}
              profession={settings.practitioner.profession}
            />
          ) : (
            <AttestationSheet
              settings={settings}
              showGrid={showGrid}
              simulatePaper={simulatePaper}
            />
          )}
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
        <FileText className="mt-0.5 size-4 shrink-0" />
        <p>
          {simulatePaper
            ? "Le fond simule un carnet pré-imprimé belge. Ajustez les marges dans Configuration jusqu'à ce que le texte tombe dans les cases. Exportez le PDF pour comparer plus tard avec l'impression réelle."
            : "Activez la simulation pour visualiser l'alignement sur un formulaire pré-imprimé sans avoir l'imprimante sous la main."}
        </p>
      </div>
    </div>
  );
}
