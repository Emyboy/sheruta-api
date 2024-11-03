import { Routes } from "@/interfaces/routes.interface";
import { Router } from "express";
import ReservationController from "./reservations.controller";
import authMiddleware from "../auth/auth.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import { CreateReservationDTO } from "./reservations.dto";


export default class ReservationRoute implements Routes {
  public path = "/reservations";
  public router = Router();
  public reservationController = new ReservationController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/request`,
      authMiddleware,
      validationMiddleware(CreateReservationDTO, "body"),
      this.reservationController.createRequestReservation,
    );
    this.router.get(
      `${this.path}`,
      authMiddleware,
      this.reservationController.getUserReservation,
    );
  }
}

