"use client";

import { useEffect } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Loader2,
  MapPin,
  TicketPercent,
  Phone,
  Calendar,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MarketplaceService } from "@/lib/marketplace-data";
import { useBookingFlow } from "@/hooks/use-booking-flow";
import { getApiBaseUrl, AUTH_TOKEN_STORAGE_KEY } from "@/core/api/config";
import { useAuth } from "@/features/auth/context/auth-context";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
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
      const apiBaseUrl = getApiBaseUrl();
      const createRes = await fetch(`${apiBaseUrl}/api/payments/create-order`, {
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
          const apiBaseUrl = getApiBaseUrl();
          const verifyRes = await fetch(`${apiBaseUrl}/api/payments/verify-payment`, {
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
            toast({ title: "Payment Failed", description: payload.message || 'Payment verification failed.', variant: "destructive" });
            return;
          }

          // Success
          flow.resetFlow();
          onOpenChange(false);
          // Redirect to dashboard
          router.push("/dashboard");
          toast({ title: "Booking Confirmed", description: 'Payment successful. Your booking has been confirmed!' });
        },
        prefill: {
          name: flow.state.customerName,
          contact: flow.state.customerPhone,
        },
        theme: { color: '#2563eb' },
      };

      // @ts-ignore
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error('Payment flow failed', err);
      toast({ title: "Payment Error", description: err.message || 'Payment failed.', variant: "destructive" });
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
      <DialogContent className="flex max-h-[92dvh] max-w-3xl flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white p-0 shadow-2xl">
        <DialogHeader className="shrink-0 border-b border-slate-100 px-6 py-4.5 pr-14 text-left">
          <DialogTitle className="text-base font-bold text-slate-900">Book {service.title}</DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            Complete the checkout steps to book your certified technician.
          </DialogDescription>
        </DialogHeader>

        {flow.isConfirmed ? (
          <div className="min-h-0 overflow-y-auto p-8 text-center flex flex-col items-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 shadow-sm">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900">Booking Confirmed!</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-500 max-w-sm">
              Your request for <strong>{service.title}</strong> has been scheduled for{" "}
              <strong>{flow.state.date}</strong> during <strong>{flow.state.timeSlot}</strong>.
              <br />
              <span className="text-[10px] text-slate-400 mt-2 block">
                A verified technician is being assigned to your request.
              </span>
            </p>
            <Button className="mt-6 rounded-xl text-xs font-bold px-6 h-9" onClick={() => closeModal(false)}>
              Close
            </Button>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col">
            {/* Steps Indicator */}
            <div className="shrink-0 border-b border-slate-50 bg-slate-50/50 px-6 py-3.5">
              <StepIndicator currentStep={flow.step} />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="grid gap-0 lg:grid-cols-[1.2fr,0.8fr]">
                {/* Left Wizard Page */}
                <div className="p-6 min-h-[320px]">
                  
                  {/* Step 1 – Address */}
                  {flow.step === 1 && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Service Location Address</h3>
                      <Input
                        id="booking-address"
                        value={flow.state.address || ""}
                        onChange={(event) => flow.updateState({ address: event.target.value })}
                        className="h-11 rounded-xl border-slate-200 focus:ring-blue-500/20 text-xs bg-slate-50"
                        placeholder="Enter complete installation/repair address..."
                      />
                      <div className="rounded-2xl bg-blue-50/50 p-4 text-[11px] font-semibold text-blue-600 leading-relaxed">
                        Providing a complete address with floor/building number improves auto-assignment accuracy and reduces ETAs.
                      </div>
                    </div>
                  )}

                  {/* Step 2 – Date & Time */}
                  {flow.step === 2 && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Select Date</h3>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Scheduling is open for the next 4 days.</p>
                        
                        <div className="grid gap-2 grid-cols-2 mt-3">
                          {availableDates.map(({ iso, label }) => {
                            const isSelected = flow.state.date === iso;
                            return (
                              <button
                                key={iso}
                                id={`date-${iso}`}
                                className={`rounded-xl border px-3.5 py-3 text-left text-xs font-semibold transition ${
                                  isSelected
                                    ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                                    : "border-slate-100 bg-slate-50/50 text-slate-600 hover:border-blue-200 hover:bg-blue-50/30"
                                }`}
                                onClick={() => flow.updateState({ date: iso })}
                              >
                                {label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Select Time Slot</h3>
                        <div className="grid gap-2 grid-cols-2 mt-3">
                          {service.timeSlots.map((slot) => {
                            const isSelected = flow.state.timeSlot === slot;
                            return (
                              <button
                                key={slot}
                                id={`slot-${slot.replace(/\s/g, "-")}`}
                                className={`rounded-xl border px-3.5 py-3 text-left text-xs font-semibold transition flex items-center ${
                                  isSelected
                                    ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                                    : "border-slate-100 bg-slate-50/50 text-slate-600 hover:border-blue-200 hover:bg-blue-50/30"
                                }`}
                                onClick={() => flow.updateState({ timeSlot: slot })}
                              >
                                <Clock3 className="h-3.5 w-3.5 mr-1.5 text-blue-500 opacity-80 shrink-0" />
                                <span className="truncate">{slot}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3 – Contact Info */}
                  {flow.step === 3 && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Contact Information</h3>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Technicians will call this number prior to arrival.</p>
                      
                      <div className="space-y-3 mt-4">
                        <label className="grid gap-1.5 text-xs font-bold text-slate-700">
                          Full Name
                          <Input
                            value={flow.state.customerName || ""}
                            onChange={(event) => flow.updateState({ customerName: event.target.value })}
                            className="h-10 rounded-xl border-slate-200 bg-slate-50 text-xs focus:ring-blue-500/20"
                            placeholder="John Doe"
                            disabled={!!user?.name}
                          />
                        </label>
                        <label className="grid gap-1.5 text-xs font-bold text-slate-700">
                          Mobile Number
                          <Input
                            value={flow.state.customerPhone || ""}
                            onChange={(event) => flow.updateState({ customerPhone: event.target.value })}
                            className="h-10 rounded-xl border-slate-200 bg-slate-50 text-xs focus:ring-blue-500/20"
                            placeholder="9876543210"
                            type="tel"
                            disabled={!!user?.phone}
                          />
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Step 4 – Review */}
                  {flow.step === 4 && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Apply Coupon</h3>
                      <Input
                        value={flow.state.coupon || ""}
                        onChange={(event) => flow.updateState({ coupon: event.target.value })}
                        className="h-11 rounded-xl border-slate-200 bg-slate-50 text-xs focus:ring-blue-500/20"
                        placeholder="Promo/Coupon code (optional)"
                      />
                      
                      <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4.5 text-xs font-semibold text-slate-600">
                        <div className="flex justify-between">
                          <span>Service Catalog Item</span>
                          <span className="text-slate-800">{service.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Service Location</span>
                          <span className="text-slate-800 truncate max-w-[140px]">{flow.state.address || "-"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Scheduled Visit</span>
                          <span className="text-slate-800">
                            {flow.state.date ? flow.state.date : ""} {flow.state.timeSlot || ""}
                          </span>
                        </div>
                        <div className="flex justify-between pt-3.5 border-t border-slate-100/50 text-slate-800 font-bold">
                          <span>Final Total Price</span>
                          <span>{finalPriceText}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 5 – Confirm */}
                  {flow.step === 5 && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Confirm Booking Details</h3>
                      {flow.bookingError && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 font-semibold">
                          {flow.bookingError}
                        </div>
                      )}
                      <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-xs font-semibold text-blue-700 leading-relaxed">
                        To lock your booking slot, a 50% advance payment is processed via Razorpay. The remaining 50% is due post-service completion.
                      </div>
                      <div className="rounded-xl bg-slate-50 p-4 text-[11px] leading-relaxed text-slate-400 font-medium">
                        By checking out, you authorize Techbes to assign a certified specialist and acknowledge the cancellation and service policies.
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Side: Booking Snapshot */}
                <div className="min-h-0 overflow-y-auto border-t border-slate-100 bg-slate-50/30 p-5 lg:border-l lg:border-t-0 flex flex-col justify-between">
                  <Card className="rounded-2xl border-slate-100 bg-white shadow-none">
                    <CardContent className="space-y-4 p-5">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Snapshot</p>
                        <h3 className="mt-1 text-sm font-extrabold text-slate-800 line-clamp-1">{service.title}</h3>
                      </div>
                      
                      <div className="space-y-3.5 text-xs font-semibold text-slate-600">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-2 text-slate-700">{flow.state.address || "Address pending"}</span>
                        </div>
                        {(flow.state.customerName || flow.state.customerPhone) && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-blue-600 shrink-0" />
                            <span className="truncate text-slate-700">
                              {flow.state.customerName ? `${flow.state.customerName} · ` : ""}
                              {flow.state.customerPhone}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Clock3 className="h-4 w-4 text-blue-600 shrink-0" />
                          <span className="text-slate-700">
                            {flow.state.date ? flow.state.date : "Select slot"} {flow.state.timeSlot || ""}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TicketPercent className="h-4 w-4 text-amber-500 shrink-0" />
                          <span className="text-slate-700">{flow.state.coupon ? `Promo: ${flow.state.coupon}` : "No coupon"}</span>
                        </div>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100/50 space-y-2 text-xs font-semibold text-slate-500">
                        <div className="flex justify-between">
                          <span>Total Amount</span>
                          <span className="text-slate-800">Rs. {totalAmount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Advance (50%)</span>
                          <span className="text-blue-600 font-bold">Rs. {advanceAmount}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-slate-200/50">
                          <span>Remaining</span>
                          <span className="text-slate-800">Rs. {remainingAmount}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="sticky bottom-0 z-20 flex shrink-0 items-center justify-between border-t border-slate-100 bg-white px-6 py-4">
                <Button
                  variant="outline"
                  className="rounded-xl h-9 text-xs font-bold"
                  onClick={flow.previousStep}
                  disabled={flow.step === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                
                {flow.step < 5 ? (
                  <Button
                    className="rounded-xl h-9 text-xs font-bold px-6 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={flow.nextStep}
                    disabled={
                      (flow.step === 1 && !flow.state.address) ||
                      (flow.step === 2 && (!flow.state.date || !flow.state.timeSlot)) ||
                      (flow.step === 3 && (!flow.state.customerName || !flow.state.customerPhone))
                    }
                  >
                    Continue
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    className="rounded-xl h-9 text-xs font-bold px-6 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handlePaymentFlow}
                    disabled={flow.isSubmitting}
                  >
                    {flow.isSubmitting ? (
                      <><Loader2 className="h-4 w-4 animate-spin mr-1.5" /> Processing…</>
                    ) : (
                      "Pay Advance"
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = ["Address", "Schedule", "Contact", "Review", "Pay"];

  return (
    <div className="flex flex-wrap gap-2">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const active = currentStep === stepNumber;
        const complete = currentStep > stepNumber;

        return (
          <div
            key={label}
            className={`rounded-full px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
              complete
                ? "bg-blue-50 text-blue-600"
                : active
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-400"
            }`}
          >
            {stepNumber}. {label}
          </div>
        );
      })}
    </div>
  );
}
