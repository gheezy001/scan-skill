import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ImportService } from './import.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('import')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ImportController {
  constructor(private svc: ImportService) {}

  @Post('ouvriers')
  @Roles('ADMIN')
  importOuvriers(@Body() body: { content: string }) {
    return this.svc.importOuvriers(body.content);
  }

  @Post('habilitations')
  @Roles('ADMIN')
  importHabilitations(@Body() body: { content: string }) {
    return this.svc.importHabilitations(body.content);
  }

  @Post('engins')
  @Roles('ADMIN')
  importEngins(@Body() body: { content: string }) {
    return this.svc.importEngins(body.content);
  }
}
