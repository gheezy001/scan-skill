import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
export declare class OuvriersService {
    private prisma;
    private mail;
    constructor(prisma: PrismaService, mail: MailService);
    refreshStatutsHabilitations(): Promise<void>;
    sendExpirationAlerts(): Promise<void>;
    findAll(search?: string, statut?: string, page?: number, limit?: number): Promise<{
        data: ({
            habilitations: ({
                typeHabilitation: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    nom: string;
                    description: string | null;
                    entreprise: string | null;
                    dureeValidite: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                nom: string;
                entreprise: string | null;
                dateObtention: Date;
                dateExpiration: Date;
                document: string | null;
                statut: import(".prisma/client").$Enums.StatutHabilitation;
                typeId: string;
                collaborateurId: string;
            })[];
        } & {
            id: string;
            email: string | null;
            role: string;
            createdAt: Date;
            updatedAt: Date;
            nom: string;
            entreprise: string | null;
            statut: import(".prisma/client").$Enums.StatutCollaborateur;
            prenom: string;
            telephone: string;
            photo: string | null;
            dateEmbauche: Date | null;
            adresse: string | null;
            nationalite: string | null;
            groupeSanguin: string | null;
            numeroPieceIdentite: string | null;
            typePieceIdentite: import(".prisma/client").$Enums.TypePieceIdentite | null;
            contactUrgenceNom: string | null;
            contactUrgenceTel: string | null;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<{
        habilitations: ({
            typeHabilitation: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                nom: string;
                description: string | null;
                entreprise: string | null;
                dureeValidite: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nom: string;
            entreprise: string | null;
            dateObtention: Date;
            dateExpiration: Date;
            document: string | null;
            statut: import(".prisma/client").$Enums.StatutHabilitation;
            typeId: string;
            collaborateurId: string;
        })[];
        appareils: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nom: string;
            statut: import(".prisma/client").$Enums.StatutAppareil;
            reference: string;
            type: string;
            localisation: string | null;
            documentationTechnique: string | null;
            dateAcquisition: Date | null;
            dateDerniereRevision: Date | null;
            collaborateurAssigneId: string | null;
            enginAssigneId: string | null;
        }[];
    } & {
        id: string;
        email: string | null;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        entreprise: string | null;
        statut: import(".prisma/client").$Enums.StatutCollaborateur;
        prenom: string;
        telephone: string;
        photo: string | null;
        dateEmbauche: Date | null;
        adresse: string | null;
        nationalite: string | null;
        groupeSanguin: string | null;
        numeroPieceIdentite: string | null;
        typePieceIdentite: import(".prisma/client").$Enums.TypePieceIdentite | null;
        contactUrgenceNom: string | null;
        contactUrgenceTel: string | null;
    }>;
    create(data: any): Promise<{
        habilitations: ({
            typeHabilitation: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                nom: string;
                description: string | null;
                entreprise: string | null;
                dureeValidite: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nom: string;
            entreprise: string | null;
            dateObtention: Date;
            dateExpiration: Date;
            document: string | null;
            statut: import(".prisma/client").$Enums.StatutHabilitation;
            typeId: string;
            collaborateurId: string;
        })[];
    } & {
        id: string;
        email: string | null;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        entreprise: string | null;
        statut: import(".prisma/client").$Enums.StatutCollaborateur;
        prenom: string;
        telephone: string;
        photo: string | null;
        dateEmbauche: Date | null;
        adresse: string | null;
        nationalite: string | null;
        groupeSanguin: string | null;
        numeroPieceIdentite: string | null;
        typePieceIdentite: import(".prisma/client").$Enums.TypePieceIdentite | null;
        contactUrgenceNom: string | null;
        contactUrgenceTel: string | null;
    }>;
    update(id: string, data: any): Promise<{
        habilitations: ({
            typeHabilitation: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                nom: string;
                description: string | null;
                entreprise: string | null;
                dureeValidite: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nom: string;
            entreprise: string | null;
            dateObtention: Date;
            dateExpiration: Date;
            document: string | null;
            statut: import(".prisma/client").$Enums.StatutHabilitation;
            typeId: string;
            collaborateurId: string;
        })[];
    } & {
        id: string;
        email: string | null;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        entreprise: string | null;
        statut: import(".prisma/client").$Enums.StatutCollaborateur;
        prenom: string;
        telephone: string;
        photo: string | null;
        dateEmbauche: Date | null;
        adresse: string | null;
        nationalite: string | null;
        groupeSanguin: string | null;
        numeroPieceIdentite: string | null;
        typePieceIdentite: import(".prisma/client").$Enums.TypePieceIdentite | null;
        contactUrgenceNom: string | null;
        contactUrgenceTel: string | null;
    }>;
    delete(id: string): Promise<{
        id: string;
        email: string | null;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        entreprise: string | null;
        statut: import(".prisma/client").$Enums.StatutCollaborateur;
        prenom: string;
        telephone: string;
        photo: string | null;
        dateEmbauche: Date | null;
        adresse: string | null;
        nationalite: string | null;
        groupeSanguin: string | null;
        numeroPieceIdentite: string | null;
        typePieceIdentite: import(".prisma/client").$Enums.TypePieceIdentite | null;
        contactUrgenceNom: string | null;
        contactUrgenceTel: string | null;
    }>;
    addHabilitation(collaborateurId: string, data: any): Promise<{
        typeHabilitation: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nom: string;
            description: string | null;
            entreprise: string | null;
            dureeValidite: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        entreprise: string | null;
        dateObtention: Date;
        dateExpiration: Date;
        document: string | null;
        statut: import(".prisma/client").$Enums.StatutHabilitation;
        typeId: string;
        collaborateurId: string;
    }>;
    updateHabilitation(id: string, data: any): Promise<{
        typeHabilitation: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nom: string;
            description: string | null;
            entreprise: string | null;
            dureeValidite: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        entreprise: string | null;
        dateObtention: Date;
        dateExpiration: Date;
        document: string | null;
        statut: import(".prisma/client").$Enums.StatutHabilitation;
        typeId: string;
        collaborateurId: string;
    }>;
    deleteHabilitation(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        entreprise: string | null;
        dateObtention: Date;
        dateExpiration: Date;
        document: string | null;
        statut: import(".prisma/client").$Enums.StatutHabilitation;
        typeId: string;
        collaborateurId: string;
    }>;
    findAllHabilitations(): Promise<({
        typeHabilitation: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nom: string;
            description: string | null;
            entreprise: string | null;
            dureeValidite: string | null;
        };
        collaborateur: {
            id: string;
            email: string | null;
            role: string;
            createdAt: Date;
            updatedAt: Date;
            nom: string;
            entreprise: string | null;
            statut: import(".prisma/client").$Enums.StatutCollaborateur;
            prenom: string;
            telephone: string;
            photo: string | null;
            dateEmbauche: Date | null;
            adresse: string | null;
            nationalite: string | null;
            groupeSanguin: string | null;
            numeroPieceIdentite: string | null;
            typePieceIdentite: import(".prisma/client").$Enums.TypePieceIdentite | null;
            contactUrgenceNom: string | null;
            contactUrgenceTel: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        entreprise: string | null;
        dateObtention: Date;
        dateExpiration: Date;
        document: string | null;
        statut: import(".prisma/client").$Enums.StatutHabilitation;
        typeId: string;
        collaborateurId: string;
    })[]>;
    findExpiringHabilitations(days?: number): Promise<({
        typeHabilitation: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nom: string;
            description: string | null;
            entreprise: string | null;
            dureeValidite: string | null;
        };
        collaborateur: {
            id: string;
            email: string | null;
            role: string;
            createdAt: Date;
            updatedAt: Date;
            nom: string;
            entreprise: string | null;
            statut: import(".prisma/client").$Enums.StatutCollaborateur;
            prenom: string;
            telephone: string;
            photo: string | null;
            dateEmbauche: Date | null;
            adresse: string | null;
            nationalite: string | null;
            groupeSanguin: string | null;
            numeroPieceIdentite: string | null;
            typePieceIdentite: import(".prisma/client").$Enums.TypePieceIdentite | null;
            contactUrgenceNom: string | null;
            contactUrgenceTel: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        entreprise: string | null;
        dateObtention: Date;
        dateExpiration: Date;
        document: string | null;
        statut: import(".prisma/client").$Enums.StatutHabilitation;
        typeId: string;
        collaborateurId: string;
    })[]>;
}
