'use client';

import { IconCheck, IconInfoCircle, IconX } from '@tabler/icons-react';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type ToastStatus = 'success' | 'error' | 'info';

export type Toast = {
  id: string;
  message: string;
  status?: ToastStatus;
  duration?: number; // ms
};

type ToastContextValue = {
  show: (toast: Omit<Toast, 'id'>) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function clsx(...args: Array<string | false | null | undefined>) {
  return args.filter(Boolean).join(' ');
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(({ message, status = 'info', duration = 3500 }: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    // Let the ToastItem handle its own fade-out timing; we only add it here.
    setToasts((prev) => [...prev, { id, message, status, duration }]);
  }, []);

  const value = useMemo<ToastContextValue>(
    () => ({
      show,
      success: (message, duration) => show({ message, status: 'success', duration }),
      error: (message, duration) => show({ message, status: 'error', duration }),
      info: (message, duration) => show({ message, status: 'info', duration }),
    }),
    [show]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast viewport */}
      <div
        className={clsx(
          'fixed z-[1000] pointer-events-none',
          // Mobile: bottom-center
          'bottom-4 left-1/2 -translate-x-1/2',
          // Desktop: bottom-right corner
          'md:left-auto md:right-4 md:translate-x-0'
        )}
        style={{ minWidth: 280, maxWidth: 420 }}
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="flex flex-col gap-2 items-stretch">
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onRemove={remove} />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [visible, setVisible] = useState(false);

  // Fade-in on mount
  useEffect(() => {
    const rAF = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(rAF);
  }, []);

  // Auto hide after duration (then fade-out)
  useEffect(() => {
    const duration = toast.duration ?? 3500;
    if (duration <= 0) return;
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [toast.duration]);

  // After fade-out completes, remove from list
  const handleTransitionEnd = () => {
    if (!visible) onRemove(toast.id);
  };

  return (
    <div
      className={clsx(
        'pointer-events-auto rounded-md shadow-lg border p-3 text-sm flex items-start gap-3',
        'transition-all duration-300 ease-out will-change-[opacity,transform]',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
        toast.status === 'success' && 'bg-accent text-white/75 border-green-700',
        toast.status === 'error' && 'bg-accent text-white/75 border-red-700',
        toast.status === 'info' && 'bg-accent text-white/75 border-blue-700'
      )}
      role="status"
      onTransitionEnd={handleTransitionEnd}
    >
      {toast.status === 'success' && (
        <span className="text-green-300">
          <IconCheck />
        </span>
      )}
      {toast.status === 'error' && (
        <span className="text-red-300">
          <IconX />
        </span>
      )}
      {toast.status === 'info' && (
        <span className="text-blue-300">
          <IconInfoCircle />
        </span>
      )}
      <div className="flex-1">{toast.message}</div>
      <button
        onClick={() => setVisible(false)}
        className="opacity-90 hover:opacity-100"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}
