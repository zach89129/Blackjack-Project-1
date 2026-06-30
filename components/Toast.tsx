"use client";

import { useEffect } from "react";
import type { ToastMessage } from "@/lib/game/types";

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

const typeStyles: Record<ToastMessage["type"], string> = {
  success: "border-emerald-500/50 bg-emerald-900/90",
  error: "border-red-500/50 bg-red-900/90",
  warning: "border-yellow-500/50 bg-yellow-900/90",
  info: "border-blue-500/50 bg-blue-900/90",
};

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      role="alert"
      className={`animate-slide-in rounded-lg border px-4 py-3 text-sm text-white shadow-panel ${typeStyles[toast.type]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span>{toast.message}</span>
        <button
          onClick={() => onDismiss(toast.id)}
          className="shrink-0 text-white/60 hover:text-white"
          aria-label="Dismiss notification"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export function ToastContainer({ toasts, onDismiss }: ToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
