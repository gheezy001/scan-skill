/*
  Warnings:

  - You are about to drop the column `ouvrierAssigneId` on the `appareils` table. All the data in the column will be lost.
  - You are about to drop the column `poste` on the `engins` table. All the data in the column will be lost.
  - You are about to drop the column `prochainControle` on the `engins` table. All the data in the column will be lost.
  - You are about to drop the column `vpgFournit` on the `engins` table. All the data in the column will be lost.
  - You are about to drop the column `ouvrierId` on the `habilitations` table. All the data in the column will be lost.
  - You are about to drop the `ouvriers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `collaborateurId` to the `habilitations` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TypePieceIdentite" AS ENUM ('CIN', 'PASSEPORT');

-- CreateEnum
CREATE TYPE "StatutCollaborateur" AS ENUM ('ACTIF', 'INACTIF', 'SUSPENDU');

-- DropForeignKey
ALTER TABLE "appareils" DROP CONSTRAINT "appareils_ouvrierAssigneId_fkey";

-- DropForeignKey
ALTER TABLE "habilitations" DROP CONSTRAINT "habilitations_ouvrierId_fkey";

-- AlterTable
ALTER TABLE "appareils" DROP COLUMN "ouvrierAssigneId",
ADD COLUMN     "collaborateurAssigneId" TEXT,
ADD COLUMN     "documentationTechnique" TEXT;

-- AlterTable
ALTER TABLE "engins" DROP COLUMN "poste",
DROP COLUMN "prochainControle",
DROP COLUMN "vpgFournit",
ADD COLUMN     "dateExpirationVGP" TIMESTAMP(3),
ADD COLUMN     "dernierVisiteTechnique" TIMESTAMP(3),
ADD COLUMN     "lieuAffectation" TEXT,
ADD COLUMN     "prochainVisiteTechnique" TIMESTAMP(3),
ADD COLUMN     "vgpFournit" TEXT;

-- AlterTable
ALTER TABLE "habilitations" DROP COLUMN "ouvrierId",
ADD COLUMN     "collaborateurId" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "document" TEXT;

-- DropTable
DROP TABLE "ouvriers";

-- DropEnum
DROP TYPE "StatutOuvrier";

-- CreateTable
CREATE TABLE "collaborateurs" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "email" TEXT,
    "photo" TEXT,
    "role" TEXT NOT NULL,
    "entreprise" TEXT,
    "dateEmbauche" TIMESTAMP(3),
    "adresse" TEXT,
    "nationalite" TEXT,
    "groupeSanguin" TEXT,
    "numeroPieceIdentite" TEXT,
    "typePieceIdentite" "TypePieceIdentite",
    "contactUrgenceNom" TEXT,
    "contactUrgenceTel" TEXT,
    "statut" "StatutCollaborateur" NOT NULL DEFAULT 'ACTIF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collaborateurs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "habilitations" ADD CONSTRAINT "habilitations_collaborateurId_fkey" FOREIGN KEY ("collaborateurId") REFERENCES "collaborateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appareils" ADD CONSTRAINT "appareils_collaborateurAssigneId_fkey" FOREIGN KEY ("collaborateurAssigneId") REFERENCES "collaborateurs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
