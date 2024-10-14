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
import workIndustryModel from '../flat-share/options/work_industry/work-industry.model';
import walletModel from '../wallet/wallet.model';
import categoriesModel from '../flat-share/options/categories/categories.model';
import habitsModel from '../flat-share/options/habits/habits.model';
import interestModel from '../flat-share/options/interests/interests.model';
import propertyTypesModel from '../flat-share/options/property_types/property-types.model';
import notificationsModel from '../notifications/notifications.model';


class UsersController {
  public userService = new userService();
  public userSettings = userSettingModel;
  public user = userModel;
  public userInfo = userInfoModel;
  public flatShareProfile = flatShareProfileModel;
  private wallet = walletModel;
  private habits = habitsModel;
  private interests = interestModel;
  private notifications = notificationsModel;

  //options
  public amenities = amenitiesModel;
  public services = servicesModel;
  public location = locationModel;
  public state = stateModel;
  public workIndustry = workIndustryModel;
  public categories = categoriesModel;
  public propertyTypes = propertyTypesModel;

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

  public getUserProfile = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { user_id } = req.params;
      const user = await this.userService.getUserProfile(user_id);
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }

  public getUserDependencies = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);

      let response:any = {
        user_data: null,
      }

      if(Authorization) {
        const secretKey: string = SECRET_KEY;
        const verificationResponse = (await verify(Authorization, secretKey)) as DataStoredInToken;
        const userId = new mongoose.Types.ObjectId(verificationResponse._id);

        this.user.findOneAndUpdate({ _id: userId }, { last_seen: new Date().toJSON() })

        const [user, userSettings, userInfo, flatShareProfile, wallet, notifications] = await Promise.all([
          this.user.findById(userId),
          this.userSettings.findOne({ user: userId }),
          this.userInfo.findOne({ user: userId }),
          this.flatShareProfile.findOne({ user: userId }),
          this.wallet.findOne({ user : userId }),
          this.notifications.find({ receiver: userId, read: false }).limit(20).sort({ createdAt: -1 }),
        ]);
        response.user_data = {
          user,
          user_settings: userSettings,
          user_info: userInfo,
          flat_share_profile: flatShareProfile,
          wallet,
          notifications
        }
      }

      const [locations, states, amenities, services, categories, interests, habits, property_types, work_industries] = await Promise.all([
        this.location.find(),
        this.state.find(),
        this.amenities.find(),
        this.services.find(),
        this.categories.find(),
        this.interests.find(),
        this.habits.find(),
        this.propertyTypes.find(),
        this.workIndustry.find(),
      ]);

      res.status(200).json({
        ...response,
        options: {
          locations,
          states,
          amenities,
          services,
          categories,
          interests,
          habits,
          property_types,
          work_industries
        },
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

}

export default UsersController;
