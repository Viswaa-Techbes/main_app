"use client";

import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Loader2,
  MapPin,
  TicketPercent,
} from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MarketplaceService } from "@/lib/marketplace-data";
import { useBookingFlow } from "@/hooks/use-booking-flow";

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

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://10.246.194.196:5000";

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
  const availableDates = getAvailableDates();

  function closeModal(nextOpen: boolean) {
    onOpenChange(nextOpen);
    if (!nextOpen) flow.resetFlow();
  }

  async function handleConfirm() {
    await flow.confirm({
      serviceId: String(service.id),
      serviceName: service.title,
    });
  }

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="max-w-3xl rounded-[32px] border-white/70 bg-white p-0 shadow-2xl overflow-y-auto max-h-[95dvh]">
        <DialogHeader className="border-b border-slate-100 px-6 py-5 text-left">
          <DialogTitle className="text-2xl font-semibold text-slate-950">Book {service.title}</DialogTitle>
          <DialogDescription className="text-slate-500">
            Complete the four-step booking flow to confirm your technician slot.
          </DialogDescription>
        </DialogHeader>

        {flow.isConfirmed ? (
          <div className="p-8 text-center">
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
          <div className="grid gap-0 lg:grid-cols-[1.1fr,0.9fr]">
            {/* ─── LEFT PANEL ─── */}
            <div className="p-6">
              <StepIndicator currentStep={flow.step} />
              <div className="mt-8">

                {/* Step 1 – Address */}
                {flow.step === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-950">Select service address</h3>
                    <Input
                      id="booking-address"
                      value={flow.state.address}
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

                {/* Step 3 – Review */}
                {flow.step === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-950">Review summary</h3>
                    <Input
                      value={flow.state.coupon}
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
                      <div className="flex items-center justify-between">
                        <span>Price</span>
                        <span className="font-semibold text-slate-950">{service.price}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4 – Confirm */}
                {flow.step === 4 && (
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
              <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={flow.previousStep}
                  disabled={flow.step === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
                {flow.step < 4 ? (
                  <Button
                    className="rounded-full"
                    onClick={flow.nextStep}
                    disabled={
                      (flow.step === 1 && !flow.state.address) ||
                      (flow.step === 2 && (!flow.state.date || !flow.state.timeSlot))
                    }
                  >
                    Continue
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    className="rounded-full"
                    onClick={handleConfirm}
                    disabled={flow.isSubmitting}
                  >
                    {flow.isSubmitting ? (
                      <><Loader2 className="h-4 w-4 animate-spin mr-1" /> Confirming…</>
                    ) : (
                      "Confirm Booking"
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* ─── RIGHT PANEL – Snapshot ─── */}
            <div className="border-l border-slate-100 bg-slate-50/80 p-6">
              <Card className="rounded-[28px] border-slate-200 bg-white">
                <CardContent className="space-y-5 p-6">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Booking snapshot</p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-950">{service.title}</h3>
                  </div>
                  <div className="space-y-3 text-sm text-slate-600">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
                      {flow.state.address || "Address pending"}
                    </div>
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
                  <div className="rounded-3xl bg-slate-950 p-5 text-white">
                    <p className="text-sm text-slate-300">Estimated payable</p>
                    <p className="mt-2 text-3xl font-semibold">{service.price}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = ["Address", "Schedule", "Review", "Confirm"];

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
