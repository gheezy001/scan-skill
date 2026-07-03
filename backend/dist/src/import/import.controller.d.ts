import { ImportService } from './import.service';
export declare class ImportController {
    private svc;
    constructor(svc: ImportService);
    importOuvriers(body: {
        content: string;
    }): Promise<{
        success: number;
        errors: string[];
        skippedExisting: number;
    }>;
    importHabilitations(body: {
        content: string;
    }): Promise<{
        success: number;
        errors: string[];
        skippedNotFound: number;
    }>;
    importEngins(body: {
        content: string;
    }): Promise<{
        success: number;
        errors: string[];
        skippedExisting: number;
    }>;
}
