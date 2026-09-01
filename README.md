# AttestPrint BE

Outil web pour **médecins et kinésithérapeutes belges** qui utilisent une **imprimante matricielle** (EPSON, OKI…) pour imprimer des **attestations de soins** sur formulaires pré-imprimés.

## Installation locale

### Prérequis

- [Node.js](https://nodejs.org/) **20 ou plus** (`node -v`)
- npm (fourni avec Node.js)

### 1. Cloner le projet

```bash
git clone <url-de-votre-repo> attestprint-be
cd attestprint-be
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Lancer en développement

```bash
npm run dev
```

Ouvrez **http://localhost:43123** dans votre navigateur (Chrome recommandé pour l’impression).

L’app tourne entièrement en local : pas de base de données, pas de clé API, pas de fichier `.env` requis. Les réglages sont stockés dans le **localStorage** du navigateur.

### 4. (Optionnel) Mode production en local

```bash
npm run build
npm start
```

Même URL : http://localhost:43123

### Dépannage rapide

| Problème | Solution |
|----------|----------|
| Port 43123 déjà utilisé | `npx next dev -p 3001` puis ouvrir ce port |
| `npm install` échoue | Vérifier Node ≥ 20, supprimer `node_modules` et réessayer |
| Page blanche | Vider le cache du navigateur ou tester en navigation privée |
| Export PDF vide | Désactiver temporairement les extensions de navigateur |

## Fonctionnalités

- **Guide de configuration** — branchement, pilotes, format « Std plié allemand », bouton Load/Eject
- **Réglage imprimante** — marges X/Y (mm), montant vs OUI/NON sur le champ A.M 21.1.94, barrage des lignes vides
- **Profil prestataire** — nom, n° INAMI, n° BCE, adresse du cachet
- **Page de test** — grille millimétrique pour calibrer l'alignement sur votre carnet
- **Aperçu attestation** — simulation d'impression avec police monospace (style matricielle)
- **Mode simulation** — fond de formulaire pré-imprimé belge simulé (sans imprimante)
- **Export PDF** — archivez vos réglages de calibration et d'attestation

## Tester sans imprimante

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

## Impression (avec imprimante matricielle)

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
