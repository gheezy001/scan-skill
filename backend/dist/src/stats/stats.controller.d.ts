import { StatsService } from './stats.service';
export declare class StatsController {
    private svc;
    constructor(svc: StatsService);
    getDashboard(): Promise<{
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
