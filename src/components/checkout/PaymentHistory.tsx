'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/landing/ui/card';
import { InvoiceStatus } from '@/backend/payments/btcpay/models';
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
} from 'lucide-react';

const Badge = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>
    {children}
  </span>
);

interface Invoice {
  id: string;
  invoice_id: string;
  amount: string;
  currency: string;
  status: InvoiceStatus;
  checkout_link: string;
  metadata?: any;
  created_at: string;
}

export function PaymentHistory() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/payments/btcpay/invoices/history');
      const data = await response.json();

      if (data.success) {
        setInvoices(data.invoices);
      } else {
        setError(data.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case InvoiceStatus.SETTLED:
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completado
          </Badge>
        );
      case InvoiceStatus.PROCESSING:
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            Procesando
          </Badge>
        );
      case InvoiceStatus.EXPIRED:
        return (
          <Badge className="bg-gray-100 text-gray-800">
            <XCircle className="w-3 h-3 mr-1" />
            Expirado
          </Badge>
        );
      case InvoiceStatus.INVALID:
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Inválido
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800">
            <Clock className="w-3 h-3 mr-1" />
            Pendiente
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Pagos</CardTitle>
        <CardDescription>Tus transacciones con criptomonedas</CardDescription>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-500">No tienes pagos registrados</p>
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusBadge(invoice.status)}
                    <span className="text-sm text-gray-500">
                      {new Date(invoice.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg">
                      {invoice.amount} {invoice.currency}
                    </span>
                    {invoice.metadata?.orderId && (
                      <span className="text-sm text-gray-500">
                        #{invoice.metadata.orderId}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    ID: {invoice.invoice_id}
                  </p>
                </div>
                {invoice.status === InvoiceStatus.NEW && (
                  <a
                    href={invoice.checkout_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    Ver pago
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
