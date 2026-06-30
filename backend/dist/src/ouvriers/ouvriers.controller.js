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
exports.OuvriersController = void 0;
const common_1 = require("@nestjs/common");
const ouvriers_service_1 = require("./ouvriers.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let OuvriersController = class OuvriersController {
    constructor(ouvriersService) {
        this.ouvriersService = ouvriersService;
    }
    findAll(search, statut, page, limit) {
        return this.ouvriersService.findAll(search, statut, Number(page) || 1, Number(limit) || 50);
    }
    findAllHabilitations() {
        return this.ouvriersService.findAllHabilitations();
    }
    findExpiring(days) {
        return this.ouvriersService.findExpiringHabilitations(Number(days) || 30);
    }
    findOne(id) {
        return this.ouvriersService.findOne(id);
    }
    create(data) {
        return this.ouvriersService.create(data);
    }
    update(id, data) {
        return this.ouvriersService.update(id, data);
    }
    delete(id) {
        return this.ouvriersService.delete(id);
    }
    addHabilitation(id, data) {
        return this.ouvriersService.addHabilitation(id, data);
    }
    updateHabilitation(id, data) {
        return this.ouvriersService.updateHabilitation(id, data);
    }
    deleteHabilitation(id) {
        return this.ouvriersService.deleteHabilitation(id);
    }
};
exports.OuvriersController = OuvriersController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('statut')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], OuvriersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('all/habilitations'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OuvriersController.prototype, "findAllHabilitations", null);
__decorate([
    (0, common_1.Get)('expiring'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OuvriersController.prototype, "findExpiring", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('ADMIN', 'USER'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OuvriersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OuvriersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OuvriersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OuvriersController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/habilitations'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OuvriersController.prototype, "addHabilitation", null);
__decorate([
    (0, common_1.Put)('habilitations/:id'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OuvriersController.prototype, "updateHabilitation", null);
__decorate([
    (0, common_1.Delete)('habilitations/:id'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OuvriersController.prototype, "deleteHabilitation", null);
exports.OuvriersController = OuvriersController = __decorate([
    (0, common_1.Controller)('ouvriers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [ouvriers_service_1.OuvriersService])
], OuvriersController);
//# sourceMappingURL=ouvriers.controller.js.map