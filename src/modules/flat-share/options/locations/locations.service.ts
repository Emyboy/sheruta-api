import locationModel from "./locations.model";

export default class LocationService {
  private locationsModel = locationModel;

  public increaseRank = async (location_id: string) => {
    await this.locationsModel.findByIdAndUpdate(location_id, {
      $inc: { rank: 1 },
    });

    await this.locationsModel.updateMany(
      { _id: { $ne: location_id } },
      { $inc: { rank: -1 } }
    );

    await this.locationsModel.updateMany(
      { rank: { $lt: 0 } },
      { $set: { rank: 0 } }
    );
  };
}
