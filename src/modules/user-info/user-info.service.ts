import { HttpException } from "@/exceptions/HttpException";
import userModel from "../users/users.model";
import userInfoModel from "./user-info.model";

export default class UserInfoService {
  private userInfo = userInfoModel;
  private user = userModel;

  public update = async ({ data, user_id }: { user_id: string; data: any; }) => {
    let user = await this.user.findById(user_id);

    if (!user) throw new HttpException(404, 'User not found');

    let update = await this.userInfo.findOneAndUpdate({ user: user_id }, { ...data }, { new: true });

    return update

  }

  public completeKYC = async ({ user_id }: { user_id: string; }) => {
    let user = await this.user.findById(user_id);
    let userInfo = await this.userInfo.findOne({ user: user_id });

    if (!user || !userInfo) throw new HttpException(404, 'User not found');

    let update = await this.userInfo.findOneAndUpdate({ user: user_id }, { done_kyc: true }, { new: true });

    return update
  }

}

