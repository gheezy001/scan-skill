"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModeOperatoireService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ModeOperatoireService = class ModeOperatoireService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(search, statut) {
        const where = {};
        if (search) {
            where.OR = [
                { titre: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (statut && statut !== 'tous')
            where.statut = statut;
        return this.prisma.modeOperatoire.findMany({
            where,
            include: { activites: { orderBy: { ordre: 'asc' } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const mo = await this.prisma.modeOperatoire.findUnique({
            where: { id },
            include: { activites: { orderBy: { ordre: 'asc' } } },
        });
        if (!mo)
            throw new common_1.NotFoundException(`Mode opératoire ${id} non trouvé`);
        return mo;
    }
    async create(data) {
        return this.prisma.modeOperatoire.create({
            data,
            include: { activites: true },
        });
    }
    async update(id, data) {
        await this.findOne(id);
        return this.prisma.modeOperatoire.update({
            where: { id },
            data,
            include: { activites: { orderBy: { ordre: 'asc' } } },
        });
    }
    async delete(id) {
        await this.findOne(id);
        return this.prisma.modeOperatoire.delete({ where: { id } });
    }
    async approuver(id) {
        await this.findOne(id);
        return this.prisma.modeOperatoire.update({
            where: { id },
            data: { statut: 'APPROUVE' },
            include: { activites: { orderBy: { ordre: 'asc' } } },
        });
    }
    async rejeter(id) {
        await this.findOne(id);
        return this.prisma.modeOperatoire.update({
            where: { id },
            data: { statut: 'NON_APPROUVE' },
            include: { activites: { orderBy: { ordre: 'asc' } } },
        });
    }
    async addActivite(modeOperatoireId, data) {
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
    async updateActivite(id, data) {
        return this.prisma.activite.update({ where: { id }, data });
    }
    async deleteActivite(id) {
        return this.prisma.activite.delete({ where: { id } });
    }
};
exports.ModeOperatoireService = ModeOperatoireService;
exports.ModeOperatoireService = ModeOperatoireService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ModeOperatoireService);
//# sourceMappingURL=mode-operatoire.service.js.map