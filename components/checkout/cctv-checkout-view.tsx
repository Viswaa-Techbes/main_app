"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cctvApi } from "@/lib/cctv-api";
import { AUTH_TOKEN_STORAGE_KEY } from "@/core/api/config";
import { clearCctvCart, CctvCartItem, getCctvCart } from "@/lib/cctv-cart";

function money(value?: number) {
  return `Rs. ${Math.round(value || 0).toLocaleString("en-IN")}`;
}

function loadRazorpayCheckout() {
  return new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("Window not available"));
    if ((window as any).Razorpay) {
      console.log("[Checkout] Razorpay script already loaded");
      return resolve();
    }
    console.log("[Checkout] Loading Razorpay checkout script");
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      existing.addEventListener("load", () => {
        console.log("[Checkout] Razorpay checkout script loaded");
        resolve();
      }, { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load Razorpay SDK")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      console.log("[Checkout] Razorpay checkout script loaded");
      resolve();
    };
    script.onerror = () => {
      console.error("[Checkout] Razorpay checkout script failed to load");
      reject(new Error("Failed to load Razorpay SDK"));
    };
    document.head.appendChild(script);
  });
}

export function CctvCheckoutView() {
  const router = useRouter();
  const [items, setItems] = useState<CctvCartItem[]>([]);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    address: "",
    location: "", // Used as googleMapLink
    date: "",
    timeSlot: "",
    notes: "",
  });

  const search = useSearchParams();
  const paymentId = search?.get ? search.get('paymentId') : null;

  // Verify Auth on Load
  useEffect(() => {
    const token = typeof window !== "undefined" ? window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) : null;
    if (!token) {
      console.warn("[Checkout] Unauthenticated. Redirecting to login.");
      alert("Please log in or register before checking out.");
      router.push("/login?redirect=/checkout");
      return;
    }

    // Load Cart Items
    const cartItems = getCctvCart();
    setItems(cartItems);
    if (cartItems.length > 0) {
      const firstItem = cartItems[0];
      setForm((prev) => ({
        ...prev,
        date: firstItem.input?.date || prev.date,
        timeSlot: firstItem.input?.time || prev.timeSlot,
        location: firstItem.input?.mapLink || prev.location,
        notes: firstItem.input?.notes || prev.notes,
      }));
    }

    // Load Saved Addresses
    fetch("/api/user/addresses")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setSavedAddresses(json.data);
          // Auto-select default address if present
          const def = json.data.find((a: any) => a.isDefault);
          if (def) {
            setSelectedAddressId(def._id);
            setForm((prev) => ({
              ...prev,
              customerName: def.name || prev.customerName,
              customerPhone: def.mobile || prev.customerPhone,
              address: def.address || [def.addressLine1, def.addressLine2].filter(Boolean).join(", "),
              location: def.googleMapLink || prev.location,
            }));
          }
        }
      })
      .catch((err) => console.error("Failed to load saved addresses", err));
  }, [router]);

  // Handle Saved Address Selection Change
  function handleAddressChange(addrId: string) {
    setSelectedAddressId(addrId);
    if (addrId === "new") {
      setForm((prev) => ({
        ...prev,
        customerName: "",
        customerPhone: "",
        address: "",
        location: "",
      }));
      return;
    }

    const addr = savedAddresses.find((a) => a._id === addrId);
    if (addr) {
      setForm((prev) => ({
        ...prev,
        customerName: addr.name || prev.customerName,
        customerPhone: addr.mobile || prev.customerPhone,
        address: addr.address || [addr.addressLine1, addr.addressLine2].filter(Boolean).join(", "),
        location: addr.googleMapLink || prev.location,
      }));
    }
  }

  // Handle Existing/Retry Payments
  useEffect(() => {
    async function openExistingPayment(pid: string) {
      try {
        console.log('[Checkout] Opening existing payment', { paymentId: pid });
        const token = typeof window !== 'undefined' ? window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) : null;
        const res = await fetch(`/api/v2/payment/${pid}`, { headers: { Authorization: `Bearer ${token}` } });
        const json = await res.json();
        if (!json.success) throw new Error(json.message || 'Failed to load payment');
        const { payment, keyId } = json.data;

        await loadRazorpayCheckout();

        const options = {
          key: keyId,
          amount: payment.amount,
          currency: payment.currency || 'INR',
          name: 'Booking Payment',
          description: 'Retry Payment',
          order_id: payment.razorpayOrderId,
          handler: async (resp: any) => {
            try {
              console.log('[Checkout] Payment Success', resp);
              const verify = await cctvApi.verifyPayment({
                razorpay_order_id: resp.razorpay_order_id,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature,
              });
              clearCctvCart();
              const job = verify.job || verify.data?.job || verify.data;
              router.push(`/booking-success?bookingId=${job._id || job.id || ''}`);
            } catch (err: any) {
              console.error('[Checkout] Payment verification failed', err);
              setError(err?.message || 'Payment verification failed');
            }
          },
          modal: {
            ondismiss: () => console.warn('[Checkout] Razorpay popup dismissed'),
          },
        } as any;

        console.log('[Checkout] Opening Razorpay');
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', (response: any) => console.error('[Checkout] Payment Failed', response));
        rzp.open();
      } catch (err: any) {
        console.error('[Checkout] Existing payment failed', err);
        setError(err?.message || 'Failed to open existing payment');
      }
    }

    if (paymentId) {
      openExistingPayment(paymentId);
    }
  }, [paymentId, router]);

  const first = items[0];
  const total = items.reduce((sum, item) => sum + (item.price?.priceBreakdown?.grandTotal || 0), 0);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!first) {
      setError("Your cart is empty.");
      return;
    }

    // 1. Authenticated check
    const token = typeof window !== "undefined" ? window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) : null;
    if (!token) {
      setError("User session expired. Please login again.");
      router.push("/login");
      return;
    }

    // 2. Service Type check
    const serviceType = first.input?.serviceType;
    if (!serviceType || !serviceType.trim()) {
      setError("Please ensure a Service Type is configured for your CCTV selection.");
      return;
    }

    // 3. Materials selected check
    const materialsSelected = first.input?.materials;
    if (!materialsSelected || !materialsSelected.length) {
      setError("Please ensure at least one Material is selected in your CCTV configuration.");
      return;
    }

    // 4. Date check
    const dateToCheck = form.date || first.input?.date;
    if (!dateToCheck || !dateToCheck.trim()) {
      setError("Please select a Preferred Date for scheduling.");
      return;
    }

    // 5. Time check
    const timeToCheck = form.timeSlot || first.input?.time;
    if (!timeToCheck || !timeToCheck.trim()) {
      setError("Please select a Preferred Time slot for scheduling.");
      return;
    }

    // 6. Address check
    if (!form.address || !form.address.trim()) {
      setError("Please provide a valid shipping/installation Address.");
      return;
    }

    // 7. Google Map Link check
    const mapLink = form.location || first.input?.mapLink;
    if (!mapLink || !mapLink.trim() || !mapLink.includes("http")) {
      setError("A valid Google Map Link (URL) is required.");
      return;
    }

    try {
      setSaving(true);
      const bookingPayload = {
        service: first.serviceName,
        serviceId: first.subcategoryId,
        serviceName: first.serviceName,
        address: form.address,
        description: form.notes,
        date: dateToCheck,
        timeSlot: timeToCheck,
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        totalAmount: total,
        serviceType: serviceType || "installation",
        addressId: selectedAddressId && selectedAddressId !== "new" ? selectedAddressId : undefined,
        cctvDetails: (() => {
          const selected = first.input?.materials || [];
          const materialLengths = selected.filter((m: any) => m.unit === 'meter').map((m: any) => ({ id: m.id, length: m.qty }));
          const materialQuantities = selected.filter((m: any) => m.unit !== 'meter').map((m: any) => ({ id: m.id, qty: m.qty }));
          return {
            serviceCategory: first.categoryId || 'cctv',
            serviceType: serviceType,
            selectedMaterials: selected,
            materialLengths,
            materialQuantities,
            mapLink: mapLink,
            date: dateToCheck,
            time: timeToCheck,
            notes: first.input?.notes || form.notes,
            priceBreakdown: { ...(first.price?.priceBreakdown || {}), grandTotal: total },
          };
        })(),
      };

      console.log("[Checkout] Creating Order", bookingPayload);
      const orderResp = await cctvApi.createOrder({ bookingPayload });
      const order = orderResp;
      console.log("[Checkout] Order Created", order);

      await loadRazorpayCheckout();

      const options = {
        key: order.keyId || order.key || order.keyId,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: order.description || 'Booking Payment',
        description: order.description || bookingPayload.serviceName,
        order_id: order.orderId || order.id,
        handler: async (resp: any) => {
          try {
            console.log("[Checkout] Payment Success", resp);
            const verify = await cctvApi.verifyPayment({
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature: resp.razorpay_signature,
            });
            console.log("[Checkout] Payment Verified", verify);
            clearCctvCart();
            const job = verify.job || verify.data?.job || verify.data;
            router.push(`/booking-success?bookingId=${job._id || job.id || ''}`);
          } catch (err: any) {
            console.error("[Checkout] Payment verification failed", err);
            setError(err?.message || 'Payment verification failed');
          }
        },
        modal: {
          ondismiss: () => console.warn("[Checkout] Razorpay popup dismissed"),
        },
        prefill: {
          name: bookingPayload.customerName,
          contact: bookingPayload.customerPhone,
        },
      } as any;

      console.log("[Checkout] Opening Razorpay");
      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (response: any) => console.error("[Checkout] Payment Failed", response));
      rzp.open();
    } catch (err: any) {
      console.error("[Checkout] Checkout failed", err);
      setError(err.message || "Checkout failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-slate-950">Checkout</h1>
      <p className="mt-2 text-sm text-slate-600">Confirm customer details and preferred slot.</p>
      {!items.length ? (
        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 text-slate-600">Your cart is empty.</div>
      ) : (
        <form onSubmit={submit} className="mt-6 grid gap-5 lg:grid-cols-[1fr,320px]">
          <div className="rounded-lg border border-slate-200 bg-white p-5 space-y-4">
            {/* Address Selection Dropdown */}
            {savedAddresses.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Service Address</label>
                <select
                  value={selectedAddressId}
                  onChange={(e) => handleAddressChange(e.target.value)}
                  className="h-11 w-full rounded-md border border-slate-300 px-3 bg-white"
                >
                  <option value="" disabled>-- Choose Address --</option>
                  {savedAddresses.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.label} ({a.name} - {a.city})
                    </option>
                  ))}
                  <option value="new">-- Enter New Address --</option>
                </select>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Customer Name" value={form.customerName} onChange={(v) => setForm({ ...form, customerName: v })} required />
              <Field label="Customer Phone" value={form.customerPhone} onChange={(v) => setForm({ ...form, customerPhone: v })} required />
              <Field label="Preferred Date" type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} required />
              <Field label="Preferred Time" type="time" value={form.timeSlot} onChange={(v) => setForm({ ...form, timeSlot: v })} required />
              <Field label="Google Map Link" value={form.location} onChange={(v) => setForm({ ...form, location: v })} required placeholder="https://maps.google.com/..." />
              
              <label className="grid gap-1 text-sm font-medium text-slate-700 sm:col-span-2">
                Address
                <textarea
                  className="min-h-24 rounded-md border border-slate-300 px-3 py-2"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  required
                />
              </label>
              
              <label className="grid gap-1 text-sm font-medium text-slate-700 sm:col-span-2">
                Notes
                <textarea
                  className="min-h-20 rounded-md border border-slate-300 px-3 py-2"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </label>
            </div>
            {error && <p className="mt-4 rounded-md bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
          </div>
          <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:self-start">
            <h2 className="font-semibold text-slate-950">Order Summary</h2>
            {items.map((item) => (
              <div key={item.id} className="mt-3 text-sm text-slate-600 border-b border-slate-100 pb-3">
                <div className="font-medium text-slate-900">{item.serviceName}</div>
                <div className="text-xs text-slate-500 capitalize">{item.input?.serviceType}</div>
                <div className="mt-2 space-y-1">
                  {(item.input?.materials || []).map((m: any) => (
                    <div key={m.id} className="flex justify-between text-xs text-slate-500">
                      <div>{m.name} ×{m.qty}</div>
                      <div>₹{m.total}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-xs text-slate-600 flex justify-between">
                  <span>Labour:</span>
                  <span>{money(item.price?.priceBreakdown?.labourCost)}</span>
                </div>
                <div className="mt-1 text-xs text-slate-600 flex justify-between">
                  <span>Subtotal:</span>
                  <span>{money(item.price?.priceBreakdown?.grandTotal)}</span>
                </div>
              </div>
            ))}
            <div className="mt-4 flex justify-between text-lg font-bold text-slate-950"><span>Total</span><span>{money(total)}</span></div>
            <Button disabled={saving} className="mt-5 w-full bg-emerald-600 text-white hover:bg-emerald-700">{saving ? "Booking..." : "Place Booking"}</Button>
          </aside>
        </form>
      )}
    </main>
  );
}

function Field({ label, value, onChange, type = "text", required, placeholder }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean; placeholder?: string }) {
  return <label className="grid gap-1 text-sm font-medium text-slate-700">{label}<input className="h-11 rounded-md border border-slate-300 px-3 bg-white" type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} placeholder={placeholder} /></label>;
}
