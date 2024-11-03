import { Document, model, Schema } from "mongoose";
import { FlatShareRequest } from "../flat-share/flat-share-requests/flat-share-request.model";
import { User } from "../users/users.interface";

export enum ReservationType {
  SPACE = "space",
  FURNITURE = "furniture",
}

export enum ReservationStatus {
  EXPIRED = 'expired',
  ACTIVE = 'active',
}

export interface Reservation extends Document {
  endDate: Date;
  request?: Schema.Types.ObjectId | FlatShareRequest;
  user?: Schema.Types.ObjectId | User;
  type: ReservationType;
  status: ReservationStatus;
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
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      require: true
    },
    status: {
      type: String,
      enum: Object.values(ReservationStatus),
      default: ReservationStatus.ACTIVE,
    },
  },
  {
    timestamps: true,
  },
);

const reservationModel = model<Reservation>("Reservations", reservationSchema);

export default reservationModel;
