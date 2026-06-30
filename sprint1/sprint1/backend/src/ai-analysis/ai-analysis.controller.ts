import { Controller, Post, Body } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

@Controller('ai-analysis')
export class AiAnalysisController {

  @Post()
  async analyze(@Body() body: { type: string; entity: any }) {
    const { type, entity } = body;
    const now = new Date();
    const daysLeft = (d: string) => Math.ceil((new Date(d).getTime() - now.getTime()) / 86400000);

    let prompt = '';

    if (type === 'collaborateur' || type === 'ouvrier') {
      const habs = entity.habilitations ?? [];
      const expirees = habs.filter((h: any) => h.statut === 'EXPIRE').map((h: any) => h.nom);
      const bientot = habs
        .filter((h: any) => h.statut === 'VALIDE' && daysLeft(h.dateExpiration) <= 30 && daysLeft(h.dateExpiration) > 0)
        .map((h: any) => `${h.nom} (J-${daysLeft(h.dateExpiration)})`);
      const valides = habs.filter((h: any) => h.statut === 'VALIDE').length;

      prompt = `Tu es un assistant HSE expert sur chantier electrique. Analyse la conformite de ce collaborateur.
Reponds en francais, de maniere directe et claire, en 2-4 phrases maximum.
Commence TOUJOURS par "Conforme", "Non conforme" ou "Attention requise".

Collaborateur : ${entity.prenom} ${entity.nom}
Role : ${entity.role || 'non renseigne'}
Entreprise : ${entity.entreprise || 'non renseignee'}
Habilitations expirees (${expirees.length}) : ${expirees.join(', ') || 'aucune'}
Expirant dans 30 jours : ${bientot.join(', ') || 'aucune'}
Habilitations valides : ${valides}/${habs.length}

Donne un verdict immediatement actionnable sur le terrain.`;

    } else if (type === 'engin') {
      const jVGP = entity.dateExpirationVGP ? daysLeft(entity.dateExpirationVGP) : null;
      const jVisite = entity.prochainVisiteTechnique ? daysLeft(entity.prochainVisiteTechnique) : null;
      const jAss = entity.dateExpirationAssurance ? daysLeft(entity.dateExpirationAssurance) : null;

      prompt = `Tu es un assistant HSE expert. Analyse la conformite de cet engin sur chantier.
Reponds en francais, en 2-4 phrases. Commence par "Conforme", "Non conforme" ou "Attention requise".

Engin : ${entity.type} ${entity.marque ?? ''} ${entity.modele ?? ''} — ${entity.immatriculation}
Lieu d'affectation : ${entity.lieuAffectation || 'non renseigne'}
Statut : ${entity.statut}
Jours avant expiration VGP : ${jVGP !== null ? jVGP : 'non renseigne'}
Jours avant prochaine visite technique : ${jVisite !== null ? jVisite : 'non renseigne'}
Jours avant expiration assurance : ${jAss !== null ? jAss : 'non renseigne'}

Verdict immediatement actionnable.`;

    } else if (type === 'appareil') {
      prompt = `Tu es un assistant HSE. Analyse la disponibilite de cet appareillage.
Reponds en francais, en 1-2 phrases. Commence par "Operationnel", "Indisponible" ou "En maintenance".

Appareillage : ${entity.nom} (ref. ${entity.reference})
Type : ${entity.type}
Statut : ${entity.statut}
Localisation : ${entity.localisation ?? 'non renseignee'}`;
    }

    if (!prompt) return { analyse: null };

    try {
      const message = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 250,
        messages: [{ role: 'user', content: prompt }],
      });
      return { analyse: (message.content[0] as any).text };
    } catch (err) {
      console.error('[AI Analysis Error]', err);
      return { analyse: null };
    }
  }
}
