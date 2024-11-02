import { RequestWithUser } from "@/modules/auth/auth.interface";
import { NextFunction, Response } from "express";
import ConversationModel from "./conversations.model";
import messagesModel from '@/modules/messages/messages.model';


export default class ConversationsController {
  public conversations = ConversationModel;
  private messages = messagesModel;


  public getConversationBetweenMembers = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user = req._user;
      const { receiver_id } = req.params;

      let populate = "_id first_name last_seen avatar_url account_status";

      const conversation = await this.conversations.findOne({
        members: { $all: [user._id, receiver_id] },
      })
        .populate("host", populate)
        .populate("members", populate);

      if (!conversation || receiver_id === user._id) {
        return res.status(200).json({
          message: "Please try again",
          data: null,
        });
      }

      res.status(200).json({
        data: conversation,
        message: "Conversation found",
      });
    } catch (error) {
      console.log("GET CONVERSATION ERROR", error);
      next(error);
    }
  };

  public createConversationsBetweenUsers = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user = req._user;
      const { receiver_id } = req.params;

      if (receiver_id === user._id || !receiver_id) {
        return res.status(400).json({ message: "Bad request" });
      }

      const conversation = await this.conversations.findOne({
        members: { $all: [user._id, receiver_id] },
      }).populate("members", "host");

      if (conversation) {
        return res.status(200).json({ data: conversation });
      }

      await this.conversations.create({
        host: user._id,
        members: [user._id, receiver_id],
      });

      const newConversation = await this.conversations.findOne({
        members: { $all: [user._id, receiver_id] },
      }).populate("members", "host");

      res.status(201).json({ data: newConversation });
    } catch (error) {
      console.log("CREATE CONVERSATION ERROR", error);
      next(error as Error);
    }
  };

  public allUsersConversations = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user = req._user;
      const { page = 1, limit = 10 } = req.query;

      const options = {
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        sort: { createdAt: -1 },
        populate: ["members", "host"],
      };

      const conversations = await this.conversations.paginate(
        { members: { $in: [user._id] } },
        options,
      );

      const conversationsWithUnread = await Promise.all(
        conversations.docs.map(async (conversation) => {
          const unreadMessages = await this.messages.countDocuments({
            conversation: conversation._id,
            seen: false,
            sender: { $ne: user._id },
          });

          return {
            ...conversation.toObject(),
            unread_messages: unreadMessages || 0,
          };
        })
      );

      res.status(200).json({ conversations: conversationsWithUnread });
    } catch (error) {
      console.log("ALL USERS CONVERSATIONS ERROR", error);
      next(error as Error);
    }
  };
}
