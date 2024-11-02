import { User } from "@/modules/users/users.interface";
import { Document, model, Schema } from "mongoose";
import { WorkIndustries } from "../options/work_industry/work-industry.model";
import { Locations } from "../options/locations/locations.model";
import { Interests } from "../options/interests/interests.model";
import { Habits } from "../options/habits/habits.model";
import { UserInfo } from "@/modules/user-info/user-info.model";
import { States } from "../options/state/state.model";
import { UserSettings } from "@/modules/user-settings/user-settings.model";

export enum EmploymentStatus {
  EMPLOYED = "employed",
  STUDENT = "student",
  UNEMPLOYED = "unemployed",
  SELF_EMPLOYED = "self_employed",
  NULL = null,
}

export enum GenderPreference {
  MALE = "male",
  FEMALE = "female",
  NULL = null,
}

export enum PaymentType {
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  ANNUALLY = "annually",
  DAILY = "daily",
  BIANNUALLY = "biannually",
}

export enum Religion {
  CHRISTIANITY = "christian",
  ISLAM = "muslim",
  TRADITIONAL = "traditional",
  ATHEIST = "atheist",
  OTHER = "other",
  NULL = null,
}

enum MaritalStatus {
  SINGLE = "single",
  MARRIED = "married",
  DIVORCED = "divorced",
  WIDOWED = "widowed",
  NULL = null,
}

export interface FlatShareProfile extends Document {
  bio: string;
  budget: number | null;

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
  work_industry: WorkIndustries | null;
  location?: Locations;
  interests: Interests[];
  habits: Habits[];
  user_info?: UserInfo;
  user_settings?: UserSettings;
  user?: User;
  state: States;
  tiktok: string | null;
  twitter: string | null;

  company_name: string;
  company_address: string;
  supervisor_name: string;
  supervisor_number: string;
  marital_status: MaritalStatus | null;

  state_of_origin: string;
  nspokenlang: string;
}

const flatShareProfileSchema: Schema = new Schema<FlatShareProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
      select: false,
    },
    user_info: {
      type: Schema.Types.ObjectId,
      ref: "UserInfos",
      required: true,
      select: false,
    },
    user_settings: {
      type: Schema.Types.ObjectId,
      ref: "UserSettings",
      required: true,
      select: false,
    },
    bio: {
      type: String,
      maxlength: 500,
      default: null,
    },
    budget: {
      type: Number,
      min: 0,
      default: 0,
    },
    employment_status: {
      type: String,
      enum: [...Object.values(EmploymentStatus), null],
      default: null,
    },
    facebook: {
      type: String,
      default: null,
    },
    instagram: {
      type: String,
      default: null,
    },
    linkedin: {
      type: String,
      default: null,
    },
    occupation: {
      type: String,
      default: null,
    },
    gender_preference: {
      type: String,
      enum: [...Object.values(GenderPreference), null],
      default: null,
    },
    payment_type: {
      type: [{ type: String, enum: Object.values(PaymentType) }],
      default: [],
    },
    age_preference: {
      type: {
        min: { type: Number, min: 18 },
        max: { type: Number, max: 100 },
      },
      default: {
        min: 18,
        max: 80,
      },
    },
    religion: {
      type: String,
      enum: [...Object.values(Religion), null],
      default: null,
    },
    seeking: {
      type: Boolean,
      default: null,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    work_industry: {
      type: Schema.Types.ObjectId,
      ref: "WorkIndustries",
      default: null,
    },
    location: {
      type: Schema.Types.ObjectId,
      ref: "Locations",
      default: null,
    },
    interests: {
      type: [{ type: Schema.Types.ObjectId, ref: "Interests" }],
      default: [],
    },
    habits: {
      type: [{ type: Schema.Types.ObjectId, ref: "Habits" }],
      default: [],
    },
    state: {
      type: Schema.Types.ObjectId,
      ref: "States",
      default: null,
    },
    tiktok: {
      type: String,
      default: null,
    },
    twitter: {
      type: String,
      default: null,
    },
    company_name: {
      type: String,
      default: null,
    },
    company_address: {
      type: String,
      default: null,
    },
    supervisor_name: {
      type: String,
      default: null,
    },
    supervisor_number: {
      type: String,
      default: null,
    },
    marital_status: {
      type: String,
      enum: [...Object.values(MaritalStatus), null],
      default: null,
    },
    state_of_origin: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const flatShareProfileModel = model<FlatShareProfile>(
  "FlatShareProfiles",
  flatShareProfileSchema,
);

export default flatShareProfileModel;
