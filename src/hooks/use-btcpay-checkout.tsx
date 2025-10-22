'use client';

import { useState } from 'react';
import { btcpayAPI } from '@/services/btcpay.service';
import { InvoiceStatus } from '@/backend/payments/btcpay/models';
import { useCashSuccess } from '@/context/cash-success-context';

export const useBTCPayCheckout = () => {
  const { showModal: showSuccessModal } = useCashSuccess();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [invoiceData, setInvoiceData] = useState<{
    invoiceId: string;
    amount: string;
    currency: string;
    paymentUrl: string;
    status: InvoiceStatus;
  } | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(
    null
  );

  const startPolling = (invoiceId: string, onSuccess?: () => void) => {
    const interval = setInterval(async () => {
      try {
        const response = await btcpayAPI.getInvoiceStatus(invoiceId);
        if (response.success && response.status) {
          setInvoiceData((prev) =>
            prev ? { ...prev, status: response.status! } : null
          );

          if (
            response.status === InvoiceStatus.SETTLED ||
            response.status === InvoiceStatus.EXPIRED ||
            response.status === InvoiceStatus.INVALID
          ) {
            stopPolling();

            if (response.status === InvoiceStatus.SETTLED) {
              setShowPaymentModal(false);
              onSuccess?.();
              showSuccessModal(invoiceId);
            }
          }
        }
      } catch (err) {
        console.error('Error polling invoice status:', err);
      }
    }, 3000);

    setPollingInterval(interval);
  };

  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
  };

  const createInvoice = async (
    amount: number,
    currency: string,
    metadata?: any
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await btcpayAPI.createInvoice({
        amount: amount.toString(),
        currency,
        metadata,
        checkout: {
          speedPolicy: 'MediumSpeed',
          expirationMinutes: 15,
          redirectURL: `${window.location.origin}/success`,
          redirectAutomatically: false,
        },
      });

      if (response.success && response.invoiceId) {
        setInvoiceData({
          invoiceId: response.invoiceId,
          amount: response.amount || amount.toString(),
          currency: response.currency || currency,
          paymentUrl: response.paymentUrl || response.checkoutLink || '',
          status: response.status || InvoiceStatus.NEW,
        });
        setShowPaymentModal(true);
        return response.invoiceId;
      } else {
        setError(response.message || 'Error al crear la factura');
        return null;
      }
    } catch (err: any) {
      setError(err.message || 'Error al procesar el pago');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setShowPaymentModal(false);
    stopPolling();
    setInvoiceData(null);
  };

  return {
    isLoading,
    error,
    showPaymentModal,
    invoiceData,
    createInvoice,
    startPolling,
    stopPolling,
    closeModal,
  };
};
