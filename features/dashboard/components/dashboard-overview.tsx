import { useState } from "react";
import { apiClient } from "@/core/api/api-client";
import { toast } from "sonner";

export function DashboardOverview() {
  const { user } = useAuth();
  const { data, error, isLoading, refresh } = useDashboardData() as any;
  const [processingId, setProcessingId] = useState<string | null>(null);

  async function handlePayment(booking: any) {
    try {
      setProcessingId(booking.id);
      
      // 1. Get Razorpay Key from backend or env
      // For now, we assume it's part of the order response or pre-configured
      
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

          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
            Signed in as <span className="font-semibold text-slate-950">{user?.name || user?.mobileNumber}</span>
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
                <div key={booking.id} className="rounded-3xl border border-slate-200 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-lg font-semibold text-slate-950">{booking.serviceTitle}</p>
                        <StatusBadge status={booking.status} />
                      </div>
                      <p className="mt-2 text-sm text-slate-500">{booking.id}</p>
                      <p className="mt-3 text-sm text-slate-600">{booking.address}</p>
                      
                      {booking.status === "payment_pending" && (
                        <div className="mt-4 flex items-center gap-3">
                          <Button 
                            onClick={() => handlePayment(booking)} 
                            disabled={processingId === booking.id}
                            className="rounded-full bg-blue-600 hover:bg-blue-700"
                          >
                            {processingId === booking.id ? "Processing..." : "Pay Now"}
                          </Button>
                          <p className="text-xs text-slate-500 italic">Technician has requested payment for completed work.</p>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-slate-500 sm:text-right">
                      <p>{booking.date}</p>
                      <p className="mt-1">{booking.time}</p>
                      <p className="mt-3 font-semibold text-slate-950">{booking.price}</p>
                    </div>
                  </div>
                </div>
              ))}
              {data.bookings.length === 0 && <EmptyState title="No bookings found" description="Start by booking a service from our marketplace." />}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="rounded-[34px] border-slate-200 bg-white shadow-[0_24px_60px_-36px_rgba(15,23,42,0.35)]">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-slate-950">Upcoming services</h2>
              <div className="mt-6 space-y-4">
                {data.upcomingBookings.length > 0 ? (
                  data.upcomingBookings.map((booking: any) => (
                    <div key={booking.id} className="rounded-3xl border border-slate-200 bg-white p-5">
                      <p className="font-semibold text-slate-950">{booking.serviceTitle}</p>
                      <p className="mt-2 text-sm text-slate-500">
                        {booking.date} at {booking.time}
                      </p>
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
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status] || "bg-slate-100 text-slate-700"}`}>
      {status.replace(/_/g, " ").toUpperCase()}
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
