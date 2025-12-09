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
  PREMIUM = 'premium',
  USER = 'user',
}

export interface User {
  id: UUID;
  email: string;
  full_name: string;
  phone?: string;
  role: RoleUser;
  profile_image?: string;
  premium_up_to?: string;
  created_at?: string;
  last_updated?: string;
  modules?: Record<string, boolean>;
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
  password?: string;
  phone?: string;
}

/// Products
export interface Product {
  id: string;
  creator_id: string;
  name: string;
  description: string | null;
  stock: number;
  categories: string[];
  price: number;
  sku: string | null;
  images: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  created_at?: string;
  last_updated?: string;
}

export interface CategoriesResponse {
  success: boolean;
  categories: Category[];
}

export interface CreateProductRequest {
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  categories?: string[];
  sku?: string | null;
  images?: string[];
}

export interface UpdateProductRequest {
  name?: string;
  description?: string | null;
  price?: number;
  stock?: number;
  categories?: string[];
  sku?: string | null;
  images?: string[];
  active?: boolean;
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
  hero_title?: string;
  web_description?: string;
  banner?: string | null;
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

/// Subscriptions
export enum SubscriptionStatus {
  CREATED = 'created',
  ACTIVE = 'active',
  CANCELED = 'canceled',
  REVOKED = 'revoked',
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: string;
  cycle: string;
  status: SubscriptionStatus;
  start_date: string;
  end_date?: string;
  polar_subscription_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSubscriptionRequest {
  user_id: string;
  plan: string;
  cycle: string;
  status: SubscriptionStatus;
  start_date: string;
  end_date?: string;
  polar_subscription_id: string;
}

export interface UpdateSubscriptionRequest {
  plan?: string;
  cycle?: string;
  status?: SubscriptionStatus;
  start_date?: string;
  end_date?: string;
}

export enum CryptoInvoiceStatus {
  NEW = 'New',
  PROCESSING = 'Processing',
  EXPIRED = 'Expired',
  INVALID = 'Invalid',
  SETTLED = 'Settled',
}

export interface CryptoInvoice {
  id: string;
  invoiceId: string;
  checkoutLink: string;
  amount: string;
  currency: string;
  status: CryptoInvoiceStatus;
  metadata?: any;
}

export interface CreateCryptoInvoiceRequest {
  amount: string | number;
  currency: string;
  metadata?: any;
  checkout?: {
    speedPolicy?: 'HighSpeed' | 'MediumSpeed' | 'LowSpeed';
    expirationMinutes?: number;
    redirectURL?: string;
  };
}

export interface CryptoInvoiceResponse {
  success: boolean;
  invoiceId?: string;
  checkoutLink?: string;
  status?: CryptoInvoiceStatus;
  message?: string;
}

/// Receipts
export interface ReceiptItem {
  productName: string;
  quantity: number;
  price: number;
  total: number;
  productId?: string;
  image?: string;
}
