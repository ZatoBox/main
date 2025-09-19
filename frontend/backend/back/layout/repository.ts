import { createClient } from '@/utils/supabase/server';

export class LayoutRepository {
  table = 'layouts';

  async createLayout(payload: any) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(this.table)
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updateLayout(slug: string, updates: any) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(this.table)
      .update(updates)
      .eq('slug', slug)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async findAll() {
    const supabase = await createClient();
    const { data, error } = await supabase.from(this.table).select('*');
    if (error) throw error;
    return data || [];
  }

  async findBySlug(slug: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('slug', slug)
      .single();
    if (error) return null;
    return data;
  }

  async findByOwner(owner_id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('owner_id', owner_id);
    if (error) throw error;
    return data || [];
  }

  async findByInventory(inventory_id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('inventory_id', inventory_id);
    if (error) throw error;
    return data || [];
  }

  async deleteLayout(slug: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(this.table)
      .delete()
      .eq('slug', slug)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}
