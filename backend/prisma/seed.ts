import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@scanskill.com' },
    update: { password: adminPassword },
    create: { email: 'admin@scanskill.com', password: adminPassword, firstName: 'Admin', lastName: 'Scan Skill', role: 'ADMIN' },
  });

  const agentPassword = await bcrypt.hash('agent123', 10);
  await prisma.user.upsert({
    where: { email: 'agent@scanskill.com' },
    update: { password: agentPassword },
    create: { email: 'agent@scanskill.com', password: agentPassword, firstName: 'Agent', lastName: 'Terrain', role: 'USER' },
  });

  const types = [
    { nom: 'Habilitation électrique HTA', description: 'Haute tension A', dureeValidite: '1 an' },
    { nom: 'Habilitation électrique BT', description: 'Basse tension', dureeValidite: '1 an' },
    { nom: 'Travail en hauteur', description: 'Port du harnais', dureeValidite: '3 ans' },
    { nom: 'SST', description: 'Sauveteur Secouriste du Travail', dureeValidite: '2 ans' },
    { nom: 'CACES R482', description: 'Engins de chantier', dureeValidite: '5 ans' },
    { nom: 'CACES R489', description: 'Chariots élévateurs', dureeValidite: '5 ans' },
    { nom: 'Visite médicale', description: 'Aptitude médicale au poste', dureeValidite: '1 an' },
  ];

  for (const type of types) {
    await prisma.typeHabilitation.upsert({
      where: { nom: type.nom },
      update: {},
      create: type,
    });
  }

  console.log('Seed terminé');
  console.log('  Admin  : admin@scanskill.com / admin123');
  console.log('  Agent  : agent@scanskill.com / agent123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
