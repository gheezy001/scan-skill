import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('verify')
export class VerifyController {
  constructor(private prisma: PrismaService) {}

  @Get(':code')
  async verify(@Param('code') code: string) {
    let type = '';
    let id = code;

    if (code.startsWith('collaborateur-')) { type = 'collaborateur'; id = code.replace('collaborateur-', ''); }
    else if (code.startsWith('ouvrier-')) { type = 'collaborateur'; id = code.replace('ouvrier-', ''); }
    else if (code.startsWith('engin-')) { type = 'engin'; id = code.replace('engin-', ''); }
    else if (code.startsWith('appareil-')) { type = 'appareil'; id = code.replace('appareil-', ''); }
    else throw new NotFoundException('QR code non reconnu');

    if (type === 'collaborateur') {
      const c = await this.prisma.collaborateur.findUnique({
        where: { id },
        select: {
          id: true, nom: true, prenom: true, role: true, entreprise: true,
          telephone: true, statut: true, photo: true,
          habilitations: {
            select: { id: true, nom: true, statut: true, dateExpiration: true, document: true },
            orderBy: { dateExpiration: 'asc' },
          },
        },
      });
      if (!c) throw new NotFoundException('Collaborateur non trouve');
      const conforme = !c.habilitations.some((h) => h.statut === 'EXPIRE');
      return { type, conforme, entity: c };
    }

    if (type === 'engin') {
      const e = await this.prisma.engin.findUnique({
        where: { id },
        select: {
          id: true, type: true, marque: true, modele: true, immatriculation: true,
          statut: true, lieuAffectation: true, vgpFournit: true,
          prochainVisiteTechnique: true, dernierVisiteTechnique: true,
          dateExpirationAssurance: true, dateExpirationVGP: true,
        },
      });
      if (!e) throw new NotFoundException('Engin non trouve');
      return { type, conforme: e.statut === 'CONFORME', entity: e };
    }

    const a = await this.prisma.appareil.findUnique({
      where: { id },
      select: { id: true, nom: true, reference: true, type: true, statut: true, localisation: true, documentationTechnique: true },
    });
    if (!a) throw new NotFoundException('Appareil non trouve');
    return { type, conforme: a.statut === 'DISPONIBLE' || a.statut === 'EN_SERVICE', entity: a };
  }
}
