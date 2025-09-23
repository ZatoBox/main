import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { UserRepository } from './repository';
import type { UserItem } from './models';
import { hashPassword, verifyPassword } from '@/utils/password';
import { uploadProfileImage } from '@/utils/cloudinary';
import { getCurrentTimeWithTimezone } from '@/utils/timezone';

const SECRET_KEY = process.env.SECRET_KEY;
const ALGORITHM = 'HS256';
const ACCESS_TOKEN_EXPIRE_MINUTES = Number(
  process.env.ACCESS_TOKEN_EXPIRE_MINUTES || 60 * 24 * 7
);

export class AuthService {
  repo: UserRepository;
  blacklisted: Set<string>;
  constructor(repo?: UserRepository) {
    this.repo = repo || new UserRepository();
    this.blacklisted = new Set();
  }

  createAccessToken(
    data: Record<string, any>,
    expiresMinutes?: number
  ): string {
    const payload = { ...data };
    const expiresIn = `${expiresMinutes || ACCESS_TOKEN_EXPIRE_MINUTES}m`;
    const options: SignOptions = {
      algorithm: ALGORITHM as unknown as SignOptions['algorithm'],
      expiresIn: expiresIn as any,
    };
    return jwt.sign(payload, SECRET_KEY as unknown as Secret, options);
  }

