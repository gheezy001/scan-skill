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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let VerifyController = class VerifyController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async verify(code) {
        let type = '';
        let id = code;
        if (code.startsWith('collaborateur-')) {
            type = 'collaborateur';
            id = code.replace('collaborateur-', '');
        }
        else if (code.startsWith('ouvrier-')) {
            type = 'collaborateur';
            id = code.replace('ouvrier-', '');
        }
        else if (code.startsWith('engin-')) {
            type = 'engin';
            id = code.replace('engin-', '');
        }
        else if (code.startsWith('appareil-')) {
            type = 'appareil';
            id = code.replace('appareil-', '');
        }
        else
            throw new common_1.NotFoundException('QR code non reconnu');
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
            if (!c)
                throw new common_1.NotFoundException('Collaborateur non trouve');
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
            if (!e)
                throw new common_1.NotFoundException('Engin non trouve');
            return { type, conforme: e.statut === 'CONFORME', entity: e };
        }
        const a = await this.prisma.appareil.findUnique({
            where: { id },
            select: { id: true, nom: true, reference: true, type: true, statut: true, localisation: true, documentationTechnique: true },
        });
        if (!a)
            throw new common_1.NotFoundException('Appareil non trouve');
        return { type, conforme: a.statut === 'DISPONIBLE' || a.statut === 'EN_SERVICE', entity: a };
    }
};
exports.VerifyController = VerifyController;
__decorate([
    (0, common_1.Get)(':code'),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VerifyController.prototype, "verify", null);
exports.VerifyController = VerifyController = __decorate([
    (0, common_1.Controller)('verify'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VerifyController);
//# sourceMappingURL=verify.controller.js.map