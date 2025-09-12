import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type {
  Layout,
  CreateLayoutRequest,
  UpdateLayoutRequest,
  LayoutResponse,
  LayoutsResponse,
} from '@/types';
import { getAuthToken as getCookieAuthToken } from '@/services/cookies.service';

const apiEnv = process.env.NEXT_PUBLIC_API_URL;

if (!apiEnv) throw new Error('Missing NEXT_PUBLIC_API_URL');

const API_BASE_URL: string = apiEnv;

const getAuthToken = (): string | undefined => {
  try {
    return getCookieAuthToken();
  } catch {
    return undefined;
  }
};

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use((cfg) => {
  const token = getAuthToken();
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

const apiRequest = async <T>(
  endpoint: string,
  config: AxiosRequestConfig = {}
): Promise<T> => {
  try {
    const res: AxiosResponse<T> = await axiosInstance.request({
      url: endpoint,
      ...config,
    });
    return res.data;
  } catch (err: any) {
    if (err.response) {
      const d = err.response.data || {};
      throw new Error(
        d.message || d.error || `HTTP error ${err.response.status}`
      );
    }
    throw new Error(err.message || 'Network error');
  }
};

export const layoutAPI = {
  // Create a new layout
  create: (layoutData: CreateLayoutRequest): Promise<LayoutResponse> =>
    apiRequest('/api/layouts', { method: 'POST', data: layoutData }),

  // Get a specific layout by slug
  getBySlug: (
    layoutSlug: string
  ): Promise<{ success: boolean; message: string; layout: Layout }> =>
    apiRequest(`/api/layouts/${layoutSlug}`),

  // Update a layout by slug
  update: (
    layoutSlug: string,
    updates: UpdateLayoutRequest
  ): Promise<{ success: boolean; message: string; layout: Layout }> =>
    apiRequest(`/api/layouts/${layoutSlug}`, { method: 'PUT', data: updates }),

  // Delete a layout by slug
  delete: (
    layoutSlug: string
  ): Promise<{ success: boolean; message: string; layout: Layout }> =>
    apiRequest(`/api/layouts/${layoutSlug}`, { method: 'DELETE' }),

  // List all layouts
  getAll: (): Promise<{ success: boolean; layouts: Layout[] }> =>
    apiRequest('/api/layouts'),

  // List layouts by owner
  getByOwner: (
    ownerId: string
  ): Promise<{ success: boolean; layouts: Layout[] }> =>
    apiRequest(`/api/layouts/owner/${ownerId}`),

  // List layouts by inventory
  getByInventory: (
    inventoryId: string
  ): Promise<{ success: boolean; layouts: Layout[] }> =>
    apiRequest(`/api/layouts/inventory/${inventoryId}`),
};
