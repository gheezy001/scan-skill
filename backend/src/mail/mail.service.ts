import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT) || 587,
      secure: false,
      auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASSWORD },
    });
  }

  async sendExpirationAlert(to: string, ouvrier: string, habilitation: string, dateExpiration: Date, daysLeft: number) {
    await this.transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME || 'Scan Skill'}" <${process.env.MAIL_FROM}>`,
      to,
      subject: `⚠️ Habilitation expirant dans ${daysLeft} jours — ${ouvrier}`,
      html: `
        <h2>Alerte conformité HSE</h2>
        <p>L'habilitation <strong>${habilitation}</strong> de <strong>${ouvrier}</strong> expire dans <strong>${daysLeft} jours</strong>.</p>
        <p>Date d'expiration : <strong>${dateExpiration.toLocaleDateString('fr-FR')}</strong></p>
        <p>Merci de procéder au renouvellement avant cette date.</p>
        <hr>
        <p style="color:#888;font-size:12px">Scan Skill — Système de gestion de conformité HSE</p>
      `,
    });
  }
}
