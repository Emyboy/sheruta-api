import { model, Schema, Document } from 'mongoose';

export interface Amenities {
  _id: string;
  name: string;
  is_published: boolean;
  slug: string;
}

const amenitiesSchema: Schema = new Schema<Amenities>(
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

const amenitiesModel = model<Amenities & Document>('Amenities', amenitiesSchema);

export default amenitiesModel;
