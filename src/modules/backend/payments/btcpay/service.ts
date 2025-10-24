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

    const storedInvoice = await this.repository.getInvoice(payload.invoiceId);
    if (!storedInvoice) return;

    const userId = storedInvoice.user_id;
    const metadata = storedInvoice.metadata || {};
    const items = metadata.items || [];

    if (!items || items.length === 0) return;

    const supabase = await createClient();
    const orderItems: any[] = [];
    let totalAmount = 0;

    for (const item of items) {
      const productId = item.productId;
      const quantity = item.quantity || 0;
      const price = item.price || 0;
      const itemTotal = price * quantity;
      totalAmount += itemTotal;

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
      const { data: createdOrder, error: createError } = await supabase
        .from('cash_orders')
        .insert({
          user_id: userId,
          items: orderItems,
          total_amount: totalAmount,
          payment_method: 'crypto',
          status: 'pending',
          metadata: {
            paymentType: 'btc',
            invoiceId: payload.invoiceId,
            createdAt: new Date().toISOString(),
          },
        })
        .select()
        .single();

      if (!createError && createdOrder) {
        const updatedMetadata = {
          ...(storedInvoice.metadata || {}),
          orderId: createdOrder.id,
        };
        await this.repository.updateInvoiceMetadata(
          payload.invoiceId,
          updatedMetadata
        );
      }
    }
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

    const supabase = await createClient();

    const { data: order, error: orderError } = await supabase
      .from('cash_orders')
      .select('*')
      .eq('metadata->>invoiceId', payload.invoiceId)
      .single();

    if (orderError || !order) return;

    const items = order.items || [];

    for (const item of items) {
      const productId = item.productId;
      const quantity = item.quantity || 0;

      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('stock')
        .eq('id', productId)
        .single();

      if (fetchError || !product) continue;

      const currentStock = product.stock || 0;
      const newStock = Math.max(0, currentStock - quantity);

      await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', productId);
    }

    await supabase
      .from('cash_orders')
      .update({ status: 'completed' })
      .eq('id', order.id);
  }

  private async getNextAddressIndex(userId: string): Promise<number> {
    const { data } = await (await createClient())
      .from('btc_invoices')
      .select('metadata')
      .eq('user_id', userId)
      .not('metadata->addressIndex', 'is', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    return data?.metadata?.addressIndex ? data.metadata.addressIndex + 1 : 0;
  }

  private deriveAddressFromXpub(xpub: string, index: number): string {
    const HDKey = require('hdkey');
    const { address } = require('bitcoinjs-lib').payments;

    const hdkey = HDKey.fromExtendedKey(xpub);
    const child = hdkey.derive(`m/0/${index}`);

    const network = process.env.BTCPAY_URL?.includes('testnet')
      ? 'testnet'
      : 'bitcoin';
    const isTestnet = network === 'testnet';

    const pubkey = child.publicKey;
    const payment = address.p2wpkh({
      pubkey,
      network: isTestnet ? { bech32: 'tb' } : { bech32: 'bc' },
    });

    return payment.address;
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

  async confirmCryptoOrder(userId: string, invoiceId: string): Promise<any> {
    const supabase = await createClient();

    const storedInvoice = await this.repository.getInvoice(invoiceId);
    if (!storedInvoice) {
      throw new Error('Invoice not found');
    }

    const metadata = storedInvoice.metadata || {};
    const items = (metadata as any).items || [];

    if (!items || items.length === 0) {
      throw new Error(
        `No items found in invoice. Metadata: ${JSON.stringify(metadata)}`
      );
    }

    const orderItems: any[] = [];
    let totalAmount = 0;

    for (const item of items) {
      const productId = item.productId;
      const quantity = item.quantity || 0;
      const price = item.price || 0;
      const itemTotal = price * quantity;
      totalAmount += itemTotal;

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

      const { data: product } = await supabase
        .from('products')
        .select('stock')
        .eq('id', productId)
        .single();

      if (product && product.stock >= quantity) {
        await supabase
          .from('products')
          .update({ stock: product.stock - quantity })
          .eq('id', productId);
      }
    }

    const { data: createdOrder, error: createError } = await supabase
      .from('cash_orders')
      .insert({
        user_id: userId,
        items: orderItems,
        total_amount: totalAmount,
        payment_method: 'crypto',
        status: 'pending',
        metadata: {
          paymentType: 'btc',
          invoiceId: invoiceId,
          createdAt: new Date().toISOString(),
        },
      })
      .select()
      .single();

    if (createError || !createdOrder) {
      throw new Error(
        `Failed to create order: ${createError?.message || 'Unknown error'}`
      );
    }

    const updatedMetadata = {
      ...metadata,
      orderId: createdOrder.id,
    };
    await this.repository.updateInvoiceMetadata(invoiceId, updatedMetadata);

    return createdOrder;
  }
}
