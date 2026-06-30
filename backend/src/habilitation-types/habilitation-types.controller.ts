import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { HabilitationTypesService } from './habilitation-types.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('habilitation-types')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HabilitationTypesController {
  constructor(private svc: HabilitationTypesService) {}

  @Get()
  @Roles('ADMIN', 'USER')
  findAll() { return this.svc.findAll(); }

  @Post()
  @Roles('ADMIN')
  create(@Body() data: any) { return this.svc.create(data); }

  @Put(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() data: any) { return this.svc.update(id, data); }

  @Delete(':id')
  @Roles('ADMIN')
  delete(@Param('id') id: string) { return this.svc.delete(id); }
}
