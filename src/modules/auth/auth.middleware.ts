import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '@/modules/auth/auth.interface';
import userModel from '@/modules/users/users.model';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);

    if (Authorization) {
      const secretKey: string = SECRET_KEY;
      const verificationResponse = (await verify(Authorization, secretKey)) as DataStoredInToken;
      const userId = verificationResponse._id;
      const findUser = await userModel.findById(userId);

      if (findUser) {
        req._user = findUser;
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Session expired'));
  }
};

export const adminMiddleware = (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    if (req._user && req._user.email.includes('@sheruta.ng')) {
      next();
    } else {
      next(new HttpException(401, 'Unauthorized'));
    }
  } catch (error) {
    next(new HttpException(500, 'Internal Server Error'));
  }
};

export default authMiddleware;
