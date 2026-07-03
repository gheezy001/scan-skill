import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class EnginsService {
  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async refreshStatutsEngins() {
    const engins = await this.prisma.engin.findMany();
    for (const engin of engins) {
      const newStatut = this.calculateStatut(
        engin.dateExpirationAssurance,
        engin.prochainVisiteTechnique,
        engin.dateExpirationVGP,
      );
      if (newStatut !== engin.statut) {
        await this.prisma.engin.update({ where: { id: engin.id }, data: { statut: newStatut as any } });
      }
    }
  }

  private calculateStatut(
    dateExpirationAssurance?: Date | null,
    prochainVisiteTechnique?: Date | null,
    dateExpirationVGP?: Date | null,
  ): string {
    const now = new Date();
    const thirtyDays = new Date(now.getTime() + 30 * 86400000);
    const isExpired = (d?: Date | null) => d && new Date(d) < now;
    const isSoon = (d?: Date | null) => d && new Date(d) >= now && new Date(d) < thirtyDays;
    if (isExpired(dateExpirationAssurance) || isExpired(prochainVisiteTechnique) || isExpired(dateExpirationVGP)) {
      return 'NON_CONFORME';
    }
    if (isSoon(dateExpirationAssurance) || isSoon(prochainVisiteTechnique) || isSoon(dateExpirationVGP)) {
      return 'EXPIRE_BIENTOT';
    }
    return 'CONFORME';
  }

  async findAll(search?: string, statut?: string, page = 1, limit = 50) {
    const where: Prisma.EnginWhereInput = {};
    if (search) {
      where.OR = [
        { type: { contains: search, mode: 'insensitive' } },
        { marque: { contains: search, mode: 'insensitive' } },
        { modele: { contains: search, mode: 'insensitive' } },
        { immatriculation: { contains: search, mode: 'insensitive' } },
        { lieuAffectation: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (statut && statut !== 'tous') where.statut = statut as any;
    const [data, total] = await Promise.all([
      this.prisma.engin.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
      this.prisma.engin.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async findOne(id: string) {
    const engin = await this.prisma.engin.findUnique({ where: { id }, include: { appareils: true } });
    if (!engin) throw new NotFoundException(`Engin ${id} non trouve`);
    return engin;
  }

  async create(data: any) {
    // Retirer documentVGP si le client Prisma ne le connait pas encore
    const { documentVGP, ...enginData } = data;
    if (enginData.dateControle) enginData.dateControle = new Date(enginData.dateControle);
    if (enginData.dernierVisiteTechnique) enginData.dernierVisiteTechnique = new Date(enginData.dernierVisiteTechnique);
    if (enginData.prochainVisiteTechnique) enginData.prochainVisiteTechnique = new Date(enginData.prochainVisiteTechnique);
    if (enginData.dateExpirationVGP) enginData.dateExpirationVGP = new Date(enginData.dateExpirationVGP);
    if (enginData.dateExpirationAssurance) enginData.dateExpirationAssurance = new Date(enginData.dateExpirationAssurance);
    const statut = this.calculateStatut(enginData.dateExpirationAssurance, enginData.prochainVisiteTechnique, enginData.dateExpirationVGP);
    return this.prisma.engin.create({ data: { ...enginData, statut: statut as any } });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    const { documentVGP, ...enginData } = data;
    if (enginData.dateControle) enginData.dateControle = new Date(enginData.dateControle);
    if (enginData.dernierVisiteTechnique) enginData.dernierVisiteTechnique = new Date(enginData.dernierVisiteTechnique);
    if (enginData.prochainVisiteTechnique) enginData.prochainVisiteTechnique = new Date(enginData.prochainVisiteTechnique);
    if (enginData.dateExpirationVGP) enginData.dateExpirationVGP = new Date(enginData.dateExpirationVGP);
    if (enginData.dateExpirationAssurance) enginData.dateExpirationAssurance = new Date(enginData.dateExpirationAssurance);
    const statut = this.calculateStatut(enginData.dateExpirationAssurance, enginData.prochainVisiteTechnique, enginData.dateExpirationVGP);
    return this.prisma.engin.update({ where: { id }, data: { ...enginData, statut: statut as any } });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.engin.delete({ where: { id } });
  }
}