import { PrismaService } from '../prisma/prisma.service';
export declare class ExportService {
    private prisma;
    constructor(prisma: PrismaService);
    private toCSV;
    exportOuvriers(): Promise<string>;
    exportHabilitations(): Promise<string>;
    exportEngins(): Promise<string>;
}
