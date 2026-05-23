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

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { fadeIn, modalPreset } from "@/components/animations/motion-presets";
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

  const hasCoupon = flow.state.coupon.trim().length > 0;
  const discountAmount = hasCoupon ? Math.round(service.priceValue * 0.1) : 0; // 10% discount for any coupon
  const finalPriceValue = service.priceValue - discountAmount;
  const finalPriceText = `Rs. ${finalPriceValue}`;

  async function handleConfirm() {
    await flow.confirm({
      serviceId: String(service.id),
      serviceName: service.title,
      advanceAmount: finalPriceValue / 2,
    });
  }

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="max-w-3xl rounded-[var(--radius-lg)] border bg-card p-0 shadow-2xl overflow-y-auto max-h-[95dvh]">
            <DialogHeader className="border-b border-border px-6 py-5 text-left glass-card">
              <DialogTitle className="text-2xl font-semibold text-foreground">Book {service.title}</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Complete the immersive booking experience to confirm your technician slot.
              </DialogDescription>
            </DialogHeader>

        {flow.isConfirmed ? (
          <div className="p-8 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="mt-5 text-2xl font-extrabold text-foreground">Booking confirmed!</h3>
            <div className="mt-4 inline-block rounded-2xl bg-muted p-4 border border-border">
              <span className="text-xs text-muted-foreground block uppercase font-semibold tracking-wider mb-1">Booking ID</span>
              <span className="text-lg font-mono text-foreground font-bold">{flow.state.bookingId || "PENDING"}</span>
            </div>
            <p className="mt-5 text-muted-foreground">
              Your request for <strong>{service.title}</strong> has been placed for <strong>{flow.state.date}</strong> at <strong>{flow.state.timeSlot}</strong>.
              <br />
              <span className="text-sm text-muted-foreground mt-2 block font-medium">Status: Pending • A technician will be assigned shortly.</span>
            </p>
            <Button className="mt-6 w-44 rounded-full font-semibold btn-blue" onClick={() => closeModal(false)}>
              Done
            </Button>
          </div>
        ) : (
          <div className="grid gap-0 lg:grid-cols-[1.1fr,0.9fr]">
            {/* ─── LEFT PANEL ─── */}
            <motion.div key={`left-${flow.step}`} variants={fadeIn} initial="hidden" animate="visible" className="p-6">
              <StepIndicator currentStep={flow.step} />
              <div className="mt-8">

                {/* Step 1 – Address */}
                {flow.step === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Select service address</h3>
                    <Input
                      id="booking-address"
                      value={flow.state.address || ""}
                      onChange={(event) => flow.updateState({ address: event.target.value })}
                      className="h-12 rounded-2xl"
                      placeholder="Office / home address"
                    />
                    <div className="rounded-3xl bg-muted p-4 text-sm text-muted-foreground">
                      Add a precise address to improve technician allocation and ETA accuracy.
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mt-6">Problem Description</h3>
                    <textarea
                      value={flow.state.description || ""}
                      onChange={(event) => flow.updateState({ description: event.target.value })}
                      className="w-full min-h-[100px] rounded-2xl border border-border p-4 text-sm"
                      placeholder="Describe the issue (optional)"
                    />
                  </div>
                )}

                {/* Step 2 – Date & Time (limited to next 4 days) */}
                {flow.step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Choose date</h3>
                      <p className="text-sm text-muted-foreground mt-1">Only slots for the next 4 days are available.</p>
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
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-card text-foreground hover:border-primary/30 hover:bg-primary/5"
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
                                ? "border-secondary bg-secondary/10 text-secondary"
                                : "border-border bg-card text-foreground hover:border-secondary/30 hover:bg-secondary/5"
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
                    <h3 className="text-lg font-semibold text-foreground">Your details</h3>
                    <p className="text-sm text-muted-foreground mt-1">Please provide your contact information so the technician can reach you.</p>
                    <div className="space-y-3 mt-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Full Name</label>
                        <Input
                          value={flow.state.customerName || ""}
                          onChange={(event) => flow.updateState({ customerName: event.target.value })}
                          className="h-12 rounded-2xl"
                          placeholder="e.g. John Doe"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Phone Number</label>
                        <Input
                          value={flow.state.customerPhone || ""}
                          onChange={(event) => flow.updateState({ customerPhone: event.target.value })}
                          className="h-12 rounded-2xl"
                          placeholder="e.g. 9876543210"
                          type="tel"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4 – Review */}
                {flow.step === 4 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Review summary</h3>
                    <Input
                      value={flow.state.coupon || ""}
                      onChange={(event) => flow.updateState({ coupon: event.target.value })}
                      className="h-12 rounded-2xl"
                      placeholder="Coupon code (optional)"
                    />
                    <div className="space-y-3 rounded-3xl border border-border bg-muted p-5 text-sm text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <span>Service</span>
                        <span className="font-semibold text-foreground">{service.title}</span>
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
                      <div className="flex items-center justify-between text-foreground mt-4 pt-4 border-t border-border">
                    <span className="font-semibold text-lg">Total Amount</span>
                    <span className="font-bold text-lg">{finalPriceText}</span>
                  </div>
                  <div className="flex items-center justify-between text-primary mt-2 bg-primary/10 p-3 rounded-xl border border-border">
                    <span className="font-semibold">50% Advance Required (Razorpay)</span>
                    <span className="font-bold">Rs. {finalPriceValue / 2}</span>
                  </div>
                      <div className="flex items-center justify-between">
                        <span>Phone</span>
                        <span className="font-semibold text-foreground">{flow.state.customerPhone}</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                        <span>Price</span>
                        <div className="text-right">
                          {hasCoupon && <span className="line-through text-muted-foreground mr-2 text-xs">{service.price}</span>}
                          <span className="font-semibold text-foreground">{finalPriceText}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5 – Confirm */}
                {flow.step === 5 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Confirm booking</h3>
                    {flow.bookingError && (
                      <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {flow.bookingError}
                      </div>
                    )}
                    <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-800">
                      50% advance payment is required to confirm your slot.
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-5 sm:mt-8">
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={flow.previousStep}
                  disabled={flow.step === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
                {/* Mobile: sticky bottom CTA */}
                <div className="w-full sm:w-auto">
                  {flow.step < 5 ? (
                    <Button
                      className="rounded-full w-full sm:w-auto"
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
                      size="lg"
                      className="w-full sm:w-40 rounded-xl bg-slate-900 font-semibold text-white hover:bg-slate-800"
                      onClick={handleConfirm}
                      disabled={flow.isSubmitting}
                    >
                      {flow.isSubmitting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        "Pay Advance & Confirm"
                      )}
                    </Button>
                  )}
                </div>
              </div>
              {/* Sticky navigation for small screens */}
              <div className="sm:hidden fixed left-0 right-0 bottom-0 z-50 bg-card/95 backdrop-blur-md border-t border-border p-3"> 
                <div className="max-w-3xl mx-auto flex items-center gap-3">
                  <Button variant="outline" className="rounded-full w-1/3" onClick={flow.previousStep} disabled={flow.step === 1}>
                    Back
                  </Button>
                  {flow.step < 5 ? (
                    <Button className="rounded-full w-2/3" onClick={flow.nextStep}>
                      Continue
                    </Button>
                  ) : (
                    <Button className="rounded-full w-2/3" onClick={handleConfirm}>
                      {flow.isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Pay & Confirm"}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* ─── RIGHT PANEL – Snapshot ─── */}
            <motion.div key={`right-${flow.step}`} variants={fadeIn} initial="hidden" animate="visible" className="border-l border-border bg-muted/80 p-6">
                <Card variant="glass" className="rounded-[28px] bg-card shadow-lg">
                  <CardContent className="space-y-5 p-6">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Booking snapshot</p>
                      <h3 className="mt-2 text-xl font-semibold text-foreground">{service.title}</h3>
                    </div>
                    <div className="space-y-3 text-sm text-muted-foreground">
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
                  <div className="rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/6 p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Estimated payable</p>
                      {hasCoupon && <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-400">10% Off</span>}
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <p className="text-3xl font-semibold text-foreground">{finalPriceText}</p>
                      {hasCoupon && <p className="text-sm text-muted-foreground line-through">Rs. {service.priceValue}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = ["Address", "Schedule", "Contact", "Review", "Confirm"];

  return (
    <div className="flex flex-wrap gap-3">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const active = currentStep === stepNumber;
        const complete = currentStep > stepNumber;

        const base = "rounded-full px-4 py-2 text-sm font-medium flex items-center gap-3";
        const cls = complete
          ? "bg-gradient-to-r from-emerald-400 to-emerald-600 text-white shadow-md"
          : active
            ? "step-active"
            : "step-inactive";

        return (
          <div key={label} className={`${base} ${cls}`}>
            <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">{stepNumber}</div>
            <div className="whitespace-nowrap">{label}</div>
          </div>
        );
      })}
    </div>
  );
}
