import { createClient } from '@/utils/supabase/server';
import type { CashOrderItem, CashOrder } from './models';
import { CashOrderRepository } from './repository';

export class CashPaymentService {
  private repo = new CashOrderRepository();

  private async updateProductStock(
    productId: string,
    quantityToDeduct: number
  ): Promise<void> {
    try {
      const supabase = await createClient();

      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('stock')
        .eq('id', productId)
        .single();

      if (fetchError || !product) {
        throw new Error(`Product not found: ${productId}`);
      }

      const currentStock = product.stock || 0;
      const newStock = Math.max(0, currentStock - quantityToDeduct);

      const { error: updateError } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', productId);

      if (updateError) {
        throw new Error(`Failed to update stock: ${updateError.message}`);
      }
    } catch (error: any) {
      console.error(
        `Stock update failed for product ${productId}:`,
        error.message
      );
    }
  }

  async processCashPayment(
    userId: string,
    items: Array<{ productId: string; quantity: number; price: number }>,
    polarApiKey?: string
  ): Promise<CashOrder> {
    let totalAmount = 0;
    const orderItems: CashOrderItem[] = [];

    for (const item of items) {
      const itemTotal = item.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: item.productId,
        productName: `Product ${item.productId}`,
        quantity: item.quantity,
        price: item.price,
        total: itemTotal,
      });

      await this.updateProductStock(item.productId, item.quantity);
    }

    const order = await this.repo.createOrder(userId, orderItems, totalAmount, {
      paymentType: 'cash',
      createdAt: new Date().toISOString(),
    });

    return order;
  }

  async getOrderById(orderId: string): Promise<CashOrder | null> {
    return this.repo.getOrderById(orderId);
  }

  async getUserOrders(userId: string): Promise<CashOrder[]> {
    return this.repo.getUserOrders(userId);
  }
}
