import { UploadService } from './upload.service';
import { Response } from 'express';
export declare class UploadController {
    private uploadService;
    constructor(uploadService: UploadService);
    uploadFile(file: Express.Multer.File, folder: string): Promise<{
        url: string;
        filename: string;
        size: number;
    }>;
    serveFile(folder: string, filename: string, res: Response): void | Response<any, Record<string, any>>;
}
