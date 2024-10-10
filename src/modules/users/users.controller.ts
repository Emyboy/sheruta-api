import { NextFunction, Response } from 'express';
import userService from '@/modules/users/users.service';
import { RequestWithUser } from '../auth/auth.interface';

class UsersController {
  public userService = new userService();

  public updateUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { _user } = req;
      await this.userService.update({
        user_id: _user._id,
        data: req.body,
      });

      res.status(200).json({ message: 'User updated' });
    } catch (error) {
      next(error);
    }
  };

}

export default UsersController;
