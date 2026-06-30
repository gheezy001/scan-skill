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
exports.EnginsService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
let EnginsService = class EnginsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async refreshStatutsEngins() {
        const now = new Date();
        const thirtyDays = new Date(now.getTime() + 30 * 86400000);
        const engins = await this.prisma.engin.findMany();
        for (const engin of engins) {
            const newStatut = this.calculateStatut(engin.dateExpirationAssurance, engin.prochainVisiteTechnique, engin.dateExpirationVGP);
            if (newStatut !== engin.statut) {
                await this.prisma.engin.update({ where: { id: engin.id }, data: { statut: newStatut } });
            }
        }
    }
    calculateStatut(dateExpirationAssurance, prochainVisiteTechnique, dateExpirationVGP) {
        const now = new Date();
        const thirtyDays = new Date(now.getTime() + 30 * 86400000);
        const isExpired = (d) => d && new Date(d) < now;
        const isSoon = (d) => d && new Date(d) >= now && new Date(d) < thirtyDays;
        if (isExpired(dateExpirationAssurance) || isExpired(prochainVisiteTechnique) || isExpired(dateExpirationVGP)) {
            return 'NON_CONFORME';
        }
        if (isSoon(dateExpirationAssurance) || isSoon(prochainVisiteTechnique) || isSoon(dateExpirationVGP)) {
            return 'EXPIRE_BIENTOT';
        }
        return 'CONFORME';
    }
    async findAll(search, statut, page = 1, limit = 50) {
        const where = {};
        if (search) {
            where.OR = [
                { type: { contains: search, mode: 'insensitive' } },
                { marque: { contains: search, mode: 'insensitive' } },
                { modele: { contains: search, mode: 'insensitive' } },
                { immatriculation: { contains: search, mode: 'insensitive' } },
                { lieuAffectation: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (statut && statut !== 'tous')
            where.statut = statut;
        const [data, total] = await Promise.all([
            this.prisma.engin.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
            this.prisma.engin.count({ where }),
        ]);
        return { data, total, page, limit };
    }
    async findOne(id) {
        const engin = await this.prisma.engin.findUnique({ where: { id }, include: { appareils: true } });
        if (!engin)
            throw new common_1.NotFoundException(`Engin ${id} non trouve`);
        return engin;
    }
    async create(data) {
        if (data.dateControle)
            data.dateControle = new Date(data.dateControle);
        if (data.dernierVisiteTechnique)
            data.dernierVisiteTechnique = new Date(data.dernierVisiteTechnique);
        if (data.prochainVisiteTechnique)
            data.prochainVisiteTechnique = new Date(data.prochainVisiteTechnique);
        if (data.dateExpirationVGP)
            data.dateExpirationVGP = new Date(data.dateExpirationVGP);
        if (data.dateExpirationAssurance)
            data.dateExpirationAssurance = new Date(data.dateExpirationAssurance);
        const statut = this.calculateStatut(data.dateExpirationAssurance, data.prochainVisiteTechnique, data.dateExpirationVGP);
        return this.prisma.engin.create({ data: { ...data, statut: statut } });
    }
    async update(id, data) {
        await this.findOne(id);
        if (data.dateControle)
            data.dateControle = new Date(data.dateControle);
        if (data.dernierVisiteTechnique)
            data.dernierVisiteTechnique = new Date(data.dernierVisiteTechnique);
        if (data.prochainVisiteTechnique)
            data.prochainVisiteTechnique = new Date(data.prochainVisiteTechnique);
        if (data.dateExpirationVGP)
            data.dateExpirationVGP = new Date(data.dateExpirationVGP);
        if (data.dateExpirationAssurance)
            data.dateExpirationAssurance = new Date(data.dateExpirationAssurance);
        const statut = this.calculateStatut(data.dateExpirationAssurance, data.prochainVisiteTechnique, data.dateExpirationVGP);
        return this.prisma.engin.update({ where: { id }, data: { ...data, statut: statut } });
    }
    async delete(id) {
        await this.findOne(id);
        return this.prisma.engin.delete({ where: { id } });
    }
};
exports.EnginsService = EnginsService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EnginsService.prototype, "refreshStatutsEngins", null);
exports.EnginsService = EnginsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EnginsService);
//# sourceMappingURL=engins.service.js.map