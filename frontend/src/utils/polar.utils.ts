const BASE_URL = 'https://api.polar.sh/v1';

export const decryptApiKey = (rawKey: string): string => {
  if (!rawKey || rawKey.trim() === '') throw new Error('Missing Polar API key');
  return rawKey;
};

export const polarAPI = {
  async listProducts(apiKey: string, organizationId?: string): Promise<any[]> {
    const token = decryptApiKey(apiKey);
    const params = new URLSearchParams();
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
    console.log('POLAR listProducts', {
      hasOrg: !!organizationId,
      count: items.length,
      sample: items[0]?.id || null,
    });
    return items;
  },

  async getProduct(apiKey: string, productId: string): Promise<any> {
    const token = decryptApiKey(apiKey);
    const res = await fetch(`${BASE_URL}/products/${productId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Failed to get product');
    }
    return res.json();
  },

  async createProduct(apiKey: string, productData: any): Promise<any> {
    const token = decryptApiKey(apiKey);
    const body = {
      name: productData.name,
      description: productData.description,
      organization_id:
        productData.organization_id || productData.organizationId,
      recurring_interval:
        productData.recurring_interval ||
        productData.recurringInterval ||
        'month',
      prices: productData.prices || [{ amount_type: 'free' }],
    } as any;
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
    const body: any = {
      name: productData.name,
      description: productData.description,
      prices: productData.prices,
      is_archived: productData.is_archived,
    };
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
};
