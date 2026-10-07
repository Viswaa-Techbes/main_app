"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAuthApi } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  CreditCard,
  MapPin,
  Volume2,
  Calendar,
  ChevronRight,
  ShieldCheck,
  PackageCheck,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Receipt,
  X,
} from "lucide-react";
import { formatDateTime } from "@/lib/utils";

function loadRazorpayCheckout() {
  return new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("Window not available"));
    if ((window as any).Razorpay) return resolve();
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load Razorpay SDK")), {
        once: true,
      });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.head.appendChild(script);
  });
}

function getStatusBadge(status: string) {
  switch (status) {
    case "quotation_requested":
    case "Quotation Requested":
      return {
        label: "Quotation Requested",
        color: "bg-amber-50 text-amber-700 border-amber-200",
        icon: Clock,
      };
    case "quotation_draft":
    case "Draft":
      return {
        label: "Pricing In Review",
        color: "bg-blue-50 text-blue-700 border-blue-200",
        icon: Clock,
      };
    case "quotation_sent":
    case "Quote Sent":
    case "Quotation Sent":
      return {
        label: "Quotation Ready – Action Required",
        color: "bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold",
        icon: CheckCircle,
      };
    case "payment_pending":
      return {
        label: "Payment Pending",
        color: "bg-purple-50 text-purple-700 border-purple-200",
        icon: CreditCard,
      };
    case "paid":
    case "converted_to_order":
    case "quotation_accepted":
      return {
        label: "Paid & Order Confirmed",
        color: "bg-emerald-100 text-emerald-800 border-emerald-400 font-semibold",
        icon: PackageCheck,
      };
    case "cancelled":
      return {
        label: "Cancelled",
        color: "bg-red-50 text-red-700 border-red-200",
        icon: AlertCircle,
      };
    case "expired":
      return {
        label: "Expired",
        color: "bg-gray-100 text-gray-700 border-gray-300",
        icon: AlertCircle,
      };
    default:
      return {
        label: status || "Pending",
        color: "bg-gray-50 text-gray-700 border-gray-200",
        icon: Clock,
      };
  }
}

