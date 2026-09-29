import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendVerificationEmail(
    email: string,
    token: string,
  ) {
    const verificationUrl =
      `http://localhost:3000/auth/verify-email?token=${token}`;

   const info= await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Verify your email',
      html: `
        <h2>Verify your email</h2>

        <p>
          Please click the button below to verify your email address.
        </p>

        <a href="${verificationUrl}">
          Verify Email
        </a>

        <p>
          This link expires in 15 minutes.
        </p>
      `,
    });

  console.log('2. Email sent');
  console.log('3. Message ID:', info.messageId);
  console.log('4. Accepted:', info.accepted);
  console.log('5. Rejected:', info.rejected);
  }
}