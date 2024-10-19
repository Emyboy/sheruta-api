import { HttpException } from "@/exceptions/HttpException";
import flatShareProfileModel from "../flat-share-profile/flat-share-profile.model";
import {
  CreateHostRequestDTO,
  CreateSeekerRequestDTO,
} from "./flat-share-request.dto";
import FlatShareRequestModel, {
  AvailabilityStatus,
  FlatShareRequest,
} from "./flat-share-request.model";
import { User } from "@/modules/users/users.interface";
import userInfoModel from "@/modules/user-info/user-info.model";
import { sendEmail } from "@/utils/email";
import { logger } from "@/utils/logger";
import {
  hostToSeekerContent,
  seekerToHostContent,
} from "./flat-share-request.content";
import NotificationService from "@/modules/notifications/notifications.service";
import { NotificationTypes } from "@/config";
import servicesModel from "../options/services/services.model";
import locationModel from "../options/locations/locations.model";
import stateModel from "../options/state/state.model";

export default class FlatShareRequestService {
  private flatShareRequest = FlatShareRequestModel;
  private flatShareProfile = flatShareProfileModel;
  private userInfo = userInfoModel;
  private notifications = new NotificationService();
  private services = servicesModel;
  private locations = locationModel;
  private states = stateModel;

  public createSeekerRequest = async (
    { data, user }: { data: CreateSeekerRequestDTO; user: User },
  ): Promise<FlatShareRequest> => {
    const flatShareProfile = await this.flatShareProfile.findOne({
      user: user._id,
    });
    const userInfo = await this.userInfo.findOne({ user: user._id });

    if (!flatShareProfile || !userInfo) {
      throw new HttpException(404, "Incomplete user data");
    }

    const flatShareRequest = await this.flatShareRequest.create({
      ...data,
      user: user._id,
      flat_share_profile: flatShareProfile._id,
      user_info: userInfo._id,
      seeking: true,
    });

    this.broadcastRequest(flatShareRequest._id);

    return flatShareRequest;
  };

