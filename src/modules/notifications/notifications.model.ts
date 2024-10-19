import { NotificationTypes } from "@/config";
import { Document, model, Schema } from "mongoose";
import { User } from "../users/users.interface";
import { FlatShareProfile } from "../flat-share/flat-share-profile/flat-share-profile.model";
import { UserSettings } from "../user-settings/user-settings.model";
import { UserInfo } from "../user-info/user-info.model";

export interface Notifications {
  _id: string;

  trigger_type: NotificationTypes;
  seen: boolean;
  message: string;

  sender: User;

  receiver: User;
  receiver_flat_share_profile: FlatShareProfile;
  receiver_user_settings: UserSettings;
  receiver_user_info: UserInfo;
}

const notificationsSchema: Schema = new Schema<Notifications>(
  {
    trigger_type: {
      type: String,
      enum: NotificationTypes,
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    receiver_flat_share_profile: {
      type: Schema.Types.ObjectId,
      ref: "FlatShareProfiles",
      required: true,
      select: false,
    },
    receiver_user_settings: {
      type: Schema.Types.ObjectId,
      ref: "UserSettings",
      required: true,
      select: false,
    },
    seen: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const notificationsModel = model<Notifications & Document>(
  "Notifications",
  notificationsSchema,
);

export default notificationsModel;
