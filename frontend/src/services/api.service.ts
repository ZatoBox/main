import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type {
  AuthResponse,
  User,
  ProductsResponse,
  ProductResponse,
  Product,
  InventoryResponse,
  InventoryItem,
  SalesResponse,
  SaleResponse,
  Sale,
  SalesStatsResponse,
  NotificationSettings,
  Session,
  ProfileStats,
  OCRResponse,
  OCRDebugResponse,
  OCRSupportedFormatsResponse,
} from '@/types';

const apiEnv = process.env.NEXT_PUBLIC_API_URL;
const ocrEnv = process.env.NEXT_PUBLIC_OCR_API_URL;
const appName = process.env.NEXT_PUBLIC_APP_NAME;
const appVersion = process.env.NEXT_PUBLIC_APP_VERSION;
const ocrMaxFileSize = process.env.NEXT_PUBLIC_OCR_MAX_FILE_SIZE;
const ocrSupportedFormats = process.env.NEXT_PUBLIC_OCR_SUPPORTED_FORMATS;

if (!apiEnv) throw new Error('Missing NEXT_PUBLIC_API_URL');
if (!ocrEnv) throw new Error('Missing NEXT_PUBLIC_OCR_API_URL');
if (!appName) throw new Error('Missing NEXT_PUBLIC_APP_NAME');
if (!appVersion) throw new Error('Missing NEXT_PUBLIC_APP_VERSION');
if (!ocrMaxFileSize) throw new Error('Missing NEXT_PUBLIC_OCR_MAX_FILE_SIZE');
if (!ocrSupportedFormats)
  throw new Error('Missing NEXT_PUBLIC_OCR_SUPPORTED_FORMATS');

const API_BASE_URL: string = apiEnv;
const OCR_API_BASE_URL_RAW: string = ocrEnv;
const OCR_API_BASE_URL: string = OCR_API_BASE_URL_RAW.replace(/\/+$/g, '');

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  OCR_BASE_URL: OCR_API_BASE_URL,
  APP_NAME: appName,
  APP_VERSION: appVersion,
  OCR_MAX_FILE_SIZE: parseInt(ocrMaxFileSize, 10),
  OCR_SUPPORTED_FORMATS: ocrSupportedFormats.split(',').map((f) => f.trim()),
  TIMEOUT: 60000,
  HEADERS: { 'Content-Type': 'application/json' },
};

const getAuthToken = (): string | null => localStorage.getItem('token');

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
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

