"use client";

import React, { createContext, useContext, useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ToastType = "info" | "success" | "error" | "warning";

type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

type ToastContextValue = {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType, timeout?: number) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const clearAll = useCallback(() => setToasts([]), []);

  const addToast = useCallback((message: string, type: ToastType = "info", timeout = 5000) => {
    setToasts((prev) => {
      if (prev.some((t) => t.message === message && t.type === type)) return prev;

      const id = String(Date.now()) + Math.random().toString(36).slice(2, 9);
      const toast: Toast = { id, message, type };

      if (timeout > 0) {
        setTimeout(() => removeToast(id), timeout);
      }
      return [toast, ...prev];
    });
  }, [removeToast]);

  const value = useMemo(() => ({ toasts, addToast, removeToast, clearAll }), [toasts, addToast, removeToast, clearAll]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} clearAll={clearAll} />
    </ToastContext.Provider>
  );
}

function ToastContainer({
  toasts,
  removeToast,
  clearAll
}: {
  toasts: Toast[];
  removeToast: (id: string) => void;
  clearAll: () => void;
}) {
    return (
        <div className="fixed z-[9999] inset-x-0 top-0 p-4 pointer-events-none sm:top-4 sm:right-4 sm:left-auto sm:max-w-md w-full flex flex-col gap-2">
            <div className="flex flex-col items-center sm:items-end gap-2 w-full">
                <AnimatePresence mode="popLayout" initial={false}>
                    {toasts.map((t) => (
                        <ToastItem key={t.id} toast={t} onRemove={() => removeToast(t.id)} />
                    ))}
                </AnimatePresence>
            </div>

            {toasts.length > 2 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex justify-center sm:justify-end w-full mt-1 pointer-events-auto"
                >
                    <button
                        onClick={clearAll}
                        className="text-xs font-serif text-[#171717]/60 hover:text-[#171717] bg-white border border-gray-200 px-3 py-1 rounded-sm shadow-sm hover:shadow hover:border-gray-300 transition-all uppercase tracking-wider"
                    >
                        Clear All
                    </button>
                </motion.div>
            )}
        </div>
    );
}

const THEME_RED = "#800000";

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles = {
  success: "bg-white border-l-[#2e7d32]", // Classic green
  error: `bg-white border-l-[#800000]`,   // Theme Red
  warning: "bg-white border-l-[#d4a017]", // Gold/Amber
  info: "bg-white border-l-[#1a1a1a]",    // Dark Gray (Footer color)
};

const iconStyles = {
    success: "text-[#2e7d32]",
    error: "text-[#800000]",
    warning: "text-[#d4a017]",
    info: "text-[#1a1a1a]",
};

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  const Icon = icons[toast.type];

  return (
    <motion.div
        layout
        initial={{ opacity: 0, x: 20, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="pointer-events-auto w-full max-w-sm"
    >
      <div 
        className={cn(
            "relative flex items-center gap-3 p-4 shadow-md border border-gray-100",
            "border-l-[4px]",
            "rounded-sm", // Matches search bar radius
            styles[toast.type]
        )}
      >
        <div className={cn("flex-shrink-0", iconStyles[toast.type])}>
            <Icon size={18} strokeWidth={2} />
        </div>
        
        <div className="flex-1">
            <p className="text-sm font-serif text-[#171717] leading-snug">
                {toast.message}
            </p>
        </div>

        <button
            onClick={onRemove}
            className="flex-shrink-0 p-1 text-gray-400 hover:text-[#800000] transition-colors"
            aria-label="Close"
        >
            <X size={14} />
        </button>
      </div>
    </motion.div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export default ToastContext;
