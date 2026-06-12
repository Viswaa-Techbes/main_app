"use client";

import type { CctvPriceResult } from "@/lib/cctv-api";
import { AUTH_TOKEN_STORAGE_KEY } from "@/core/api/config";

export const CCTV_CART_KEY = "techbes_cctv_cart";

export type CctvCartItem = {
  id: string;
  serviceSlug: string;
  serviceName: string;
  categoryId?: string;
  subcategoryId: string;
  input: any;
  price: CctvPriceResult;
  notes?: string;
};

function isUserLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return !!window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

let isSyncing = false;

export function triggerBackendSync() {
  if (typeof window === "undefined" || isSyncing || !isUserLoggedIn()) return;
  isSyncing = true;
  fetch("/api/cart")
    .then((r) => r.ok ? r.json().catch(() => ({})) : {})
    .then((json) => {
      if (json.success && json.data?.items) {
        saveCctvCartLocal(json.data.items);
        (window as any)._cartSynced = true;
      }
    })
    .catch((err) => console.error("[Cart Sync] Failed", err))
    .finally(() => {
      isSyncing = false;
    });
}

export function getCctvCart(): CctvCartItem[] {
  if (typeof window === "undefined") return [];
  
  if (isUserLoggedIn() && !(window as any)._cartSynced) {
    triggerBackendSync();
  }

  try {
    return JSON.parse(window.localStorage.getItem(CCTV_CART_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveCctvCartLocal(items: CctvCartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CCTV_CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cctv-cart-updated"));
}

function generateUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

export function addCctvCartItem(item: Omit<CctvCartItem, "id"> & { id?: string }, replaceExisting = false) {
  const items = getCctvCart();
  const itemId = item.id || generateUUID();
  const newItem = { ...item, id: itemId };
  
  let next: CctvCartItem[];
  if (replaceExisting) {
    next = [newItem];
  } else {
    const existingIndex = items.findIndex((i) => i.id === itemId);
    if (existingIndex > -1) {
      next = [...items];
      next[existingIndex] = newItem;
    } else {
      next = [newItem, ...items];
    }
  }
  
  saveCctvCartLocal(next);

  if (isUserLoggedIn()) {
    fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item: newItem, replaceExisting }),
    })
      .then((r) => r.ok ? r.json().catch(() => ({})) : {})
      .then((json) => {
        if (json.success && json.data?.items) {
          saveCctvCartLocal(json.data.items);
        }
      })
      .catch((err) => console.error("[Cart Add] Backend sync failed", err));
  }
}

export function removeCctvCartItem(id: string) {
  const next = getCctvCart().filter((item) => item.id !== id);
  saveCctvCartLocal(next);

  if (isUserLoggedIn()) {
    fetch(`/api/cart/item/${id}`, {
      method: "DELETE",
    })
      .then((r) => r.ok ? r.json().catch(() => ({})) : {})
      .then((json) => {
        if (json.success && json.data?.items) {
          saveCctvCartLocal(json.data.items);
        }
      })
      .catch((err) => console.error("[Cart Delete] Backend sync failed", err));
  }
}

export function clearCctvCart() {
  saveCctvCartLocal([]);

  if (isUserLoggedIn()) {
    fetch("/api/cart/clear", {
      method: "DELETE",
    })
      .then((r) => r.ok ? r.json().catch(() => ({})) : {})
      .then((json) => {
        if (json.success && json.data?.items) {
          saveCctvCartLocal(json.data.items);
        }
      })
      .catch((err) => console.error("[Cart Clear] Backend sync failed", err));
  }
}
