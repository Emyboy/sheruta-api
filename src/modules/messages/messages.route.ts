import { Routes } from "@/interfaces/routes.interface";
import { Router } from "express";
import MessagesController from "./messages.controller";
import authMiddleware from "../auth/auth.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";

export default class MessagesRoute implements Routes {
  public path = '/messages';
  public router = Router();
  public controller = new MessagesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/:conversation_id`, authMiddleware, validationMiddleware(DirectMessageDTO, 'body'), this.controller.createMessage);
  }
}