export default function CustomerQuotesPage() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [payingQuoteId, setPayingQuoteId] = useState<string | null>(null);
  const [payError, setPayError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  useEffect(() => {
    fetchQuotes();
  }, []);

  async function fetchQuotes() {
    try {
      setLoading(true);
      const res = await fetchAuthApi("/api/v2/quotes/my-quotes");
      if (res.success && Array.isArray(res.data)) {
        setQuotes(res.data);
      }
    } catch (err: any) {
      console.error("Failed to fetch customer quotes:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handlePayNow(quote: any) {
    setPayingQuoteId(quote._id);
    setPayError("");

    try {
      // 1. Backend creates authoritative Razorpay order
      const orderRes = await fetchAuthApi(`/api/v2/quotes/${quote._id}/create-payment-order`, {
        method: "POST",
      });

      if (!orderRes.success || !orderRes.data) {
        throw new Error(orderRes.message || "Failed to initiate payment");
      }

      const orderData = orderRes.data;

      // 2. Check if we can load and run Razorpay checkout
      let sdkLoaded = false;
      try {
        await loadRazorpayCheckout();
        sdkLoaded = !!(window as any).Razorpay;
      } catch (sdkErr) {
        console.warn("Razorpay SDK load notice:", sdkErr);
      }

      // If SDK loaded and not mock mode, launch popup
      if (sdkLoaded && !orderData.isMock && orderData.keyId) {
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency || "INR",
          name: "TechBes Engineering",
          description: `Quotation Booking: ${quote.requestId}`,
          order_id: orderData.orderId,
          handler: async (resp: any) => {
            await verifyPaymentOnServer(quote._id, {
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature: resp.razorpay_signature,
            });
          },
          prefill: {
            name: orderData.customerName || quote.fullName,
            email: orderData.customerEmail || quote.email,
            contact: orderData.customerMobile || quote.mobile,
          },
          theme: {
            color: "#2563EB",
          },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        // Test / mock mode or direct payment verification fallback
        const proceedMock = confirm(
          `Demo/Test Mode Active:\nProceed with simulated payment for Quotation ${quote.requestId} (₹${orderData.displayAmount?.toLocaleString(
            "en-IN"
          )})?`
        );
        if (proceedMock) {
          await verifyPaymentOnServer(quote._id, {
            razorpay_order_id: orderData.orderId,
            razorpay_payment_id: `pay_mock_${Date.now()}`,
            mockSuccess: true,
          });
        }
      }
    } catch (err: any) {
      setPayError(err.message || "Unable to proceed to payment");
    } finally {
      setPayingQuoteId(null);
    }
  }

  async function verifyPaymentOnServer(quoteId: string, payload: any) {
    try {
      const verifyRes = await fetchAuthApi(`/api/v2/quotes/${quoteId}/verify-payment`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (verifyRes.success) {
        setOrderSuccess(verifyRes.data);
        fetchQuotes(); // Refresh list
      } else {
        alert(verifyRes.message || "Payment verification failed");
      }
    } catch (err: any) {
      alert("Verification error: " + (err.message || "Contact support"));
    }
  }

  const isPriceVisible = (status: string) => {
    return [
      "quotation_sent",
      "Quote Sent",
      "Quotation Sent",
      "quotation_accepted",
      "payment_pending",
      "paid",
      "converted_to_order",
    ].includes(status);
  };

  const isPayable = (status: string) => {
    return [
      "quotation_sent",
      "Quote Sent",
      "Quotation Sent",
      "quotation_accepted",
      "payment_pending",
    ].includes(status);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Receipt className="text-blue-600" /> My Quotation Requests
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Track custom quotations, view engineer estimations, and confirm bookings with instant payment.
          </p>
        </div>
        <Link href="/quote">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm flex items-center gap-2">
            <Sparkles size={16} /> Request New Quotation
          </Button>
        </Link>
      </div>

      {payError && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} className="shrink-0" />
          <span className="text-sm font-medium">{payError}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 bg-gray-100 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : quotes.length === 0 ? (
        <Card className="p-12 text-center bg-white border-dashed border-2 border-gray-200 rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <FileText size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No Quotations Found</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
            You haven’t requested any quotations yet. Need custom CCTV surveillance, networking setup, or a web design package?
          </p>
          <Link href="/quote">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Request a Quotation Now
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {quotes.map((quote) => {
            const badge = getStatusBadge(quote.status);
            const BadgeIcon = badge.icon;
            const priceVisible = isPriceVisible(quote.status);
            const canPay = isPayable(quote.status);

            return (
              <Card
                key={quote._id}
                className="p-6 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left: Info */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg">
                        {quote.requestId || "QT-REQ"}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border font-medium ${badge.color}`}
                      >
                        <BadgeIcon size={14} />
                        {badge.label}
                      </span>
                      {quote.orderNumber && (
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                          <PackageCheck size={14} /> Order #{quote.orderNumber}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {quote.serviceCategory || "General Service"}
                        {quote.subcategory && (
                          <span className="text-gray-500 font-normal"> &bull; {quote.subcategory}</span>
                        )}
                      </h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                        <Calendar size={13} />
                        Requested on {formatDateTime(quote.createdAt)}
                      </p>
                    </div>

                    {/* Items preview */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-sm">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                        Requested Items ({quote.items?.length || 0})
                      </p>
                      <div className="space-y-1">
                        {quote.items && quote.items.length > 0 ? (
                          quote.items.map((it: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center text-slate-700">
                              <span>
                                &bull; <strong className="font-semibold text-slate-900">{it.productName}</strong> (Qty: {it.quantity})
                              </span>
                              {priceVisible && it.lineTotal !== undefined && (
                                <span className="font-medium text-slate-900">
                                  ₹{it.lineTotal.toLocaleString("en-IN")}
                                </span>
                              )}
                            </div>
                          ))
                        ) : (
                          <span className="text-slate-500 italic">Custom requirements submitted</span>
                        )}
                      </div>
                    </div>

                    {/* Address & Note */}
                    <div className="flex flex-wrap gap-y-1 gap-x-4 text-xs text-gray-600">
                      {quote.address && (
                        <div className="flex items-center gap-1 text-gray-500">
                          <MapPin size={13} className="text-gray-400 shrink-0" />
                          <span className="truncate max-w-xs">{quote.address}</span>
                        </div>
                      )}
                      {quote.voiceNote && (
                        <div className="flex items-center gap-1 text-blue-600 font-medium">
                          <Volume2 size={13} /> Voice requirement attached
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Pricing & Actions */}
                  <div className="lg:w-72 shrink-0 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6">
                    {priceVisible ? (
                      <div className="space-y-1.5 mb-4">
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>Subtotal:</span>
                          <span>₹{(quote.subtotal || 0).toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>GST ({quote.gstRate || 18}%):</span>
                          <span>₹{(quote.gstAmount || 0).toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between items-baseline pt-1 border-t border-slate-200">
                          <span className="text-xs font-bold uppercase text-slate-700">Final Total:</span>
                          <span className="text-2xl font-black text-slate-900">
                            ₹{(quote.finalAmount || 0).toLocaleString("en-IN")}
                          </span>
                        </div>
                        <p className="text-[11px] text-emerald-700 font-medium text-right flex items-center justify-end gap-1">
                          <ShieldCheck size={12} /> GST Included &bull; Official Quote
                        </p>
                      </div>
                    ) : (
                      <div className="bg-amber-50/80 border border-amber-200 p-3 rounded-xl mb-4 text-center">
                        <p className="text-xs font-bold text-amber-800">Awaiting Pricing</p>
                        <p className="text-[11px] text-amber-700 mt-0.5 leading-snug">
                          Engineer is reviewing specifications. You will receive an official quotation shortly.
                        </p>
                      </div>
                    )}

                    <div className="space-y-2">
                      {canPay && (
                        <Button
                          onClick={() => handlePayNow(quote)}
                          disabled={payingQuoteId === quote._id}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl shadow-md shadow-emerald-200 flex items-center justify-center gap-2"
                        >
                          <CreditCard size={16} />
                          {payingQuoteId === quote._id ? "Processing..." : "Pay Now to Book"}
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        onClick={() => setSelectedQuote(quote)}
                        className="w-full border-gray-200 hover:bg-gray-50 text-gray-700 font-medium text-xs rounded-xl"
                      >
                        View Full Quotation
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* FULL QUOTATION DETAILS MODAL */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-gray-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                  Official Quotation
                </span>
                <h2 className="text-2xl font-black text-gray-900 mt-1">
                  {selectedQuote.requestId || "QT-XXXXX"}
                </h2>
                <p className="text-xs text-gray-500">
                  {selectedQuote.serviceCategory} &bull; {selectedQuote.subcategory || "Custom Service"}
                </p>
              </div>
              <button
                onClick={() => setSelectedQuote(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Requested Items Breakdown */}
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Itemized Scope of Work
              </h4>
              <div className="border border-gray-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs font-bold text-gray-600 border-b border-gray-200">
                    <tr>
                      <th className="py-3 px-4">Item & Description</th>
                      <th className="py-3 px-4 text-center">Qty</th>
                      {isPriceVisible(selectedQuote.status) && (
                        <>
                          <th className="py-3 px-4 text-right">Unit Rate</th>
                          <th className="py-3 px-4 text-right">Line Total</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(selectedQuote.items || []).map((it: any, i: number) => (
                      <tr key={i} className="hover:bg-gray-50/50">
                        <td className="py-3 px-4 font-semibold text-gray-900">{it.productName}</td>
                        <td className="py-3 px-4 text-center text-gray-700">{it.quantity}</td>
                        {isPriceVisible(selectedQuote.status) && (
                          <>
                            <td className="py-3 px-4 text-right text-gray-600">
                              ₹{(it.unitPrice || 0).toLocaleString("en-IN")}
                            </td>
                            <td className="py-3 px-4 text-right font-bold text-gray-900">
                              ₹{(it.lineTotal || 0).toLocaleString("en-IN")}
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Additional requirements & Audio */}
            {(selectedQuote.description || selectedQuote.voiceNote) && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                {selectedQuote.description && (
                  <div>
                    <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Additional Requirements
                    </h5>
                    <p className="text-sm text-slate-800 whitespace-pre-wrap">{selectedQuote.description}</p>
                  </div>
                )}
                {selectedQuote.voiceNote && (
                  <div>
                    <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Volume2 size={14} className="text-blue-600" /> Attached Voice Note
                    </h5>
                    <audio
                      controls
                      src={selectedQuote.voiceNote.url || selectedQuote.voiceNote}
                      className="w-full mt-1 h-10"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Location */}
            {selectedQuote.address && (
              <div className="flex items-start gap-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-xl">
                <MapPin size={16} className="text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-gray-800">Installation Address: </span>
                  {selectedQuote.address}
                </div>
              </div>
            )}

            {/* Price calculation block (Only if sent) */}
            {isPriceVisible(selectedQuote.status) ? (
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 rounded-2xl space-y-3 shadow-lg">
                <div className="flex justify-between text-sm text-slate-300">
                  <span>Subtotal Amount:</span>
                  <span className="font-semibold text-white">
                    ₹{(selectedQuote.subtotal || 0).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-slate-300">
                  <span>Goods & Services Tax (GST {selectedQuote.gstRate || 18}%):</span>
                  <span className="font-semibold text-white">
                    ₹{(selectedQuote.gstAmount || 0).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="border-t border-slate-700 pt-3 flex justify-between items-baseline">
                  <span className="text-base font-bold uppercase tracking-wider text-emerald-400">
                    Grand Total Payable:
                  </span>
                  <span className="text-3xl font-black text-white">
                    ₹{(selectedQuote.finalAmount || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-800 text-sm">
                <p className="font-bold flex items-center gap-1.5">
                  <Clock size={16} /> Pricing Under Review
                </p>
                <p className="text-xs mt-1 text-amber-700">
                  Our quotation team is finalizing competitive rates for the requested items. Once sent, complete price breakdown and payment options will appear right here.
                </p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setSelectedQuote(null)}
                className="rounded-xl border-gray-200"
              >
                Close
              </Button>
              {isPayable(selectedQuote.status) && (
                <Button
                  onClick={() => {
                    const q = selectedQuote;
                    setSelectedQuote(null);
                    handlePayNow(q);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-6"
                >
                  <CreditCard size={16} className="mr-2" /> Pay Now to Book
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ORDER CONFIRMATION MODAL (PART 14) */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in zoom-in-95">
          <Card className="bg-white rounded-3xl max-w-lg w-full p-8 text-center space-y-6 shadow-2xl border-2 border-emerald-500">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle size={44} />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Payment Verified &bull; Confirmed
              </span>
              <h2 className="text-3xl font-black text-gray-900">
                Order Confirmed Successfully!
              </h2>
              <p className="text-sm text-gray-600">
                Thank you! Your quotation booking has been securely processed and assigned to engineering.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Order Number:</span>
                <span className="font-extrabold text-slate-900">{orderSuccess.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-extrabold text-emerald-700">
                  ₹{orderSuccess.amountPaid?.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Order Date:</span>
                <span className="text-slate-700 font-medium">{formatDateTime(new Date())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Status:</span>
                <span className="text-emerald-600 font-bold uppercase text-xs bg-emerald-50 px-2 py-0.5 rounded">
                  Paid
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/dashboard/bookings" className="flex-1">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl py-3">
                  View in My Bookings
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => setOrderSuccess(null)}
                className="flex-1 border-gray-200 rounded-xl"
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
