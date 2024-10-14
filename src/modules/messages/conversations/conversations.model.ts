import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';


export interface Conversation extends mongoose.Document {
  host: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<Conversation>(
  {
    host: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
      },
    ],
  },
  {
    timestamps: true,
  }
);

conversationSchema.plugin(mongoosePaginate);

const ConversationModel = mongoose.model<Conversation>('Conversations', conversationSchema);

export default ConversationModel;
