export interface User {
  _id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email_verified: boolean;
  email: string;
  last_seen?: Date;
  avatar_url?: string;
  account_status: 'active' | 'suspended' | 'deactivated';
}
