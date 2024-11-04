import { HttpException } from "@/exceptions/HttpException";
import FlatShareRequestModel from "../flat-share/flat-share-requests/flat-share-request.model";
import reservationModel, {
  ReservationStatus,
  ReservationType,
} from "./reservations.model";
import { addDays } from "date-fns";
import { sendEmail } from "@/utils/email";
import { spaceReservedEmailContent } from "./reservation.content";
import userModel from "../users/users.model";

export default class ReservationService {
  private reservation = reservationModel;
  private flatShareRequest = FlatShareRequestModel;
  private users = userModel;

  public createRequestReservation = async (
    { request_id, user_id, days }: {
      request_id: string;
      user_id: string;
      days: number;
    },
  ) => {
    const theRequest = await this.flatShareRequest.findById(request_id)
      .populate("user");
    if (!theRequest) {
      throw new HttpException(404, "Request not found");
    }

    const seeker = await this.users.findById(user_id);
    const host = await this.users.findById(theRequest.user._id);

    await this.reservation.create({
      request: theRequest._id,
      user: user_id,
      endDate: addDays(new Date(), days),
      type: ReservationType.SPACE,
    });

    await sendEmail({
        subject: `Your Space Has Been Reserved by ${seeker.first_name}`,
        to: host.email.trim().toLowerCase(),
        html: spaceReservedEmailContent({
          host,
          seeker
        }),
      });

  };

  public settReservationsAsExpired = async () => {
    await this.reservation.updateMany(
      { endDate: { $lt: new Date() } },
      { $set: { status: ReservationStatus.EXPIRED } },
    );
  };

  public getUserReservation = async (user_id: string) => {
    return this.reservation.find({ user: user_id }).populate('user').populate('request');
  };
}
