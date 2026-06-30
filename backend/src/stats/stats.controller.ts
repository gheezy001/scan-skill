import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('stats')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StatsController {
  constructor(private svc: StatsService) {}

  @Get('dashboard')
  @Roles('ADMIN')
  getDashboard() { return this.svc.getDashboardStats(); }
}
