import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HabilitationTypesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.typeHabilitation.findMany({ orderBy: { nom: 'asc' } });
  }

  create(data: { nom: string; description?: string; entreprise?: string; dureeValidite?: string }) {
    return this.prisma.typeHabilitation.create({ data });
  }

  update(id: string, data: any) {
    return this.prisma.typeHabilitation.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.prisma.typeHabilitation.delete({ where: { id } });
  }
}
