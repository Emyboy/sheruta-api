import { useDefaultEmailLayout } from "@/utils/email";
import { User } from "../users/users.interface";

export const spaceReservedEmailContent = (
  { host, seeker }: { host: User; seeker: User },
) => {
  const content = `
    <p style="font-size: 16px; line-height: 1.5; color: #98B0AE;">
      Hi there! We wanted to let you know that your space has been reserved by a user.
    </p>

    <h2 style="color: #0AA365; font-size: 20px;">Reservation Details</h2>

    <p style="font-size: 16px; line-height: 1.5; color: #98B0AE;">
      ${seeker.first_name} ${seeker.last_name} has expressed interest in reserving your posted space. Please review their profile and reach out to discuss further details and arrange the next steps.
    </p>

    <p style="font-size: 16px; line-height: 1.5; color: #98B0AE;">
      We recommend reaching out to ${seeker.first_name} soon to confirm the reservation and finalize any necessary details.
    </p>

    <p style="font-size: 16px; line-height: 1.5; color: #98B0AE;">
      If you have any questions or need further assistance, please contact our support team.
    </p>

    <p style="font-size: 16px; line-height: 1.5; color: #98B0AE;">
      Best regards,<br>
      The Sheruta NG Team
    </p>
  `;

  return useDefaultEmailLayout(
    content,
    `Your Space Has Been Reserved by ${seeker.first_name}`,
  );
};

