import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@/modules/auth/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';
import { OptionsDTO } from '../options.dto';
import ServiceController from './service.controller';

class ServiceRoute implements Routes {
  public path = '/options/services';
  public router = Router();
  public controller = new ServiceController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(OptionsDTO, 'body'), this.controller.create);
    this.router.get(`${this.path}`, this.controller.get);
    this.router.put(`${this.path}/:id`, authMiddleware, validationMiddleware(OptionsDTO, 'body'), this.controller.update);
    this.router.delete(`${this.path}/:id`, authMiddleware, this.controller.update);
  }
}

export default ServiceRoute;
