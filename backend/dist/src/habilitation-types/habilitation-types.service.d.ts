import { PrismaService } from '../prisma/prisma.service';
export declare class HabilitationTypesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        description: string | null;
        entreprise: string | null;
        dureeValidite: string | null;
    }[]>;
    create(data: {
        nom: string;
        description?: string;
        entreprise?: string;
        dureeValidite?: string;
    }): import(".prisma/client").Prisma.Prisma__TypeHabilitationClient<{
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
