import { logger } from "@/utils/logger";
import FlatShareRequestService from "./flat-share-request.service";
import { RequestWithUser } from "@/modules/auth/auth.interface";
import { Response } from "express";

export default class FlatShareRequestController {
  public flatShareRequestService = new FlatShareRequestService();

  public createRequest = async (req: RequestWithUser, res:Response, next) => {
    try {
      const { _user } = req;
      const result = await this.flatShareRequestService.create({
        data: req.body,
        user: _user
      });

      return res.status(201).json({ data: result, message: "Request created" });
    } catch (error) {
      logger.error("CREATE REQUEST ERROR::::", error)
      next(error);
    }
  }

}
