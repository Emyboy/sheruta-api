import { Router } from 'express';
import UsersController from '@/modules/users/users.controller';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '../auth/auth.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import { UpdateUserDTO } from './users.dto';

class UsersRoute implements Routes {
  public path = '/users';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.put(`${this.path}`, authMiddleware, validationMiddleware(UpdateUserDTO, 'body'), this.usersController.updateUser);
    this.router.get(`${this.path}/dependencies`, this.usersController.getUserDependencies);
  }
}

export default UsersRoute;
