"use client";

import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Loader2,
  MapPin,
  TicketPercent,
  Phone,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MarketplaceService } from "@/lib/marketplace-data";
import { useBookingFlow } from "@/hooks/use-booking-flow";
import { API_BASE_URL, AUTH_TOKEN_STORAGE_KEY } from "@/core/api/config";
import { useAuth } from "@/features/auth/context/auth-context";

/** Returns today + next 3 days as formatted strings */
function getAvailableDates(): { iso: string; label: string }[] {
  const dates: { iso: string; label: string }[] = [];
  const today = new Date();

  for (let i = 0; i < 4; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);
    const iso = d.toISOString().split("T")[0]; // "YYYY-MM-DD"
    const label = d.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });
    dates.push({ iso, label: i === 0 ? `Today · ${label}` : label });
  }

  return dates;
}

export function BookingModal({
  open,
  onOpenChange,
  service,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: MarketplaceService;
}) {
  const flow = useBookingFlow();
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();
  const availableDates = getAvailableDates();

  // Prefill details if user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      flow.updateState({
        customerName: flow.state.customerName || user.name || "",
        customerPhone: flow.state.customerPhone || user.phone || "",
      });
    }
  }, [isAuthenticated, user, flow.state.customerName, flow.state.customerPhone]);

  function closeModal(nextOpen: boolean) {
    onOpenChange(nextOpen);
    if (!nextOpen) flow.resetFlow();
  }

  const hasCoupon = flow.state.coupon.trim().length > 0;
  const discountAmount = hasCoupon ? Math.round(service.priceValue * 0.1) : 0; // 10% discount for any coupon
  const totalAmount = service.priceValue - discountAmount;
  const advanceAmount = Math.round(totalAmount / 2);
  const remainingAmount = Math.max(totalAmount - advanceAmount, 0);
  const finalPriceText = `Rs. ${totalAmount}`;

  function redirectToLogin() {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "techbes_booking_draft",
        JSON.stringify({ serviceId: service.id, state: flow.state, step: flow.step }),
      );
    }
    router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
  }

  async function handlePaymentFlow() {
    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }

    // 1) Create booking on server (stores amounts and returns job id)
    let booking;
    try {
      booking = await flow.confirm({
        serviceId: String(service.id),
        serviceName: service.title,
        // attach pricing for backend
        totalAmount,
      } as any);
    } catch (err: any) {
      if (err?.status === 401) {
        redirectToLogin();
      }
      return;
    }

    if (!booking || !booking._id) {
      return;
    }

    try {
      // 2) Create Razorpay order for advance amount
      const token = typeof window !== "undefined" ? window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) : "";
      const createRes = await fetch(`${API_BASE_URL}/api/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          jobId: booking._id,
          amount: advanceAmount * 100, // paise
          description: `Advance for booking ${booking._id}`,
          receipt: `job_${booking._id}`,
        }),
      });

      if (!createRes.ok) {
        const payload = await createRes.json().catch(() => ({}));
        if (createRes.status === 401) {
          redirectToLogin();
          return;
        }
        throw new Error(payload.message || 'Unable to create payment order');
      }

      const orderPayload = await createRes.json();
      const order = orderPayload.data;

      // 3) Load Razorpay checkout
      try {
        await loadRazorpay();
      } catch (loadErr) {
        console.error("Dynamic Razorpay SDK loading failed", loadErr);
      }

      if (!(window as any).Razorpay) {
        throw new Error("Razorpay Checkout SDK is not loaded. Please verify your internet connection or disable any ad blockers.");
      }

      const options: any = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Techbes',
        description: order.description,
        order_id: order.orderId,
        handler: async function (response: any) {
          // Verify payment on server
          const verifyRes = await fetch(`${API_BASE_URL}/api/payments/verify-payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              jobId: booking._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: order.amount,
            }),
          });

          if (!verifyRes.ok) {
            const payload = await verifyRes.json().catch(() => ({}));
            if (verifyRes.status === 401) {
              redirectToLogin();
              return;
            }
            alert(payload.message || 'Payment verification failed.');
            return;
          }

          // Success
          flow.resetFlow();
          onOpenChange(false);
          // Redirect to dashboard
          router.push("/dashboard");
          alert('Payment successful. Booking confirmed!');
        },
        prefill: {
          name: flow.state.customerName,
          contact: flow.state.customerPhone,
        },
        theme: { color: '#0ea5a4' },
      };

      // @ts-ignore
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error('Payment flow failed', err);
      alert(err.message || 'Payment failed.');
    }
  }

  function loadRazorpay() {
    return new Promise<void>((resolve, reject) => {
      if (typeof window === 'undefined') return reject(new Error('No window'));
      if ((window as any).Razorpay) return resolve();
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
      document.body.appendChild(script);
    });
  }

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="flex max-h-[92dvh] max-w-3xl flex-col overflow-hidden rounded-[32px] border-white/70 bg-white p-0 shadow-2xl">
        <DialogHeader className="shrink-0 border-b border-slate-100 px-6 py-5 pr-14 text-left">
          <DialogTitle className="text-2xl font-semibold text-slate-950">Book {service.title}</DialogTitle>
          <DialogDescription className="text-slate-500">
            Complete the four-step booking flow to confirm your technician slot.
          </DialogDescription>
        </DialogHeader>

        {flow.isConfirmed ? (
          <div className="min-h-0 overflow-y-auto p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="mt-5 text-2xl font-semibold text-slate-950">Booking confirmed!</h3>
            <p className="mt-3 text-slate-600">
              Your request for <strong>{service.title}</strong> has been placed for{" "}
              <strong>{flow.state.date}</strong> at <strong>{flow.state.timeSlot}</strong>.
              <br />
              <span className="text-sm text-slate-500 mt-1 block">
                We will assign a technician and notify you shortly.
              </span>
            </p>
            <Button className="mt-6 rounded-full" onClick={() => closeModal(false)}>
              Done
            </Button>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col">
            {/* ─── LEFT PANEL ─── */}
            <div className="shrink-0 border-b border-slate-100 px-6 py-4">
              <StepIndicator currentStep={flow.step} />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="grid gap-0 lg:grid-cols-[1.1fr,0.9fr]">
                <div className="p-6">
                  <div>

                {/* Step 1 – Address */}
                {flow.step === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-950">Select service address</h3>
                    <Input
                      id="booking-address"
                      value={flow.state.address || ""}
                      onChange={(event) => flow.updateState({ address: event.target.value })}
                      className="h-12 rounded-2xl"
                      placeholder="Office / home address"
                    />
                    <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-500">
                      Add a precise address to improve technician allocation and ETA accuracy.
                    </div>
                  </div>
                )}

                {/* Step 2 – Date & Time (limited to next 4 days) */}
                {flow.step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-950">Choose date</h3>
                      <p className="text-sm text-slate-500 mt-1">Only slots for the next 4 days are available.</p>
                      {/* Responsive date grid – 2 cols on sm, 1 col on mobile */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(2, 1fr)",
                          gap: 10,
                          marginTop: 16,
                        }}
                        className="booking-date-grid"
                      >
                        <style>{`
                          @media (max-width: 600px) {
                            .booking-date-grid { grid-template-columns: 1fr !important; }
                            .booking-time-grid { grid-template-columns: 1fr !important; }
                          }
                        `}</style>
                        {availableDates.map(({ iso, label }) => (
                          <button
                            key={iso}
                            id={`date-${iso}`}
                            style={{ width: "100%", padding: "12px", borderRadius: 10 }}
                            className={`rounded-3xl border px-4 py-4 text-left text-sm font-medium transition ${
                              flow.state.date === iso
                                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                : "border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50/50"
                            }`}
                            onClick={() => flow.updateState({ date: iso })}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-950">Choose time slot</h3>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(2, 1fr)",
                          gap: 10,
                          marginTop: 16,
                        }}
                        className="booking-time-grid"
                      >
                        {service.timeSlots.map((slot) => (
                          <button
                            key={slot}
                            id={`slot-${slot.replace(/\s/g, "-")}`}
                            style={{ width: "100%", padding: "12px", borderRadius: 10 }}
                            className={`rounded-3xl border px-4 py-4 text-left text-sm font-medium transition ${
                              flow.state.timeSlot === slot
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50/50"
                            }`}
                            onClick={() => flow.updateState({ timeSlot: slot })}
                          >
                            <Clock3 className="inline h-3.5 w-3.5 mr-1.5 opacity-60" />
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3 – Contact Info */}
                {flow.step === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-950">Your details</h3>
                    <p className="text-sm text-slate-500 mt-1">Please provide your contact information so the technician can reach you.</p>
                    <div className="space-y-3 mt-4">
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-1.5 block">Full Name</label>
                        <Input
                          value={flow.state.customerName || ""}
                          onChange={(event) => flow.updateState({ customerName: event.target.value })}
                          className="h-12 rounded-2xl"
                          placeholder="e.g. John Doe"
                          disabled={!!user?.name}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-1.5 block">Phone Number</label>
                        <Input
                          value={flow.state.customerPhone || ""}
                          onChange={(event) => flow.updateState({ customerPhone: event.target.value })}
                          className="h-12 rounded-2xl"
                          placeholder="e.g. 9876543210"
                          type="tel"
                          disabled={!!user?.phone}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4 – Review */}
                {flow.step === 4 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-950">Review summary</h3>
                    <Input
                      value={flow.state.coupon || ""}
                      onChange={(event) => flow.updateState({ coupon: event.target.value })}
                      className="h-12 rounded-2xl"
                      placeholder="Coupon code (optional)"
                    />
                    <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
                      <div className="flex items-center justify-between">
                        <span>Service</span>
                        <span className="font-semibold text-slate-950">{service.title}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Address</span>
                        <span className="max-w-[16rem] text-right">{flow.state.address || "Not selected"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Visit slot</span>
                        <span>
                          {flow.state.date
                            ? new Date(flow.state.date).toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short" })
                            : "Date"}{" "}
                          {flow.state.timeSlot || "Time"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                        <span>Name</span>
                        <span className="font-semibold text-slate-950">{flow.state.customerName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Phone</span>
                        <span className="font-semibold text-slate-950">{flow.state.customerPhone}</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                        <span>Price</span>
                        <div className="text-right">
                          {hasCoupon && <span className="line-through text-slate-400 mr-2 text-xs">{service.price}</span>}
                          <span className="font-semibold text-slate-950">{finalPriceText}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5 – Confirm */}
                {flow.step === 5 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-950">Confirm booking</h3>
                    {flow.bookingError && (
                      <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {flow.bookingError}
                      </div>
                    )}
                    <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-800">
                      Your booking will be confirmed instantly. An admin will assign a technician and notify you.
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-5 text-sm leading-6 text-slate-600">
                      By confirming, you agree to pricing estimates, technician assignment, and communication updates for service completion.
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="modal-footer sticky bottom-0 z-20 -mx-6 mt-6 flex shrink-0 items-center justify-between gap-3 border-t border-slate-100 bg-white px-6 py-5">
                <Button
                  variant="outline"
                  className="relative z-30 rounded-full"
                  onClick={flow.previousStep}
                  disabled={flow.step === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
                {flow.step < 5 ? (
                  <Button
                    className="relative z-30 rounded-full"
                    onClick={flow.nextStep}
                    disabled={
                      (flow.step === 1 && !flow.state.address) ||
                      (flow.step === 2 && (!flow.state.date || !flow.state.timeSlot)) ||
                      (flow.step === 3 && (!flow.state.customerName || !flow.state.customerPhone))
                    }
                  >
                    Continue
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    className="relative z-30 rounded-full"
                    onClick={handlePaymentFlow}
                    disabled={flow.isSubmitting}
                  >
                    {flow.isSubmitting ? (
                      <><Loader2 className="h-4 w-4 animate-spin mr-1" /> Processing…</>
                    ) : (
                      "Pay 50% Advance"
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* ─── RIGHT PANEL – Snapshot ─── */}
            <div className="min-h-0 overflow-y-auto border-t border-slate-100 bg-slate-50/80 p-6 lg:border-l lg:border-t-0">
              <Card className="rounded-[28px] border-slate-200 bg-white">
                <CardContent className="space-y-5 p-6">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Booking snapshot</p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-950">{service.title}</h3>
                  </div>
                  <div className="space-y-3 text-sm text-slate-600">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span className="line-clamp-2">{flow.state.address || "Address pending"}</span>
                    </div>
                    {(flow.state.customerName || flow.state.customerPhone) && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-indigo-500 shrink-0" />
                        <span>
                          {flow.state.customerName && <span className="font-medium mr-2">{flow.state.customerName}</span>}
                          {flow.state.customerPhone}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Clock3 className="h-4 w-4 text-blue-600 shrink-0" />
                      {flow.state.date
                        ? new Date(flow.state.date).toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short" })
                        : "Select a date"}{" "}
                      {flow.state.timeSlot || ""}
                    </div>
                    <div className="flex items-center gap-3">
                      <TicketPercent className="h-4 w-4 text-amber-500 shrink-0" />
                      {flow.state.coupon ? `Coupon: ${flow.state.coupon}` : "No coupon added"}
                    </div>
                  </div>
                  <div className="rounded-3xl bg-white p-4 border border-slate-100">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-500">Total Amount</p>
                      <p className="font-semibold text-slate-900">Rs. {totalAmount}</p>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-sm text-slate-500">Advance (50%)</p>
                      <p className="font-semibold text-emerald-700">Rs. {advanceAmount}</p>
                    </div>
                    <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-3">
                      <p className="text-sm text-slate-500">Remaining</p>
                      <p className="font-semibold text-slate-900">Rs. {remainingAmount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = ["Address", "Schedule", "Contact", "Review", "Payment"];

  return (
    <div className="flex flex-wrap gap-3">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const active = currentStep === stepNumber;
        const complete = currentStep > stepNumber;

        return (
          <div
            key={label}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              complete
                ? "bg-emerald-100 text-emerald-700"
                : active
                  ? "bg-slate-950 text-white"
                  : "bg-slate-100 text-slate-500"
            }`}
          >
            {stepNumber}. {label}
          </div>
        );
      })}
    </div>
  );
}
