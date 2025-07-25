import { API_CONFIG } from '../config/api';

const API_BASE_URL = API_CONFIG.BASE_URL;

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

// Helper function to make API requests
const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || errorData.error || `HTTP error! status: ${response.status}`;
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        url: `${API_BASE_URL}${endpoint}`,
        errorData
      });
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: (userData: any): Promise<AuthResponse> => apiRequest('/auth/register', {
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
  
  resetPassword: (token: string, password: string): Promise<{ success: boolean; message: string }> => apiRequest('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  }),
};

// Products API
export const productsAPI = {
  getAll: (params: Record<string, any> = {}): Promise<ProductsResponse> => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/products?${queryString}`);
  },
  
  getById: (id: number): Promise<ProductResponse> => apiRequest(`/products/${id}`),
  
  create: (productData: Partial<Product>): Promise<ProductResponse> => apiRequest('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  }),
  
  update: (id: number, productData: Partial<Product>): Promise<ProductResponse> => apiRequest(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  }),
  
  delete: (id: number): Promise<{ success: boolean; message: string; product: Product }> => apiRequest(`/products/${id}`, {
    method: 'DELETE',
  }),
  
  uploadImages: (id: number, formData: FormData): Promise<any> => {
    const token = getAuthToken();
    return fetch(`${API_BASE_URL}/products/${id}/images`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    });
  },
  
  getCategories: (): Promise<{ success: boolean; categories: string[] }> => apiRequest('/products/categories/list'),
};

// Inventory API
export const inventoryAPI = {
  getAll: (params: Record<string, any> = {}): Promise<any> => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/inventory?${queryString}`);
  },
  
  getLowStock: (): Promise<any> => apiRequest('/inventory/low-stock'),
  
  updateStock: (id: number, stockData: any): Promise<any> => apiRequest(`/inventory/${id}/stock`, {
    method: 'PUT',
    body: JSON.stringify(stockData),
  }),
  
  getMovements: (params: Record<string, any> = {}): Promise<any> => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/inventory/movements?${queryString}`);
  },
  
  bulkUpdate: (updates: any[]): Promise<any> => apiRequest('/inventory/bulk-update', {
    method: 'POST',
    body: JSON.stringify(updates),
  }),
  
  getStats: (): Promise<any> => apiRequest('/inventory/stats/summary'),
};

// Sales API
export const salesAPI = {
  getAll: (params: Record<string, any> = {}): Promise<any> => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/sales?${queryString}`);
  },
  
  getById: (id: number): Promise<any> => apiRequest(`/sales/${id}`),
  
  create: (saleData: any): Promise<any> => apiRequest('/sales', {
    method: 'POST',
    body: JSON.stringify(saleData),
  }),
  
  updateStatus: (id: number, status: string): Promise<any> => apiRequest(`/sales/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
  
  getStats: (params: Record<string, any> = {}): Promise<any> => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/sales/stats/summary?${queryString}`);
  },
};

