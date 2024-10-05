import { model, Schema, Document } from 'mongoose';
import { User } from '@/modules/users/users.interface';

export interface UserSecrets extends Document {
  activation_token: string;
  reset_token: string;
  password: string;
  user: User['_id'];
}

const userSecretsSchema: Schema = new Schema(
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
    },
  },
  {
    timestamps: true,
  },
);

const userSecretsModel = model<UserSecrets>('UserSecrets', userSecretsSchema);

export default userSecretsModel;
