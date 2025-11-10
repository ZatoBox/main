import { InvoiceStatus } from '@/backend/payments/btcpay/models';
import { create } from 'zustand';

interface CheckoutState {
  invoiceId: string | null;
  checkoutLink: string | null;
  status: InvoiceStatus | null;
  isLoading: boolean;
  error: string | null;
  setInvoice: (
    invoiceId: string,
    checkoutLink: string,
    status: InvoiceStatus
  ) => void;
  setStatus: (status: InvoiceStatus) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  invoiceId: null,
  checkoutLink: null,
  status: null,
  isLoading: false,
  error: null,
  setInvoice: (invoiceId, checkoutLink, status) =>
    set({ invoiceId, checkoutLink, status, error: null }),
  setStatus: (status) => set({ status }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  reset: () =>
    set({
      invoiceId: null,
      checkoutLink: null,
      status: null,
      isLoading: false,
      error: null,
    }),
}));
