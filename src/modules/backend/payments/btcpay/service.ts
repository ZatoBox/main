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
import { encryptXpub, decryptXpub } from '@/utils/zpub-encryption';
import { convertToXpub } from '@/utils/xpub-converter';

export class BTCPayService {
  private client: BTCPayClient;
  private repository: BTCPayRepository;
  private userId?: string;
  private defaultStoreId?: string;

  constructor(apiUrl: string, apiKey: string, userId?: string) {
    this.client = new BTCPayClient({ apiUrl, apiKey, userId });
    this.repository = new BTCPayRepository();
    this.userId = userId;
    this.defaultStoreId = process.env.BTCPAY_STORE_ID || undefined;
  }

  async configureUserStore(
    userId: string,
    params: {
      publicKey: string;
      storeName?: string;
    }
  ): Promise<{
    storeId: string;
    xpub: string;
    webhookCreated: boolean;
    xpubChanged: boolean;
  }> {
    const storeName =
      params.storeName?.trim() || `User Store ${userId.substring(0, 8)}`;
    const normalizedKey = params.publicKey?.trim();
    if (!normalizedKey) {
      throw new Error('Public key is required');
    }
    let xpub: string;
    try {
      xpub = convertToXpub(normalizedKey);
    } catch (error) {
      throw new Error('Invalid extended public key');
    }
    const encryptedXpub = encryptXpub(xpub);
    const { storeId, store } = await this.ensureStore(userId, storeName);
    let previousXpub: string | null = null;
    if (store?.xpub) {
      try {
        previousXpub = decryptXpub(store.xpub);
      } catch (error) {
        previousXpub = null;
      }
    }
    await this.client.setOnChainPaymentMethod(storeId, 'BTC', {
      derivationScheme: xpub,
      enabled: true,
      label: storeName,
    });
    await this.repository.updateUserStore(userId, {
      xpub: encryptedXpub,
      btcpay_store_id: storeId,
      store_name: storeName,
    });
    const webhookResult = await this.ensureWebhook(
      userId,
      storeId,
      store?.webhook_secret
    );

    return {
      storeId,
      xpub,
      webhookCreated: webhookResult.created,
      xpubChanged: previousXpub !== null && previousXpub !== xpub,
    };
  }

  async saveUserXpub(
    userId: string,
    publicKey: string,
    storeName?: string
  ): Promise<void> {
    await this.configureUserStore(userId, {
      publicKey,
      storeName,
    });
  }

  async getUserXpub(userId: string): Promise<string | null> {
    const userStore = await this.repository.getUserStore(userId);
    if (!userStore?.xpub) {
      return null;
    }
    try {
      return decryptXpub(userStore.xpub);
    } catch (error) {
      console.error('Failed to decrypt xpub:', error);
      return null;
    }
  }

  async generateUserWallet(
    userId: string,
    storeName?: string
  ): Promise<{
    xpub: string;
    storeId: string;
    mnemonic?: string;
    fingerprint?: string;
  }> {
    const name = storeName?.trim() || `User Store ${userId.substring(0, 8)}`;
    const { storeId, store } = await this.ensureStore(userId, name);

    let wallet;
    try {
      wallet = await this.client.generateWallet(storeId, 'BTC-CHAIN', {
        savePrivateKeys: false,
        importKeysToRPC: false,
        wordCount: 12,
      });
    } catch (error: any) {
      console.warn(
        'Failed to generate wallet, attempting to reset payment method:',
        error.message
      );
      try {
        await this.client.deleteOnChainPaymentMethod(storeId, 'BTC');
        wallet = await this.client.generateWallet(storeId, 'BTC-CHAIN', {
          savePrivateKeys: false,
          importKeysToRPC: false,
          wordCount: 12,
        });
      } catch (retryError: any) {
        console.error('Retry failed:', retryError);
        throw new Error(
          `Failed to generate wallet: ${retryError.message || 'Unknown error'}`
        );
      }
    }

    console.log(
      'BTCPay generateWallet response:',
      JSON.stringify(wallet, null, 2)
    );

    const xpub =
      wallet.xpub ||
      wallet.accountHDKey ||
      wallet.derivationScheme ||
      wallet.config?.accountDerivation ||
      wallet.config?.accountOriginal;
    const mnemonic = wallet.mnemonic || wallet.words;

    if (!xpub) {
      console.error('No xpub found in wallet response:', wallet);
      throw new Error(
        'Failed to generate XPUB - no derivation scheme found in response'
      );
    }

    const encryptedXpub = encryptXpub(xpub);
    await this.repository.updateUserStore(userId, {
      xpub: encryptedXpub,
      btcpay_store_id: storeId,
      store_name: name,
    });

    await this.client.setOnChainPaymentMethod(storeId, 'BTC', {
      derivationScheme: xpub,
      enabled: true,
      label: name,
    });

    await this.ensureWebhook(userId, storeId, store?.webhook_secret);

    const HDKey = require('hdkey');
    let fingerprint: string | undefined;
    try {
      const hd = HDKey.fromExtendedKey(xpub);
      if (hd.identifier) {
        fingerprint = hd.identifier.slice(0, 4).toString('hex');
      }
    } catch (e) {
      console.warn('Failed to derive fingerprint from xpub:', e);
    }

    return {
      xpub,
      storeId,
      mnemonic,
      fingerprint,
    };
  }

