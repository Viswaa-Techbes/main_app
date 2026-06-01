"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CctvCartItem, getCctvCart, removeCctvCartItem } from "@/lib/cctv-cart";

function money(value?: number) {
  return `Rs. ${Math.round(value || 0).toLocaleString("en-IN")}`;
}

export function CctvCartView() {
  const [items, setItems] = useState<CctvCartItem[]>([]);
  const reload = () => setItems(getCctvCart());

  useEffect(() => {
    reload();
    window.addEventListener("cctv-cart-updated", reload);
    return () => window.removeEventListener("cctv-cart-updated", reload);
  }, []);

  const total = items.reduce((sum, item) => sum + (item.price.priceBreakdown.grandTotal || 0), 0);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950">Cart</h1>
          <p className="mt-2 text-sm text-slate-600">Review CCTV service selections before checkout.</p>
        </div>
        <Link href="/cctv" className="text-sm font-semibold text-emerald-700">Add more services</Link>
      </div>

      {!items.length ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-600">Your cart is empty.</p>
          <Button className="mt-4 bg-emerald-600 text-white" asChild><Link href="/cctv">Browse CCTV Services</Link></Button>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1fr,320px]">
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold text-slate-950">{item.serviceName}</h2>
                    <p className="mt-1 text-sm text-slate-600">{item.price.cameraType.name} • {item.price.cameraCount} camera(s) • {item.price.installationArea} • {item.price.wireLength}m wire</p>
                    <p className="mt-2 text-sm text-slate-500">Add-ons: {item.price.addons.map((a) => a.name).join(", ") || "None"}</p>
                  </div>
                  <button aria-label="Remove item" onClick={() => removeCctvCartItem(item.id)} className="rounded-md border border-slate-200 p-2 text-slate-500 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>
                </div>
                <div className="mt-3 text-right text-lg font-bold text-slate-950">{money(item.price.priceBreakdown.grandTotal)}</div>
              </div>
            ))}
          </div>
          <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:self-start">
            <h2 className="text-lg font-semibold text-slate-950">Order Summary</h2>
            <div className="mt-4 flex justify-between text-sm"><span>Items</span><span>{items.length}</span></div>
            <div className="mt-3 flex justify-between border-t border-slate-200 pt-3 text-lg font-bold"><span>Total</span><span>{money(total)}</span></div>
            <Button className="mt-5 w-full bg-emerald-600 text-white hover:bg-emerald-700" asChild><Link href="/checkout">Checkout</Link></Button>
          </aside>
        </div>
      )}
    </main>
  );
}
