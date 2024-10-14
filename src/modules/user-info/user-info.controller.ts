import { NextFunction, Response } from "express";
import { RequestWithUser } from "../auth/auth.interface";
import UserInfoService from "./user-info.service";

export default class UserInfoController {
  private userInfoService = new UserInfoService();

  public updateUserInfo = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user = req._user;
      const data = req.body;

      await this.userInfoService.update({ user_id: user._id, data });

      res.status(200).json({ message: "User info updated successfully" });
    } catch (error) {
      console.log('UPDATE USER INFO ERROR', error);
      next(error);
    }
  }

  public completeKYC = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user = req._user;
      await this.userInfoService.completeKYC({ user_id: user._id });

      res.status(200).json({ message: "KYC completed successfully" });
    } catch (error) {
      console.log('COMPLETE KYC ERROR', error);
      next(error);
    }
  }

}
