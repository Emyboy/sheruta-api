import { model, Schema, Document } from 'mongoose';
import { User } from '@/modules/users/users.interface';

const userSchema: Schema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },
    middle_name: {
      type: String,
      default: null,
      minlength: 2,
      maxlength: 50,
    },
    last_name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    last_seen: {
      type: Date,
      default: Date.now,
    },
    avatar_url: {
      type: String,
      default: null,
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    account_status: {
      type: String,
      enum: ['active', 'suspended', 'deactivated'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  },
);

const userModel = model<User & Document>('Users', userSchema);

export default userModel;
