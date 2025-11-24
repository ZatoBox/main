import type {
  CreateInvoiceRequest,
  BTCPayInvoice,
  CreateStoreRequest,
  BTCPayStore,
  CreateWebhookRequest,
  BTCPayWebhook,
  CreateWalletRequest,
  WalletOverview,
  CreatePullPaymentRequest,
  PullPayment,
  Payout,
  UpdateOnChainPaymentMethodRequest,
} from './models';
import { BTCPayHTTPClient } from './BTCPayHTTPClient';

interface BTCPayClientConfig {
  apiUrl: string;
  apiKey: string;
  storeId?: string;
  userId?: string;
}

export class BTCPayClient {
  private apiUrl: string;
  private apiKey: string;
  private storeId?: string;
  private btcpayClient: BTCPayHTTPClient;

  constructor(config: BTCPayClientConfig) {
    this.apiUrl = config.apiUrl.replace(/\/$/, '');
    this.apiKey = config.apiKey;
    this.storeId = config.storeId;
    this.btcpayClient = new BTCPayHTTPClient(
      this.apiUrl,
      this.apiKey,
      config.userId
    );
  }

  private async request<T>(
    method: string,
    path: string,
    body?: any
  ): Promise<T> {
    const cleanPath = path.replace('/api/v1/', '');

    if (method === 'POST') {
      return this.btcpayClient.post(cleanPath, body) as Promise<T>;
    } else if (method === 'GET') {
      return this.btcpayClient.get(cleanPath) as Promise<T>;
    } else if (method === 'PUT') {
      return this.btcpayClient.put(cleanPath, body) as Promise<T>;
    } else if (method === 'DELETE') {
      return this.btcpayClient.delete(cleanPath) as Promise<T>;
    }

    throw new Error(`Unsupported HTTP method: ${method}`);
  }

  async createStore(data: CreateStoreRequest): Promise<BTCPayStore> {
    return this.request<BTCPayStore>('POST', '/api/v1/stores', data);
  }

  async getStores(): Promise<BTCPayStore[]> {
    return this.request<BTCPayStore[]>('GET', '/api/v1/stores');
  }

  async getStore(storeId: string): Promise<BTCPayStore> {
    return this.request<BTCPayStore>('GET', `/api/v1/stores/${storeId}`);
  }

  async updateStore(
    storeId: string,
    data: Partial<CreateStoreRequest>
  ): Promise<BTCPayStore> {
    return this.request<BTCPayStore>('PUT', `/api/v1/stores/${storeId}`, data);
  }

  async deleteStore(storeId: string): Promise<void> {
    return this.request<void>('DELETE', `/api/v1/stores/${storeId}`);
  }

  async createInvoice(
    storeId: string,
    data: CreateInvoiceRequest
  ): Promise<BTCPayInvoice> {
    return this.request<BTCPayInvoice>(
      'POST',
      `/api/v1/stores/${storeId}/invoices`,
      data
    );
  }

  async getInvoice(storeId: string, invoiceId: string): Promise<BTCPayInvoice> {
    const invoice = await this.request<BTCPayInvoice>(
      'GET',
      `/api/v1/stores/${storeId}/invoices/${invoiceId}`
    );
    return invoice;
  }

  async getInvoicePaymentMethods(
    storeId: string,
    invoiceId: string
  ): Promise<any> {
    return this.request<any>(
      'GET',
      `/api/v1/stores/${storeId}/invoices/${invoiceId}/payment-methods`
    );
  }

  async createWebhook(
    storeId: string,
    data: CreateWebhookRequest
  ): Promise<BTCPayWebhook> {
    return this.request<BTCPayWebhook>(
      'POST',
      `/api/v1/stores/${storeId}/webhooks`,
      data
    );
  }

  async setOnChainPaymentMethod(
    storeId: string,
    cryptoCode: string,
    data: UpdateOnChainPaymentMethodRequest
  ): Promise<void> {
    await this.request<void>(
      'PUT',
      `/api/v1/stores/${storeId}/payment-methods/onchain/${cryptoCode}`,
      data
    );
  }

  async getWebhooks(storeId: string): Promise<BTCPayWebhook[]> {
    return this.request<BTCPayWebhook[]>(
      'GET',
      `/api/v1/stores/${storeId}/webhooks`
    );
  }

  async generateWallet(
    storeId: string,
    paymentMethodId: string,
    data: CreateWalletRequest
  ): Promise<any> {
    return this.request<any>(
      'POST',
      `/api/v1/stores/${storeId}/payment-methods/${paymentMethodId}/wallet/generate`,
      data
    );
  }

  async getWalletOverview(
    storeId: string,
    paymentMethodId: string
  ): Promise<WalletOverview> {
    return this.request<WalletOverview>(
      'GET',
      `/api/v1/stores/${storeId}/payment-methods/${paymentMethodId}/wallet`
    );
  }

  async createPullPayment(
    storeId: string,
    data: CreatePullPaymentRequest
  ): Promise<PullPayment> {
    return this.request<PullPayment>(
      'POST',
      `/api/v1/stores/${storeId}/pull-payments`,
      data
    );
  }

  async getPullPayments(storeId: string): Promise<PullPayment[]> {
    return this.request<PullPayment[]>(
      'GET',
      `/api/v1/stores/${storeId}/pull-payments`
    );
  }

  async getPayouts(storeId: string, pullPaymentId: string): Promise<Payout[]> {
    return this.request<Payout[]>(
      'GET',
      `/api/v1/stores/${storeId}/pull-payments/${pullPaymentId}/payouts`
    );
  }

  async approvePayout(storeId: string, payoutId: string): Promise<Payout> {
    return this.request<Payout>(
      'POST',
      `/api/v1/stores/${storeId}/payouts/${payoutId}/approve`,
      {}
    );
  }

  async createPayout(
    storeId: string,
    pullPaymentId: string,
    data: any
  ): Promise<Payout> {
    return this.request<Payout>(
      'POST',
      `/api/v1/pull-payments/${pullPaymentId}/payouts`,
      data
    );
  }

  async cancelPayout(storeId: string, payoutId: string): Promise<void> {
    return this.request<void>(
      'POST',
      `/api/v1/stores/${storeId}/payouts/${payoutId}/cancel`,
      {}
    );
  }

  async getRate(storeId: string, currency: string): Promise<{ rate: number }> {
    const response = await this.btcpayClient.get(
      `stores/${storeId}/payment-methods/BTC/rate?currencyPair=${currency}_BTC`
    );
    return { rate: parseFloat(response.rate) || 1 };
  }

  async getBTCRate(currency: string): Promise<number> {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${currency.toLowerCase()}`
      );
      const data = await response.json();
      const rate = data.bitcoin[currency.toLowerCase()];
      if (rate) return rate;
    } catch (error) {
      console.warn('Failed to fetch rate from CoinGecko:', error);
    }
    return 1;
  }
}
