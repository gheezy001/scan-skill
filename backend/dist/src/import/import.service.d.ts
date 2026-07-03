import { PrismaService } from '../prisma/prisma.service';
export declare class ImportService {
    private prisma;
    constructor(prisma: PrismaService);
    private parseDate;
    importOuvriers(fileContent: string): Promise<{
        success: number;
        errors: string[];
        skippedExisting: number;
    }>;
    importHabilitations(fileContent: string): Promise<{
        success: number;
        errors: string[];
        skippedNotFound: number;
    }>;
    importEngins(fileContent: string): Promise<{
        success: number;
        errors: string[];
        skippedExisting: number;
    }>;
}
