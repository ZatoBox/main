import axios, { AxiosInstance } from 'axios';

export class TorGatewayClient {
  private client: AxiosInstance;
  private apiKey: string;
  private userId?: string;
  private apiUrl: string;
  private authToken?: string;

  constructor(apiUrl: string, apiKey: string, userId?: string) {
    const cleanUrl = apiUrl.replace(/\/$/, '');
    this.apiUrl = cleanUrl;
    this.client = axios.create({
      baseURL: cleanUrl,
      timeout: 30000,
      headers: {
        Authorization: `token ${apiKey}`,
        'Content-Type': 'application/json',
        ...(userId ? { 'x-user-id': userId } : {}),
      },
      withCredentials: true,
    });
    this.apiKey = apiKey;
    this.userId = userId;
  }

  private async ensureAuthenticated(): Promise<void> {
    if (this.authToken) return;

    try {
      const email = process.env.BTCPAY_EMAIL;
      const password = process.env.BTCPAY_PASSWORD;

      if (!email || !password) {
        console.warn('BTCPay credentials not found in environment');
        return;
      }

      const response = await axios.post(
        `${this.apiUrl}/api/v1/users/login`,
        { email, password },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      this.authToken = response.data?.token || response.data?.apiToken;
      if (this.authToken) {
        this.client.defaults.headers.common[
          'Authorization'
        ] = `token ${this.authToken}`;
      }
    } catch (error: any) {
      console.warn(
        'Failed to authenticate with BTCPay:',
        error.response?.status,
        error.message
      );
    }
  }

  async post(path: string, data: any) {
    await this.ensureAuthenticated();
    const response = await this.client.post(`/api/v1/${path}`, data);
    return response.data;
  }

  async get(path: string, params?: any) {
    await this.ensureAuthenticated();
    const response = await this.client.get(`/api/v1/${path}`, { params });
    return response.data;
  }

  async put(path: string, data: any) {
    await this.ensureAuthenticated();
    const response = await this.client.put(`/api/v1/${path}`, data);
    return response.data;
  }

  async delete(path: string) {
    await this.ensureAuthenticated();
    const response = await this.client.delete(`/api/v1/${path}`);
    return response.data;
  }
}
