import { model, Schema, Document, SchemaDefinitionProperty } from 'mongoose';

export interface Locations {
  _id: string;
  name: string;
  is_published: boolean;
  slug: string;
  state: SchemaDefinitionProperty<string>;
  has_group: boolean;
  image_url: string | null;
  longitude: string | null;
  latitude: string | null;
  rank: number;
}

const stateSchema: Schema = new Schema<Locations>(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
    },
    is_published: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    state: {
      type: Schema.Types.ObjectId,
      ref: 'States',
      required: true,
    },
    has_group: {
      type: Boolean,
      default: false,
    },
    image_url: {
      type: String,
      default: null,
    },
    longitude: {
      type: String,
      default: null,
    },
    latitude: {
      type: String,
      default: null,
    },
    rank: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const locationModel = model<Locations & Document>('Locations', stateSchema);

export default locationModel;
