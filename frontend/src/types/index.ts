// Auth
export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

// Cookies
export interface CookieOptions {
  path?: string;
  expires?: number | Date;
  secure?: boolean;
  sameSite?: 'lax' | 'strict' | 'none';
}

// User
export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  address: string;
  role: string;
  created_at: Date;
  last_updated: Date;
}

// Product

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  min_stock: number;
  category_id: string;
  images: string[];
  status: 'active' | 'inactive';
  weight?: number;
  sku: string;
  creator_id: string;
  product_type: 'physical' | 'digital' | 'service';
  localization: string;
  created_at: Date;
  last_update: Date;
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

// Categories

export interface Category {
  id: string;
  name: string;
}

// Inventory
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
  product?: Product;
}

// Sales
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

// OCR API Types
export interface OCRLineItem {
  name?: string;
  description?: string;
  unit_price?: string;
  quantity?: string;
  total_price?: string;
  confidence?: number;
  category?: string;
  [key: string]: unknown;
}

export interface OCRMetadata {
  company_name?: string;
  ruc?: string;
  date?: string;
  invoice_number?: string;
  payment_method?: string;
  subtotal?: string;
  iva?: string;
  total?: string;
  [key: string]: unknown;
}

export interface OCRResponse {
  success: boolean;
  message?: string;
  line_items?: OCRLineItem[];
  metadata?: OCRMetadata;
  detections?: unknown[];
  processed_image?: string | null;
  processing_time?: number;
  statistics?: {
    yolo_detections?: number;
    table_regions?: number;
    ocr_confidence?: number;
    [item: string]: unknown;
  };
  summary?: Record<string, unknown>;
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

// Layout
export interface Layout {
  slug: string;
  owner_id: string;
  inventory_id: string;
  hero_title?: string;
  web_description?: string;
  social_links?: Record<string, any>;
  created_at: string;
  last_updated: string;
}

export interface CreateLayoutRequest {
  slug: string;
  inventory_id: string;
  hero_title?: string;
  web_description?: string;
  social_links?: Record<string, any>;
}

export interface UpdateLayoutRequest {
  hero_title?: string;
  web_description?: string;
  social_links?: Record<string, any>;
}

export interface LayoutResponse {
  success: boolean;
  message: string;
  layout: Layout;
}

export interface LayoutsResponse {
  success: boolean;
  layouts: Layout[];
}
