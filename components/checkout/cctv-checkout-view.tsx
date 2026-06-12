"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { AUTH_TOKEN_STORAGE_KEY, getApiBaseUrl } from "@/core/api/config";
import { cctvApi } from "@/lib/cctv-api";
import { clearCctvCart, CctvCartItem, getCctvCart } from "@/lib/cctv-cart";

import dynamic from "next/dynamic";
const LocationPicker = dynamic(() => import("@/components/booking/LocationPicker"), { ssr: false });

function money(value?: number) {
  return `Rs. ${Math.round(value || 0).toLocaleString("en-IN")}`;
}

function parseCoordsFromUrl(url: string) {
  if (!url) return null;
  const match = url.match(/q=([-\d.]+),([-\d.]+)/);
  if (match) {
    return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
  }
  return null;
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
  const [profile, setProfile] = useState<{ name: string; mobileNumber: string } | null>(null);
  const [showMap, setShowMap] = useState(true);
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    address: "",
    location: "", // Used as googleMapLink for compatibility
    date: "",
    timeSlot: "",
    notes: "",
    latitude: 0,
    longitude: 0,
    pincode: "",
    city: "",
    state: "",
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
    let initialLat = 0;
    let initialLng = 0;
    let initialLocation = "";
    if (cartItems.length > 0) {
      const firstItem = cartItems[0];
      const coords = parseCoordsFromUrl(firstItem.input?.mapLink || "");
      const latVal = firstItem.input?.latitude || coords?.lat || 0;
      const lngVal = firstItem.input?.longitude || coords?.lng || 0;
      if (latVal && lngVal) {
        initialLat = latVal;
        initialLng = lngVal;
        initialLocation = firstItem.input?.mapLink || "";
      }
      setForm((prev) => ({
        ...prev,
        date: firstItem.input?.date || prev.date,
        timeSlot: firstItem.input?.time || prev.timeSlot,
        location: firstItem.input?.mapLink || prev.location,
        latitude: latVal || prev.latitude,
        longitude: lngVal || prev.longitude,
        pincode: firstItem.input?.pincode || prev.pincode || "",
        address: firstItem.input?.fullAddress || prev.address || "",
        city: firstItem.input?.city || prev.city || "",
        state: firstItem.input?.state || prev.state || "",
        notes: firstItem.input?.notes || prev.notes,
      }));
      setShowMap(!(latVal && lngVal));
    }

    // Load Saved Addresses
    fetch("/api/user/addresses")
      .then((r) => r.ok ? r.json().catch(() => ({})) : {})
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setSavedAddresses(json.data);
          // Auto-select default address if present
          const def = json.data.find((a: any) => a.isDefault);
          if (def) {
            setSelectedAddressId(def._id);
            const addrCoords = def.latitude && def.longitude ? { lat: def.latitude, lng: def.longitude } : parseCoordsFromUrl(def.googleMapLink || "");
            const resolvedLat = initialLat || addrCoords?.lat || 0;
            const resolvedLng = initialLng || addrCoords?.lng || 0;
            const hasCoords = !!(resolvedLat && resolvedLng);
            setForm((prev) => ({
              ...prev,
              customerName: def.name || prev.customerName,
              customerPhone: def.mobile || prev.customerPhone,
              address: def.address || [def.addressLine1, def.addressLine2].filter(Boolean).join(", "),
              location: def.googleMapLink || prev.location || initialLocation,
              latitude: resolvedLat,
              longitude: resolvedLng,
              pincode: def.pincode || prev.pincode || "",
              city: def.city || prev.city || "",
              state: def.state || prev.state || "",
            }));
            setShowMap(!hasCoords);
          } else {
            const hasCoords = !!(initialLat && initialLng);
            setShowMap(!hasCoords);
          }
        } else {
          const hasCoords = !!(initialLat && initialLng);
          setShowMap(!hasCoords);
        }
      })
      .catch((err) => {
        console.error("Failed to load saved addresses", err);
        const hasCoords = !!(initialLat && initialLng);
        setShowMap(!hasCoords);
      });

    // Fetch user profile details to auto-fill customerName & customerPhone
    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((r) => r.ok ? r.json().catch(() => ({})) : {})
      .then((json) => {
        if (json.success && json.data) {
          setProfile(json.data);
          setForm((prev) => ({
            ...prev,
            customerName: json.data.name || prev.customerName,
            customerPhone: json.data.mobileNumber || json.data.phone || prev.customerPhone,
          }));
        }
      })
      .catch((err) => console.error("Failed to load user profile", err));
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
        latitude: 0,
        longitude: 0,
        pincode: "",
        city: "",
        state: "",
      }));
      setShowMap(true);
      return;
    }

    const addr = savedAddresses.find((a) => a._id === addrId);
    if (addr) {
      const coords = addr.latitude && addr.longitude ? { lat: addr.latitude, lng: addr.longitude } : parseCoordsFromUrl(addr.googleMapLink || "");
      const hasCoords = !!(coords?.lat && coords?.lng);
      setForm((prev) => ({
        ...prev,
        customerName: addr.name || prev.customerName,
        customerPhone: addr.mobile || prev.customerPhone,
        address: addr.address || [addr.addressLine1, addr.addressLine2].filter(Boolean).join(", "),
        location: addr.googleMapLink || prev.location,
        latitude: coords?.lat || 0,
        longitude: coords?.lng || 0,
        pincode: addr.pincode || "",
        city: addr.city || "",
        state: addr.state || "",
      }));
      setShowMap(!hasCoords);
    } else {
      setShowMap(true);
    }
  }

  // Handle Dynamic Location Picker selection
  function handleLocationSelected(data: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    latitude: number;
    longitude: number;
  }) {
    console.log("Selected Location:");
    console.log("Address:", data.address);
    console.log("Coordinates:", `${data.latitude}, ${data.longitude}`);
    console.log("Pincode:", data.pincode);
    
    setForm((prev) => ({
      ...prev,
      address: data.address,
      location: `https://maps.google.com/?q=${data.latitude},${data.longitude}`,
      latitude: data.latitude,
      longitude: data.longitude,
      pincode: data.pincode,
      city: data.city,
      state: data.state,
    }));
    setShowMap(false); // Automatically collapse map view on confirm
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
      setError("Please ensure a Service Type is configured for your service selection.");
      return;
    }

    // 3. Materials selected check
    const materialsSelected = first.input?.materials;
    if (first.input?.isMaterialsRequired && (!materialsSelected || !materialsSelected.length)) {
      setError("Please ensure at least one Material/Option is selected in your service configuration.");
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

    // 7. Coordinates check
    if (!form.latitude || !form.longitude) {
      setError("Please select and confirm your service location on the map.");
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
        lat: String(form.latitude),
        lng: String(form.longitude),
        latitude: form.latitude,
        longitude: form.longitude,
        city: form.city || "",
        state: form.state || "",
        pincode: form.pincode,
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
            mapLink: form.location,
            date: dateToCheck,
            time: timeToCheck,
            notes: first.input?.notes || form.notes,
            priceBreakdown: { ...(first.price?.priceBreakdown || {}), grandTotal: total },
          };
        })(),
      };

      console.log("Selected Location:");
      console.log("Address:", form.address);
      console.log("Coordinates:", `${form.latitude}, ${form.longitude}`);
      console.log("Pincode:", form.pincode);
      console.log("API URL:", `${getApiBaseUrl()}/api/v2/payments/create-order`);
      console.log("[Checkout] Creating Order", bookingPayload);
      
      const orderResp = await cctvApi.createOrder({ bookingPayload });
      const order = orderResp;
      console.log("Response:", order);
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
            console.log("Response:", verify);
            console.log("[Checkout] Payment Verified", verify);
            clearCctvCart();
            const job = verify.job || verify.data?.job || verify.data;
            router.push(`/booking-success?bookingId=${job._id || job.id || ''}`);
          } catch (err: any) {
            console.error("Error:", err.message || err);
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
      rzp.on("payment.failed", (response: any) => {
        console.error("Error:", response);
        console.error("[Checkout] Payment Failed", response);
      });
      rzp.open();
    } catch (err: any) {
      console.error("Error:", err.message || err);
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

            {/* Confirmed Location Summary (Swiggy/Uber Style) */}
            {!showMap && form.latitude && form.longitude ? (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 flex items-start justify-between gap-4">
                <div className="flex gap-3 items-start">
                  <div className="rounded-full bg-emerald-100 p-2 text-emerald-700 mt-0.5">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 text-sm">Service Location Confirmed</h3>
                    <p className="text-sm text-slate-700 mt-1 leading-relaxed">{form.address}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mt-2">
                      {form.city && <span><strong>City:</strong> {form.city}</span>}
                      {form.state && <span><strong>State:</strong> {form.state}</span>}
                      {form.pincode && <span><strong>Pincode:</strong> {form.pincode}</span>}
                      <span><strong>Coordinates:</strong> {form.latitude.toFixed(5)}, {form.longitude.toFixed(5)}</span>
                    </div>
                  </div>
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowMap(true)}
                  className="border-emerald-200 hover:bg-emerald-50 text-emerald-700 font-medium shrink-0 rounded-full"
                >
                  Change Location
                </Button>
              </div>
            ) : (
              /* Map Picker for Address Selection */
              (selectedAddressId === "new" || savedAddresses.length === 0 || showMap) && (
                <div className="border-t border-slate-100 pt-4 pb-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Pin Service Location on Map</label>
                  <LocationPicker 
                    onLocationSelected={handleLocationSelected} 
                    initialCoords={form.latitude && form.longitude ? { lat: form.latitude, lng: form.longitude } : null}
                  />
                </div>
              )
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Customer Name" value={form.customerName} onChange={(v) => setForm({ ...form, customerName: v })} required disabled={!!profile?.name} />
              <Field label="Customer Phone" value={form.customerPhone} onChange={(v) => setForm({ ...form, customerPhone: v })} required disabled={!!profile?.mobileNumber} />
              <Field label="Preferred Date" type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} required />
              <Field label="Preferred Time" type="time" value={form.timeSlot} onChange={(v) => setForm({ ...form, timeSlot: v })} required />
              
              <label className="grid gap-1 text-sm font-medium text-slate-700 sm:col-span-2">
                Address
                <textarea
                  className="min-h-24 rounded-md border border-slate-300 px-3 py-2"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  required
                  placeholder="Street address, building, suite details..."
                />
              </label>
              
              <label className="grid gap-1 text-sm font-medium text-slate-700 sm:col-span-2">
                Notes
                <textarea
                  className="min-h-20 rounded-md border border-slate-300 px-3 py-2"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Optional site directives, specific camera placements, access details..."
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

function Field({ label, value, onChange, type = "text", required, placeholder, disabled }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean; placeholder?: string; disabled?: boolean }) {
  return <label className="grid gap-1 text-sm font-medium text-slate-700">{label}<input className="h-11 rounded-md border border-slate-300 px-3 bg-white disabled:bg-slate-100 disabled:text-slate-500" type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} placeholder={placeholder} disabled={disabled} /></label>;
}
