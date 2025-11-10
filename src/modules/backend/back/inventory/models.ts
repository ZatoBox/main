export interface Product {
  id: string;
  name?: string;
  status?: string;
}

export interface Inventory {
  id?: string | null;
  inventory_owner?: string | null;
  products: Product[];
  created_at?: string | null;
  last_updated?: string | null;
}

export interface InventoryResponse {
  success: boolean;
  inventory?: Inventory | null;
  total_products?: number;
  total_stock?: number | null;
  low_stock_count?: number | null;
}
