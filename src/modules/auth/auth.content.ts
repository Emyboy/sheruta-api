import { CLIENT_URL } from '@config';
import { User } from '@/modules/users/users.interface';
import { useDefaultEmailLayout } from '@utils/email';

export const activateEmailContent = ({ activation_token, user }: { activation_token: string; user: User }) => {
  const content = `
    <p style="font-size: 16px; line-height: 1.5; color: #98B0AE;">
      Thank you for signing up with us! Please click the button below to activate your email and complete your registration.
    </p>
    <div style="text-align: center;">
      <a href="${CLIENT_URL}/auth/activate/${activation_token}"
         style="display: inline-block; padding: 15px 25px; margin-top: 20px; font-size: 16px; background-color: #0AA365; color: #ffffff; text-decoration: none; border-radius: 5px;">
        Activate Your Account
      </a>
    </div>
  `;

  return useDefaultEmailLayout(content, `Hi, ${user.first_name}!`);
};

export const sendTokenEmailContent = ({ token, user }: { token: string; user: User }) => {
  const content = `
    <p style="font-size: 16px; line-height: 1.5; color: #98B0AE;">
      Hi, ${user.first_name}! Thank you for signing up with us. To verify your account, please use the verification code provided below.
    </p>

    <h2 style="color: #0AA365; font-size: 20px; text-align: center;">Your Verification Code</h2>
    <div style="text-align: center; font-size: 45px; color: #0AA365; font-weight: bold;">
      ${token}
    </div>

    <p style="font-size: 16px; line-height: 1.5; color: #98B0AE;">
      Please enter this code on the verification page to complete your registration. The code is valid for 15 minutes.
    </p>

    <p style="font-size: 16px; line-height: 1.5; color: #98B0AE;">
      If you did not request this, please ignore this email or contact our support team for help.
    </p>

    <p style="font-size: 16px; line-height: 1.5; color: #98B0AE;">
      Best regards,<br>
      The Sheruta NG Team
    </p>
  `;

  return useDefaultEmailLayout(content, `Verify Your Account, ${user.first_name}`);
};

export const welcomeEmailContent = ({ user }: { user: User }) => {
  const content = `
    <p style="font-size: 16px; line-height: 1.5; color: #98B0AE;">
      Welcome to Sheruta NG, ${user.first_name}! We're thrilled to have you join our community of renters and flatmates. At Sheruta NG, we make it easy and safe for you to find shared apartments and roommates in Nigeria's major cities.
    </p>

    <h2 style="color: #0AA365; font-size: 20px;">What’s next? Here are a few steps to help you get started:</h2>

    <h3 style="color: #0AA365; font-size: 18px;">1. Complete the Onboarding Process</h3>
    <p style="font-size: 16px; line-height: 1.5; color: #98B0AE;">
      To help us match you with the best flatmates or available rentals, make sure to complete the onboarding process. This includes filling out your profile with details such as your budget, preferred location, and lifestyle preferences. The more details you provide, the better our recommendations will be!
    </p>

    <h3 style="color: #0AA365; font-size: 18px;">2. Connect with the Community</h3>
    <p style="font-size: 16px; line-height: 1.5; color: #98B0AE;">
      Browse through profiles and listings on Sheruta NG to find potential roommates or flats that fit your criteria. Don't hesitate to reach out and message people in the community to start conversations and explore available options.
    </p>

    <h3 style="color: #0AA365; font-size: 18px;">3. Turn on Notifications</h3>
    <p style="font-size: 16px; line-height: 1.5; color: #98B0AE;">
      Stay updated with the latest listings and messages by enabling notifications. This way, you'll be the first to know when new flatmates or rental opportunities that match your preferences are available. You can turn on notifications in your account settings.
    </p>

    <p style="font-size: 16px; line-height: 1.5; color: #98B0AE;">
      We're excited for you to start your journey with us, and we're here to help you every step of the way. If you have any questions, feel free to reach out to our support team.
    </p>

    <p style="font-size: 16px; line-height: 1.5; color: #98B0AE;">
      Best regards,<br>
      The Sheruta NG Team
    </p>
  `;

  return useDefaultEmailLayout(content, `Welcome to Sheruta NG, ${user.first_name}!`);
};
