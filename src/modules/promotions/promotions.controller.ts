import { NextFunction, Response } from "express";
import { RequestWithUser } from "../auth/auth.interface";
import PromotionService from "./promotions.service";


export default class PromotionController {
  private promotion = new PromotionService();

  public profilePromotion = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user = req._user;
      const { days, pitch, service_id } = req.body;

      await this.promotion.promoteProfile({
        days,
        user_id: user._id,
        pitch,
        service_id
      })

      return res.status(201).json({ message: "Promotion created" })
    } catch (error) {
      console.log('PROFILE PROMOTION CREATION :::', error)
      next(error)
    }
  }

  public requestPromotion = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user = req._user;
      const { days, request_id } = req.body;

      await this.promotion.requestPromotion({
        days,
        user_id: user._id,
        request_id
      })

      return res.status(201).json({ message: "Promotion requested" })
    } catch (error) {
      console.log('PROFILE PROMOTION REQUEST :::', error)
      next(error)
    }
  }

}

