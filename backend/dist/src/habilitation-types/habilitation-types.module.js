"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HabilitationTypesModule = void 0;
const common_1 = require("@nestjs/common");
const habilitation_types_controller_1 = require("./habilitation-types.controller");
const habilitation_types_service_1 = require("./habilitation-types.service");
let HabilitationTypesModule = class HabilitationTypesModule {
};
exports.HabilitationTypesModule = HabilitationTypesModule;
exports.HabilitationTypesModule = HabilitationTypesModule = __decorate([
    (0, common_1.Module)({ controllers: [habilitation_types_controller_1.HabilitationTypesController], providers: [habilitation_types_service_1.HabilitationTypesService] })
], HabilitationTypesModule);
//# sourceMappingURL=habilitation-types.module.js.map