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
import { AlertCircle, CheckCircle2, Printer } from "lucide-react";

const STEPS = [
  {
    title: "Brancher et allumer l'imprimante",
    description:
      "Connectez l'imprimante matricielle (EPSON LQ, OKI Microline…) via USB. Allumez-la avant de lancer votre logiciel médical — sinon le format papier peut disparaître de la configuration.",
  },
  {
    title: "Installer le pilote",
    description:
      "Installez le pilote officiel du fabricant. Vérifiez que l'imprimante est visible dans les périphériques Windows/Mac avant de configurer CareConnect, KineQuick ou hygiePrint.",
  },
  {
    title: "Format « Std plié allemand »",
    description:
      "Dans les paramètres d'impression, sélectionnez le format « Std plié allemand ». Sur les imprimantes OKI, ce champ peut parfois rester vide — c'est normal.",
  },
  {
    title: "Calibrer les marges",
    description:
      "Imprimez une page de test depuis l'onglet Calibration. Ajustez les marges X (horizontal) et Y (vertical) jusqu'à ce que le texte s'aligne sur votre formulaire pré-imprimé.",
  },
  {
    title: "Bouton Load/Eject",
    description:
      "Si l'impression est décalée après un redémarrage, appuyez deux fois sur le bouton Load/Eject de l'imprimante pour réinitialiser le chargement du papier.",
  },
];

const WEB_PRINT_TIPS = [
  "Sélectionnez votre imprimante EPSON/OKI dans la fenêtre d'impression",
  "Format du papier : « STD plié allemand »",
  "Windows : échelle « Ajuster à la taille du papier »",
  "Mac : ne pas modifier l'échelle",
  "Vérifiez la configuration avant chaque impression via le navigateur",
];

export function SetupGuide() {
  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="size-4" />
        <AlertTitle>Contexte belge — attestations de soins</AlertTitle>
        <AlertDescription>
          Les médecins et kinésithérapeutes belges utilisent encore des
          imprimantes matricielles pour imprimer sur des formulaires
          pré-imprimés (attestations de soins). Depuis septembre 2025,{" "}
          <strong>eAttest</strong> est obligatoire pour les médecins et
          dentistes ; pour les kinés, l&apos;obligation entre en vigueur en
          janvier 2027. L&apos;attestation papier reste utile en cas de panne
          réseau ou pour le document justificatif patient.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Printer className="size-5" />
              Configuration matérielle
            </CardTitle>
            <CardDescription>
              Imprimantes compatibles : EPSON LQ-350, LQ-690, OKI Microline…
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {STEPS.map((step, i) => (
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Impression via le navigateur</CardTitle>
            <CardDescription>
              Si vous utilisez CareConnect Web ou un PDF dans Chrome
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