  async ensureUserStore(userId: string): Promise<{ storeId: string }> {
    const name = `User Store ${userId.substring(0, 8)}`;
    const { storeId, store } = await this.ensureStore(userId, name);
    await this.ensureWebhook(userId, storeId, store?.webhook_secret);
    return { storeId };
  }

  private async ensureStore(userId: string, storeName: string) {
    let userStore = await this.repository.getUserStore(userId);
    let storeId = userStore?.btcpay_store_id;
    if (!storeId) {
      const store = await this.client.createStore({
        name: storeName,
        defaultCurrency: 'BTC',
      });
      storeId = store.id;
      userStore = await this.repository.saveUserStore(userId, {
        btcpay_store_id: storeId,
        store_name: storeName,
      });
    } else if (storeName && userStore?.store_name !== storeName) {
      await this.client.updateStore(storeId, { name: storeName });
      userStore = await this.repository.updateUserStore(userId, {
        store_name: storeName,
      });
    }
    if (!storeId) {
      throw new Error('Unable to determine BTCPay store id');
    }
    return { storeId, store: userStore };
  }

  private async ensureWebhook(
    userId: string,
    storeId: string,
    existingSecret?: string | null
  ) {
    const globalSecret = process.env.BTCPAY_WEBHOOK_SECRET;

    if (existingSecret && (!globalSecret || existingSecret === globalSecret)) {
      return { secret: existingSecret, created: false };
    }

    const webhookUrl = process.env.BTCPAY_WEBHOOK_URL;
    if (!webhookUrl) {
      throw new Error('BTCPAY_WEBHOOK_URL is not configured');
    }

    const secret = globalSecret || crypto.randomBytes(32).toString('hex');

    await this.client.createWebhook(storeId, {
      url: webhookUrl,
      secret,
      authorizedEvents: { everything: true },
      automaticRedelivery: true,
    });

    await this.repository.updateUserStore(userId, {
      webhook_secret: secret,
    });

    return { secret, created: true };
  }

  async createInvoice(
    userId: string,
    request: CreateInvoiceRequest
  ): Promise<BTCPayInvoice> {
    let amountToUse = request.amount;
    let currencyToUse = request.currency;

    const userStore = await this.repository.getUserStore(userId);
    const storeId = userStore?.btcpay_store_id;

    if (!storeId) {
      throw new Error(
        'BTCPay store not configured for this user. Please set up your wallet first.'
      );
    }

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

    const metadata = request.metadata || {};
    const paymentMethods = ['BTC-CHAIN'];

    const enrichedRequest = {
      amount: amountToUse,
      currency: currencyToUse,
      metadata: {
        ...metadata,
        userId,
        timestamp: new Date().toISOString(),
      },
      checkout: {
        speedPolicy: 'MediumSpeed',
        paymentMethods,
        expirationMinutes: 15,
        monitoringMinutes: 24,
        ...request.checkout,
      },
    };

    const invoice = await this.client.createInvoice(
      storeId,
      enrichedRequest as CreateInvoiceRequest
    );

    const btcpayUrl = process.env.BTCPAY_URL || '';
    if (invoice.checkoutLink && btcpayUrl) {
      invoice.checkoutLink = invoice.checkoutLink.replace(
        /https?:\/\/[^\/]+/,
        btcpayUrl
      );
    }

    try {
      const paymentMethods = await this.client.getInvoicePaymentMethods(
        storeId,
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
            paymentType: storedInvoice.metadata?.paymentType || 'btc',
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

  async sendFunds(
    userId: string,
    request: {
      destination: string;
      amount?: string;
      feeRate: number;
      subtractFromAmount?: boolean;
    }
  ) {
    const userStore = await this.repository.getUserStore(userId);
    if (!userStore) {
      throw new Error('User store not found');
    }

    return this.client.createOnChainTransaction(
      userStore.btcpay_store_id,
      'BTC',
      {
        destinations: [
          {
            destination: request.destination,
            amount: request.amount,
            subtractFromAmount: request.subtractFromAmount,
          },
        ],
        feeRate: request.feeRate,
      }
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
          paymentType: storedInvoice.metadata?.paymentType || 'btc',
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
