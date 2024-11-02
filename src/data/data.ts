import fs from "fs";
import path from "path";
import { parse } from "csv-parse";
import userModel from "@/modules/users/users.model";
import userSettingModel from "@/modules/user-settings/user-settings.model";
import userInfoModel from "@/modules/user-info/user-info.model";
import flatShareProfileModel from "@/modules/flat-share/flat-share-profile/flat-share-profile.model";
import userSecretsModel from "@/modules/users/users-secrets/user-secrets.model";

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

export const extractUsersCSV = () => {
  const usersFilePath = path.resolve(__dirname, "./users.csv");

  fs.readFile(usersFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading users.csv:", err);
      return;
    }

    parse(data, { columns: true, trim: true }, (parseErr, records: any[]) => {
      if (parseErr) {
        console.error("Error parsing CSV:", parseErr);
        return;
      }

      // console.log("Users data:", records);

      extractUserInfoCSV(records);
    });
  });
};

const extractUserInfoCSV = (csvUsers: CSVUser[]) => {
 try {
   const userInfoFilePath = path.resolve(__dirname, "./user-infos.csv");

  fs.readFile(userInfoFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading user-info.csv:", err);
      return;
    }

    parse(data, { columns: true, trim: true }, (parseErr, records: any[]) => {
      if (parseErr) {
        console.error("Error parsing CSV:", parseErr);
        return;
      }

      // console.log("User info data:", records);

      const csvUserInfos: CSVUserInfo[] = records;

      console.log('CREATING USERS:::', csvUsers.length);


      csvUsers.forEach(async (csvUser) => {
        const oldUserInfo = csvUserInfos.find(info => info.id.trim() === csvUser.id.trim());

        if(!csvUser.email || !csvUser.email || !csvUser.password || csvUser.confirmed !== "true" || !oldUserInfo || csvUser.confirmed !== "true") return;


        const newUser = await userModel.create({
          first_name: String(csvUser.first_name).toLocaleLowerCase().trim(),
          middle_name: csvUser.middle_name?.trim() || null,
          last_name: String(csvUser.last_name).toLocaleLowerCase().trim(),
          email: csvUser.email.toLowerCase().trim(),
          // avatar_url: csvUser.avatar_url,
          email_verified: csvUser.confirmed === "true",
          account_status: csvUser.is_verified === "active",
          auth_provider: "local",
        });


      //   await userSecretsModel.create({
      //     user: newUser._id,
      //     nin: oldUserInfo.nin,
      //     password: csvUser.password,
      //   })

      //   const newUserSettings = await userSettingModel.create({
      //     user: newUser._id,
      //   });

      //   const newUserInfo = await userInfoModel.create({
      //     user: newUser._id,
      //     date_of_birth: oldUserInfo?.date_of_birth,
      //     done_kyc: csvUser.is_verified === "true",
      //     gender: oldUserInfo.gender === "m" ? "male" : "female",
      //     is_verified: csvUser.is_verified === "true",
      //     primary_phone_number: oldUserInfo.phone_number.trim() || csvUser.phone_number.trim(),
      //   })

      //  await flatShareProfileModel.create({
      //     user: newUser._id,
      //     user_info: newUserInfo._id,
      //     user_settings: newUserSettings._id,
      //     bio: csvUser.bio,
      //     budget: Number(csvUser.budget),
      //     seeking: oldUserInfo.looking_for === "true",
      //     verified: csvUser.is_verified === "true",
      //     tiktok: oldUserInfo.instagram,
      //     twitter: oldUserInfo.twitter,
      //     instagram: oldUserInfo.instagram,
      //     company_name: oldUserInfo.company_name,
      //     company_address: oldUserInfo.company_address,
      //     supervisor_name: oldUserInfo.supervisor_name,
      //     supervisor_number: oldUserInfo.supervisor_number,
      //     state_of_origin: oldUserInfo.stateOfOrigin,
      //   })

      });


    });
  });
 } catch (error) {
  console.log('TRANSPORT ERROR:::', error);
 }
};
