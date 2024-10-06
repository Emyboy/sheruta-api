import { model, Schema, Document } from 'mongoose';

export interface Interests {
  _id: string;
  name: string;
  is_published: boolean;
  slug: string;
}

const interestSchema: Schema = new Schema<Interests>(
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

const interestModel = model<Interests & Document>('Interests', interestSchema);

export default interestModel;
