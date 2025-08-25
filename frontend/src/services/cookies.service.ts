import Cookies from 'js-cookie';
import { CookieOptions } from '@/types';

const TOKEN_KEY = 'zatobox_token';

const defaultOptions = (): CookieOptions => {
  return {
    path: '/',
    expires: 7,
    secure:
      typeof window !== 'undefined' && window.location.protocol === 'https:',
    sameSite: 'lax',
  };
};

export function setAuthToken(token: string, remember = false) {
  const opts = defaultOptions();
  if (remember) {
    opts.expires = 30;
  }
  Cookies.set(TOKEN_KEY, token, opts as Cookies.CookieAttributes);
}

export function getAuthToken(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}

export function removeAuthToken() {
  Cookies.remove(TOKEN_KEY, { path: '/' });
}

export function setCookie(
  name: string,
  value: string,
  options?: CookieOptions
) {
  const opts = { ...defaultOptions(), ...(options || {}) };
  Cookies.set(name, value, opts as Cookies.CookieAttributes);
}

export function getCookie(name: string): string | undefined {
  return Cookies.get(name);
}

export function removeCookie(name: string) {
  Cookies.remove(name, { path: '/' });
}
