# Scan Skill Mobile — App iOS/Android (Expo)

Application mobile native pour la vérification de conformité HSE sur chantier.
Se connecte au **même backend NestJS** que l'application web.

## Stack

Expo (React Native) · expo-router · expo-camera · TypeScript

## Prérequis

- Node.js installé
- L'app **Expo Go** sur ton iPhone (gratuite sur l'App Store)
- Le **backend Scan Skill qui tourne** (`npm run start:dev` dans le dossier backend)
- Ton iPhone et ton PC **sur le même réseau Wi-Fi**

## ⚠️ Étape cruciale : configurer l'adresse de l'API

Sur un vrai téléphone, `localhost` ne désigne pas ton PC mais le téléphone lui-même.
Il faut donc indiquer l'**adresse IP locale de ton PC**.

### 1. Trouver l'IP de ton PC

Sur Windows, dans un terminal :
```bash
ipconfig
```
Cherche la ligne **Adresse IPv4** (ex: `192.168.1.42`).

### 2. Renseigner cette IP

Ouvre `app.json` et ajoute un bloc `extra` dans `expo` avec ton IP :

```json
{
  "expo": {
    "name": "Scan Skill",
    "extra": {
      "apiUrl": "http://192.168.1.42:8000"
    }
  }
}
```

Remplace `192.168.1.42` par **ton** IP. Garde le port `8000`.

## Démarrage

```bash
npm install
npx expo start
```

Un QR code apparaît dans le terminal. Sur ton iPhone :
1. Ouvre l'app **Appareil photo** (ou Expo Go)
2. Scanne le QR code affiché dans le terminal
3. L'app se lance dans Expo Go

## Connexion

- Admin : `admin@scanskill.com` / `admin123`
- Agent terrain : `agent@scanskill.com` / `agent123`

## Écrans

- **Accueil** : tableau de bord (compteurs, taux de conformité, alertes)
- **Scanner** : caméra native, scan QR automatique
- **Registre** : consultation des ouvriers, engins et appareils avec recherche

## Notes

- La caméra ne fonctionne pas sur le simulateur iOS — il faut un vrai iPhone via Expo Go.
- Pour publier sur l'App Store plus tard : `eas build` (nécessite un compte Apple Developer à 99 $/an).
- L'app partage le backend avec le web : toute donnée ajoutée côté admin web apparaît immédiatement sur mobile.
