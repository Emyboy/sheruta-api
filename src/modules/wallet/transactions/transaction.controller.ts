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
      const { transaction_id: paymentRef, amount, type } = req.body;

      if (!type || !amount || !paymentRef) {
        return res.status(400).json({
          message: "Invalid transaction data",
          data: null,
        });
      }
      const wallet = await this.wallet.findOne({ user: req._user._id });

      const existingTransaction = await this.transactions.findOne({
        transaction_id: paymentRef,
      });

      if (existingTransaction) {
        return res.status(400).json({
          message: "Transaction already validated",
          data: wallet,
        });
      }

      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${paymentRef}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          },
        },
      );

      const { status, data } = response.data;

      console.log("INCOMING :::", {
        status,
        amount,
        paymentRef,
        type,
      });

      if (status === true && data.status === "success") {
        if (wallet) {
          await this.transactions.create({
            user: req._user._id,
            amount,
            type,
            wallet: wallet._id,
            transaction_id: paymentRef,
          });

          switch (type) {
            case TransactionType.DEFAULT:
              wallet.total_deposit += Number(amount);
              await wallet.save();
              break;
            case TransactionType.CREDIT:
              wallet.total_credit += Number(amount);
              await wallet.save();
              break;
          }
        }

        res.status(200).json({
          message: "Transaction validated and recorded successfully",
          data: wallet,
        });
      } else {
        res.status(404).json({
          message: "Transaction verification failed",
          data: null,
        });
      }
    } catch (error) {
      console.log("TRANSACTION VERIFICATION ERROR::", error);
      next(error);
    }
  };
}
