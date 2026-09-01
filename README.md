# AttestPrint BE

Outil web pour **médecins et kinésithérapeutes belges** qui utilisent une **imprimante matricielle** (EPSON, OKI…) pour imprimer des **attestations de soins** sur formulaires pré-imprimés.

## Fonctionnalités

- **Guide de configuration** — branchement, pilotes, format « Std plié allemand », bouton Load/Eject
- **Réglage imprimante** — marges X/Y (mm), montant vs OUI/NON sur le champ A.M 21.1.94, barrage des lignes vides
- **Profil prestataire** — nom, n° INAMI, n° BCE, adresse du cachet
- **Page de test** — grille millimétrique pour calibrer l'alignement sur votre carnet
- **Aperçu attestation** — simulation d'impression avec police monospace (style matricielle)
- **Mode simulation** — fond de formulaire pré-imprimé belge simulé (sans imprimante)
- **Export PDF** — archivez vos réglages de calibration et d'attestation

La configuration est sauvegardée localement dans le navigateur (localStorage).

## Tester sans imprimante (option B)

1. Activez **Formulaire pré-imprimé simulé** dans Calibration ou Aperçu attestation
2. Remplissez votre profil prestataire (Configuration)
3. Ajustez les marges X/Y jusqu'à ce que le texte tombe dans les cases
4. **Exportez en PDF** pour archiver le réglage
5. Le jour J (avec imprimante), comparez le PDF avec l'impression réelle


## Contexte belge

| Profession | eAttest obligatoire | Attestation papier |
|------------|---------------------|--------------------|
| Médecins / dentistes | Depuis sept. 2025 | Cas exceptionnels |
| Kinésithérapeutes | Janv. 2027 | Encore possible (ex. sans réseau) |

Les logiciels métier (CareConnect, KineQuick…) gèrent la tarification INAMI ; **AttestPrint BE** complète leur usage en aidant à **calibrer l'imprimante** quand l'alignement est décalé.

## Démarrage

```bash
npm install
npm run dev -- -p 43123
```

Ouvrez [http://localhost:43123](http://localhost:43123).

## Impression

1. Chargez votre formulaire pré-imprimé dans l'imprimante matricielle.
2. Calibrez via l'onglet **Calibration** (page de test).
3. Ajustez les marges dans **Configuration** jusqu'à l'alignement correct.
4. À l'impression, choisissez :
   - Imprimante : EPSON / OKI
   - Format : **Std plié allemand**
   - Windows : échelle **Ajuster à la taille du papier**
   - Mac : ne pas modifier l'échelle

## Stack

Next.js, TypeScript, Tailwind CSS, shadcn/ui.

## Limites

Cet outil ne se connecte pas à MyCareNet / eAttest et ne remplace pas un logiciel médical agréé. Il sert à la **configuration matérielle** et à la **vérification d'alignement** des impressions matricielles.
