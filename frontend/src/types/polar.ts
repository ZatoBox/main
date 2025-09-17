export interface PolarProductPrice {
  amountType: 'fixed' | 'free' | 'pay_what_you_want';
  priceAmount?: number;
  priceCurrency?: string;
}

export interface PolarProductMedia {
  id: string;
  url: string;
  type: 'image' | 'video';
}

export interface PolarProduct {
  id: string;
  name: string;
  description?: string | null;
  isArchived?: boolean;
  isRecurring?: boolean;
  organizationId: string;
  prices?: PolarProductPrice[];
  benefits?: string[];
  media?: PolarProductMedia[];
  createdAt: string;
  modifiedAt?: string;
}

export interface PolarProductsListParams {
  organizationId?: string;
  isArchived?: boolean;
  isRecurring?: boolean;
  query?: string;
  page?: number;
  limit?: number;
}

export interface PolarProductsListResponsePage {
  items: PolarProduct[];
  nextPage?: number | null;
  prevPage?: number | null;
}

export interface PolarProductCreateBody {
  name: string;
  description?: string | null;
  organizationId: string;
  recurringInterval?: 'month' | 'year' | null;
  prices?: PolarProductPrice[];
  benefits?: string[];
}

export interface PolarProductUpdateBody {
  name?: string;
  description?: string | null;
  prices?: PolarProductPrice[];
  benefits?: string[];
  isArchived?: boolean;
}
