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
    {}: { conversation_id: string; user_id: string },
  ) => {
  };
}
