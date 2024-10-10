import { Routes } from "@/interfaces/routes.interface";
import { Router } from "express";
import UserInfoController from "./user-info.controller";
import validationMiddleware from "@/middlewares/validation.middleware";
import { UpdateUserInfoDTO } from "./user-info.dto";
import authMiddleware from "../auth/auth.middleware";

export default class UserInfoRoute implements Routes {
  public path = "/user-info";
  public router = Router();
  public userInfoController = new UserInfoController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.put(`${this.path}`, authMiddleware, validationMiddleware(UpdateUserInfoDTO, 'body'), this.userInfoController.updateUserInfo);
  }
}
