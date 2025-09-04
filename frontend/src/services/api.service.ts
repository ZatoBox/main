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
} from '@/types';
import { getAuthToken as getCookieAuthToken } from '@/services/cookies.service';

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

const getAuthToken = (): string | undefined => {
  try {
    return getCookieAuthToken();
  } catch {
    return undefined;
  }
};

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

/// Auth
export const authAPI = {
  login: (credentials: LoginRequest): Promise<AuthResponse> =>
    apiRequest('/api/auth/login', { method: 'POST', data: credentials }),
  register: (userData: RegisterRequest): Promise<AuthResponse> =>
    apiRequest('/api/auth/register', { method: 'POST', data: userData }),
  getCurrentUser: (): Promise<User> => apiRequest('/api/auth/me'),
  getUserById: (userId: string): Promise<User> =>
    apiRequest(`/api/auth/users/${userId}`),
  getAllUsers: (): Promise<User[]> => apiRequest('/api/auth/users'),
  uploadProfileImage: (
    file: File
  ): Promise<{ success: boolean; message: string; image_url?: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiRequest('/api/auth/upload-profile-image', {
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteProfileImage: (): Promise<{ success: boolean; message: string }> =>
    apiRequest('/api/auth/delete-profile-image', { method: 'DELETE' }),
  updateProfileImage: (
    file: File
  ): Promise<{ success: boolean; message: string; image_url?: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiRequest('/api/auth/update-profile-image', {
      method: 'PUT',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

/// Products
export const productsAPI = {
  create: (productData: CreateProductRequest): Promise<ProductResponse> =>
    apiRequest('/api/products/', { method: 'POST', data: productData }),
  createBulk: (
    productsData: CreateProductRequest[]
  ): Promise<ProductResponse[]> =>
    apiRequest('/api/products/bulk', { method: 'POST', data: productsData }),
  getById: (
    productId: string
  ): Promise<{ success: boolean; message: string; product: Product }> =>
    apiRequest(`/api/products/${productId}`),
  update: (
    productId: string,
    updates: UpdateProductRequest
  ): Promise<{ success: boolean; message: string; product: Product }> =>
    apiRequest(`/api/products/${productId}`, { method: 'PUT', data: updates }),
  delete: (
    productId: string
  ): Promise<{ success: boolean; message: string; product: Product }> =>
    apiRequest(`/api/products/${productId}`, { method: 'DELETE' }),
  list: (): Promise<ProductsResponse> => apiRequest('/api/products/'),
  addImages: (
    productId: string,
    images: File[]
  ): Promise<{ success: boolean; message: string; product: Product }> => {
    const formData = new FormData();
    images.forEach((image) => formData.append('images', image));
    return apiRequest(`/api/products/${productId}/images`, {
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getImages: (
    productId: string
  ): Promise<{ success: boolean; images: string[] }> =>
    apiRequest(`/api/products/${productId}/images`),
  updateImages: (
    productId: string,
    images: File[]
  ): Promise<{ success: boolean; message: string; product: Product }> => {
    const formData = new FormData();
    images.forEach((image) => formData.append('images', image));
    return apiRequest(`/api/products/${productId}/images`, {
      method: 'PUT',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteImage: (
    productId: string,
    imageIndex: number
  ): Promise<{ success: boolean; message: string; product: Product }> =>
    apiRequest(`/api/products/${productId}/images/${imageIndex}`, {
      method: 'DELETE',
    }),
};

/// Inventory
export const inventoryAPI = {
  get: (): Promise<InventoryResponse> => apiRequest('/api/inventory'),
  getUser: (): Promise<InventoryResponse> => apiRequest('/api/inventory/user'),
  getSummary: (): Promise<{ success: boolean; summary: InventorySummary }> =>
    apiRequest('/api/inventory/summary'),
  getLowStock: (
    threshold?: number
  ): Promise<{ success: boolean; low_stock_products: InventoryProduct[] }> =>
    apiRequest(
      `/api/inventory/low-stock${
        threshold !== undefined ? `?threshold=${threshold}` : ''
      }`
    ),
  getItem: (
    productId: string
  ): Promise<{
    success: boolean;
    message?: string;
    product?: InventoryProduct;
  }> => apiRequest(`/api/inventory/${productId}`),
};

/// Sales
export const salesAPI = {
  create: (saleData: CreateSaleRequest): Promise<Sale> =>
    apiRequest('/api/sales/', { method: 'POST', data: saleData }),
  getById: (saleId: string): Promise<Sale> =>
    apiRequest(`/api/sales/${saleId}`),
  getHistory: (): Promise<Sale[]> => apiRequest('/api/sales/'),
};

/// Layouts
export const layoutsAPI = {
  create: (layoutData: CreateLayoutRequest): Promise<LayoutResponse> =>
    apiRequest('/api/layouts/', { method: 'POST', data: layoutData }),
  getBySlug: (layoutSlug: string): Promise<LayoutResponse> =>
    apiRequest(`/api/layouts/${layoutSlug}`),
  update: (
    layoutSlug: string,
    updates: UpdateLayoutRequest
  ): Promise<LayoutResponse> =>
    apiRequest(`/api/layouts/${layoutSlug}`, { method: 'PUT', data: updates }),
  delete: (layoutSlug: string): Promise<LayoutResponse> =>
    apiRequest(`/api/layouts/${layoutSlug}`, { method: 'DELETE' }),
  list: (): Promise<LayoutsResponse> => apiRequest('/api/layouts/'),
  listByOwner: (ownerId: string): Promise<LayoutsResponse> =>
    apiRequest(`/api/layouts/owner/${ownerId}`),
  listByInventory: (inventoryId: string): Promise<LayoutsResponse> =>
    apiRequest(`/api/layouts/inventory/${inventoryId}`),
};
