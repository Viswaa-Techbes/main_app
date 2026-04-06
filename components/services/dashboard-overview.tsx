import Link from "next/link";
import { CalendarDays, MapPin, PackageOpen, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { dashboardBookings, savedAddresses } from "@/lib/marketplace-data";

export function DashboardOverview() {
  const upcoming = dashboardBookings.filter((booking) => booking.status === "Upcoming");
  const history = dashboardBookings.filter((booking) => booking.status !== "Upcoming");

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[36px] border border-slate-200 bg-white p-8 shadow-[0_25px_60px_-36px_rgba(15,23,42,0.35)]">
        <div className="inline-flex rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
          User dashboard
        </div>
        <h1 className="mt-4 text-4xl font-semibold text-slate-950">Manage bookings, history, and saved addresses</h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          A marketplace-style dashboard surface for repeat customers and business admins.
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-4">
        <Metric title="Upcoming services" value={String(upcoming.length)} icon={CalendarDays} />
        <Metric title="Order history" value={String(history.length)} icon={PackageOpen} />
        <Metric title="Saved addresses" value={String(savedAddresses.length)} icon={MapPin} />
        <Metric title="Coupons saved" value="03" icon={Wallet} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr,0.85fr]">
        <Card className="rounded-[34px] border-slate-200 bg-white shadow-[0_24px_60px_-36px_rgba(15,23,42,0.35)]">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-950">My bookings</h2>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/services">Book another service</Link>
              </Button>
            </div>
            <div className="mt-6 space-y-4">
              {dashboardBookings.map((booking) => (
                <div key={booking.id} className="rounded-3xl border border-slate-200 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="text-lg font-semibold text-slate-950">{booking.serviceTitle}</p>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            booking.status === "Upcoming"
                              ? "bg-emerald-100 text-emerald-700"
                              : booking.status === "Completed"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-500">{booking.id}</p>
                      <p className="mt-3 text-sm text-slate-600">{booking.address}</p>
                    </div>
                    <div className="text-sm text-slate-500 sm:text-right">
                      <p>{booking.date}</p>
                      <p className="mt-1">{booking.time}</p>
                      <p className="mt-3 font-semibold text-slate-950">{booking.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="rounded-[34px] border-slate-200 bg-white shadow-[0_24px_60px_-36px_rgba(15,23,42,0.35)]">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-slate-950">Saved addresses</h2>
              <div className="mt-6 space-y-4">
                {savedAddresses.length > 0 ? (
                  savedAddresses.map((address) => (
                    <div key={address.id} className="rounded-3xl bg-slate-50 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-slate-950">{address.label}</p>
                        {address.isDefault && (
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{address.address}</p>
                    </div>
                  ))
                ) : (
                  <EmptyBlock title="No saved addresses" description="Add frequently used service locations for faster booking." />
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[34px] border-slate-200 bg-[linear-gradient(180deg,#f8fafc,#ffffff)] shadow-[0_24px_60px_-36px_rgba(15,23,42,0.3)]">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-slate-950">Upcoming services</h2>
              <div className="mt-6 space-y-4">
                {upcoming.length > 0 ? (
                  upcoming.map((booking) => (
                    <div key={booking.id} className="rounded-3xl border border-slate-200 bg-white p-5">
                      <p className="font-semibold text-slate-950">{booking.serviceTitle}</p>
                      <p className="mt-2 text-sm text-slate-500">{booking.date} at {booking.time}</p>
                    </div>
                  ))
                ) : (
                  <EmptyBlock title="No upcoming services" description="Your next technician booking will appear here." />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Metric({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: typeof CalendarDays;
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-36px_rgba(15,23,42,0.35)]">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className="rounded-2xl bg-emerald-50 p-2 text-emerald-700">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-5 text-4xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function EmptyBlock({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
      <p className="text-lg font-semibold text-slate-950">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}
