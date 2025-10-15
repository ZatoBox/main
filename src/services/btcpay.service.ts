import type {
  CreateInvoiceRequest,
  BTCPayInvoice,
  InvoiceStatus,
} from '@/backend/payments/btcpay/models';

class BTCPayAPIService {
  private baseUrl = '/api/payments/btcpay';

  async createInvoice(data: CreateInvoiceRequest): Promise<{
    success: boolean;
    invoiceId?: string;
    checkoutLink?: string;
    status?: InvoiceStatus;
    message?: string;
  }> {
    const response = await fetch(`${this.baseUrl}/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    return response.json();
  }

  async getInvoiceStatus(invoiceId: string): Promise<{
    success: boolean;
    status?: InvoiceStatus;
    invoice?: Partial<BTCPayInvoice>;
    message?: string;
  }> {
    const response = await fetch(`${this.baseUrl}/invoices/${invoiceId}`);
    return response.json();
  }

  async generateWallet(data: any): Promise<{
    success: boolean;
    wallet?: any;
    message?: string;
  }> {
    const response = await fetch(`${this.baseUrl}/wallets/BTC/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    return response.json();
  }

  async getWalletOverview(): Promise<{
    success: boolean;
    overview?: any;
    message?: string;
  }> {
    const response = await fetch(`${this.baseUrl}/wallets/BTC/overview`);
    return response.json();
  }

  async createUserStore(data: { storeName: string; xpub?: string }): Promise<{
    success: boolean;
    store?: any;
    message?: string;
  }> {
    const response = await fetch(`${this.baseUrl}/store`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    return response.json();
  }

  async getUserStore(): Promise<{
    success: boolean;
    store?: any;
    message?: string;
  }> {
    const response = await fetch(`${this.baseUrl}/store`);
    if (!response.ok) {
      return { success: false, message: `Error: ${response.status} ${response.statusText}` };
    }
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return { success: false, message: 'Invalid response format' };
    }
    try {
      const data = await response.json();
      return { success: true, store: data };
    } catch (error) {
      return { success: false, message: 'Failed to parse JSON' };
    }
  }
}

export const btcpayAPI = new BTCPayAPIService();
