import { Document, model, Schema } from "mongoose";

export interface Categories {
  _id: string;
  name: string;
  is_published: boolean;
  slug: string;
}

const categoriesSchema: Schema = new Schema<Categories>(
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

const categoriesModel = model<Categories & Document>(
  "Categories",
  categoriesSchema,
);

export default categoriesModel;
