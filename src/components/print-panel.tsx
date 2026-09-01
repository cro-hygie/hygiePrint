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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { exportAttestationToPdf, exportElementToPdf, pdfFilename } from "@/lib/export-pdf";
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
  const [showFieldMarkers, setShowFieldMarkers] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const { simulatePaper } = settings;

  const handlePrint = () => {
    window.print();
  };

  const handleExportPdf = async (includeScan = false) => {
    setExporting(true);
    setExportError(null);
    try {
      if (!printAreaRef.current) {
        throw new Error("La zone d'aperçu est vide — rechargez la page.");
      }
      const prefix = mode === "test" ? "calibration" : "attestation";
      const filename = pdfFilename(
        prefix,
        includeScan ? "controle" : "impression",
      );
      if (mode === "attestation") {
        await exportAttestationToPdf(printAreaRef.current, filename, {
          includeScan,
        });
      } else {
        await exportElementToPdf(printAreaRef.current, filename, {
          includeScan,
        });
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "L'export PDF a échoué.";
      setExportError(message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-dashed">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            {mode === "attestation"
              ? "Votre formulaire Mod. G11 FR"
              : "Mode simulation (sans imprimante)"}
          </CardTitle>
          <CardDescription>
            {mode === "attestation"
              ? "Remplissez d'abord l'onglet Attestation, puis vérifiez l'alignement ici. Ajustez les marges X/Y dans Configuration si besoin."
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
          onClick={() => handleExportPdf(false)}
          variant="secondary"
          disabled={exporting}
        >
          <Download className="mr-2 size-4" />
          {exporting ? "Export en cours…" : "Exporter PDF (impression)"}
        </Button>

        {mode === "attestation" && (
          <Button
            onClick={() => handleExportPdf(true)}
            variant="outline"
            disabled={exporting}
          >
            <Download className="mr-2 size-4" />
            PDF contrôle (avec scan)
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
            ? "Le PDF d'impression reprend exactement l'aperçu (texte seul). Utilisez « PDF contrôle (avec scan) » pour vérifier l'alignement sur papier blanc avant d'imprimer sur le carnet."
            : simulatePaper
              ? "Le scan du formulaire G11 est affiché en fond. Alignez le carré rouge sur le coin d'impression."
              : "Activez « Afficher le scan du formulaire G11 » pour voir votre image en fond."}
        </p>
      </div>
    </div>
  );
}
