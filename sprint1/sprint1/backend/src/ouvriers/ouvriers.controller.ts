import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { OuvriersService } from './ouvriers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('ouvriers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OuvriersController {
  constructor(private readonly ouvriersService: OuvriersService) {}

  @Get()
  @Roles('ADMIN')
  findAll(
    @Query('search') search?: string,
    @Query('statut') statut?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.ouvriersService.findAll(search, statut, Number(page) || 1, Number(limit) || 50);
  }

  @Get('all/habilitations')
  @Roles('ADMIN')
  findAllHabilitations() {
    return this.ouvriersService.findAllHabilitations();
  }

  @Get('expiring')
  @Roles('ADMIN')
  findExpiring(@Query('days') days?: string) {
    return this.ouvriersService.findExpiringHabilitations(Number(days) || 30);
  }

  @Get(':id')
  @Roles('ADMIN', 'USER')
  findOne(@Param('id') id: string) {
    return this.ouvriersService.findOne(id);
  }

  @Post()
  @Roles('ADMIN')
  create(@Body() data: any) {
    return this.ouvriersService.create(data);
  }

  @Put(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() data: any) {
    return this.ouvriersService.update(id, data);
  }

  @Delete(':id')
  @Roles('ADMIN')
  delete(@Param('id') id: string) {
    return this.ouvriersService.delete(id);
  }

  @Post(':id/habilitations')
  @Roles('ADMIN')
  addHabilitation(@Param('id') id: string, @Body() data: any) {
    return this.ouvriersService.addHabilitation(id, data);
  }

  @Put('habilitations/:id')
  @Roles('ADMIN')
  updateHabilitation(@Param('id') id: string, @Body() data: any) {
    return this.ouvriersService.updateHabilitation(id, data);
  }

  @Delete('habilitations/:id')
  @Roles('ADMIN')
  deleteHabilitation(@Param('id') id: string) {
    return this.ouvriersService.deleteHabilitation(id);
  }
}
