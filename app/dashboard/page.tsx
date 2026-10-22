"use client";

import { useEffect, useState } from "react";
import { fetchAuthApi } from "@/lib/api";
import { Card } from "@/components/ui/card";
import {
  Calendar,
  CheckCircle,
  Package,
  ArrowRight,
  MessageSquare,
  MapPin,
  User,
  Receipt,
  ShieldCheck,
  FileText,
  Clock,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/features/auth/context/auth-context";

export default function DashboardOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [quoteCount, setQuoteCount] = useState<number>(0);
  const [addressCount, setAddressCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const isResident = user?.role === "resident" || Boolean(user?.apartmentId);

  useEffect(() => {
    async function loadStats() {
      try {
        const [statsRes, quotesRes, addressesRes] = await Promise.allSettled([
          fetchAuthApi("/api/v2/customer/dashboard-stats"),
          fetchAuthApi("/api/v2/quotes/my-quotes"),
          fetchAuthApi("/api/v2/user/addresses"),
        ]);

        if (statsRes.status === "fulfilled" && statsRes.value?.success) {
          setStats(statsRes.value.data);
        }
        if (quotesRes.status === "fulfilled" && quotesRes.value?.success) {
          const qList = Array.isArray(quotesRes.value.data) ? quotesRes.value.data : [];
          setQuoteCount(qList.length);
        }
        if (addressesRes.status === "fulfilled" && addressesRes.value?.success) {
          const aList = Array.isArray(addressesRes.value.data) ? addressesRes.value.data : [];
          setAddressCount(aList.length);
        }
      } catch (err) {
        console.error("Failed to load dashboard overview data", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-36 bg-white rounded-2xl border border-gray-100"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="h-28 bg-white rounded-2xl border border-gray-100"></div>
          <div className="h-28 bg-white rounded-2xl border border-gray-100"></div>
          <div className="h-28 bg-white rounded-2xl border border-gray-100"></div>
          <div className="h-28 bg-white rounded-2xl border border-gray-100"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Welcome back, {user?.name?.split(" ")[0] || "Customer"}! 👋
          </h1>
          <p className="text-blue-100 text-sm sm:text-base max-w-xl leading-relaxed">
            Track your technician service visits, view custom itemized quotations, and manage your installation addresses all in one place.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/services"
              className="bg-white text-blue-900 px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm hover:bg-gray-50 transition shadow-sm"
            >
              Book a Service
            </Link>
            <Link
              href="/quote"
              className="bg-blue-800/60 hover:bg-blue-800 border border-blue-400/30 text-white px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition backdrop-blur-xs"
            >
              Request a Quotation
            </Link>
            {isResident && (
              <Link
                href="/resident"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition shadow-sm flex items-center gap-1.5"
              >
                <Building2 size={16} /> Open Resident Portal
              </Link>
            )}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 right-20 w-48 h-48 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
      </div>

      {/* ── Apartment Resident Quick Card ── */}
      {isResident && (
        <Card className="p-6 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white border-0 shadow-lg relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full">
                <Building2 size={13} />
                <span>Apartment Resident Hub</span>
              </div>
              <h2 className="text-xl font-bold">
                {user?.apartmentName || (user?.apartment as any)?.name || "Your Society"}
              </h2>
              <p className="text-xs text-emerald-100">
                Unit: <strong>{user?.block ? `Block ${user.block}, ` : ""}Flat #{user?.flatNumber || "Assigned"}</strong> &bull; Fast-track plumbing, electrical, and lift complaints.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/resident"
                className="px-5 py-2.5 rounded-xl bg-white text-emerald-900 font-bold text-xs hover:bg-emerald-50 transition shadow-sm flex items-center gap-1.5"
              >
                Go to Complaints & Portal <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Stats: Useful Customer Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          icon={<Receipt className="text-blue-600" />}
          title="My Quotations"
          value={quoteCount}
          bg="bg-blue-50"
          link="/dashboard/quotes"
        />
        <StatCard
          icon={<Calendar className="text-indigo-600" />}
          title="Total Bookings"
          value={stats?.totalBookings || 0}
          bg="bg-indigo-50"
          link="/dashboard/bookings"
        />
        <StatCard
          icon={<CheckCircle className="text-emerald-600" />}
          title="Completed Services"
          value={stats?.completedBookings || 0}
          bg="bg-emerald-50"
          link="/dashboard/bookings?filter=completed"
        />
        <StatCard
          icon={<MapPin className="text-amber-600" />}
          title="Saved Addresses"
          value={addressCount}
          bg="bg-amber-50"
          link="/dashboard/addresses"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Bookings */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Upcoming Services</h2>
            <Link
              href="/dashboard/bookings"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              View All Bookings <ArrowRight size={14} />
            </Link>
          </div>

          <Card className="p-0 overflow-hidden border-gray-100 shadow-xs rounded-2xl bg-white">
            {stats?.upcomingBookings?.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {stats.upcomingBookings.map((booking: any) => (
                  <div
                    key={booking._id}
                    className="p-5 hover:bg-gray-50 transition flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                        <Package size={22} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">
                          {booking.serviceName || booking.title || "Service Booking"}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                          <Clock size={12} />
                          {booking.bookingDate || new Date(booking.scheduledDate || booking.createdAt).toLocaleDateString()}
                          {booking.timeSlot ? ` at ${booking.timeSlot}` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 capitalize">
                        {(booking.status || "Pending").replace("_", " ")}
                      </span>
                      <Link
                        href={`/dashboard/bookings/${booking._id}`}
                        className="text-xs text-blue-600 font-bold hover:underline"
                      >
                        Track Status
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center text-gray-500">
                <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-900 font-bold text-sm mb-1">No Upcoming Service Bookings</p>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
                  Schedule a verified technician for CCTV installation, repair, networking, or site inspection.
                </p>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition"
                >
                  Explore Services
                </Link>
              </div>
            )}
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <Card className="p-3 border-gray-100 shadow-xs rounded-2xl bg-white space-y-1">
              <QuickActionLink
                icon={<Receipt size={17} />}
                title="My Quotations"
                href="/dashboard/quotes"
                color="text-blue-600"
                bg="bg-blue-50"
              />
              <QuickActionLink
                icon={<Calendar size={17} />}
                title="My Bookings"
                href="/dashboard/bookings"
                color="text-indigo-600"
                bg="bg-indigo-50"
              />
              <QuickActionLink
                icon={<ShieldCheck size={17} />}
                title="My AMC Contracts"
                href="/dashboard/amc"
                color="text-amber-600"
                bg="bg-amber-50"
              />
              <QuickActionLink
                icon={<MapPin size={17} />}
                title="Manage Addresses"
                href="/dashboard/addresses"
                color="text-emerald-600"
                bg="bg-emerald-50"
              />
              <QuickActionLink
                icon={<MessageSquare size={17} />}
                title="Support Tickets"
                href="/dashboard/support"
                color="text-rose-600"
                bg="bg-rose-50"
              />
              <QuickActionLink
                icon={<User size={17} />}
                title="Profile Settings"
                href="/dashboard/profile"
                color="text-purple-600"
                bg="bg-purple-50"
              />
            </Card>
          </div>

          {/* AMC Promo Banner */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200/60 shadow-xs">
            <h3 className="font-bold text-amber-950 text-base mb-1.5 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-amber-600" />
              Annual Maintenance Contracts
            </h3>
            <p className="text-amber-800 text-xs mb-3.5 leading-relaxed">
              Keep your surveillance systems in peak health with regular quarterly maintenance and zero labor charge visits.
            </p>
            <Link
              href="/dashboard/amc"
              className="block text-center w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-xl text-xs transition shadow-xs"
            >
              View AMC Plans
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, bg, link }: any) {
  return (
    <Link href={link}>
      <Card className="p-5 border-gray-100 shadow-xs rounded-2xl hover:shadow-md transition cursor-pointer group bg-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 mb-1">{title}</p>
            <h3 className="text-2xl font-black text-gray-900">{value}</h3>
          </div>
          <div
            className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center group-hover:scale-105 transition-transform shrink-0`}
          >
            {icon}
          </div>
        </div>
      </Card>
    </Link>
  );
}

function QuickActionLink({ icon, title, href, color, bg }: any) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition group"
    >
      <div className={`w-9 h-9 rounded-lg ${bg} ${color} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <span className="font-semibold text-xs text-gray-800 group-hover:text-blue-600 transition">
        {title}
      </span>
      <ArrowRight
        size={14}
        className="ml-auto text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform"
      />
    </Link>
  );
}
