import { createClient } from '@/utils/supabase/server';
import type { UserItem } from './models';
import { getCurrentTimeWithTimezone } from '@/utils/timezone';

export class UserRepository {
  table = 'users';

  async findAllUsers(): Promise<UserItem[]> {
    const supabase = await createClient();
    const { data } = await supabase.from(this.table).select('*');
    return (data || []) as UserItem[];
  }

  async findByEmail(email: string): Promise<UserItem | null> {
    if (!email) return null;
    const supabase = await createClient();
    const { data } = await supabase
      .from(this.table)
      .select('*')
      .eq('email', email)
      .limit(1);
    if (!data || data.length === 0) return null;
    return data[0] as UserItem;
  }

  async findByUserId(user_id: string): Promise<UserItem | null> {
    if (!user_id) return null;
    const supabase = await createClient();
    const { data } = await supabase
      .from(this.table)
      .select('*')
      .eq('id', user_id)
      .limit(1);
    if (!data || data.length === 0) return null;
    return data[0] as UserItem;
  }

  async createUser(payload: Record<string, any>): Promise<string> {
    const supabase = await createClient();
    const now = getCurrentTimeWithTimezone('UTC');
    const insertPayload = {
      full_name: payload.full_name,
      email: payload.email,
      password: payload.password,
      phone: payload.phone || null,
      role: payload.role || 'user',
      profile_image: payload.profile_image || null,
      created_at: now,
      last_updated: now,
    };
    const { data, error } = await supabase
      .from(this.table)
      .insert(insertPayload)
      .select()
      .single();
    if (error) throw error;
    return (data && data.id) || '';
  }

  async updateProfile(
    user_id: string,
    updates: Record<string, any>
  ): Promise<UserItem> {
    const supabase = await createClient();
    const now = getCurrentTimeWithTimezone('UTC');
    updates.last_updated = now;
    const { data, error } = await supabase
      .from(this.table)
      .update(updates)
      .eq('id', user_id)
      .select()
      .single();
    if (error) throw error;
    return data as UserItem;
  }
}
