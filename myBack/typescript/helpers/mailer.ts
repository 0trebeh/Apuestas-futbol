import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

import { MailerObject } from './types/mailerType';

export class Mailer extends MailerObject {

    transporter: Mail;

    constructor() {
        super();
        this.transporter = nodemailer.createTransport({
            host: process.env.HOSTMAIL,
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            }
        });
    }

    async sendMail(username: string, email: string) {
        try {
            await this.transporter.sendMail({
                from: '"FAP" <' + process.env.EMAIL + '>',
                to: email,
                subject: "Hola " + username + "!. bienvenido a FAP! ✔",
                text: "Mira la información de tus jugadores, equipos y torneos favoritos, encontraras estadísticas relevantes con los ultimos algoritmos especializados que te darán probabilidades sumamente precisas." +
                    "\n\nRegistrate como apostador en tu perfil y sumérgete en este mundo de fútbol apuestas! $" +
                    "\n\nCon FAP, tus sueños están a un par de clics de distancia." +
                    "!\n\n\nDesarrolladores: Jesus, Ricardo y Heberto"
            });
        } catch (err) {
            console.error(err);
        }
    }
}