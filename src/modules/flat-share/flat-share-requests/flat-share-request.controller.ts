import { logger } from "@/utils/logger";
import FlatShareRequestService from "./flat-share-request.service";
import { RequestWithUser } from "@/modules/auth/auth.interface";
import { NextFunction, Response } from "express";
import FlatShareRequestModel from "./flat-share-request.model";

export default class FlatShareRequestController {
  public flatShareRequestService = new FlatShareRequestService();

  public createSeekerRequest = async (req: RequestWithUser, res: Response, next) => {
    try {
      const { _user } = req;
      const result = await this.flatShareRequestService.createSeekerRequest({
        data: req.body,
        user: _user
      });

      return res.status(201).json({ data: result, message: "Request created" });
    } catch (error) {
      logger.error("CREATE SEEKER REQUEST ERROR::::", error)
      next(error);
    }
  }

  public createHostRequest = async (req: RequestWithUser, res: Response, next) => {
    try {
      const { _user } = req;
      const result = await this.flatShareRequestService.createHostRequest({
        data: req.body,
        user: _user
      });

      return res.status(201).json({ data: result, message: "Request created" });
    } catch (error) {
      logger.error("CREATE HOST REQUEST ERROR::::", error)
      next(error);
    }
  }

  public getAllRequests = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sort = { createdAt: -1 }; // Sort by latest

      const result = await FlatShareRequestModel.paginate({}, {
        page,
        limit,
        sort,
        populate: ['user', 'user_info', 'flat_share_profile', 'location', 'service', 'category', 'amenities', 'property_type', 'state', 'payment_type']
      });

      return res.status(200).json({
        data: result.docs,
        currentPage: result.page,
        totalPages: result.totalPages,
        totalItems: result.totalDocs,
        message: "Requests retrieved successfully"
      });
    } catch (error) {
      logger.error('GET ALL REQUEST ERROR:::', error);
      next(error);
    }
  }

  public getRequestDetails = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { request_id } = req.params;
      const result = await this.flatShareRequestService.getRequestDetails(request_id, req?._user?._id);

      return res.status(200).json({ data: result, message: "Request retrieved successfully" });
    } catch (error) {
      logger.error('GET REQUEST DETAILS ERROR:::', error);
      next(error);
    }
  }

  public updateSeekerRequest = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { request_id } = req.params;
      const result = await this.flatShareRequestService.updateSeekerRequest({ request_id, data: req.body, user_id: req?._user?._id });

      return res.status(200).json({ data: result, message: "Request updated successfully" });
    } catch (error) {
      logger.error('UPDATE SEEKER REQUEST ERROR:::', error);
      next(error);
    }
  }

  public updateHostRequest = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { request_id } = req.params;
      const result = await this.flatShareRequestService.updateHostRequest({ request_id, data: req.body, user_id: req?._user?._id });

      return res.status(200).json({ data: result, message: "Request updated successfully" });
    } catch (error) {
      logger.error('UPDATE HOST REQUEST ERROR:::', error);
      next(error)
    }
  }

}
