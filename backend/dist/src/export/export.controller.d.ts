import { Response } from 'express';
import { ExportService } from './export.service';
export declare class ExportController {
    private svc;
    constructor(svc: ExportService);
    exportOuvriers(res: Response): Promise<void>;
    exportHabilitations(res: Response): Promise<void>;
    exportEngins(res: Response): Promise<void>;
}
