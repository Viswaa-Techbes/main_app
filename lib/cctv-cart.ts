"use client";

import type { CctvPriceInput, CctvPriceResult } from "@/lib/cctv-api";

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

export function getCctvCart(): CctvCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(CCTV_CART_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveCctvCart(items: CctvCartItem[]) {
  window.localStorage.setItem(CCTV_CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cctv-cart-updated"));
}

function generateUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback to random alphanumeric string + timestamp
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

export function addCctvCartItem(item: Omit<CctvCartItem, "id">) {
  const items = getCctvCart();
  const next = [{ ...item, id: generateUUID() }, ...items];
  saveCctvCart(next);
}

export function removeCctvCartItem(id: string) {
  saveCctvCart(getCctvCart().filter((item) => item.id !== id));
}

export function clearCctvCart() {
  saveCctvCart([]);
}
