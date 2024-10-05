import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@/modules/auth/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';
import { OptionsDTO } from '../options.dto';
import PropertyTypeController from './property_types.controller';

class PropertyTypesRoute implements Routes {
  public path = '/options/property-types';
  public router = Router();
  public controller = new PropertyTypeController();

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

export default PropertyTypesRoute;
