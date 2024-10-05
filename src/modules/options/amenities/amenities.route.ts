import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@/modules/auth/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';
import AmenitiesController from './amenities.controller';
import { OptionsDTO } from '../options.dto';

class AmenitiesRoute implements Routes {
    public path = '/options/amenities';
    public router = Router();
    public amenitiesController = new AmenitiesController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}`, authMiddleware, validationMiddleware(OptionsDTO, 'body'), this.amenitiesController.create);
        this.router.get(`${this.path}`, this.amenitiesController.get);
        this.router.put(`${this.path}/:id`, authMiddleware, validationMiddleware(OptionsDTO, 'body'), this.amenitiesController.update);
        this.router.delete(`${this.path}/:id`, authMiddleware, this.amenitiesController.update);
    }
}

export default AmenitiesRoute;
