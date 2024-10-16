import ConversationModel from "./conversations/conversations.model";
import MessageModel from "./messages.model"

export default class MessageService {
  private messages = MessageModel;
  private conversations = ConversationModel;

  public sendDirectMessage = async ({ receiver_id, sender_id, content }: { sender_id: string; receiver_id: string; content: string; }) => {

    const conversation = await this.conversations.findOne({
      members: { $all: [sender_id, receiver_id] }
    });

    if (!conversation) {
      const newConversation = await this.conversations.create({
        host: sender_id,
        members: [sender_id, receiver_id]
      })
      await this.messages.create({
        sender: sender_id,
        receiver: receiver_id,
        content,
        conversation: newConversation._id
      })
    } else {
      await this.messages.create({
        sender: sender_id,
        receiver: receiver_id,
        content,
        conversation: conversation._id
      })
    }
  }

}
