import { createClient } from '@/utils/supabase/server';
import type { CashOrder, CashOrderItem } from './models';

export class CashOrderRepository {
  table = 'cash_orders';

  async createOrder(
    userId: string,
    items: CashOrderItem[],
    totalAmount: number,
    metadata?: Record<string, any>
  ): Promise<CashOrder> {
    const supabase = await createClient();

    const order = {
      user_id: userId,
      items,
      total_amount: totalAmount,
      payment_method: 'cash',
      status: 'completed',
      metadata,
    };

    const { data, error } = await supabase
      .from(this.table)
      .insert([order])
      .select()
      .single();

    if (error || !data) {
      throw new Error(
        `Failed to create order: ${error?.message || 'Unknown error'}`
      );
    }

    return {
      id: data.id,
      userId: data.user_id,
      items: data.items,
      totalAmount: data.total_amount,
      paymentMethod: data.payment_method,
      status: data.status,
      createdAt: data.created_at,
      metadata: data.metadata,
    } as CashOrder;
  }

  async getOrderById(orderId: string): Promise<CashOrder | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('id', orderId)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      userId: data.user_id,
      items: data.items,
      totalAmount: data.total_amount,
      paymentMethod: data.payment_method,
      status: data.status,
      createdAt: data.created_at,
      metadata: data.metadata,
    } as CashOrder;
  }

  async getUserOrders(userId: string): Promise<CashOrder[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      items: row.items,
      totalAmount: row.total_amount,
      paymentMethod: row.payment_method,
      status: row.status,
      createdAt: row.created_at,
      metadata: row.metadata,
    })) as CashOrder[];
  }

  async updateOrderStatus(
    orderId: string,
    newStatus: 'completed' | 'cancelled' | 'returned'
  ): Promise<CashOrder | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from(this.table)
      .update({ status: newStatus })
      .eq('id', orderId)
      .select()
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      userId: data.user_id,
      items: data.items,
      totalAmount: data.total_amount,
      paymentMethod: data.payment_method,
      status: data.status,
      createdAt: data.created_at,
      metadata: data.metadata,
    } as CashOrder;
  }
}
