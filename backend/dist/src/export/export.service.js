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
exports.ExportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ExportService = class ExportService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    toCSV(headers, rows) {
        return [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    }
    async exportOuvriers() {
        const collaborateurs = await this.prisma.collaborateur.findMany({
            include: { habilitations: { include: { typeHabilitation: true } } },
        });
        const headers = ['nom', 'prenom', 'telephone', 'email', 'role', 'entreprise', 'statut', 'nb_habilitations', 'habilitations_expirees'];
        const rows = collaborateurs.map((c) => [
            c.nom, c.prenom, c.telephone, c.email ?? '', c.role, c.entreprise ?? '', c.statut,
            String(c.habilitations.length),
            String(c.habilitations.filter((h) => h.statut === 'EXPIRE').length),
        ]);
        return this.toCSV(headers, rows);
    }
    async exportHabilitations() {
        const habs = await this.prisma.habilitation.findMany({
            include: { collaborateur: true, typeHabilitation: true },
            orderBy: { dateExpiration: 'asc' },
        });
        const headers = ['collaborateur_nom', 'collaborateur_prenom', 'telephone', 'email', 'habilitation', 'type', 'date_obtention', 'date_expiration', 'statut', 'entreprise'];
        const rows = habs.map((h) => [
            h.collaborateur.nom, h.collaborateur.prenom,
            h.collaborateur.telephone, h.collaborateur.email ?? '',
            h.nom, h.typeHabilitation.nom,
            new Date(h.dateObtention).toLocaleDateString('fr-FR'),
            new Date(h.dateExpiration).toLocaleDateString('fr-FR'),
            h.statut, h.entreprise ?? '',
        ]);
        return this.toCSV(headers, rows);
    }
    async exportEngins() {
        const engins = await this.prisma.engin.findMany();
        const headers = ['type', 'marque', 'modele', 'immatriculation', 'lieu_affectation', 'statut', 'derniere_visite_technique', 'prochaine_visite_technique', 'expiration_vgp', 'expiration_assurance'];
        const rows = engins.map((e) => [
            e.type, e.marque ?? '', e.modele ?? '', e.immatriculation,
            e.lieuAffectation ?? '', e.statut,
            e.dernierVisiteTechnique ? new Date(e.dernierVisiteTechnique).toLocaleDateString('fr-FR') : '',
            e.prochainVisiteTechnique ? new Date(e.prochainVisiteTechnique).toLocaleDateString('fr-FR') : '',
            e.dateExpirationVGP ? new Date(e.dateExpirationVGP).toLocaleDateString('fr-FR') : '',
            e.dateExpirationAssurance ? new Date(e.dateExpirationAssurance).toLocaleDateString('fr-FR') : '',
        ]);
        return this.toCSV(headers, rows);
    }
};
exports.ExportService = ExportService;
exports.ExportService = ExportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExportService);
//# sourceMappingURL=export.service.js.map