import { Routes } from "@/interfaces/routes.interface";
import { Router } from "express";
import NotificationController from "./notifications.controller";
import authMiddleware from "../auth/auth.middleware";


export default class NotificationsRoute implements Routes {
  public path = '/notifications';
  public router = Router();
  public notificationController = new NotificationController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.put(`${this.path}/mark-all-as-seen`, authMiddleware, this.notificationController.markAllAsSeen);
  }
}

