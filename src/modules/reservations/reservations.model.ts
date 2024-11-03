import { Document, model, Schema } from "mongoose";
import { FlatShareRequest } from "../flat-share/flat-share-requests/flat-share-request.model";

export enum ReservationType {
  SPACE = "space",
  FURNITURE = "furniture",
}

export interface Reservation extends Document {
  endDate: Date;
  request?: Schema.Types.ObjectId | FlatShareRequest;
  type: ReservationType;
}

const reservationSchema: Schema = new Schema<Reservation>(
  {
    endDate: {
      type: Date,
      required: true,
    },
    request: {
      type: Schema.Types.ObjectId,
      ref: "FlatShareRequests",
    },
    type: {
      type: String,
      enum: Object.values(ReservationType),
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const reservationModel = model<Reservation>("Reservations", reservationSchema);

export default reservationModel;
