import { createClient, createAdminClient } from '@/utils/supabase/server';
import type { UserItem } from './models';
import { encryptString, decryptString } from '@/utils/crypto';
import { getCurrentTimeWithTimezone } from '@/utils/timezone';

export class UserRepository {
  table = 'users';

  async findAllUsers(): Promise<UserItem[]> {
    const supabase = await createClient();
    let { data, error } = await supabase.from(this.table).select(`
      id,
      full_name,
      email,
      role,
      phone,
      profile_image,
      premium_up_to,
      modules,
      created_at,
      last_updated
    `);
    if (
      error &&
      error.message &&
      error.message.includes('column') &&
      error.message.includes('modules')
    ) {
      const result = await supabase.from(this.table).select(`
        id,
        full_name,
        email,
        role,
        phone,
        profile_image,
        premium_up_to,
        created_at,
        last_updated
      `);
      if (result.error) throw result.error;
      const users = (result.data || []) as any[];
      users.forEach((user) => (user.modules = {}));
      return users as UserItem[];
    }
    if (error) throw error;
    const users = (data || []) as any[];
    users.forEach((user) => {
      if (!user.modules || Array.isArray(user.modules)) {
        user.modules = {};
      }
    });
    return users as UserItem[];
  }

  async findByEmail(email: string): Promise<UserItem | null> {
    if (!email) return null;
    const supabase = await createClient();
    let { data, error } = await supabase
      .from(this.table)
      .select(
        `
        id,
        full_name,
        email,
        role,
        phone,
        profile_image,
        premium_up_to,
        modules,
        created_at,
        last_updated
      `,
      )
      .eq('email', email)
      .limit(1);
    if (
      error &&
      error.message &&
      error.message.includes('column') &&
      error.message.includes('modules')
    ) {
      const result = await supabase
        .from(this.table)
        .select(
          `
          id,
          full_name,
          email,
          role,
          phone,
          profile_image,
          premium_up_to,
          created_at,
          last_updated
          `,
        )
        .eq('email', email)
        .limit(1);
      if (result.error) throw result.error;
      if (!result.data || result.data.length === 0) return null;
      const user = result.data[0] as any;
      user.modules = {};
      return user as UserItem;
    }
    if (error) throw error;
    if (!data || data.length === 0) return null;
    const user = data[0] as any;
    if (!user.modules || Array.isArray(user.modules)) {
      user.modules = {};
    }
    return user as UserItem;
  }

  async findByUserId(user_id: string): Promise<UserItem | null> {
    if (!user_id) return null;
    const supabase = await createClient();
    let { data, error } = await supabase
      .from(this.table)
      .select(
        `
        id,
        full_name,
        email,
        role,
        phone,
        profile_image,
        premium_up_to,
        modules,
        created_at,
        last_updated
      `,
      )
      .eq('id', user_id)
      .limit(1);
    if (
      error &&
      error.message &&
      error.message.includes('column') &&
      error.message.includes('modules')
    ) {
      const result = await supabase
        .from(this.table)
        .select(
          `
          id,
          full_name,
          email,
          role,
          phone,
          profile_image,
          premium_up_to,
          created_at,
          last_updated
          `,
        )
        .eq('id', user_id)
        .limit(1);
      if (result.error) throw result.error;
      if (!result.data || result.data.length === 0) return null;
      const user = result.data[0] as any;
      user.modules = {};
      return user as UserItem;
    }
    if (error) throw error;
    if (!data || data.length === 0) return null;
    const user = data[0] as any;
    if (!user.modules || Array.isArray(user.modules)) {
      user.modules = {};
    }
    return user as UserItem;
  }

  async createUser(payload: Record<string, any>): Promise<string> {
    const supabase = await createClient();
    const now = getCurrentTimeWithTimezone('UTC');
    const insertPayload = {
      id: payload.id || undefined,
      full_name: payload.full_name,
      email: payload.email,
      phone: payload.phone || null,
      role: payload.role || 'user',
      profile_image: payload.profile_image || null,
      modules: payload.modules || {},
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
    updates: Record<string, any>,
  ): Promise<UserItem> {
    const supabase = createAdminClient();
    const now = getCurrentTimeWithTimezone('UTC');
    updates.last_updated = now;

    const allowedFields = [
      'full_name',
      'email',
      'role',
      'phone',
      'profile_image',
      'premium_up_to',
      'modules',
    ];
    const filteredUpdates: Record<string, any> = {};
    for (const field of allowedFields) {
      if (updates.hasOwnProperty(field)) {
        filteredUpdates[field] = updates[field];
      }
    }
    filteredUpdates.last_updated = now;

    const { data, error } = await supabase
      .from(this.table)
      .update(filteredUpdates)
      .eq('id', user_id)
      .select(
        `
        id,
        full_name,
        email,
        role,
        phone,
        profile_image,
        premium_up_to,
        modules,
        created_at,
        last_updated
      `,
      )
      .single();

    if (
      error &&
      error.message &&
      error.message.includes('column') &&
      error.message.includes('modules')
    ) {
      delete filteredUpdates.modules;
      const selectWithoutModules = `
        id,
        full_name,
        email,
        role,
        phone,
        profile_image,
        premium_up_to,
        created_at,
        last_updated
      `;
      const result = await supabase
        .from(this.table)
        .update(filteredUpdates)
        .eq('id', user_id)
        .select(selectWithoutModules)
        .single();
      if (result.error) throw result.error;
      const user = result.data as any;
      user.modules = {};
      return user as UserItem;
    }

    if (error) throw error;
    const user = data as any;
    if (!user.modules || Array.isArray(user.modules)) {
      user.modules = {};
    }
    return user as UserItem;
  }

  async deleteUser(user_id: string): Promise<UserItem | null> {
    const supabase = await createClient();
    let { data, error } = await supabase
      .from(this.table)
      .delete()
      .eq('id', user_id)
      .select(
        `
        id,
        full_name,
        email,
        role,
        phone,
        profile_image,
        premium_up_to,
        modules,
        created_at,
        last_updated
      `,
      )
      .single();
    if (
      error &&
      error.message &&
      error.message.includes('column') &&
      error.message.includes('modules')
    ) {
      const result = await supabase
        .from(this.table)
        .delete()
        .eq('id', user_id)
        .select(
          `
          id,
          full_name,
          email,
          role,
          phone,
          profile_image,
          premium_up_to,
          created_at,
          last_updated
          `,
        )
        .single();
      if (result.error) throw result.error;
      const user = result.data as any;
      if (user) user.modules = {};
      return (user as UserItem) || null;
    }
    if (error) throw error;
    const user = data as any;
    if (user && (!user.modules || Array.isArray(user.modules))) {
      user.modules = {};
    }
    return (user as UserItem) || null;
  }
}
