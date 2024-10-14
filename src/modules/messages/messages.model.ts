import mongoose, { Schema } from 'mongoose';

export interface Message extends mongoose.Document {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
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
      ref: 'Users',
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
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
      ref: 'Conversations',
      required: true,
    },
    request: {
      type: Schema.Types.ObjectId,
      ref: 'FlatShareRequests',
      default: null
    },
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ conversation: 1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ receiver: 1 });
messageSchema.index({ request: 1 });

const MessageModel = mongoose.model<Message>('Messages', messageSchema);

export default MessageModel;
