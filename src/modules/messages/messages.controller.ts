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
}
