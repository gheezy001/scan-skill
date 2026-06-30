# Scan Skill — Système de gestion de conformité HSE

Application complète de vérification des habilitations et conformité des engins sur chantier électrique.

## Stack

**Backend** : NestJS · Prisma ORM · PostgreSQL · JWT · @nestjs/schedule · Anthropic API  
**Frontend** : Next.js 15 · Tailwind CSS · jsQR · Axios

## Démarrage rapide

### Backend

```bash
cd backend
cp .env.example .env
# Remplir DATABASE_URL, JWT_SECRET, ANTHROPIC_API_KEY dans .env
npm install
npx prisma migrate deploy
npx prisma db seed
npm run start:dev
```

**API** disponible sur `http://localhost:8000/api`  
**Comptes par défaut** :
- Admin : `admin@scanskill.com` / `admin123`
- Agent terrain : `agent@scanskill.com` / `agent123`

### Frontend

```bash
cd frontend
cp .env.example .env
# NEXT_PUBLIC_API_URL=http://localhost:8000
npm install
npm run dev
```

**App** disponible sur `http://localhost:3000`

## Fonctionnalités

- **Scan QR public** : vérification terrain sans login via l'endpoint public `/api/verify/:code` (données limitées, pas d'infos sensibles)
- **Analyse IA** : verdict clair et actionnable via Claude API après chaque scan
- **Dashboard** : vue consolidée de la conformité avec filtres et recherche en temps réel
- **CRON automatique** : mise à jour des statuts expirant chaque nuit + alertes email à 8h (J-30)
- **Import CSV** : intégration en masse des ouvriers, habilitations et engins
- **Export CSV** : extraction des données pour reporting
- **PWA** : installable sur mobile, idéal pour le terrain

## QR Codes

Les URLs des QR codes suivent ce format :

```
https://votre-domaine.com/verify/ouvrier-{uuid}
https://votre-domaine.com/verify/engin-{uuid}
https://votre-domaine.com/verify/appareil-{uuid}
```

Les IDs sont disponibles dans les pages de gestion (bouton "Lien QR").

## Déploiement

Backend et frontend sont configurés pour Vercel. Adapter `FRONTEND_URL` dans les variables d'environnement backend.
