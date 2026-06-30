import { Injectable, BadRequestException } from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync, unlinkSync } from 'fs';
import { join, extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

// Service d'upload local pour le développement.
// En production Azure, remplacer par @azure/storage-blob.
@Injectable()
export class UploadService {
  private readonly uploadDir: string;
  private readonly baseUrl: string;

  constructor() {
    this.uploadDir = join(process.cwd(), 'uploads');
    this.baseUrl = process.env.UPLOAD_BASE_URL || `http://localhost:${process.env.PORT || 8000}`;
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    folder: string = 'documents',
  ): Promise<string> {
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/webp',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];

    if (!allowedTypes.includes(mimeType)) {
      throw new BadRequestException(`Type de fichier non autorisé: ${mimeType}`);
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (buffer.length > maxSize) {
      throw new BadRequestException('Fichier trop volumineux (max 10MB)');
    }

    const ext = extname(originalName).toLowerCase() || '.bin';
    const filename = `${uuidv4()}${ext}`;
    const folderPath = join(this.uploadDir, folder);

    if (!existsSync(folderPath)) {
      mkdirSync(folderPath, { recursive: true });
    }

    const filePath = join(folderPath, filename);
    writeFileSync(filePath, buffer);

    return `${this.baseUrl}/api/uploads/${folder}/${filename}`;
  }

  async deleteFile(url: string): Promise<void> {
    if (!url) return;
    try {
      const path = url.replace(`${this.baseUrl}/api/uploads/`, '');
      const filePath = join(this.uploadDir, path);
      if (existsSync(filePath)) unlinkSync(filePath);
    } catch (e) {
      console.error('[Upload] Erreur suppression:', e.message);
    }
  }
}
