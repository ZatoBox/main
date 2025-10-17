import { createClient } from '@/utils/supabase/server';
import type { Product } from './models';

export class ProductRepository {
  table = 'products';

  async createProduct(payload: Record<string, any>): Promise<Product> {
    const supabase = await createClient();
    const now = new Date().toISOString();
    const res = await supabase
      .from(this.table)
      .insert({
        ...payload,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();
    const data: any = res.data;
    if (!data) throw new Error('Error creating product');
    return data as Product;
  }

  async updateProduct(
    product_id: string,
    updates: Record<string, any>
  ): Promise<Product> {
    const supabase = await createClient();
    const now = new Date().toISOString();
    const resp = await supabase
      .from(this.table)
      .update({
        ...updates,
        updated_at: now,
      })
      .eq('id', product_id)
      .select()
      .single();
    const data: any = resp.data;
    if (!data) throw new Error('Product not found');
    return data as Product;
  }

  async findAll(): Promise<Product[]> {
    const supabase = await createClient();
    const { data } = await supabase.from(this.table).select('*');
    return (data || []) as Product[];
  }

  async findById(product_id: string): Promise<Product | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('id', product_id)
      .limit(1);
    if (error) return null;
    if (!data || data.length === 0) return null;
    return data[0] as Product;
  }

  async deleteProduct(product_id: string): Promise<Product> {
    const supabase = await createClient();
    const { data } = await supabase
      .from(this.table)
      .delete()
      .eq('id', product_id)
      .select()
      .single();
    if (!data) throw new Error('Product not found');
    return data as Product;
  }

  async findByCreator(creator_id: string): Promise<Product[]> {
    const supabase = await createClient();
    const { data } = await supabase
      .from(this.table)
      .select('*')
      .eq('creator_id', creator_id)
      .order('created_at', { ascending: false });
    return (data || []) as Product[];
  }

  async findActiveByCreator(creator_id: string): Promise<Product[]> {
    const supabase = await createClient();
    const { data } = await supabase
      .from(this.table)
      .select('*')
      .eq('creator_id', creator_id)
      .eq('active', true)
      .order('created_at', { ascending: false });
    return (data || []) as Product[];
  }
}
