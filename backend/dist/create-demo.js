"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const types = await prisma.typeHabilitation.findMany();
    const bt = types.find(t => t.nom.includes('BT'));
    const hta = types.find(t => t.nom.includes('HTA'));
    await prisma.collaborateur.create({
        data: {
            nom: 'Ndoye', prenom: 'Aminata', telephone: '0612345678',
            role: 'Électricienne BT', entreprise: 'Vinci Energies',
            habilitations: { create: [{
                        nom: bt?.nom || 'Habilitation BT', typeId: bt.id,
                        dateObtention: new Date('2023-01-01'),
                        dateExpiration: new Date('2027-01-01'),
                        statut: 'VALIDE',
                    }] }
        }
    });
    await prisma.collaborateur.create({
        data: {
            nom: 'Diallo', prenom: 'Moussa', telephone: '0698765432',
            role: 'Électricien HTA', entreprise: 'Vinci Energies',
            habilitations: { create: [{
                        nom: hta?.nom || 'Habilitation HTA', typeId: hta.id,
                        dateObtention: new Date('2022-01-01'),
                        dateExpiration: new Date('2024-01-01'),
                        statut: 'EXPIRE',
                    }] }
        }
    });
    const all = await prisma.collaborateur.findMany({ select: { id: true, nom: true, prenom: true } });
    console.log('Créés:', all);
    await prisma.$disconnect();
}
main().catch(console.error);
//# sourceMappingURL=create-demo.js.map