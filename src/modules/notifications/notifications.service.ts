import { NotificationTypes } from "@/config";
import notificationsModel from "./notifications.model";
import { subDays } from "date-fns";
import flatShareProfileModel from "../flat-share/flat-share-profile/flat-share-profile.model";
import userSettingModel from "../user-settings/user-settings.model";
import { HttpException } from "@/exceptions/HttpException";

export default class NotificationService {
  private notifications = notificationsModel;
  private flatShareProfile = flatShareProfileModel;
  private userSettings = userSettingModel;

  public create = async ({ receiver_id, sender_id, type }: { sender_id: string; receiver_id: string; type: NotificationTypes; }) => {
    try {
      const threeDaysAgo = subDays(new Date(), 3);

      const existingNotification = await this.notifications.findOne({
        sender: sender_id,
        receiver: receiver_id,
        trigger_type: type,
        createdAt: { $gte: threeDaysAgo },
      });

      if (existingNotification) {
        console.info(`\n\nNotification already exists for type: ${type} from sender: ${sender_id} within the last 3 days.\n\n`);
        return;
      }

      const flatShareProfile = await this.flatShareProfile.findOne({ user: receiver_id });
      const receiverSettings = await this.userSettings.findOne({ user: receiver_id });

      await this.notifications.create({
        sender: sender_id,
        trigger_type: type,

        receiver: receiver_id,
        receiver_flat_share_profile: flatShareProfile?._id,
        receiver_user_settings: receiverSettings?._id,
        message: this.notificationMessage(type)
      });
    } catch (error) {
      console.log('\n\nNOTIFICATION CREATION ERROR:::', error);
      throw new HttpException(500, 'Notification creation failed');
    }
  }

  private notificationMessage = (type: NotificationTypes): string => {
    switch (type) {
      case NotificationTypes.DEFAULT:
        return 'You have a new notification';
      case NotificationTypes.PROFILE_VIEW:
        return ' viewed your profile';
      case NotificationTypes.REQUEST_VIEW:
        return ' viewed your request';
      case NotificationTypes.CALL:
        return ' tried calling you';
      default:
        return ' You have a new notification';
    }
  }
}
