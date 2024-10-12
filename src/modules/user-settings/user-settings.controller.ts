import { NextFunction, Response } from "express";
import { RequestWithUser } from "../auth/auth.interface";
import UserSettingsService from "./user-settings.service";

export default class UserSettingsController {
  private userSettingsService = new UserSettingsService();

  public updateSettings = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user = req._user;
      const data = req.body;

      await this.userSettingsService.updateSettings({ user_id: user._id, data });

      res.status(200).json({ message: "Settings updated successfully" });

    } catch (error) {
      next(error);
    }
  }
}
