import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@/modules/users/users.dto';
import { RequestWithUser } from '@/modules/auth/auth.interface';
import { User } from '@/modules/users/users.interface';
import AuthService from '@/modules/auth/auth.service';

class AuthController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const signUpUserData: User = await this.authService.signup(userData);

      res.status(201).json({ data: signUpUserData, message: 'signup' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const { cookie, user } = await this.authService.login(userData);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ data: { user, token: cookie }, message: 'login' });
    } catch (error) {
      next(error);
    }
  };

}

export default AuthController;
