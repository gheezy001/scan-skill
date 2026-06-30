import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AppareilsService } from './appareils.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('appareils')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppareilsController {
  constructor(private readonly appareilsService: AppareilsService) {}

  @Get()
  @Roles('ADMIN')
  findAll(@Query('search') s?: string, @Query('statut') st?: string, @Query('page') p?: string, @Query('limit') l?: string) {
    return this.appareilsService.findAll(s, st, Number(p) || 1, Number(l) || 50);
  }

  @Get(':id')
  @Roles('ADMIN', 'USER')
  findOne(@Param('id') id: string) {
    return this.appareilsService.findOne(id);
  }

  @Post()
  @Roles('ADMIN')
  create(@Body() data: any) {
    return this.appareilsService.create(data);
  }

  @Put(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() data: any) {
    return this.appareilsService.update(id, data);
  }

  @Delete(':id')
  @Roles('ADMIN')
  delete(@Param('id') id: string) {
    return this.appareilsService.delete(id);
  }
}
