"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cctvApi } from "@/lib/cctv-api";
import { AUTH_TOKEN_STORAGE_KEY } from "@/core/api/config";
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
  const total = items.reduce((sum, item) => sum + (item.price?.priceBreakdown?.grandTotal || 0), 0);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!first) return;
    // require authenticated user
    const token = typeof window !== "undefined" ? window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) : null;
    if (!token) {
      alert('Please login or register before placing a booking.');
      router.push('/auth/login');
      return;
    }
    try {
      setSaving(true);
      setError("");
      // Validate map link (if provided) and time format
      const mapLink = first.input?.mapLink || form.location || "";
      if (mapLink) {
        const ok = /https:\/\/(maps\.google\.com|goo\.gl\/maps|maps\.app\.goo\.gl)\/.*/i.test(mapLink);
        if (!ok) {
          setError('Map link must be a valid Google Maps URL (maps.google.com, goo.gl/maps, maps.app.goo.gl)');
          setSaving(false);
          return;
        }
      }
      const timeToCheck = first.input?.time || form.timeSlot || "";
      if (timeToCheck) {
        const okTime = /^([01]\d|2[0-3]):([0-5]\d)$/.test(timeToCheck);
        if (!okTime) {
          setError('Time must be in 24-hour format HH:MM (e.g. 08:00, 13:30)');
          setSaving(false);
          return;
        }
      }
      const bookingPayload = {
        service: first.serviceName,
        serviceId: first.subcategoryId,
        serviceName: first.serviceName,
        address: form.address,
        description: form.notes,
        date: form.date,
        timeSlot: form.timeSlot,
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        totalAmount: total,
        serviceType: first.input?.serviceType || "installation",
        cctvDetails: (() => {
          const selected = first.input?.materials || [];
          const materialLengths = selected.filter((m:any) => m.unit === 'meter').map((m:any) => ({ id: m.id, length: m.qty }));
          const materialQuantities = selected.filter((m:any) => m.unit !== 'meter').map((m:any) => ({ id: m.id, qty: m.qty }));
          return {
            serviceCategory: first.categoryId || 'cctv',
            serviceType: first.input?.serviceType,
            selectedMaterials: selected,
            materialLengths,
            materialQuantities,
            mapLink: first.input?.mapLink,
            date: first.input?.date || form.date,
            time: first.input?.time || form.timeSlot,
            notes: first.input?.notes || form.notes,
            priceBreakdown: { ...(first.price?.priceBreakdown || {}), grandTotal: total },
          };
        })(),
      };

      // Create Razorpay order via backend (stores booking payload in Payment record)
      const orderResp = await cctvApi.createOrder({ bookingPayload });
      const order = orderResp;

      // Load Razorpay script
      await new Promise<void>((resolve, reject) => {
        if (typeof window === 'undefined') return reject(new Error('Window not available'));
        if ((window as any).Razorpay) return resolve();
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
        document.head.appendChild(script);
      });

      const options = {
        key: order.keyId || order.key || order.keyId,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: order.description || 'Booking Payment',
        description: order.description || bookingPayload.serviceName,
        order_id: order.orderId || order.id,
        handler: async (resp: any) => {
          try {
            const verify = await cctvApi.verifyPayment({
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature: resp.razorpay_signature,
            });
            clearCctvCart();
            const job = verify.job || verify.data?.job || verify.data;
            router.push(`/booking-success?bookingId=${job._id || job.id || ''}`);
          } catch (err: any) {
            setError(err?.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: bookingPayload.customerName,
          contact: bookingPayload.customerPhone,
        },
      } as any;

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
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
              <Field label="Preferred Time" type="time" value={form.timeSlot} onChange={(v) => setForm({ ...form, timeSlot: v })} required />
              <label className="grid gap-1 text-sm font-medium text-slate-700 sm:col-span-2">Address<textarea className="min-h-24 rounded-md border border-slate-300 px-3 py-2" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required /></label>
              <label className="grid gap-1 text-sm font-medium text-slate-700 sm:col-span-2">Notes<textarea className="min-h-20 rounded-md border border-slate-300 px-3 py-2" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></label>
            </div>
            {error && <p className="mt-4 rounded-md bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
          </div>
          <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:self-start">
            <h2 className="font-semibold text-slate-950">Order Summary</h2>
            {items.map((item) => (
              <div key={item.id} className="mt-3 text-sm text-slate-600">
                <div className="font-medium">{item.serviceName} — <span className="text-sm font-normal">{item.input?.serviceType}</span></div>
                <div className="mt-2">
                  {(item.input?.materials || []).map((m: any) => (
                    <div key={m.id} className="flex justify-between text-sm text-slate-600">
                      <div>{m.name} {m.qty} {m.unit}</div>
                      <div>₹{m.unitPrice} × {m.qty} = <b>₹{m.total}</b></div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-sm text-slate-600">Labour: <b>{money(item.price?.priceBreakdown?.labourCost)}</b></div>
                <div className="mt-2 text-sm text-slate-600">Map Link: {item.input?.mapLink ? <a href={item.input.mapLink} target="_blank" rel="noreferrer">Open Map</a> : '—'}</div>
                <div className="mt-1 text-sm text-slate-600">Preferred: {item.input?.date || form.date} {item.input?.time || form.timeSlot}</div>
                <div className="mt-1 text-sm text-slate-600">Notes: {item.input?.notes || form.notes || '—'}</div>
                <div className="mt-1 font-bold text-slate-950">{money(item.price?.priceBreakdown?.grandTotal)}</div>
              </div>
            ))}
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
