import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as Papa from 'papaparse';

@Injectable()
export class ImportService {
  constructor(private prisma: PrismaService) {}

  private parseDate(dateStr: string): Date | undefined {
    if (!dateStr) return undefined;
    const raw = String(dateStr).trim();
    if (!raw) return undefined;
    const m = raw.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
    if (m) {
      const year = m[3].length === 2 ? 2000 + parseInt(m[3]) : parseInt(m[3]);
      const d = new Date(year, parseInt(m[2]) - 1, parseInt(m[1]));
      return isNaN(d.getTime()) ? undefined : d;
    }
    const d = new Date(raw);
    return isNaN(d.getTime()) ? undefined : d;
  }

  async importOuvriers(fileContent: string) {
    const parsed = Papa.parse(fileContent, { header: true, skipEmptyLines: true });
    if (parsed.errors.length > 0) throw new BadRequestException('Erreur de parsing CSV');

    const results = { success: 0, errors: [] as string[], skippedExisting: 0 };
    for (const row of parsed.data as any[]) {
      try {
        const email = row.email || row.Email;
        const telephone = row.telephone || row.Telephone || row.tel || '';
        if (email) {
          const exists = await this.prisma.collaborateur.findFirst({ where: { email } });
          if (exists) { results.skippedExisting++; continue; }
        }
        await this.prisma.collaborateur.create({
          data: {
            nom: row.nom || row.Nom,
            prenom: row.prenom || row.Prenom,
            telephone,
            email,
            role: row.role || row.Role || '',
            entreprise: row.entreprise || row.Entreprise,
            dateEmbauche: this.parseDate(row.dateEmbauche || row.date_embauche),
            statut: ['ACTIF', 'INACTIF', 'SUSPENDU'].includes(row.statut?.toUpperCase()) ? row.statut.toUpperCase() : 'ACTIF',
          },
        });
        results.success++;
      } catch (e) {
        results.errors.push(`${row.nom} ${row.prenom}: ${e.message}`);
      }
    }
    return results;
  }

  async importHabilitations(fileContent: string) {
    const parsed = Papa.parse(fileContent, { header: true, skipEmptyLines: true });
    const results = { success: 0, errors: [] as string[], skippedNotFound: 0 };

    for (const row of parsed.data as any[]) {
      try {
        const email = row.email || row.Email;
        const collaborateur = await this.prisma.collaborateur.findFirst({ where: { email } });
        if (!collaborateur) { results.skippedNotFound++; continue; }

        const typeNom = row.type_habilitation || row.type;
        let type = await this.prisma.typeHabilitation.findFirst({ where: { nom: { equals: typeNom, mode: 'insensitive' } } });
        if (!type) {
          type = await this.prisma.typeHabilitation.create({ data: { nom: typeNom } });
        }

        const dateObtention = this.parseDate(row.date_obtention || row.dateObtention);
        const dateExpiration = this.parseDate(row.date_expiration || row.dateExpiration);
        if (!dateObtention || !dateExpiration) { results.errors.push(`Dates invalides pour ${email}`); continue; }

        await this.prisma.habilitation.create({
          data: {
            nom: type.nom,
            typeId: type.id,
            collaborateurId: collaborateur.id,
            dateObtention,
            dateExpiration,
            entreprise: row.entreprise,
            statut: dateExpiration > new Date() ? 'VALIDE' : 'EXPIRE',
          },
        });
        results.success++;
      } catch (e) {
        results.errors.push(e.message);
      }
    }
    return results;
  }

  async importEngins(fileContent: string) {
    const parsed = Papa.parse(fileContent, { header: true, skipEmptyLines: true });
    const results = { success: 0, errors: [] as string[], skippedExisting: 0 };

    for (const row of parsed.data as any[]) {
      try {
        const immat = row.immatriculation || row.Immatriculation;
        const exists = await this.prisma.engin.findFirst({ where: { immatriculation: immat } });
        if (exists) { results.skippedExisting++; continue; }

        const dateExpirationAssurance = this.parseDate(row.date_expiration_assurance);
        const prochainVisiteTechnique = this.parseDate(row.prochain_controle || row.prochaine_visite_technique);
        const dateExpirationVGP = this.parseDate(row.date_expiration_vgp);
        const now = new Date();
        const thirtyDays = new Date(now.getTime() + 30 * 86400000);

        const isExpired = (d?: Date) => d && d < now;
        const isSoon = (d?: Date) => d && d >= now && d < thirtyDays;

        const statut = isExpired(dateExpirationAssurance) || isExpired(prochainVisiteTechnique) || isExpired(dateExpirationVGP)
          ? 'NON_CONFORME'
          : isSoon(dateExpirationAssurance) || isSoon(prochainVisiteTechnique) || isSoon(dateExpirationVGP)
          ? 'EXPIRE_BIENTOT'
          : 'CONFORME';

        await this.prisma.engin.create({
          data: {
            type: row.type || row.Type,
            marque: row.marque,
            modele: row.modele,
            immatriculation: immat,
            lieuAffectation: row.lieu_affectation || row.poste,
            dateControle: this.parseDate(row.date_controle),
            prochainVisiteTechnique,
            dateExpirationVGP,
            dateExpirationAssurance,
            vgpFournit: row.vgp_fournit || row.vpg_fournit,
            statut: statut as any,
          },
        });
        results.success++;
      } catch (e) {
        results.errors.push(e.message);
      }
    }
    return results;
  }
}