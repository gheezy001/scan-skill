import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { EnginsService } from './engins.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('engins')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EnginsController {
  constructor(private readonly enginsService: EnginsService) {}

  @Get()
  @Roles('ADMIN')
  findAll(@Query('search') search?: string, @Query('statut') statut?: string, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.enginsService.findAll(search, statut, Number(page) || 1, Number(limit) || 50);
  }

  @Get(':id')
  @Roles('ADMIN', 'USER')
  findOne(@Param('id') id: string) {
    return this.enginsService.findOne(id);
  }

  @Post()
  @Roles('ADMIN')
  create(@Body() data: any) {
    return this.enginsService.create(data);
  }

  @Put(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() data: any) {
    return this.enginsService.update(id, data);
  }

  @Delete(':id')
  @Roles('ADMIN')
  delete(@Param('id') id: string) {
    return this.enginsService.delete(id);
  }
}
