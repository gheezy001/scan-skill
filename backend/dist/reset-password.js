"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    const hash = await bcrypt.hash('admin123', 10);
    console.log('Hash généré:', hash);
    await prisma.user.update({
        where: { email: 'admin@scanskill.com' },
        data: { password: hash },
    });
    console.log('Mot de passe mis à jour');
    const user = await prisma.user.findUnique({
        where: { email: 'admin@scanskill.com' }
    });
    const valid = await bcrypt.compare('admin123', user.password);
    console.log('Vérification bcrypt:', valid ? '✅ OK' : '❌ ECHEC');
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=reset-password.js.map