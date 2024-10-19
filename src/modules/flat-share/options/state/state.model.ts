import { Document, model, Schema } from "mongoose";

export interface States {
  _id: string;
  name: string;
  is_published: boolean;
  slug: string;
}

const stateSchema: Schema = new Schema<States>(
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

const stateModel = model<States & Document>("States", stateSchema);

export default stateModel;
