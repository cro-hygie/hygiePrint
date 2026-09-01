"use client";

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
import { Textarea } from "@/components/ui/textarea";
import type { AppSettings, PractitionerProfile } from "@/lib/types";

interface PractitionerFormProps {
  settings: AppSettings;
  onChange: (patch: Partial<AppSettings>) => void;
}

export function PractitionerForm({
  settings,
  onChange,
}: PractitionerFormProps) {
  const { practitioner } = settings;

  const update = (patch: Partial<PractitionerProfile>) => {
    onChange({ practitioner: { ...practitioner, ...patch } });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prestataire de soins</CardTitle>
        <CardDescription>
          Informations imprimées sur le cachet de l&apos;attestation (nom,
          INAMI, BCE…)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Profession</Label>
          <Select
            value={practitioner.profession}
            onValueChange={(v) =>
              update({ profession: v as PractitionerProfile["profession"] })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="medecin">Médecin</SelectItem>
              <SelectItem value="kine">Kinésithérapeute</SelectItem>
              <SelectItem value="dentiste">Dentiste</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="lastName">Nom</Label>
            <Input
              id="lastName"
              value={practitioner.lastName}
              onChange={(e) => update({ lastName: e.target.value })}
              placeholder="Martin"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              id="firstName"
              value={practitioner.firstName}
              onChange={(e) => update({ firstName: e.target.value })}
              placeholder="Jean"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="inami">N° INAMI</Label>
            <Input
              id="inami"
              value={practitioner.inamiNumber}
              onChange={(e) => update({ inamiNumber: e.target.value })}
              placeholder="1-23456-78-901"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bce">N° BCE (TVA)</Label>
            <Input
              id="bce"
              value={practitioner.bceNumber}
              onChange={(e) => update({ bceNumber: e.target.value })}
              placeholder="BE0123456789"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Adresse du cabinet</Label>
          <Input
            id="address"
            value={practitioner.address}
            onChange={(e) => update({ address: e.target.value })}
            placeholder="Rue de la Loi 16"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="postal">Code postal</Label>
            <Input
              id="postal"
              value={practitioner.postalCode}
              onChange={(e) => update({ postalCode: e.target.value })}
              placeholder="1000"
            />
          </div>
          <div className="col-span-2 space-y-2">
            <Label htmlFor="city">Commune</Label>
            <Input
              id="city"
              value={practitioner.city}
              onChange={(e) => update({ city: e.target.value })}
              placeholder="Bruxelles"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            value={practitioner.phone}
            onChange={(e) => update({ phone: e.target.value })}
            placeholder="+32 2 123 45 67"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="receipt">Texte libre sur le reçu</Label>
          <Textarea
            id="receipt"
            value={settings.attestation.receiptText}
            onChange={(e) =>
              onChange({
                attestation: {
                  ...settings.attestation,
                  receiptText: e.target.value,
                },
              })
            }
            placeholder="Texte complémentaire (ex. mention légale)"
            rows={2}
          />
        </div>
      </CardContent>
    </Card>
  );
}
