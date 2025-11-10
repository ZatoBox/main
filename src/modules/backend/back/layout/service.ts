import { LayoutRepository } from './repository';

export class LayoutService {
  repo: LayoutRepository;
  constructor(repo?: LayoutRepository) {
    this.repo = repo || new LayoutRepository();
  }

  async createLayout(layoutData: any, owner_id: string) {
    return this.repo.createLayout({ ...layoutData, owner_id });
  }

  async listLayouts() {
    return this.repo.findAll();
  }

  async getLayout(layout_slug: string) {
    if (!layout_slug || typeof layout_slug !== 'string')
      throw new Error('Invalid layout slug');
    const layout = await this.repo.findBySlug(layout_slug);
    if (!layout) throw new Error('Layout not found');
    return layout;
  }

  async updateLayout(layout_slug: string, updates: any) {
    const allowed = ['hero_title', 'web_description', 'banner', 'social_links'];
    for (const k of Object.keys(updates)) {
      if (!allowed.includes(k)) throw new Error(`Invalid field: ${k}`);
    }
    for (const fld of [
      'hero_title',
      'web_description',
      'banner',
      'social_links',
    ]) {
      const val = updates[fld];
      if (val === '' || val == null) delete updates[fld];
    }
    return this.repo.updateLayout(layout_slug, updates);
  }

  async deleteLayout(layout_slug: string) {
    return this.repo.deleteLayout(layout_slug);
  }

  async listLayoutsByOwner(owner_id: string) {
    return this.repo.findByOwner(owner_id);
  }
}
