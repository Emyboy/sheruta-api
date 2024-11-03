import { NextFunction, Response } from "express";
import { RequestWithUser } from "../auth/auth.interface";
import ReservationService from "./reservations.service";


export default class ReservationController {
  private reservationService = new ReservationService();

  public createRequestReservation = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user = req._user;
      const { request_id, days } = req.body;

      const createdReservation = await this.reservationService.createRequestReservation({
        request_id,
        user_id: user._id,
        days,
      });

      res.status(201).json({ data: createdReservation, message: "created" });
    } catch (error) {
      next(error);
    }
  }

}

