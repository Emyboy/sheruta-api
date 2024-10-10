import { Router } from 'express';
import AuthController from '@/modules/auth/auth.controller';
import { Routes } from '@interfaces/routes.interface';
// import authMiddleware from '@/modules/auth/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';
import { CreateUserDto, UserLoginDto, VerifyTokenDto } from '@/modules/users/users.dto';

class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto, 'body'), this.authController.signUp);
    this.router.post(`${this.path}/login`, validationMiddleware(UserLoginDto, 'body'), this.authController.logIn);
    this.router.post(`${this.path}/verify`, validationMiddleware(VerifyTokenDto, 'body'), this.authController.verifyOTP);
  }
}

export default AuthRoute;
