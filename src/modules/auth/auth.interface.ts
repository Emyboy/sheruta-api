import { Request } from "express";
import { User } from "@/modules/users/users.interface";

export interface DataStoredInToken {
  _id: string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  _user: User;
}
