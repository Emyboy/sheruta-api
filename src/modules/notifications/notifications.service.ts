import { NotificationTypes } from "@/config";
import notificationsModel from "./notifications.model";
import { subDays, subHours, subMinutes } from "date-fns";
import flatShareProfileModel from "../flat-share/flat-share-profile/flat-share-profile.model";
import userSettingModel from "../user-settings/user-settings.model";
import { HttpException } from "@/exceptions/HttpException";
import { sendEmail } from "@/utils/email";
import userModel from "../users/users.model";
import { platformActivityContent } from "./notifications.content";

export default class NotificationService {
  private notifications = notificationsModel;
  private flatShareProfile = flatShareProfileModel;
  private userSettings = userSettingModel;
  private users = userModel;

  public create = async (
    {
      receiver_id,
      sender_id,
      type,
      delayBy,
    }: {
      sender_id: string;
      receiver_id: string;
      type: NotificationTypes;
      delayBy?: {
        count: number;
        unit: "minutes" | "hours" | "days";
      };
    },
  ) => {
    try {
      const now = new Date();
      let delayTime = now;

      if (delayBy) {
        switch (delayBy.unit) {
          case "minutes":
            delayTime = subMinutes(now, delayBy.count);
            break;
          case "hours":
            delayTime = subHours(now, delayBy.count);
            break;
          case "days":
            delayTime = subDays(now, delayBy.count);
            break;
        }
      }

      const existingNotification = await this.notifications.findOne({
        sender: sender_id,
        receiver: receiver_id,
        trigger_type: type,
        createdAt: { $gte: delayTime },
      });

      if (existingNotification) {
        console.info(
          `\n\nNotification already exists for type: ${type} from sender: ${sender_id} within the delay window.\n\n`,
        );
        return;
      }

      const flatShareProfile = await this.flatShareProfile.findOne({
        user: receiver_id,
      });
      const receiverSettings = await this.userSettings.findOne({
        user: receiver_id,
      });
      const receiver = await this.users.findOne({ _id: receiver_id });

      await this.notifications.create({
        sender: sender_id,
        trigger_type: type,
        receiver: receiver_id,
        receiver_flat_share_profile: flatShareProfile?._id,
        receiver_user_settings: receiverSettings?._id,
        message: this.notificationMessage(type),
      });
      await sendEmail({
        subject: "Notification",
        to: receiver.email.trim().toLowerCase(),
        html: platformActivityContent({
          user: receiver,
        }),
      });
      console.log("\n\nNotification created successfully\n\n");
    } catch (error) {
      console.log("\n\nNOTIFICATION CREATION ERROR:::", error);
      throw new HttpException(500, "Notification creation failed");
    }
  };

  private notificationMessage = (type: NotificationTypes): string => {
    switch (type) {
      case NotificationTypes.DEFAULT:
        return "You have a new notification";
      case NotificationTypes.PROFILE_VIEW:
        return " viewed your profile";
      case NotificationTypes.REQUEST_VIEW:
        return " viewed your request";
      case NotificationTypes.CALL:
        return " tried calling you";
      default:
        return " You have a new notification";
    }
  };

  public markAllAsSeen = async (receiver_id: string) => {
    try {
      await this.notifications.updateMany({ receiver: receiver_id }, {
        seen: true,
      });
    } catch (error) {
      console.log("\n\nMARK ALL AS SEEN ERROR:::", error);
      throw new HttpException(500, "Mark all as seen failed");
    }
  };

  public getAllUserNotifications = async (
    receiver_id: string,
    page: number = 1,
    limit: number = 10
  ) => {
    try {
      const skip = (page - 1) * limit;
      const notifications = await this.notifications
        .find({ receiver: receiver_id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalNotifications = await this.notifications.countDocuments({
        receiver: receiver_id,
      });

      return {
        notifications,
        total: totalNotifications,
        page,
        pages: Math.ceil(totalNotifications / limit),
      };
    } catch (error) {
      console.log("\n\nGET ALL USER NOTIFICATIONS ERROR:::", error);
      throw new HttpException(500, "Get all user notifications failed");
    }
  };
}