// Auth API
export const authAPI = {
  register: (userData: Partial<User>): Promise<AuthResponse> =>
    apiRequest('/auth/register', { method: 'POST', data: userData }),
  login: (credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> =>
    apiRequest('/auth/login', { method: 'POST', data: credentials }),
  logout: (): Promise<{ success: boolean; message: string }> =>
    apiRequest('/auth/logout', { method: 'POST' }),
  getCurrentUser: async (): Promise<{ success: boolean; user: User }> => {
    const data = await apiRequest<any>('/auth/me');
    return 'user' in data
      ? { success: true, user: data.user as User }
      : { success: true, user: data as User };
  },
  forgotPassword: (
    email: string
  ): Promise<{ success: boolean; message: string }> =>
    apiRequest('/auth/forgot-password', { method: 'POST', data: { email } }),
  socialRegister: (
    access_token: string
  ): Promise<{ user: User; token: string }> =>
    apiRequest('/auth/social', { method: 'POST', data: { access_token } }),
  checkEmail: (email: string): Promise<{ exists: boolean }> =>
    apiRequest(`/auth/check-email?email=${encodeURIComponent(email)}`),
};
// Products API
export const productsAPI = {
  getAll: (
    params: Record<string, string | number | boolean> = {}
  ): Promise<ProductsResponse> => {
    const queryString = new URLSearchParams(
      params as Record<string, string>
    ).toString();
    return apiRequest(`/products?${queryString}`);
  },
  getById: (id: number): Promise<ProductResponse> =>
    apiRequest(`/products/${id}`),
  create: (productData: Partial<Product>): Promise<ProductResponse> =>
    apiRequest('/products', { method: 'POST', data: productData }),
  update: (
    id: number,
    productData: Partial<Product>
  ): Promise<ProductResponse> => {
    const payload = Object.entries(
      productData as Record<string, unknown>
    ).reduce<Record<string, unknown>>((acc, [k, v]) => {
      if (v !== undefined) acc[k] = v;
      return acc;
    }, {});
    return apiRequest(`/products/${id}`, { method: 'PUT', data: payload });
  },
  uploadImages: async (
    id: number,
    formData: FormData
  ): Promise<{ success: boolean; images: string[] }> => {
    const token = getAuthToken();
    const res = await axios.post(
      `${API_BASE_URL}/products/${id}/images`,
      formData,
      { headers: { Authorization: token ? `Bearer ${token}` : undefined } }
    );
    return res.data;
  },
  delete: (id: number): Promise<{ success: boolean; message: string }> =>
    apiRequest(`/products/${id}`, { method: 'DELETE' }),
};

// Inventory API
export const inventoryAPI = {
  getUserInventory: (): Promise<InventoryResponse> =>
    apiRequest('/inventory/user'),
  getAll: (
    params: Record<string, string | number | boolean> = {}
  ): Promise<InventoryResponse> => {
    const queryString = new URLSearchParams(
      params as Record<string, string>
    ).toString();
    return apiRequest(`/inventory?${queryString}`);
  },
  getActive: async (
    params: Record<string, string | number | boolean> = {}
  ): Promise<InventoryResponse> => {
    const merged = { ...params, include: (params as any).include ?? 'product' };
    const queryString = new URLSearchParams(
      merged as Record<string, string>
    ).toString();
    const response = await apiRequest<InventoryResponse>(
      `/inventory?${queryString}`
    );
    if (!response || !Array.isArray(response.inventory)) return response;
    const inventoryList = response.inventory;
    const needFetch = inventoryList.some((it) => !it.product && it.product_id);
    if (needFetch) {
      const uniqueIds = Array.from(
        new Set(inventoryList.map((it) => it.product_id).filter(Boolean))
      );
      const productsMap: Record<number, Product> = {};
      await Promise.all(
        uniqueIds.map(async (pid) => {
          try {
            const prodRes = await productsAPI.getById(pid);
            if ((prodRes as any).product)
              productsMap[pid] = (prodRes as any).product as Product;
          } catch {}
        })
      );
      inventoryList.forEach((it) => {
        if (!it.product) it.product = productsMap[it.product_id] ?? null;
      });
    }
    const filtered = inventoryList.filter(
      (it) => it.product && (it.product as Product).status === 'active'
    );
    return { ...response, inventory: filtered };
  },
  getById: (id: number): Promise<InventoryResponse> =>
    apiRequest(`/inventory/${id}`),
  update: (
    id: number,
    inventoryData: Partial<InventoryItem>
  ): Promise<{ success: boolean; message: string }> =>
    apiRequest(`/inventory/${id}`, { method: 'PUT', data: inventoryData }),
  delete: (id: number): Promise<{ success: boolean; message: string }> =>
    apiRequest(`/inventory/${id}`, { method: 'DELETE' }),
};

// Sales API
export const salesAPI = {
  getAll: (
    params: Record<string, string | number | boolean> = {}
  ): Promise<SalesResponse> => {
    const queryString = new URLSearchParams(
      params as Record<string, string>
    ).toString();
    return apiRequest(`/sales?${queryString}`);
  },
  getById: (id: number): Promise<SaleResponse> => apiRequest(`/sales/${id}`),
  create: (saleData: Partial<Sale>): Promise<SaleResponse> =>
    apiRequest('/sales', { method: 'POST', data: saleData }),
  update: (id: number, saleData: Partial<Sale>): Promise<SaleResponse> =>
    apiRequest(`/sales/${id}`, { method: 'PUT', data: saleData }),
  delete: (id: number): Promise<{ success: boolean; message: string }> =>
    apiRequest(`/sales/${id}`, { method: 'DELETE' }),
  getStats: (): Promise<SalesStatsResponse> => apiRequest('/sales/stats'),
};

// Profile API
export const profileAPI = {
  get: (): Promise<{ success: boolean; user: User }> => apiRequest('/profile'),
  update: (
    profileData: Partial<User>
  ): Promise<{ success: boolean; message: string; user: User }> =>
    apiRequest('/profile', { method: 'PUT', data: profileData }),
  changePassword: (passwordData: {
    oldPassword: string;
    newPassword: string;
  }): Promise<{ success: boolean; message: string }> =>
    apiRequest('/profile/password', { method: 'PUT', data: passwordData }),
  updateNotifications: (
    notificationData: NotificationSettings
  ): Promise<{ success: boolean; settings: NotificationSettings }> =>
    apiRequest('/profile/notifications', {
      method: 'PUT',
      data: notificationData,
    }),
  getSessions: (): Promise<{ success: boolean; sessions: Session[] }> =>
    apiRequest('/profile/sessions'),
  closeSession: (
    sessionId: string
  ): Promise<{ success: boolean; message: string }> =>
    apiRequest(`/profile/sessions/${sessionId}`, { method: 'DELETE' }),
  getStats: (): Promise<{ success: boolean; stats: ProfileStats }> =>
    apiRequest('/profile/stats'),
  exportData: (): Promise<{ success: boolean; data: unknown }> =>
    apiRequest('/profile/export'),
  deleteAccount: (
    password: string
  ): Promise<{ success: boolean; message: string }> =>
    apiRequest('/profile', { method: 'DELETE', data: { password } }),
};

// OCR API
export const ocrAPI = {
  processDocument: async (
    file: File,
    options: {
      enhance_ocr?: boolean;
      rotation_correction?: boolean;
      confidence_threshold?: number;
    } = {}
  ): Promise<OCRResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    if (options.enhance_ocr !== undefined)
      formData.append('enhance_ocr', String(options.enhance_ocr));
    if (options.rotation_correction !== undefined)
      formData.append(
        'rotation_correction',
        String(options.rotation_correction)
      );
    if (options.confidence_threshold !== undefined)
      formData.append(
        'confidence_threshold',
        String(options.confidence_threshold)
      );
    const res = await axios.post(
      `${API_CONFIG.OCR_BASE_URL}/invoice/process`,
      formData,
      { withCredentials: false }
    );
    return res.data;
  },
  validateDocument: async (file: File): Promise<OCRResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axios.post(
      `${API_CONFIG.OCR_BASE_URL}/invoice/validate`,
      formData,
      { withCredentials: false }
    );
    return res.data;
  },
  getDebugInfo: async (): Promise<OCRDebugResponse> => {
    const res = await axios.get(`${API_CONFIG.OCR_BASE_URL}/invoice/debug`);
    return res.data;
  },
  getSupportedFormats: async (): Promise<OCRSupportedFormatsResponse> => {
    const res = await axios.get(
      `${API_CONFIG.OCR_BASE_URL}/invoice/supported-formats`
    );
    return res.data;
  },
};
