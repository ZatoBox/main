export interface CreateLayoutRequest {
  slug: string;
  inventory_id: string;
  hero_title?: string | null;
  web_description?: string | null;
  banner?: string | null;
  social_links?: Record<string, unknown> | null;
}

export interface UpdateLayoutRequest {
  hero_title?: string | null;
  web_description?: string | null;
  banner?: string | null;
  social_links?: Record<string, unknown> | null;
}

export interface LayoutResponse {
  slug: string;
  owner_id: string;
  inventory_id: string;
  hero_title?: string | null;
  web_description?: string | null;
  banner?: string | null;
  social_links?: Record<string, unknown> | null;
  created_at?: string | null;
  last_updated?: string | null;
}
