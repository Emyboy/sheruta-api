import { Routes } from "@/interfaces/routes.interface";
import { Router } from "express";
import ConversationsController from "./conversation.controller";
import authMiddleware from "@/modules/auth/auth.middleware";
import { validateCredit } from "@/modules/wallet/transactions/transaction.middleware";
import { creditTable } from "@/config";

export default class ConversationRoute implements Routes {
  public path = "/conversations";
  public router = Router();
  public controller = new ConversationsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}/:receiver_id`,
      authMiddleware,
      this.controller.getConversationBetweenMembers,
    );
    this.router.post(
      `${this.path}/:receiver_id`,
      authMiddleware,
      validateCredit(creditTable.CREATE_CONVERSATION),
      this.controller.createConversationsBetweenUsers,
    );
    this.router.get(
      `${this.path}`,
      authMiddleware,
      this.controller.allUsersConversations,
    );
  }
}
