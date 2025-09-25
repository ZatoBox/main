const BASE_URL = 'https://api.polar.sh/v1';

export const decryptApiKey = (rawKey: string): string => {
  if (!rawKey || rawKey.trim() === '') throw new Error('Missing Polar API key');
  return rawKey;
};

export const polarAPI = {
  async listProducts(
    apiKey: string,
    organizationId?: string,
    options?: { includeArchived?: boolean }
  ): Promise<any[]> {
    const token = decryptApiKey(apiKey);
    const includeArchived = options?.includeArchived ?? false;

    const fetchPage = async (archivedValue: 'true' | 'false') => {
      const params = new URLSearchParams();
      params.set('expand', 'medias,prices,benefits');
      params.set('limit', '100');
      params.set('is_archived', archivedValue);
      if (organizationId && organizationId.trim() !== '') {
        params.set('organization_id', organizationId.trim());
      }
      const url = `${BASE_URL}/products${
        params.toString() ? `?${params.toString()}` : ''
      }`;
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to list products');
      }
      const data: any = await res.json();
      const items = Array.isArray(data)
        ? data
        : Array.isArray(data.items)
        ? data.items
        : [];
      return items;
    };

    if (!includeArchived) {
      return fetchPage('false');
    }

    const [active, archived] = await Promise.all([
      fetchPage('false'),
      fetchPage('true'),
    ]);
    const seen = new Set<string>();
    const merged = [...active, ...archived].filter((item: any) => {
      const identifier = String(item?.id ?? '');
      if (seen.has(identifier)) return false;
      seen.add(identifier);
      return true;
    });
    return merged;
  },

  async getProduct(apiKey: string, productId: string): Promise<any> {
    const token = decryptApiKey(apiKey);
    const params = new URLSearchParams();
    params.set('include', 'medias,prices,benefits');

    const res = await fetch(
      `${BASE_URL}/products/${productId}?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }
    );
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Failed to get product');
    }
    const product = await res.json();
    return product;
  },

  async createProduct(apiKey: string, productData: any): Promise<any> {
    const token = decryptApiKey(apiKey);
    const body: any = {
      name: productData.name,
      description: productData.description,
      recurring_interval:
        typeof productData.recurring_interval === 'undefined'
          ? null
          : productData.recurring_interval,
      prices: Array.isArray(productData.prices) ? productData.prices : [],
      metadata: productData.metadata || undefined,
    };
    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Failed to create product');
    }
    return res.json();
  },

  async updateProduct(
    apiKey: string,
    productId: string,
    productData: any
  ): Promise<any> {
    const token = decryptApiKey(apiKey);
    const body: Record<string, unknown> = {};
    if (Object.prototype.hasOwnProperty.call(productData, 'name')) {
      body.name = productData.name;
    }
    if (Object.prototype.hasOwnProperty.call(productData, 'description')) {
      body.description = productData.description;
    }
    if (Object.prototype.hasOwnProperty.call(productData, 'prices')) {
      body.prices = productData.prices;
    }
    if (
      Object.prototype.hasOwnProperty.call(productData, 'recurring_interval')
    ) {
      body.recurring_interval = productData.recurring_interval;
    }
    if (Object.prototype.hasOwnProperty.call(productData, 'is_archived')) {
      body.is_archived = productData.is_archived;
    }
    if (Object.prototype.hasOwnProperty.call(productData, 'metadata')) {
      body.metadata = productData.metadata;
    }
    const res = await fetch(`${BASE_URL}/products/${productId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Failed to update product');
    }
    return res.json();
  },

  async deleteProduct(apiKey: string, productId: string): Promise<void> {
    const token = decryptApiKey(apiKey);
    const res = await fetch(`${BASE_URL}/products/${productId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_archived: true }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Failed to archive product');
    }
  },

  async uploadFile(
    apiKey: string,
    file: File,
    organizationId: string,
    service: string = 'product_media'
  ): Promise<any> {
    const token = decryptApiKey(apiKey);
    const initRes = await fetch(`${BASE_URL}/files`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: file.name,
        mime_type: (file as any).type || 'application/octet-stream',
        size: (file as any).size || 0,
        organization_id: organizationId,
        service,
      }),
    });
    if (!initRes.ok) {
      const text = await initRes.text();
      throw new Error(text || 'Failed to initialize file upload');
    }
    const info = await initRes.json();
    if (info.upload_url) {
      const putRes = await fetch(info.upload_url, {
        method: 'PUT',
        headers: {
          'Content-Type': (file as any).type || 'application/octet-stream',
        },
        body: file as any,
      });
      if (!putRes.ok) {
        const text = await putRes.text();
        throw new Error(text || 'Failed to upload file');
      }
      const confirmRes = await fetch(`${BASE_URL}/files/${info.id}/uploaded`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      if (!confirmRes.ok) {
        const text = await confirmRes.text();
        throw new Error(text || 'Failed to confirm upload');
      }
      const confirmed = await confirmRes.json();
      return confirmed || info;
    }
    return info;
  },
};

export const mapPolarProductToProduct = (p: any) => {
  const prices = Array.isArray(p.prices) ? p.prices : [];
  let price = 0;
  if (prices.length > 0) {
    const pr = prices[0] || {};
    const amt = pr.price_amount ?? pr.priceAmount;
    const amtType = pr.amount_type ?? pr.amountType;
    if (typeof amt === 'number') {
      price = amtType === 'free' ? 0 : amt / 100;
    }
  }
  const imageUrls = Array.isArray(p.medias)
    ? p.medias
        .filter(
          (m: any) =>
            m &&
            typeof m.public_url === 'string' &&
            m.mime_type &&
            m.mime_type.startsWith('image/')
        )
        .map((m: any) => m.public_url)
    : [];
  const baseId = String(p.id ?? '');
  const safeName =
    typeof p.name === 'string'
      ? p.name.trim().replace(/\s+/g, '_').toLowerCase()
      : '';
  const stableId = safeName ? `polar_${baseId}_${safeName}` : `polar_${baseId}`;
  const isArchived = Boolean(p.is_archived);
  const product: any = {
    id: String(p.id ?? stableId),
    name: p.name || 'Unnamed Product',
    description: p.description || '',
    price,
    stock: p.metadata?.quantity || 0,
    min_stock: 0,
    category_ids: [],
    images: imageUrls,
    status: isArchived ? 'inactive' : 'active',
    weight: 0,
    sku: String(p.id),
    creator_id: '',
    unit: 'Per item',
    product_type: 'Physical Product',
    localization: '',
    created_at: p.created_at || p.createdAt || new Date().toISOString(),
    last_updated:
      p.modified_at || p.modifiedAt || p.updatedAt || new Date().toISOString(),
  };
  product.prices = prices;
  product.recurring_interval = p.recurring_interval;
  product.metadata = p.metadata;
  product.polar_id = p.id;
  product.client_id = stableId;
  product.is_archived = isArchived;
  return product;
};
