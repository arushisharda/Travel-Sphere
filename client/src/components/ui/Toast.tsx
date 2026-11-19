import React, { useState, useEffect, useCallback } from 'react';
import { clsx } from 'clsx';

type ToastType = 'success' | 'error' | 'info';

type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

let globalAddToast: ((message: string, type?: ToastType) => void) | null = null;

export function toast(message: string, type: ToastType = 'info') {
  globalAddToast?.(message, type);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  useEffect(() => {
    globalAddToast = addToast;
    return () => { globalAddToast = null; };
  }, [addToast]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 w-80">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="alert"
          className={clsx(
            'flex items-start gap-3 rounded-xl px-4 py-3 text-sm shadow-elevated border',
            {
              'bg-[var(--color-paper)] border-[var(--color-border)] text-[var(--color-ink)]': t.type === 'info',
              'bg-green-50 border-green-200 text-green-800': t.type === 'success',
              'bg-red-50 border-red-200 text-red-800': t.type === 'error',
            }
          )}
        >
          <span className="mt-0.5 flex-shrink-0">
            {t.type === 'success' && '✓'}
            {t.type === 'error' && '✕'}
            {t.type === 'info' && '·'}
          </span>
          <span className="flex-1">{t.message}</span>
          <button
            onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
            className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
