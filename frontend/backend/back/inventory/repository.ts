import { createClient } from '@/utils/supabase/server';
import type { Inventory, Product } from './models';

export class InventoryRepository {
  table = 'inventory';

  async getInventoryByOwner(owner_id: string): Promise<Inventory | null> {
    const supabase = await createClient();
    const resp = await supabase
      .from(this.table)
      .select('*')
      .eq('inventory_owner', owner_id)
      .limit(1);
    const data: any =
      resp.data && resp.data.length ? resp.data[0] : resp.data || null;
    if (!data) return null;
    let products = data.products || [];
    if (products && typeof products === 'object' && !Array.isArray(products)) {
      try {
        products = Object.values(products as Record<string, any>);
      } catch {
        products = [];
      }
    }
    data.products = products;
    return data as Inventory;
  }

  async createInventory(owner_id: string): Promise<Inventory> {
    const supabase = await createClient();
    const payload = { inventory_owner: owner_id, products: [] };
    const res = await supabase
      .from(this.table)
      .insert(payload)
      .select()
      .single();
    const data: any = res.data;
    if (!data) throw new Error('Error creating inventory');
    return data as Inventory;
  }

  async getOrCreateInventory(owner_id: string): Promise<Inventory> {
    const inv = await this.getInventoryByOwner(owner_id);
    if (inv) return inv;
    return this.createInventory(owner_id);
  }

  async getInventoryItems(owner_id: string): Promise<Product[]> {
    const inv = await this.getInventoryByOwner(owner_id);
    if (!inv || !inv.products) return [];
    return inv.products as Product[];
  }

  async getInventoryItem(
    owner_id: string,
    product_id: string
  ): Promise<Product | null> {
    const inv = await this.getInventoryByOwner(owner_id);
    if (!inv || !inv.products) return null;
    for (const p of inv.products) {
      const pid =
        typeof p === 'object' && 'id' in p ? (p as any).id : undefined;
      if (String(pid) === String(product_id)) return p as Product;
    }
    return null;
  }

  async updateInventoryItem(
    owner_id: string,
    product_id: string,
    updates: Record<string, any>
  ): Promise<Product> {
    const supabase = await createClient();
    const inv = await this.getOrCreateInventory(owner_id);
    const products = inv.products || [];
    let foundIndex = -1;
    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      const pid =
        typeof p === 'object' && 'id' in p ? (p as any).id : undefined;
      if (String(pid) === String(product_id)) {
        foundIndex = i;
        break;
      }
    }
    let currentProduct: any = null;
    if (foundIndex === -1) {
      const productResp = await supabase
        .from('products')
        .select('id,name,status')
        .eq('id', product_id)
        .limit(1);
      const productData: any =
        productResp.data && productResp.data.length
          ? productResp.data[0]
          : null;
      if (!productData) throw new Error('Product not found');
      const newProduct = {
        id: productData.id,
        name: productData.name,
        status: productData.status || 'active',
      };
      products.push(newProduct);
      currentProduct = newProduct;
    } else {
      const existing = products[foundIndex];
      currentProduct = typeof existing === 'object' ? existing : existing;
      for (const [k, v] of Object.entries(updates)) {
        if (k === 'name' || k === 'status') currentProduct[k] = v;
      }
      products[foundIndex] = currentProduct;
    }
    const serializable = products.map((p) => (typeof p === 'object' ? p : p));
    const resp = await supabase
      .from(this.table)
      .update({ products: serializable })
      .eq('inventory_owner', owner_id)
      .select();
    const data: any = resp.data;
    if (!data) throw new Error('Error updating inventory');
    return currentProduct as Product;
  }

  async removeInventoryItem(
    owner_id: string,
    product_id: string
  ): Promise<boolean> {
    const supabase = await createClient();
    const inv = await this.getInventoryByOwner(owner_id);
    if (!inv || !inv.products) return false;
    const products = inv.products;
    const newProducts = products.filter(
      (p) => String((p as any).id) !== String(product_id)
    );
    const resp = await supabase
      .from(this.table)
      .update({ products: newProducts })
      .eq('inventory_owner', owner_id)
      .select();
    const data: any = resp.data;
    return data != null;
  }

  async getInventorySummary(
    owner_id: string
  ): Promise<{
    total_products: number;
    total_stock: null;
    low_stock_count: null;
  }> {
    const items = await this.getInventoryItems(owner_id);
    return {
      total_products: items.length,
      total_stock: null,
      low_stock_count: null,
    };
  }

  async checkLowStock(
    owner_id: string,
    threshold: number = 0
  ): Promise<Product[]> {
    return [];
  }
}
