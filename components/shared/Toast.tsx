"use client";

import { useToastStore } from "@/stores/toast";

const styles: Record<string, string> = {
  success: "bg-accent-success/20 text-accent-success border border-accent-success/30",
  error: "bg-accent-secondary/20 text-accent-secondary border border-accent-secondary/30",
  info: "bg-accent-primary/20 text-accent-primary border border-accent-primary/30",
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto px-5 py-3 rounded-xl text-sm font-medium shadow-lg backdrop-blur-md animate-in slide-in-from-bottom-2 ${styles[toast.type]}`}
          onClick={() => removeToast(toast.id)}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
