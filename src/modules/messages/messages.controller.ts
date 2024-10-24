import { NextFunction, Response } from "express";
import { RequestWithUser } from "../auth/auth.interface";
import MessageService from "./messages.service";

export default class MessagesController {
  public messages = new MessageService();

  public createMessage = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user = req._user;
      const { conversation_id, content } = req.body;

      await this.messages.sendDirectMessage({
        sender_id: user._id,
        conversation_id,
        content,
      });

      res.status(200).json({ message: "Message sent successfully" });
    } catch (error) {
      console.log("CREATE MESSAGE ERROR", error);
      next(error);
    }
  };

  public getConversationMessages = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user = req._user;
      const { conversation_id } = req.params;
      const { page, limit } = req.query;

      const messages = await this.messages.getMessagesByConversationId({
        conversation_id,
        user_id: user._id,
        page: +page,
        limit: +limit,
      });

      res.status(200).json({ data: messages });
    } catch (error) {
      console.log("GET CONVERSATION MESSAGES ERROR", error);
      next(error);
    }
  };

  public deleteMessage = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user = req._user;
      const { message_id } = req.params;

      await this.messages.deleteUserMessage({ user_id: user._id, message_id });

      res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
      console.log("DELETE MESSAGE ERROR", error);
      next(error);
    }
  };

  public markAllUserUnreadMessagesAsRead = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user = req._user;
      await this.messages.markAllUserUnreadMessagesAsRead({
        user_id: user._id,
        conversation_id: req.params.conversation_id
      });
      res.status(200).json({ message: "All unread messages marked as read" });
    } catch (error) {
      console.log("MARK ALL UNREAD MESSAGES AS READ ERROR", error);
      next(error);
    }
  }
}
