import { HabilitationTypesService } from './habilitation-types.service';
export declare class HabilitationTypesController {
    private svc;
    constructor(svc: HabilitationTypesService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        description: string | null;
        entreprise: string | null;
        dureeValidite: string | null;
    }[]>;
    create(data: any): import(".prisma/client").Prisma.Prisma__TypeHabilitationClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        description: string | null;
        entreprise: string | null;
        dureeValidite: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, data: any): import(".prisma/client").Prisma.Prisma__TypeHabilitationClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        description: string | null;
        entreprise: string | null;
        dureeValidite: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    delete(id: string): import(".prisma/client").Prisma.Prisma__TypeHabilitationClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        description: string | null;
        entreprise: string | null;
        dureeValidite: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
