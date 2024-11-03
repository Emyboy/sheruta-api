import { HttpException } from "@/exceptions/HttpException";
import FlatShareRequestModel from "../flat-share/flat-share-requests/flat-share-request.model";
import reservationModel, {
  ReservationStatus,
  ReservationType,
} from "./reservations.model";
import { addDays } from "date-fns";

export default class ReservationService {
  private reservation = reservationModel;
  private flatShareRequest = FlatShareRequestModel;

  public createRequestReservation = async (
    { request_id, user_id, days }: {
      request_id: string;
      user_id: string;
      days: number;
    },
  ) => {
    const theRequest = await this.flatShareRequest.findById(request_id);

    await this.reservation.create({
      request: theRequest._id,
      user: user_id,
      endDate: addDays(new Date(), days),
      type: ReservationType.SPACE,
    });

    if (!theRequest) {
      throw new HttpException(404, "Request not found");
    }
  };

  public settReservationsAsExpired = async () => {
    await this.reservation.updateMany(
      { endDate: { $lt: new Date() } },
      { $set: { status: ReservationStatus.EXPIRED } },
    );
  };

  public getUserReservation = async (user_id: string) => {
    return this.reservation.find({ user: user_id });
  };
}
