import { PrismaService } from '../prisma/prisma.service';
export declare class ModeOperatoireService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(search?: string, statut?: string): Promise<({
        activites: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            document: string | null;
            titre: string;
            ordre: number;
            modeOperatoireId: string;
        }[];
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        statut: import(".prisma/client").$Enums.StatutMO;
        titre: string;
    })[]>;
    findOne(id: string): Promise<{
        activites: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            document: string | null;
            titre: string;
            ordre: number;
            modeOperatoireId: string;
        }[];
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        statut: import(".prisma/client").$Enums.StatutMO;
        titre: string;
    }>;
    create(data: {
        titre: string;
        description?: string;
    }): Promise<{
        activites: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            document: string | null;
            titre: string;
            ordre: number;
            modeOperatoireId: string;
        }[];
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        statut: import(".prisma/client").$Enums.StatutMO;
        titre: string;
    }>;
    update(id: string, data: {
        titre?: string;
        description?: string;
        statut?: any;
    }): Promise<{
        activites: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            document: string | null;
            titre: string;
            ordre: number;
            modeOperatoireId: string;
        }[];
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        statut: import(".prisma/client").$Enums.StatutMO;
        titre: string;
    }>;
    delete(id: string): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        statut: import(".prisma/client").$Enums.StatutMO;
        titre: string;
    }>;
    approuver(id: string): Promise<{
        activites: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            document: string | null;
            titre: string;
            ordre: number;
            modeOperatoireId: string;
        }[];
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        statut: import(".prisma/client").$Enums.StatutMO;
        titre: string;
    }>;
    rejeter(id: string): Promise<{
        activites: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            document: string | null;
            titre: string;
            ordre: number;
            modeOperatoireId: string;
        }[];
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        statut: import(".prisma/client").$Enums.StatutMO;
        titre: string;
    }>;
    addActivite(modeOperatoireId: string, data: {
        titre: string;
        description?: string;
        document?: string;
        ordre?: number;
    }): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        document: string | null;
        titre: string;
        ordre: number;
        modeOperatoireId: string;
    }>;
    updateActivite(id: string, data: {
        titre?: string;
        description?: string;
        document?: string;
        ordre?: number;
    }): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        document: string | null;
        titre: string;
        ordre: number;
        modeOperatoireId: string;
    }>;
    deleteActivite(id: string): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        document: string | null;
        titre: string;
        ordre: number;
        modeOperatoireId: string;
    }>;
}
