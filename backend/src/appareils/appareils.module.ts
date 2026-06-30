import { Module } from '@nestjs/common';
import { AppareilsController } from './appareils.controller';
import { AppareilsService } from './appareils.service';

@Module({ controllers: [AppareilsController], providers: [AppareilsService], exports: [AppareilsService] })
export class AppareilsModule {}
