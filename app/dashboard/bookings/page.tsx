"use client";

import { useEffect, useState } from "react";
import { fetchAuthApi } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { ListOrdered, Filter, Search, Calendar, MapPin, CheckCircle, FileText, Download } from "lucide-react";
import { formatDateTime, formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      const res = await fetchAuthApi("/api/v2/customer/dashboard-stats"); // Using stats endpoint as a mock proxy for now since it returns bookings, ideally we hit /api/v2/bookings/me
      if (res.success && res.data.upcomingBookings) {
        setBookings(res.data.upcomingBookings); 
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const filteredBookings = bookings.filter(b => {
    if (filter === "all") return true;
    if (filter === "completed") return b.status === "Completed";
    if (filter === "upcoming") return ["Pending", "Assigned", "In Progress"].includes(b.status);
    if (filter === "cancelled") return b.status === "Cancelled";
    return true;
  });

  if (loading) return <div className="h-64 flex items-center justify-center animate-pulse"><ListOrdered size={48} className="text-gray-200" /></div>;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-500">Track and manage your service requests</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex overflow-x-auto gap-2 pb-2">
        {['all', 'upcoming', 'completed', 'cancelled'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-bold capitalize whitespace-nowrap transition ${
              filter === f ? 'bg-blue-900 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((b) => (
            <Card key={b._id} className="p-6 rounded-2xl shadow-sm border-gray-100 bg-white hover:shadow-md transition">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <ListOrdered size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{b.serviceName || 'Service Booking'}</h3>
                      <p className="text-sm text-gray-500 font-medium">#{b._id.slice(-8).toUpperCase()}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <Calendar size={16} className="mt-0.5 text-gray-400 shrink-0" />
                      <span>{new Date(b.scheduledDate || b.createdAt).toLocaleDateString()} at {b.scheduledTime || 'TBD'}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin size={16} className="mt-0.5 text-gray-400 shrink-0" />
                      <span className="line-clamp-2">{b.address?.addressLine1 || 'Saved Address'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:items-end justify-between gap-4 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 shrink-0">
                  <div className="flex flex-col md:items-end gap-1">
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold w-fit">
                      {b.status}
                    </span>
                    <span className="text-lg font-black text-gray-900 mt-2">
                      {formatCurrency(b.totalAmount || 0)}
                    </span>
                  </div>
                  
                  <div className="flex gap-2 w-full md:w-auto">
                    {b.status === 'Completed' ? (
                      <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-sm rounded-lg transition">
                        <Download size={16} /> Invoice
                      </button>
                    ) : (
                      <button className="flex-1 md:flex-none px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-sm rounded-lg transition">
                        Track Status
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center border-dashed border-2 border-gray-200">
            <ListOrdered size={32} className="mx-auto text-gray-300 mb-4" />
            <h3 className="font-bold text-gray-900 mb-1">No bookings found</h3>
            <p className="text-gray-500 text-sm">Try changing your filters or book a new service.</p>
            <Link href="/services" className="inline-block mt-4 text-blue-600 font-bold hover:underline">
              Browse Services &rarr;
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
