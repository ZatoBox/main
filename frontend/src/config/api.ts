// Configuración de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4444/api';
const OCR_API_BASE_URL = import.meta.env.VITE_OCR_API_URL || 'http://127.0.0.1:5000/api/v1';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  OCR_BASE_URL: OCR_API_BASE_URL,
  TIMEOUT: 60000, // Increased to 60 seconds for OCR processing
  HEADERS: {
    'Content-Type': 'application/json',
  }
};

// Endpoints
export const ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  PROFILE: '/auth/profile',
  
  // Products
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id: number) => `/products/${id}`,
  
  // Sales
  SALES: '/sales',
  SALE_BY_ID: (id: number) => `/sales/${id}`,
  
  // Inventory
  INVENTORY: '/inventory',
  INVENTORY_MOVEMENTS: '/inventory/movements',
  
  // OCR - Updated for new backend
  OCR_PROCESS: '/invoice/process',
  OCR_DEBUG: '/invoice/debug', 
  OCR_VALIDATE: '/invoice/validate',
  OCR_FORMATS: '/invoice/supported-formats',
};

export default API_CONFIG; 