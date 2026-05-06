"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Wallet, Clock, History, Calendar, ExternalLink, Navigation, User as UserIcon } from "lucide-react";
import { apiClient } from "@/core/api/api-client";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/context/auth-context";
import { useDashboardData } from "@/features/dashboard/hooks/use-dashboard-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageStatus } from "@/shared/components/feedback/page-status";
import { InlineAlert } from "@/shared/components/feedback/inline-alert";
import { Badge } from "@/components/ui/badge";

const metricIcons = [Wallet, Clock, History, Calendar];

export function DashboardOverview() {
  const { user } = useAuth();
  const { data, error, isLoading, refresh } = useDashboardData() as any;
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [techLocation, setTechLocation] = useState<any>(null);

  useEffect(() => {
    let interval: any;
    if (trackingId) {
      const fetchLocation = async () => {
        try {
          const res = await apiClient.get(`/api/v2/location/${trackingId}`);
          setTechLocation(res.data);
        } catch (err) {
          console.error("Tracking error:", err);
        }
      };
      fetchLocation();
      interval = setInterval(fetchLocation, 10000); // Poll every 10s
    } else {
      setTechLocation(null);
    }
    return () => clearInterval(interval);
  }, [trackingId]);

  async function handlePayment(booking: any) {
    try {
      setProcessingId(booking.id);
      
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || "rzp_test_YourKeyHere",
        amount: (parseFloat(booking.price.replace("Rs. ", "")) || 0) * 100,
        currency: "INR",
        name: "Techbes Marketplace",
        description: `Payment for ${booking.serviceTitle}`,
        order_id: booking.orderId,
        handler: async function (response: any) {
          try {
            await apiClient.post("/api/v2/payment/verify-payment", {
              jobId: booking.id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success("Payment successful! Job completed.");
            refresh();
          } catch (err) {
            toast.error("Payment verification failed.");
          }
        },
        prefill: {
          name: user?.name,
          contact: user?.mobileNumber,
        },
        theme: { color: "#2563eb" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("Failed to initiate payment.");
    } finally {
      setProcessingId(null);
    }
  }

  if (isLoading) {
    return <PageStatus message="Loading your dashboard..." className="min-h-[70vh]" />;
  }

  if (error || !data) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <InlineAlert message={error ?? "Dashboard data is unavailable."} />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>

      <div className="rounded-[36px] border border-slate-200 bg-white p-8 shadow-[0_25px_60px_-36px_rgba(15,23,42,0.35)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
              {user?.role === "admin" ? "Admin dashboard" : "Customer dashboard"}
            </div>
            <h1 className="mt-4 text-4xl font-semibold text-slate-950">
              Manage bookings, service history, and saved addresses
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {(user?.role === "admin" || user?.role === "manager") && (
              <Button asChild className="rounded-full bg-blue-600 hover:bg-blue-700 h-12 px-6 shadow-lg shadow-blue-600/20">
                <Link href="/admin/tracking" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Fleet Tracker
                </Link>
              </Button>
            )}
            <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-3.5 text-sm text-slate-600 flex items-center h-12">
              Signed in as <span className="font-semibold text-slate-950 ml-1">{user?.name || user?.mobileNumber}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric: any, index: number) => {
          const Icon = metricIcons[index] || Wallet;
          return <MetricCard key={metric.title} metric={metric} icon={<Icon className="h-5 w-5" />} />;
        })}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr,0.85fr]">
        <div className="space-y-6">
          <Card className="rounded-[34px] border-slate-200 bg-white shadow-[0_24px_60px_-36px_rgba(15,23,42,0.35)]">
            <CardContent className="p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-950">My bookings</h2>
                  <p className="mt-1 text-sm text-slate-500">Live order tracking and payment status.</p>
                </div>
                <Button asChild variant="outline" className="rounded-full">
                  <Link href="/services">Book another service</Link>
                </Button>
              </div>

              <div className="mt-6 space-y-4">
                {data.bookings.map((booking: any) => (
                  <div key={booking.id} className="rounded-3xl border border-slate-200 p-5 transition-all hover:border-blue-200 hover:bg-blue-50/10">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-lg font-semibold text-slate-950">{booking.serviceTitle}</p>
                          <StatusBadge status={booking.status} />
                        </div>
                        <p className="mt-1 text-xs font-mono text-slate-400 uppercase">{booking.id}</p>
                        
                        <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          {booking.address}
                        </div>

                        {booking.assignedTechnician && (
                          <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                <UserIcon className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="text-xs text-slate-500">Technician</p>
                                <p className="text-sm font-medium text-slate-950">{booking.assignedTechnician.name}</p>
                              </div>
                            </div>

                            {["assigned", "started", "in_progress"].includes(booking.status) && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="rounded-full border-blue-200 text-blue-600 hover:bg-blue-50"
                                onClick={() => setTrackingId(trackingId === booking.assignedTechnician._id ? null : booking.assignedTechnician._id)}
                              >
                                <Navigation className="mr-2 h-3 w-3" />
                                {trackingId === booking.assignedTechnician._id ? "Close Tracking" : "Track Location"}
                              </Button>
                            )}
                          </div>
                        )}
                        
                        {booking.status === "payment_pending" && (
                          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-rose-50 p-3">
                            <Button 
                              onClick={() => handlePayment(booking)} 
                              disabled={processingId === booking.id}
                              className="rounded-full bg-rose-600 hover:bg-rose-700"
                            >
                              {processingId === booking.id ? "Processing..." : "Pay Now"}
                            </Button>
                            <p className="text-xs text-rose-600 font-medium italic">Technician has requested payment for completed work.</p>
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-slate-500 sm:text-right">
                        <p className="font-medium text-slate-900">{booking.date}</p>
                        <p className="mt-1">{booking.time}</p>
                        <p className="mt-3 text-lg font-bold text-slate-950">{booking.price}</p>
                      </div>
                    </div>

                    {trackingId === booking.assignedTechnician?._id && techLocation && (
                      <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-semibold text-blue-900">Live Technician Location</h4>
                            <Badge className="bg-blue-200 text-blue-800 border-none">Updating Live</Badge>
                          </div>
                          <p className="text-xs text-blue-700 mb-3">Your technician is currently at Latitude: {techLocation.lat}, Longitude: {techLocation.lng}</p>
                          <div className="aspect-[16/5] w-full rounded-xl bg-blue-200 flex items-center justify-center text-blue-500 overflow-hidden relative">
                             <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/pin-s+28539b(${techLocation.lng},${techLocation.lat})/${techLocation.lng},${techLocation.lat},14/600x200?access_token=mock')] bg-cover bg-center" />
                             <span className="relative z-10 font-medium">Tracking Map View</span>
                          </div>
                          <p className="mt-2 text-[10px] text-blue-500 italic text-center">Map visualization powered by technician's GPS sync.</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {data.bookings.length === 0 && <EmptyState title="No bookings found" description="Start by booking a service from our marketplace." />}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="rounded-[34px] border-slate-200 bg-white shadow-[0_24px_60px_-36px_rgba(15,23,42,0.35)]">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-slate-950">Service updates</h2>
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="space-y-6">
                {data.bookings.slice(0, 3).map((booking: any) => (
                  <div key={`${booking.id}-update`} className="relative pl-6 pb-2 border-l-2 border-slate-100 last:border-0 last:pb-0">
                    <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-white bg-blue-500" />
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                      {booking.status === 'pending' ? 'Request Received' : booking.status.replace('_', ' ')}
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-950">{booking.serviceTitle}</p>
                    <p className="mt-1 text-xs text-slate-500">{booking.date} • {booking.time}</p>
                  </div>
                ))}
                {data.bookings.length === 0 && (
                  <p className="text-sm text-slate-500 italic">No recent activity.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[34px] border-slate-200 bg-white shadow-[0_24px_60px_-36px_rgba(15,23,42,0.35)]">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-slate-950">Upcoming services</h2>
                <Calendar className="h-5 w-5 text-slate-400" />
              </div>
              <div className="space-y-4">
                {data.upcomingBookings.length > 0 ? (
                  data.upcomingBookings.map((booking: any) => (
                    <div key={booking.id} className="rounded-3xl border border-slate-200 bg-white p-5 hover:border-blue-100 hover:shadow-sm transition-all">
                      <p className="font-semibold text-slate-950">{booking.serviceTitle}</p>
                      <div className="mt-3 flex items-center gap-3 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {booking.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {booking.date}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState
                    title="No upcoming services"
                    description="Your next technician booking will appear here."
                  />
                )}
              </div>
            </CardContent>
          </Card>

          <div className="rounded-[34px] bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-xl">
             <h3 className="text-xl font-semibold">Need help?</h3>
             <p className="mt-2 text-blue-100 text-sm">Our support team is available 24/7 for any service related queries.</p>
             <Button className="mt-6 w-full rounded-full bg-white text-blue-600 hover:bg-blue-50">
               Contact Support
             </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricCard({ metric, icon }: { metric: any; icon: ReactNode }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-36px_rgba(15,23,42,0.35)]">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{metric.title}</p>
        <div
          className={
            metric.tone === "emerald"
              ? "rounded-2xl bg-emerald-50 p-2 text-emerald-700"
              : "rounded-2xl bg-blue-50 p-2 text-blue-700"
          }
        >
          {icon}
        </div>
      </div>
      <p className="mt-5 text-4xl font-semibold text-slate-950">{metric.value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    pending: "bg-amber-100 text-amber-700",
    assigned: "bg-blue-100 text-blue-700",
    started: "bg-indigo-100 text-indigo-700",
    in_progress: "bg-indigo-100 text-indigo-700",
    payment_pending: "bg-rose-100 text-rose-700",
    completed: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-slate-100 text-slate-700",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${styles[status] || "bg-slate-100 text-slate-700"}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
      <p className="text-lg font-semibold text-slate-950">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}
