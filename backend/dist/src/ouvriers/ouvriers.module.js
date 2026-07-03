"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OuvriersModule = void 0;
const common_1 = require("@nestjs/common");
const ouvriers_controller_1 = require("./ouvriers.controller");
const ouvriers_service_1 = require("./ouvriers.service");
let OuvriersModule = class OuvriersModule {
};
exports.OuvriersModule = OuvriersModule;
exports.OuvriersModule = OuvriersModule = __decorate([
    (0, common_1.Module)({ controllers: [ouvriers_controller_1.OuvriersController], providers: [ouvriers_service_1.OuvriersService], exports: [ouvriers_service_1.OuvriersService] })
], OuvriersModule);
//# sourceMappingURL=ouvriers.module.js.map