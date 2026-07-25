import React from 'react';
import { useTranslation } from '@/hooks/use-translation';
import ResponsiveModal from '@/components/ui/responsive-modal';

interface Props {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

const DeleteConfirmModal: React.FC<Props> = ({
  open,
  onCancel,
  onConfirm,
  loading,
}) => {
  const { t } = useTranslation();

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={(o) => {
        if (!o && !loading) onCancel();
      }}
      title={
        <span className="flex items-center gap-3">
          <span className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-red-50">
            <svg
              className="w-5 h-5 text-red-600"
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
          </span>
          {t('inventory.deleteModal.title')}
        </span>
      }
      description={t('inventory.deleteModal.description')}
      footer={
        <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="w-full min-h-11 px-5 py-2.5 text-sm font-medium transition-all border rounded-lg sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50"
          >
            {t('inventory.deleteModal.cancel')}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="w-full min-h-11 px-5 py-2.5 text-sm font-semibold text-white transition-all rounded-lg sm:w-auto bg-red-600 hover:bg-red-700 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                {t('inventory.deleteModal.confirm')}...
              </>
            ) : (
              t('inventory.deleteModal.confirm')
            )}
          </button>
        </div>
      }
    >
      <div />
    </ResponsiveModal>
  );
};

export default DeleteConfirmModal;
