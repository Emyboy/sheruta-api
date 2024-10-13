import { config } from 'dotenv';
config({ path: `.env` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { CLIENT_URL, SMTP_USER, SMTP_PASS, NODE_ENV, PORT, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN } =
  process.env;
export enum NotificationTypes {
  DEFAULT = 'default',
  PROFILE_VIEW = 'profile_view',
  REQUEST_VIEW = 'request_view',
  CALL = 'call'
}
