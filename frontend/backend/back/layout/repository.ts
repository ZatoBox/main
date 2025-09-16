import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) throw new Error('Supabase not configured');
  return createClient(url, key);
}

export class LayoutRepository {
  supabase: any;
  table = 'layouts';
  constructor() {
    this.supabase = getSupabase();
  }

  async createLayout(payload: any) {
    const { data, error } = await this.supabase
      .from(this.table)
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updateLayout(slug: string, updates: any) {
    const { data, error } = await this.supabase
      .from(this.table)
      .update(updates)
      .eq('slug', slug)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async findAll() {
    const { data, error } = await this.supabase.from(this.table).select('*');
    if (error) throw error;
    return data || [];
  }

  async findBySlug(slug: string) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('slug', slug)
      .single();
    if (error) return null;
    return data;
  }

  async findByOwner(owner_id: string) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('owner_id', owner_id);
    if (error) throw error;
    return data || [];
  }

  async findByInventory(inventory_id: string) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('inventory_id', inventory_id);
    if (error) throw error;
    return data || [];
  }

  async deleteLayout(slug: string) {
    const { data, error } = await this.supabase
      .from(this.table)
      .delete()
      .eq('slug', slug)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}
