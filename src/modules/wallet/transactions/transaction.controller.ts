import { RequestWithUser } from "@/modules/auth/auth.interface";
import { NextFunction, Response } from "express";
import axios from "axios";
import transactionModel, { TransactionType } from "./transactions.model";
import walletModel from "../wallet.model";

export default class TransactionController {
  private transactions = transactionModel;
  private wallet = walletModel;

  public validatePaystackTransaction = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { email } = req._user;
      const { transaction_id: paymentRef, amount, type } = req.body;

      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${paymentRef}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          },
        },
      );

      const { status, data } = response.data;

      if (
        status === "success" && data.amount === amount &&
        data.customer.email === email
      ) {
        await transactionModel.create({
          amount: data.amount,
          transaction_id: paymentRef,
          user: req._user._id,
        });

        const wallet = await this.wallet.findById(req._user._id);

        if (wallet) {
          await this.transactions.create({
            user: req._user._id,
            amount,
            type,
            wallet: wallet._id,
          });
          switch (type) {
            case TransactionType.DEFAULT:
              wallet.total_deposit += data.amount;
              await wallet.save();
              break;
            case TransactionType.CREDIT:
              wallet.total_credit += data.amount;
              await wallet.save();
              break;
          }
        }

        res.status(200).json({
          message: "Transaction validated and recorded successfully",
          data: response?.data?.data,
        });
      } else {
        res.status(200).json({
          message: "Transaction wasn't found",
          data: null,
        });
      }
    } catch (error) {
      console.log("TRANSACTION VERIFICATION ERROR::", error);
      next(error);
    }
  };
}
