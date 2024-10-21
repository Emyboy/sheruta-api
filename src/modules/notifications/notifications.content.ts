import { CLIENT_URL } from "@/config";
import { useDefaultEmailLayout } from "@/utils/email";
import { User } from "../users/users.interface";

export const platformActivityContent = ({ user }: { user: User }) => {
  const content = `
    <p style="font-size: 16px; line-height: 1.5; color: #98B0AE;">
      Hi, ${user.first_name}!
    </p>

    <p style="font-size: 16px; line-height: 1.5; color: #98B0AE;">
      We've noticed some activity on your Sheruta NG account! This could be anything from new messages, profile matches, call requests, or updates to potential flatmates or rental opportunities.
    </p>

    <p style="font-size: 16px; line-height: 1.5; color: #98B0AE;">
      We recommend you log in to your account to check out these updates and stay on top of things. You might find new conversations or opportunities waiting for you.
    </p>

    <div style="text-align: center;">
      <a href="${CLIENT_URL}/notification"
         style="display: inline-block; padding: 15px 25px; margin-top: 20px; font-size: 16px; background-color: #0AA365; color: #ffffff; text-decoration: none; border-radius: 5px;">
        Log in to Your Account
      </a>
    </div>

    <p style="font-size: 16px; line-height: 1.5; color: #98B0AE;">
      If you did not initiate any activity, please make sure your account is secure by updating your password and reviewing your account settings.
    </p>

    <p style="font-size: 16px; line-height: 1.5; color: #98B0AE;">
      Best regards,<br>
      The Sheruta NG Team
    </p>
  `;

  return useDefaultEmailLayout(content, `Account Activity Notification, ${user.first_name}`);
};
