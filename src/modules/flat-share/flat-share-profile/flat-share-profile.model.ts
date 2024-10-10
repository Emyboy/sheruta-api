import { User } from '@/modules/users/users.interface';
import { model, Schema, Document, SchemaDefinitionProperty } from 'mongoose';

export enum EmploymentStatus {
  EMPLOYED = 'employed',
  STUDENT = 'student',
  UNEMPLOYED = 'unemployed',
  SELF_EMPLOYED = 'self_employed',
}

export enum GenderPreference {
  MALE = 'male',
  FEMALE = 'female'
}

export enum PaymentType {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  ANNUALLY = 'annually',
  DAILY = 'daily',
  BIANNUALLY = 'biannually',
}

export enum Religion {
  CHRISTIANITY = 'christianity',
  ISLAM = 'islam',
  TRADITIONAL = 'traditional',
  ATHEIST = 'atheist',
  OTHER = 'other',
}

export interface FlatShareProfile extends Document {
  bio: string;
  budget: number | null;
  done_kyc: boolean;
  employment_status: EmploymentStatus;
  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
  occupation: string | null;
  gender_preference: GenderPreference | null;
  payment_type: PaymentType[];
  age_preference: {
    min: number;
    max: number;
  } | null;
  religion: Religion | null;
  seeking: boolean | null;
  verified: boolean;
  work_industry: string | null;
  location: SchemaDefinitionProperty<string>;
  interests: SchemaDefinitionProperty<string>[];
  habits: SchemaDefinitionProperty<string>[];
  user_info: SchemaDefinitionProperty<string>;
  user: User;
  state: SchemaDefinitionProperty<string>;
  tiktok: string | null;
  twitter: string | null;
}

const flatShareProfileSchema: Schema = new Schema<FlatShareProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
      select: false
    },
    user_info: {
      type: Schema.Types.ObjectId,
      ref: 'UserInfos',
      required: true,
      select: false
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    budget: {
      type: Number,
      min: 0,
    },
    done_kyc: {
      type: Boolean,
      default: false,
    },
    employment_status: {
      type: String,
      enum: Object.values(EmploymentStatus),
    },
    facebook: {
      type: String,
    },
    instagram: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    occupation: {
      type: String,
    },
    gender_preference: {
      type: String,
      enum: Object.values(GenderPreference),
    },
    payment_type: {
      type: [{ type: String, enum: Object.values(PaymentType) }],
    },
    age_preference: {
      type: {
        min: { type: Number, min: 18 },
        max: { type: Number, max: 100 },
      },
      default: {
        min: 18,
        max: 80,
      }
    },
    religion: {
      type: String,
      enum: Object.values(Religion),
    },
    seeking: {
      type: Boolean,
      default: null
    },
    verified: {
      type: Boolean,
      default: false,
    },
    work_industry: {
      type: String,
    },
    location: {
      type: Schema.Types.ObjectId,
      ref: 'Locations',
    },
    interests: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Interests' }],
    },
    habits: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Habits' }],
    },
    state: {
      type: Schema.Types.ObjectId,
      ref: 'States',
    },
    tiktok: {
      type: String,
    },
    twitter: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const flatShareProfileModel = model<FlatShareProfile>('FlatShareProfiles', flatShareProfileSchema);

export default flatShareProfileModel;
