import { RequestWithUser } from "@/modules/auth/auth.interface";
import { NextFunction, Response } from "express";
import FlatShareProfileService from "./flat-share-profile.service";

export default class FlatShareProfileController {
  private flatShareProfileService = new FlatShareProfileService();

  public updateFlatShareProfile = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user = req._user;
      const data = req.body;

      await this.flatShareProfileService.update({ user_id: user._id, data });

      res.status(200).json({ message: "Flat share profile updated successfully" });
    } catch (error) {
      next(error);
    }
  }

}
