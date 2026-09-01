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
import { SERVICE_SLOT_COUNT } from "@/lib/attestation-layout";
import { DEMO_ATTESTATION, DEMO_PRACTITIONER } from "@/lib/demo-data";
import {
  addService,
  normalizeServices,
  removeServiceAt,
  updateServiceAt,
  usedServiceCount,
  withRecalculatedTotals,
} from "@/lib/service-utils";
import type { AppSettings } from "@/lib/types";
import { Plus, RotateCcw, Trash2 } from "lucide-react";

interface AttestationFormProps {
  settings: AppSettings;
  onChange: (patch: Partial<AppSettings>) => void;
}

export function AttestationForm({ settings, onChange }: AttestationFormProps) {
  const { attestation } = settings;
  const services = normalizeServices(attestation.services);
  const activeCount = usedServiceCount(services);

  const updateAttestation = (
    patch: Partial<AppSettings["attestation"]>,
    recalc = false,
  ) => {
    const next = { ...attestation, ...patch };
    if (recalc && patch.services) {
      const totals = withRecalculatedTotals(
        patch.services,
        next.patientPaid,
      );
      onChange({
        attestation: {
          ...next,
          services: totals.services,
          totalAmount: totals.totalAmount,
          patientPaid: totals.patientPaid,
        },
      });
      return;
    }
    onChange({ attestation: next });
  };

  const handleServiceChange = (
    index: number,
    field: "date" | "code" | "amount",
    value: string,
  ) => {
    const patch: Partial<(typeof services)[0]> =
      field === "amount"
        ? { amount: parseFloat(value) || 0, used: true }
        : { [field]: value, used: true };
    const nextServices = updateServiceAt(services, index, patch);
    updateAttestation({ services: nextServices }, true);
  };

  const handleAddService = () => {
    const nextServices = addService(services);
    updateAttestation({ services: nextServices }, true);
  };

  const handleRemoveService = (index: number) => {
    const nextServices = removeServiceAt(services, index);
    updateAttestation({ services: nextServices }, true);
  };

  const handleResetDemo = () => {
    onChange({
      practitioner: { ...DEMO_PRACTITIONER },
      attestation: { ...DEMO_ATTESTATION },
    });
  };

  const usedIndices = services
    .map((s, i) => (s.used ? i : -1))
    .filter((i) => i >= 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Patient</CardTitle>
          <CardDescription>
            Informations imprimées en haut du formulaire G11
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label>Nom</Label>
            <Input
              value={attestation.patient.lastName}
              onChange={(e) =>
                updateAttestation({
                  patient: {
                    ...attestation.patient,
                    lastName: e.target.value,
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
                updateAttestation({
                  patient: {
                    ...attestation.patient,
                    firstName: e.target.value,
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
                updateAttestation({
                  patient: {
                    ...attestation.patient,
                    niss: e.target.value,
                  },
                })
              }
              placeholder="00.00.00-000.00"
            />
          </div>
          <div className="space-y-2">
            <Label>Mutuelle</Label>
            <Input
              value={attestation.patient.mutuelle}
              onChange={(e) =>
                updateAttestation({
                  patient: {
                    ...attestation.patient,
                    mutuelle: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Adresse</Label>
            <Input
              value={attestation.patient.address}
              onChange={(e) =>
                updateAttestation({
                  patient: {
                    ...attestation.patient,
                    address: e.target.value,
                  },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4">
          <div>
            <CardTitle>Prestations / soins</CardTitle>
            <CardDescription>
              Colonne gauche (lignes 1–10) puis colonne droite (11–20), comme
              hygie-soft. Code kiné courant : 567011.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddService}
            disabled={activeCount >= SERVICE_SLOT_COUNT}
          >
            <Plus className="mr-2 size-4" />
            Ajouter une prestation
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {usedIndices.length === 0 ? (
            <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              Aucune prestation. Cliquez sur « Ajouter une prestation » pour
              commencer.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="border-b bg-muted/50 text-left">
                    <th className="px-3 py-2 font-medium">#</th>
                    <th className="px-3 py-2 font-medium">Date (JJ/MM)</th>
                    <th className="px-3 py-2 font-medium">N° nomenclature</th>
                    <th className="px-3 py-2 font-medium">Montant (€)</th>
                    <th className="px-3 py-2 font-medium w-12" />
                  </tr>
                </thead>
                <tbody>
                  {usedIndices.map((index, displayIndex) => {
                    const service = services[index];
                    return (
                      <tr key={index} className="border-b last:border-0">
                        <td className="px-3 py-2 text-muted-foreground">
                          {displayIndex + 1}
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            value={service.date}
                            onChange={(e) =>
                              handleServiceChange(
                                index,
                                "date",
                                e.target.value,
                              )
                            }
                            placeholder="02/09"
                            className="h-8"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            value={service.code}
                            onChange={(e) =>
                              handleServiceChange(
                                index,
                                "code",
                                e.target.value,
                              )
                            }
                            placeholder="567011"
                            className="h-8 font-mono"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={service.amount || ""}
                            onChange={(e) =>
                              handleServiceChange(
                                index,
                                "amount",
                                e.target.value,
                              )
                            }
                            className="h-8"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8 text-destructive hover:text-destructive"
                            onClick={() => handleRemoveService(index)}
                            aria-label="Supprimer la prestation"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            {activeCount}/{SERVICE_SLOT_COUNT} emplacements utilisés — Total :{" "}
            <strong>{attestation.totalAmount.toFixed(2)} €</strong>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prescription & montants</CardTitle>
          <CardDescription>
            Bas de l&apos;attestation et reçu patient
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label>Prescrit par</Label>
            <Input
              value={attestation.prescriberName}
              onChange={(e) =>
                updateAttestation({ prescriberName: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Date prescription</Label>
            <Input
              value={attestation.prescriberDate}
              onChange={(e) =>
                updateAttestation({ prescriberDate: e.target.value })
              }
              placeholder="15/07/2026"
            />
          </div>
          <div className="space-y-2">
            <Label>INAMI prescripteur</Label>
            <Input
              value={attestation.prescriberInami}
              onChange={(e) =>
                updateAttestation({ prescriberInami: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Référence facture</Label>
            <Input
              value={attestation.invoiceRef}
              onChange={(e) =>
                updateAttestation({ invoiceRef: e.target.value })
              }
              placeholder="Ref: 2026-2873"
            />
          </div>
          <div className="space-y-2">
            <Label>Date attestation</Label>
            <Input
              value={attestation.attestationDate}
              onChange={(e) =>
                updateAttestation({ attestationDate: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Montant total (€)</Label>
            <Input
              type="number"
              step="0.01"
              value={attestation.totalAmount}
              onChange={(e) =>
                updateAttestation({
                  totalAmount: parseFloat(e.target.value) || 0,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Ticket patient (€)</Label>
            <Input
              type="number"
              step="0.01"
              value={attestation.patientPaid}
              onChange={(e) =>
                updateAttestation({
                  patientPaid: parseFloat(e.target.value) || 0,
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="button" variant="outline" onClick={handleResetDemo}>
          <RotateCcw className="mr-2 size-4" />
          Recharger la démo kiné
        </Button>
      </div>
    </div>
  );
}
