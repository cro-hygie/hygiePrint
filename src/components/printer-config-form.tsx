"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import type { AppSettings, PrinterConfig } from "@/lib/types";

interface PrinterConfigFormProps {
  settings: AppSettings;
  onChange: (patch: Partial<AppSettings>) => void;
}

export function PrinterConfigForm({
  settings,
  onChange,
}: PrinterConfigFormProps) {
  const { printer } = settings;

  const updatePrinter = (patch: Partial<PrinterConfig>) => {
    onChange({ printer: { ...printer, ...patch } });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Imprimante matricielle</CardTitle>
        <CardDescription>
          Réglages équivalents à CareConnect / KineQuick — format Std plié
          allemand
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Modèle d&apos;imprimante</Label>
            <Select
              value={printer.model}
              onValueChange={(v) =>
                updatePrinter({ model: v as PrinterConfig["model"] })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="epson">EPSON (LQ-350, LQ-690…)</SelectItem>
                <SelectItem value="oki">OKI Microline</SelectItem>
                <SelectItem value="autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Format papier</Label>
            <Input value="Std plié allemand" disabled />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Marge X (mm) — décalage horizontal</Label>
              <span className="text-sm text-muted-foreground">
                {printer.marginX} mm
              </span>
            </div>
            <Slider
              value={[printer.marginX]}
              onValueChange={(v) => {
                const val = Array.isArray(v) ? v[0] : v;
                updatePrinter({ marginX: val ?? 0 });
              }}
              min={-10}
              max={20}
              step={0.5}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Marge Y (mm) — décalage vertical</Label>
              <span className="text-sm text-muted-foreground">
                {printer.marginY} mm
              </span>
            </div>
            <Slider
              value={[printer.marginY]}
              onValueChange={(v) => {
                const val = Array.isArray(v) ? v[0] : v;
                updatePrinter({ marginY: val ?? 0 });
              }}
              min={-10}
              max={20}
              step={0.5}
            />
          </div>
        </div>

        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Champ A.M 21.1.94 — afficher le montant</Label>
              <p className="text-xs text-muted-foreground">
                Sinon, imprime « OUI » (convention belge)
              </p>
            </div>
            <Switch
              checked={printer.showAmountOnAttestation}
              onCheckedChange={(v) =>
                updatePrinter({ showAmountOnAttestation: v })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Barrer les prestations inutilisées</Label>
              <p className="text-xs text-muted-foreground">
                Trace un trait sur les lignes vides du formulaire
              </p>
            </div>
            <Switch
              checked={printer.strikeUnusedServices}
              onCheckedChange={(v) =>
                updatePrinter({ strikeUnusedServices: v })
              }
            />
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() =>
            onChange({
              printer: {
                ...printer,
                marginX: 0,
                marginY: 0,
              },
            })
          }
        >
          Réinitialiser les marges
        </Button>
      </CardContent>
    </Card>
  );
}
