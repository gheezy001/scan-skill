export declare class MailService {
    private transporter;
    constructor();
    sendExpirationAlert(to: string, ouvrier: string, habilitation: string, dateExpiration: Date, daysLeft: number): Promise<void>;
}
