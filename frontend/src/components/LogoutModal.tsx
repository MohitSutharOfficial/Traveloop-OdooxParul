import { AlertCircle, Loader2 } from 'lucide-react';
import { createPortal } from 'react-dom';

interface LogoutModalProps {
  isOpen: boolean;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function LogoutModal({ isOpen, isLoading, onConfirm, onCancel }: LogoutModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="traveloop-card w-full max-w-sm">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-fuchsia-50 dark:bg-fuchsia-400/10">
            <AlertCircle className="h-6 w-6 text-fuchsia-600 dark:text-fuchsia-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-sora font-semibold text-[#1C1917] dark:text-stone-100">
              Confirm Logout
            </h3>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
              Are you sure you want to log out? You'll need to sign in again to access your account.
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="traveloop-button-secondary flex-1"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex flex-1 items-center justify-center gap-2 rounded-[10px] bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? 'Logging out' : 'Logout'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
