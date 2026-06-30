# 📡 Scan Skill

Application de vérification de conformité HSE (Hygiène, Sécurité, Environnement) sur chantier électrique, développée pour **Vinci Energies** dans le cadre d'un challenge innovation.

## 🎯 Le concept

Un agent scanne le QR code d'un collaborateur, d'un engin ou d'un appareillage sur le terrain. L'application vérifie instantanément les habilitations, contrôles techniques et conformités associées, puis affiche un verdict **CONFORME / NON CONFORME** accompagné d'une analyse IA contextuelle.

```
Scan QR code → Vérification habilitations/engins/appareillage + analyse IA → Résultat CONFORME / NON CONFORME
```

## 🏗️ Architecture

Le projet est composé de trois applications indépendantes partageant le même backend :

```
scan-skill/
├── backend/              API NestJS — logique métier, base de données, IA
├── frontend/             Interface web Next.js — administration
└── scan-skill-mobile/    Application mobile Expo — scan terrain
```

## 🛠️ Stack technique

| Composant | Technologie |
|---|---|
| Backend | NestJS 10, Prisma ORM, PostgreSQL |
| Frontend web | Next.js 16, Tailwind CSS |
| Mobile | React Native / Expo SDK 54 |
| IA | Claude (Anthropic) — `claude-sonnet-4-6` |
| Authentification | JWT |
| Stockage fichiers | Local (dev) → Azure Blob Storage (prod) |

## 📦 Fonctionnalités

### 👷 Collaborateurs
Gestion complète : identité, photo, rôle, entreprise, contact d'urgence, pièce d'identité, groupe sanguin, et historique des habilitations avec documents justificatifs.

### 🛡️ Habilitations
Suivi des dates de validité avec calcul automatique du statut (valide / expiré), alertes 30 jours avant expiration, types personnalisables (HTA, BT, CACES, SST, visite médicale...).

### 🏗️ Engins
Suivi des contrôles techniques, VGP (Vérification Générale Périodique), assurance, avec documents associés.

### 🔧 Appareillage
Inventaire des appareils de mesure et outillage avec documentation technique et statut de disponibilité.

### 📋 Mode Opératoire
Procédures structurées en activités séquentielles, avec workflow d'approbation (Approuvé / Non approuvé) et documents par étape.

### 📱 Scan QR multi-support
Vérification de conformité accessible sans authentification — pensée pour un usage terrain rapide, sur web comme sur mobile.

### 🤖 Analyse IA
Chaque scan déclenche une analyse contextuelle par Claude, qui synthétise la situation en langage naturel et donne un verdict actionnable.

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+
- PostgreSQL
- Un compte Anthropic (clé API) pour l'analyse IA
- Expo Go (pour tester l'app mobile)

### Backend

```bash
cd backend
npm install
cp .env.example .env   # renseigner DATABASE_URL, JWT_SECRET, ANTHROPIC_API_KEY
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

API disponible sur `http://localhost:8000`.

**Comptes par défaut** (créés par le seed) :
- Admin : `admin@scanskill.com` / `admin123`
- Agent : `agent@scanskill.com` / `agent123`

### Frontend web

```bash
cd frontend
npm install
npm run dev
```

Interface disponible sur `http://localhost:3000`.

### Application mobile

```bash
cd scan-skill-mobile
npm install
```

Renseigner l'IP locale du backend dans `app.json` (`extra.apiUrl`), puis :

```bash
npx expo start
```

Scanner le QR code affiché avec l'app **Expo Go** (iOS/Android).

## 📂 Documentation par composant

Chaque dossier contient son propre `README.md` avec les instructions détaillées :
- [`backend/README.md`](./backend/README.md)
- [`scan-skill-mobile/README.md`](./scan-skill-mobile/README.md)

## ☁️ Déploiement

- **Backend** : déployé sur Render (production), migration prévue vers **Azure Container Apps** en s'appuyant sur l'infrastructure existante du projet Green & Safe Copilot (Vinci Energies)
- **Base de données** : PostgreSQL (Railway en développement, Azure Database for PostgreSQL en cible)
- **Stockage fichiers** : Azure Blob Storage (cible production)

## 👥 Équipe

Projet développé par une équipe de 3 personnes dans le cadre du challenge innovation Vinci Energies.

## 📄 Licence

Projet interne Vinci Energies — usage restreint.