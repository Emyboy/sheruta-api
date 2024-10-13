import { UpdateFlatShareProfileDTO } from "./flat-sahre-profile.dto";
import flatShareProfileModel from "./flat-share-profile.model";

export default class FlatShareProfileService {
  private flatShareProfile = flatShareProfileModel;

  public update = async ({ data, user_id }: { user_id: string; data: UpdateFlatShareProfileDTO; }) => {
    let flatShareProfile = await this.flatShareProfile.findOneAndUpdate({ user: user_id }, { ...data }, { new: true });

    return flatShareProfile;
  }

}
