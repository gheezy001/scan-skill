import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const now = new Date();
    const thirtyDays = new Date(now.getTime() + 30 * 86400000);

    const [totalCollaborateurs, totalEngins, totalAppareils, collaborateurs, engins, appareils] = await Promise.all([
      this.prisma.collaborateur.count(),
      this.prisma.engin.count(),
      this.prisma.appareil.count(),
      this.prisma.collaborateur.findMany({ include: { habilitations: true } }),
      this.prisma.engin.findMany(),
      this.prisma.appareil.findMany(),
    ]);

    let collaborateursConformes = 0, collaborateursNonConformes = 0;
    collaborateurs.forEach((c) => {
      if (c.habilitations.some((h) => h.statut === 'EXPIRE')) collaborateursNonConformes++;
      else collaborateursConformes++;
    });

    const habExpirantBientot = await this.prisma.habilitation.count({
      where: { statut: 'VALIDE', dateExpiration: { gte: now, lte: thirtyDays } },
    });

    const enginsConformes = engins.filter((e) => e.statut === 'CONFORME').length;
    const enginsNonConformes = engins.filter((e) => e.statut === 'NON_CONFORME').length;
    const appareilsDisponibles = appareils.filter((a) => a.statut === 'DISPONIBLE' || a.statut === 'EN_SERVICE').length;

    return {
      totalCollaborateurs, totalEngins, totalAppareils,
      collaborateursConformes, collaborateursNonConformes,
      enginsConformes, enginsNonConformes,
      enginsExpireBientot: engins.filter((e) => e.statut === 'EXPIRE_BIENTOT').length,
      appareilsDisponibles, appareilsIndisponibles: totalAppareils - appareilsDisponibles,
      habExpirantBientot,
      tauxConformiteCollaborateurs: totalCollaborateurs > 0 ? Math.round((collaborateursConformes / totalCollaborateurs) * 100) : 0,
      tauxConformiteEngins: totalEngins > 0 ? Math.round((enginsConformes / totalEngins) * 100) : 0,
      tauxDisponibiliteAppareils: totalAppareils > 0 ? Math.round((appareilsDisponibles / totalAppareils) * 100) : 0,
      alertesTotal: collaborateursNonConformes + enginsNonConformes + habExpirantBientot,
      totalOuvriers: totalCollaborateurs,
      ouvriersConformes: collaborateursConformes,
      ouvriersNonConformes: collaborateursNonConformes,
      tauxConformiteOuvriers: totalCollaborateurs > 0 ? Math.round((collaborateursConformes / totalCollaborateurs) * 100) : 0,
    };
  }
}
