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
    const unit_val = (product_data as any).unit ?? product_data.unit;
    const type_val =
      (product_data as any).product_type ?? product_data.product_type;
    const category_ids_val = (product_data as any).category_ids || [];
    if (!Array.isArray(category_ids_val))
      throw new Error('category_ids must be a list');
    for (const cid of category_ids_val) {
      if (typeof cid !== 'string' || !cid)
        throw new Error('Invalid category id in category_ids');
    }
    const initial_images: string[] = [];
    if (initial_images.length > MAX_IMAGES)
      throw new Error('Maximum 4 images allowed');
    return this.repo.createProduct({
      name: product_data.name,
      description: product_data.description ?? null,
      price: Number(product_data.price),
      stock: Number(product_data.stock),
      unit: unit_val,
      product_type: type_val,
      category_ids: category_ids_val,
      sku: product_data.sku ?? null,
      min_stock: Number((product_data as any).min_stock ?? 0),
      status: (product_data as any).status ?? 'active',
      weight: (product_data as any).weight ?? null,
      localization: (product_data as any).localization ?? null,
      creator_id: String(creator_id),
      images: initial_images,
    });
  }

  async listProducts(creator_id: string) {
    return this.repo.findByCreator(creator_id);
  }

  async searchByCategory(category: string) {
    return this.repo.findByName(category);
  }

  async searchByName(name: string) {
    return this.repo.findByName(name);
  }

  async getProduct(product_id: string) {
    if (!product_id) throw new Error('Invalid product ID');
    const product = await this.repo.findById(product_id);
    if (!product) throw new Error('Product not found');
    return product;
  }

  async updateProduct(
    product_id: string,
    updates: Record<string, any>,
    user_timezone: string = 'UTC'
  ) {
    if (!product_id) throw new Error('Invalid product ID');
    const allowed_fields = [
      'name',
      'description',
      'price',
      'stock',
      'category_ids',
      'images',
      'sku',
      'weight',
      'localization',
      'min_stock',
      'status',
      'product_type',
      'unit',
    ];
    for (const field of Object.keys(updates)) {
      if (!allowed_fields.includes(field))
        throw new Error(`Invalid field: ${field}`);
    }
    for (const fld of [
      'product_type',
      'unit',
      'category_ids',
      'description',
      'localization',
      'sku',
      'status',
    ]) {
      const val = updates[fld];
      if (val === '' || val === null || val === undefined) delete updates[fld];
    }
    if ('category_ids' in updates) {
      if (!Array.isArray(updates['category_ids']))
        throw new Error('category_ids must be a list');
      const cleaned: string[] = [];
      for (const cid of updates['category_ids']) {
        if (typeof cid !== 'string' || !cid)
          throw new Error('Invalid category id in category_ids');
        cleaned.push(cid);
      }
      updates['category_ids'] = cleaned;
    }
    if ('price' in updates) {
      const v = Number(updates['price']);
      if (Number.isNaN(v) || v <= 0) throw new Error('Invalid price value');
      updates['price'] = v;
    }
    if ('stock' in updates) {
      const v = Number(updates['stock']);
      if (!Number.isInteger(v) || v < 0) throw new Error('Invalid stock value');
      updates['stock'] = v;
    }
    if ('min_stock' in updates) {
      const v = Number(updates['min_stock']);
      if (!Number.isInteger(v) || v < 0)
        throw new Error('Invalid min_stock value');
      updates['min_stock'] = v;
    }
    if ('weight' in updates) {
      const v = Number(updates['weight']);
      if (Number.isNaN(v) || v < 0) throw new Error('Invalid weight value');
      updates['weight'] = v;
    }
    return this.repo.updateProduct(product_id, updates);
  }

  async addImages(product_id: string, new_images: string[]) {
    if (!product_id) throw new Error('Invalid product ID');
    if (new_images.length > MAX_IMAGES)
      throw new Error('Maximum 4 images allowed');
    const product = await this.repo.findById(product_id);
    if (!product) throw new Error('Product not found');
    const current = product.images || [];
    if (current.length + new_images.length > MAX_IMAGES)
      throw new Error('Maximum 4 images allowed');
    return this.repo.addImages(product_id, new_images);
  }

  async getImages(product_id: string) {
    if (!product_id) throw new Error('Invalid product ID');
    return this.repo.getImages(product_id);
  }

  async deleteImage(product_id: string, image_index: number) {
    if (!product_id) throw new Error('Invalid product ID');
    return this.repo.deleteImage(product_id, image_index);
  }

  async updateImages(product_id: string, new_images: string[]) {
    if (!product_id) throw new Error('Invalid product ID');
    if (new_images.length > MAX_IMAGES)
      throw new Error('Maximum 4 images allowed');
    return this.repo.updateImages(product_id, new_images);
  }

  async deleteProduct(product_id: string) {
    if (!product_id) throw new Error('Invalid product ID');
    return this.repo.deleteProduct(product_id);
  }
}
