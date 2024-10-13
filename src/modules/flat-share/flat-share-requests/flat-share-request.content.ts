import { User } from "@/modules/users/users.interface";
import { useDefaultEmailLayout } from "@/utils/email";
import { FlatShareRequest } from "./flat-share-request.model";
import { CLIENT_URL } from "@/config";


export const seekerToHostContent = ({ requestData, seekerData }: { requestData: FlatShareRequest, seekerData: User }) => {
  const content = `
    <p style="font-size: 16px; line-height: 1.5; color: #98B0AE;">
      Hi, <strong>${seekerData.first_name}</strong> is looking for a space to share in ${requestData.location.name}. Here are the details of their requirements:
    </p>
    <ul style="font-size: 16px; color: #98B0AE;">
      <li>Location: ${requestData.location.name}</li>
      <li>Budget: ₦${requestData.rent.toLocaleString()}</li>
      <li><a style="color:#0aa365;" href="${CLIENT_URL}/request/seeker/${requestData._id}">Read more</a></li>
    </ul>

    <p style="font-size: 16px; line-height: 1.5; color: #98B0AE;">
      If you have a flat available and are interested in sharing with ${seekerData.first_name}, please respond to this email or view more details on our platform.
    </p>
    <p style="font-size: 16px; line-height: 1.5; color: #98B0AE;">
      Best regards,<br>
      The Sheruta NG Team
    </p>
  `;
  return useDefaultEmailLayout(content, `New Flatmate Request in ${requestData.location.name}`);
};

export const hostToSeekerContent = ({ hostData, requestData }: { requestData: FlatShareRequest, hostData: User }) => {
  const flatImage = requestData.image_urls.length > 0 ? requestData.image_urls[0] : '';
  const content = `
    <p style="font-size: 16px; line-height: 1.5; color: #98B0AE;">
      Hi ${hostData.first_name}, we have a new flat available for sharing in ${requestData.location.name} that matches your preferences.
    </p>
    <div style="text-align: center; margin-bottom: 20px;">
      <div style="border-radius: 8px; width: 100%; height: 250px; background-image: url(${flatImage}); background-size: cover;" />
    </div>
    <ul style="font-size: 16px; color: #98B0AE;">
      <li>Location: ${requestData.location.name}</li>
      <li>Bedrooms: ${requestData.bedrooms}</li>
      <li>Rent: ₦${requestData.rent.toLocaleString()}</li>
      <li>Description: ${requestData.description}</li>
       <li><a style="color:#0aa365;" href="${CLIENT_URL}/request/host/${requestData._id}">Read more</a></li>
    </ul>

    <p style="font-size: 16px; line-height: 1.5; color: #98B0AE;">
      If you're interested in this flat, please contact the host or view more details on our platform.
    </p>
    <p style="font-size: 16px; line-height: 1.5; color: #98B0AE;">
      Best regards,<br>
      The Sheruta NG Team
    </p>
  `;
  return useDefaultEmailLayout(content, `New Flat Available in ${requestData.location.name}`);
};

