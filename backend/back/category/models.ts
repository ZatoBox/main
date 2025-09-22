export interface Category {
  id: string;
  name: string;
  created_at?: string | null;
  last_updated?: string | null;
}

export interface CategoryResponse {
  success: boolean;
  category: Category;
}

export interface CategoriesResponse {
  success: boolean;
  categories: Category[];
}
