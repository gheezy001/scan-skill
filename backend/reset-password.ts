import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('admin123', 10);
  console.log('Hash généré:', hash);
  
  await prisma.user.update({
    where: { email: 'admin@scanskill.com' },
    data: { password: hash },
  });
  
  console.log('Mot de passe mis à jour');
  
  // Vérification immédiate
  const user = await prisma.user.findUnique({ 
    where: { email: 'admin@scanskill.com' } 
  });
  const valid = await bcrypt.compare('admin123', user!.password);
  console.log('Vérification bcrypt:', valid ? '✅ OK' : '❌ ECHEC');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());