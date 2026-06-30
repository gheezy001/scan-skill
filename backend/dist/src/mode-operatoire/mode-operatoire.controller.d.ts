import { ModeOperatoireService } from './mode-operatoire.service';
export declare class ModeOperatoireController {
    private readonly service;
    constructor(service: ModeOperatoireService);
    findAll(search?: string, statut?: string): Promise<({
        activites: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            document: string | null;
            titre: string;
            ordre: number;
            modeOperatoireId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        statut: import(".prisma/client").$Enums.StatutMO;
        titre: string;
    })[]>;
    findOne(id: string): Promise<{
        activites: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            document: string | null;
            titre: string;
            ordre: number;
            modeOperatoireId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        statut: import(".prisma/client").$Enums.StatutMO;
        titre: string;
    }>;
    create(data: any): Promise<{
        activites: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            document: string | null;
            titre: string;
            ordre: number;
            modeOperatoireId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        statut: import(".prisma/client").$Enums.StatutMO;
        titre: string;
    }>;
    update(id: string, data: any): Promise<{
        activites: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            document: string | null;
            titre: string;
            ordre: number;
            modeOperatoireId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        statut: import(".prisma/client").$Enums.StatutMO;
        titre: string;
    }>;
    delete(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        statut: import(".prisma/client").$Enums.StatutMO;
        titre: string;
    }>;
    approuver(id: string): Promise<{
        activites: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            document: string | null;
            titre: string;
            ordre: number;
            modeOperatoireId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        statut: import(".prisma/client").$Enums.StatutMO;
        titre: string;
    }>;
    rejeter(id: string): Promise<{
        activites: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            document: string | null;
            titre: string;
            ordre: number;
            modeOperatoireId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        statut: import(".prisma/client").$Enums.StatutMO;
        titre: string;
    }>;
    addActivite(id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        document: string | null;
        titre: string;
        ordre: number;
        modeOperatoireId: string;
    }>;
    updateActivite(id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        document: string | null;
        titre: string;
        ordre: number;
        modeOperatoireId: string;
    }>;
    deleteActivite(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        document: string | null;
        titre: string;
        ordre: number;
        modeOperatoireId: string;
    }>;
}
