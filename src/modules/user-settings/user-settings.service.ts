import userSettingModel from "./user-settings.model";

export default class UserSettingsService {
  private userSettings = userSettingModel;

  public updateSettings = async (
    { data, user_id }: { user_id: string; data: any },
  ) => {
    let userSettings = await this.userSettings.findOneAndUpdate(
      { user: user_id },
      { ...data },
      { new: true },
    );

    return userSettings;
  };
}
