import { HttpException } from "@/exceptions/HttpException";
import ConversationModel from "./conversations/conversations.model";
import MessageModel from "./messages.model";

export default class MessageService {
  private messages = MessageModel;
  private conversations = ConversationModel;

  public sendDirectMessage = async (
    { sender_id, content, conversation_id }: {
      sender_id: string;
      content: string;
      conversation_id: string;
    },
  ) => {
    const conversation = await this.conversations.findById(conversation_id);

    if (!conversation) {
      throw new HttpException(404, "Conversation not found");
    } else {
      await this.messages.create({
        sender: sender_id,
        content,
        conversation: conversation._id,
      });
    }
  };

  public getMessagesByConversationId = async (
    { conversation_id, user_id, page = 1, limit = 10 }: {
      conversation_id: string;
      user_id: string;
      page?: number;
      limit?: number;
    },
  ) => {
    const conversation = await this.conversations.findOne({
      _id: conversation_id,
      $or: [{ host: user_id }, { members: user_id }],
    }).populate("members");

    if (!conversation) {
      throw new HttpException(
        404,
        "Conversation not found or unauthorized access",
      );
    }

    const messages = await this.messages.paginate({
      conversation: conversation_id,
    }, {
      page,
      limit,
      sort: { createdAt: -1 },
      populate: "sender",
    });

    return messages;
  };

  public deleteUserMessage = async ({message_id, user_id}:{user_id:string, message_id:string}) => {
    const message = await this.messages.findOne({
      _id: message_id,
      sender: user_id,
    });

    if (!message) {
      throw new HttpException(404, "Message not found or unauthorized access");
    }

    await message.remove();
  }
}
