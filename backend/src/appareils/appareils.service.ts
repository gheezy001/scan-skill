import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AppareilsService {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string, statut?: string, page = 1, limit = 50) {
    const where: Prisma.AppareilWhereInput = {};
    if (search) {
      where.OR = [
        { nom: { contains: search, mode: 'insensitive' } },
        { reference: { contains: search, mode: 'insensitive' } },
        { type: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (statut && statut !== 'tous') where.statut = statut as any;

    const [data, total] = await Promise.all([
      this.prisma.appareil.findMany({
        where,
        include: { collaborateurAssigne: true, enginAssigne: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.appareil.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async findOne(id: string) {
    const appareil = await this.prisma.appareil.findUnique({
      where: { id },
      include: { collaborateurAssigne: true, enginAssigne: true },
    });
    if (!appareil) throw new NotFoundException(`Appareil ${id} non trouvé`);
    return appareil;
  }

  async create(data: any) {
    return this.prisma.appareil.create({ data, include: { collaborateurAssigne: true, enginAssigne: true } });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    return this.prisma.appareil.update({ where: { id }, data, include: { collaborateurAssigne: true, enginAssigne: true } });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.appareil.delete({ where: { id } });
  }
}