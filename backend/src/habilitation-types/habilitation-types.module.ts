import { Module } from '@nestjs/common';
import { HabilitationTypesController } from './habilitation-types.controller';
import { HabilitationTypesService } from './habilitation-types.service';

@Module({ controllers: [HabilitationTypesController], providers: [HabilitationTypesService] })
export class HabilitationTypesModule {}
