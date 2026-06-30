"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
let MailService = class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT) || 587,
            secure: false,
            auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASSWORD },
        });
    }
    async sendExpirationAlert(to, ouvrier, habilitation, dateExpiration, daysLeft) {
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
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MailService);
//# sourceMappingURL=mail.service.js.map