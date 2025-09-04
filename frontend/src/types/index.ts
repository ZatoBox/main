type UUID = string;

/// Cookies
export interface CookieOptions {
  path?: string;
  expires?: number | Date;
  secure?: boolean;
  sameSite?: 'lax' | 'strict' | 'none';
}

/// Auth
export enum RoleUser {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
}

export interface User {
  id: UUID;
  email: string;
  full_name: string;
  phone?: string;
  role: RoleUser;
  profile_image?: string;
  created_at?: string;
  last_updated?: string;
}

export interface AuthResponse {
  user: any;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
  phone?: string;
}

/// Products
export enum ProductType {
  PHYSICAL_PRODUCT = 'Physical Product',
  SERVICE = 'Service',
  DIGITAL = 'Digital',
}

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum ProductUnity {
  PER_ITEM = 'Per item',
  PER_KILOGRAM = 'Per kilogram',
  PER_LITER = 'Per liter',
  PER_METRO = 'Per metro',
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  min_stock: number;
  category_id?: string;
  images?: string[];
  status: ProductStatus;
  weight?: number;
  sku?: string;
  creator_id?: string;
  unit: ProductUnity;
  product_type: ProductType;
  localization?: string;
  created_at: string;
  last_updated: string;
}

export interface CreateProductRequest {
  name: string;
  price: number;
  stock: number;
  unit: ProductUnity;
  product_type: ProductType;
  category_id?: string;
  description: string;
  sku: string;
  weight?: number;
  localization?: string;
  status: ProductStatus;
  min_stock?: number;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category_id?: string;
  sku?: string;
  weight?: number;
  localization?: string;
  min_stock?: number;
  status?: ProductStatus;
  product_type?: ProductType;
  unit?: ProductUnity;
}

export interface ProductResponse {
  success: boolean;
  message: string;
  product: Product;
}

export interface ProductsResponse {
  success: boolean;
  products: Product[];
}

/// Inventory
export interface InventoryProduct {
  id: UUID;
  name?: string;
  status?: string;
}

export interface Inventory {
  id?: UUID;
  inventory_owner?: UUID;
  products: InventoryProduct[];
  created_at?: string;
  last_updated?: string;
}

export interface InventoryResponse {
  success: boolean;
  inventory?: Inventory;
  total_products: number;
  total_stock?: number;
  low_stock_count?: number;
}

export interface InventorySummary {
  total_products: number;
  total_stock?: number;
  low_stock_count?: number;
}

/// Sales
export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
}

export enum SalesStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export interface SalesItem {
  product_id: string;
  quantity: number;
  price?: number;
}

export interface CreateSalesItem {
  product_id: string;
  quantity: number;
}

export interface CreateSaleRequest {
  items: CreateSalesItem[];
  payment_method: PaymentMethod;
  status?: SalesStatus;
}

export interface Sale {
  id: string;
  items: SalesItem[];
  total: number;
  payment_method: PaymentMethod;
  status: SalesStatus;
  creator_id: string;
  created_at: string;
}

export interface SaleResponse {
  success?: boolean;
  sale?: Sale;
}

export interface SalesResponse {
  success?: boolean;
  sales?: Sale[];
}

/// Layouts
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

export interface Layout {
  slug: string;
  owner_id: string;
  inventory_id: string;
  hero_title?: string;
  web_description?: string;
  social_links?: Record<string, any>;
  created_at?: string;
  last_updated?: string;
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

/// Misc
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
}

/// OCR API Types
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

export interface OCRProduct {
  name?: string;
  description?: string;
  unit_price?: number | string;
  quantity?: number | string;
  total_price?: number | string;
  sku?: string;
  category?: string;
  [key: string]: unknown;
}

export interface OCRBulkResult {
  status: 'success' | 'error';
  response_status: number;
  endpoint_response: unknown;
}
