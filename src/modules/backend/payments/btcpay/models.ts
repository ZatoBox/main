export enum InvoiceStatus {
  NEW = 'New',
  PROCESSING = 'Processing',
  EXPIRED = 'Expired',
  INVALID = 'Invalid',
  SETTLED = 'Settled',
}

export enum PaymentMethodType {
  BTC_CHAIN = 'BTC-CHAIN',
  BTC_LN = 'BTC-LN',
}

export interface BTCPayInvoiceMetadata {
  orderId?: string;
  buyerEmail?: string;
  itemDesc?: string;
  [key: string]: any;
}

export interface BTCPayCheckoutOptions {
  speedPolicy?: 'HighSpeed' | 'MediumSpeed' | 'LowSpeed';
  paymentMethods?: PaymentMethodType[];
  expirationMinutes?: number;
  monitoringMinutes?: number;
  paymentTolerance?: number;
  redirectURL?: string;
  redirectAutomatically?: boolean;
  requiresRefundEmail?: boolean;
}

export interface CreateInvoiceRequest {
  amount: string | number;
  currency: string;
  metadata?: BTCPayInvoiceMetadata;
  checkout?: BTCPayCheckoutOptions;
}

export interface PaymentMethod {
  paymentMethodId: string;
  destination: string;
  paymentLink: string;
  rate: string;
  paymentMethodPaid: string;
  totalPaid: string;
  due: string;
  amount: string;
  networkFee: string;
}

export interface BTCPayInvoice {
  id: string;
  storeId: string;
  amount: string;
  currency: string;
  type: string;
  checkoutLink: string;
  status: InvoiceStatus;
  createdTime: number;
  expirationTime: number;
  monitoringExpiration: number;
  metadata?: BTCPayInvoiceMetadata;
  checkout?: BTCPayCheckoutOptions;
  paymentMethods?: PaymentMethod[];
}

export interface InvoiceWebhookPayload {
  deliveryId: string;
  webhookId: string;
  originalDeliveryId: string;
  isRedelivery: boolean;
  type: string;
  timestamp: number;
  storeId: string;
  invoiceId: string;
  overPaid?: boolean;
  afterExpiration?: boolean;
  manuallyMarked?: boolean;
  paymentMethod?: string;
}

export interface BTCPayStore {
  id: string;
  name: string;
  website?: string;
  speedPolicy?: string;
  defaultCurrency?: string;
  defaultLang?: string;
  invoiceExpiration?: number;
  monitoringExpiration?: number;
  paymentTolerance?: number;
}

export interface CreateStoreRequest {
  name: string;
  website?: string;
  defaultCurrency?: string;
}

export interface BTCPayWebhook {
  id: string;
  enabled: boolean;
  automaticRedelivery: boolean;
  url: string;
  authorizedEvents: {
    everything: boolean;
    specificEvents?: string[];
  };
  secret?: string;
}

export interface CreateWebhookRequest {
  url: string;
  authorizedEvents?: {
    everything?: boolean;
    specificEvents?: string[];
  };
  secret?: string;
}

export interface WalletOverview {
  balance: string;
  unconfirmedBalance: string;
  confirmedBalance?: string;
  addresses?: string[];
}

export interface CreateWalletRequest {
  existingMnemonic?: string;
  passphrase?: string;
  accountNumber?: number;
  savePrivateKeys?: boolean;
  importKeysToRPC?: boolean;
  wordList?: string;
  wordCount?: number;
  scriptPubKeyType?: string;
}

export interface PullPayment {
  id: string;
  name?: string;
  description?: string;
  currency: string;
  amount: string;
  period?: number;
  startsAt?: number;
  expiresAt?: number;
  archived: boolean;
}

export interface CreatePullPaymentRequest {
  name?: string;
  description?: string;
  amount: string;
  currency: string;
  period?: number;
  startsAt?: number;
  expiresAt?: number;
  paymentMethods?: string[];
}

export interface Payout {
  id: string;
  pullPaymentId: string;
  destination: string;
  amount: string;
  paymentMethod: string;
  state:
    | 'AwaitingApproval'
    | 'AwaitingPayment'
    | 'InProgress'
    | 'Completed'
    | 'Cancelled';
}
