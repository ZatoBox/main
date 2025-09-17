import { Polar } from '@polar-sh/sdk';
import { decryptData } from './crypto.utils';

export const decryptApiKey = (encryptedKey: string): string => {
  if (!encryptedKey || encryptedKey.trim() === '') {
    return process.env.POLAR_ACCESS_TOKEN || '';
  }

  const decrypted = decryptData(encryptedKey);
  if (!decrypted || decrypted === encryptedKey) {
    return process.env.POLAR_ACCESS_TOKEN || '';
  }

  return decrypted;
};

export const polarAPI = {
  async listProducts(apiKey: string, organizationId?: string): Promise<any[]> {
    const client = new Polar({
      accessToken: decryptApiKey(apiKey),
    });

    const listArgs: any = {};
    const uuidRegex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    if (organizationId && uuidRegex.test(organizationId)) {
      listArgs.organizationId = organizationId;
    }

    const result = await client.products.list(listArgs);

    const products: any[] = [];
    for await (const page of result) {
      const items = (page as any)?.items ?? page;
      if (Array.isArray(items)) {
        products.push(...items);
      }
    }
    return products;
  },

  async getProduct(apiKey: string, productId: string): Promise<any> {
    const client = new Polar({
      accessToken: decryptApiKey(apiKey),
    });

    const result = await client.products.get({
      id: productId,
    });
    return result;
  },

  async createProduct(apiKey: string, productData: any): Promise<any> {
    const client = new Polar({
      accessToken: decryptApiKey(apiKey),
    });

    const result = await client.products.create({
      name: productData.name,
      description: productData.description,
      organizationId: productData.organization_id,
      recurringInterval: productData.recurringInterval || 'month',
      prices: productData.prices || [{ amountType: 'free' }],
    });
    return result;
  },

  async updateProduct(
    apiKey: string,
    productId: string,
    productData: any
  ): Promise<any> {
    const client = new Polar({
      accessToken: decryptApiKey(apiKey),
    });

    const result = await client.products.update({
      id: productId,
      productUpdate: {
        name: productData.name,
        description: productData.description,
        prices: productData.prices,
        isArchived: productData.isArchived,
      },
    });
    return result;
  },

  async deleteProduct(apiKey: string, productId: string): Promise<void> {
    const client = new Polar({
      accessToken: decryptApiKey(apiKey),
    });

    try {
      await client.products.update({
        id: productId,
        productUpdate: {
          isArchived: true,
        },
      });
    } catch (error) {
      throw new Error('Failed to archive product');
    }
  },
};
