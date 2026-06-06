"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const token = window.localStorage.getItem('techbes_backend_token');
      const res = await fetch('/api/v2/payment/admin/list', { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed');
      setPayments(json.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function refund(paymentId: string) {
    const token = window.localStorage.getItem('techbes_backend_token');
    const res = await fetch('/api/v2/payment/admin/refund', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ paymentId }) });
    const j = await res.json();
    if (j.success) load(); else alert(j.message || 'Refund failed');
  }

  async function retry(paymentId: string) {
    const token = window.localStorage.getItem('techbes_backend_token');
    const res = await fetch('/api/v2/payment/admin/retry', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ paymentId }) });
    const j = await res.json();
    if (j.success) {
      // Open checkout using new order
      const data = j.data;
      // Pass back to frontend checkout flow: route to /checkout?paymentId=...
      window.location.href = `/checkout?paymentId=${data.paymentId}`;
    } else {
      alert(j.message || 'Retry failed');
    }
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-semibold">Admin Payments</h1>
        {loading && <p>Loading...</p>}
        {error && <p className="text-rose-600">{error}</p>}
        <div className="mt-4">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="text-left">
                <th className="p-2">Payment ID</th>
                <th className="p-2">Order ID</th>
                <th className="p-2">Customer</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Status</th>
                <th className="p-2">Created</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="p-2 text-sm">{p._id}</td>
                  <td className="p-2 text-sm">{p.razorpayOrderId}</td>
                  <td className="p-2 text-sm">{p.userId || '—'}</td>
                  <td className="p-2 text-sm">Rs. {Math.round((p.amount||0)/100).toLocaleString('en-IN')}</td>
                  <td className="p-2 text-sm">{p.status}</td>
                  <td className="p-2 text-sm">{new Date(p.createdAt).toLocaleString()}</td>
                  <td className="p-2 text-sm">
                    <Button variant="outline" size="sm" onClick={() => retry(p._id)} className="mr-2">Retry</Button>
                    <Button variant="destructive" size="sm" onClick={() => refund(p._id)}>Refund</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedRoute>
  );
}
