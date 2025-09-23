import { createClient } from '@/utils/supabase/server';
import type { Product } from './models';

export class ProductRepository {
  table = 'products';

  async createProduct(payload: Record<string, any>): Promise<Product> {
    const supabase = await createClient();
    const res = await supabase
      .from(this.table)
      .insert(payload)
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
    const resp = await supabase
      .from(this.table)
      .update(updates)
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

  async findByCreator(creator_id: string, status?: string): Promise<Product[]> {
    const supabase = await createClient();
    
    // Inicia la consulta
    let query = supabase
      .from(this.table)
      .select('*')
      .eq('creator_id', creator_id);
    
    // Si se proporciona un estado, agrégalo a la consulta
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data } = await query;
    return (data || []) as Product[];
  }

  async findByName(name: string): Promise<Product[]> {
    const supabase = await createClient();
    const { data } = await supabase
      .from(this.table)
      .select('*')
      .ilike('name', name);
    return (data || []) as Product[];
  }

  async addImages(product_id: string, new_images: string[]): Promise<Product> {
    const prod = await this.findById(product_id);
    if (!prod) throw new Error('Product not found');
    const current = prod.images || [];
    const updated = current.concat(new_images);
    if (updated.length > 4) throw new Error('Maximum 4 images allowed');
    return this.updateProduct(product_id, { images: updated });
  }

  async getImages(product_id: string): Promise<string[]> {
    const prod = await this.findById(product_id);
    if (!prod) throw new Error('Product not found');
    return prod.images || [];
  }

  async deleteImage(product_id: string, image_index: number): Promise<Product> {
    const prod = await this.findById(product_id);
    if (!prod) throw new Error('Product not found');
    const current = prod.images || [];
    if (image_index < 0 || image_index >= current.length)
      throw new Error('Invalid image index');
    const updated = current
      .slice(0, image_index)
      .concat(current.slice(image_index + 1));
    return this.updateProduct(product_id, { images: updated });
  }

  async updateImages(
    product_id: string,
    new_images: string[]
  ): Promise<Product> {
    if (new_images.length > 4) throw new Error('Maximum 4 images allowed');
    return this.updateProduct(product_id, { images: new_images });
  }
}
