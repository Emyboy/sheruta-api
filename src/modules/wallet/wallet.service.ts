import { HttpException } from "@/exceptions/HttpException";
import transactionModel, { TransactionType } from "./transactions/transactions.model";
import walletModel from "./wallet.model";

export default class WalletService {
  private wallet = walletModel;
  private transaction = transactionModel;

  public deductCredit = async ({ user_id, amount }: { user_id: string; amount: number }) => {
    const wallet = await this.wallet.findOne({ user: user_id });
    if (!wallet) {
      throw new HttpException(404, "Wallet not found");
    }

    if (wallet.total_credit < amount) {
      throw new HttpException(400, "Insufficient funds");
    }

    wallet.total_credit -= amount;

    await wallet.save();

    await this.transaction.create({
      amount,
      transaction_id: new Date().getTime().toString(),
      user: user_id,
      wallet: wallet._id,
      type: TransactionType.CREDIT,
    });
  }
}