// Profile API
export const profileAPI = {
  get: (): Promise<{ success: boolean; user: User }> => apiRequest('/profile'),
  
  update: (profileData: Partial<User>): Promise<{ success: boolean; message: string; user: User }> => apiRequest('/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  }),
  
  changePassword: (passwordData: any): Promise<{ success: boolean; message: string }> => apiRequest('/profile/password', {
    method: 'PUT',
    body: JSON.stringify(passwordData),
  }),
  
  updateNotifications: (notificationData: any): Promise<any> => apiRequest('/profile/notifications', {
    method: 'PUT',
    body: JSON.stringify(notificationData),
  }),
  
  getSessions: (): Promise<any> => apiRequest('/profile/sessions'),
  
  closeSession: (sessionId: string): Promise<any> => apiRequest(`/profile/sessions/${sessionId}`, {
    method: 'DELETE',
  }),
  
  getStats: (): Promise<any> => apiRequest('/profile/stats'),
  
  exportData: (): Promise<any> => apiRequest('/profile/export'),
  
  deleteAccount: (password: string): Promise<any> => apiRequest('/profile', {
    method: 'DELETE',
    body: JSON.stringify({ password }),
  }),
};

// OCR API Types
export interface OCRMetadata {
  ruc?: string;
  invoice_number?: string;
  date?: string;
  company_name?: string;
  payment_method?: string;
  subtotal?: string;
  iva?: string;
  total?: string;
}

export interface OCRLineItem {
  description: string;
  quantity: string;
  unit_price: string;
  total_price: string;
  confidence: number;
}

export interface OCRDetection {
  field_type: string;
  text: string;
  confidence: number;
  bbox: {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
  };
  ocr_confidence?: number;
}

export interface OCRResponse {
  success: boolean;
  message: string;
  metadata: OCRMetadata;
  line_items: OCRLineItem[];
  detections: OCRDetection[];
  processed_image?: string;
  processing_time: number;
  statistics: {
    yolo_detections: number;
    table_regions: number;
    ocr_confidence: number;
    model_status: {
      yolo_loaded: boolean;
      classes_count: number;
      is_loaded: boolean;
    };
  };
  summary?: {
    total_productos: number;
    total_cantidad: number;
    gran_total: string;
    promedio_precio: string;
  };
}

export interface OCRDebugResponse {
  model_status: {
    yolo_loaded: boolean;
    classes_count: number;
  };
  ocr_engines: {
    tesseract?: {
      status: string;
      version?: string;
      error?: string;
    };
  };
  simple_test: {
    tesseract_text?: string;
    yolo_detections?: number;
    detected_classes?: string[];
    yolo_error?: string;
  };
}

// OCR API
export const ocrAPI = {
  /**
   * Process invoice document with advanced OCR
   */
  processDocument: (file: File, options: {
    enhance_ocr?: boolean;
    rotation_correction?: boolean;
    confidence_threshold?: number;
  } = {}): Promise<OCRResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add processing options
    if (options.enhance_ocr !== undefined) {
      formData.append('enhance_ocr', options.enhance_ocr.toString());
    }
    if (options.rotation_correction !== undefined) {
      formData.append('rotation_correction', options.rotation_correction.toString());
    }
    if (options.confidence_threshold !== undefined) {
      formData.append('confidence_threshold', options.confidence_threshold.toString());
    }
    
    // Configuración más robusta con logs detallados
    console.log('🚀 Iniciando procesamiento OCR...');
    console.log('📍 URL destino:', `http://localhost:8001/api/v1/invoice/process`);
    console.log('📄 Archivo:', file.name, 'Tamaño:', file.size, 'bytes');
    
    const startTime = Date.now();
    
    return fetch(`http://localhost:8001/api/v1/invoice/process`, {
      method: 'POST',
      body: formData,
      mode: 'cors',
      credentials: 'omit'
    }).then(async response => {
      const elapsed = Date.now() - startTime;
      console.log(`📥 Respuesta recibida del servidor en ${elapsed}ms:`, response.status, response.statusText);
      console.log('🔍 Headers de respuesta:', [...response.headers.entries()]);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error del servidor:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Datos procesados exitosamente:', Object.keys(data));
      console.log('🔎 Productos detectados:', data.line_items?.length || 0);
      console.log('📊 Datos completos:', data);
      return data;
    }).catch(error => {
      const elapsed = Date.now() - startTime;
      console.error(`🔥 Error en procesamiento OCR después de ${elapsed}ms:`, error);
      console.error('🔥 Tipo de error:', error.name);
      console.error('🔥 Mensaje:', error.message);
      throw error;
    });
  },

  /**
   * Validate file before processing
   */
  validateFile: (file: File): Promise<{
    valid: boolean;
    message?: string;
    error?: string;
    file_info?: {
      filename: string;
      size: number;
      content_type: string;
    };
  }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    return fetch(`${API_CONFIG.OCR_BASE_URL}/invoice/validate`, {
      method: 'POST',
      body: formData,
    }).then(async response => {
      const data = await response.json();
      if (!response.ok && response.status !== 400) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      return data;
    });
  },

  /**
   * Get debug information about OCR system
   */
  getDebugInfo: (): Promise<OCRDebugResponse> => {
    return fetch(`${API_CONFIG.OCR_BASE_URL}/invoice/debug`, {
      method: 'GET',
    }).then(async response => {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      return data;
    });
  },

  /**
   * Get supported file formats and capabilities
   */
  getSupportedFormats: (): Promise<{
    supported_formats: string[];
    max_file_size_mb: number;
    ocr_languages: string[];
    capabilities: {
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
  }> => {
    return fetch(`${API_CONFIG.OCR_BASE_URL}/invoice/supported-formats`, {
      method: 'GET',
    }).then(async response => {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      return data;
    });
  },
}; 