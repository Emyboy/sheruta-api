import { Document, model, Schema } from "mongoose";
import { User } from "@/modules/users/users.interface";

export enum TransactionType {
  DEFAULT = 'default',
  CREDIT = 'credit'
}

export interface Transaction extends Document {
  amount: number;
  transaction_id: string;
  user: Schema.Types.ObjectId | User;
  wallet: Schema.Types.ObjectId | User;
  type: TransactionType;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema: Schema = new Schema<Transaction>(
  {
    amount: {
      type: Number,
      required: true,
    },
    transaction_id: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    wallet: {
      type: Schema.Types.ObjectId,
      ref: "Wallets",
      required: true,
    },
    type: {
      type: String,
      default: TransactionType.DEFAULT,
      enum: TransactionType,
      required: true
    }
  },
  {
    timestamps: true,
  },
);

const transactionModel = model<Transaction & Document>("Transactions", transactionSchema);

export default transactionModel;
