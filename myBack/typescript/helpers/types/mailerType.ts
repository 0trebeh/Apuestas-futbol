import Mail from "nodemailer/lib/mailer";

export abstract class MailerObject {
    public abstract transporter: Mail;
    public abstract sendMail(username: string, email: string): void;
}