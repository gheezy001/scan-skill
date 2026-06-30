import { HabilitationTypesService } from './habilitation-types.service';
export declare class HabilitationTypesController {
    private svc;
    constructor(svc: HabilitationTypesService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        nom: string;
        description: string | null;
        entreprise: string | null;
        dureeValidite: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    create(data: any): import(".prisma/client").Prisma.Prisma__TypeHabilitationClient<{
        id: string;
        nom: string;
        description: string | null;
        entreprise: string | null;
        dureeValidite: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, data: any): import(".prisma/client").Prisma.Prisma__TypeHabilitationClient<{
        id: string;
        nom: string;
        description: string | null;
        entreprise: string | null;
        dureeValidite: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    delete(id: string): import(".prisma/client").Prisma.Prisma__TypeHabilitationClient<{
        id: string;
        nom: string;
        description: string | null;
        entreprise: string | null;
        dureeValidite: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
