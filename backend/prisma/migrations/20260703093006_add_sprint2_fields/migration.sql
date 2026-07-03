-- CreateEnum
CREATE TYPE "StatutMO" AS ENUM ('APPROUVE', 'NON_APPROUVE');

-- AlterTable
ALTER TABLE "engins" ADD COLUMN     "documentVGP" TEXT;

-- AlterTable
ALTER TABLE "habilitations" ALTER COLUMN "collaborateurId" DROP DEFAULT;

-- CreateTable
CREATE TABLE "mode_operatoires" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "statut" "StatutMO" NOT NULL DEFAULT 'NON_APPROUVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mode_operatoires_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activites" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "document" TEXT,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "modeOperatoireId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activites_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "activites" ADD CONSTRAINT "activites_modeOperatoireId_fkey" FOREIGN KEY ("modeOperatoireId") REFERENCES "mode_operatoires"("id") ON DELETE CASCADE ON UPDATE CASCADE;
