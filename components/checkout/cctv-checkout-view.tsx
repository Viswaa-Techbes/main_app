"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cctvApi } from "@/lib/cctv-api";
import { clearCctvCart, CctvCartItem, getCctvCart } from "@/lib/cctv-cart";

function money(value?: number) {
  return `Rs. ${Math.round(value || 0).toLocaleString("en-IN")}`;
}

export function CctvCheckoutView() {
  const router = useRouter();
  const [items, setItems] = useState<CctvCartItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    address: "",
    location: "",
    date: "",
    timeSlot: "",
    notes: "",
  });

  useEffect(() => setItems(getCctvCart()), []);
  const first = items[0];
  const total = items.reduce((sum, item) => sum + (item.price.priceBreakdown.grandTotal || 0), 0);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!first) return;
    try {
      setSaving(true);
      setError("");
      const booking = await cctvApi.createBooking({
        service: first.serviceName,
        serviceId: first.subcategoryId,
        serviceName: first.serviceName,
        address: form.address || form.location,
        description: form.notes,
        date: form.date,
        timeSlot: form.timeSlot,
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        totalAmount: total,
        serviceType: "installation",
        cctvDetails: {
          ...first.price,
          notes: form.notes,
          priceBreakdown: { ...first.price.priceBreakdown, grandTotal: total },
        },
      });
      clearCctvCart();
      router.push(`/booking-success?bookingId=${booking._id || booking.id || ""}`);
    } catch (err: any) {
      setError(err.message || "Checkout failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-slate-950">Checkout</h1>
      <p className="mt-2 text-sm text-slate-600">Confirm customer details and preferred slot.</p>
      {!items.length ? <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 text-slate-600">Your cart is empty.</div> : (
        <form onSubmit={submit} className="mt-6 grid gap-5 lg:grid-cols-[1fr,320px]">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" value={form.customerName} onChange={(v) => setForm({ ...form, customerName: v })} required />
              <Field label="Phone" value={form.customerPhone} onChange={(v) => setForm({ ...form, customerPhone: v })} required />
              <Field label="Preferred Date" type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} required />
              <Field label="Preferred Time" value={form.timeSlot} onChange={(v) => setForm({ ...form, timeSlot: v })} placeholder="10:00 AM" required />
              <label className="grid gap-1 text-sm font-medium text-slate-700 sm:col-span-2">Address<textarea className="min-h-24 rounded-md border border-slate-300 px-3 py-2" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required /></label>
              <label className="grid gap-1 text-sm font-medium text-slate-700 sm:col-span-2">Notes<textarea className="min-h-20 rounded-md border border-slate-300 px-3 py-2" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></label>
            </div>
            {error && <p className="mt-4 rounded-md bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
          </div>
          <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:self-start">
            <h2 className="font-semibold text-slate-950">Order Summary</h2>
            {items.map((item) => <div key={item.id} className="mt-3 text-sm text-slate-600">{item.serviceName}<div className="font-bold text-slate-950">{money(item.price.priceBreakdown.grandTotal)}</div></div>)}
            <div className="mt-4 flex justify-between border-t border-slate-200 pt-3 text-lg font-bold"><span>Total</span><span>{money(total)}</span></div>
            <Button disabled={saving} className="mt-5 w-full bg-emerald-600 text-white hover:bg-emerald-700">{saving ? "Booking..." : "Place Booking"}</Button>
          </aside>
        </form>
      )}
    </main>
  );
}

function Field({ label, value, onChange, type = "text", required, placeholder }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean; placeholder?: string }) {
  return <label className="grid gap-1 text-sm font-medium text-slate-700">{label}<input className="h-10 rounded-md border border-slate-300 px-3" type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} placeholder={placeholder} /></label>;
}
