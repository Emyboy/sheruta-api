import { model, Schema, Document, SchemaDefinitionProperty } from 'mongoose';

export interface FlatShareRequest extends Document {
  bedrooms: number;
  bathrooms: number;
  toilets: number;
  description: string;
  house_rules: string[];
  living_rooms: number;
  availability_status: 'available' | 'unavailable';
  seeking: boolean;
  service_charge: number;
  image_urls: string[];
  video_url: string;
  user: SchemaDefinitionProperty<string>;
  user_info: SchemaDefinitionProperty<string>;
  flat_share_profile: SchemaDefinitionProperty<string>;
  location: SchemaDefinitionProperty<string>;
  service: SchemaDefinitionProperty<string>;
  category: SchemaDefinitionProperty<string>;
  amenities: SchemaDefinitionProperty<string>;
  property_type: SchemaDefinitionProperty<string>;
  state: SchemaDefinitionProperty<string>;
}

const flatShareRequestSchema: Schema = new Schema<FlatShareRequest>(
  {
    bedrooms: {
      type: Number,
      min: 1,
      default: 0
    },
    bathrooms: {
      type: Number,
      min: 1,
      default: 0
    },
    video_url: {
      type: String,
      default: null
    },
    toilets: {
      type: Number,
      min: 1,
      default: 0
    },
    living_rooms: {
      type: Number,
      min: 1,
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
      enum: ['available', 'unavailable'],
      default: 'available',
    },
    seeking: {
      type: Boolean,
      default: false,
    },
    service_charge: {
      type: Number,
      min: 0,
      default: null
    },
    image_urls: {
      type: [String],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    user_info: {
      type: Schema.Types.ObjectId,
      ref: 'UserInfos',
    },
    flat_share_profile: {
      type: Schema.Types.ObjectId,
      ref: 'FlatShareProfiles',
    },
    location: {
      type: Schema.Types.ObjectId,
      ref: 'Locations',
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Services',
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Categories',
    },
    amenities: {
      type: Schema.Types.ObjectId,
      ref: 'Amenities',
    },
    property_type: {
      type: Schema.Types.ObjectId,
      ref: 'PropertyTypes',
    },
    state: {
      type: Schema.Types.ObjectId,
      ref: 'States',
    },
  },
  {
    timestamps: true,
  },
);


const FlatShareRequestModel = model<FlatShareRequest>('FlatShareRequests', flatShareRequestSchema);

export default FlatShareRequestModel;