  async login(
    email: string,
    password: string,
    expiresMinutes?: number
  ): Promise<{ user: UserItem; token: string }> {
    if (!email || !password) throw new Error('Email and password are required');
    let user = await this.repo.findByEmail(email);

    if (user) {
      try {
        this.ensureLoginAllowed(user as UserItem);
      } catch (e: any) {
        throw new Error(String(e?.message ?? e));
      }
    }

    if (user && (user as any).password) {
      try {
        const hashed = (user as any).password as string;
        if (!verifyPassword(password, hashed))
          throw new Error('Invalid credentials');
        const userData: UserItem = { ...user };
        delete (userData as any).password;
        this.ensureLoginAllowed(userData);
        const token = this.createAccessToken(
          { user_id: user.id },
          expiresMinutes
        );
        return { user: userData, token };
      } catch (e: any) {
        const msg = String(e?.message ?? e);
        if (/Acceso restringido|restricted|premium|admin/i.test(msg)) {
          throw new Error(msg);
        }
        throw new Error('Invalid credentials');
      }
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey =
      process.env.SUPABASE_SERVICE_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
    if (!supabaseUrl || !serviceKey) throw new Error('Authentication error');
    try {
      const res = await fetch(
        `${supabaseUrl}/auth/v1/token?grant_type=password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: serviceKey,
          },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await res.json();
      if (!res.ok || data.error) throw new Error('Invalid credentials');
      const supaUser = data.user;
      if (!supaUser) throw new Error('Invalid credentials');

      user = await this.repo.findByEmail(email);
      if (!user) {
        const fullName =
          supaUser.user_metadata?.full_name ||
          supaUser.user_metadata?.name ||
          email;
        const newId = await this.repo.createUser({
          full_name: fullName,
          email,
        });
        user = await this.repo.findByUserId(String(newId));
      }

      if (!user) throw new Error('Authentication error');
      const userData: UserItem = { ...user };
      delete (userData as any).password;
      this.ensureLoginAllowed(userData);
      const token = this.createAccessToken(
        { user_id: user.id },
        expiresMinutes
      );
      return { user: userData, token };
    } catch (e: any) {
      const msg = String(e?.message ?? e);
      if (/Acceso restringido|restricted|premium|admin/i.test(msg)) {
        throw new Error(msg);
      }
      throw new Error('Invalid credentials');
    }
  }

  async register(
    full_name: string,
    email: string,
    password: string,
    phone?: string,
    expiresMinutes?: number
  ): Promise<{ user: UserItem; token: string }> {
    if (!email || !full_name)
      throw new Error('Email and fullname are required');
    const existing = await this.repo.findByEmail(email);
    if (existing) throw new Error('Email already exists');
    const user_id = await this.repo.createUser({
      full_name,
      email,
      phone,
    });
    const user = await this.repo.findByUserId(String(user_id));
    if (!user) throw new Error('Registration error');
    const userData: UserItem = { ...user };
    delete (userData as any).password;
    return { user: userData, token: '' };
  }

  logout(token: string) {
    this.blacklisted.add(token);
    return { success: true, message: 'Successful logout' };
  }

  async verifyToken(token: string): Promise<UserItem> {
    try {
      const payload: any = jwt.verify(token, SECRET_KEY as unknown as Secret);
      const user_id = payload.user_id;
      if (!user_id) throw new Error('Invalid Token');
      const user = await this.repo.findByUserId(String(user_id));
      if (!user) throw new Error('User not found');
      this.ensureLoginAllowed(user as UserItem);
      return user;
    } catch (e) {
      throw new Error('Invalid Token');
    }
  }

  isTokenBlacklisted(token: string) {
    return this.blacklisted.has(token);
  }

  async getListUsers(): Promise<{ success: true; users: UserItem[] }> {
    const users = await this.repo.findAllUsers();
    return { success: true, users };
  }

  async getProfileUser(
    user_id: string
  ): Promise<{ success: true; user: UserItem | null }> {
    const user = await this.repo.findByUserId(user_id);
    return { success: true, user };
  }

  async updateProfile(
    user_id: string,
    updates: Record<string, any>
  ): Promise<{ success: true; user: UserItem }> {
    const user = await this.repo.updateProfile(user_id, updates);
    return { success: true, user };
  }

  async setPolarApiKey(user_id: string, apiKey: string | null) {
    await this.repo.updateProfile(user_id, { polar_api_key: apiKey });
    return { success: true };
  }

  async getPolarApiKey(user_id: string): Promise<string | null> {
    const key = await this.repo.getDecryptedPolarKey(user_id);
    return key;
  }

  async uploadProfileImage(
    user_id: string,
    file: File
  ): Promise<{ success: true; user: UserItem }> {
    try {
      const url = await uploadProfileImage(file as any);
      const user = await this.repo.updateProfile(user_id, {
        profile_image: url,
      });
      return { success: true, user };
    } catch (e: any) {
      throw new Error(String(e?.message ?? e));
    }
  }

  async deleteProfileImage(
    user_id: string
  ): Promise<{ success: true; user: UserItem }> {
    const user = await this.repo.updateProfile(user_id, {
      profile_image: null,
    });
    return { success: true, user };
  }

  async updateProfileImage(
    user_id: string,
    file: File
  ): Promise<{ success: true; user: UserItem }> {
    try {
      const url = await uploadProfileImage(file as any);
      const user = await this.repo.updateProfile(user_id, {
        profile_image: url,
      });
      return { success: true, user };
    } catch (e: any) {
      throw new Error(String(e?.message ?? e));
    }
  }

  async deleteUser(
    user_id: string
  ): Promise<{ success: true; user: UserItem | null }> {
    const user = await this.repo.deleteUser(user_id);
    return { success: true, user };
  }

  ensureLoginAllowed(user: UserItem) {
    const role = (user.role || 'user').toString();
    if (role === 'admin') return;
    if (role === 'guest') return;
    if (role === 'premium') {
      const until = user.premium_up_to ? Date.parse(user.premium_up_to) : NaN;
      if (!isNaN(until) && until > Date.now()) return;
    }
    throw new Error(
      'Acceso restringido. Requiere plan Premium o Admin. Ve a /upgrade para mejorar tu plan.'
    );
  }

  async promoteToPremium(
    user_id: string,
    months: number = 1
  ): Promise<{ success: true; user: UserItem }> {
    const user = await this.repo.findByUserId(user_id);
    if (!user) throw new Error('User not found');
    const now = new Date();
    const currentUntil = user.premium_up_to
      ? new Date(user.premium_up_to)
      : null;
    let base = now;
    if (currentUntil && currentUntil.getTime() > now.getTime())
      base = currentUntil;
    const newUntil = new Date(base);
    newUntil.setMonth(newUntil.getMonth() + months);
    const updated = await this.repo.updateProfile(user_id, {
      role: 'premium',
      premium_up_to: newUntil.toISOString(),
    });
    return { success: true, user: updated };
  }

  async promoteEmailToPremium(
    email: string,
    months: number = 1
  ): Promise<{ success: true; user: UserItem } | { success: false }> {
    const user = await this.repo.findByEmail(email);
    if (!user) return { success: false };
    const res = await this.promoteToPremium(String(user.id), months);
    return res;
  }
}
