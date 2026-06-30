-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "StatutOuvrier" AS ENUM ('ACTIF', 'INACTIF', 'SUSPENDU');

-- CreateEnum
CREATE TYPE "StatutHabilitation" AS ENUM ('VALIDE', 'EXPIRE', 'SUSPENDU');

-- CreateEnum
CREATE TYPE "StatutEngin" AS ENUM ('CONFORME', 'NON_CONFORME', 'EXPIRE_BIENTOT');

-- CreateEnum
CREATE TYPE "StatutAppareil" AS ENUM ('DISPONIBLE', 'EN_SERVICE', 'EN_MAINTENANCE', 'HORS_SERVICE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ouvriers" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT,
    "photo" TEXT,
    "dateEmbauche" TIMESTAMP(3),
    "statut" "StatutOuvrier" NOT NULL DEFAULT 'ACTIF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ouvriers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habilitations" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "dateObtention" TIMESTAMP(3) NOT NULL,
    "dateExpiration" TIMESTAMP(3) NOT NULL,
    "entreprise" TEXT,
    "statut" "StatutHabilitation" NOT NULL DEFAULT 'VALIDE',
    "ouvrierId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "habilitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "type_habilitations" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "entreprise" TEXT,
    "dureeValidite" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "type_habilitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "engins" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "marque" TEXT,
    "modele" TEXT,
    "immatriculation" TEXT NOT NULL,
    "photo" TEXT,
    "dateControle" TIMESTAMP(3),
    "prochainControle" TIMESTAMP(3),
    "dateExpirationAssurance" TIMESTAMP(3),
    "vpgFournit" TEXT,
    "poste" TEXT,
    "statut" "StatutEngin" NOT NULL DEFAULT 'CONFORME',
    "controles" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "engins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appareils" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "statut" "StatutAppareil" NOT NULL DEFAULT 'DISPONIBLE',
    "localisation" TEXT,
    "dateAcquisition" TIMESTAMP(3),
    "dateDerniereRevision" TIMESTAMP(3),
    "ouvrierAssigneId" TEXT,
    "enginAssigneId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appareils_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "type_habilitations_nom_key" ON "type_habilitations"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "engins_immatriculation_key" ON "engins"("immatriculation");

-- CreateIndex
CREATE UNIQUE INDEX "appareils_reference_key" ON "appareils"("reference");

-- AddForeignKey
ALTER TABLE "habilitations" ADD CONSTRAINT "habilitations_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "type_habilitations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habilitations" ADD CONSTRAINT "habilitations_ouvrierId_fkey" FOREIGN KEY ("ouvrierId") REFERENCES "ouvriers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appareils" ADD CONSTRAINT "appareils_ouvrierAssigneId_fkey" FOREIGN KEY ("ouvrierAssigneId") REFERENCES "ouvriers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appareils" ADD CONSTRAINT "appareils_enginAssigneId_fkey" FOREIGN KEY ("enginAssigneId") REFERENCES "engins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
