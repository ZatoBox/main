import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type {
  AuthResponse,
  User,
  LoginRequest,
  RegisterRequest,
  ProductsResponse,
  ProductResponse,
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  InventoryResponse,
  InventoryProduct,
  InventorySummary,
  SalesResponse,
  SaleResponse,
  Sale,
  CreateSaleRequest,
  LayoutResponse,
  LayoutsResponse,
  Layout,
  CreateLayoutRequest,
  UpdateLayoutRequest,
  NotificationSettings,
  Session,
  ProfileStats,
  OCRResponse,
  OCRDebugResponse,
  OCRSupportedFormatsResponse,
  CategoriesResponse,
  Category,
} from '@/types';
import { getAuthToken as getCookieAuthToken } from '@/services/cookies.service';

const appName = process.env.NEXT_PUBLIC_APP_NAME;
const appVersion = process.env.NEXT_PUBLIC_APP_VERSION;
const ocrMaxFileSize = process.env.NEXT_PUBLIC_OCR_MAX_FILE_SIZE;
const ocrSupportedFormats = process.env.NEXT_PUBLIC_OCR_SUPPORTED_FORMATS;

if (!appName) throw new Error('Missing NEXT_PUBLIC_APP_NAME');
if (!appVersion) throw new Error('Missing NEXT_PUBLIC_APP_VERSION');
if (!ocrMaxFileSize) throw new Error('Missing NEXT_PUBLIC_OCR_MAX_FILE_SIZE');
if (!ocrSupportedFormats)
  throw new Error('Missing NEXT_PUBLIC_OCR_SUPPORTED_FORMATS');

const API_BASE_URL: string = '';
const OCR_API_BASE_URL: string = '/api/ocr';

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

const getAuthToken = (): string | undefined => {
  try {
    return getCookieAuthToken();
  } catch {
    return undefined;
  }
};

