import type { CashOrder } from '@/backend/payments/cash/models';

export const confirmCryptoOrder = async (
  invoiceId: string
): Promise<{
  success: boolean;
  order?: CashOrder;
  message?: string;
}> => {
  try {
    const response = await fetch('/api/checkout/crypto/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoiceId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || 'Error al confirmar el pago',
      };
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Error de conexión',
    };
  }
};
