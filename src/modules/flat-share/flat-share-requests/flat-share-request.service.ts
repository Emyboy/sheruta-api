import { HttpException } from "@/exceptions/HttpException";
import flatShareProfileModel from "../flat-share-profile/flat-share-profile.model";
import { CreateHostRequestDTO, CreateSeekerRequestDTO } from "./flat-share-request.dto";
import FlatShareRequestModel, { AvailabilityStatus, FlatShareRequest } from "./flat-share-request.model";
import { User } from "@/modules/users/users.interface";
import userInfoModel from "@/modules/user-info/user-info.model";
import { sendEmail } from "@/utils/email";
import { logger } from "@/utils/logger";
import { hostToSeekerContent, seekerToHostContent } from "./flat-share-request.content";

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
          // if (request.user.email.trim() == host.user.email) {
          //   return;
          // }
          if (host.user.email) {
            sendEmail({
              to: host.user.email,
              subject: `New ${request.location.name} Flat Share Request`,
              html: seekerToHostContent({requestData: request, seekerData: request.user})
            })
          }
        });
      } else {
        const seekers = await this.flatShareProfile.find({
          seeking: true
        })
          .populate('user')
          .populate('location')
        console.info(`\n\n Broadcasting flat to ${seekers.length} seekers\n\n`);

        seekers.forEach(async (seeker) => {
          // email seekers
          // if (request.user.email.trim() == seeker.user.email) {
          //   return;
          // }
          if (seeker.user.email) {
            sendEmail({
              to: seeker.user.email,
              subject: `Available flat in ${request.location.name as string || 'Nigeria'}`,
              html: hostToSeekerContent({requestData: request, hostData: request.user})
            })
          }
        });
      }
    } catch (error) {
      logger.error("BROADCAST FLAT ERROR::::", error);
      return Promise.reject(error);
    }

  }

  public getRequestDetails = async (request_id: string): Promise<FlatShareRequest> => {
    const request = await this.flatShareRequest.findById(request_id)
      .populate('user')
      .populate('user_info')
      .populate('flat_share_profile')
      .populate('location')
      .populate('service')
      .populate('category')
      .populate('amenities')
      .populate('property_type')
      .populate('state');

      await this.flatShareRequest.findByIdAndUpdate(request_id, { $inc: { view_count: 1 } });

    if (!request) {
      throw new HttpException(404, "Request not found");
    }

    return request;
  }

}
