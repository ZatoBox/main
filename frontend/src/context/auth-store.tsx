'use client';

import { create } from 'zustand';
import axios from 'axios';
import {
  setAuthToken,
  getAuthToken,
  removeAuthToken,
  setCookie,
  getCookie,
  removeCookie,
} from '@/services/cookies.service';
import { User } from '@/types/index';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.VITE_API_URL ||
  'http://localhost:4444/api';
const USER_COOKIE = 'zatobox_user';


interface AuthState {
  user: User | null;
  token?: string;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  register: (
    data: { fullName: string; email: string; password: string; phone?: string },
    remember?: boolean
  ) => Promise<void>;
  logout: () => void;
  loadFromCookies: () => Promise<void>;
  setUser: (user: User | null) => void;
  updateProfile: (patch: Partial<User>) => Promise<void>;
  refreshToken: () => Promise<void>;
}

const api = axios.create({ baseURL: API_URL });

export const useAuthStore = create<AuthState>((set, get) => {
  const initialToken =
    typeof window !== 'undefined' ? getAuthToken() : undefined;
  if (initialToken)
    api.defaults.headers.common.Authorization = `Bearer ${initialToken}`;
  return {
    user: null,
    token: initialToken,
    loading: false,
    error: null,
    initialized: false,
    setUser: (user) => {
      set({ user });
      if (user) setCookie(USER_COOKIE, JSON.stringify(user));
      else removeCookie(USER_COOKIE);
    },
    loadFromCookies: async () => {
      if (get().initialized) return;
      const token = typeof window !== 'undefined' ? getAuthToken() : undefined;
      let user: User | null = null;
      if (typeof window !== 'undefined') {
        const raw = getCookie(USER_COOKIE);
        if (raw) {
          try {
            user = JSON.parse(raw);
          } catch {
            user = null;
          }
        }
      }
      if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
      set({ token, user, initialized: true });
      if (token && !user) {
        try {
          const me = await api.get('/auth/me');
          if (me.data) {
            set({ user: me.data });
            setCookie(USER_COOKIE, JSON.stringify(me.data));
          }
        } catch {
          set({ user: null });
        }
      }
    },
    login: async (email, password, remember = false) => {
      set({ loading: true, error: null });
      try {
        const res = await api.post('/auth/login', { email, password });
        const token = res.data?.token || res.data?.access_token;
        const user = res.data?.user || null;
        if (!token) throw new Error('Token no recibido');
        setAuthToken(token, remember);
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        if (user)
          setCookie(USER_COOKIE, JSON.stringify(user), {
            expires: remember ? 30 : 7,
          });
        set({ token, user, loading: false });
      } catch (e: any) {
        set({
          error:
            e?.response?.data?.message ||
            e.message ||
            'Error al iniciar sesión',
          loading: false,
        });
        throw e;
      }
    },
    register: async (data, remember = false) => {
      set({ loading: true, error: null });
      try {
        const res = await api.post('/auth/register', data);
        const token = res.data?.token || res.data?.access_token;
        const user = res.data?.user || null;
        if (!token) throw new Error('Token no recibido');
        setAuthToken(token, remember);
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        if (user)
          setCookie(USER_COOKIE, JSON.stringify(user), {
            expires: remember ? 30 : 7,
          });
        set({ token, user, loading: false });
      } catch (e: any) {
        set({
          error:
            e?.response?.data?.message || e.message || 'Error al registrar',
          loading: false,
        });
        throw e;
      }
    },
    updateProfile: async (patch) => {
      set({ loading: true, error: null });
      try {
        const res = await api.patch('/auth/me', patch);
        const updated = res.data;
        set({ user: updated, loading: false });
        setCookie(USER_COOKIE, JSON.stringify(updated));
      } catch (e: any) {
        set({
          error:
            e?.response?.data?.message ||
            e.message ||
            'Error al actualizar perfil',
          loading: false,
        });
        throw e;
      }
    },
    refreshToken: async () => {
      try {
        const res = await api.post('/auth/refresh');
        const token = res.data?.token || res.data?.access_token;
        if (token) {
          setAuthToken(token, true);
          api.defaults.headers.common.Authorization = `Bearer ${token}`;
          set({ token });
        }
      } catch {
        get().logout();
      }
    },
    logout: () => {
      removeAuthToken();
      removeCookie(USER_COOKIE);
      delete api.defaults.headers.common.Authorization;
      set({ user: null, token: undefined });
    },
  };
});

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    if (error?.response?.status === 401) {
      try {
        await useAuthStore.getState().refreshToken();
        const cfg = error.config;
        if (cfg && !cfg.__isRetry) {
          cfg.__isRetry = true;
          return api(cfg);
        }
      } catch {
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  }
);
