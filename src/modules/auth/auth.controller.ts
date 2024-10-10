import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@/modules/users/users.dto';
// import { RequestWithUser } from '@/modules/auth/auth.interface';
import { User } from '@/modules/users/users.interface';
import AuthService from '@/modules/auth/auth.service';
import { logger } from '@/utils/logger';

class AuthController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const signUpUserData: User = await this.authService.signup(userData);

      res.status(201).json({ data: signUpUserData, message: 'signup' });
    } catch (error) {
      logger.error('SIGNUP ERROR::::', error);
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
      console.log('LOGIN ERROR:::', error);
      logger.error('LOGIN ERROR::::', error);
      next(error);
    }
  };

  public verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.body;
      await this.authService.verifyOTP(token);

      res.status(200).json({
        message: 'Verification Successful',
      });
    } catch (error) {
      console.log("verifyOTP ERROR:::", error);
      logger.error('VERIFY OTP ERROR::::', error);
      next(error);
    }
  };

  public sendOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      if(!email) {
        return res.status(400).json({ message: 'Email is required' });
      }

      await this.authService.sendOTP(email?.toLocaleLowerCase()?.trim());

      res.status(200).json({
        message: 'OTP sent successfully',
      });
    } catch (error) {
      logger.error('SEND OTP ERROR::::', error);
      next(error);
    }
  }

  public passwordResetRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      if(!email) {
        return res.status(400).json({ message: 'Email is required' });
      }

      await this.authService.requestPasswordReset(email?.toLocaleLowerCase()?.trim());

      res.status(200).json({
        message: 'Request sent successfully',
      });
    } catch (error) {
      logger.error('SEND PASSWORD Request ERROR::::', error);
      next(error);
    }
  }

  public resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, password } = req.body;

      if(!token || !password) {
        return res.status(400).json({ message: 'Token and password are required' });
      }

      await this.authService.resetPassword(token, password);

      res.status(200).json({
        message: 'Password reset successful',
      });
    } catch (error) {
      logger.error('RESET PASSWORD ERROR::::', error);
      next(error);
    }
  }

}

export default AuthController;
