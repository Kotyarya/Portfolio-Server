import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { TransportOptions } from 'nodemailer';

@Injectable()
export class ContactService {
  private transporter: nodemailer.Transporter<any>;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.mail.me.com',
      port: 587,
      secure: false,
      auth: {
        user: this.configService.get<string>('MAILER_USER'),
        pass: this.configService.get<string>('MAILER_PASS'),
      },
    } as TransportOptions);
  }

  async sendToOwner(
    name: string,
    email: string,
    message: string,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `Portfolio Website <${this.configService.get('MAILER_USER')}>`,
        to: this.configService.get<string>('MAILER_USER'),
        subject: `Новое сообщение от ${name}`,
        text: `Имя: ${name}\nПочта: ${email}\n\nСообщение:\n${message}`,
      });
    } catch {
      throw new ServiceUnavailableException(
        'Contact message could not be delivered',
      );
    }
  }

  async sendConfirmationToUser(
    userEmail: string,
    userName: string,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: `Portfolio Website <${this.configService.get('MAILER_USER')}>`,
      to: userEmail,
      subject: 'Ваше сообщение получено! ✅',
      text: `Привет, ${userName}!\n\nСпасибо за сообщение. Я обязательно свяжусь с вами в ближайшее время.`,
    });
  }
}
