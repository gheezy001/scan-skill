import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OuvriersService {
  constructor(
    private prisma: PrismaService,
    private mail: MailService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async refreshStatutsHabilitations() {
    const now = new Date();
    const result = await this.prisma.habilitation.updateMany({
      where: { dateExpiration: { lt: now }, statut: 'VALIDE' },
      data: { statut: 'EXPIRE' },
    });
    console.log(`[CRON] ${result.count} habilitation(s) marquee(s) EXPIRE`);
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async sendExpirationAlerts() {
    if (!process.env.MAIL_HOST || !process.env.MAIL_USER) return;
    const expiring = await this.findExpiringHabilitations(30);
    for (const hab of expiring) {
      const email = hab.collaborateur.email;
      if (!email) continue;
      const daysLeft = Math.ceil((new Date(hab.dateExpiration).getTime() - Date.now()) / 86400000);
      try {
        await this.mail.sendExpirationAlert(
          email,
          `${hab.collaborateur.prenom} ${hab.collaborateur.nom}`,
          hab.nom,
          new Date(hab.dateExpiration),
          daysLeft,
        );
      } catch (e) {
        console.error(`[CRON] Echec envoi alerte:`, e.message);
      }
    }
  }

  async findAll(search?: string, statut?: string, page = 1, limit = 50) {
    const where: Prisma.CollaborateurWhereInput = {};
    if (search) {
      where.OR = [
        { nom: { contains: search, mode: 'insensitive' } },
        { prenom: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { telephone: { contains: search, mode: 'insensitive' } },
        { entreprise: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (statut && statut !== 'tous') where.statut = statut as any;

    const [data, total] = await Promise.all([
      this.prisma.collaborateur.findMany({
        where,
        include: { habilitations: { include: { typeHabilitation: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.collaborateur.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async findOne(id: string) {
    const collaborateur = await this.prisma.collaborateur.findUnique({
      where: { id },
      include: { habilitations: { include: { typeHabilitation: true } }, appareils: true },
    });
    if (!collaborateur) throw new NotFoundException(`Collaborateur ${id} non trouve`);
    return collaborateur;
  }

  async create(data: any) {
    const { habilitations, ...colData } = data;
    const now = new Date();
    if (colData.dateEmbauche) colData.dateEmbauche = new Date(colData.dateEmbauche);

    const resolvedHabilitations = habilitations
      ? await Promise.all(
          habilitations.map(async (hab: any) => {
            const type = await this.prisma.typeHabilitation.findUnique({ where: { id: hab.typeId } });
            if (!type) throw new NotFoundException(`Type ${hab.typeId} introuvable`);
            return {
              nom: type.nom,
              typeHabilitation: { connect: { id: type.id } },
              dateObtention: new Date(hab.dateObtention),
              dateExpiration: new Date(hab.dateExpiration),
              entreprise: hab.entreprise,
              document: hab.document,
              statut: new Date(hab.dateExpiration) > now ? ('VALIDE' as const) : ('EXPIRE' as const),
            };
          }),
        )
      : undefined;

    return this.prisma.collaborateur.create({
      data: {
        ...colData,
        habilitations: resolvedHabilitations ? { create: resolvedHabilitations } : undefined,
      },
      include: { habilitations: { include: { typeHabilitation: true } } },
    });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    if (data.dateEmbauche) data.dateEmbauche = new Date(data.dateEmbauche);
    return this.prisma.collaborateur.update({
      where: { id },
      data,
      include: { habilitations: { include: { typeHabilitation: true } } },
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.collaborateur.delete({ where: { id } });
  }

  async addHabilitation(collaborateurId: string, data: any) {
    await this.findOne(collaborateurId);
    const type = await this.prisma.typeHabilitation.findUnique({ where: { id: data.typeId } });
    if (!type) throw new NotFoundException(`Type ${data.typeId} introuvable`);

    return this.prisma.habilitation.create({
      data: {
        nom: type.nom,
        typeId: type.id,
        dateObtention: new Date(data.dateObtention),
        dateExpiration: new Date(data.dateExpiration),
        entreprise: data.entreprise,
        document: data.document,
        collaborateurId,
        statut: new Date(data.dateExpiration) > new Date() ? 'VALIDE' : 'EXPIRE',
      },
      include: { typeHabilitation: true },
    });
  }

  async updateHabilitation(id: string, data: any) {
    const updateData: any = {};
    if (data.dateObtention) updateData.dateObtention = new Date(data.dateObtention);
    if (data.dateExpiration) {
      updateData.dateExpiration = new Date(data.dateExpiration);
      updateData.statut = new Date(data.dateExpiration) > new Date() ? 'VALIDE' : 'EXPIRE';
    }
    if (data.statut) updateData.statut = data.statut;
    if (data.entreprise !== undefined) updateData.entreprise = data.entreprise;
    if (data.document !== undefined) updateData.document = data.document;

    if (data.typeId) {
      const type = await this.prisma.typeHabilitation.findUnique({ where: { id: data.typeId } });
      if (!type) throw new NotFoundException(`Type ${data.typeId} introuvable`);
      updateData.nom = type.nom;
      updateData.typeHabilitation = { connect: { id: type.id } };
    }

    return this.prisma.habilitation.update({
      where: { id },
      data: updateData,
      include: { typeHabilitation: true },
    });
  }

  async deleteHabilitation(id: string) {
    return this.prisma.habilitation.delete({ where: { id } });
  }

  async findAllHabilitations() {
    return this.prisma.habilitation.findMany({
      include: { collaborateur: true, typeHabilitation: true },
      orderBy: { dateExpiration: 'asc' },
    });
  }

  async findExpiringHabilitations(days = 30) {
    const now = new Date();
    const limit = new Date(now.getTime() + days * 86400000);
    return this.prisma.habilitation.findMany({
      where: { statut: 'VALIDE', dateExpiration: { gte: now, lte: limit } },
      include: { collaborateur: true, typeHabilitation: true },
      orderBy: { dateExpiration: 'asc' },
    });
  }
}
