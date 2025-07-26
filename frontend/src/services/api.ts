// Configuración de la API
const API_BASE_URL: string = import.meta.env.VITE_API_URL || 'http://localhost:4444/api';
const OCR_API_BASE_URL: string = import.meta.env.VITE_OCR_API_URL || 'http://127.0.0.1:8001/api/v1';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  OCR_BASE_URL: OCR_API_BASE_URL,
  TIMEOUT: 60000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};


// Types
export interface User {
  id: number;
  email: string;
  fullName: string;
  role: 'admin' | 'user';
  phone?: string;
  address?: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  sku?: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  image?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface ProductsResponse {
  success: boolean;
  products: Product[];
}

export interface ProductResponse {
  success: boolean;
  message: string;
  product: Product;
}


// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const token = getAuthToken();
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || errorData.error || `HTTP error! status: ${response.status}`;
    throw new Error(errorMessage);
  }
  return response.json();
};

// Auth API
export const authAPI = {
  register: (userData: Partial<User>): Promise<AuthResponse> => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  login: (credentials: { email: string; password: string }): Promise<AuthResponse> => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  logout: (): Promise<{ success: boolean; message: string }> => apiRequest('/auth/logout', {
    method: 'POST',
  }),

  getCurrentUser: (): Promise<{ success: boolean; user: User }> => apiRequest('/auth/me'),

  forgotPassword: (email: string): Promise<{ success: boolean; message: string }> => apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),
};
// Products API
export const productsAPI = {
  getAll: (params: Record<string, string | number | boolean> = {}): Promise<ProductsResponse> => {
    const queryString = new URLSearchParams(params as Record<string, string>).toString();
    return apiRequest(`/products?${queryString}`);
  },

  getById: (id: number): Promise<ProductResponse> => apiRequest(`/products/${id}`),

  create: (productData: Partial<Product>): Promise<ProductResponse> => apiRequest('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  }),

  uploadImages: async(id: number, formData: FormData): Promise<{ success: boolean; images: string[] }> => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/products/${id}/images`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
};

export interface InventoryResponse {
  success: boolean;
  inventory: InventoryItem[];
}

export interface InventoryStatsResponse {
  success: boolean;
  stats: Record<string, number>;
}
export interface InventoryItem {
  id: number;
  product_id: number;
  quantity: number;
  location?: string;
  updated_at?: string;
  change?: number;
  reason?: string;
  date?: string;
}

// Sales Types
export interface Sale {
  id: number;
  customer_id: number;
  total: number;
  status: string;
  created_at: string;
  updated_at: string;
  items: Array<{ product_id: number; quantity: number; price: number }>;
}

export interface SalesResponse {
  success: boolean;
  sales: Sale[];
}

export interface SaleResponse {
  success: boolean;
  sale: Sale;
}

export interface SalesStatsResponse {
  success: boolean;
  stats: Record<string, number>;
}

// Sales API
export const salesAPI = {
  getAll: (params: Record<string, string | number | boolean> = {}): Promise<SalesResponse> => {
    const queryString = new URLSearchParams(params as Record<string, string>).toString();
    return apiRequest(`/sales?${queryString}`);
  },

  getById: (id: number): Promise<SaleResponse> => apiRequest(`/sales/${id}`),

  create: (saleData: Partial<Sale>): Promise<SaleResponse> => apiRequest('/sales', {
    method: 'POST',
    body: JSON.stringify(saleData),
  }),

  update: (id: number, saleData: Partial<Sale>): Promise<SaleResponse> => apiRequest(`/sales/${id}`, {
    method: 'PUT',
    body: JSON.stringify(saleData),
  }),

  delete: (id: number): Promise<{ success: boolean; message: string }> => apiRequest(`/sales/${id}`, {
    method: 'DELETE',
  }),

  getStats: (): Promise<SalesStatsResponse> => apiRequest('/sales/stats'),
};

// Notification, Session, Profile Types
export interface NotificationSettings {
  email?: boolean;
  sms?: boolean;
  push?: boolean;
}

export interface Session {
  id: string;
  device: string;
  last_active: string;
}

export interface ProfileStats {
  total_logins: number;
  // Add other stats fields as needed
}

// Profile API
export const profileAPI = {
  get: (): Promise<{ success: boolean; user: User }> => apiRequest('/profile'),

  update: (profileData: Partial<User>): Promise<{ success: boolean; message: string; user: User }> => apiRequest('/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  }),

  changePassword: (passwordData: { oldPassword: string; newPassword: string }): Promise<{ success: boolean; message: string }> => apiRequest('/profile/password', {
    method: 'PUT',
    body: JSON.stringify(passwordData),
  }),

  updateNotifications: (notificationData: NotificationSettings): Promise<{ success: boolean; settings: NotificationSettings }> => apiRequest('/profile/notifications', {
    method: 'PUT',
    body: JSON.stringify(notificationData),
  }),

  getSessions: (): Promise<{ success: boolean; sessions: Session[] }> => apiRequest('/profile/sessions'),

  closeSession: (sessionId: string): Promise<{ success: boolean; message: string }> => apiRequest(`/profile/sessions/${sessionId}`, {
    method: 'DELETE',
  }),

  getStats: (): Promise<{ success: boolean; stats: ProfileStats }> => apiRequest('/profile/stats'),

  exportData: (): Promise<{ success: boolean; data: unknown }> => apiRequest('/profile/export'),

  deleteAccount: (password: string): Promise<{ success: boolean; message: string }> => apiRequest('/profile', {
    method: 'DELETE',
    body: JSON.stringify({ password }),
  }),
};

// OCR API Types
export interface OCRResponse {
  success: boolean;
  message?: string;
  line_items?: Record<string, unknown>[];
  [key: string]: unknown;
}

export interface OCRDebugResponse {
  success: boolean;
  debugInfo: unknown;
  [key: string]: unknown;
}

export interface OCRSupportedFormatsResponse {
  success: boolean;
  supported_features: {
    pdf_processing: boolean;
    image_processing: boolean;
    table_detection: boolean;
    rotation_correction: boolean;
    multi_ocr_engines: boolean;
    yolo_field_detection: boolean;
  };
  optimal_conditions: {
    dpi: string;
    format: string;
    quality: string;
    orientation: string;
  };
}

// OCR API
export const ocrAPI = {
  /**
   * Process invoice document with advanced OCR
   */
  processDocument: async(
    file: File,
    options: {
      enhance_ocr?: boolean;
      rotation_correction?: boolean;
      confidence_threshold?: number;
    } = {},
  ): Promise<OCRResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    if (options.enhance_ocr !== undefined) {
      formData.append('enhance_ocr', options.enhance_ocr.toString());
    }
    if (options.rotation_correction !== undefined) {
      formData.append('rotation_correction', options.rotation_correction.toString());
    }
    if (options.confidence_threshold !== undefined) {
      formData.append('confidence_threshold', options.confidence_threshold.toString());
    }

    const response = await fetch(`${API_CONFIG.OCR_BASE_URL}/invoice/process`, {
      method: 'POST',
      body: formData,
      mode: 'cors',
      credentials: 'omit',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    return await response.json();
  },

  getDebugInfo: async(): Promise<OCRDebugResponse> => {
    const response = await fetch(`${API_CONFIG.OCR_BASE_URL}/invoice/debug`, {
      method: 'GET',
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    return data;
  },

  getSupportedFormats: async(): Promise<OCRSupportedFormatsResponse> => {
    const response = await fetch(`${API_CONFIG.OCR_BASE_URL}/invoice/supported-formats`, {
      method: 'GET',
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    return data;
  },
};
