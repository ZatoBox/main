'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-store';
import { ordersAPI } from '@/services/api.service';
import ReceiptsHeader from '@/components/receipts/ReceiptsHeader';
import ReceiptsTabs from '@/components/receipts/ReceiptsTabs';
import ReceiptsFilters from '@/components/receipts/ReceiptsFilters';
import ReceiptsGrid from '@/components/receipts/ReceiptsGrid';
import ReceiptsStats from '@/components/receipts/ReceiptsStats';
import CryptoReceiptsPlaceholder from '@/components/receipts/CryptoReceiptsPlaceholder';

interface ReceiptItem {
  product_name: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface CashOrder {
  id: string;
  user_id: string;
  items: ReceiptItem[];
  total_amount: number;
  payment_method: string;
  status: string;
  created_at: string;
  metadata: { [key: string]: any };
}

const ReceiptsPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, initialized } = useAuth();

  const [activeTab, setActiveTab] = useState<'cash' | 'crypto'>('cash');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cashReceipts, setCashReceipts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCashOrders = async () => {
      if (!initialized) return;

      if (!isAuthenticated) {
        setError('Debes iniciar sesión para ver los recibos');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await ordersAPI.getCashOrders();

        if (data.success && Array.isArray(data.orders)) {
          // Transformar datos para los recibos
          const receipts = data.orders
            .filter((order: any) => order.payment_method === 'cash')
            .map((order: any) => ({
              id: order.id,
              receiptNumber: order.id.slice(0, 8).toUpperCase(),
              date: order.created_at,
              total: order.total_amount,
              itemCount: Array.isArray(order.items) ? order.items.length : 0,
              paymentMethod: order.payment_method,
              status: order.status,
              items: Array.isArray(order.items) ? order.items : [],
            }));

          setCashReceipts(receipts);
          setError(null);
        } else {
          setCashReceipts([]);
        }
      } catch (err: any) {
        console.error('Error loading receipts:', err);
        setCashReceipts([]);
        setError(err?.message || 'Error al cargar recibos');
      } finally {
        setLoading(false);
      }
    };

    fetchCashOrders();
  }, [isAuthenticated, initialized]);

  const filteredReceipts = cashReceipts.filter((receipt) => {
    const matchesSearch =
      receipt.receiptNumber.includes(searchTerm) ||
      receipt.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || receipt.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calcular estadísticas
  const totalAmount = cashReceipts.reduce(
    (sum, receipt) => sum + receipt.total,
    0
  );
  const completedReceipts = cashReceipts.filter(
    (r) => r.status === 'completed'
  ).length;

  if (loading && initialized && isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-main">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 rounded-full animate-spin border-[#F88612]"></div>
          <p className="text-text-secondary">Cargando recibos...</p>
        </div>
      </div>
    );
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
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main">
      <ReceiptsHeader onBack={() => router.push('/home')} />

      <ReceiptsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="py-6">
          {activeTab === 'cash' && (
            <>
              <ReceiptsStats
                totalReceipts={cashReceipts.length}
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
            </>
          )}

          {activeTab === 'crypto' && (
            <div className="mt-6">
              <CryptoReceiptsPlaceholder />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiptsPage;
