"use client";

import { useEffect, useState } from "react";
import { cctvApi } from "@/lib/cctv-api";
import { PageStatus } from "@/shared/components/feedback/page-status";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    cctvApi
      .myPayments()
      .then((data) => {
        if (!mounted) return;
        setPayments(Array.isArray(data) ? data : []);
      })
      .catch((err) => setError(err?.message || "Unable to load payments"))
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <PageStatus message="Loading payments..." />;
  if (error) return <div className="p-6">Error: {error}</div>;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Payments</h1>
      <p className="mt-2 text-sm text-slate-600">Your recent payment transactions.</p>
      <div className="mt-6 space-y-4">
        {payments.length === 0 ? (
          <div className="rounded-md border border-slate-200 bg-white p-6 text-slate-600">No payments found.</div>
        ) : (
          payments.map((p) => (
            <div key={p._id} className="rounded-md border border-slate-200 bg-white p-4">
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">{p.meta?.bookingPayload?.serviceName || 'Booking Payment'}</div>
                  <div className="text-sm text-slate-500">Order: {p.razorpayOrderId}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">₹{(p.amount || 0) / 100}</div>
                  <div className="text-sm text-slate-500">{p.status}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
