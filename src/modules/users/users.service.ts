import userModel from "@/modules/users/users.model";
import { UpdateUserDTO } from "./users.dto";
import { User } from "./users.interface";
import flatShareProfileModel, {
  FlatShareProfile,
} from "../flat-share/flat-share-profile/flat-share-profile.model";
import userInfoModel, { UserInfo } from "../user-info/user-info.model";
import userSettingModel, {
  UserSettings,
} from "../user-settings/user-settings.model";
import { HttpException } from "@/exceptions/HttpException";
import NotificationService from "../notifications/notifications.service";
import { NotificationTypes } from "@/config";

class UserService {
  public users = userModel;
  public flatShareProfile = flatShareProfileModel;
  public user_info = userInfoModel;
  public user_settings = userSettingModel;
  private notifications = new NotificationService();

  public update = async (
    { data, user_id }: { user_id: string; data: UpdateUserDTO },
  ) => {
    try {
      const findAllUsersData = await this.users.findOneAndUpdate(
        { _id: user_id },
        { ...data },
        { new: true },
      );
      return findAllUsersData;
    } catch (error) {
      throw error;
    }
  };

  public getUserProfile = async (
    { profile_id, user_id }: { profile_id: string; user_id?: string | null },
  ): Promise<{
    user: User;
    flat_share_profile: FlatShareProfile;
    user_info: UserInfo;
    user_settings: UserSettings;
  }> => {
    try {
      const user = await this.users.findOne({ _id: profile_id });

      if (!user) {
        throw new HttpException(404, "user not found");
      }

      const flat_share_profile = await this.flatShareProfile.findOne({
        user: profile_id,
      }).populate("location").populate("state").populate("interests").populate(
        "habits",
      ).populate("work_industry");
      const user_info = await this.user_info.findOne({ user: profile_id });
      const user_settings = await this.user_settings.findOne({
        user: profile_id,
      });

      if (user_id && user_id !== profile_id) {
        this.notifications.create({
          sender_id: user_id,
          receiver_id: profile_id,
          type: NotificationTypes.PROFILE_VIEW,
          delayBy: {
            count: 4,
            unit: "hours",
          }
        });
      }

      return { user, flat_share_profile, user_info, user_settings };
    } catch (error) {
      throw error;
    }
  };
}

export default UserService;
