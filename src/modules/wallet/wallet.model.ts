import { Document, model, Schema } from "mongoose";
import { User } from "@/modules/users/users.interface";

export interface Wallet extends Document {
  total_credit: number;
  total_deposit: number;
  user: Schema.Types.ObjectId | User;
}

const walletSchema: Schema = new Schema<Wallet>(
  {
    total_credit: {
      type: Number,
      default: 0,
    },
    total_deposit: {
      type: Number,
      default: 0,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

const walletModel = model<Wallet & Document>("Wallets", walletSchema);

export default walletModel;
