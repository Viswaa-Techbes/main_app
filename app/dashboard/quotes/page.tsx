"use client";

import { useEffect, useState, useCallback } from "react";
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
  ShieldCheck,
  PackageCheck,
  Sparkles,
  Receipt,
  X,
  RefreshCw,
  Download,
  Printer,
  ChevronRight,
  CheckCircle2,
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

function getStatusBadge(status: string, quotePaymentStatus?: string) {
  if (quotePaymentStatus === "fully_paid" || status === "paid") {
    return {
      label: "Fully Paid & Confirmed",
      color: "bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold",
      icon: PackageCheck,
    };
  }
  if (status === "advance_paid" || quotePaymentStatus === "advance_paid") {
    return {
      label: "Advance Paid • In Progress",
      color: "bg-blue-50 text-blue-700 border-blue-300 font-semibold",
      icon: CheckCircle,
    };
  }
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
    case "quotation_accepted":
      return {
        label: "Quotation Approved – Pay Advance",
        color: "bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold",
        icon: CreditCard,
      };
    case "payment_pending":
      return {
        label: "Advance Payment Pending",
        color: "bg-purple-50 text-purple-700 border-purple-200",
        icon: CreditCard,
      };
    case "balance_pending":
      return {
        label: "Balance Payment Pending",
        color: "bg-purple-50 text-purple-700 border-purple-200",
        icon: CreditCard,
      };
    case "converted_to_order":
      return {
        label: "Order Booked",
        color: "bg-emerald-100 text-emerald-800 border-emerald-400 font-semibold",
        icon: PackageCheck,
      };
    case "cancelled":
    case "Rejected":
      return {
        label: "Declined",
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
  const [refreshing, setRefreshing] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [payingQuoteId, setPayingQuoteId] = useState<string | null>(null);
  const [payingType, setPayingType] = useState<"advance" | "balance">("advance");
  const [payError, setPayError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState<any>(null);
  const [viewInvoiceData, setViewInvoiceData] = useState<any>(null);
  const [loadingInvoice, setLoadingInvoice] = useState(false);

  const fetchQuotes = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      const res = await fetchAuthApi("/api/v2/quotes/my-quotes");
      if (res.success && Array.isArray(res.data)) {
        setQuotes(res.data);
        // If a quote was selected in modal, update it with fresh backend data
        setSelectedQuote((prev: any) => {
          if (!prev) return null;
          const fresh = res.data.find((q: any) => q._id === prev._id || q.requestId === prev.requestId);
          return fresh || prev;
        });
      }
    } catch (err: any) {
      console.error("Failed to fetch customer quotes:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchQuotes();

    // Auto-refresh on window focus to catch any Admin updates instantly
    const handleFocus = () => fetchQuotes(true);
    window.addEventListener("focus", handleFocus);

    // Reliable background poll every 12 seconds for quotes in active lifecycle
    const timer = setInterval(() => {
      fetchQuotes(true);
    }, 12000);

    return () => {
      window.removeEventListener("focus", handleFocus);
      clearInterval(timer);
    };
  }, [fetchQuotes]);

  async function handlePay(quote: any, paymentType: "advance" | "balance") {
    setPayingQuoteId(quote._id);
    setPayingType(paymentType);
    setPayError("");

    try {
      // 1. Backend creates authoritative Razorpay order
      const orderRes = await fetchAuthApi(`/api/v2/quotes/${quote._id}/create-payment-order`, {
        method: "POST",
        body: JSON.stringify({ paymentType }),
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

      if (sdkLoaded && !orderData.isMock && orderData.keyId) {
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency || "INR",
          name: "TechBes Engineering",
          description: `Quotation ${paymentType === "advance" ? "Advance" : "Balance"} Payment: ${quote.requestId}`,
          order_id: orderData.orderId,
          handler: async (resp: any) => {
            await verifyPaymentOnServer(quote._id, {
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature: resp.razorpay_signature,
              paymentType,
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
        // Test / mock mode or simulated payment fallback
        const proceedMock = confirm(
          `Demo/Test Mode Active:\nProceed with simulated ${paymentType.toUpperCase()} payment for Quotation ${quote.requestId} (₹${orderData.displayAmount?.toLocaleString(
            "en-IN"
          )})?`
        );
        if (proceedMock) {
          await verifyPaymentOnServer(quote._id, {
            razorpay_order_id: orderData.orderId,
            razorpay_payment_id: `pay_mock_${Date.now()}`,
            paymentType,
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
        fetchQuotes(true);
      } else {
        alert(verifyRes.message || "Payment verification failed");
      }
    } catch (err: any) {
      alert("Verification error: " + (err.message || "Contact support"));
    }
  }

  async function handleAcceptQuote(quote: any) {
    if (!confirm(`Accept Quotation #${quote.requestId} (Total: ₹${(quote.finalAmount || 0).toLocaleString("en-IN")})?`)) return;

    try {
      const res = await fetchAuthApi(`/api/v2/quotes/${quote._id}/accept`, {
        method: "POST",
      });
      if (res.success) {
        alert("Quotation approved successfully! You can now proceed to pay the 50% advance to confirm your booking.");
        fetchQuotes(true);
      } else {
        alert(res.message || "Failed to accept quotation");
      }
    } catch (err: any) {
      alert("Error: " + (err.message || "Could not accept quotation"));
    }
  }

  async function handleRejectQuote(quote: any) {
    const reason = prompt(`Decline Quotation #${quote.requestId}?\nPlease share the reason (optional):`);
    if (reason === null) return;

    try {
      const res = await fetchAuthApi(`/api/v2/quotes/${quote._id}/reject`, {
        method: "POST",
        body: JSON.stringify({ reason: reason.trim() }),
      });
      if (res.success) {
        alert("Quotation has been declined.");
        fetchQuotes(true);
        if (selectedQuote?._id === quote._id) setSelectedQuote(null);
      } else {
        alert(res.message || "Failed to decline quotation");
      }
    } catch (err: any) {
      alert("Error: " + (err.message || "Could not decline quotation"));
    }
  }

  async function handleFetchInvoice(quoteId: string, paymentType: "advance" | "balance") {
    setLoadingInvoice(true);
    try {
      const res = await fetchAuthApi(`/api/v2/quotes/${quoteId}/invoice/${paymentType}`);
      if (res.success && res.data) {
        setViewInvoiceData(res.data);
      } else {
        alert(res.message || "Invoice details not found");
      }
    } catch (e: any) {
      alert("Error fetching invoice: " + e.message);
    } finally {
      setLoadingInvoice(false);
    }
  }

  const isPriceVisible = (status: string) => {
    return [
      "quotation_sent",
      "Quote Sent",
      "Quotation Sent",
      "quotation_accepted",
      "advance_paid",
      "payment_pending",
      "balance_pending",
      "paid",
      "converted_to_order",
      "Accepted",
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
            Track official quotations, inspect updated line items, and pay advance or balance amounts securely.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchQuotes(true)}
            disabled={refreshing}
            className="text-xs flex items-center gap-1.5 border-gray-200 hover:bg-gray-50"
          >
            <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Updating..." : "Refresh"}
          </Button>
          <Link href="/quote">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm flex items-center gap-2 text-xs py-2">
              <Sparkles size={14} /> Request New Quotation
            </Button>
          </Link>
        </div>
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
            <div key={i} className="h-44 bg-gray-100 animate-pulse rounded-2xl" />
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
        <div className="space-y-5">
          {quotes.map((quote) => {
            const badge = getStatusBadge(quote.status, quote.quotePaymentStatus);
            const BadgeIcon = badge.icon;
            const priceVisible = isPriceVisible(quote.status);

            const finalAmount = quote.finalAmount || 0;
            const advancePct = quote.advancePercentage || 50;
            const advanceAmount = quote.advanceAmount || Math.round(((finalAmount * advancePct) / 100) * 100) / 100;
            const advancePaid = quote.advancePaidAmount || 0;
            const isAdvancePaid = advancePaid >= advanceAmount && advanceAmount > 0;
            const balanceAmount = quote.balanceAmount !== undefined ? quote.balanceAmount : Math.max(0, finalAmount - advancePaid);
            const isBalancePaid = isAdvancePaid && (balanceAmount === 0 || quote.balancePaidAmount > 0);

            // Job status check for balance payment
            const isJobCompleted = quote.jobStatus === "completed" || (quote.orderId && quote.orderId.status === "completed");

            const canPayAdvance = priceVisible && !isAdvancePaid && (quote.status === "quotation_accepted" || quote.status?.toLowerCase().includes("sent") || quote.status === "payment_pending");
            const canPayBalance = isAdvancePaid && !isBalancePaid && isJobCompleted;
            const isBalanceAwaitingCompletion = isAdvancePaid && !isBalancePaid && !isJobCompleted;

            return (
              <Card
                key={quote._id}
                className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow rounded-2xl"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  {/* Left: Info & Scope */}
                  <div className="space-y-3.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
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
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
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

                    {/* Progress Indicator */}
                    {priceVisible && (
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1.5">
                          <span>Quotation Lifecycle Progress</span>
                          <span className="text-blue-600 font-bold">
                            {isBalancePaid
                              ? "100% Settled"
                              : isJobCompleted
                              ? "Job Complete • Balance Due"
                              : isAdvancePaid
                              ? "50% Advance Paid • Work In Progress"
                              : quote.status === "quotation_accepted"
                              ? "Quotation Accepted • Pay Advance"
                              : "Quotation Ready"}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden flex">
                          <div
                            className={`h-full transition-all duration-500 ${
                              isBalancePaid
                                ? "w-full bg-emerald-500"
                                : isJobCompleted
                                ? "w-4/5 bg-amber-500"
                                : isAdvancePaid
                                ? "w-1/2 bg-blue-600"
                                : quote.status === "quotation_accepted"
                                ? "w-1/4 bg-indigo-500"
                                : "w-1/12 bg-slate-400"
                            }`}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500 mt-1.5">
                          <span>1. Quotation Ready</span>
                          <span>2. Advance (₹{advanceAmount.toLocaleString("en-IN")})</span>
                          <span>3. Installation</span>
                          <span>4. Balance (₹{balanceAmount.toLocaleString("en-IN")})</span>
                        </div>
                      </div>
                    )}

                    {/* Items preview */}
                    <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 text-sm">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                          Scope Line Items ({quote.items?.length || 0})
                        </span>
                        {quote.quoteVersions?.length > 1 && (
                          <span className="text-[10px] bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                            Revision v{quote.quoteVersions.length}
                          </span>
                        )}
                      </div>
                      <div className="space-y-1">
                        {quote.items && quote.items.length > 0 ? (
                          quote.items.map((it: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center text-xs text-slate-700">
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
                          <span className="text-slate-500 italic text-xs">Custom requirements submitted</span>
                        )}
                      </div>

                      {/* Extra Charges Preview */}
                      {priceVisible && quote.pricingBreakdown && (
                        (quote.pricingBreakdown.labourCharge > 0 ||
                          quote.pricingBreakdown.serviceCharge > 0 ||
                          quote.pricingBreakdown.accessoriesCharge > 0 ||
                          quote.pricingBreakdown.miscCharge > 0) && (
                          <div className="mt-2 pt-2 border-t border-slate-200/70 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-600">
                            {quote.pricingBreakdown.labourCharge > 0 && (
                              <span>Labour/Installation: <strong>₹{quote.pricingBreakdown.labourCharge.toLocaleString("en-IN")}</strong></span>
                            )}
                            {quote.pricingBreakdown.serviceCharge > 0 && (
                              <span>Service: <strong>₹{quote.pricingBreakdown.serviceCharge.toLocaleString("en-IN")}</strong></span>
                            )}
                            {quote.pricingBreakdown.accessoriesCharge > 0 && (
                              <span>Accessories: <strong>₹{quote.pricingBreakdown.accessoriesCharge.toLocaleString("en-IN")}</strong></span>
                            )}
                            {quote.pricingBreakdown.miscCharge > 0 && (
                              <span>Misc: <strong>₹{quote.pricingBreakdown.miscCharge.toLocaleString("en-IN")}</strong></span>
                            )}
                          </div>
                        )
                      )}
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

                  {/* Right: Pricing & Payment Actions */}
                  <div className="lg:w-80 shrink-0 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6">
                    {priceVisible ? (
                      <div className="space-y-2 mb-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>Taxable Subtotal:</span>
                          <span>₹{(quote.subtotal || 0).toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>GST ({quote.gstRate || 18}%):</span>
                          <span>₹{(quote.gstAmount || 0).toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between items-baseline pt-1 border-t border-slate-200">
                          <span className="text-xs font-bold uppercase text-slate-700">Total Quotation:</span>
                          <span className="text-2xl font-black text-slate-900">
                            ₹{finalAmount.toLocaleString("en-IN")}
                          </span>
                        </div>

                        {/* Payment Breakdown Box */}
                        <div className="mt-2 pt-2 border-t border-slate-200 space-y-1.5 text-xs">
                          <div className="flex justify-between text-slate-700">
                            <span className="flex items-center gap-1">
                              {isAdvancePaid && <CheckCircle2 size={13} className="text-emerald-600" />}
                              Advance ({advancePct}%):
                            </span>
                            <span className={isAdvancePaid ? "text-emerald-700 font-bold line-through" : "font-bold text-slate-900"}>
                              ₹{advanceAmount.toLocaleString("en-IN")}
                            </span>
                          </div>

                          {isAdvancePaid && (
                            <div className="flex justify-between text-emerald-800 font-medium bg-emerald-50 px-2 py-1 rounded-md">
                              <span>Advance Paid:</span>
                              <span>₹{advancePaid.toLocaleString("en-IN")} (Paid)</span>
                            </div>
                          )}

                          <div className="flex justify-between text-slate-700">
                            <span>Balance Due on Completion:</span>
                            <span className={isBalancePaid ? "text-emerald-700 font-bold" : "font-black text-blue-700"}>
                              ₹{balanceAmount.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] text-emerald-700 font-medium text-right flex items-center justify-end gap-1 mt-1">
                          <ShieldCheck size={12} /> GST Included &bull; Authoritative Quote
                        </p>
                      </div>
                    ) : (
                      <div className="bg-amber-50/80 border border-amber-200 p-3.5 rounded-xl mb-4 text-center">
                        <p className="text-xs font-bold text-amber-800">Pricing Under Review</p>
                        <p className="text-[11px] text-amber-700 mt-0.5 leading-snug">
                          Our engineer is finalizing pricing. Once sent, itemized rates and payment options will appear here.
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      {/* 1. Advance Payment button */}
                      {canPayAdvance && (
                        <Button
                          onClick={() => handlePay(quote, "advance")}
                          disabled={payingQuoteId === quote._id}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl shadow-md shadow-emerald-200 flex items-center justify-center gap-2"
                        >
                          <CreditCard size={16} />
                          {payingQuoteId === quote._id && payingType === "advance"
                            ? "Processing..."
                            : `Pay Advance (₹${advanceAmount.toLocaleString("en-IN")})`}
                        </Button>
                      )}

                      {/* 2. Balance Payment button */}
                      {canPayBalance && (
                        <Button
                          onClick={() => handlePay(quote, "balance")}
                          disabled={payingQuoteId === quote._id}
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2.5 rounded-xl shadow-md shadow-blue-200 flex items-center justify-center gap-2 animate-pulse"
                        >
                          <CreditCard size={16} />
                          {payingQuoteId === quote._id && payingType === "balance"
                            ? "Processing..."
                            : `Pay Balance (₹${balanceAmount.toLocaleString("en-IN")})`}
                        </Button>
                      )}

                      {/* 3. Job in progress info when balance is pending */}
                      {isBalanceAwaitingCompletion && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-2.5 text-center text-xs text-blue-800 font-medium flex items-center justify-center gap-1.5">
                          <Clock size={14} className="text-blue-600 shrink-0" />
                          <span>Installation in progress. Balance unlocked upon completion.</span>
                        </div>
                      )}

                      {/* 4. Accept / Reject quotation */}
                      {quote.status?.toLowerCase().includes("sent") && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleAcceptQuote(quote)}
                            className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 font-bold py-1.5 rounded-xl text-xs flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle size={14} /> Accept Quote
                          </Button>
                          <Button
                            onClick={() => handleRejectQuote(quote)}
                            variant="outline"
                            className="flex-1 border-red-200 hover:bg-red-50 text-red-600 font-bold py-1.5 rounded-xl text-xs flex items-center justify-center gap-1.5"
                          >
                            <X size={14} /> Decline
                          </Button>
                        </div>
                      )}

                      {/* 5. Invoices & Full Details */}
                      <div className="flex gap-2">
                        {isAdvancePaid && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFetchInvoice(quote._id, "advance")}
                            className="flex-1 border-gray-200 hover:bg-gray-50 text-gray-700 text-[11px] rounded-xl flex items-center justify-center gap-1"
                          >
                            <Download size={12} /> Advance Receipt
                          </Button>
                        )}
                        {isBalancePaid && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFetchInvoice(quote._id, "balance")}
                            className="flex-1 border-emerald-200 bg-emerald-50 text-emerald-800 text-[11px] rounded-xl flex items-center justify-center gap-1"
                          >
                            <Download size={12} /> Final Invoice
                          </Button>
                        )}
                      </div>

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

            {/* Extra Charges Breakdown if available */}
            {isPriceVisible(selectedQuote.status) && selectedQuote.pricingBreakdown && (
              (selectedQuote.pricingBreakdown.labourCharge > 0 ||
                selectedQuote.pricingBreakdown.serviceCharge > 0 ||
                selectedQuote.pricingBreakdown.accessoriesCharge > 0 ||
                selectedQuote.pricingBreakdown.miscCharge > 0) && (
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Installation &amp; Extra Charges
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {selectedQuote.pricingBreakdown.labourCharge > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Installation Labour:</span>
                        <span className="font-semibold text-slate-900">₹{selectedQuote.pricingBreakdown.labourCharge.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    {selectedQuote.pricingBreakdown.serviceCharge > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Service Charges:</span>
                        <span className="font-semibold text-slate-900">₹{selectedQuote.pricingBreakdown.serviceCharge.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    {selectedQuote.pricingBreakdown.accessoriesCharge > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Accessories &amp; Materials:</span>
                        <span className="font-semibold text-slate-900">₹{selectedQuote.pricingBreakdown.accessoriesCharge.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    {selectedQuote.pricingBreakdown.miscCharge > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Misc / Travel:</span>
                        <span className="font-semibold text-slate-900">₹{selectedQuote.pricingBreakdown.miscCharge.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            )}

            {/* Terms and Conditions */}
            {selectedQuote.terms && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Terms &amp; Conditions
                </h5>
                <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">{selectedQuote.terms}</p>
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
                    Grand Total:
                  </span>
                  <span className="text-3xl font-black text-white">
                    ₹{(selectedQuote.finalAmount || 0).toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Advance & Balance Breakdown in Modal */}
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs text-slate-300">
                  <div>
                    Advance Required ({selectedQuote.advancePercentage || 50}%):{" "}
                    <strong className="text-white">
                      ₹{(selectedQuote.advanceAmount || 0).toLocaleString("en-IN")}
                    </strong>
                    {selectedQuote.advancePaidAmount > 0 && (
                      <span className="ml-2 text-emerald-400 font-bold">(Paid)</span>
                    )}
                  </div>
                  <div>
                    Remaining Balance:{" "}
                    <strong className="text-emerald-400">
                      ₹{(selectedQuote.balanceAmount || 0).toLocaleString("en-IN")}
                    </strong>
                  </div>
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
            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setSelectedQuote(null)}
                className="rounded-xl border-gray-200"
              >
                Close
              </Button>
              {selectedQuote.status?.toLowerCase().includes("sent") && (
                <>
                  <Button
                    onClick={() => {
                      const q = selectedQuote;
                      handleRejectQuote(q);
                    }}
                    variant="outline"
                    className="border-red-200 hover:bg-red-50 text-red-600 font-bold rounded-xl"
                  >
                    <X size={16} className="mr-1.5" /> Decline
                  </Button>
                  <Button
                    onClick={() => {
                      const q = selectedQuote;
                      handleAcceptQuote(q);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl"
                  >
                    <CheckCircle size={16} className="mr-1.5" /> Accept Quote
                  </Button>
                </>
              )}
              {isPriceVisible(selectedQuote.status) && (selectedQuote.advancePaidAmount || 0) < selectedQuote.advanceAmount && (
                <Button
                  onClick={() => {
                    const q = selectedQuote;
                    setSelectedQuote(null);
                    handlePay(q, "advance");
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-6"
                >
                  <CreditCard size={16} className="mr-2" /> Pay Advance (₹{(selectedQuote.advanceAmount || 0).toLocaleString("en-IN")})
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* INVOICE & RECEIPT MODAL */}
      {viewInvoiceData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in zoom-in-95">
          <Card className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-gray-200">
            <div className="flex justify-between items-start pb-3 border-b border-gray-100">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {viewInvoiceData.paymentType === "balance" ? "Final Settlement Invoice" : "Advance Payment Receipt"}
                </span>
                <h3 className="text-xl font-black text-gray-900 mt-1">
                  {viewInvoiceData.invoiceNumber}
                </h3>
                <p className="text-xs text-gray-500">Ref: {viewInvoiceData.quotationNumber} &bull; Order #{viewInvoiceData.orderNumber}</p>
              </div>
              <button
                onClick={() => setViewInvoiceData(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Billed To</span>
                  <span className="font-bold text-slate-900">{viewInvoiceData.customerName}</span>
                  <span className="block text-slate-500">{viewInvoiceData.customerMobile}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment Details</span>
                  <span className="font-semibold text-slate-900">Paid: ₹{viewInvoiceData.amountPaid?.toLocaleString("en-IN")}</span>
                  <span className="block text-slate-500">Date: {formatDateTime(viewInvoiceData.date)}</span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 font-bold text-slate-700">
                    <tr>
                      <th className="p-2.5">Scope Item</th>
                      <th className="p-2.5 text-center">Qty</th>
                      <th className="p-2.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(viewInvoiceData.items || []).map((it: any, i: number) => (
                      <tr key={i}>
                        <td className="p-2.5">{it.productName}</td>
                        <td className="p-2.5 text-center">{it.quantity}</td>
                        <td className="p-2.5 text-right font-medium">₹{(it.lineTotal || 0).toLocaleString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-slate-900 text-white p-3.5 rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Quotation Value:</span>
                  <span>₹{viewInvoiceData.finalAmount?.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-400 text-sm pt-1 border-t border-slate-800">
                  <span>Amount Paid ({viewInvoiceData.paymentType}):</span>
                  <span>₹{viewInvoiceData.amountPaid?.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Outstanding Balance:</span>
                  <span>₹{viewInvoiceData.balanceAmount?.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => window.print()}
                className="flex-1 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <Printer size={14} /> Print Receipt
              </Button>
              <Button
                variant="outline"
                onClick={() => setViewInvoiceData(null)}
                className="flex-1 border-gray-200 rounded-xl text-xs"
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ORDER CONFIRMATION MODAL */}
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
                {orderSuccess.paymentType === "balance"
                  ? "Quotation Fully Settled!"
                  : "Order Confirmed Successfully!"}
              </h2>
              <p className="text-sm text-gray-600">
                {orderSuccess.paymentType === "balance"
                  ? "Thank you! Your remaining balance has been received and your quotation is completely closed."
                  : "Thank you! Your advance payment was verified and order booking has been confirmed."}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Order Number:</span>
                <span className="font-extrabold text-slate-900">{orderSuccess.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Invoice Number:</span>
                <span className="font-bold text-slate-700">{orderSuccess.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-extrabold text-emerald-700">
                  ₹{orderSuccess.amountPaid?.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Outstanding Balance:</span>
                <span className="font-bold text-slate-900">
                  ₹{orderSuccess.balanceAmount?.toLocaleString("en-IN")}
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
