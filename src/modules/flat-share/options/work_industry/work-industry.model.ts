import { Document, model, Schema } from "mongoose";

export interface WorkIndustries {
  _id: string;
  name: string;
  is_published: boolean;
  slug: string;
}

const categoriesSchema: Schema = new Schema<WorkIndustries>(
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

const workIndustryModel = model<WorkIndustries & Document>(
  "WorkIndustries",
  categoriesSchema,
);

export default workIndustryModel;
