import { CLIENT_URL } from '@config';
import { User } from '@/modules/users/users.interface';

export const useDefaultEmailLayout = (children: string, heading = 'Hello!') => {
  return `
    <div style="background-color: #111717; color: #98B0AE; font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border-radius: 8px;">
      <!-- Header with Logo -->
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${CLIENT_URL}/assets/logo.png" alt="Sheruta Logo" style="max-width: 150px; margin-bottom: 20px;" />
        <h1 style="color: #0AA365;">${heading}</h1>
      </div>

      <div>
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


export const activateEmailContent = ({ activation_token, user }: { activation_token: string; user: User }) => {
  const content = `
    <p style="font-size: 16px; line-height: 1.5; color: #98B0AE; text-align: center;">
      Thank you for signing up with us! Please click the button below to activate your email and complete your registration.
    </p>
    <div style="text-align: center;">
      <a href="${CLIENT_URL}/auth/activate/${activation_token}"
         style="display: inline-block; padding: 15px 25px; margin-top: 20px; font-size: 16px; background-color: #0AA365; color: #ffffff; text-decoration: none; border-radius: 5px;">
        Activate Your Account
      </a>
    </div>
  `;

  return useDefaultEmailLayout(content, `Welcome, ${user.first_name}!`);
};
