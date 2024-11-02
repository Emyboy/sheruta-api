import { NextFunction, Response } from "express";
import { RequestWithUser } from "../auth/auth.interface";
import PromotionService from "./promotions.service";
import promotionModel from "./promotions.model";


export default class PromotionController {
  private promotion = new PromotionService();
  private promotionModel = promotionModel;


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

  public getAllUserPromotions = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user = req._user;
      const promotions = await this.promotionModel.find({ user: user._id })
        .populate('service')
        .populate('request')
        .populate('location')

      return res.status(200).json({ data: promotions })
    } catch (error) {
      console.log('GET ALL USER PROMOTIONS :::', error)
      next(error)
    }
  }

  public getAllPromotions = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const promotions = await this.promotionModel.find()
        .populate('service')
        .populate('request')
        .populate('location')

      return res.status(200).json({ data: promotions })
    } catch (error) {
      console.log('GET ALL PROMOTIONS :::', error)
      next(error)
    }
  }

}

