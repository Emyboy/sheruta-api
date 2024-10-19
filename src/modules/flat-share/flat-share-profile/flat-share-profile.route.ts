import { Routes } from "@/interfaces/routes.interface";
import { Router } from "express";
import FlatShareProfileController from "./flat-share-profile.controller";
import authMiddleware from "@/modules/auth/auth.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import { UpdateFlatShareProfileDTO } from "./flat-sahre-profile.dto";

export default class FlatShareProfileRoute implements Routes {
  public path = "/flat-share-profile";
  public router = Router();
  public flatShareProfileController = new FlatShareProfileController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.put(
      `${this.path}`,
      authMiddleware,
      validationMiddleware(UpdateFlatShareProfileDTO, "body"),
      this.flatShareProfileController.updateFlatShareProfile,
    );
  }
}
