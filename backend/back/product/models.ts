export interface CreateProductRequest {
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  unit?: string | null;
  product_type?: string | null;
  category_ids?: string[] | null;
  sku?: string | null;
  min_stock?: number | null;
  status?: string | null;
  weight?: number | null;
  localization?: string | null;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string | null;
  price?: number;
  stock?: number;
  unit?: string | null;
  product_type?: string | null;
  category_ids?: string[] | null;
  sku?: string | null;
  min_stock?: number | null;
  status?: string | null;
  weight?: number | null;
  localization?: string | null;
}

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  unit?: string | null;
  product_type?: string | null;
  category_ids?: string[] | null;
  sku?: string | null;
  min_stock?: number | null;
  status?: string | null;
  weight?: number | null;
  localization?: string | null;
  images?: string[];
  creator_id?: string | null;
  created_at?: string | null;
  last_updated?: string | null;
}

export interface ProductResponse {
  success: boolean;
  product?: Product | null;
}

export interface ProductsResponse {
  success: boolean;
  products: Product[];
}
