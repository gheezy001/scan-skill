import {
  Controller, Get, Post, Put, Delete, Patch,
  Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { ModeOperatoireService } from './mode-operatoire.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('mode-operatoires')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ModeOperatoireController {
  constructor(private readonly service: ModeOperatoireService) {}

  @Get()
  @Roles('ADMIN', 'USER')
  findAll(@Query('search') search?: string, @Query('statut') statut?: string) {
    return this.service.findAll(search, statut);
  }

  @Get(':id')
  @Roles('ADMIN', 'USER')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @Roles('ADMIN')
  create(@Body() data: any) {
    return this.service.create(data);
  }

  @Put(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() data: any) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @Roles('ADMIN')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Patch(':id/approuver')
  @Roles('ADMIN')
  approuver(@Param('id') id: string) {
    return this.service.approuver(id);
  }

  @Patch(':id/rejeter')
  @Roles('ADMIN')
  rejeter(@Param('id') id: string) {
    return this.service.rejeter(id);
  }

  @Post(':id/activites')
  @Roles('ADMIN')
  addActivite(@Param('id') id: string, @Body() data: any) {
    return this.service.addActivite(id, data);
  }

  @Put('activites/:id')
  @Roles('ADMIN')
  updateActivite(@Param('id') id: string, @Body() data: any) {
    return this.service.updateActivite(id, data);
  }

  @Delete('activites/:id')
  @Roles('ADMIN')
  deleteActivite(@Param('id') id: string) {
    return this.service.deleteActivite(id);
  }
}
