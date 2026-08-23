"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ArrowRight, ShieldCheck, Mail, Phone, Building, MapPin, Calendar, Clock, Edit2 } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { cctvApi } from "@/lib/cctv-api";

function GetQuoteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Customer Details Fields
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [preferredContact, setPreferredContact] = useState("Phone");

  // Service Requirement Fields
  const [serviceCategory, setServiceCategory] = useState("CCTV");

  // CCTV Specific Fields (shown conditionally)
  const [cctvReqType, setCctvReqType] = useState("New CCTV Installation");
  const [cctvCamCount, setCctvCamCount] = useState("1–4");
  const [cctvPropType, setCctvPropType] = useState("Home");

  // Location Fields
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");

  // Requirement Description Fields
  const [additionalRequirements, setAdditionalRequirements] = useState("");
  const [preferredVisitDate, setPreferredVisitDate] = useState("");
  const [preferredVisitTime, setPreferredVisitTime] = useState("09:00 AM - 12:00 PM");

  // Autofill user details if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setFullName(user.name || "");
      setMobile(user.mobileNumber || user.phone || "");
      setEmail(user.email || "");
    }
  }, [isAuthenticated, user]);

  // Pre-select service category based on query parameters
  useEffect(() => {
    const serviceParam = searchParams.get("service")?.toLowerCase() || "";
    if (serviceParam.includes("cctv")) {
      setServiceCategory("CCTV");
    } else if (serviceParam.includes("network")) {
      setServiceCategory("Networking");
    } else if (serviceParam.includes("laptop")) {
      setServiceCategory("Laptop");
    } else if (serviceParam.includes("desktop")) {
      setServiceCategory("Desktop");
    } else if (serviceParam.includes("server")) {
      setServiceCategory("Server");
    } else if (serviceParam) {
      setServiceCategory("Other");
    }
  }, [searchParams]);

  // Validations
  const isEmailValid = (val: string) => {
    if (!val) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const isMobileValid = (val: string) => {
    const cleaned = val.replace(/[\s+-]/g, "");
    return /^(?:\+91|0)?[6-9]\d{9}$/.test(cleaned);
  };

  const isPincodeValid = (val: string) => {
    return /^\d{6}$/.test(val.trim());
  };

  const isFormValid = () => {
    return (
      fullName.trim().length > 0 &&
      mobile.trim().length > 0 &&
      isMobileValid(mobile) &&
      isEmailValid(email) &&
      serviceCategory.trim().length > 0 &&
      address.trim().length > 0 &&
      pincode.trim().length > 0 &&
      isPincodeValid(pincode) &&
      additionalRequirements.trim().length > 0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      setErrorMsg("Please complete all required fields with valid details.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const payload: any = {
        fullName,
        mobile,
        email,
        companyName,
        preferredContact,
        serviceCategory,
        address,
        pincode,
        googleMapsUrl,
        additionalRequirements,
        preferredVisitDate: preferredVisitDate || undefined,
        preferredVisitTime,
        source: "Website Quote Request",
      };

      // Conditionally append CCTV details if selected
      if (serviceCategory === "CCTV") {
        payload.requirementType = cctvReqType;
        payload.cameraCount = cctvCamCount;
        payload.propertyType = cctvPropType;
      }

      const res = await cctvApi.createQuoteRequest(payload);
      
      toast({
        title: "Quote Submitted Successfully!",
        description: "Our security and deployment engineers will review your request shortly.",
      });

      // Redirect to the general quote success page
      const qParams = new URLSearchParams({
        requestId: res.requestId || "QT-PENDING",
        fullName: fullName,
        serviceCategory: serviceCategory,
        pincode: pincode,
      });

      router.push(`/get-a-quote/success?${qParams.toString()}`);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit quote request. Please try again.");
      toast({
        title: "Submission Error",
        description: err.message || "An error occurred during submission.",
        variant: "destructive",
      });
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 bg-slate-50/10 min-h-[80vh] text-slate-800 font-sans">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-600 transition"
        >
          ← Cancel & Go Back
        </button>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-md sm:p-8">
        <div className="mb-8 text-center sm:text-left border-b border-slate-50 pb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">Get a Quote</h1>
          <p className="mt-2 text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Tell us what you need and our team will get back to you with the right solution.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 rounded-2xl border border-rose-100 bg-rose-50/50 p-4 text-xs font-semibold text-rose-700">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION 1: CUSTOMER DETAILS */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
              <Building className="h-4.5 w-4.5 text-blue-600" /> 1. Customer Profile
            </h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="h-10 w-full rounded-xl border border-slate-200 px-3.5 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5">Mobile Number *</label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="10-digit mobile number"
                  className={`h-10 w-full rounded-xl border px-3.5 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    mobile && !isMobileValid(mobile) ? "border-rose-300" : "border-slate-200"
                  }`}
                  required
                />
                {mobile && !isMobileValid(mobile) && (
                  <span className="text-[10px] text-rose-500 font-bold mt-1 block">Please enter a valid Indian number</span>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. name@company.com"
                  className={`h-10 w-full rounded-xl border px-3.5 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    email && !isEmailValid(email) ? "border-rose-300" : "border-slate-200"
                  }`}
                />
                {email && !isEmailValid(email) && (
                  <span className="text-[10px] text-rose-500 font-bold mt-1 block">Invalid email format</span>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5">Company / Organization Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Optional (for business solutions)"
                  className="h-10 w-full rounded-xl border border-slate-200 px-3.5 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1.5">Preferred Contact Method</label>
              <div className="flex gap-4">
                {["Phone", "WhatsApp", "Email"].map((method) => (
                  <label key={method} className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                    <input
                      type="radio"
                      name="preferredContact"
                      value={method}
                      checked={preferredContact === method}
                      onChange={() => setPreferredContact(method)}
                      className="accent-blue-600 h-4 w-4"
                    />
                    {method}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 2: SERVICE REQUIREMENTS */}
          <div className="space-y-4 pt-4 border-t border-slate-50">
            <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
              <Phone className="h-4.5 w-4.5 text-blue-600" /> 2. Quotation Requirement
            </h3>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1.5">Service Category *</label>
              <select
                value={serviceCategory}
                onChange={(e) => setServiceCategory(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {["CCTV", "Networking", "Laptop", "Desktop", "Server", "Other"].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* CONDITIONAL CCTV FIELDS */}
            {serviceCategory === "CCTV" && (
              <div className="grid gap-4 sm:grid-cols-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 animate-fade-in">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Requirement Type</label>
                  <select
                    value={cctvReqType}
                    onChange={(e) => setCctvReqType(e.target.value)}
                    className="h-9 w-full rounded-lg border border-slate-200 px-2 text-xs font-bold text-slate-700 bg-white"
                  >
                    {["New CCTV Installation", "Existing CCTV Repair", "CCTV Upgrade", "CCTV AMC", "CCTV Products"].map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Number of Cameras</label>
                  <select
                    value={cctvCamCount}
                    onChange={(e) => setCctvCamCount(e.target.value)}
                    className="h-9 w-full rounded-lg border border-slate-200 px-2 text-xs font-bold text-slate-700 bg-white"
                  >
                    {["1–4", "5–8", "9–16", "17–32", "More than 32"].map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Property Type</label>
                  <select
                    value={cctvPropType}
                    onChange={(e) => setCctvPropType(e.target.value)}
                    className="h-9 w-full rounded-lg border border-slate-200 px-2 text-xs font-bold text-slate-700 bg-white"
                  >
                    {["Home", "Office", "Shop", "Warehouse", "Apartment", "Other"].map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: LOCATION DETAILS */}
          <div className="space-y-4 pt-4 border-t border-slate-50">
            <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
              <MapPin className="h-4.5 w-4.5 text-blue-600" /> 3. Service Location
            </h3>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5">Address / Area *</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House/office number, building, road, area"
                  className="h-10 w-full rounded-xl border border-slate-200 px-3.5 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5">Pincode *</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="6-digit pincode"
                  maxLength={6}
                  className={`h-10 w-full rounded-xl border px-3.5 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    pincode && !isPincodeValid(pincode) ? "border-rose-300" : "border-slate-200"
                  }`}
                  required
                />
                {pincode && !isPincodeValid(pincode) && (
                  <span className="text-[10px] text-rose-500 font-bold mt-1 block">Must be 6 numbers</span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1.5">Google Maps / Location URL (Optional)</label>
              <input
                type="url"
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                placeholder="https://maps.google.com/..."
                className="h-10 w-full rounded-xl border border-slate-200 px-3.5 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* SECTION 4: REQUIREMENT DESCRIPTION & SCHEDULE */}
          <div className="space-y-4 pt-4 border-t border-slate-50">
            <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
              <Calendar className="h-4.5 w-4.5 text-blue-600" /> 4. Detail & Schedule
            </h3>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1.5">Detailed Requirement / Message *</label>
              <textarea
                rows={4}
                value={additionalRequirements}
                onChange={(e) => setAdditionalRequirements(e.target.value)}
                placeholder="Describe your requirement in detail (e.g. wire routes, camera models, problems faced, device configuration)..."
                className="w-full rounded-xl border border-slate-200 p-3.5 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5 flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Preferred Visit Date</label>
                <input
                  type="date"
                  value={preferredVisitDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setPreferredVisitDate(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-700 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5 flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Preferred Time Slot</label>
                <select
                  value={preferredVisitTime}
                  onChange={(e) => setPreferredVisitTime(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-700 bg-slate-50 focus:outline-none"
                >
                  {[
                    "09:00 AM - 12:00 PM",
                    "12:00 PM - 03:00 PM",
                    "03:00 PM - 06:00 PM",
                    "ASAP / Anytime"
                  ].map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* SUBMIT TRIGGERS */}
          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <Button
              type="submit"
              disabled={submitting || !isFormValid()}
              className="h-11 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-1.5 shadow-md shadow-blue-500/10"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting Proposal...
                </>
              ) : (
                <>
                  Submit Quote Request
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function GeneralQuotePage() {
  return (
    <PageShell>
      <Suspense fallback={
        <div className="min-h-[80vh] flex items-center justify-center text-slate-400 text-sm font-bold">
          Loading quote application...
        </div>
      }>
        <GetQuoteForm />
      </Suspense>
    </PageShell>
  );
}
