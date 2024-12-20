import { config } from "dotenv";
config({ path: `.env` });

export const CREDENTIALS = process.env.CREDENTIALS === "true";
export const {
  CLIENT_URL,
  SMTP_USER,
  SMTP_PASS,
  NODE_ENV,
  PORT,
  SECRET_KEY,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
  MONGODB_URI,
} = process.env;
export enum NotificationTypes {
  DEFAULT = "default",
  PROFILE_VIEW = "profile_view",
  REQUEST_VIEW = "request_view",
  CALL = "call",
  MESSAGE = "message",
}
export const creditTable = {
  CREATE_CONVERSATION: 300,
  SPACE_RESERVATION: 5000,
  VIRTUAL_INSPECTION: 1000,
  ID_VERIFICATION: 500,
  CALL: 100,
  PROMOTION: 100
}
