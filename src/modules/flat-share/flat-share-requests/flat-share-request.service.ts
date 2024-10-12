import { HttpException } from "@/exceptions/HttpException";
import flatShareProfileModel from "../flat-share-profile/flat-share-profile.model";
import { CreateHostRequestDTO, CreateSeekerRequestDTO } from "./flat-share-request.dto";
import FlatShareRequestModel, { AvailabilityStatus, FlatShareRequest } from "./flat-share-request.model";
import { User } from "@/modules/users/users.interface";
import userInfoModel from "@/modules/user-info/user-info.model";
import { sendEmail } from "@/utils/email";
import { logger } from "@/utils/logger";

export default class FlatShareRequestService {
  private flatShareRequest = FlatShareRequestModel;
  private flatShareProfile = flatShareProfileModel;
  private userInfo = userInfoModel;

  public createSeekerRequest = async ({ data, user }: { data: CreateSeekerRequestDTO, user: User }): Promise<FlatShareRequest> => {
    const flatShareProfile = await this.flatShareProfile.findOne({ user: user._id });
    const userInfo = await this.userInfo.findOne({ user: user._id });

    if (!flatShareProfile || !userInfo) {
      throw new HttpException(404, "Incomplete user data");
    }

    const flatShareRequest = await this.flatShareRequest.create({
      ...data,
      user: user._id,
      flat_share_profile: flatShareProfile._id,
      user_info: userInfo._id,
      seeking: true
    });

    this.broadcastRequest(flatShareRequest._id);

    return flatShareRequest;
  }

  public createHostRequest = async ({ data, user }: { data: CreateHostRequestDTO, user: User }): Promise<FlatShareRequest> => {
    const flatShareProfile = await this.flatShareProfile.findOne({ user: user._id });
    const userInfo = await this.userInfo.findOne({ user: user._id });

    if (!flatShareProfile || !userInfo) {
      throw new HttpException(404, "Incomplete user data");
    }

    const flatShareRequest = await this.flatShareRequest.create({
      ...data,
      user: user._id,
      flat_share_profile: flatShareProfile._id,
      user_info: userInfo._id,
      seeking: false,
      availability_status: AvailabilityStatus.AVAILABLE
    });

    this.broadcastRequest(flatShareRequest._id);

    return flatShareRequest;
  }

  public broadcastRequest = async (request_id: string) => {
    try {
      const request = await this.flatShareRequest.findById(request_id).populate('user').populate('location');

      if (!request) {
        throw new HttpException(404, "Request not found");
      }

      if (request.seeking) {
        const hosts = await this.flatShareProfile.find({
          seeking: false
        })
          .populate('user')
          .populate('location')

        logger.info(`\n\n Broadcasting request to ${hosts.length} hosts\n\n`);

        hosts.forEach(async (host) => {
          // email hosts
          if (host.user.email) {
            sendEmail({
              to: host.user.email,
              subject: 'Flat Share Request',
              html: `${request.user.first_name || 'Someone'} is looking for a flat in ${(request.location.name as any).name || 'Nigeria'}`,
            })
          }
        });
      } else {
        const seekers = await this.flatShareProfile.find({
          seeking: false
        })
          .populate('user')
          .populate('location')
        console.info(`\n\n Broadcasting flat to ${seekers.length} seekers\n\n`);

        seekers.forEach(async (seeker) => {
          // email seekers
          if (seeker.user.email) {
            sendEmail({
              to: seeker.user.email,
              subject: `Available flat in ${request.location.name as string || 'Nigeria'}`,
              html: `${(request.user as any).first_name || 'Someone'} has a flat in ${request.location.name as string || 'Nigeria'}`,
            })
          }
        });
      }
    } catch (error) {
      logger.error("BROADCAST FLAT ERROR::::", error);
      return Promise.reject(error);
    }

  }

}
