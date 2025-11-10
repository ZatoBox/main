import { CategoryRepository } from './repository';

export class CategoryService {
  repo: CategoryRepository;
  constructor(repo?: CategoryRepository) {
    this.repo = repo || new CategoryRepository();
  }

  async listCategories() {
    return this.repo.list();
  }

  async getCategory(category_id: string) {
    const category = await this.repo.get(category_id);
    if (!category) throw new Error('Category not found');
    return category;
  }
}
