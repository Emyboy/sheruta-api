import { model, Schema, Document } from 'mongoose';

export interface Location {
  _id: string;
  name: string;
  is_published: boolean;
  slug: string;
}

const stateSchema: Schema = new Schema<Location>(
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
  },
  {
    timestamps: true,
  },
);

const locationModel = model<Location & Document>('Locations', stateSchema);

export default locationModel;
