import { Router } from 'express';
import UsersController from '@/modules/users/users.controller';
import { CreateUserDto } from '@/modules/users/users.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';

class UsersRoute implements Routes {
  public path = '/users';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.put(`${this.path}`, this.usersController.updateUser);
  }
}

export default UsersRoute;
