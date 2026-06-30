"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
const uuid_1 = require("uuid");
let UploadService = class UploadService {
    constructor() {
        this.uploadDir = (0, path_1.join)(process.cwd(), 'uploads');
        this.baseUrl = process.env.UPLOAD_BASE_URL || `http://localhost:${process.env.PORT || 8000}`;
        if (!(0, fs_1.existsSync)(this.uploadDir)) {
            (0, fs_1.mkdirSync)(this.uploadDir, { recursive: true });
        }
    }
    async uploadFile(buffer, originalName, mimeType, folder = 'documents') {
        const allowedTypes = [
            'image/jpeg', 'image/png', 'image/webp',
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
        ];
        if (!allowedTypes.includes(mimeType)) {
            throw new common_1.BadRequestException(`Type de fichier non autorisé: ${mimeType}`);
        }
        const maxSize = 10 * 1024 * 1024;
        if (buffer.length > maxSize) {
            throw new common_1.BadRequestException('Fichier trop volumineux (max 10MB)');
        }
        const ext = (0, path_1.extname)(originalName).toLowerCase() || '.bin';
        const filename = `${(0, uuid_1.v4)()}${ext}`;
        const folderPath = (0, path_1.join)(this.uploadDir, folder);
        if (!(0, fs_1.existsSync)(folderPath)) {
            (0, fs_1.mkdirSync)(folderPath, { recursive: true });
        }
        const filePath = (0, path_1.join)(folderPath, filename);
        (0, fs_1.writeFileSync)(filePath, buffer);
        return `${this.baseUrl}/api/uploads/${folder}/${filename}`;
    }
    async deleteFile(url) {
        if (!url)
            return;
        try {
            const path = url.replace(`${this.baseUrl}/api/uploads/`, '');
            const filePath = (0, path_1.join)(this.uploadDir, path);
            if ((0, fs_1.existsSync)(filePath))
                (0, fs_1.unlinkSync)(filePath);
        }
        catch (e) {
            console.error('[Upload] Erreur suppression:', e.message);
        }
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], UploadService);
//# sourceMappingURL=upload.service.js.map