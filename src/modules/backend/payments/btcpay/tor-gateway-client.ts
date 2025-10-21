import axios, { AxiosInstance } from 'axios';

export class TorGatewayClient {
  private client: AxiosInstance;
  private apiKey: string;
  private userId?: string;

  constructor(apiUrl: string, apiKey: string, userId?: string) {
    const cleanUrl = apiUrl.replace(/\/$/, '');
    this.client = axios.create({
      baseURL: cleanUrl,
      timeout: 30000,
      headers: {
        Authorization: `token ${apiKey}`,
        'Content-Type': 'application/json',
        ...(userId ? { 'x-user-id': userId } : {}),
      },
    });
    this.apiKey = apiKey;
    this.userId = userId;
  }

  async post(path: string, data: any) {
    const response = await this.client.post(`/api/v1/${path}`, data);
    return response.data;
  }

  async get(path: string, params?: any) {
    const response = await this.client.get(`/api/v1/${path}`, { params });
    return response.data;
  }

  async put(path: string, data: any) {
    const response = await this.client.put(`/api/v1/${path}`, data);
    return response.data;
  }

  async delete(path: string) {
    const response = await this.client.delete(`/api/v1/${path}`);
    return response.data;
  }
}