  public createHostRequest = async (
    { data, user }: { data: CreateHostRequestDTO; user: User },
  ): Promise<FlatShareRequest> => {
    const flatShareProfile = await this.flatShareProfile.findOne({
      user: user._id,
    });
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
      availability_status: AvailabilityStatus.AVAILABLE,
    });

    this.broadcastRequest(flatShareRequest._id);

    return flatShareRequest;
  };

  //todo: test if this works
  public broadcastRequest = async (request_id: string) => {
    try {
      const request = await this.flatShareRequest
        .findById(request_id)
        .populate("user")
        .populate("location");

      if (!request) {
        throw new HttpException(404, "Request not found");
      }

      const userEmail = request.user.email.trim();

      if (request.seeking) {
        const hosts = await this.flatShareProfile.find({
          seeking: false,
          "user.email": { $ne: userEmail },
        })
          .populate("user")
          .populate("user_settings")
          .populate("location");

        logger.info(`\n\n Broadcasting request to ${hosts.length} hosts\n\n`);

        hosts.forEach(async (host) => {
          if (host?.user?.email && host?.user_settings?.flat_share_updates) {
            sendEmail({
              to: host.user.email,
              subject: `New ${request.location.name} Flat Share Request`,
              html: seekerToHostContent({
                requestData: request,
                seekerData: request.user,
              }),
            });
          }
        });
      } else {
        const seekers = await this.flatShareProfile.find({
          seeking: true,
          "user.email": { $ne: userEmail },
        })
          .populate("user")
          .populate("user_settings")
          .populate("location");

        console.info(`\n\n Broadcasting flat to ${seekers.length} seekers\n\n`);

        seekers.forEach(async (seeker) => {
          if (
            seeker?.user?.email && seeker?.user_settings?.flat_share_updates
          ) {
            sendEmail({
              to: seeker.user.email,
              subject: `Available flat in ${
                request.location.name as string || "Nigeria"
              }`,
              html: hostToSeekerContent({
                requestData: request,
                hostData: request.user,
              }),
            });
          }
        });
      }
    } catch (error) {
      logger.error("BROADCAST FLAT ERROR::::", error);
      return Promise.reject(error);
    }
  };

  public getRequestDetails = async (
    request_id: string,
    user_id?: string | undefined,
  ): Promise<FlatShareRequest> => {
    const request = await this.flatShareRequest.findById(request_id)
      .populate("user")
      .populate("user_info")
      .populate("flat_share_profile")
      .populate("location")
      .populate("service")
      .populate("category")
      .populate("amenities")
      .populate("property_type")
      .populate("payment_type")
      .populate("state");

    if (!request) {
      throw new HttpException(404, "Request not found");
    }

    await this.flatShareRequest.findByIdAndUpdate(request_id, {
      $inc: { view_count: 1 },
    });

    if (user_id) {
      this.notifications.create({
        sender_id: user_id,
        receiver_id: request.user._id,
        type: NotificationTypes.REQUEST_VIEW,
      });
    }

    return request;
  };

  public updateSeekerRequest = async (
    { request_id, data, user_id }: {
      request_id: string;
      data: CreateSeekerRequestDTO;
      user_id: string;
    },
  ): Promise<FlatShareRequest> => {
    const request = await this.flatShareRequest.findOne({
      _id: request_id,
      user: user_id,
    }).populate("user");

    if (!request) {
      throw new HttpException(404, "Request not found");
    }

    await this.flatShareRequest.findByIdAndUpdate(request_id, data);

    return this.flatShareRequest.findById(request_id);
  };

  public updateHostRequest = async (
    { request_id, data, user_id }: {
      request_id: string;
      data: CreateHostRequestDTO;
      user_id: string;
    },
  ): Promise<FlatShareRequest> => {
    const request = await this.flatShareRequest.findOne({
      _id: request_id,
      user: user_id,
    }).populate("user");

    if (!request) {
      throw new HttpException(404, "Request not found");
    }

    await this.flatShareRequest.findByIdAndUpdate(request_id, data);

    return this.flatShareRequest.findById(request_id);
  };

  public deleteRequest = async (
    { request_id, user_id }: {
      request_id: string;
      user_id: string;
      from_cron?: boolean;
    },
  ): Promise<FlatShareRequest> => {
    const request = await this.flatShareRequest.findOne({
      _id: request_id,
      user: user_id,
    });

    if (!request) {
      throw new HttpException(404, "Request not found");
    }

    //todo: send email to user that their request has been deleted if from cron

    return this.flatShareRequest.findByIdAndDelete(request_id);
  };

  public searchRequest = async (
    { budget, service, payment_type, location, state, page, limit }: {
      budget?: string;
      service?: string;
      payment_type?: string;
      location?: string;
      state?: string;
      page: number;
      limit: number;
    },
  ): Promise<any> => {
    let query: any = {};

    if (budget) {
      const [minBudget, maxBudget] = budget.split("-").map(Number);
      query.rent = { $gte: minBudget, $lte: maxBudget };
    }

    if (service) {
      const serviceDoc = await this.services.findOne({ slug: service }).select(
        "_id",
      );
      if (serviceDoc) {
        query.service = serviceDoc._id;
      }
    }

    if (payment_type) {
      query.payment_type = payment_type;
    }

    if (location) {
      const locationDoc = await this.locations.findOne({ slug: location })
        .select("_id");
      if (locationDoc) {
        query.location = locationDoc._id;
      }
    }

    if (state) {
      const stateDoc = await this.states.findOne({ slug: state }).select("_id");
      if (stateDoc) {
        query.state = stateDoc._id;
      }
    }

    const sort = { availability_status: 1, createdAt: -1 };

    const result = await this.flatShareRequest.paginate(query, {
      page,
      limit,
      sort,
      populate: [
        "user",
        "user_info",
        "flat_share_profile",
        "location",
        "service",
        "category",
        "amenities",
        "property_type",
        "state",
        "payment_type",
      ],
    });

    return result;
  };
}
