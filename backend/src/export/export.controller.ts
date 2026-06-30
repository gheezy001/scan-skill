import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ExportService } from './export.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('export')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExportController {
  constructor(private svc: ExportService) {}

  @Get('ouvriers')
  @Roles('ADMIN')
  async exportOuvriers(@Res() res: Response) {
    const csv = await this.svc.exportOuvriers();
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="ouvriers.csv"');
    res.send('\uFEFF' + csv);
  }

  @Get('habilitations')
  @Roles('ADMIN')
  async exportHabilitations(@Res() res: Response) {
    const csv = await this.svc.exportHabilitations();
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="habilitations.csv"');
    res.send('\uFEFF' + csv);
  }

  @Get('engins')
  @Roles('ADMIN')
  async exportEngins(@Res() res: Response) {
    const csv = await this.svc.exportEngins();
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="engins.csv"');
    res.send('\uFEFF' + csv);
  }
}
