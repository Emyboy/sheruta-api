import { NextFunction, Response } from 'express';
import userService from '@/modules/users/users.service';
import { DataStoredInToken, RequestWithUser } from '../auth/auth.interface';
import userSettingModel from '../user-settings/user-settings.model';
import userModel from './users.model';
import userInfoModel from '../user-info/user-info.model';
import flatShareProfileModel from '../flat-share/flat-share-profile/flat-share-profile.model';
import amenitiesModel from '../flat-share/options/amenities/amenities.model';
import servicesModel from '../flat-share/options/services/services.model';
import locationModel from '../flat-share/options/locations/locations.model';
import stateModel from '../flat-share/options/state/state.model';
import { SECRET_KEY } from '@/config';
import { verify } from 'jsonwebtoken';
import mongoose from 'mongoose';


class UsersController {
  public userService = new userService();
  public userSettings = userSettingModel;
  public user = userModel;
  public userInfo = userInfoModel;
  public flatShareProfile = flatShareProfileModel;

  //options
  public amenities = amenitiesModel;
  public services = servicesModel;
  public location = locationModel;
  public state = stateModel;

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

  public getUserDependencies = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);
      const secretKey: string = SECRET_KEY;
      const verificationResponse = (await verify(Authorization, secretKey)) as DataStoredInToken;
      const userId = new mongoose.Types.ObjectId(verificationResponse._id);

      const [user, userSettings, userInfo, flatShareProfile, locations, states, amenities, services] = await Promise.all([
        this.user.findById(userId),
        this.userSettings.findOne({ user: userId }),
        this.userInfo.findOne({ user: userId }),
        this.flatShareProfile.findOne({ user: userId }),
        this.location.find(),
        this.state.find(),
        this.amenities.find(),
        this.services.find(),
      ]);

      res.status(200).json({
        user_data: {
          user,
          user_settings: userSettings,
          user_info: userInfo,
          flat_share_profile: flatShareProfile,
        },
        options: {
          locations,
          states,
          amenities,
          services,
        },
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

}

export default UsersController;
