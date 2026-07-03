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
exports.OuvriersService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
let OuvriersService = class OuvriersService {
    constructor(prisma, mail) {
        this.prisma = prisma;
        this.mail = mail;
    }
    async refreshStatutsHabilitations() {
        const now = new Date();
        const result = await this.prisma.habilitation.updateMany({
            where: { dateExpiration: { lt: now }, statut: 'VALIDE' },
            data: { statut: 'EXPIRE' },
        });
        console.log(`[CRON] ${result.count} habilitation(s) marquee(s) EXPIRE`);
    }
    async sendExpirationAlerts() {
        if (!process.env.MAIL_HOST || !process.env.MAIL_USER)
            return;
        const expiring = await this.findExpiringHabilitations(30);
        for (const hab of expiring) {
            const email = hab.collaborateur.email;
            if (!email)
                continue;
            const daysLeft = Math.ceil((new Date(hab.dateExpiration).getTime() - Date.now()) / 86400000);
            try {
                await this.mail.sendExpirationAlert(email, `${hab.collaborateur.prenom} ${hab.collaborateur.nom}`, hab.nom, new Date(hab.dateExpiration), daysLeft);
            }
            catch (e) {
                console.error(`[CRON] Echec envoi alerte:`, e.message);
            }
        }
    }
    async findAll(search, statut, page = 1, limit = 50) {
        const where = {};
        if (search) {
            where.OR = [
                { nom: { contains: search, mode: 'insensitive' } },
                { prenom: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { telephone: { contains: search, mode: 'insensitive' } },
                { entreprise: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (statut && statut !== 'tous')
            where.statut = statut;
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
    async findOne(id) {
        const collaborateur = await this.prisma.collaborateur.findUnique({
            where: { id },
            include: { habilitations: { include: { typeHabilitation: true } }, appareils: true },
        });
        if (!collaborateur)
            throw new common_1.NotFoundException(`Collaborateur ${id} non trouve`);
        return collaborateur;
    }
    async create(data) {
        const { habilitations, ...colData } = data;
        const now = new Date();
        if (colData.dateEmbauche)
            colData.dateEmbauche = new Date(colData.dateEmbauche);
        const resolvedHabilitations = habilitations
            ? await Promise.all(habilitations.map(async (hab) => {
                const type = await this.prisma.typeHabilitation.findUnique({ where: { id: hab.typeId } });
                if (!type)
                    throw new common_1.NotFoundException(`Type ${hab.typeId} introuvable`);
                return {
                    nom: type.nom,
                    typeHabilitation: { connect: { id: type.id } },
                    dateObtention: new Date(hab.dateObtention),
                    dateExpiration: new Date(hab.dateExpiration),
                    entreprise: hab.entreprise,
                    document: hab.document,
                    statut: new Date(hab.dateExpiration) > now ? 'VALIDE' : 'EXPIRE',
                };
            }))
            : undefined;
        return this.prisma.collaborateur.create({
            data: {
                ...colData,
                habilitations: resolvedHabilitations ? { create: resolvedHabilitations } : undefined,
            },
            include: { habilitations: { include: { typeHabilitation: true } } },
        });
    }
    async update(id, data) {
        await this.findOne(id);
        if (data.dateEmbauche)
            data.dateEmbauche = new Date(data.dateEmbauche);
        return this.prisma.collaborateur.update({
            where: { id },
            data,
            include: { habilitations: { include: { typeHabilitation: true } } },
        });
    }
    async delete(id) {
        await this.findOne(id);
        return this.prisma.collaborateur.delete({ where: { id } });
    }
    async addHabilitation(collaborateurId, data) {
        await this.findOne(collaborateurId);
        const type = await this.prisma.typeHabilitation.findUnique({ where: { id: data.typeId } });
        if (!type)
            throw new common_1.NotFoundException(`Type ${data.typeId} introuvable`);
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
    async updateHabilitation(id, data) {
        const updateData = {};
        if (data.dateObtention)
            updateData.dateObtention = new Date(data.dateObtention);
        if (data.dateExpiration) {
            updateData.dateExpiration = new Date(data.dateExpiration);
            updateData.statut = new Date(data.dateExpiration) > new Date() ? 'VALIDE' : 'EXPIRE';
        }
        if (data.statut)
            updateData.statut = data.statut;
        if (data.entreprise !== undefined)
            updateData.entreprise = data.entreprise;
        if (data.document !== undefined)
            updateData.document = data.document;
        if (data.typeId) {
            const type = await this.prisma.typeHabilitation.findUnique({ where: { id: data.typeId } });
            if (!type)
                throw new common_1.NotFoundException(`Type ${data.typeId} introuvable`);
            updateData.nom = type.nom;
            updateData.typeHabilitation = { connect: { id: type.id } };
        }
        return this.prisma.habilitation.update({
            where: { id },
            data: updateData,
            include: { typeHabilitation: true },
        });
    }
    async deleteHabilitation(id) {
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
};
exports.OuvriersService = OuvriersService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OuvriersService.prototype, "refreshStatutsHabilitations", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_8AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OuvriersService.prototype, "sendExpirationAlerts", null);
exports.OuvriersService = OuvriersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService])
], OuvriersService);
//# sourceMappingURL=ouvriers.service.js.map