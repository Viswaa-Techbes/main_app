"use client";

import { useEffect, useState } from "react";
import { fetchAuthApi } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Star, MessageSquare, Edit2, Trash2 } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import Link from "next/link";
import { PageStatus } from "@/shared/components/feedback/page-status";

export default function ReviewsPage() {
  const [completedBookings, setCompletedBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'submitted'>('pending');

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    try {
      const res = await fetchAuthApi("/api/v2/bookings?status=Completed");
      if (res.success && res.data) {
        setCompletedBookings(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <PageStatus message="Loading your reviews..." className="min-h-[70vh]" />;

  const pendingReviews = completedBookings.filter(b => !b.hasReview); // Assuming hasReview is a flag
  const submittedReviews = completedBookings.filter(b => b.hasReview);

  const displayedList = activeTab === 'pending' ? pendingReviews : submittedReviews;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Reviews</h1>
          <p className="text-gray-500">Share your experience and manage past reviews</p>
        </div>
      </div>

      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-4 px-6 font-bold text-sm transition-all border-b-2 \${
            activeTab === 'pending'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          To Review ({pendingReviews.length})
        </button>
        <button
          onClick={() => setActiveTab('submitted')}
          className={`pb-4 px-6 font-bold text-sm transition-all border-b-2 \${
            activeTab === 'submitted'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Submitted ({submittedReviews.length})
        </button>
      </div>

      <div className="space-y-4 pt-2">
        {displayedList.length > 0 ? (
          displayedList.map((booking) => (
            <Card key={booking._id} className="p-6 rounded-2xl shadow-sm border-gray-100 bg-white">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                
                <div className="flex-1 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                      <Star size={24} className="fill-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{booking.serviceName || booking.title || 'Service Booking'}</h3>
                      <p className="text-sm text-gray-500 font-medium mb-1">
                        Completed on {formatDateTime(booking.completedAt || booking.updatedAt || booking.createdAt)}
                      </p>
                      {booking.assignedTechnicianDetails && (
                        <p className="text-sm text-gray-600">
                          Technician: <span className="font-semibold">{booking.assignedTechnicianDetails.name || 'Techbes Expert'}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {activeTab === 'submitted' && (
                    <div className="bg-gray-50 p-4 rounded-xl mt-4 border border-gray-100">
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} className={`\${i < (booking.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <p className="text-sm text-gray-700 italic">"{booking.reviewText || 'Great service, highly recommended!'}"</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 shrink-0">
                  {activeTab === 'pending' ? (
                    <button className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 font-bold text-sm rounded-lg transition shadow-md shadow-blue-200">
                      <MessageSquare size={16} /> Write Review
                    </button>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <button className="flex items-center justify-center gap-2 px-6 py-2 bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 font-bold text-sm rounded-lg transition">
                        <Edit2 size={16} /> Edit
                      </button>
                      <button className="flex items-center justify-center gap-2 px-6 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-sm rounded-lg transition">
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center border-dashed border-2 border-gray-200">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
              <Star size={32} className="text-gray-300" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">
              {activeTab === 'pending' ? 'No pending reviews' : 'No submitted reviews'}
            </h3>
            <p className="text-gray-500 text-sm">
              {activeTab === 'pending' 
                ? 'You have reviewed all your past bookings.' 
                : 'You have not submitted any reviews yet.'}
            </p>
            {activeTab === 'submitted' && (
              <button onClick={() => setActiveTab('pending')} className="inline-block mt-4 text-blue-600 font-bold hover:underline">
                View pending reviews &rarr;
              </button>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
