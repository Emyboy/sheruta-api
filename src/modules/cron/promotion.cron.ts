import promotionModel, {
  PromotionStatus,
} from "../promotions/promotions.model";

export const cancelExpiredPromotions = async () => {
  try {
    const promotions = await promotionModel.find({
      endDate: { $lte: new Date() },
      status: PromotionStatus.ACTIVE,
    });
    if (promotions.length) {
      promotions.forEach(async (promotion) => {
        await promotionModel.findByIdAndUpdate(promotion._id, {
          status: PromotionStatus.EXPIRED,
        });
      });
    }
  } catch (error) {
    console.log("Error cancelling expired promotions:", error);
  }
};
