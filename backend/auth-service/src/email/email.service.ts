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

}
async sendPasswordResetEmail(
  email: string,
  resetUrl: string,
) {
  await this.transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Reset your password',
    html: `
      <h2>Reset your password</h2>

      <p>
        We received a request to reset your password.
      </p>

      <a href="${resetUrl}">
        Reset Password
      </a>

      <p>
        This link expires in 15 minutes.
      </p>

      <p>
        If you did not request this, you can ignore this email.
      </p>
    `,
  });
}
}