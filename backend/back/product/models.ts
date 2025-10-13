export interface CreateProductRequest {
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  unlimited_stock?: boolean;
  categories?: string[];
  sku?: string | null;
  images?: string[];
}

export interface UpdateProductRequest {
  name?: string;
  description?: string | null;
  price?: number;
  stock?: number;
  unlimited_stock?: boolean;
  categories?: string[];
  sku?: string | null;
  images?: string[];
  active?: boolean;
}

export interface Product {
  id: string;
  creator_id: string;
  name: string;
  description: string | null;
  stock: number;
  unlimited_stock: boolean;
  categories: string[];
  price: number;
  sku: string | null;
  images: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductResponse {
  success: boolean;
  product?: Product | null;
}

export interface ProductsResponse {
  success: boolean;
  products: Product[];
}
