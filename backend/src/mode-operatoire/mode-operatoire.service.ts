import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ModeOperatoireService {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string, statut?: string) {
    const where: Prisma.ModeOperatoireWhereInput = {};
    if (search) {
      where.OR = [
        { titre: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (statut && statut !== 'tous') where.statut = statut as any;

    return this.prisma.modeOperatoire.findMany({
      where,
      include: { activites: { orderBy: { ordre: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const mo = await this.prisma.modeOperatoire.findUnique({
      where: { id },
      include: { activites: { orderBy: { ordre: 'asc' } } },
    });
    if (!mo) throw new NotFoundException(`Mode opératoire ${id} non trouvé`);
    return mo;
  }

  async create(data: { titre: string; description?: string }) {
    return this.prisma.modeOperatoire.create({
      data,
      include: { activites: true },
    });
  }

  async update(id: string, data: { titre?: string; description?: string; statut?: any }) {
    await this.findOne(id);
    return this.prisma.modeOperatoire.update({
      where: { id },
      data,
      include: { activites: { orderBy: { ordre: 'asc' } } },
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.modeOperatoire.delete({ where: { id } });
  }

  async approuver(id: string) {
    await this.findOne(id);
    return this.prisma.modeOperatoire.update({
      where: { id },
      data: { statut: 'APPROUVE' },
      include: { activites: { orderBy: { ordre: 'asc' } } },
    });
  }

  async rejeter(id: string) {
    await this.findOne(id);
    return this.prisma.modeOperatoire.update({
      where: { id },
      data: { statut: 'NON_APPROUVE' },
      include: { activites: { orderBy: { ordre: 'asc' } } },
    });
  }

  // Activités
  async addActivite(modeOperatoireId: string, data: {
    titre: string;
    description?: string;
    document?: string;
    ordre?: number;
  }) {
    await this.findOne(modeOperatoireId);
    const count = await this.prisma.activite.count({ where: { modeOperatoireId } });
    return this.prisma.activite.create({
      data: {
        ...data,
        ordre: data.ordre ?? count,
        modeOperatoireId,
      },
    });
  }

  async updateActivite(id: string, data: {
    titre?: string;
    description?: string;
    document?: string;
    ordre?: number;
  }) {
    return this.prisma.activite.update({ where: { id }, data });
  }

  async deleteActivite(id: string) {
    return this.prisma.activite.delete({ where: { id } });
  }
}
