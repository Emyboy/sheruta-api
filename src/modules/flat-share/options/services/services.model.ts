import { Document, model, Schema } from "mongoose";

export interface Services {
  _id: string;
  name: string;
  description: string;
  is_published: boolean;
  slug: string;
}

const servicesSchema: Schema = new Schema<Services>(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
    },
    description: {
      type: String,
      default: null,
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

const servicesModel = model<Services & Document>("Services", servicesSchema);

export default servicesModel;
