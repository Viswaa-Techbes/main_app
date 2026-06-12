"use client";

import Link from "next/link";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import { CalendarDays, Edit, MapPin, PackageOpen, Plus, Trash2, User, Wallet } from "lucide-react";

import { useAuth } from "@/features/auth/context/auth-context";
import { useDashboardData } from "@/features/dashboard/hooks/use-dashboard-data";
import { dashboardService, DashboardMetric, UserAddress } from "@/features/dashboard/services/dashboard-service";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { InlineAlert } from "@/shared/components/feedback/inline-alert";
import { PageStatus } from "@/shared/components/feedback/page-status";

const metricIcons = [CalendarDays, PackageOpen, MapPin, Wallet];

export function DashboardOverview() {
  const { user } = useAuth();
  const { data, error, isLoading, reload } = useDashboardData();
  const [addressModal, setAddressModal] = useState<Partial<UserAddress> | null>(null);

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
    } catch (err: any) {
      alert(err.message || "Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) return <PageStatus message="Loading your dashboard..." className="min-h-[70vh]" />;
  if (error || !data) {
    return <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><InlineAlert message={error ?? "Dashboard data is unavailable."} /></section>;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">Customer dashboard</div>
            <h1 className="mt-4 text-3xl font-semibold text-slate-950">My account and service activity</h1>
            <p className="mt-2 text-sm text-slate-600">All dashboard data is loaded from your account records.</p>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="grid h-14 w-14 place-items-center overflow-hidden rounded-full bg-white text-slate-700">
              {data.profile?.profilePhoto ? <img src={data.profile.profilePhoto} alt="" className="h-full w-full object-cover" /> : <User className="h-6 w-6" />}
            </div>
            <div>
              <p className="font-semibold text-slate-950">{data.profile?.name || user?.email || "Customer"}</p>
              <p className="text-sm text-slate-500">{data.profile?.email || user?.email || "No email"}</p>
              <p className="text-sm text-slate-500">{data.profile?.phone || data.profile?.mobileNumber || "No phone"}</p>
              <p className="text-xs text-slate-400">Joined {data.profile?.createdAt ? new Date(data.profile.createdAt).toLocaleDateString("en-IN") : "-"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric, index) => {
          const Icon = metricIcons[index];
          return <MetricCard key={metric.title} metric={metric} icon={<Icon className="h-5 w-5" />} />;
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <Panel title="My Bookings" action={<Button asChild variant="outline"><Link href="/services">Book service</Link></Button>}>
          {data.bookings.length ? data.bookings.map((booking) => (
            <Row key={booking._id} title={booking.serviceName || booking.title || "Service"} meta={`Booking ID: ${booking.bookingNumber || booking.bookingId || booking._id}`} side={`Rs. ${Number(booking.amount || booking.price || 0).toLocaleString("en-IN")}`}>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 w-full text-xs text-slate-500 border-t pt-3 mt-2">
                <div><strong>Service Type:</strong> <span className="capitalize">{booking.serviceType || "CCTV"}</span></div>
                <div><strong>Status:</strong> <Status status={booking.status || booking.bookingStatus || 'pending'} /></div>
                <div><strong>Payment Status:</strong> <span className={`font-semibold capitalize ${booking.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>{booking.paymentStatus}</span></div>
                <div><strong>Scheduled:</strong> {booking.bookingDate || booking.scheduledDate || "Date pending"} {booking.timeSlot || booking.scheduledTime || ""}</div>
                <div><strong>Technician:</strong> {booking.assignedTechnician?.name || "Unassigned"}</div>
                <div><strong>Booked On:</strong> {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString("en-IN") : "-"}</div>
                {(booking.status === 'completed' || booking.bookingStatus === 'completed') && (
                  <div>
                    <strong>Review:</strong>{" "}
                    {booking.rating ? (
                      <span className="text-amber-500 font-semibold">⭐ {booking.rating} / 5</span>
                    ) : booking.assignedTechnician ? (
                      <button
                        type="button"
                        className="font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                        onClick={() => setReviewBooking(booking)}
                      >
                        Rate & Review
                      </button>
                    ) : (
                      <span className="text-slate-400">No technician</span>
                    )}
                  </div>
                )}
              </div>
            </Row>
          )) : <Empty title="No bookings found" />}
        </Panel>

        <Panel title="Saved Addresses" action={<Button asChild><Link href="/dashboard/addresses">Manage Addresses</Link></Button>}>
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
              <div key={address._id} className="rounded-xl border border-slate-200 p-4 text-sm text-slate-600">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-950 text-base">{address.label} {address.isDefault && <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">Default</span>}</p>
                    <p className="mt-1 font-medium text-slate-700">{address.name} — {address.mobile}</p>
                    <p className="mt-1">{formatted}</p>
                    {address.latitude && address.longitude && (
                      <a href={`https://maps.google.com/?q=${address.latitude},${address.longitude}`} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline block mt-2 break-all">Google Maps Link</a>
                    )}
                  </div>
                </div>
              </div>
            );
          }) : <Empty title="No saved addresses" />}
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel title="Upcoming Services">
          {data.upcomingBookings.length ? data.upcomingBookings.map((booking) => (
            <Row key={booking._id} title={booking.serviceName || booking.title || "Service"} meta={`Booking ID: ${booking.bookingNumber || booking._id}`}>
              <Status status={booking.status} />
              <p className="text-xs text-slate-500 mt-1">Scheduled: {booking.bookingDate || "Date pending"} {booking.timeSlot || ""}</p>
            </Row>
          )) : <Empty title="No upcoming services" />}
        </Panel>
        <Panel title="My Payments">
          {data.payments.length ? data.payments.map((payment) => <Row key={payment._id} title={payment.razorpayPaymentId || payment._id} meta={new Date(payment.createdAt).toLocaleDateString("en-IN")} side={`Rs. ${(payment.amount / 100).toLocaleString("en-IN")}`}><Status status={payment.status} /><Button variant="outline" disabled>Invoice Download</Button></Row>) : <Empty title="No payments found" />}
        </Panel>
        <Panel title="My Service Reports">
          {data.serviceReports.length ? data.serviceReports.map((report) => <Row key={report.jobId} title={`Job ${report.jobId}`} meta={`Technician: ${report.technician}`} side={report.completionDate ? new Date(report.completionDate).toLocaleDateString("en-IN") : ""}><Button asChild variant="outline" disabled={!report.pdfReport}><a href={report.pdfReport || "#"}>PDF Report</a></Button></Row>) : <Empty title="No service reports" />}
        </Panel>
      </div>

      <Dialog open={reviewBooking !== null} onOpenChange={(open) => !open && setReviewBooking(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rate & Review Service</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleReviewSubmit} className="space-y-4 pt-2">
            <div>
              <p className="text-sm font-medium text-slate-700 mb-1">
                Technician: {reviewBooking?.assignedTechnician?.name || "Technician"}
              </p>
              <p className="text-xs text-slate-500">
                Service: {reviewBooking?.serviceName || reviewBooking?.title}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Rating</label>
              <div className="flex gap-2 text-2xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className={`focus:outline-none transition-colors ${
                      star <= reviewRating ? "text-amber-400" : "text-slate-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-semibold text-slate-700 mb-1">
                Your Review
              </label>
              <textarea
                id="comment"
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience with our service..."
                className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setReviewBooking(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmittingReview}>
                {isSubmittingReview ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function MetricCard({ metric, icon }: { metric: DashboardMetric; icon: ReactNode }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-500">{metric.title}</p><div className={metric.tone === "emerald" ? "rounded-xl bg-emerald-50 p-2 text-emerald-700" : "rounded-xl bg-blue-50 p-2 text-blue-700"}>{icon}</div></div><p className="mt-4 text-3xl font-semibold text-slate-950">{metric.value}</p></div>;
}

function Panel({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return <Card className="rounded-2xl border-slate-200 bg-white shadow-sm"><CardContent className="p-5"><div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-xl font-semibold text-slate-950">{title}</h2>{action}</div><div className="space-y-3">{children}</div></CardContent></Card>;
}

function Row({ title, meta, side, children }: { title: string; meta?: string; side?: string; children?: ReactNode }) {
  return <div className="rounded-xl border border-slate-200 p-4"><div className="flex justify-between gap-3"><div><p className="font-semibold text-slate-950">{title}</p>{meta && <p className="mt-1 text-sm text-slate-500">{meta}</p>}</div>{side && <p className="font-semibold text-slate-950">{side}</p>}</div>{children && <div className="mt-3 flex flex-wrap gap-2">{children}</div>}</div>;
}

function Status({ status }: { status: string }) {
  return <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">{status.replace(/_/g, " ")}</span>;
}

function Empty({ title }: { title: string }) {
  return <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-8 text-center text-sm text-slate-500">{title}</div>;
}
