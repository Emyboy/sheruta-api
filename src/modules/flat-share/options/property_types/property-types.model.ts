import { Document, model, Schema } from "mongoose";

export interface PropertyTypes {
  _id: string;
  name: string;
  is_published: boolean;
  slug: string;
}

const propertyTypesSchema: Schema = new Schema<PropertyTypes>(
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

const propertyTypesModel = model<PropertyTypes & Document>(
  "PropertyTypes",
  propertyTypesSchema,
);

export default propertyTypesModel;
