import axios, { AxiosInstance } from 'axios';

export class TorGatewayClient {
  private client: AxiosInstance;
  private userId?: string;

  constructor(
    gatewayUrl: string = process.env.TOR_GATEWAY_URL ||
      'http://tor-gateway:3001',
    userId?: string
  ) {
    this.client = axios.create({
      baseURL: gatewayUrl,
      timeout: 30000,
      headers: userId ? { 'x-user-id': userId } : {},
    });
    this.userId = userId;
  }

  async post(path: string, data: any) {
    const response = await this.client.post(`/api/btcpay/${path}`, data);
    return response.data;
  }

  async get(path: string, params?: any) {
    const response = await this.client.get(`/api/btcpay/${path}`, { params });
    return response.data;
  }

  async put(path: string, data: any) {
    const response = await this.client.put(`/api/btcpay/${path}`, data);
    return response.data;
  }

  async delete(path: string) {
    const response = await this.client.delete(`/api/btcpay/${path}`);
    return response.data;
  }
}
