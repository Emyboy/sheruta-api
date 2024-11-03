import fs from "fs/promises";
import path from "path";
import { parse } from "csv-parse";
import userModel from "@/modules/users/users.model";
import userSettingModel from "@/modules/user-settings/user-settings.model";
import userInfoModel from "@/modules/user-info/user-info.model";
import flatShareProfileModel from "@/modules/flat-share/flat-share-profile/flat-share-profile.model";
import userSecretsModel from "@/modules/users/users-secrets/user-secrets.model";
import walletModel from "@/modules/wallet/wallet.model";

interface CSVUser {
  id: string;
  username: string;
  email: string;
  password: string;
  confirmed: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  bio: string;
  avatar_url: string;
  middle_name: string;
  created_at: string;
  is_verified: string;
  budget: string;
}

interface CSVUserInfo {
  id: string;
  company_name: string;
  company_address: string;
  supervisor_name: string;
  supervisor_number: string;
  twitter: string;
  facebook: string;
  linkedin: string;
  instagram: string;
  religion: string;
  gender: string;
  marital_status: string;
  nin: string;
  phone_number: string;
  occupation: string;
  users_permissions_user: string;
  created_at: string;
  looking_for_gender: string;
  looking_for: string;
  date_of_birth: string;
  looking_for_age_range: string;
  stateOfOrigin: string;
  nspokenlang: string;
}

const parseCSV = (data: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    parse(data, { columns: true, trim: true }, (err, records) => {
      if (err) reject(err);
      else resolve(records);
    });
  });
};

const createUser = async (csvUser: CSVUser, oldUserInfo: CSVUserInfo) => {
  try {

    if (!csvUser.email || !csvUser.password || !csvUser.last_name) {
      return false;
    }

    const newUser = await userModel.create({
      first_name: String(csvUser.first_name).toLowerCase().trim(),
      middle_name: csvUser?.middle_name?.trim() || null,
      last_name: String(csvUser.last_name).toLowerCase().trim(),
      email: csvUser.email.toLowerCase().trim(),
      email_verified: csvUser.confirmed === "true",
      account_status: "active",
      auth_provider: "local",
    });

    console.log('CREATED USER:::', newUser.email);

    await userSecretsModel.create({
      user: newUser._id,
      nin: oldUserInfo.nin || null,
      password: csvUser.password,
    });

    const newUserSettings = await userSettingModel.create({
      user: newUser._id,
    });

    const newUserInfo = await userInfoModel.create({
      user: newUser._id,
      date_of_birth: oldUserInfo?.date_of_birth,
      done_kyc: csvUser.is_verified === "true",
      gender: oldUserInfo.gender === "m" ? "male" : "female",
      is_verified: csvUser.is_verified === "true",
      primary_phone_number: oldUserInfo.phone_number.trim() || csvUser.phone_number.trim(),
    });

    await walletModel.create({
      user: newUser._id,
    })

    await flatShareProfileModel.create({
      user: newUser._id,
      user_info: newUserInfo._id,
      user_settings: newUserSettings._id,
      bio: csvUser.bio,
      budget: Number(csvUser.budget),
      seeking: oldUserInfo.looking_for === "true",
      tiktok: oldUserInfo.instagram,
      twitter: oldUserInfo.twitter,
      instagram: oldUserInfo.instagram,
      company_name: oldUserInfo.company_name,
      company_address: oldUserInfo.company_address,
      supervisor_name: oldUserInfo.supervisor_name,
      supervisor_number: oldUserInfo.supervisor_number,
      state_of_origin: oldUserInfo.stateOfOrigin,
    });

    return true;
  } catch (error) {
    console.error('Error creating user:', csvUser.email, error);
    return false;
  }
};

const processBatch = async (batch: CSVUser[], userInfos: CSVUserInfo[]) => {
  const promises = batch.map(async (csvUser) => {
    const oldUserInfo = userInfos.find(info => info.id.trim() === csvUser.id.trim());

    if (!csvUser.email || !csvUser.password || csvUser.confirmed !== "true" ||
        !oldUserInfo || !csvUser.last_name || !csvUser.is_verified) {
      return false;
    }

    return createUser(csvUser, oldUserInfo);
  });

  return Promise.all(promises);
};

export const extractUsersCSV = async () => {
  try {
    const usersFilePath = path.resolve(__dirname, "./users.csv");
    const userInfoFilePath = path.resolve(__dirname, "./user-infos.csv");

    const [usersData, userInfosData] = await Promise.all([
      fs.readFile(usersFilePath, "utf8"),
      fs.readFile(userInfoFilePath, "utf8")
    ]);

    const [users, userInfos] = await Promise.all([
      parseCSV(usersData),
      parseCSV(userInfosData)
    ]);

    const BATCH_SIZE = 10;
    const csvUsers = users as CSVUser[];
    const csvUserInfos = userInfos as CSVUserInfo[];

    for (let i = 0; i < csvUsers.length; i += BATCH_SIZE) {
      const batch = csvUsers.slice(i, i + BATCH_SIZE);
      await processBatch(batch, csvUserInfos);
      console.log(`Processed batch ${i / BATCH_SIZE + 1} of ${Math.ceil(csvUsers.length / BATCH_SIZE)} `);
      console.log('Total number of users :::', users.length);
    }

    console.log('CSV import completed successfully');
  } catch (error) {
    console.error('Error processing CSV:', error);
  }
};
