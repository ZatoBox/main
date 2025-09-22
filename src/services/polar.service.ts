import axios, { AxiosInstance } from 'axios';
import {
  PolarProduct,
  PolarProductsListResponse,
  PolarProductsListParams,
  PolarProductCreateBody,
  PolarProductUpdateBody,
  PolarFileUploadRequest,
  PolarFileUploadResponse,
  PolarFilesListResponse,
} from '@/types/polar';

class PolarService {
  private api: AxiosInstance;

  constructor() {
    const baseURL = 'https://api.polar.sh/v1';
    const accessToken = process.env.POLAR_ACCESS_TOKEN;

    if (!accessToken) {
      throw new Error('POLAR_ACCESS_TOKEN is required');
    }

    this.api = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async getProducts(
    params?: PolarProductsListParams
  ): Promise<PolarProductsListResponse> {
    const response = await this.api.get('/products/', { params });
    return response.data;
  }

  async getProduct(id: string): Promise<PolarProduct> {
    const response = await this.api.get(`/products/${id}`);
    return response.data;
  }

  async createProduct(data: PolarProductCreateBody): Promise<PolarProduct> {
    const response = await this.api.post('/products/', data);
    return response.data;
  }

  async updateProduct(
    id: string,
    data: PolarProductUpdateBody
  ): Promise<PolarProduct> {
    const response = await this.api.patch(`/products/${id}`, data);
    return response.data;
  }

  async deleteProduct(id: string): Promise<PolarProduct> {
    const response = await this.api.patch(`/products/${id}`, {
      is_archived: true,
    });
    return response.data;
  }

  async uploadFile(
    file: File,
    organizationId: string
  ): Promise<PolarFileUploadResponse> {
    const fileData: PolarFileUploadRequest = {
      name: file.name,
      mime_type: file.type,
      size: file.size,
      organization_id: organizationId,
    };

    const createResponse = await this.api.post('/files/', fileData);
    const fileInfo: PolarFileUploadResponse = createResponse.data;

    if (fileInfo.upload_url) {
      await axios.put(fileInfo.upload_url, file, {
        headers: {
          'Content-Type': file.type,
        },
      });

      await this.api.post(`/files/${fileInfo.id}/uploaded`);
    }

    return fileInfo;
  }

  async getFiles(organizationId?: string): Promise<PolarFilesListResponse> {
    const params = organizationId ? { organization_id: organizationId } : {};
    const response = await this.api.get('/files/', { params });
    return response.data;
  }

  async deleteFile(id: string): Promise<void> {
    await this.api.delete(`/files/${id}`);
  }

  async addImageToProduct(
    productId: string,
    fileId: string
  ): Promise<PolarProduct> {
    const product = await this.getProduct(productId);
    const mediaIds = product.medias?.map((m) => m.id) || [];

    if (!mediaIds.includes(fileId)) {
      mediaIds.push(fileId);
    }

    return this.updateProduct(productId, {
      metadata: {
        ...product.metadata,
        media_ids: mediaIds,
      },
    });
  }

  async removeImageFromProduct(
    productId: string,
    fileId: string
  ): Promise<PolarProduct> {
    const product = await this.getProduct(productId);
    const mediaIds =
      product.medias?.map((m) => m.id).filter((id) => id !== fileId) || [];

    return this.updateProduct(productId, {
      metadata: {
        ...product.metadata,
        media_ids: mediaIds,
      },
    });
  }
}

export const polarService = new PolarService();
