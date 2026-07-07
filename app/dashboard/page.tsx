"use client";

import { useEffect, useState } from "react";
import { fetchAuthApi } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Activity, Wallet, Calendar, CheckCircle, Package, ArrowRight, MessageSquare, FileText, MapPin, User } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/features/auth/context/auth-context";

export default function DashboardOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetchAuthApi("/api/v2/customer/dashboard-stats");
        if (res.success) {
          setStats(res.data);
        }
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-24 bg-white rounded-2xl border border-gray-100"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-white rounded-2xl border border-gray-100"></div>
          <div className="h-32 bg-white rounded-2xl border border-gray-100"></div>
          <div className="h-32 bg-white rounded-2xl border border-gray-100"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 rounded-2xl p-8 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0] || 'Customer'}! 👋</h1>
          <p className="text-blue-100 text-lg max-w-xl">
            Manage your service bookings, track your technicians in real-time, and view your wallet balance all in one place.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link href="/services" className="bg-white text-blue-900 px-6 py-2.5 rounded-full font-bold hover:bg-gray-50 transition shadow-sm">
              Book a Service
            </Link>
            <Link href="/dashboard/wallet" className="bg-blue-800/50 hover:bg-blue-800 border border-blue-500/30 text-white px-6 py-2.5 rounded-full font-medium transition backdrop-blur-sm">
              Add Funds
            </Link>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 right-20 w-48 h-48 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Wallet className="text-emerald-600" />} 
          title="Wallet Balance" 
          value={formatCurrency(stats?.walletBalance || 0)} 
          bg="bg-emerald-50"
          link="/dashboard/wallet"
        />
        <StatCard 
          icon={<Star className="text-amber-500" />} 
          title="Loyalty Points" 
          value={stats?.loyaltyPoints || 0} 
          bg="bg-amber-50"
          link="/dashboard/wallet"
        />
        <StatCard 
          icon={<Calendar className="text-blue-600" />} 
          title="Total Bookings" 
          value={stats?.totalBookings || 0} 
          bg="bg-blue-50"
          link="/dashboard/bookings"
        />
        <StatCard 
          icon={<CheckCircle className="text-indigo-600" />} 
          title="Completed" 
          value={stats?.completedBookings || 0} 
          bg="bg-indigo-50"
          link="/dashboard/bookings?filter=completed"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Bookings */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Upcoming Bookings</h2>
            <Link href="/dashboard/bookings" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          <Card className="p-0 overflow-hidden border-gray-100 shadow-sm rounded-2xl">
            {stats?.upcomingBookings?.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {stats.upcomingBookings.map((booking: any) => (
                  <div key={booking._id} className="p-6 hover:bg-gray-50 transition flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                        <Package size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{booking.serviceName || 'Service Booking'}</h3>
                        <p className="text-sm text-gray-500 mt-1">{new Date(booking.scheduledDate || booking.createdAt).toLocaleDateString()} at {booking.scheduledTime || 'TBD'}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        {booking.status}
                      </span>
                      <Link href={`/dashboard/bookings/${booking._id}`} className="text-sm text-blue-600 font-medium hover:underline">
                        Track Status
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar size={28} className="text-gray-400" />
                </div>
                <p className="text-gray-900 font-medium mb-1">No upcoming bookings</p>
                <p className="text-sm">You don't have any scheduled services right now.</p>
              </div>
            )}
          </Card>
        </div>

        {/* Quick Actions & AMC */}
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <Card className="p-4 border-gray-100 shadow-sm rounded-2xl space-y-2">
              <QuickActionLink icon={<MessageSquare size={18} />} title="Get Support" href="/dashboard/support" color="text-rose-600" bg="bg-rose-50" />
              <QuickActionLink icon={<FileText size={18} />} title="View Invoices" href="/dashboard/invoices" color="text-indigo-600" bg="bg-indigo-50" />
              <QuickActionLink icon={<MapPin size={18} />} title="Manage Addresses" href="/dashboard/addresses" color="text-emerald-600" bg="bg-emerald-50" />
              <QuickActionLink icon={<User size={18} />} title="Edit Profile" href="/dashboard/profile" color="text-blue-600" bg="bg-blue-50" />
            </Card>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100/50">
            <h3 className="font-bold text-amber-900 text-lg mb-2">Protect Your Devices</h3>
            <p className="text-amber-700/80 text-sm mb-4">Get peace of mind with our Annual Maintenance Contracts.</p>
            <Link href="/services/amc" className="block text-center w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-xl transition">
              Explore AMC Plans
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
      <Card className="p-6 border-gray-100 shadow-sm rounded-2xl hover:shadow-md transition cursor-pointer group">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <h3 className="text-2xl font-black text-gray-900">{value}</h3>
          </div>
          <div className={`w-12 h-12 rounded-full \${bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
        </div>
      </Card>
    </Link>
  );
}

function QuickActionLink({ icon, title, href, color, bg }: any) {
  return (
    <Link href={href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition group">
      <div className={`w-10 h-10 rounded-lg \${bg} \${color} flex items-center justify-center`}>
        {icon}
      </div>
      <span className="font-medium text-gray-700 group-hover:text-gray-900">{title}</span>
      <ArrowRight size={16} className="ml-auto text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-transform" />
    </Link>
  );
}

// Simple fallback for Star since I imported it incorrectly above
function Star(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
  );
}
