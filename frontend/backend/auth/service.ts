import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { UserRepository } from './repository';
import type { UserItem } from './models';
import { hashPassword, verifyPassword } from '@/utils/password';
import { uploadProfileImage } from '@/utils/cloudinary';

const SECRET_KEY = process.env.SECRET_KEY;
const ALGORITHM = 'HS256';
const ACCESS_TOKEN_EXPIRE_MINUTES = Number(
  process.env.ACCESS_TOKEN_EXPIRE_MINUTES || 60
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
    password: string
  ): Promise<{ user: UserItem; token: string }> {
    if (!email || !password) throw new Error('Email and password are required');
    const user = await this.repo.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');
    try {
      const hashed = (user as any).password as string | undefined;
      if (!hashed || !verifyPassword(password, hashed))
        throw new Error('Invalid credentials');
    } catch (e) {
      throw new Error('Authentication error');
    }
    const userData: UserItem = { ...user };
    delete (userData as any).password;
    const token = this.createAccessToken({ user_id: user.id });
    return { user: userData, token };
  }

  async register(
    full_name: string,
    email: string,
    password: string,
    phone?: string
  ): Promise<{ user: UserItem; token: string }> {
    if (!email || !password || !full_name)
      throw new Error('Email, password and fullname are required');
    const existing = await this.repo.findByEmail(email);
    if (existing) throw new Error('Email already exists');
    const hashed = hashPassword(password);
    const user_id = await this.repo.createUser({
      full_name,
      email,
      password: hashed,
      phone,
    });
    return this.login(email, password);
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
}
