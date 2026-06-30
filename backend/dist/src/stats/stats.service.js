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
exports.StatsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let StatsService = class StatsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
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
            if (c.habilitations.some((h) => h.statut === 'EXPIRE'))
                collaborateursNonConformes++;
            else
                collaborateursConformes++;
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
};
exports.StatsService = StatsService;
exports.StatsService = StatsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StatsService);
//# sourceMappingURL=stats.service.js.map