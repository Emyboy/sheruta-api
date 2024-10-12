import { Routes } from "@/interfaces/routes.interface";
import { Router } from "express";
import FlatShareRequestController from "./flat-share-request.controller";
import authMiddleware from "@/modules/auth/auth.middleware";
import { CreateSeekerRequestDTO } from "./flat-share-request.dto";
import validationMiddleware from "@/middlewares/validation.middleware";

export default class FlatShareRequestRoute implements Routes {
  public path = '/flat-share-requests';
  public router = Router();
  public flatShareRequestController = new FlatShareRequestController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/seeker`, authMiddleware, validationMiddleware(CreateSeekerRequestDTO, 'body'), this.flatShareRequestController.createSeekerRequest);
  }
}

