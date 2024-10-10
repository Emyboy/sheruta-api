import { model, Schema, Document } from 'mongoose';
import { User } from '../users/users.interface';
import { UserSettings } from '../user-settings/user-settings.model';

export interface UserInfo extends Document {
  date_of_birth: Date;
  done_kyc: boolean;
  gender: "male" | "female";
  is_verified: boolean;
  phone_number_verified: boolean;
  primary_phone_number: string;
  whatsapp_phone_number: string;
  user: User;
  user_setting: UserSettings;
}

const userInfoSchema: Schema = new Schema<UserInfo>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    user_setting: {
      type: Schema.Types.ObjectId,
      ref: 'UserSettings',
      required: true,
    },
    date_of_birth: {
      type: Date,
    },
    done_kyc: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    phone_number_verified: {
      type: Boolean,
      default: false,
    },
    primary_phone_number: {
      type: String,
      required: true,
      unique: true,
    },
    whatsapp_phone_number: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const userInfoModel = model<UserInfo>('UserInfos', userInfoSchema);

export default userInfoModel;
