import { InventoryRepository } from './repository';
import type { Product, InventoryResponse } from './models';

export class InventoryService {
  repo: InventoryRepository;

  constructor() {
    this.repo = new InventoryRepository();
  }

  async getInventory(user_id: string): Promise<Product[]> {
    return this.getInventoryByUser(user_id);
  }

  async getInventoryByUser(user_id: string): Promise<Product[]> {
    return this.repo.getInventoryItems(user_id);
  }

  async updateStock(): Promise<never> {
    throw new Error('Updating stock on inventory.jsonb is not supported');
  }

  async getInventoryItem(
    user_id: string,
    product_id: string
  ): Promise<Product | null> {
    return this.repo.getInventoryItem(user_id, product_id);
  }

  async checkLowStock(
    user_id: string,
    min_threshold: number = 0
  ): Promise<Product[]> {
    return this.repo.checkLowStock(user_id, min_threshold);
  }

  async getInventorySummary(user_id: string) {
    return this.repo.getInventorySummary(user_id);
  }

  async getInventoryResponse(user_id: string): Promise<InventoryResponse> {
    const items = await this.getInventoryByUser(user_id);
    const summary = await this.getInventorySummary(user_id);
    return {
      success: true,
      inventory: {
        id: null,
        inventory_owner: user_id,
        products: items,
        created_at: null,
        last_updated: null,
      },
      total_products: summary.total_products,
      total_stock: summary.total_stock,
      low_stock_count: summary.low_stock_count,
    };
  }
}
