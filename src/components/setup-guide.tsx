"use client";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getPrinterModelInfo } from "@/lib/printer-models";
import { AlertCircle, CheckCircle2, Printer } from "lucide-react";

const LX350_STEPS = [
  {
    title: "Charger le papier continu",
    description:
      "Insérez le carnet d'attestations par l'arrière (tracteur). Largeur 241 mm (Std plié allemand). Alignez le bord sur la flèche marquée sur l'imprimante.",
  },
  {
    title: "USB + allumage",
    description:
      "Branchez la LX-350 en USB. Allumez-la avant d'ouvrir hygiePrint, CareConnect ou KineQuick — sinon le format papier peut disparaître de la config.",
  },
  {
    title: "Installer le pilote Epson",
    description:
      "Téléchargez le pilote officiel LX-350 sur epson.eu. Vérifiez qu'elle apparaît dans les imprimantes Windows/Mac.",
  },
  {
    title: "Format « Std plié allemand »",
    description:
      "Dans les propriétés d'impression : format « Std plié allemand ». Qualité Draft pour la vitesse, NLQ pour une meilleure lisibilité.",
  },
  {
    title: "Calibrer avec hygiePrint",
    description:
      "Onglet Calibration → imprimez la page de test. Ajustez les marges X/Y jusqu'à l'alignement sur votre carnet pré-imprimé.",
  },
  {
    title: "Bouton Load/Eject",
    description:
      "Si l'impression est décalée : appuyez 2× sur Load/Eject pour réinitialiser le chargement du papier.",
  },
];

const WEB_PRINT_TIPS = [
  "Destination : Epson LX-350",
  "Format du papier : « STD plié allemand »",
  "Windows : échelle « Ajuster à la taille du papier »",
  "Mac : ne pas modifier l'échelle",
  "Vérifiez la configuration avant chaque impression via le navigateur",
];

const lx350 = getPrinterModelInfo("epson-lx-350");

export function SetupGuide() {
  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="size-4" />
        <AlertTitle>Epson LX-350 — votre imprimante</AlertTitle>
        <AlertDescription>
          Imprimante matricielle 9 aiguilles, 80 colonnes, papier continu
          jusqu&apos;à 254 mm de large. Idéale pour les carnets d&apos;attestations
          belges (original + copies). hygiePrint est préconfiguré pour ce modèle.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Printer className="size-5" />
              Configuration LX-350
            </CardTitle>
            <CardDescription>
              9 pins · USB · papier continu arrière · jusqu&apos;à 5 feuillets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {LX350_STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-3">
                  <Badge variant="secondary" className="mt-0.5 shrink-0">
                    {i + 1}
                  </Badge>
                  <div>
                    <p className="font-medium">{step.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            {lx350.driverUrl && (
              <p className="mt-4 text-sm">
                <a
                  href={lx350.driverUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Pilote officiel Epson LX-350
                </a>
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Impression via le navigateur</CardTitle>
            <CardDescription>
              CareConnect Web, PDF Chrome → Epson LX-350
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {WEB_PRINT_TIPS.map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-600" />
                  {tip}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
