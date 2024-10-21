import nodemailer from "nodemailer";
import { SMTP_PASS, SMTP_USER } from "@config";
import { logger } from "@utils/logger";

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export const sendEmail = async (
  { to, html, subject }: { to: string; subject: string; html: string },
) => {
  if (to) {
    try {
      logger.info(`\n\n Sending email to ${to}`);
      const mailOptions = {
        from: `"Emeka from Sheruta" <${SMTP_USER}>`,
        to: to.toLocaleLowerCase().trim(),
        subject: subject + " | Sheruta Flat Share",
        html,
      };

      const info = await transporter.sendMail(mailOptions);
      logger.info("Email sent: %s", info.messageId);
      return info;
    } catch (error) {
      logger.error("Error sending email:", error);
      console.log(error);
      throw error;
    }
  }
};

export const useDefaultEmailLayout = (children: string, heading = "Hello!") => {
  return `
    <div style="background-color: #111717; color: #98B0AE; font-family: Arial, sans-serif; padding: 5rem 20px 1rem 20px; max-width: 600px; margin: 0 auto; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://firebasestorage.googleapis.com/v0/b/sheruta-prod.appspot.com/o/DONT%20DELETE%2FLOGOS%2Flogo_text_white.png?alt=media&token=46ac86e6-a265-4f34-adca-47e7af962c8d" alt="Sheruta Logo" style="max-width: 150px; margin-bottom: 20px;" />
        <div style="text-align: left">
          <h1 style="color: #0AA365; margin-top: 60px; font-size: 17px;">${heading}</h1>
        </div>
      </div>

      <div style="padding-bottom: 5rem">
        ${children}
      </div>

      <div style="margin-top: 40px; text-align: center;">
        <p style="font-size: 14px; color: #98B0AE;">
          If you did not expect this email, please disregard it.
        </p>
        <p style="font-size: 12px; color: #98B0AE;">
          &copy; ${new Date().getFullYear()} Sheruta. All Rights Reserved.
        </p>
      </div>
    </div>
  `;
};
