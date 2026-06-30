import { Module } from '@nestjs/common';
import { OuvriersController } from './ouvriers.controller';
import { OuvriersService } from './ouvriers.service';

@Module({ controllers: [OuvriersController], providers: [OuvriersService], exports: [OuvriersService] })
export class OuvriersModule {}
