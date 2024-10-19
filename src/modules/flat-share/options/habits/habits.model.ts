import { Document, model, Schema } from "mongoose";

export interface Habits {
  _id: string;
  name: string;
  is_published: boolean;
  slug: string;
}

const habitsSchema: Schema = new Schema<Habits>(
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

const habitsModel = model<Habits & Document>("Habits", habitsSchema);

export default habitsModel;
