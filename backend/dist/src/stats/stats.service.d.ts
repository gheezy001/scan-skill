import { PrismaService } from '../prisma/prisma.service';
export declare class StatsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<{
        totalCollaborateurs: number;
        totalEngins: number;
        totalAppareils: number;
        collaborateursConformes: number;
        collaborateursNonConformes: number;
        enginsConformes: number;
        enginsNonConformes: number;
        enginsExpireBientot: number;
        appareilsDisponibles: number;
        appareilsIndisponibles: number;
        habExpirantBientot: number;
        tauxConformiteCollaborateurs: number;
        tauxConformiteEngins: number;
        tauxDisponibiliteAppareils: number;
        alertesTotal: number;
        totalOuvriers: number;
        ouvriersConformes: number;
        ouvriersNonConformes: number;
        tauxConformiteOuvriers: number;
    }>;
}
