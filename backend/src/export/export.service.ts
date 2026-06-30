import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExportService {
  constructor(private prisma: PrismaService) {}

  private toCSV(headers: string[], rows: string[][]): string {
    return [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
  }

  async exportOuvriers(): Promise<string> {
    const collaborateurs = await this.prisma.collaborateur.findMany({
      include: { habilitations: { include: { typeHabilitation: true } } },
    });
    const headers = ['nom', 'prenom', 'telephone', 'email', 'role', 'entreprise', 'statut', 'nb_habilitations', 'habilitations_expirees'];
    const rows = collaborateurs.map((c) => [
      c.nom, c.prenom, c.telephone, c.email ?? '', c.role, c.entreprise ?? '', c.statut,
      String(c.habilitations.length),
      String(c.habilitations.filter((h) => h.statut === 'EXPIRE').length),
    ]);
    return this.toCSV(headers, rows);
  }

  async exportHabilitations(): Promise<string> {
    const habs = await this.prisma.habilitation.findMany({
      include: { collaborateur: true, typeHabilitation: true },
      orderBy: { dateExpiration: 'asc' },
    });
    const headers = ['collaborateur_nom', 'collaborateur_prenom', 'telephone', 'email', 'habilitation', 'type', 'date_obtention', 'date_expiration', 'statut', 'entreprise'];
    const rows = habs.map((h) => [
      h.collaborateur.nom, h.collaborateur.prenom,
      h.collaborateur.telephone, h.collaborateur.email ?? '',
      h.nom, h.typeHabilitation.nom,
      new Date(h.dateObtention).toLocaleDateString('fr-FR'),
      new Date(h.dateExpiration).toLocaleDateString('fr-FR'),
      h.statut, h.entreprise ?? '',
    ]);
    return this.toCSV(headers, rows);
  }

  async exportEngins(): Promise<string> {
    const engins = await this.prisma.engin.findMany();
    const headers = ['type', 'marque', 'modele', 'immatriculation', 'lieu_affectation', 'statut', 'derniere_visite_technique', 'prochaine_visite_technique', 'expiration_vgp', 'expiration_assurance'];
    const rows = engins.map((e) => [
      e.type, e.marque ?? '', e.modele ?? '', e.immatriculation,
      e.lieuAffectation ?? '', e.statut,
      e.dernierVisiteTechnique ? new Date(e.dernierVisiteTechnique).toLocaleDateString('fr-FR') : '',
      e.prochainVisiteTechnique ? new Date(e.prochainVisiteTechnique).toLocaleDateString('fr-FR') : '',
      e.dateExpirationVGP ? new Date(e.dateExpirationVGP).toLocaleDateString('fr-FR') : '',
      e.dateExpirationAssurance ? new Date(e.dateExpirationAssurance).toLocaleDateString('fr-FR') : '',
    ]);
    return this.toCSV(headers, rows);
  }
}