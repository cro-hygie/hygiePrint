"use client";

import { PractitionerForm } from "@/components/practitioner-form";
import { PrintPanel } from "@/components/print-panel";
import { PrinterConfigForm } from "@/components/printer-config-form";
import { SetupGuide } from "@/components/setup-guide";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSettings } from "@/hooks/use-settings";
import { Printer } from "lucide-react";

export default function HomePage() {
  const { settings, updateSettings, loaded } = useSettings();

  if (!loaded) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Chargement…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <Printer className="size-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">hygiePrint</h1>
          <Badge variant="secondary">Belgique</Badge>
        </div>
        <p className="max-w-2xl text-muted-foreground">
          Calibration d&apos;impression pour le formulaire belge{" "}
          <strong>Mod. G11 FR</strong> — Attestation de soins donnés — sur
          imprimante matricielle Epson LX-350 (format Std plié allemand).
        </p>
      </header>

      <Tabs defaultValue="guide" className="space-y-6">
        <TabsList className="flex h-auto flex-wrap">
          <TabsTrigger value="guide">Guide</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="calibration">Calibration</TabsTrigger>
          <TabsTrigger value="preview">Aperçu attestation</TabsTrigger>
        </TabsList>

        <TabsContent value="guide">
          <SetupGuide />
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          <PrinterConfigForm settings={settings} onChange={updateSettings} />
          <PractitionerForm settings={settings} onChange={updateSettings} />
        </TabsContent>

        <TabsContent value="calibration">
          <PrintPanel
            settings={settings}
            onChange={updateSettings}
            mode="test"
          />
        </TabsContent>

        <TabsContent value="preview">
          <PrintPanel
            settings={settings}
            onChange={updateSettings}
            mode="attestation"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
