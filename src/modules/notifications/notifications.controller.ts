import { NextFunction, Response } from "express";
import { RequestWithUser } from "../auth/auth.interface";
import NotificationService from "./notifications.service";

export default class NotificationController {
  private notifications = new NotificationService();

  public markAllAsSeen = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const receiver_id = req._user._id;
      await this.notifications.markAllAsSeen(receiver_id);
      return res.json({ message: "All notifications marked as seen" });
    } catch (error) {
      next(error);
    }
  };

  public getAllUserNotifications = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const receiver_id = req._user._id;
      const { page = 1, limit = 10 } = req.query;
      const notifications = await this.notifications.getAllUserNotifications(
        receiver_id,
        Number(page),
        Number(limit),
      );
      return res.json({ notifications });
    } catch (error) {
      next(error);
    }
  };
}
