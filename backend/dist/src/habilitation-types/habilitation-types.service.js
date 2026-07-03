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
exports.HabilitationTypesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let HabilitationTypesService = class HabilitationTypesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll() {
        return this.prisma.typeHabilitation.findMany({ orderBy: { nom: 'asc' } });
    }
    create(data) {
        return this.prisma.typeHabilitation.create({ data });
    }
    update(id, data) {
        return this.prisma.typeHabilitation.update({ where: { id }, data });
    }
    delete(id) {
        return this.prisma.typeHabilitation.delete({ where: { id } });
    }
};
exports.HabilitationTypesService = HabilitationTypesService;
exports.HabilitationTypesService = HabilitationTypesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HabilitationTypesService);
//# sourceMappingURL=habilitation-types.service.js.map