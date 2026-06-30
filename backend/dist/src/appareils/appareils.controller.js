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
exports.AppareilsController = void 0;
const common_1 = require("@nestjs/common");
const appareils_service_1 = require("./appareils.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let AppareilsController = class AppareilsController {
    constructor(appareilsService) {
        this.appareilsService = appareilsService;
    }
    findAll(s, st, p, l) {
        return this.appareilsService.findAll(s, st, Number(p) || 1, Number(l) || 50);
    }
    findOne(id) {
        return this.appareilsService.findOne(id);
    }
    create(data) {
        return this.appareilsService.create(data);
    }
    update(id, data) {
        return this.appareilsService.update(id, data);
    }
    delete(id) {
        return this.appareilsService.delete(id);
    }
};
exports.AppareilsController = AppareilsController;
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
], AppareilsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('ADMIN', 'USER'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppareilsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppareilsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AppareilsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppareilsController.prototype, "delete", null);
exports.AppareilsController = AppareilsController = __decorate([
    (0, common_1.Controller)('appareils'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [appareils_service_1.AppareilsService])
], AppareilsController);
//# sourceMappingURL=appareils.controller.js.map