import { Module } from '@nestjs/common';
import { AiAnalysisController } from './ai-analysis.controller';

@Module({ controllers: [AiAnalysisController] })
export class AiAnalysisModule {}
