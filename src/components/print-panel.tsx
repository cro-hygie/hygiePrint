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
import type { AppSettings } from "@/lib/types";
import { Printer } from "lucide-react";
import { useState } from "react";

interface PrintPanelProps {
  settings: AppSettings;
  onChange: (patch: Partial<AppSettings>) => void;
  mode: "attestation" | "test";
}

export function PrintPanel({ settings, onChange, mode }: PrintPanelProps) {
  const [showGrid, setShowGrid] = useState(true);
  const { attestation } = settings;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {mode === "attestation" && (
        <Card>
          <CardHeader>
            <CardTitle>Données de démonstration</CardTitle>
            <CardDescription>
              Modifiez les champs pour tester l&apos;alignement sur votre
              formulaire pré-imprimé
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

      <div className="flex flex-wrap items-center gap-4">
        <Button onClick={handlePrint}>
          <Printer className="mr-2 size-4" />
          {mode === "test"
            ? "Imprimer la page de test"
            : "Imprimer l'attestation"}
        </Button>

        {mode === "attestation" && (
          <div className="flex items-center gap-2">
            <Switch checked={showGrid} onCheckedChange={setShowGrid} />
            <Label>Afficher la grille d&apos;alignement</Label>
          </div>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border bg-muted/30 p-4 print:border-none print:bg-white print:p-0">
        <div className="print-area mx-auto inline-block shadow-lg print:shadow-none">
          {mode === "test" ? (
            <TestPage printer={settings.printer} />
          ) : (
            <AttestationSheet
              settings={settings}
              showGrid={showGrid}
            />
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Rappel : sélectionnez le format « Std plié allemand » et votre
        imprimante EPSON/OKI dans la boîte de dialogue d&apos;impression.
        Sur Windows, choisissez « Ajuster à la taille du papier ».
      </p>
    </div>
  );
}
