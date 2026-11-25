"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, User, Clock, CheckCircle, Wallet, AlertTriangle, ShieldCheck, Download, Loader2, Star, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { fetchAuthApi } from "@/lib/api";
import dynamic from "next/dynamic";

const TrackingMap = dynamic(() => import("@/components/booking/TrackingMap"), { ssr: false });

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<any>(null);
  const [worksheet, setWorksheet] = useState<any>(null);
  const [techLocation, setTechLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [payMethod, setPayMethod] = useState<"online" | "wallet" | "cod">("online");
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>("");
  const [reviewTags, setReviewTags] = useState<string[]>(["Work Quality", "Punctuality"]);
  const [reviewSubmitting, setReviewSubmitting] = useState<boolean>(false);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleSubmitReview = async () => {
    const techId = booking?.assignedTechnician?._id || booking?.assignedTechnician;
    if (!techId) {
      toast({ title: "Technician not assigned", variant: "destructive" });
      return;
    }
    try {
      setSubmittingReview(true);
      const tagPrefix = reviewTags.length > 0 ? `[${reviewTags.join(", ")}] ` : "";
      const res = await fetchAuthApi("/api/v2/reviews", {
        method: "POST",
        body: JSON.stringify({
          jobId: booking._id,
          technicianId: techId,
          rating: reviewRating,
          serviceRating: reviewRating,
          technicianRating: reviewRating,
          comment: `${tagPrefix}${reviewComment.trim() || "Great service!"}`,
        }),
      });
      if (!res.success) throw new Error(res.message || "Failed to submit review");
      toast({ title: "Thank you for your feedback!", description: "Your rating has been submitted." });
      await loadData();
    } catch (err: any) {
      toast({ title: "Failed to submit review", description: err.message, variant: "destructive" });
    } finally {
      setSubmittingReview(false);
    }
  };

  // Load all detail data
  const loadData = async () => {
    try {
      const bRes = await fetchAuthApi(`/api/v2/bookings/${bookingId}`);
      if (bRes.success && bRes.data) {
        setBooking(bRes.data);

        // Load worksheet
        try {
          const wRes = await fetchAuthApi(`/api/v2/worksheets/job/${bookingId}`);
          if (wRes.success && wRes.data) {
            setWorksheet(wRes.data);
          }
        } catch (wErr) {
          // Worksheet may not exist yet, ignore
        }

        // If technician assigned, fetch live location
        const techId = bRes.data.assignedTechnician?._id || bRes.data.assignedTechnician;
        if (techId && ["travelling", "arrived", "working", "in_progress"].includes(bRes.data.status)) {
          fetchTechLocation(techId);
        }
      }
    } catch (err: any) {
      toast({ title: "Failed to load booking details", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchTechLocation = async (techId: string) => {
    try {
      const locRes = await fetchAuthApi(`/api/v2/location/${techId}`);
      if (locRes.success && locRes.data) {
        setTechLocation({
          latitude: locRes.data.location?.coordinates[1] || locRes.data.latitude,
          longitude: locRes.data.location?.coordinates[0] || locRes.data.longitude
        });
      }
    } catch (err) {
      // Ignore location fetch fail
    }
  };

  useEffect(() => {
    loadData();

    // Fetch Wallet balance
    fetchAuthApi("/api/v2/wallet")
      .then((json) => {
        if (json.success && json.data) {
          setWalletBalance(json.data.balance || 0);
        }
      })
      .catch((err) => console.error("Wallet balance load failed", err));

    // Poll live location & updates every 10 seconds
    pollIntervalRef.current = setInterval(() => {
      loadData();
    }, 10000);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [bookingId]);

  // Approve additional charges
  const handleApproveCharges = async () => {
    setActionLoading(true);
    try {
      const res = await fetchAuthApi(`/api/v2/worksheets/job/${bookingId}/approve-additional`, { method: "POST" });
      if (res.success) {
        toast({ title: "Approved", description: "You have successfully approved the additional charges." });
        loadData();
      }
    } catch (err: any) {
      toast({ title: "Approval Failed", description: err.message, variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  // Reject additional charges
  const handleRejectCharges = async () => {
    setActionLoading(true);
    try {
      const res = await fetchAuthApi(`/api/v2/worksheets/job/${bookingId}/reject-additional`, { method: "POST" });
      if (res.success) {
        toast({ title: "Rejected", description: "You have rejected the recommended additional charges." });
        loadData();
      }
    } catch (err: any) {
      toast({ title: "Rejection Failed", description: err.message, variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  const loadRazorpay = async () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) return resolve(true);
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });
  };

  // Pay final remaining balance
  const handlePayRemaining = async () => {
    setActionLoading(true);
    try {
      const remainingAmount = booking.remainingAmount || (booking.amount - (booking.advanceAmount || 0));
      if (remainingAmount <= 0) {
        toast({ title: "No Balance", description: "Your final payment is already complete!" });
        return;
      }

      if (payMethod === "online") {
        const orderData = await fetchAuthApi("/api/v2/payments/create-order", {
          method: "POST",
          body: JSON.stringify({ jobId: bookingId, amount: remainingAmount })
        });

        const scriptLoaded = await loadRazorpay();
        if (!scriptLoaded) throw new Error("Razorpay SDK failed to load.");

        const options = {
          key: orderData.data?.keyId || orderData.keyId,
          amount: orderData.data?.amount || orderData.amount,
          currency: "INR",
          name: "Techbes Security",
          description: `Final Settlement for Booking #${bookingId}`,
          order_id: orderData.data?.orderId || orderData.orderId,
          handler: async (resp: any) => {
            try {
              await fetchAuthApi("/api/v2/payments/verify-payment", {
                method: "POST",
                body: JSON.stringify({
                  jobId: bookingId,
                  razorpay_order_id: resp.razorpay_order_id,
                  razorpay_payment_id: resp.razorpay_payment_id,
                  razorpay_signature: resp.razorpay_signature,
                  amount: remainingAmount * 100
                })
              });
              toast({ title: "Success", description: "Remaining balance paid successfully!" });
              loadData();
            } catch (err: any) {
              toast({ title: "Verification Failed", description: err.message, variant: "destructive" });
            }
          },
          prefill: { name: booking.customerName, contact: booking.customerPhone }
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else if (payMethod === "wallet") {
        if (walletBalance === null || walletBalance < remainingAmount) {
          throw new Error("Insufficient wallet balance. Please top up or choose another payment method.");
        }

        await fetchAuthApi("/api/v2/wallet/pay-booking", {
          method: "POST",
          body: JSON.stringify({ jobId: bookingId, amount: remainingAmount })
        });

        toast({ title: "Success", description: "Payment completed using your wallet." });
        loadData();
      } else {
        // COD select
        toast({ title: "Success", description: "Handover cash to technician upon completion." });
      }
    } catch (err: any) {
      toast({ title: "Payment Failed", description: err.message, variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-xs text-slate-500 font-bold">Loading booking details...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="mx-auto max-w-md text-center py-12">
        <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-lg font-black text-slate-900">Booking Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">We couldn't retrieve the details for this booking code.</p>
        <Button className="mt-4 bg-slate-900 text-white font-bold" asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  // Determine current timeline active step index
  const statusSteps = ["pending", "assigned", "travelling", "arrived", "working", "completed"];
  const currentStatusIdx = statusSteps.indexOf(booking.status === "in_progress" ? "working" : booking.status);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Back to Dashboard */}
      <Button asChild variant="ghost" className="self-start text-xs font-bold text-slate-500 hover:text-blue-600 transition">
        <Link href="/dashboard">
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Dashboard
        </Link>
      </Button>

      {/* Booking Header Status */}
      <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-950 flex items-center gap-2">
            Booking Tracking #{bookingId.slice(-6).toUpperCase()}
          </h1>
          <p className="text-xs text-slate-400 font-bold">
            Service Category: {booking.serviceName || booking.title}
          </p>
        </div>
        <span className="rounded-full bg-blue-50 text-blue-600 border border-blue-100 px-3.5 py-1 text-xs font-black uppercase tracking-wider self-start sm:self-center">
          Status: {booking.status.replace("_", " ")}
        </span>
      </div>

      {/* Progress Timeline Stepper */}
      <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-black text-slate-800 mb-4">Service Progress Timeline</h3>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-6">
          {statusSteps.map((statusVal, idx) => {
            const isActive = currentStatusIdx >= idx;
            const isLatest = currentStatusIdx === idx;
            return (
              <div
                key={statusVal}
                className={`rounded-2xl p-3 border transition ${
                  isLatest
                    ? "border-blue-600 bg-blue-50/10 ring-1 ring-blue-600 shadow-sm"
                    : isActive
                    ? "border-emerald-100 bg-emerald-50/20 text-emerald-800"
                    : "border-slate-100 bg-slate-50/50 text-slate-400"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider">
                    Step {idx + 1}
                  </span>
                  {isActive && <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />}
                </div>
                <div className="text-xs font-bold capitalize">
                  {statusVal.replace("_", " ")}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Booking & Tech Details (2 cols span) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Completion OTP Card */}
          {booking.completionOtp && !["completed", "closed", "cancelled"].includes(booking.status) && (
            <div className="rounded-3xl border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-indigo-700">Customer Completion OTP</div>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    Share this code with your technician only after inspecting the completed installation & photos.
                  </p>
                </div>
              </div>
              <div className="bg-white border border-indigo-200 rounded-2xl px-5 py-2.5 text-center shadow-sm shrink-0">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">OTP Code</div>
                <div className="text-2xl font-black tracking-[0.25em] text-indigo-700 font-mono">
                  {booking.completionOtp}
                </div>
              </div>
            </div>
          )}

          {/* Customer Rate & Review Technician Card */}
          {booking.status === "completed" && (
            <div className="rounded-3xl border border-amber-200 bg-amber-50/40 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                  <h3 className="text-sm font-black text-slate-900">
                    {booking.hasReview ? "Your Service Review" : "Rate & Review Technician"}
                  </h3>
                </div>
                {booking.hasReview && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
                    Submitted ✓
                  </span>
                )}
              </div>

              {booking.hasReview && booking.review ? (
                <div className="bg-white rounded-2xl border border-amber-100 p-4 space-y-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-4 w-4 ${s <= (booking.review.rating || 5) ? "text-amber-400 fill-amber-400" : "text-slate-200"}`}
                      />
                    ))}
                    <span className="ml-2 text-xs font-bold text-slate-700">{booking.review.rating || 5} / 5</span>
                  </div>
                  <p className="text-xs text-slate-600 italic">&ldquo;{booking.review.comment || "Great service!"}&rdquo;</p>
                </div>
              ) : (
                <div className="space-y-3 bg-white rounded-2xl border border-amber-100 p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">Rating:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setReviewRating(s)}
                          aria-label={`Rate ${s} stars`}
                          className="p-0.5 hover:scale-110 transition"
                        >
                          <Star
                            className={`h-6 w-6 ${s <= reviewRating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-black text-amber-600 ml-1">{reviewRating}/5</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {["Punctuality", "Work Quality", "Cleanliness", "Polite"].map((tag) => {
                      const active = reviewTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() =>
                            setReviewTags((prev) =>
                              prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                            )
                          }
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition ${
                            active
                              ? "bg-amber-500 text-white border-amber-500"
                              : "bg-slate-50 text-slate-600 border-slate-200"
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>

                  <textarea
                    rows={2}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your feedback on the technician's installation and professionalism..."
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />

                  <Button
                    disabled={reviewSubmitting}
                    onClick={async () => {
                      const techId = booking.assignedTechnician?._id || booking.assignedTechnician;
                      if (!techId) {
                        toast({ title: "No technician assigned", variant: "destructive" });
                        return;
                      }
                      setReviewSubmitting(true);
                      try {
                        const finalComment = [
                          reviewComment.trim(),
                          reviewTags.length ? `[${reviewTags.join(", ")}]` : "",
                        ]
                          .filter(Boolean)
                          .join(" ");
                        const res = await fetchAuthApi("/api/v2/reviews", {
                          method: "POST",
                          body: JSON.stringify({
                            jobId: booking._id || bookingId,
                            technicianId: techId,
                            rating: reviewRating,
                            serviceRating: reviewRating,
                            technicianRating: reviewRating,
                            comment: finalComment || "Excellent service!",
                          }),
                        });
                        if (res.success) {
                          toast({ title: "Thank you for your review!" });
                          await loadData();
                        } else {
                          throw new Error(res.message || "Failed to submit review");
                        }
                      } catch (err: any) {
                        toast({ title: "Review Error", description: err.message, variant: "destructive" });
                      } finally {
                        setReviewSubmitting(false);
                      }
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs h-9 rounded-xl"
                  >
                    {reviewSubmitting ? "Submitting..." : "Submit Rating & Review"}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Booking Info Card */}
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-800">Booking Specifications</h3>
            <div className="grid gap-4 sm:grid-cols-2 text-xs">
              <div className="flex items-start gap-2.5">
                <Calendar className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-700">Preferred Schedule</h4>
                  <p className="text-slate-500 font-semibold mt-0.5">
                    {booking.bookingDate || booking.scheduledTime} ({booking.timeSlot || "ASAP"})
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-700">Service Location</h4>
                  <p className="text-slate-500 font-semibold mt-0.5 leading-relaxed">
                    {booking.location}
                  </p>
                </div>
              </div>

              {booking.customerName && (
                <div className="flex items-start gap-2.5">
                  <User className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-700">Client Details</h4>
                    <p className="text-slate-500 font-semibold mt-0.5">
                      {booking.customerName} ({booking.customerPhone})
                    </p>
                  </div>
                </div>
              )}
            </div>

            {booking.bookingAnswers && booking.bookingAnswers.length > 0 && (
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold text-slate-700 mb-2">Specifications Form Response</h4>
                <div className="grid gap-2 sm:grid-cols-2">
                  {booking.bookingAnswers.map((ans: any, idx: number) => (
                    <div key={idx} className="rounded-xl bg-slate-50 p-2.5 border border-slate-100 text-xs">
                      <span className="font-bold text-slate-500 block mb-0.5">{ans.question}</span>
                      <span className="font-bold text-slate-800">
                        {Array.isArray(ans.answer) ? ans.answer.join(", ") : String(ans.answer)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Assigned Technician Card */}
          {booking.assignedTechnician ? (
            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex gap-4 items-center">
                <div className="h-12 w-12 rounded-full overflow-hidden border border-slate-200 bg-slate-50 shrink-0 flex items-center justify-center">
                  {booking.assignedTechnician.photoUrl ? (
                    <img src={booking.assignedTechnician.photoUrl} alt="tech avatar" className="object-cover h-full w-full" />
                  ) : (
                    <User className="h-6 w-6 text-slate-400" />
                  )}
                </div>
                <div className="text-xs">
                  <h3 className="font-black text-slate-800 text-sm">
                    Assigned Technician: {booking.assignedTechnician.name}
                  </h3>
                  <p className="text-slate-400 font-bold mt-0.5">
                    Specialty: {booking.assignedTechnician.specialty || "CCTV Engineer"}
                  </p>
                  <p className="text-slate-500 mt-1 font-semibold">
                    Rating: ⭐ {booking.assignedTechnician.rating || "4.8"} ({booking.assignedTechnician.experience || "3+"} years exp)
                  </p>
                </div>
              </div>
              <Button asChild variant="outline" className="border-blue-200 text-blue-600 font-bold text-xs rounded-xl h-9">
                <a href={`tel:${booking.assignedTechnician.mobileNumber || "9999999999"}`}>Call Partner</a>
              </Button>
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-100 bg-slate-50/50 p-6 text-center text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin mx-auto text-blue-600 mb-2" />
              <p className="text-xs font-bold">Assigning certified engineer to your ticket slot...</p>
            </div>
          )}

          {/* Live Tracking Map */}
          {booking.assignedTechnician && ["travelling", "arrived", "working", "in_progress"].includes(booking.status) && (
            <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black text-slate-800">Technician Live Position</h3>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700 ring-1 ring-inset ring-blue-600/10 animate-pulse">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600" /> Live updates polling
                </span>
              </div>
              <div className="rounded-2xl overflow-hidden h-[300px] border border-slate-200 relative">
                <TrackingMap
                  clientLat={booking.latitude || 12.9716}
                  clientLng={booking.longitude || 77.5946}
                  techLat={techLocation?.latitude}
                  techLng={techLocation?.longitude}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Worksheets, Approvals, Payments (1 col span) */}
        <div className="space-y-6">
          {/* Step 13: Digital Worksheet Report */}
          {worksheet && (
            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-slate-800">Service report worksheet</h3>
                {worksheet.pdfUrl && (
                  <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50 rounded-xl">
                    <a href={worksheet.pdfUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>

              <div className="space-y-3 text-xs">
                {worksheet.requestedWorkDescription && (
                  <div>
                    <h4 className="font-bold text-slate-500">Observation Notes</h4>
                    <p className="text-slate-700 font-semibold mt-0.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                      {worksheet.requestedWorkDescription}
                    </p>
                  </div>
                )}

                {/* Materials Used / Recommended */}
                {worksheet.materialsUsed && worksheet.materialsUsed.length > 0 && (
                  <div>
                    <h4 className="font-bold text-slate-500 mb-1.5">Materials & Spares Used</h4>
                    <div className="space-y-1.5">
                      {worksheet.materialsUsed.map((m: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center rounded-xl bg-slate-50 px-3 py-2 border border-slate-100 font-semibold text-slate-700">
                          <span>{m.name} x {m.quantity} {m.unit}</span>
                          <span>₹{m.total}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Photos proof */}
                {worksheet.afterPhotos && worksheet.afterPhotos.length > 0 && (
                  <div>
                    <h4 className="font-bold text-slate-500 mb-1.5">Work Proof Photos</h4>
                    <div className="grid gap-2 grid-cols-3">
                      {worksheet.afterPhotos.map((url: string, idx: number) => (
                        <a key={idx} href={url} target="_blank" rel="noreferrer" className="relative h-14 rounded-lg overflow-hidden border border-slate-200 block">
                          <img src={url} alt="work proof" className="object-cover h-full w-full" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Customer Signature */}
                {worksheet.customerSignatureUrl && (
                  <div>
                    <h4 className="font-bold text-slate-500 mb-1">Customer Digital Signature</h4>
                    <div className="h-14 border border-slate-200 bg-slate-50/50 rounded-xl overflow-hidden flex items-center justify-center p-1.5">
                      <img src={worksheet.customerSignatureUrl} alt="customer sign" className="object-contain max-h-full" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 10: Approve Recommended Additional Work */}
          {booking.additionalChargesStatus === "pending" && (
            <div className="rounded-3xl border border-amber-200 bg-amber-50/30 p-5 shadow-sm space-y-4">
              <div className="flex gap-2 items-start">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-black text-slate-800">Additional Charges Pending</h3>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5 leading-relaxed">
                    The technician has recommended additional work and materials to complete your security camera setup.
                  </p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="rounded-2xl border border-amber-200/50 bg-white p-3.5 space-y-2.5 text-xs font-semibold text-slate-600 shadow-sm">
                <div className="flex justify-between">
                  <span>Initial Estimate (Advance Paid)</span>
                  <span className="text-slate-800">₹{booking.price - booking.additionalCharges}</span>
                </div>
                <div className="flex justify-between text-amber-700">
                  <span>Additional Work Charges</span>
                  <span>+₹{booking.additionalCharges}</span>
                </div>
                <div className="flex justify-between border-t border-amber-100 pt-2 text-sm font-black text-slate-900">
                  <span>Final Bill Estimate</span>
                  <span>₹{booking.price}</span>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <Button disabled={actionLoading} onClick={handleRejectCharges} variant="outline" className="border-rose-200 hover:bg-rose-50 text-rose-600 font-bold text-xs h-9 rounded-xl">
                  Reject
                </Button>
                <Button disabled={actionLoading} onClick={handleApproveCharges} className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs h-9 rounded-xl flex gap-1 items-center justify-center">
                  {actionLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Approve Charges
                </Button>
              </div>
            </div>
          )}

          {booking.additionalChargesStatus === "approved" && (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50/20 p-5 shadow-sm flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <h3 className="font-black text-slate-800">Additional Charges Approved</h3>
                <p className="text-slate-500 font-semibold mt-0.5">
                  You approved additional charges of ₹{booking.additionalCharges}. The remaining balance has been updated below.
                </p>
              </div>
            </div>
          )}

          {/* Customer Completion OTP Card */}
          {booking.completionOtp && booking.status !== "completed" && booking.status !== "cancelled" && (
            <div className="rounded-3xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-indigo-700 font-black text-sm">
                <KeyRound className="h-4 w-4" />
                <span>Work Completion OTP</span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Share this OTP with your technician <b>only after</b> inspecting the completed work:
              </p>
              <div className="bg-white border border-indigo-200 rounded-2xl py-3 px-4 text-center font-mono text-2xl font-black tracking-[0.35em] text-indigo-700 shadow-inner">
                {booking.completionOtp}
              </div>
            </div>
          )}

          {/* Customer Rate & Review Technician Card */}
          {booking.status === "completed" && (
            <div className="rounded-3xl border border-amber-200 bg-amber-50/30 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                  <span>{booking.hasReview ? "Your Service Review" : "Rate & Review Technician"}</span>
                </h3>
                {booking.hasReview && (
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                    Submitted
                  </span>
                )}
              </div>

              {booking.hasReview && booking.review ? (
                <div className="space-y-1.5 bg-white rounded-2xl p-3.5 border border-amber-100">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`h-4 w-4 ${s <= (booking.review.rating || 5) ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                    ))}
                    <span className="ml-1.5 text-xs font-bold text-slate-700">{booking.review.rating}/5</span>
                  </div>
                  {booking.review.comment && <p className="text-xs text-slate-600 italic">&ldquo;{booking.review.comment}&rdquo;</p>}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setReviewRating(s)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star className={`h-6 w-6 ${s <= reviewRating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                      </button>
                    ))}
                    <span className="ml-2 text-xs font-bold text-slate-700">{reviewRating} / 5</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {["Punctuality", "Quality", "Cleanliness", "Polite"].map((tag) => {
                      const active = reviewTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setReviewTags((prev) => active ? prev.filter((t) => t !== tag) : [...prev, tag])}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition ${active ? "bg-amber-500 text-white border-amber-500" : "bg-white text-slate-600 border-slate-200"}`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>

                  <textarea
                    rows={2}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your feedback about the technician..."
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />

                  <Button
                    disabled={submittingReview}
                    onClick={handleSubmitReview}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold h-9 rounded-xl text-xs"
                  >
                    {submittingReview ? "Submitting..." : "Submit Rating & Review"}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 14: Remaining Balance Payment Box */}
          {booking.paymentStatus !== "paid" && (
            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-800">Remaining Balance Payment</h3>
              
              <div className="flex justify-between items-center text-xs font-bold text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span>Remaining Balance</span>
                <span className="text-base font-black text-slate-800">
                  ₹{booking.remainingAmount || (booking.amount - (booking.advanceAmount || 0))}
                </span>
              </div>

              {/* Select Payment Option */}
              <div className="space-y-2 text-xs">
                <label className="font-bold text-slate-700">Payment Option</label>
                <div className="space-y-1.5 font-semibold">
                  <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition">
                    <input type="radio" checked={payMethod === "online"} onChange={() => setPayMethod("online")} className="h-3.5 w-3.5 text-blue-600" />
                    Pay Online (Razorpay)
                  </label>
                  <label className={`flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition ${walletBalance !== null && walletBalance < (booking.remainingAmount || 0) ? "opacity-50 cursor-not-allowed" : ""}`}>
                    <input type="radio" checked={payMethod === "wallet"} disabled={walletBalance !== null && walletBalance < (booking.remainingAmount || 0)} onChange={() => setPayMethod("wallet")} className="h-3.5 w-3.5 text-blue-600" />
                    Pay via Wallet (Avail: ₹{walletBalance ?? 0})
                  </label>
                </div>
              </div>

              <Button disabled={actionLoading} onClick={handlePayRemaining} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 rounded-xl text-xs flex gap-1.5 items-center justify-center">
                {actionLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Pay Balance
              </Button>
            </div>
          )}

          {booking.paymentStatus === "paid" && (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50/20 p-5 shadow-sm flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <h3 className="font-black text-slate-800">Booking Fully Settled</h3>
                <p className="text-slate-500 font-semibold mt-0.5">
                  No pending balance. Payment status is marked as fully PAID.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
