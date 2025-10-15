import { BTCPayClient } from './client';
import { BTCPayRepository } from './repository';
import {
  InvoiceStatus,
  type CreateInvoiceRequest,
  type BTCPayInvoice,
  type InvoiceWebhookPayload,
} from './models';
import crypto from 'crypto';

export class BTCPayService {
  private client: BTCPayClient;
  private repository: BTCPayRepository;

  constructor(apiUrl: string, apiKey: string) {
    this.client = new BTCPayClient({ apiUrl, apiKey });
    this.repository = new BTCPayRepository();
  }

  async createUserStore(userId: string, storeName: string) {
    const existingStore = await this.repository.getUserStore(userId);
    if (existingStore) {
      return existingStore;
    }

    const store = await this.client.createStore({
      name: storeName,
      defaultCurrency: 'USD',
    });

    const webhook = await this.client.createWebhook(store.id, {
      url: `${process.env.NEXT_PUBLIC_URL}/api/payments/btcpay/webhook`,
      authorizedEvents: { everything: true },
    });

    const userStore = await this.repository.saveUserStore(userId, {
      btcpay_store_id: store.id,
      store_name: storeName,
      webhook_secret: webhook.secret,
    });

    return userStore;
  }

  async setupUserWallet(userId: string, xpub?: string) {
    const userStore = await this.repository.getUserStore(userId);
    if (!userStore) {
      throw new Error('User store not found');
    }

    if (xpub) {
      await this.repository.updateUserStoreXpub(userId, xpub);
    } else {
      const wallet = await this.client.generateWallet(
        userStore.btcpay_store_id,
        'BTC-CHAIN',
        {
          savePrivateKeys: false,
          importKeysToRPC: false,
          wordCount: 12,
        }
      );
      if (wallet.xpub) {
        await this.repository.updateUserStoreXpub(userId, wallet.xpub);
      }
    }
  }

  async createInvoice(
    userId: string,
    request: CreateInvoiceRequest
  ): Promise<BTCPayInvoice> {
    const userStore = await this.repository.getUserStore(userId);
    if (!userStore) {
      throw new Error('User store not found. Please setup your store first.');
    }

    const invoice = await this.client.createInvoice(
      userStore.btcpay_store_id,
      request
    );
    await this.repository.saveInvoice(userId, invoice);
    return invoice;
  }

  async getInvoiceStatus(invoiceId: string): Promise<{
    status: InvoiceStatus;
    invoice: BTCPayInvoice;
  }> {
    const storedInvoice = await this.repository.getInvoice(invoiceId);
    if (!storedInvoice) {
      throw new Error('Invoice not found');
    }

    if (this.isFinalStatus(storedInvoice.status)) {
      const invoice = await this.client.getInvoice(
        storedInvoice.store_id,
        invoiceId
      );
      return {
        status: storedInvoice.status,
        invoice,
      };
    }

    const invoice = await this.client.getInvoice(
      storedInvoice.store_id,
      invoiceId
    );

    if (invoice.status !== storedInvoice.status) {
      await this.repository.updateInvoiceStatus(invoiceId, invoice.status);
    }

    return {
      status: invoice.status,
      invoice,
    };
  }

  async processWebhook(
    signature: string,
    body: string,
    webhookSecret: string
  ): Promise<void> {
    if (!this.verifyWebhookSignature(signature, body, webhookSecret)) {
      throw new Error('Invalid webhook signature');
    }

    const payload: InvoiceWebhookPayload = JSON.parse(body);

    await this.repository.saveWebhookEvent(payload);

    if (payload.type.startsWith('InvoiceReceivedPayment')) {
      await this.handlePaymentReceived(payload);
    } else if (payload.type === 'InvoicePaymentSettled') {
      await this.handlePaymentSettled(payload);
    } else if (payload.type === 'InvoiceExpired') {
      await this.handleInvoiceExpired(payload);
    } else if (payload.type === 'InvoiceInvalid') {
      await this.handleInvoiceInvalid(payload);
    }

    await this.repository.markWebhookProcessed(payload.deliveryId);
  }

  private verifyWebhookSignature(
    signature: string,
    body: string,
    secret: string
  ): boolean {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(body);
    const expectedSignature = `sha256=${hmac.digest('hex')}`;
    return signature === expectedSignature;
  }

  private async handlePaymentReceived(
    payload: InvoiceWebhookPayload
  ): Promise<void> {
    await this.repository.updateInvoiceStatus(
      payload.invoiceId,
      InvoiceStatus.PROCESSING
    );
  }

  private async handlePaymentSettled(
    payload: InvoiceWebhookPayload
  ): Promise<void> {
    await this.repository.updateInvoiceStatus(
      payload.invoiceId,
      InvoiceStatus.SETTLED
    );
  }

  private async handleInvoiceExpired(
    payload: InvoiceWebhookPayload
  ): Promise<void> {
    await this.repository.updateInvoiceStatus(
      payload.invoiceId,
      InvoiceStatus.EXPIRED
    );
  }

  private async handleInvoiceInvalid(
    payload: InvoiceWebhookPayload
  ): Promise<void> {
    await this.repository.updateInvoiceStatus(
      payload.invoiceId,
      InvoiceStatus.INVALID
    );
  }

  private isFinalStatus(status: InvoiceStatus): boolean {
    return [
      InvoiceStatus.SETTLED,
      InvoiceStatus.EXPIRED,
      InvoiceStatus.INVALID,
    ].includes(status);
  }

  async getUserInvoices(userId: string) {
    return this.repository.getUserInvoices(userId);
  }

  async getUserStore(userId: string) {
    return this.repository.getUserStore(userId);
  }

  async getUserStoreByBtcPayId(btcpayStoreId: string) {
    return this.repository.getUserStoreByBtcPayId(btcpayStoreId);
  }

  async getWalletOverview(userId: string) {
    const userStore = await this.repository.getUserStore(userId);
    if (!userStore) {
      throw new Error('User store not found');
    }
    return this.client.getWalletOverview(
      userStore.btcpay_store_id,
      'BTC-CHAIN'
    );
  }
}
