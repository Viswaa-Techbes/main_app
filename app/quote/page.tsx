"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Camera,
  Network,
  Globe,
  CheckCircle2,
  Loader2,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  FileText,
  ShieldCheck,
  ArrowRight,
  Info,
  Clock,
  Sparkles,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/context/auth-context";
import {
  QUOTATION_CATEGORIES,
  QuotationCategory,
  findCategoryBySlug,
  findServiceBySlug,
} from "@/lib/service-quotation-data";

function QuoteFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();

  // Category & Service selection
  const [selectedCategory, setSelectedCategory] = useState<QuotationCategory>(
    QUOTATION_CATEGORIES[0]
  );
  const [selectedServiceSlug, setSelectedServiceSlug] = useState<string>(
    QUOTATION_CATEGORIES[0].services[0].slug
  );

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [message, setMessage] = useState("");

  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submittedData, setSubmittedData] = useState<{
    requestId: string;
    fullName: string;
    category: string;
    service: string;
    location: string;
  } | null>(null);

  // Pre-fill from URL query parameters (e.g. ?category=networking&service=router-modem)
  useEffect(() => {
    const catQuery = searchParams.get("category");
    const serviceQuery = searchParams.get("service") || searchParams.get("slug");

    if (catQuery) {
      const matchedCat = findCategoryBySlug(catQuery);
      if (matchedCat) {
        setSelectedCategory(matchedCat);
        if (serviceQuery) {
          const matchedService = findServiceBySlug(matchedCat.slug, serviceQuery);
          if (matchedService) {
            setSelectedServiceSlug(matchedService.slug);
          } else {
            setSelectedServiceSlug(matchedCat.services[0].slug);
          }
        } else {
          setSelectedServiceSlug(matchedCat.services[0].slug);
        }
      }
    } else if (serviceQuery) {
      for (const cat of QUOTATION_CATEGORIES) {
        const matched = findServiceBySlug(cat.slug, serviceQuery);
        if (matched) {
          setSelectedCategory(cat);
          setSelectedServiceSlug(matched.slug);
          break;
        }
      }
    }
  }, [searchParams]);

  // Autofill contact info if user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.name && !fullName) setFullName(user.name);
      if ((user.mobileNumber || user.phone) && !mobile) {
        setMobile(user.mobileNumber || user.phone || "");
      }
      if (user.email && !email) setEmail(user.email);
    }
  }, [isAuthenticated, user, fullName, mobile, email]);

  // Handle category change
  const handleCategoryChange = (cat: QuotationCategory) => {
    setSelectedCategory(cat);
    // Reset to first service of newly selected category
    if (cat.services.length > 0) {
      setSelectedServiceSlug(cat.services[0].slug);
    }
    setErrorMessage("");
  };

  // Mobile number validation (Indian 10-digit)
  const validateMobile = (value: string) => {
    const cleaned = value.replace(/[\s+-]/g, "");
    return /^(?:\+91|0)?[6-9]\d{9}$/.test(cleaned);
  };

  // Get currently selected service object
  const activeService =
    selectedCategory.services.find((s) => s.slug === selectedServiceSlug) ||
    selectedCategory.services[0];

  // Min date for preferred date picker is today
  const minDate = new Date().toISOString().split("T")[0];

  // Submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Validate required fields
    if (!fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!mobile.trim()) {
      setErrorMessage("Please enter your mobile number.");
      return;
    }

    if (!validateMobile(mobile.trim())) {
      setErrorMessage("Please enter a valid 10-digit Indian mobile number (e.g., 9876543210).");
      return;
    }

    if (!locationAddress.trim()) {
      setErrorMessage("Please enter your location or address in Bangalore.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        fullName: fullName.trim(),
        mobile: mobile.trim(),
        email: email.trim() || undefined,
        serviceCategory: selectedCategory.name,
        category: selectedCategory.slug,
        subcategory: activeService.name,
        service: activeService.slug,
        address: locationAddress.trim(),
        locality: locationAddress.trim(),
        location: locationAddress.trim(),
        preferredVisitDate: preferredDate || undefined,
        additionalRequirements: message.trim() || undefined,
        message: message.trim() || undefined,
        source: "Website Unified Quotation Form",
      };

      const res = await fetch("/api/v2/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(typeof window !== "undefined" && localStorage.getItem("token")
            ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
            : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit quotation request.");
      }

      const refId = data.data?.requestId || "QT-REQUESTED";

      // Redirect to success confirmation page with details
      const params = new URLSearchParams({
        requestId: refId,
        fullName: fullName.trim(),
        category: selectedCategory.name,
        service: activeService.name,
        locality: locationAddress.trim(),
      });

      router.push(`/quote/success?${params.toString()}`);
    } catch (err: any) {
      console.error("Submission failed:", err);
      setErrorMessage(
        err.message || "Something went wrong while submitting. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50/50 min-h-screen py-10 sm:py-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Header Title */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-100 px-3.5 py-1 text-[11px] font-bold text-blue-700 uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
            Official TechBes Service Quotation
          </div>
          <h1 className="mt-3.5 text-2xl font-black text-slate-900 tracking-tight sm:text-3xl lg:text-4xl">
            Request a Service Quotation
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
            Select your required service, fill out one simple form, and our engineering team will provide a customized itemized quotation. No upfront payment required.
          </p>
        </div>

        {/* Quotation Form Card */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-9 shadow-sm">
          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-xs font-semibold flex items-start gap-2.5">
              <span className="font-bold shrink-0">⚠️ Error:</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* ────────── STEP 1: SELECT CATEGORY ────────── */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                    1
                  </span>
                  Select Category
                </label>
                <span className="text-[11px] text-slate-400 font-medium">3 Supported Categories</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {QUOTATION_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory.id === cat.id;
                  const Icon =
                    cat.iconName === "Camera"
                      ? Camera
                      : cat.iconName === "Network"
                      ? Network
                      : Globe;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategoryChange(cat)}
                      className={`relative flex flex-col items-start p-4 rounded-2xl border text-left transition-all duration-200 ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/50 shadow-sm ring-2 ring-blue-500/20"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div
                        className={`p-2.5 rounded-xl mb-3 transition-colors ${
                          isSelected
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="w-full">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-sm text-slate-900">
                            {cat.title}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                              isSelected
                                ? "bg-blue-200/60 text-blue-800"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {cat.services.length} services
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-snug">
                          {cat.shortDesc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ────────── STEP 2: SELECT SUBCATEGORY / SERVICE ────────── */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                    2
                  </span>
                  Select Service / Subcategory
                </label>
                <span className="text-[11px] text-blue-600 font-bold">
                  {selectedCategory.title} ({selectedCategory.services.length} services available)
                </span>
              </div>

              {/* Service Dropdown & Preview */}
              <div className="space-y-3">
                <div className="relative">
                  <select
                    value={selectedServiceSlug}
                    onChange={(e) => setSelectedServiceSlug(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer"
                  >
                    {selectedCategory.services.map((svc) => (
                      <option key={svc.slug} value={svc.slug}>
                        {svc.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    ▼
                  </div>
                </div>

                {/* Selected Service Detail Preview Pill */}
                {activeService && (
                  <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-3.5 text-xs flex items-start gap-3">
                    <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-800">
                        Selected: <span className="text-blue-700">{activeService.name}</span>
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        {activeService.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ────────── STEP 3: CUSTOMER & LOCATION DETAILS ────────── */}
            <div className="pt-2 border-t border-slate-100">
              <div className="mb-4">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                    3
                  </span>
                  Your Details & Location
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Customer Name */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/40 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      maxLength={15}
                      placeholder="e.g. 9876543210"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/40 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Email (Optional) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                    Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      placeholder="e.g. ramesh@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/40 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Preferred Date (Optional) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                    Preferred Visit Date <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="date"
                      min={minDate}
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/40 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Location / Address (Full Width) */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                    Location / Address in Bangalore <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Koramangala 5th Block, near Sony World Junction, Bangalore"
                      value={locationAddress}
                      onChange={(e) => setLocationAddress(e.target.value)}
                      className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/40 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Additional Requirements / Message (Full Width) */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                    Additional Requirements / Message <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe your site details, number of cameras/points needed, timeline, or any specific questions..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50/40 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* ────────── SUBMISSION CALLOUT & ACTION ────────── */}
            <div className="pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-5 text-[11px] text-slate-500 leading-relaxed flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-blue-600 shrink-0" />
                <span>
                  <strong>Transparent TechBes Quotation:</strong> No upfront payment or card details needed. Our engineers will verify your site details and dispatch a transparent quotation to your mobile and WhatsApp.
                </span>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Submitting Quotation Request...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Quotation Request</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-2xs">
            <ShieldCheck className="h-5 w-5 text-blue-600 mx-auto mb-1.5" />
            <h4 className="text-xs font-bold text-slate-800">Verified Technicians</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Strict KYC and skill assessment</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-2xs">
            <Clock className="h-5 w-5 text-emerald-600 mx-auto mb-1.5" />
            <h4 className="text-xs font-bold text-slate-800">Prompt Callback</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Quotes dispatched within hours</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-2xs">
            <Sparkles className="h-5 w-5 text-indigo-600 mx-auto mb-1.5" />
            <h4 className="text-xs font-bold text-slate-800">Itemized Estimates</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Clear breakdown with zero hidden charges</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function UnifiedQuotePage() {
  return (
    <PageShell>
      <Suspense
        fallback={
          <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 text-slate-400 text-xs font-bold">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span>Loading TechBes Quotation Portal...</span>
          </div>
        }
      >
        <QuoteFormContent />
      </Suspense>
    </PageShell>
  );
}
