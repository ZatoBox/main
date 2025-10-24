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

  private async restockProducts(items: CashOrderItem[]): Promise<void> {
    const supabase = await createClient();

    for (const item of items) {
      try {
        const { data: product, error: fetchError } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.productId)
          .single();

        if (fetchError || !product) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        const currentStock = product.stock || 0;
        const newStock = currentStock + item.quantity;

        const { error: updateError } = await supabase
          .from('products')
          .update({ stock: newStock })
          .eq('id', item.productId);

        if (updateError) {
          throw new Error(`Failed to restock product: ${updateError.message}`);
        }
      } catch (error: any) {
        console.error(
          `Restock failed for product ${item.productId}:`,
          error.message
        );
      }
    }
  }

  async processCashPayment(
    userId: string,
    items: Array<{ productId: string; quantity: number; price: number }>,
    polarApiKey?: string
  ): Promise<CashOrder> {
    let totalAmount = 0;
    const orderItems: CashOrderItem[] = [];
    const supabase = await createClient();

    for (const item of items) {
      const { data: product } = await supabase
        .from('products')
        .select('name, images')
        .eq('id', item.productId)
        .single();

      const productName = product?.name || `Product ${item.productId}`;
      const firstImage =
        Array.isArray(product?.images) && product.images.length > 0
          ? product.images[0]
          : undefined;
      const itemTotal = item.price * item.quantity;
      totalAmount += itemTotal;

      const orderItem: CashOrderItem = {
        productId: item.productId,
        productName,
        quantity: item.quantity,
        price: item.price,
        total: itemTotal,
      };

      if (firstImage) {
        orderItem.image = firstImage;
      }

      orderItems.push(orderItem);

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

  async cancelOrder(
    orderId: string,
    userId: string,
    newStatus: 'cancelled' | 'returned'
  ): Promise<CashOrder> {
    const order = await this.repo.getOrderById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.userId !== userId) {
      throw new Error('Unauthorized');
    }

    if (order.status !== 'completed') {
      throw new Error('Only completed orders can be cancelled or returned');
    }

    await this.restockProducts(order.items);

    const updatedOrder = await this.repo.updateOrderStatus(orderId, newStatus);

    if (!updatedOrder) {
      throw new Error('Failed to update order status');
    }

    return updatedOrder;
  }
}
