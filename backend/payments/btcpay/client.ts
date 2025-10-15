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
} from './models';

interface BTCPayClientConfig {
  apiUrl: string;
  apiKey: string;
  storeId?: string;
}

export class BTCPayClient {
  private apiUrl: string;
  private apiKey: string;
  private storeId?: string;

  constructor(config: BTCPayClientConfig) {
    this.apiUrl = config.apiUrl.replace(/\/$/, '');
    this.apiKey = config.apiKey;
    this.storeId = config.storeId;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: any
  ): Promise<T> {
    const url = `${this.apiUrl}${path}`;
    const headers: Record<string, string> = {
      Authorization: `token ${this.apiKey}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `BTCPay API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    return response.json();
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
    return this.request<BTCPayInvoice>(
      'GET',
      `/api/v1/stores/${storeId}/invoices/${invoiceId}`
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

  async cancelPayout(storeId: string, payoutId: string): Promise<void> {
    return this.request<void>(
      'POST',
      `/api/v1/stores/${storeId}/payouts/${payoutId}/cancel`,
      {}
    );
  }
}
