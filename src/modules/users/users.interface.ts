export interface User {
  _id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email_verified: boolean;
  email: string;
  last_seen?: Date;
  avatar_url?: string;
  auth_provider: 'google' | 'facebook' | 'local';
  account_status: 'active' | 'suspended' | 'deactivated';
  token: string;
  token_expiry: Date;
}
