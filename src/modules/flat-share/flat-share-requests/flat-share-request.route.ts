import { Routes } from "@/interfaces/routes.interface";
import { Router } from "express";
import FlatShareRequestController from "./flat-share-request.controller";
import authMiddleware from "@/modules/auth/auth.middleware";
import { CreateHostRequestDTO, CreateSeekerRequestDTO, UpdateHostRequestDTO, UpdateSeekerRequestDTO } from "./flat-share-request.dto";
import validationMiddleware from "@/middlewares/validation.middleware";

export default class FlatShareRequestRoute implements Routes {
  public path = '/flat-share-requests';
  public router = Router();
  public flatShareRequestController = new FlatShareRequestController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.flatShareRequestController.getAllRequests);
    this.router.get(`${this.path}/:request_id`, this.flatShareRequestController.getRequestDetails);
    this.router.delete(`${this.path}/:request_id`, authMiddleware, this.flatShareRequestController.deleteRequest);

    //seeker
    this.router.post(`${this.path}/seeker`, authMiddleware, validationMiddleware(CreateSeekerRequestDTO, 'body'), this.flatShareRequestController.createSeekerRequest);
    this.router.put(`${this.path}/seeker/:request_id`, authMiddleware, validationMiddleware(UpdateSeekerRequestDTO, 'body'), this.flatShareRequestController.updateSeekerRequest);

    //host
    this.router.post(`${this.path}/host`, authMiddleware, validationMiddleware(CreateHostRequestDTO, 'body'), this.flatShareRequestController.createHostRequest);
    this.router.put(`${this.path}/host/:request_id`, authMiddleware, validationMiddleware(UpdateHostRequestDTO, 'body'), this.flatShareRequestController.updateHostRequest);
  }
}

