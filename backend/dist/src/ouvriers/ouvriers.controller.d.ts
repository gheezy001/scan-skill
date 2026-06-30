import { OuvriersService } from './ouvriers.service';
export declare class OuvriersController {
    private readonly ouvriersService;
    constructor(ouvriersService: OuvriersService);
    findAll(search?: string, statut?: string, page?: string, limit?: string): Promise<{
        data: ({
            habilitations: ({
                typeHabilitation: {
                    id: string;
                    nom: string;
                    description: string | null;
                    entreprise: string | null;
                    dureeValidite: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                nom: string;
                entreprise: string | null;
                createdAt: Date;
                updatedAt: Date;
                statut: import(".prisma/client").$Enums.StatutHabilitation;
                dateObtention: Date;
                dateExpiration: Date;
                document: string | null;
                typeId: string;
                collaborateurId: string;
            })[];
        } & {
            id: string;
            nom: string;
            entreprise: string | null;
            createdAt: Date;
            updatedAt: Date;
            prenom: string;
            telephone: string;
            email: string | null;
            photo: string | null;
            role: string;
            dateEmbauche: Date | null;
            adresse: string | null;
            nationalite: string | null;
            groupeSanguin: string | null;
            numeroPieceIdentite: string | null;
            typePieceIdentite: import(".prisma/client").$Enums.TypePieceIdentite | null;
            contactUrgenceNom: string | null;
            contactUrgenceTel: string | null;
            statut: import(".prisma/client").$Enums.StatutCollaborateur;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    findAllHabilitations(): Promise<({
        typeHabilitation: {
            id: string;
            nom: string;
            description: string | null;
            entreprise: string | null;
            dureeValidite: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        collaborateur: {
            id: string;
            nom: string;
            entreprise: string | null;
            createdAt: Date;
            updatedAt: Date;
            prenom: string;
            telephone: string;
            email: string | null;
            photo: string | null;
            role: string;
            dateEmbauche: Date | null;
            adresse: string | null;
            nationalite: string | null;
            groupeSanguin: string | null;
            numeroPieceIdentite: string | null;
            typePieceIdentite: import(".prisma/client").$Enums.TypePieceIdentite | null;
            contactUrgenceNom: string | null;
            contactUrgenceTel: string | null;
            statut: import(".prisma/client").$Enums.StatutCollaborateur;
        };
    } & {
        id: string;
        nom: string;
        entreprise: string | null;
        createdAt: Date;
        updatedAt: Date;
        statut: import(".prisma/client").$Enums.StatutHabilitation;
        dateObtention: Date;
        dateExpiration: Date;
        document: string | null;
        typeId: string;
        collaborateurId: string;
    })[]>;
    findExpiring(days?: string): Promise<({
        typeHabilitation: {
            id: string;
            nom: string;
            description: string | null;
            entreprise: string | null;
            dureeValidite: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        collaborateur: {
            id: string;
            nom: string;
            entreprise: string | null;
            createdAt: Date;
            updatedAt: Date;
            prenom: string;
            telephone: string;
            email: string | null;
            photo: string | null;
            role: string;
            dateEmbauche: Date | null;
            adresse: string | null;
            nationalite: string | null;
            groupeSanguin: string | null;
            numeroPieceIdentite: string | null;
            typePieceIdentite: import(".prisma/client").$Enums.TypePieceIdentite | null;
            contactUrgenceNom: string | null;
            contactUrgenceTel: string | null;
            statut: import(".prisma/client").$Enums.StatutCollaborateur;
        };
    } & {
        id: string;
        nom: string;
        entreprise: string | null;
        createdAt: Date;
        updatedAt: Date;
        statut: import(".prisma/client").$Enums.StatutHabilitation;
        dateObtention: Date;
        dateExpiration: Date;
        document: string | null;
        typeId: string;
        collaborateurId: string;
    })[]>;
    findOne(id: string): Promise<{
        habilitations: ({
            typeHabilitation: {
                id: string;
                nom: string;
                description: string | null;
                entreprise: string | null;
                dureeValidite: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            nom: string;
            entreprise: string | null;
            createdAt: Date;
            updatedAt: Date;
            statut: import(".prisma/client").$Enums.StatutHabilitation;
            dateObtention: Date;
            dateExpiration: Date;
            document: string | null;
            typeId: string;
            collaborateurId: string;
        })[];
        appareils: {
            id: string;
            nom: string;
            createdAt: Date;
            updatedAt: Date;
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
        nom: string;
        entreprise: string | null;
        createdAt: Date;
        updatedAt: Date;
        prenom: string;
        telephone: string;
        email: string | null;
        photo: string | null;
        role: string;
        dateEmbauche: Date | null;
        adresse: string | null;
        nationalite: string | null;
        groupeSanguin: string | null;
        numeroPieceIdentite: string | null;
        typePieceIdentite: import(".prisma/client").$Enums.TypePieceIdentite | null;
        contactUrgenceNom: string | null;
        contactUrgenceTel: string | null;
        statut: import(".prisma/client").$Enums.StatutCollaborateur;
    }>;
    create(data: any): Promise<{
        habilitations: ({
            typeHabilitation: {
                id: string;
                nom: string;
                description: string | null;
                entreprise: string | null;
                dureeValidite: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            nom: string;
            entreprise: string | null;
            createdAt: Date;
            updatedAt: Date;
            statut: import(".prisma/client").$Enums.StatutHabilitation;
            dateObtention: Date;
            dateExpiration: Date;
            document: string | null;
            typeId: string;
            collaborateurId: string;
        })[];
    } & {
        id: string;
        nom: string;
        entreprise: string | null;
        createdAt: Date;
        updatedAt: Date;
        prenom: string;
        telephone: string;
        email: string | null;
        photo: string | null;
        role: string;
        dateEmbauche: Date | null;
        adresse: string | null;
        nationalite: string | null;
        groupeSanguin: string | null;
        numeroPieceIdentite: string | null;
        typePieceIdentite: import(".prisma/client").$Enums.TypePieceIdentite | null;
        contactUrgenceNom: string | null;
        contactUrgenceTel: string | null;
        statut: import(".prisma/client").$Enums.StatutCollaborateur;
    }>;
    update(id: string, data: any): Promise<{
        habilitations: ({
            typeHabilitation: {
                id: string;
                nom: string;
                description: string | null;
                entreprise: string | null;
                dureeValidite: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            nom: string;
            entreprise: string | null;
            createdAt: Date;
            updatedAt: Date;
            statut: import(".prisma/client").$Enums.StatutHabilitation;
            dateObtention: Date;
            dateExpiration: Date;
            document: string | null;
            typeId: string;
            collaborateurId: string;
        })[];
    } & {
        id: string;
        nom: string;
        entreprise: string | null;
        createdAt: Date;
        updatedAt: Date;
        prenom: string;
        telephone: string;
        email: string | null;
        photo: string | null;
        role: string;
        dateEmbauche: Date | null;
        adresse: string | null;
        nationalite: string | null;
        groupeSanguin: string | null;
        numeroPieceIdentite: string | null;
        typePieceIdentite: import(".prisma/client").$Enums.TypePieceIdentite | null;
        contactUrgenceNom: string | null;
        contactUrgenceTel: string | null;
        statut: import(".prisma/client").$Enums.StatutCollaborateur;
    }>;
    delete(id: string): Promise<{
        id: string;
        nom: string;
        entreprise: string | null;
        createdAt: Date;
        updatedAt: Date;
        prenom: string;
        telephone: string;
        email: string | null;
        photo: string | null;
        role: string;
        dateEmbauche: Date | null;
        adresse: string | null;
        nationalite: string | null;
        groupeSanguin: string | null;
        numeroPieceIdentite: string | null;
        typePieceIdentite: import(".prisma/client").$Enums.TypePieceIdentite | null;
        contactUrgenceNom: string | null;
        contactUrgenceTel: string | null;
        statut: import(".prisma/client").$Enums.StatutCollaborateur;
    }>;
    addHabilitation(id: string, data: any): Promise<{
        typeHabilitation: {
            id: string;
            nom: string;
            description: string | null;
            entreprise: string | null;
            dureeValidite: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        nom: string;
        entreprise: string | null;
        createdAt: Date;
        updatedAt: Date;
        statut: import(".prisma/client").$Enums.StatutHabilitation;
        dateObtention: Date;
        dateExpiration: Date;
        document: string | null;
        typeId: string;
        collaborateurId: string;
    }>;
    updateHabilitation(id: string, data: any): Promise<{
        typeHabilitation: {
            id: string;
            nom: string;
            description: string | null;
            entreprise: string | null;
            dureeValidite: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        nom: string;
        entreprise: string | null;
        createdAt: Date;
        updatedAt: Date;
        statut: import(".prisma/client").$Enums.StatutHabilitation;
        dateObtention: Date;
        dateExpiration: Date;
        document: string | null;
        typeId: string;
        collaborateurId: string;
    }>;
    deleteHabilitation(id: string): Promise<{
        id: string;
        nom: string;
        entreprise: string | null;
        createdAt: Date;
        updatedAt: Date;
        statut: import(".prisma/client").$Enums.StatutHabilitation;
        dateObtention: Date;
        dateExpiration: Date;
        document: string | null;
        typeId: string;
        collaborateurId: string;
    }>;
}
