import nodemailer from 'nodemailer';
import { SMTP_PASS, SMTP_USER } from '@config';
import { logger } from '@utils/logger';

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export const sendEmail = async ({ to, html, subject }: { to: string; subject: string; html: string }) => {
  try {
    const mailOptions = {
      from: `"Emeka from Sheruta" <${SMTP_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    logger.error('Error sending email:', error);
    throw error;
  }
};
