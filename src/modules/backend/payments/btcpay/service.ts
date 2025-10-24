import { BTCPayClient } from './client';
import { BTCPayRepository } from './repository';
import {
  InvoiceStatus,
  type CreateInvoiceRequest,
  type BTCPayInvoice,
  type InvoiceWebhookPayload,
} from './models';
import { createClient } from '@/utils/supabase/server';
import crypto from 'crypto';

export class BTCPayService {
  private client: BTCPayClient;
  private repository: BTCPayRepository;
  private userId?: string;
  private storeId: string;

  constructor(apiUrl: string, apiKey: string, userId?: string) {
    this.client = new BTCPayClient({ apiUrl, apiKey, userId });
    this.repository = new BTCPayRepository();
    this.userId = userId;
    this.storeId = process.env.BTCPAY_STORE_ID || '';
    if (!this.storeId) {
      throw new Error('BTCPAY_STORE_ID is not configured');
    }
  }

  async saveUserXpub(userId: string, xpub: string): Promise<void> {
    // Ensure user store exists, create if not
    let userStore = await this.repository.getUserStore(userId);
    if (!userStore) {
      await this.repository.saveUserStore(userId, {
        btcpay_store_id: this.storeId,
        store_name: `User Store ${userId.substring(0, 8)}`,
      });
    }
    // Now update the xpub
    await this.repository.updateUserStoreXpub(userId, xpub);
  }

  async getUserXpub(userId: string): Promise<string | null> {
    const userStore = await this.repository.getUserStore(userId);
    return userStore?.xpub || null;
  }

  async generateUserWallet(userId: string): Promise<{ xpub: string }> {
    const wallet = await this.client.generateWallet(this.storeId, 'BTC-CHAIN', {
      savePrivateKeys: false,
      importKeysToRPC: false,
      wordCount: 12,
    });

    if (!wallet.xpub) {
      throw new Error('Failed to generate XPUB');
    }

    // Ensure user store exists, create if not
    let userStore = await this.repository.getUserStore(userId);
    if (!userStore) {
      await this.repository.saveUserStore(userId, {
        btcpay_store_id: this.storeId,
        store_name: `User Store ${userId.substring(0, 8)}`,
      });
    }

    await this.repository.updateUserStoreXpub(userId, wallet.xpub);

    return { xpub: wallet.xpub };
  }

  async createInvoice(
    userId: string,
    request: CreateInvoiceRequest
  ): Promise<BTCPayInvoice> {
    let amountToUse = request.amount;
    let currencyToUse = request.currency;

    if (request.currency !== 'BTC') {
      try {
        const rate = await this.client.getBTCRate(request.currency);
        const amountInBTC = (parseFloat(String(request.amount)) / rate).toFixed(
          8
        );
        amountToUse = amountInBTC;
        currencyToUse = 'BTC';
      } catch (error) {
        console.warn('Failed to get rate, using original amount', error);
      }
    }

    const enrichedRequest = {
      amount: amountToUse,
      currency: currencyToUse,
      metadata: {
        ...request.metadata,
        userId,
        timestamp: new Date().toISOString(),
      },
      checkout: {
        speedPolicy: 'MediumSpeed',
        paymentMethods: ['BTC-CHAIN'],
        expirationMinutes: 15,
        monitoringMinutes: 24,
        ...request.checkout,
      },
    };

    let userXpub = await this.getUserXpub(userId);

    if (!userXpub) {
      try {
        const wallet = await this.generateUserWallet(userId);
        userXpub = wallet.xpub;
      } catch (error) {
        console.warn(
          'Failed to auto-generate wallet, continuing without XPUB',
          error
        );
      }
    }

    if (userXpub) {
      (enrichedRequest.metadata as any).userXpub = userXpub;
    }

    console.log(
      'Creating invoice with request:',
      JSON.stringify(enrichedRequest, null, 2)
    );

    const invoice = await this.client.createInvoice(
      this.storeId,
      enrichedRequest as CreateInvoiceRequest
    );

    const btcpayUrl = process.env.BTCPAY_URL || '';
    if (invoice.checkoutLink && btcpayUrl) {
      invoice.checkoutLink = invoice.checkoutLink.replace(
        /https?:\/\/[^\/]+/,
        btcpayUrl
      );
    }

    const fullInvoice = await this.client.getInvoice(this.storeId, invoice.id);

    try {
      const paymentMethods = await this.client.getInvoicePaymentMethods(
        this.storeId,
        invoice.id
      );
      if (paymentMethods) {
        invoice.paymentMethods = paymentMethods;
      }
    } catch (error) {
      console.warn('Failed to get payment methods:', error);
    }

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
    const storedInvoice = await this.repository.getInvoice(payload.invoiceId);
    if (!storedInvoice) {
      throw new Error(`Invoice not found: ${payload.invoiceId}`);
    }

    await this.repository.updateInvoiceStatus(
      payload.invoiceId,
      InvoiceStatus.SETTLED
    );

    const userId = storedInvoice.user_id;
    const metadata = storedInvoice.metadata || {};
    const items = metadata.items || [];

    if (!items || items.length === 0) {
      return;
    }

    const supabase = await createClient();

    const orderItems: any[] = [];
    let totalAmount = 0;

    for (const item of items) {
      const productId = item.productId;
      const quantity = item.quantity || 0;
      const price = item.price || 0;
      const itemTotal = price * quantity;
      totalAmount += itemTotal;

      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('stock')
        .eq('id', productId)
        .single();

      if (fetchError || !product) {
        console.error(`Product not found: ${productId}`);
        continue;
      }

      const currentStock = product.stock || 0;
      const newStock = Math.max(0, currentStock - quantity);

      const { error: updateError } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', productId);

      if (updateError) {
        console.error(
          `Failed to update stock for product ${productId}:`,
          updateError.message
        );
        continue;
      }

      const orderItem: any = {
        productId,
        productName: item.productData?.name || `Product ${productId}`,
        quantity,
        price,
        total: itemTotal,
      };

      if (item.productData?.image) {
        orderItem.image = item.productData.image;
      }

      orderItems.push(orderItem);
    }

    if (orderItems.length > 0) {
      await supabase.from('cash_orders').insert({
        user_id: userId,
        items: orderItems,
        total_amount: totalAmount,
        payment_method: 'crypto',
        status: 'completed',
        metadata: {
          paymentType: 'btc',
          invoiceId: payload.invoiceId,
          createdAt: new Date().toISOString(),
        },
      });
    }
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
