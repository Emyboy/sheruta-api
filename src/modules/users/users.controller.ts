import { NextFunction, Response } from 'express';
import userService from '@/modules/users/users.service';
import { RequestWithUser } from '../auth/auth.interface';
import userSettingModel from '../user-settings/user-settings.model';
import userModel from './users.model';
import userInfoModel from '../user-info/user-info.model';
import flatShareProfileModel from '../flat-share/flat-share-profile/flat-share-profile.model';
import amenitiesModel from '../flat-share/options/amenities/amenities.model';
import servicesModel from '../flat-share/options/services/services.model';
import locationModel from '../flat-share/options/locations/locations.model';
import stateModel from '../flat-share/options/state/state.model';

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
      const { _user } = req;

      let user = null;
      let user_settings = null;
      let user_info = null;
      let flat_share_profile = null;

      if (_user) {
        user = await this.user.findById(_user._id);
        user_settings = await this.userSettings.findOne({ user: _user._id });
        user_info = await this.userInfo.findOne({ user: _user._id });
        flat_share_profile = await this.flatShareProfile.findOne({ user: _user._id });
      }

      const locations = await this.location.find();
      const states = await this.state.find();
      const amenities = await this.amenities.find();
      const services = await this.services.find();


      res.status(200).json({
        user_data: {
          user,
          user_settings,
          user_info,
          flat_share_profile,
        },
        options: {
          locations,
          states,
          amenities,
          services
        }
      });
    } catch (error) {
      console.log(error)
      next(error);

    }
  }

}

export default UsersController;