const axiosInstance: AxiosInstance = axios.create({
  baseURL: '/api',
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

/// Auth
export const authAPI = {
  login: (credentials: LoginRequest): Promise<AuthResponse> =>
    apiRequest('/auth/login', { method: 'POST', data: credentials }),
  register: (userData: RegisterRequest): Promise<AuthResponse> =>
    apiRequest('/auth/register', { method: 'POST', data: userData }),
  getCurrentUser: (): Promise<User> => apiRequest('/auth/me'),
  getUserById: (userId: string): Promise<User> =>
    apiRequest(`/auth/users/${userId}`),
  getAllUsers: (): Promise<User[]> => apiRequest('/auth/users'),
  uploadProfileImage: (
    file: File
  ): Promise<{ success: boolean; user?: any; message?: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiRequest('/profile/image', {
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteProfileImage: (): Promise<{
    success: boolean;
    user?: any;
    message?: string;
  }> => apiRequest('/profile/image', { method: 'DELETE' }),
  updateProfileImage: (
    file: File
  ): Promise<{ success: boolean; user?: any; message?: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiRequest('/profile/image', {
      method: 'PATCH',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

/// Products
export const productsAPI = {
  create: (productData: CreateProductRequest): Promise<ProductResponse> =>
    apiRequest('/products/', { method: 'POST', data: productData }),
  createBulk: (
    productsData: CreateProductRequest[]
  ): Promise<ProductResponse[]> =>
    apiRequest('/products/bulk', { method: 'POST', data: productsData }),
  getById: (
    productId: string
  ): Promise<{ success: boolean; message: string; product: Product }> =>
    apiRequest(`/products/${productId}`),
  update: (
    productId: string,
    updates: UpdateProductRequest
  ): Promise<{ success: boolean; message: string; product: Product }> =>
    apiRequest(`/products/${productId}`, { method: 'PUT', data: updates }),
  delete: (
    productId: string
  ): Promise<{ success: boolean; message: string; product: Product }> =>
    apiRequest(`/products/${productId}`, { method: 'DELETE' }),
  list: (): Promise<ProductsResponse> => apiRequest('/products/'),
  addImages: (
    productId: string,
    images: File[]
  ): Promise<{ success: boolean; message: string; product: Product }> => {
    const formData = new FormData();
    images.forEach((image) => formData.append('images', image));
    return apiRequest(`/products/${productId}/images`, {
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getImages: (
    productId: string
  ): Promise<{ success: boolean; images: string[] }> =>
    apiRequest(`/products/${productId}/images`),
  updateImages: (
    productId: string,
    images: File[]
  ): Promise<{ success: boolean; message: string; product: Product }> => {
    const formData = new FormData();
    images.forEach((image) => formData.append('images', image));
    return apiRequest(`/products/${productId}/images`, {
      method: 'PUT',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteImage: (
    productId: string,
    imageIndex: number
  ): Promise<{ success: boolean; message: string; product: Product }> =>
    apiRequest(`/products/${productId}/images/${imageIndex}`, {
      method: 'DELETE',
    }),
};

export const getActiveProducts = async (): Promise<ProductsResponse> => {
  return apiRequest('/products/active');
};

export const getAllProducts = getActiveProducts;

/// Inventory
export const inventoryAPI = {
  get: (): Promise<InventoryResponse> => apiRequest('/inventory'),
  getUser: (): Promise<InventoryResponse> => apiRequest('/inventory/user'),
  getSummary: (): Promise<{ success: boolean; summary: InventorySummary }> =>
    apiRequest('/inventory/summary'),
  getLowStock: (
    threshold?: number
  ): Promise<{ success: boolean; low_stock_products: InventoryProduct[] }> =>
    apiRequest(
      `/inventory/low-stock${
        threshold !== undefined ? `?threshold=${threshold}` : ''
      }`
    ),
  getItem: (
    productId: string
  ): Promise<{
    success: boolean;
    message?: string;
    product?: InventoryProduct;
  }> => apiRequest(`/inventory/${productId}`),
};

const ocrAxios: AxiosInstance = axios.create({
  baseURL: API_CONFIG.OCR_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

ocrAxios.interceptors.request.use((cfg) => {
  const token = getAuthToken();
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

const ocrRequest = async <T>(
  endpoint: string,
  config: AxiosRequestConfig = {}
): Promise<T> => {
  try {
    const res: AxiosResponse<T> = await ocrAxios.request({
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

export const ocrAPI = {
  process: (file: File): Promise<OCRResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    return ocrRequest('/ocr', {
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  bulk: (data: OCRResponse): Promise<import('@/types').OCRBulkResult> =>
    ocrRequest('/bulk', { method: 'POST', data }),
  root: (): Promise<{ message: string }> => ocrRequest('/'),
};

/// Sales
export const salesAPI = {
  create: (saleData: CreateSaleRequest): Promise<Sale> =>
    apiRequest('/sales/', { method: 'POST', data: saleData }),
  getById: (saleId: string): Promise<Sale> => apiRequest(`/sales/${saleId}`),
  getHistory: (): Promise<Sale[]> => apiRequest('/sales/'),
};

export const profileAPI = {
  get: (): Promise<{ success: boolean; user: User }> => apiRequest('/profile'),
  update: (
    profileData: Partial<User>
  ): Promise<{ success: boolean; message: string; user: User }> =>
    apiRequest('/profile', { method: 'PATCH', data: profileData }),
  changePassword: (passwordData: {
    oldPassword: string;
    newPassword: string;
  }): Promise<{ success: boolean; message: string }> =>
    apiRequest('/profile/password', { method: 'PUT', data: passwordData }),
  deleteUser: (): Promise<{ success: boolean; user?: User }> =>
    apiRequest('/profile', { method: 'DELETE' }),
};

/// Layouts
export const layoutsAPI = {
  create: (layoutData: CreateLayoutRequest): Promise<LayoutResponse> =>
    apiRequest('/layouts/', { method: 'POST', data: layoutData }),
  getBySlug: (layoutSlug: string): Promise<LayoutResponse> =>
    apiRequest(`/layouts/${layoutSlug}`),
  update: (
    layoutSlug: string,
    updates: UpdateLayoutRequest
  ): Promise<LayoutResponse> =>
    apiRequest(`/layouts/${layoutSlug}`, { method: 'PUT', data: updates }),
  delete: (layoutSlug: string): Promise<LayoutResponse> =>
    apiRequest(`/layouts/${layoutSlug}`, { method: 'DELETE' }),
  list: (): Promise<LayoutsResponse> => apiRequest('/layouts/'),
  listByOwner: (ownerId: string): Promise<LayoutsResponse> =>
    apiRequest(`/layouts/owner/${ownerId}`),
  listByInventory: (inventoryId: string): Promise<LayoutsResponse> =>
    apiRequest(`/layouts/inventory/${inventoryId}`),
};

export const categoriesAPI = {
  list: (): Promise<CategoriesResponse> => apiRequest('/categories/'),
  getById: (id: string): Promise<{ success: boolean; category: Category }> =>
    apiRequest(`/categories/${id}`),
};
