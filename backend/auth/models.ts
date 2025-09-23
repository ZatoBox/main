export type RoleUser = 'admin' | 'premium' | 'user';

export interface UserItem {
  id: string;
  full_name: string;
  email: string;
  password?: string | null;
  role?: RoleUser;
  phone?: string | null;
  profile_image?: string | null;
  polar_api_key?: string | null;
  polar_organization_id?: string | null;
  premium_up_to?: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
  phone?: string | null;
}

export interface UserInfo {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  address?: string | null;
  role: RoleUser;
  premium_up_to?: string | null;
  created_at: string;
  last_updated: string;
}
