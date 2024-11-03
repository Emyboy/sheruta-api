import { HttpException } from "@/exceptions/HttpException";
import FlatShareRequestModel from "../flat-share/flat-share-requests/flat-share-request.model";
import reservationModel from "./reservations.model";

export default class ReservationService {
  private reservation = reservationModel;
  private flatShareRequest = FlatShareRequestModel;

  public createRequestReservation = async (
    { request_id, user_id, days }: { request_id: string; user_id: string; days: number; },
  ) => {
    const theRequest = await this.flatShareRequest.findById(request_id);

    if(!theRequest) {
      throw new HttpException(404, "Request not found");
    }
  };
}
