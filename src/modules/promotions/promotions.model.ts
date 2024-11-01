import { Document, model, Schema } from "mongoose";
import { User } from "@/modules/users/users.interface";
import { UserInfo } from "@/modules/user-info/user-info.model";
import { FlatShareProfile } from "../flat-share/flat-share-profile/flat-share-profile.model";
import { FlatShareRequest } from "../flat-share/flat-share-requests/flat-share-request.model";
import { Locations } from "../flat-share/options/locations/locations.model";
import { States } from "../flat-share/options/state/state.model";

export interface Promotion extends Document {
  user: Schema.Types.ObjectId | User;
  flatShareProfile: Schema.Types.ObjectId | FlatShareProfile;
  userInfo: Schema.Types.ObjectId | UserInfo;
  request: Schema.Types.ObjectId | FlatShareRequest;
  endDate: Date;
  location?: Schema.Types.ObjectId | Locations;
  state?: Schema.Types.ObjectId | States;
}

const promotionSchema: Schema = new Schema<Promotion>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    flatShareProfile: {
      type: Schema.Types.ObjectId,
      ref: "FlatShareProfiles",
      required: true,
    },
    userInfo: {
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
    },
    state: {
      type: Schema.Types.ObjectId,
      ref: "States",
    },
  },
  {
    timestamps: true,
  },
);

const promotionModel = model<Promotion>("Promotions", promotionSchema);

export default promotionModel;
