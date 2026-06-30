"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const ouvriers_module_1 = require("./ouvriers/ouvriers.module");
const engins_module_1 = require("./engins/engins.module");
const appareils_module_1 = require("./appareils/appareils.module");
const habilitation_types_module_1 = require("./habilitation-types/habilitation-types.module");
const stats_module_1 = require("./stats/stats.module");
const import_module_1 = require("./import/import.module");
const export_module_1 = require("./export/export.module");
const mail_module_1 = require("./mail/mail.module");
const ai_analysis_module_1 = require("./ai-analysis/ai-analysis.module");
const verify_module_1 = require("./verify/verify.module");
const upload_module_1 = require("./upload/upload.module");
const mode_operatoire_module_1 = require("./mode-operatoire/mode-operatoire.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            ouvriers_module_1.OuvriersModule,
            engins_module_1.EnginsModule,
            appareils_module_1.AppareilsModule,
            habilitation_types_module_1.HabilitationTypesModule,
            stats_module_1.StatsModule,
            import_module_1.ImportModule,
            export_module_1.ExportModule,
            mail_module_1.MailModule,
            ai_analysis_module_1.AiAnalysisModule,
            verify_module_1.VerifyModule,
            upload_module_1.UploadModule,
            mode_operatoire_module_1.ModeOperatoireModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map