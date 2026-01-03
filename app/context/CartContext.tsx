"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type CartOption = {
  id: string;
  label?: string;
  width?: number;
  height?: number;
  price: number;
};

export type CartItem = {
  id: string;
  title: string;
  artist?: string;
  image?: string;
  option?: CartOption;
  size?: string;
  dimensions?: string;
  price: number;
  currency?: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (item: CartItem, opts?: { merge?: 'auto' | 'separate' | 'replace' }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "artmasons_cart_v1";

function readFromStorage(): CartItem[] {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (!raw) return [];
    return JSON.parse(raw) as CartItem[];
  } catch (e) {
    console.error("Failed reading cart from storage", e);
    return [];
  }
}

function writeToStorage(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Failed writing cart to storage", e);
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Start with an empty array on both server and initial client render to avoid
  // hydration mismatches. Load persisted cart from localStorage only after
  // the component mounts on the client.
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const load = setTimeout(() => {
      const persisted = readFromStorage();
      if (persisted.length > 0) setItems(persisted);
    }, 0);
    return () => clearTimeout(load);
  }, []);

  useEffect(() => {
    // Persist whenever items change (client-side only)
    writeToStorage(items);
  }, [items]);

  const addItem = useCallback((item: CartItem, opts?: { merge?: 'auto' | 'separate' | 'replace' }) => {
    setItems((prev) => {
      // find an existing entry for same product id
      const idx = prev.findIndex((p) => p.id === item.id);
      const existing = idx >= 0 ? prev[idx] : null;

      // If explicit separate requested, always add new entry
      if (opts && opts.merge === 'separate') return [...prev, item];

      // If explicit replace: replace option on existing item and sum quantities
      if (existing && opts && opts.merge === 'replace') {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], option: item.option, quantity: copy[idx].quantity + item.quantity, price: item.price };
        return copy;
      }

      // Default (auto): prefer matching by option id (merge quantities), otherwise add as separate
      if (existing) {
        const pOpt = existing.option;
        const iOpt = item.option;
        if (pOpt && iOpt && pOpt.id === iOpt.id) {
          const copy = [...prev];
          copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + item.quantity };
          return copy;
        }
        // no matching option id -> add separate line by default
        return [...prev, item];
      }

      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((id: string) => setItems((prev) => prev.filter((p) => p.id !== id)), []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, quantity: Math.max(1, quantity) } : p)));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const subtotal = useMemo(() => items.reduce((s, it) => s + it.price * it.quantity, 0), [items]);
  const count = useMemo(() => items.reduce((s, it) => s + it.quantity, 0), [items]);

  const value = useMemo(
    () => ({ items, count, subtotal, addItem, removeItem, updateQuantity, clearCart }),
    [items, count, subtotal, addItem, removeItem, updateQuantity, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export default CartContext;
