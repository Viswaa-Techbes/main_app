"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { CalendarDays, MapPin, PackageOpen, ShieldCheck, Wallet } from "lucide-react";

import { RoleGuard } from "@/features/auth/components/role-guard";
import { useAuth } from "@/features/auth/context/auth-context";
import { useDashboardData } from "@/features/dashboard/hooks/use-dashboard-data";
import { DashboardMetric } from "@/features/dashboard/services/dashboard-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InlineAlert } from "@/shared/components/feedback/inline-alert";
import { PageStatus } from "@/shared/components/feedback/page-status";

const metricIcons = [CalendarDays, PackageOpen, MapPin, Wallet];

export function DashboardOverview() {
  const { user } = useAuth();
  const { data, error, isLoading } = useDashboardData();

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
      <div className="rounded-[36px] border border-slate-200 bg-white p-8 shadow-[0_25px_60px_-36px_rgba(15,23,42,0.35)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
              {user?.role === "admin" ? "Admin dashboard" : "Customer dashboard"}
            </div>
            <h1 className="mt-4 text-4xl font-semibold text-slate-950">
              Manage bookings, service history, and saved addresses
            </h1>
            <p className="mt-3 max-w-3xl text-slate-600">
              A modular, role-aware dashboard surface with clean loading, success, and error states.
            </p>
          </div>

          <RoleGuard
            allow={["admin"]}
            fallback={
              <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
                Signed in as <span className="font-semibold text-slate-950">{user?.email}</span>
              </div>
            }
          >
            <div className="rounded-[28px] border border-emerald-100 bg-emerald-50 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white p-2 text-emerald-700 shadow-sm">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-900">Admin tools unlocked</p>
                  <p className="text-sm text-emerald-700">You can now review operations-level dashboard modules.</p>
                </div>
              </div>
            </div>
          </RoleGuard>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric, index) => {
          const Icon = metricIcons[index];
          return <MetricCard key={metric.title} metric={metric} icon={<Icon className="h-5 w-5" />} />;
        })}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr,0.85fr]">
        <Card className="rounded-[34px] border-slate-200 bg-white shadow-[0_24px_60px_-36px_rgba(15,23,42,0.35)]">
          <CardContent className="p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-950">My bookings</h2>
                <p className="mt-1 text-sm text-slate-500">Live order tracking, statuses, and scheduled visits.</p>
              </div>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/services">Book another service</Link>
              </Button>
            </div>

                <div className="mt-6">
                  {data.bookings.length > 0 ? (
                    <div className="space-y-4">
                      {data.bookings.map((booking) => (
                        <div key={booking.id} className="rounded-xl border border-slate-200 p-4">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-base font-semibold text-slate-950">{booking.serviceTitle}</p>
                                <StatusBadge status={booking.status} />
                              </div>
                              <p className="mt-1 text-sm text-slate-500">{booking.id}</p>
                              <p className="mt-2 text-sm text-slate-600">{booking.address}</p>
                            </div>
                            <div className="text-sm text-slate-500 sm:text-right">
                              <p>{booking.date}</p>
                              <p className="mt-1">{booking.time}</p>
                              <p className="mt-2 font-semibold text-slate-950">{booking.price}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-8 text-center">
                      <p className="text-xl font-semibold text-slate-900">📦 No Bookings Yet</p>
                      <p className="mt-2 text-sm text-slate-500">You haven’t booked any services yet.</p>
                      <div className="mt-4">
                        <Button asChild>
                          <Link href="/services" className="rounded-full bg-emerald-600 px-4 py-2 text-white">
                            Explore Services
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="rounded-[34px] border-slate-200 bg-white shadow-[0_24px_60px_-36px_rgba(15,23,42,0.35)]">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-slate-950">Saved addresses</h2>
              <p className="mt-1 text-sm text-slate-500">Reusable service locations for faster checkout.</p>
              <div className="mt-6 space-y-4">
                {data.savedAddresses.length > 0 ? (
                  data.savedAddresses.map((address) => (
                    <div key={address.id} className="rounded-3xl bg-slate-50 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-slate-950">{address.label}</p>
                        {address.isDefault ? (
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                            Default
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{address.address}</p>
                    </div>
                  ))
                ) : (
                  <EmptyState
                    title="No saved addresses"
                    description="Add frequently used service locations for faster booking."
                  />
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[34px] border-slate-200 bg-[linear-gradient(180deg,#f8fafc,#ffffff)] shadow-[0_24px_60px_-36px_rgba(15,23,42,0.3)]">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-slate-950">Upcoming services</h2>
              <p className="mt-1 text-sm text-slate-500">Your next confirmed visits and technician windows.</p>
              <div className="mt-6 space-y-4">
                {data.upcomingBookings.length > 0 ? (
                  data.upcomingBookings.map((booking) => (
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

function MetricCard({ metric, icon }: { metric: DashboardMetric; icon: ReactNode }) {
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
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        status === "Upcoming"
          ? "bg-emerald-100 text-emerald-700"
          : status === "Completed"
            ? "bg-blue-100 text-blue-700"
            : "bg-rose-100 text-rose-700"
      }`}
    >
      {status}
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
