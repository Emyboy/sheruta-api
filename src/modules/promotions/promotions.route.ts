import { Routes } from "@/interfaces/routes.interface";
import { Router } from "express";
import PromotionController from "./promotions.controller";
import authMiddleware from "../auth/auth.middleware";
import { validateCredit } from "../wallet/transactions/transaction.middleware";
import { creditTable } from "@/config";

export default class PromotionRoute implements Routes {
  public path = "/promotions";
  public router = Router();
  public promotionController = new PromotionController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/profile`,
      authMiddleware,
      validateCredit(creditTable.PROMOTION),
      this.promotionController.profilePromotion,
    );
    this.router.post(
      `${this.path}/request`,
      authMiddleware,
      validateCredit(creditTable.PROMOTION),
      this.promotionController.requestPromotion,
    );
  }
}
