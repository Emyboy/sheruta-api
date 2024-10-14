import { NextFunction, Response } from "express";
import { RequestWithUser } from "../auth/auth.interface";
import NotificationService from "./notifications.service"

export default class NotificationController {
  private notifications = new NotificationService();

  public markAllAsSeen = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const receiver_id = req._user._id;
      await this.notifications.markAllAsSeen(receiver_id);
      return res.json({ message: 'All notifications marked as seen' });
    } catch (error) {
      next(error);
    }
  }

}
