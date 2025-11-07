import axios, { AxiosInstance } from 'axios';

export class BTCPayHTTPClient {
  private client: AxiosInstance;
  private apiKey: string;
  private userId?: string;

  constructor(apiUrl: string, apiKey: string, userId?: string) {
    let cleanUrl = apiUrl.trim().replace(/\/$/, '');
    if (!cleanUrl.match(/^https?:\/\//)) {
      cleanUrl = `https://${cleanUrl}`;
    }

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
    try {
      const response = await this.client.post(`/api/v1/${path}`, data);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw error;
      }
      if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
        const axiosError = new Error(
          'BTCPay Server DNS resolution failed'
        ) as any;
        axiosError.code = error.code;
        axiosError.hostname = error.hostname;
        axiosError.response = {
          status: 503,
          statusText: 'Service Unavailable',
          data: {
            message: `Cannot resolve BTCPay Server hostname. Please check BTCPAY_URL in environment variables. Hostname: ${
              error.hostname || 'unknown'
            }`,
          },
        };
        throw axiosError;
      }
      if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
        const axiosError = new Error('BTCPay Server connection failed') as any;
        axiosError.code = error.code;
        axiosError.response = {
          status: 503,
          statusText: 'Service Unavailable',
          data: { message: 'BTCPay Server is not reachable' },
        };
        throw axiosError;
      }
      throw error;
    }
  }

  async get(path: string, params?: any) {
    try {
      const response = await this.client.get(`/api/v1/${path}`, { params });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw error;
      }
      if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
        const axiosError = new Error(
          'BTCPay Server DNS resolution failed'
        ) as any;
        axiosError.code = error.code;
        axiosError.hostname = error.hostname;
        axiosError.response = {
          status: 503,
          statusText: 'Service Unavailable',
          data: {
            message: `Cannot resolve BTCPay Server hostname. Please check BTCPAY_URL in environment variables. Hostname: ${
              error.hostname || 'unknown'
            }`,
          },
        };
        throw axiosError;
      }
      throw error;
    }
  }

  async put(path: string, data: any) {
    try {
      const response = await this.client.put(`/api/v1/${path}`, data);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw error;
      }
      if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
        const axiosError = new Error(
          'BTCPay Server DNS resolution failed'
        ) as any;
        axiosError.code = error.code;
        axiosError.hostname = error.hostname;
        axiosError.response = {
          status: 503,
          statusText: 'Service Unavailable',
          data: {
            message: `Cannot resolve BTCPay Server hostname. Please check BTCPAY_URL in environment variables. Hostname: ${
              error.hostname || 'unknown'
            }`,
          },
        };
        throw axiosError;
      }
      throw error;
    }
  }

  async delete(path: string) {
    try {
      const response = await this.client.delete(`/api/v1/${path}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw error;
      }
      if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
        const axiosError = new Error(
          'BTCPay Server DNS resolution failed'
        ) as any;
        axiosError.code = error.code;
        axiosError.hostname = error.hostname;
        axiosError.response = {
          status: 503,
          statusText: 'Service Unavailable',
          data: {
            message: `Cannot resolve BTCPay Server hostname. Please check BTCPAY_URL in environment variables. Hostname: ${
              error.hostname || 'unknown'
            }`,
          },
        };
        throw axiosError;
      }
      throw error;
    }
  }
}
