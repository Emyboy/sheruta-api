import { Routes } from "@/interfaces/routes.interface";
import { Router } from "express";
import TransactionController from "./transaction.controller";
import authMiddleware from "@/modules/auth/auth.middleware";

export default class TransactionRoute implements Routes {
  public path = "/transactions";
  public router = Router();
  public controller = new TransactionController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/validate`,
      authMiddleware,
      this.controller.validatePaystackTransaction,
    );
  }
}
