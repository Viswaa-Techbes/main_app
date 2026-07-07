"use client";

import { useEffect, useState } from "react";
import { fetchAuthApi } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { FileText, Download, Receipt } from "lucide-react";
import { formatDateTime, formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { PageStatus } from "@/shared/components/feedback/page-status";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  async function fetchInvoices() {
    try {
      const res = await fetchAuthApi("/api/v2/bookings?status=Completed");
      if (res.success && res.data) {
        setInvoices(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleDownloadInvoice = (id: string) => {
    // Placeholder for actual PDF download integration
    alert(`Downloading PDF for invoice: ${id}`);
  };

  if (loading) return <PageStatus message="Loading invoices..." className="min-h-[70vh]" />;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-500">View and download invoices for your completed services</p>
        </div>
      </div>

      <div className="space-y-4">
        {invoices.length > 0 ? (
          invoices.map((inv) => {
            const invoiceNumber = `INV-${inv._id.slice(-6).toUpperCase()}`;
            const amount = inv.totalAmount || inv.amount || 0;
            const gst = amount * 0.18; // 18% dummy GST calculation

            return (
              <Card key={inv._id} className="p-6 rounded-2xl shadow-sm border-gray-100 bg-white hover:shadow-md transition">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <Receipt size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{invoiceNumber}</h3>
                        <p className="text-sm text-gray-500 font-medium">{inv.serviceName || inv.title || 'Service Booking'}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Date</span>
                        <span className="text-sm text-gray-800 font-medium">{formatDateTime(inv.completedAt || inv.updatedAt || inv.createdAt)}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Booking ID</span>
                        <span className="text-sm text-gray-800 font-medium">#{inv._id.slice(-8).toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end justify-between gap-4 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 shrink-0">
                    <div className="flex flex-col md:items-end gap-1">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold w-fit">
                        Paid
                      </span>
                      <span className="text-2xl font-black text-gray-900 mt-2">
                        {formatCurrency(amount)}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">Includes {formatCurrency(gst)} GST</span>
                    </div>
                    
                    <button 
                      onClick={() => handleDownloadInvoice(inv._id)}
                      className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-sm rounded-lg transition"
                    >
                      <Download size={16} /> Download PDF
                    </button>
                  </div>

                </div>
              </Card>
            );
          })
        ) : (
          <Card className="p-12 text-center border-dashed border-2 border-gray-200">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
              <FileText size={32} className="text-gray-300" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">No invoices found</h3>
            <p className="text-gray-500 text-sm">You don't have any completed services yet.</p>
            <Link href="/services" className="inline-block mt-4 text-indigo-600 font-bold hover:underline">
              Book a Service &rarr;
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
