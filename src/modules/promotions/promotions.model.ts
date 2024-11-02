import { Document, model, Schema } from "mongoose";
import { User } from "@/modules/users/users.interface";
import { UserInfo } from "@/modules/user-info/user-info.model";
import { FlatShareProfile } from "../flat-share/flat-share-profile/flat-share-profile.model";
import { FlatShareRequest } from "../flat-share/flat-share-requests/flat-share-request.model";
import { Locations } from "../flat-share/options/locations/locations.model";
import { States } from "../flat-share/options/state/state.model";
import { UserSettings } from "../user-settings/user-settings.model";

export enum PromotionStatus {
  ACTIVE = "active",
  EXPIRED = "expired",
}

export enum PromotionType {
  PROFILE = "profile",
  REQUEST = "request",
}

export interface Promotion extends Document {
  user: Schema.Types.ObjectId | User;
  flat_share_profile: Schema.Types.ObjectId | FlatShareProfile;
  user_info: Schema.Types.ObjectId | UserInfo;
  request: Schema.Types.ObjectId | FlatShareRequest;
  endDate: Date;
  location?: Schema.Types.ObjectId | Locations;
  state?: Schema.Types.ObjectId | States;
  user_settings?: Schema.Types.ObjectId | UserSettings;
  service?: Schema.Types.ObjectId | UserSettings;
  status: PromotionStatus;
  type: PromotionType;
  pitch: string;
}

const promotionSchema: Schema = new Schema<Promotion>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    flat_share_profile: {
      type: Schema.Types.ObjectId,
      ref: "FlatShareProfiles",
      required: true,
    },
    user_settings: {
      type: Schema.Types.ObjectId,
      ref: "UserSettings",
      required: true,
    },
    user_info: {
      type: Schema.Types.ObjectId,
      ref: "UserInfos",
      required: true,
    },
    request: {
      type: Schema.Types.ObjectId,
      ref: "FlatShareRequests",
    },
    endDate: {
      type: Date,
      required: true,
    },
    location: {
      type: Schema.Types.ObjectId,
      ref: "Locations",
      required: true,
    },
    state: {
      type: Schema.Types.ObjectId,
      ref: "States",
      required: true,
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: "Services",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(PromotionStatus),
      default: PromotionStatus.ACTIVE,
    },
    type: {
      type: String,
      enum: Object.values(PromotionType),
      required: true,
    },
    pitch: {
      type: String,
      default: null
    },
  },
  {
    timestamps: true,
  },
);

const promotionModel = model<Promotion>("Promotions", promotionSchema);

export default promotionModel;
