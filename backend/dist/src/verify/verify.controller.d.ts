import { PrismaService } from '../prisma/prisma.service';
export declare class VerifyController {
    private prisma;
    constructor(prisma: PrismaService);
    verify(code: string): Promise<{
        type: string;
        conforme: boolean;
        entity: {
            id: string;
            nom: string;
            entreprise: string;
            habilitations: {
                id: string;
                nom: string;
                statut: import(".prisma/client").$Enums.StatutHabilitation;
                dateExpiration: Date;
                document: string;
            }[];
            prenom: string;
            telephone: string;
            photo: string;
            role: string;
            statut: import(".prisma/client").$Enums.StatutCollaborateur;
        };
    } | {
        type: string;
        conforme: boolean;
        entity: {
            id: string;
            statut: import(".prisma/client").$Enums.StatutEngin;
            type: string;
            marque: string;
            modele: string;
            immatriculation: string;
            lieuAffectation: string;
            dernierVisiteTechnique: Date;
            prochainVisiteTechnique: Date;
            dateExpirationVGP: Date;
            dateExpirationAssurance: Date;
            vgpFournit: string;
        };
    } | {
        type: string;
        conforme: boolean;
        entity: {
            id: string;
            nom: string;
            statut: import(".prisma/client").$Enums.StatutAppareil;
            reference: string;
            type: string;
            localisation: string;
            documentationTechnique: string;
        };
    }>;
}
