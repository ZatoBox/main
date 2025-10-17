import { ProductRepository } from './repository';
import type {
  CreateProductRequest,
  UpdateProductRequest,
  Product,
} from './models';

const MAX_IMAGES = 4;

export class ProductService {
  repo: ProductRepository;
  constructor(repo?: ProductRepository) {
    this.repo = repo || new ProductRepository();
  }

  async createProduct(
    product_data: CreateProductRequest,
    creator_id: string
  ): Promise<Product> {
    const categories = Array.isArray(product_data.categories)
      ? product_data.categories
      : [];
    const images = Array.isArray(product_data.images)
      ? product_data.images.slice(0, MAX_IMAGES)
      : [];

    if (images.length > MAX_IMAGES) {
      throw new Error('Maximum 4 images allowed');
    }

    return this.repo.createProduct({
      creator_id: String(creator_id),
      name: product_data.name,
      description: product_data.description ?? null,
      stock: Number(product_data.stock),
      categories,
      price: Number(product_data.price),
      sku: product_data.sku ?? null,
      images,
      active: true,
    });
  }

  async listProducts(creator_id: string, includeInactive = false) {
    if (includeInactive) {
      return this.repo.findByCreator(creator_id);
    }
    return this.repo.findActiveByCreator(creator_id);
  }

  async getProduct(product_id: string) {
    if (!product_id) throw new Error('Invalid product ID');
    const product = await this.repo.findById(product_id);
    if (!product) throw new Error('Product not found');
    return product;
  }

  async updateProduct(
    product_id: string,
    updates: UpdateProductRequest
  ): Promise<Product> {
    if (!product_id) throw new Error('Invalid product ID');

    const cleanUpdates: Record<string, any> = {};

    if (updates.name !== undefined) {
      cleanUpdates.name = updates.name;
    }

    if (updates.description !== undefined) {
      cleanUpdates.description = updates.description;
    }

    if (updates.price !== undefined) {
      const v = Number(updates.price);
      if (Number.isNaN(v) || v < 0) throw new Error('Invalid price value');
      cleanUpdates.price = v;
    }

    if (updates.stock !== undefined) {
      const v = Number(updates.stock);
      if (!Number.isInteger(v) || v < 0) throw new Error('Invalid stock value');
      cleanUpdates.stock = v;
    }

    if (updates.categories !== undefined) {
      if (!Array.isArray(updates.categories)) {
        throw new Error('categories must be an array');
      }
      cleanUpdates.categories = updates.categories;
    }

    if (updates.sku !== undefined) {
      cleanUpdates.sku = updates.sku;
    }

    if (updates.images !== undefined) {
      if (!Array.isArray(updates.images)) {
        throw new Error('images must be an array');
      }
      if (updates.images.length > MAX_IMAGES) {
        throw new Error('Maximum 4 images allowed');
      }
      cleanUpdates.images = updates.images;
    }

    if (updates.active !== undefined) {
      cleanUpdates.active = Boolean(updates.active);
    }

    return this.repo.updateProduct(product_id, cleanUpdates);
  }

  async deleteProduct(product_id: string) {
    if (!product_id) throw new Error('Invalid product ID');
    return this.repo.deleteProduct(product_id);
  }

  async archiveProduct(product_id: string) {
    if (!product_id) throw new Error('Invalid product ID');
    return this.repo.updateProduct(product_id, { active: false });
  }

  async activateProduct(product_id: string) {
    if (!product_id) throw new Error('Invalid product ID');
    return this.repo.updateProduct(product_id, { active: true });
  }
}
