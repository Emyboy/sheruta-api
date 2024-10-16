import { RequestWithUser } from "@/modules/auth/auth.interface";
import { NextFunction, Response } from "express";
import ConversationModel from "./conversations.model";


export default class ConversationsController {
  public conversations = ConversationModel;

  public getConversationBetweenMembers = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user = req._user;
      const { receiver_id } = req.params;

      const conversation = await this.conversations.findOne({
        members: { $all: [user._id, receiver_id] }
      });

      if (!conversation || receiver_id === user._id) {
        return res.status(200).json({ message: "Please try again", data: null });
      }

      res.status(200).json({ data: conversation, message: "Conversation found" });
    } catch (error) {
      console.log('GET CONVERSATION ERROR', error);
      next(error);
    }
  }

  public createConversationsBetweenUsers = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user = req._user;
      const { receiver_id } = req.params;

      if (receiver_id === user._id || !receiver_id) {
        return res.status(400).json({ message: "Bad request" });
      }

      const conversation = await this.conversations.findOne({
        members: { $all: [user._id, receiver_id] }
      }).populate('members', 'host');

      if (conversation) {
        return res.status(200).json({ data: conversation });
      }

      await this.conversations.create({
        host: user._id,
        members: [user._id, receiver_id]
      })

      const newConversation = await this.conversations.findOne({
        members: { $all: [user._id, receiver_id] }
      }).populate('members', 'host');

      res.status(201).json({ data: newConversation });
    } catch (error) {
      console.log('CREATE CONVERSATION ERROR', error);
      next(error as Error);
    }
  }

  public allUsersConversations = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user = req._user;
      const { page = 1, limit = 10 } = req.query;

      const options = {
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        sort: { createdAt: -1 }
      };

      const conversations = await this.conversations.paginate(
        { members: { $in: [user._id] } },
        options
      )

      res.status(200).json({ conversations });
    } catch (error) {
      console.log('ALL USERS CONVERSATIONS ERROR', error);
      next(error as Error);
    }
  }


}
