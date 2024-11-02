import { addDays } from "date-fns";
import UserService from "../users/users.service";
import promotionModel, { PromotionType } from "./promotions.model";
import WalletService from "../wallet/wallet.service";
import { creditTable } from "@/config";
import { HttpException } from "@/exceptions/HttpException";
import FlatShareRequestModel from "../flat-share/flat-share-requests/flat-share-request.model";

export default class PromotionService {
  private userService = new UserService();
  private wallet = new WalletService();
  private request = FlatShareRequestModel;

  public promoteProfile = async (
    { days, user_id, pitch, service_id }: {
      user_id: string;
      days: number;
      pitch: string;
      service_id: string;
    },
  ) => {
    const profile = await this.userService.getUserProfile({
      profile_id: user_id,
    });

    const promotion = await promotionModel.create({
      user: user_id,
      user_info: profile.user_info._id,
      user_settings: profile.user_settings._id,
      flat_share_profile: profile.flat_share_profile._id,
      endDate: addDays(new Date(), days),
      type: PromotionType.PROFILE,
      location: profile.flat_share_profile.location._id,
      state: profile.flat_share_profile.state._id,
      pitch,
      service: service_id,
    });

    await this.wallet.deductCredit({
      amount: creditTable.PROMOTION * days,
      user_id: user_id,
    });

    //todo: send email to user interested in such profile

    return promotion;
  };

  public requestPromotion = async (
    { days, user_id, request_id }: {
      user_id: string;
      days: number;
      request_id: string;
    },
  ) => {
    const profile = await this.userService.getUserProfile({
      profile_id: user_id,
    });

    const request = await this.request.findById(request_id)
      .populate("service")
      .populate("location")
      .populate("state")

    if (!request) throw new HttpException(404, "Request not found");

    const promotion = await promotionModel.create({
      user: user_id,
      user_info: profile.user_info._id,
      user_settings: profile.user_settings._id,
      flat_share_profile: profile.flat_share_profile._id,
      endDate: addDays(new Date(), days),
      type: PromotionType.REQUEST,
      location: request.location._id,
      state: request.state._id,
      request: request._id,
      service: request.service._id,
    });

    await this.wallet.deductCredit({
      amount: creditTable.PROMOTION * days,
      user_id: user_id,
    });

    //todo: send email to user interested in such profile

    return promotion;
  };
}
