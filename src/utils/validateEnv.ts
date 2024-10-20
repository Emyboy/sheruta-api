import { cleanEnv, port, str } from "envalid";
import dotenv from "dotenv";

dotenv.config({ path: `.env` });

const validateEnv = () => {
  // console.log('ALL ENVS:::', Object.keys(process.env))
  cleanEnv(process.env, {
    NODE_ENV: str(),
    MONGODB_URI: str(),
    PORT: port(),
  });
};

export default validateEnv;
