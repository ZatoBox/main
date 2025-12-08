'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-store';
import { ordersAPI } from '@/services/api.service';
import type { ReceiptItem } from '@/types';
import ReceiptsHeader from '@/components/receipts/ReceiptsHeader';
import ReceiptsFilters from '@/components/receipts/ReceiptsFilters';
import ReceiptsGrid from '@/components/receipts/ReceiptsGrid';
import ReceiptsStats from '@/components/receipts/ReceiptsStats';
import Loader from '@/components/ui/Loader';
import { useTranslation } from '@/hooks/use-translation';

interface Receipt {
  id: string;
  receiptNumber: string;
  date: string;
  total: number;
  itemCount: number;
  paymentMethod: string;
  status: string;
  items: ReceiptItem[];
}

const ReceiptsPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, initialized } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchAllOrders = async () => {
      if (!initialized) return;

      if (!isAuthenticated) {
        setError(t('receipts.errors.loginRequired'));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await ordersAPI.getCashOrders();

        if (data.success && Array.isArray(data.orders)) {
          const allReceipts = data.orders.map((order: any) => {
            const metaType = order.metadata?.paymentType;
            const method = order.payment_method === 'cash' ? 'cash' : 'bitcoin';
            return {
              id: order.id,
              receiptNumber: order.id.slice(0, 8).toUpperCase(),
              date: order.created_at,
              total: order.total_amount,
              itemCount: Array.isArray(order.items) ? order.items.length : 0,
              paymentMethod: method,
              status: order.status,
              items: Array.isArray(order.items) ? order.items : [],
            } as Receipt;
          });

          setReceipts(allReceipts);
          setError(null);
        } else {
          setReceipts([]);
        }
      } catch (err: any) {
        console.error('Error loading receipts:', err);
        setReceipts([]);
        setError(err?.message || t('receipts.errors.loadError'));
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, [isAuthenticated, initialized]);

  useEffect(() => {
    const autoCancelExpiredCrypto = async () => {
      const now = Date.now();
      const updates: Promise<void>[] = [];
      receipts.forEach((r) => {
        if (r.paymentMethod !== 'cash' && r.status === 'pending') {
          const created = new Date(r.date).getTime();
          if (now - created > 24 * 60 * 60 * 1000) {
            updates.push(
              fetch(`/api/checkout/crypto/${r.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'cancelled' }),
              })
                .then(() => {
                  setReceipts((prev) =>
                    prev.map((x) =>
                      x.id === r.id ? { ...x, status: 'cancelled' } : x
                    )
                  );
                })
                .catch(() => {})
            );
          }
        }
      });
      if (updates.length > 0) await Promise.all(updates);
    };
    if (receipts.length > 0) autoCancelExpiredCrypto();
  }, [receipts]);

  const filteredReceipts = receipts.filter((receipt) => {
    const matchesSearch =
      receipt.receiptNumber.includes(searchTerm) ||
      receipt.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || receipt.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalAmount = receipts.reduce((sum, receipt) => sum + receipt.total, 0);
  const completedReceipts = receipts.filter(
    (r) => r.status === 'completed'
  ).length;

  if (loading && initialized && isAuthenticated) {
    return <Loader text={t('receipts.loading')} />;
  }

  if (error && initialized && isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-main">
        <div className="text-center">
          <div className="mb-4 text-red-500">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <p className="mb-4 text-text-primary">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 font-medium text-white transition-colors rounded-lg bg-[#F88612] hover:bg-[#d17110]"
          >
            {t('receipts.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <ReceiptsHeader onBack={() => router.push('/home')} />

        <div>
          <ReceiptsStats
            totalReceipts={receipts.length}
            totalAmount={totalAmount}
            completedReceipts={completedReceipts}
          />

          <div className="mt-6">
            <ReceiptsFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
            />
          </div>

          <div className="mt-6">
            <ReceiptsGrid receipts={filteredReceipts} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptsPage;
