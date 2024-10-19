import mongoose, { PaginateModel, Schema } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

export interface Message extends mongoose.Document {
  sender: mongoose.Types.ObjectId;
  content: string;
  seen: boolean;
  conversation: mongoose.Types.ObjectId;
  request: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<Message>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    seen: {
      type: Boolean,
      default: false,
    },
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversations",
      required: true,
    },
    request: {
      type: Schema.Types.ObjectId,
      ref: "FlatShareRequests",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);
messageSchema.index({ conversation: 1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ receiver: 1 });
messageSchema.index({ request: 1 });

messageSchema.plugin(mongoosePaginate);

const MessageModel = mongoose.model<Message, PaginateModel<Message>>("Messages", messageSchema);

export default MessageModel;
