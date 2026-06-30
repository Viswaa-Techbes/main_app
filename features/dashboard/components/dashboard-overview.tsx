"use client";

import Link from "next/link";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import { CalendarDays, Edit, MapPin, PackageOpen, Plus, Trash2, User, Wallet, Shield, CheckCircle, Clock } from "lucide-react";

import { useAuth } from "@/features/auth/context/auth-context";
import { useDashboardData } from "@/features/dashboard/hooks/use-dashboard-data";
import { dashboardService, DashboardMetric, UserAddress } from "@/features/dashboard/services/dashboard-service";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { InlineAlert } from "@/shared/components/feedback/inline-alert";
import { PageStatus } from "@/shared/components/feedback/page-status";
import { useToast } from "@/hooks/use-toast";


const metricIcons = [CalendarDays, PackageOpen, MapPin, Wallet];

export function DashboardOverview() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { data, error, isLoading, reload } = useDashboardData();
  const [addressModal, setAddressModal] = useState<Partial<UserAddress> | null>(null);

  useEffect(() => {
    // If there is any active booking, auto-reload every 5 seconds to get real-time status changes
    const hasActiveBookings = data?.upcomingBookings && data.upcomingBookings.length > 0;
    if (!hasActiveBookings) return;

    const timer = setInterval(() => {
      reload();
    }, 5000);

    return () => clearInterval(timer);
  }, [data?.upcomingBookings, reload]);

  // Review states
  const [reviewBooking, setReviewBooking] = useState<any | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>("");
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);

  const handleReviewSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!reviewBooking) return;
    
    setIsSubmittingReview(true);
    try {
      const techId = reviewBooking.assignedTechnician?._id || reviewBooking.assignedTechnician?.id || reviewBooking.assignedTechnician;
      await dashboardService.createReview({
        rating: reviewRating,
        comment: reviewComment,
        technicianId: techId,
        jobId: reviewBooking._id,
        clientName: data.profile?.name || user?.email || "Customer",
      });

      setReviewBooking(null);
      setReviewComment("");
      setReviewRating(5);
      reload(); // Reload dashboard data
      toast({
        title: "Review Submitted",
        description: "Thank you! Your feedback has been recorded successfully.",
      });
    } catch (err: any) {
      toast({
        title: "Submission Failed",
        description: err.message || "Failed to submit review",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };


  if (isLoading) return <PageStatus message="Retrieving your account activities..." className="min-h-[70vh]" />;
  if (error || !data) {
    return <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 bg-slate-50/50"><InlineAlert message={error ?? "Dashboard data is currently unavailable."} /></section>;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-slate-50/50 space-y-6">
      
      {/* Profile Header */}
      <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-full text-[10px] font-bold text-blue-700 uppercase tracking-wider">
              Control Panel
            </div>
            <h1 className="mt-3.5 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">My Account</h1>
            <p className="mt-1 text-xs text-slate-400 font-semibold">Monitor real-time service allocations, job statuses, and billing files.</p>
          </div>
          
          <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
            <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-blue-50 text-blue-600 border border-blue-100 shadow-sm shrink-0">
              {data.profile?.profilePhoto ? <img src={data.profile.profilePhoto} alt="" className="h-full w-full object-cover" /> : <User className="h-5 w-5" />}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">{data.profile?.name || user?.email || "Customer"}</p>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">{data.profile?.email || user?.email || "No email provided"}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Joined {data.profile?.createdAt ? new Date(data.profile.createdAt).toLocaleDateString("en-IN") : "-"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {data.metrics.map((metric, index) => {
          const Icon = metricIcons[index];
          return <MetricCard key={metric.title} metric={metric} icon={<Icon className="h-4.5 w-4.5" />} />;
        })}
      </div>

      {/* Bookings and Addresses Grid */}
      <div className="grid gap-6 lg:grid-cols-[1.3fr,0.7fr]">
        
        {/* Left: Bookings List */}
        <Panel title="Recent Bookings" action={<Button asChild variant="outline" className="rounded-xl h-8 text-[11px] font-bold"><Link href="/services">Book Service</Link></Button>}>
          {data.bookings.length ? data.bookings.map((booking) => (
            <Row key={booking._id} title={booking.serviceName || booking.title || "Service Job"} meta={`Booking Ref: ${booking.bookingNumber || booking.bookingId || booking._id}`} side={`Rs. ${Number(booking.amount || booking.price || 0).toLocaleString("en-IN")}`}>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 w-full text-[11px] font-semibold text-slate-500 border-t border-slate-50 pt-3.5 mt-2">
                <div>Category: <span className="text-slate-800 capitalize">{booking.serviceType || "IT Solution"}</span></div>
                <div className="flex items-center gap-1">Status: <Status status={booking.status || booking.bookingStatus || 'pending'} /></div>
                <div>Payment: <span className={`font-bold capitalize ${booking.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>{booking.paymentStatus}</span></div>
                <div className="col-span-full mt-1 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/50 space-y-1 text-slate-400">
                  <div><strong className="text-slate-600">Schedule:</strong> {booking.bookingDate || booking.scheduledDate || "Pending allocation"} {booking.timeSlot || booking.scheduledTime || ""}</div>
                  <div><strong className="text-slate-600">Technician:</strong> {booking.assignedTechnician?.name || "Assigning specialist..."}</div>
                </div>

                {(booking.status === 'completed' || booking.bookingStatus === 'completed') && (
                  <div className="col-span-full pt-2">
                    <strong>Review:</strong>{" "}
                    {booking.rating ? (
                      <span className="text-amber-500 font-bold">⭐ {booking.rating} / 5</span>
                    ) : booking.assignedTechnician ? (
                      <button
                        type="button"
                        className="font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                        onClick={() => setReviewBooking(booking)}
                      >
                        Leave a Review
                      </button>
                    ) : (
                      <span className="text-slate-400">Not Rated</span>
                    )}
                  </div>
                )}
              </div>
              
              {booking.status === 'assigned' && booking.startJobOtp && (
                <div className="col-span-full mt-4 p-4.5 rounded-2xl border border-blue-100 bg-blue-50/50 backdrop-blur-sm shadow-sm animate-pulse w-full">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Start Job OTP Card</span>
                  </div>
                  <p className="mt-2 text-xs font-semibold text-slate-600">Provide this 6-digit code to the technician upon arrival to initiate work:</p>
                  <div className="mt-3.5 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2 text-xl font-mono font-bold tracking-widest text-white shadow-md">
                    {booking.startJobOtp}
                  </div>
                  <p className="mt-2 text-[10px] text-blue-500/80 font-bold">Valid for 10 minutes</p>
                </div>
              )}
            </Row>
          )) : <Empty title="No bookings placed yet." />}
        </Panel>

        {/* Right: Saved Addresses */}
        <Panel title="Saved Locations" action={<Button asChild variant="outline" className="rounded-xl h-8 text-[11px] font-bold"><Link href="/dashboard/addresses">Manage Locations</Link></Button>}>
          {data.addresses.length ? data.addresses.map((address) => {
            const formatted = address.formattedAddress || [
              address.address || address.addressLine1,
              address.addressLine2,
              address.landmark,
              address.city,
              address.state,
              address.pincode
            ].filter(Boolean).join(", ");

            return (
              <div key={address._id} className="rounded-xl border border-slate-100 bg-slate-50/30 p-4 text-[11px] text-slate-500 font-semibold space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-800 text-xs flex items-center gap-2">
                      {address.label} 
                      {address.isDefault && <span className="rounded-full bg-blue-50 border border-blue-100 px-2 py-0.5 text-[9px] text-blue-600">Default</span>}
                    </p>
                    <p className="mt-1 text-slate-600">{address.name} · {address.mobile}</p>
                    <p className="mt-1.5 font-medium leading-relaxed">{formatted}</p>
                    {address.latitude && address.longitude && (
                      <a href={`https://maps.google.com/?q=${address.latitude},${address.longitude}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline block mt-2">View on Google Maps</a>
                    )}
                  </div>
                </div>
              </div>
            );
          }) : <Empty title="No saved addresses found." />}
        </Panel>
      </div>

      {/* Sub Panels row */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Upcoming Statuses */}
        <Panel title="Timeline Alerts">
          {data.upcomingBookings.length ? data.upcomingBookings.map((booking) => (
            <Row key={booking._id} title={booking.serviceName || booking.title || "Job Allocation"} meta={`Ref: ${booking.bookingNumber || booking._id}`}>
              <div className="flex items-center justify-between w-full mt-2">
                <Status status={booking.status} />
                <span className="text-[10px] text-slate-400 font-bold">{booking.bookingDate || "Date Pending"}</span>
              </div>
            </Row>
          )) : <Empty title="No active job timelines." />}
        </Panel>

        {/* Payments Summary */}
        <Panel title="Payments">
          {data.payments.length ? data.payments.map((payment) => (
            <Row key={payment._id} title={`Txn: ${payment.razorpayPaymentId || payment._id.slice(0, 10)}`} meta={new Date(payment.createdAt).toLocaleDateString("en-IN")} side={`Rs. ${(payment.amount / 100).toLocaleString("en-IN")}`}>
              <div className="flex items-center justify-between w-full mt-2">
                <Status status={payment.status} />
                <Button variant="outline" className="h-7 text-[10px] font-bold rounded-lg border-slate-200" disabled>Receipt</Button>
              </div>
            </Row>
          )) : <Empty title="No payments recorded." />}
        </Panel>

        {/* Digital Worksheet Reports */}
        <Panel title="Service Reports">
          {data.serviceReports.length ? data.serviceReports.map((report) => (
            <Row 
              key={report.jobId} 
              title={`Worksheet #${report.bookingNumber || report.jobId.slice(0, 8)}`} 
              meta={`Specialist: ${report.technician}`} 
              side={report.completionDate ? new Date(report.completionDate).toLocaleDateString("en-IN") : ""}
            >
              <div className="flex gap-2 w-full mt-2.5">
                <Button asChild variant="outline" className="h-7.5 text-[10px] font-bold rounded-lg border-slate-200" size="sm">
                  <Link href={`/dashboard/service-report/${report.jobId}`}>
                    View Report
                  </Link>
                </Button>
                {report.pdfReport && (
                  <Button asChild variant="outline" className="h-7.5 text-[10px] font-bold rounded-lg border-slate-200" size="sm">
                    <a href={report.pdfReport} target="_blank" rel="noreferrer">
                      Download PDF
                    </a>
                  </Button>
                )}
              </div>
            </Row>
          )) : <Empty title="No completed service reports." />}
        </Panel>
      </div>

      {/* Review Dialog */}
      <Dialog open={reviewBooking !== null} onOpenChange={(open) => !open && setReviewBooking(null)}>
        <DialogContent className="sm:max-w-[400px] rounded-2xl border border-slate-100">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-800">Rate Specialist</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleReviewSubmit} className="space-y-4 pt-2">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100/50 text-xs">
              <p className="font-bold text-slate-700">
                Specialist: {reviewBooking?.assignedTechnician?.name || "Technician Partner"}
              </p>
              <p className="text-slate-400 font-semibold mt-1">
                Project: {reviewBooking?.serviceName || reviewBooking?.title}
              </p>
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Rating</label>
              <div className="flex gap-2 text-3xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className={`focus:outline-none transition-colors cursor-pointer ${
                      star <= reviewRating ? "text-amber-400" : "text-slate-200"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="comment" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Your Feedback
              </label>
              <textarea
                id="comment"
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="How was your installation or repair experience?"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 text-xs">
              <Button type="button" variant="outline" className="rounded-xl h-9 text-xs font-bold" onClick={() => setReviewBooking(null)}>
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl h-9 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold" disabled={isSubmittingReview}>
                {isSubmittingReview ? "Submitting..." : "Submit Feedback"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function MetricCard({ metric, icon }: { metric: DashboardMetric; icon: ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4.5 shadow-sm flex items-center justify-between gap-4">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{metric.title}</p>
        <p className="mt-1 text-2xl font-black text-slate-800">{metric.value}</p>
      </div>
      <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 shrink-0 shadow-sm border border-blue-50">
        {icon}
      </div>
    </div>
  );
}

function Panel({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <Card className="rounded-3xl border-slate-100 bg-white shadow-sm flex flex-col justify-between overflow-hidden">
      <CardContent className="p-5 flex-1">
        <div className="mb-4 flex items-center justify-between gap-3 pb-3.5 border-b border-slate-50">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">{title}</h2>
          {action}
        </div>
        <div className="space-y-3">{children}</div>
      </CardContent>
    </Card>
  );
}

function Row({ title, meta, side, children }: { title: string; meta?: string; side?: string; children?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-100 p-4 bg-slate-50/20">
      <div className="flex justify-between items-start gap-3">
        <div>
          <p className="text-xs font-bold text-slate-800">{title}</p>
          {meta && <p className="mt-1.5 text-[10px] text-slate-400 font-semibold">{meta}</p>}
        </div>
        {side && <p className="text-xs font-extrabold text-slate-800">{side}</p>}
      </div>
      {children && <div className="mt-3.5 flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

function Status({ status }: { status: string }) {
  let styles = "bg-slate-100 text-slate-600 border-slate-200";
  const st = status.toLowerCase();
  
  if (['completed', 'paid', 'payment_done'].includes(st)) {
    styles = "bg-emerald-50 text-emerald-600 border-emerald-100";
  } else if (['assigned', 'travelling', 'arrived', 'in_progress', 'started'].includes(st)) {
    styles = "bg-blue-50 text-blue-600 border-blue-100";
  } else if (['pending', 'confirmed'].includes(st)) {
    styles = "bg-amber-50 text-amber-600 border-amber-100";
  } else if (st === 'cancelled') {
    styles = "bg-red-50 text-red-600 border-red-100";
  }

  return (
    <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${styles}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

function Empty({ title }: { title: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-8 text-center text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
      {title}
    </div>
  );
}
