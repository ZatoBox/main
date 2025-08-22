import { StringToBoolean } from 'class-variance-authority/types';

// Cookies
export interface CookieOptions {
  path?: string;
  expires?: number | Date;
  secure?: boolean;
  sameSite?: 'lax' | 'strict' | 'none';
}

// User
export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  address: string;
  role: string;
  created_at: Date;
  last_updated: Date;
}

// Product

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  min_stock: number;
  category_id: string;
  images: string[];
  status: 'active' | 'inactive';
  weight?: number;
  sku: string;
  creator_id: string;
  product_type: 'physical' | 'digital' | 'service';
  localization: string;
  created_at: Date;
  last_update: Date;
}


// Categories

export interface Category {
  id: string;
  name: string;
}