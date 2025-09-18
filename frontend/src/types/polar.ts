export interface PolarProductPrice {
  created_at: string;
  modified_at: string;
  id: string;
  amount_type: string;
  is_archived: boolean;
  product_id: string;
  type: string;
  recurring_interval?: 'day' | 'week' | 'month' | 'year';
  price_currency: string;
  price_amount: number;
  legacy: boolean;
}

export interface PolarBenefit {
  id: string;
  created_at: string;
  modified_at: string;
  type: 'custom' | 'discord' | 'github_repository' | 'ads';
  description: string;
  selectable: boolean;
  deletable: boolean;
  organization_id: string;
  metadata: Record<string, any>;
  properties: {
    note?: string;
  };
}

export interface PolarMedia {
  id: string;
  organization_id: string;
  name: string;
  path: string;
  mime_type: string;
  size: number;
  public_url: string;
  storage_version?: string;
  checksum_etag?: string;
  checksum_sha256_base64?: string;
  checksum_sha256_hex?: string;
  last_modified_at?: string;
  version?: string;
  service?: string;
  is_uploaded?: boolean;
  created_at?: string;
  size_readable?: string;
}

export interface PolarProduct {
  created_at: string;
  modified_at: string;
  id: string;
  name: string;
  description: string;
  recurring_interval?: 'day' | 'week' | 'month' | 'year';
  is_recurring: boolean;
  is_archived: boolean;
  organization_id: string;
  metadata: Record<string, any>;
  prices: PolarProductPrice[];
  benefits: PolarBenefit[];
  medias: PolarMedia[];
}

export interface PolarPagination {
  total_count: number;
  max_page: number;
}

export interface PolarProductsListResponse {
  items: PolarProduct[];
  pagination: PolarPagination;
}

export interface PolarProductsListParams {
  organization_id?: string;
  is_archived?: boolean;
  is_recurring?: boolean;
  query?: string;
  page?: number;
  limit?: number;
}

export interface PolarProductCreateBody {
  name: string;
  description?: string;
  organization_id: string;
  recurring_interval?: 'day' | 'week' | 'month' | 'year';
  is_recurring?: boolean;
  prices?: Partial<PolarProductPrice>[];
  benefits?: string[];
  metadata?: Record<string, any>;
}

export interface PolarProductUpdateBody {
  name?: string;
  description?: string;
  prices?: Partial<PolarProductPrice>[];
  benefits?: string[];
  is_archived?: boolean;
  metadata?: Record<string, any>;
}

export interface PolarFileUploadRequest {
  name: string;
  mime_type: string;
  size: number;
  organization_id?: string;
}

export interface PolarFileUploadResponse {
  id: string;
  organization_id: string;
  name: string;
  path: string;
  mime_type: string;
  size: number;
  upload_url?: string;
  public_url?: string;
  created_at: string;
  is_uploaded: boolean;
}

export interface PolarFilesListResponse {
  items: PolarMedia[];
  pagination: PolarPagination;
}
