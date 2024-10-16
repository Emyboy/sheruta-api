import { model, Schema, Document, PaginateModel } from 'mongoose';
import { Locations } from '../options/locations/locations.model';
import { User } from '@/modules/users/users.interface';
import { UserInfo } from '@/modules/user-info/user-info.model';
import { FlatShareProfile } from '../flat-share-profile/flat-share-profile.model';
import mongoosePaginate from 'mongoose-paginate-v2';
import { States } from '../options/state/state.model';
import { PropertyTypes } from '../options/property_types/property-types.model';
import { Amenities } from '../options/amenities/amenities.model';
import { Categories } from '../options/categories/categories.model';
import { Services } from '../options/services/services.model';

export enum AvailabilityStatus {
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable',
  RESERVED = 'reserved'
}

export enum PaymentType {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  WEEKLY = 'weekly',
  DAILY = 'daily'
}

export interface FlatShareRequest extends Document {
  bedrooms: number;
  bathrooms: number;
  toilets: number;
  rent: number;
  living_rooms: number;
  description: string;
  house_rules: string[];
  availability_status: AvailabilityStatus;
  seeking: boolean;
  service_charge: number;
  image_urls: string[];
  video_url: string;
  user: User;
  user_info: UserInfo;
  flat_share_profile: FlatShareProfile;
  location: Locations;
  service: Services;
  category: Categories;
  amenities: Amenities[];
  property_type: PropertyTypes;
  state: States;
  view_count: number;
  call_count: number;
  question_count: number;
  google_location_object: any;
  google_location_text: string;
  payment_type: PaymentType;
}

const flatShareRequestSchema: Schema = new Schema<FlatShareRequest>(
  {
    rent: {
      type: Number,
      min: 2000,
      required: true,
    },
    bedrooms: {
      type: Number,
      default: 0
    },
    bathrooms: {
      type: Number,
      default: 0
    },
    video_url: {
      type: String,
      default: null
    },
    toilets: {
      type: Number,
      default: 0
    },
    living_rooms: {
      type: Number,
      default: 0
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 500,
    },
    house_rules: {
      type: [String],
    },
    availability_status: {
      type: String,
      enum: AvailabilityStatus,
      default: AvailabilityStatus.AVAILABLE,
    },
    seeking: {
      type: Boolean,
      required: true,
    },
    service_charge: {
      type: Number,
      min: 0,
      default: 0
    },
    image_urls: {
      type: [String],
      default: []
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    user_info: {
      type: Schema.Types.ObjectId,
      ref: 'UserInfos',
      required: true,
    },
    flat_share_profile: {
      type: Schema.Types.ObjectId,
      ref: 'FlatShareProfiles',
      required: true
    },
    location: {
      type: Schema.Types.ObjectId,
      ref: 'Locations',
      required: true
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Services',
      required: true
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Categories',
    },
    amenities: [{
      type: Schema.Types.ObjectId,
      ref: 'Amenities',
    }],
    property_type: {
      type: Schema.Types.ObjectId,
      ref: 'PropertyTypes'
    },
    state: {
      type: Schema.Types.ObjectId,
      ref: 'States',
      required: true
    },
    view_count: {
      type: Number,
      default: 0
    },
    // add the remaining fields
    google_location_object: {
      type: Object,
      required: true
    },
    google_location_text: {
      type: String,
      required: true
    },
    call_count: {
      type: Number,
      default: 0
    },
    question_count: {
      type: Number,
      default: 0
    },
  },
  {
    timestamps: true,
  },
);

flatShareRequestSchema.plugin(mongoosePaginate);

// const FlatShareRequestModel = model<FlatShareRequest>('FlatShareRequests', flatShareRequestSchema);
const FlatShareRequestModel = model<FlatShareRequest, PaginateModel<FlatShareRequest>>('FlatShareRequests', flatShareRequestSchema);



export default FlatShareRequestModel;
