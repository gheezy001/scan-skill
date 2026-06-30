import { Module } from '@nestjs/common';
import { ModeOperatoireController } from './mode-operatoire.controller';
import { ModeOperatoireService } from './mode-operatoire.service';

@Module({
  controllers: [ModeOperatoireController],
  providers: [ModeOperatoireService],
})
export class ModeOperatoireModule {}
