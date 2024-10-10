import { model, Schema, Document } from 'mongoose';
import { User } from '@/modules/users/users.interface';

export interface UserSecrets extends Document {
  activation_token: string;
  reset_token: string;
  password: string;
  user: User;
  otp: string;
}

const userSecretsSchema: Schema = new Schema<UserSecrets>(
  {
    activation_token: {
      type: String,
      required: false,
      default: null,
    },
    reset_token: {
      type: String,
      required: false,
      default: null,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
      select: false
    },
    otp: {
      type: String,
      default: null,
    }
  },
  {
    timestamps: true,
  },
);

const userSecretsModel = model<UserSecrets>('UserSecrets', userSecretsSchema);

export default userSecretsModel;
