'use client';

import { create } from 'zustand';
import { authAPI } from '@/services/api.service';
import {
  setAuthToken,
  getAuthToken,
  removeAuthToken,
  setCookie,
  getCookie,
  removeCookie,
} from '@/services/cookies.service';
import { User } from '@/types';

const USER_COOKIE = 'zatobox_user';

interface AuthState {
  user: User | null;
  token?: string;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  register: (
    data: {
      full_name: string;
      email: string;
      password: string;
      phone?: string;
    },
    remember?: boolean
  ) => Promise<void>;
  logout: () => Promise<void>;
  loadFromCookies: () => Promise<void>;
  setUser: (user: User | null) => void;
  updateProfile: (patch: Partial<User>) => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => {
  const initialToken =
    typeof window !== 'undefined' ? getAuthToken() : undefined;
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
      set({ token, user, initialized: true });
      if (token && !user) {
        try {
          const res = await authAPI.getCurrentUser();
          if (res) {
            set({ user: res });
            setCookie(USER_COOKIE, JSON.stringify(res));
          }
        } catch {
          set({ user: null });
        }
      }
    },
    login: async (email, password, remember = false) => {
      set({ loading: true, error: null });
      try {
        const res = await authAPI.login({ email, password });
        if (!res.token) throw new Error('Token no recibido');
        setAuthToken(res.token, remember);
        if (res.user) {
          setCookie(USER_COOKIE, JSON.stringify(res.user), {
            expires: remember ? 30 : 7,
          });
        }
        set({ token: res.token, user: res.user || null, loading: false });
      } catch (e: any) {
        set({
          error: e?.message || 'Error al iniciar sesión',
          loading: false,
        });
        throw e;
      }
    },
    register: async (data, remember = false) => {
      set({ loading: true, error: null });
      try {
        const res = await authAPI.register(data);
        if (!res.token) throw new Error('Token no recibido');
        setAuthToken(res.token, remember);
        if (res.user) {
          setCookie(USER_COOKIE, JSON.stringify(res.user), {
            expires: remember ? 30 : 7,
          });
        }
        set({ token: res.token, user: res.user || null, loading: false });
      } catch (e: any) {
        set({
          error: e?.message || 'Error al registrar',
          loading: false,
        });
        throw e;
      }
    },
    updateProfile: async (patch) => {
      set({ loading: true, error: null });
      try {
        const currentUser = get().user;
        if (!currentUser) {
          throw new Error('No user logged in');
        }
        const merged = { ...currentUser, ...patch };
        set({ user: merged, loading: false });
        setCookie(USER_COOKIE, JSON.stringify(merged));
      } catch (e: any) {
        set({
          error: e?.message || 'Error al actualizar perfil',
          loading: false,
        });
        throw e;
      }
    },
    refreshToken: async () => {
      try {
        const currentUser = await authAPI.getCurrentUser();
        if (currentUser) {
          set({ user: currentUser });
          setCookie(USER_COOKIE, JSON.stringify(currentUser));
        }
      } catch {
        get().logout();
      }
    },
    logout: async () => {
      removeAuthToken();
      removeCookie(USER_COOKIE);
      set({ user: null, token: undefined });
    },
    clearError: () => {
      set({ error: null });
    },
  };
});

export const useAuth = () => {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const initialized = useAuthStore((s) => s.initialized);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const logout = useAuthStore((s) => s.logout);
  const loadFromCookies = useAuthStore((s) => s.loadFromCookies);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const setUser = useAuthStore((s) => s.setUser);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const clearError = useAuthStore((s) => s.clearError);
  const isAuthenticated = !!user && !!token;
  return {
    user,
    token,
    initialized,
    loading,
    error,
    login,
    register,
    logout,
    loadFromCookies,
    refreshToken,
    setUser,
    updateProfile,
    clearError,
    isAuthenticated,
  };
};
