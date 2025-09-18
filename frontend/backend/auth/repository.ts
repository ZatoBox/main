import { createClient } from '@/utils/supabase/server';
import type { UserItem } from './models';
import { encryptString, decryptString } from '@/utils/crypto';
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
      polar_api_key: payload.polar_api_key || null,
      polar_organization_id: payload.polar_organization_id || null,
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
    if (typeof updates.polar_api_key !== 'undefined') {
      updates.polar_api_key = updates.polar_api_key || null;
    }
    if (typeof updates.polar_organization_id !== 'undefined') {
      updates.polar_organization_id = updates.polar_organization_id || null;
    }
    const { data, error } = await supabase
      .from(this.table)
      .update(updates)
      .eq('id', user_id)
      .select()
      .single();
    if (error) throw error;
    return data as UserItem;
  }

  async getDecryptedPolarKey(user_id: string): Promise<string | null> {
    const supabase = await createClient();
    const { data } = await supabase
      .from(this.table)
      .select('polar_api_key')
      .eq('id', user_id)
      .limit(1)
      .single();
    if (!data || !data.polar_api_key) return null;
    return data.polar_api_key as string;
  }

  async deleteUser(user_id: string): Promise<UserItem | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(this.table)
      .delete()
      .eq('id', user_id)
      .select()
      .single();
    if (error) throw error;
    return (data as UserItem) || null;
  }
}
