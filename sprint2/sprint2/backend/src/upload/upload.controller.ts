import {
  Controller, Post, UseInterceptors, UploadedFile,
  UseGuards, Param, Get, Res, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UploadService } from './upload.service';
import { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

@Controller()
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('upload/:folder')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('folder') folder: string,
  ) {
    if (!file) throw new BadRequestException('Aucun fichier reçu');
    const url = await this.uploadService.uploadFile(
      file.buffer,
      file.originalname,
      file.mimetype,
      folder,
    );
    return { url, filename: file.originalname, size: file.size };
  }

  // Servir les fichiers uploadés localement
  @Get('uploads/:folder/:filename')
  serveFile(
    @Param('folder') folder: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const filePath = join(process.cwd(), 'uploads', folder, filename);
    if (!existsSync(filePath)) {
      return res.status(404).json({ message: 'Fichier non trouvé' });
    }
    return res.sendFile(filePath);
  }
}
