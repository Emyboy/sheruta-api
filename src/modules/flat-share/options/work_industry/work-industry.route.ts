import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware, { adminMiddleware } from '@/modules/auth/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';
import { OptionsDTO } from '../options.dto';
import WorkIndustriesController from './work-industry.controller';

class WorkIndustriesRoute implements Routes {
    public path = '/options/categories';
    public router = Router();
    public controller = new WorkIndustriesController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}`, authMiddleware, adminMiddleware, validationMiddleware(OptionsDTO, 'body'), this.controller.create);
        this.router.get(`${this.path}`, this.controller.get);
        this.router.put(`${this.path}/:id`, authMiddleware, adminMiddleware, validationMiddleware(OptionsDTO, 'body'), this.controller.update);
        this.router.delete(`${this.path}/:id`, authMiddleware, adminMiddleware, this.controller.update);
    }
}

export default WorkIndustriesRoute;
