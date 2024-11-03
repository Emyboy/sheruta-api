import { Response, NextFunction } from "express";
import walletModel from "@/modules/wallet/wallet.model";
import { HttpException } from "@exceptions/HttpException";
import { RequestWithUser } from "@/modules/auth/auth.interface";

export const validateCredit = (requiredAmount: number) => async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const userId = req._user._id;
    const userWallet = await walletModel.findOne({ user: userId });

    if (!userWallet) {
      return next(new HttpException(404, "Wallet not found for the user"));
    }

    if (userWallet.total_credit < requiredAmount) {
      console.log('WHAT THEY HAVE :::', {
        total_credit: userWallet.total_credit,
        requiredAmount
      });
      return next(new HttpException(400, `Insufficient credits. Required: ${requiredAmount}, Available: ${userWallet.total_credit}`));
    }

    userWallet.total_credit -= requiredAmount;
    await userWallet.save();

    next();
  } catch (error) {
    next(new HttpException(500, "Error validating and deducting credits"));
  }
};
