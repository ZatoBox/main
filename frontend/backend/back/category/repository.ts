import { createClient } from '@/utils/supabase/server';

export class CategoryRepository {
  table = 'categories';

  async list() {
    const supabase = await createClient();
    const { data, error } = await supabase.from(this.table).select('*');
    if (error) throw error;
    return data || [];
  }

  async get(category_id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('id', category_id)
      .single();
    if (error) return null;
    return data;
  }
}
