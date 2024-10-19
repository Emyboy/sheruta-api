import { SECRET_KEY } from "@/config";
import { DataStoredInToken } from "@/modules/auth/auth.interface";
import { Request } from "express";
import { verify } from "jsonwebtoken";
import mongoose from "mongoose";

export async function getUserIDFromHeaders(
  req: Request,
): Promise<mongoose.Types.ObjectId | null> {
  let Authorization = req.cookies["Authorization"] ||
    (req.header("Authorization")
      ? req.header("Authorization").split("Bearer ")[1]
      : null);

  if (Authorization) {
    const secretKey: string = SECRET_KEY;
    const verificationResponse =
      (await verify(Authorization, secretKey)) as DataStoredInToken;
    const userId = new mongoose.Types.ObjectId(verificationResponse._id);
    return userId;
  } else {
    return null;
  }
}
