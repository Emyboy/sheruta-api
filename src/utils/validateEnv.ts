import { cleanEnv, port, str } from "envalid";
import dotenv from "dotenv";

dotenv.config({ path: `.env` });

const validateEnv = () => {
  // console.log('ALL ENVS:::', Object.keys(process.env))
  cleanEnv(process.env, {
    NODE_ENV: str(),
    CLIENT_URL: str(),
    SMTP_USER: str(),
    SMTP_PASS: str(),
    PAYSTACK_SECRET_KEY: str(),
    MONGODB_URI: str(),
    PORT: port(),
  });
};

export default validateEnv;
