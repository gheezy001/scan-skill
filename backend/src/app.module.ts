import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { OuvriersModule } from './ouvriers/ouvriers.module';
import { EnginsModule } from './engins/engins.module';
import { AppareilsModule } from './appareils/appareils.module';
import { HabilitationTypesModule } from './habilitation-types/habilitation-types.module';
import { StatsModule } from './stats/stats.module';
import { ImportModule } from './import/import.module';
import { ExportModule } from './export/export.module';
import { MailModule } from './mail/mail.module';
import { AiAnalysisModule } from './ai-analysis/ai-analysis.module';
import { VerifyModule } from './verify/verify.module';
import { UploadModule } from './upload/upload.module';
import { ModeOperatoireModule } from './mode-operatoire/mode-operatoire.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    OuvriersModule,
    EnginsModule,
    AppareilsModule,
    HabilitationTypesModule,
    StatsModule,
    ImportModule,
    ExportModule,
    MailModule,
    AiAnalysisModule,
    VerifyModule,
    UploadModule,
    ModeOperatoireModule,
  ],
})
export class AppModule {}
