// Cookies
export interface CookieOptions {
  path?: string;
  expires?: number | Date;
  secure?: boolean;
  sameSite?: 'lax' | 'strict' | 'none';
}
