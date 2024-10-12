import { Routes } from "@/interfaces/routes.interface";
import { Router } from "express";
import UserSettingsController from "./user-settings.controller";
import authMiddleware from "../auth/auth.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import { UpdateUserSettingsDTO } from "./user-settings.dto";

export default class UserSettingsRoute implements Routes {
  public path = "/user-settings";
  public router = Router();
  public userSettingsController = new UserSettingsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.put(`${this.path}`, authMiddleware, validationMiddleware(UpdateUserSettingsDTO, 'body'), this.userSettingsController.updateSettings);
  }
}
