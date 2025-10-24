import { createClient } from '@/utils/supabase/server';
import type { BTCPayInvoice, InvoiceStatus, BTCPayStore } from './models';

interface StoredInvoice {
  id: string;
  store_id: string;
  user_id: string;
  invoice_id: string;
  amount: string;
  currency: string;
  status: InvoiceStatus;
  checkout_link: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

interface UserStore {
  id: string;
  user_id: string;
  btcpay_store_id: string;
  store_name: string;
  xpub?: string;
  webhook_secret?: string;
  created_at: string;
  updated_at: string;
}

export class BTCPayRepository {
  async saveInvoice(
    userId: string,
    invoice: BTCPayInvoice
  ): Promise<StoredInvoice> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('btcpay_invoices')
      .insert({
        store_id: invoice.storeId,
        user_id: userId,
        invoice_id: invoice.id,
        amount: invoice.amount,
        currency: invoice.currency,
        status: invoice.status,
        checkout_link: invoice.checkoutLink,
        metadata: invoice.metadata,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to save invoice: ${error.message}`);
    return data;
  }

  async getInvoice(invoiceId: string): Promise<StoredInvoice | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('btcpay_invoices')
      .select('*')
      .eq('invoice_id', invoiceId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Failed to get invoice: ${error.message}`);
    }

    return data;
  }

  async updateInvoiceStatus(
    invoiceId: string,
    status: InvoiceStatus
  ): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
      .from('btcpay_invoices')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('invoice_id', invoiceId);

    if (error) throw new Error(`Failed to update invoice: ${error.message}`);
  }

  async updateInvoiceMetadata(
    invoiceId: string,
    metadata: Record<string, any>
  ): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
      .from('btcpay_invoices')
      .update({
        metadata,
        updated_at: new Date().toISOString(),
      })
      .eq('invoice_id', invoiceId);

    if (error)
      throw new Error(`Failed to update invoice metadata: ${error.message}`);
  }

  async getUserInvoices(userId: string): Promise<StoredInvoice[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('btcpay_invoices')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to get user invoices: ${error.message}`);
    return data || [];
  }

  async saveWebhookEvent(event: any): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase.from('btcpay_webhook_events').insert({
      delivery_id: event.deliveryId,
      webhook_id: event.webhookId,
      event_type: event.type,
      invoice_id: event.invoiceId,
      store_id: event.storeId,
      payload: event,
      processed: false,
    });

    if (error)
      throw new Error(`Failed to save webhook event: ${error.message}`);
  }

  async markWebhookProcessed(deliveryId: string): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
      .from('btcpay_webhook_events')
      .update({
        processed: true,
        processed_at: new Date().toISOString(),
      })
      .eq('delivery_id', deliveryId);

    if (error)
      throw new Error(`Failed to mark webhook processed: ${error.message}`);
  }

  async saveUserStore(
    userId: string,
    storeData: {
      btcpay_store_id: string;
      store_name: string;
      xpub?: string;
      webhook_secret?: string;
    }
  ): Promise<UserStore> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('user_btcpay_stores')
      .insert({
        user_id: userId,
        ...storeData,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to save user store: ${error.message}`);
    return data;
  }

  async getUserStore(userId: string): Promise<UserStore | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('user_btcpay_stores')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Failed to get user store: ${error.message}`);
    }

    return data;
  }

  async getUserStoreByBtcPayId(
    btcpayStoreId: string
  ): Promise<UserStore | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('user_btcpay_stores')
      .select('*')
      .eq('btcpay_store_id', btcpayStoreId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Failed to get user store: ${error.message}`);
    }

    return data;
  }

  async updateUserStoreXpub(userId: string, xpub: string): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
      .from('user_btcpay_stores')
      .update({
        xpub,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) throw new Error(`Failed to update xpub: ${error.message}`);
  }
}
