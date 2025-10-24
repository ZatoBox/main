'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/app/stores/cart-store';
import { useCheckoutStore } from '@/app/stores/checkout-store';
import { btcpayAPI } from '@/services/btcpay.service';
import { InvoiceStatus } from '@/backend/payments/btcpay/models';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/landing/ui/card';
import { Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';
import BTCPayModal from '@/components/btcpay/BTCPayModal';
import { useCashSuccess } from '@/context/cash-success-context';

export function CryptoCheckout() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const {
    invoiceId,
    checkoutLink,
    status,
    isLoading,
    error,
    setInvoice,
    setStatus,
    setLoading,
    setError,
    reset,
  } = useCheckoutStore();
  const { showModal: showSuccessModal } = useCashSuccess();

  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(
    null
  );
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [invoiceAmount, setInvoiceAmount] = useState<string>('');
  const [invoiceCurrency, setInvoiceCurrency] = useState<string>('');
  const [paymentUrl, setPaymentUrl] = useState<string>('');

  const total = getTotalPrice();

  const handleCreateInvoice = async () => {
    if (items.length === 0) {
      setError('El carrito está vacío');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await btcpayAPI.createInvoice({
        amount: total.toString(),
        currency: 'USD',
        metadata: {
          orderId: `order-${Date.now()}`,
          itemDesc: `${items.length} productos`,
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
            productData: {
              name: item.name,
              image: item.image,
              price: item.price,
            },
          })),
        },
        checkout: {
          speedPolicy: 'MediumSpeed',
          expirationMinutes: 15,
          redirectURL: `${window.location.origin}/success`,
          redirectAutomatically: true,
        },
      });

      if (response.success && response.invoiceId && response.checkoutLink) {
        setInvoice(
          response.invoiceId,
          response.checkoutLink,
          response.status || InvoiceStatus.NEW
        );
        setInvoiceAmount(response.amount || total.toString());
        setInvoiceCurrency(response.currency || 'USD');
        setPaymentUrl(response.paymentUrl || response.checkoutLink);
        setShowPaymentModal(true);
        startPolling(response.invoiceId);
      } else {
        setError(response.message || 'Error al crear la factura');
      }
    } catch (err: any) {
      setError(err.message || 'Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  const startPolling = (id: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await btcpayAPI.getInvoiceStatus(id);
        if (response.success && response.status) {
          setStatus(response.status);

          if (
            response.status === InvoiceStatus.SETTLED ||
            response.status === InvoiceStatus.EXPIRED ||
            response.status === InvoiceStatus.INVALID
          ) {
            stopPolling();

            if (response.status === InvoiceStatus.SETTLED) {
              setShowPaymentModal(false);
              clearCart();
              showSuccessModal(id);
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

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [pollingInterval]);

  const getStatusIcon = () => {
    switch (status) {
      case InvoiceStatus.SETTLED:
        return <CheckCircle2 className="h-8 w-8 text-green-500" />;
      case InvoiceStatus.EXPIRED:
      case InvoiceStatus.INVALID:
        return <XCircle className="h-8 w-8 text-red-500" />;
      case InvoiceStatus.PROCESSING:
        return <Clock className="h-8 w-8 text-blue-500 animate-pulse" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case InvoiceStatus.NEW:
        return 'Esperando pago';
      case InvoiceStatus.PROCESSING:
        return 'Procesando pago';
      case InvoiceStatus.SETTLED:
        return 'Pago completado';
      case InvoiceStatus.EXPIRED:
        return 'Factura expirada';
      case InvoiceStatus.INVALID:
        return 'Pago inválido';
      default:
        return '';
    }
  };

  if (invoiceId && checkoutLink) {
    return (
      <>
        <BTCPayModal
          isOpen={showPaymentModal}
          invoiceId={invoiceId}
          amount={invoiceAmount}
          currency={invoiceCurrency}
          paymentUrl={paymentUrl}
          status={status || InvoiceStatus.NEW}
          onClose={() => {
            setShowPaymentModal(false);
            stopPolling();
            reset();
          }}
        />
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Estado del Pago</CardTitle>
            <CardDescription>
              Completa tu pago con criptomonedas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              {getStatusIcon()}
              <p className="text-lg font-medium">{getStatusText()}</p>
              <p className="text-sm text-muted-foreground">ID: {invoiceId}</p>
            </div>

            {status === InvoiceStatus.NEW && (
              <Button
                onClick={() => setShowPaymentModal(true)}
                className="w-full"
              >
                Ver detalles de pago
              </Button>
            )}

            {status === InvoiceStatus.SETTLED && (
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800 text-center">
                  ¡Pago exitoso! Tu pedido ha sido procesado.
                </p>
              </div>
            )}

            {(status === InvoiceStatus.EXPIRED ||
              status === InvoiceStatus.INVALID) && (
              <Button onClick={reset} className="w-full" variant="outline">
                Intentar de nuevo
              </Button>
            )}
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Checkout con Criptomonedas</CardTitle>
        <CardDescription>Paga de forma segura con Bitcoin</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Productos:</span>
            <span className="text-sm font-medium">{items.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-lg font-semibold">${total.toFixed(2)}</span>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleCreateInvoice}
          disabled={isLoading || items.length === 0}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Procesando...
            </>
          ) : (
            'Pagar con Crypto'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
