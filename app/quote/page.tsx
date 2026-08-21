"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Check, ChevronLeft, ChevronRight, FileText, Loader2, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { cctvApi } from "@/lib/cctv-api";

// Dynamically import map component on client-side
const QuoteLocationPicker = dynamic(
  () => import("@/components/cctv/QuoteLocationPicker"),
  { ssr: false }
);

export default function QuotePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Step 1 Form States
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [locality, setLocality] = useState("");
  const [pincode, setPincode] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  // Step 2 Form States
  const [propertyType, setPropertyType] = useState("Home");
  const [requirementType, setRequirementType] = useState("New CCTV Installation");
  const [cameraCount, setCameraCount] = useState("1–4");
  const [cameraRequirement, setCameraRequirement] = useState("Indoor");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [recorder, setRecorder] = useState("DVR");
  const [storage, setStorage] = useState("1TB");
  const [additionalRequirements, setAdditionalRequirements] = useState("");
  const [preferredContact, setPreferredContact] = useState("Call");
  const [preferredVisitDate, setPreferredVisitDate] = useState("");
  const [preferredVisitTime, setPreferredVisitTime] = useState("09:00 AM - 12:00 PM");

  // Autofill if user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setFullName(user.name || "");
      setMobile(user.mobileNumber || user.phone || "");
      setEmail(user.email || "");
    }
  }, [isAuthenticated, user]);

  // Validation functions
  const isEmailValid = (val: string) => {
    if (!val) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const isMobileValid = (val: string) => {
    const cleaned = val.replace(/[\s+-]/g, "");
    return /^(?:\+91|0)?[6-9]\d{9}$/.test(cleaned);
  };

  const isStep1Valid = () => {
    return (
      fullName.trim().length > 0 &&
      mobile.trim().length > 0 &&
      isMobileValid(mobile) &&
      isEmailValid(email) &&
      locality.trim().length > 0 &&
      address.trim().length > 0
    );
  };

  const toggleFeature = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    );
  };

  const handleLocationSelected = (data: any) => {
    setLocality(data.area || data.city || "");
    setPincode(data.pincode || "");
    setAddress(data.address || "");
    setLatitude(data.latitude);
    setLongitude(data.longitude);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStep1Valid()) {
      setStep(1);
      setErrorMsg("Please complete all required fields in Step 1 with valid details.");
      return;
    }

    setSubmitting(false);
    setErrorMsg("");
    setSubmitting(true);

    try {
      const payload = {
        fullName,
        mobile,
        email,
        whatsapp,
        locality,
        pincode,
        address,
        latitude,
        longitude,
        propertyType,
        requirementType,
        cameraCount,
        cameraRequirement,
        features: selectedFeatures,
        recorder,
        storage,
        additionalRequirements,
        preferredContact,
        preferredVisitDate: preferredVisitDate || undefined,
        preferredVisitTime,
      };

      const res = await cctvApi.createQuoteRequest(payload);
      toast({
        title: "Success!",
        description: "Your CCTV quote request has been submitted successfully.",
      });

      // Navigate to success page
      const qParams = new URLSearchParams({
        requestId: res.requestId || "QT-PENDING",
        fullName: fullName,
        locality: locality,
        requirementType: requirementType,
        cameraCount: cameraCount,
      });

      router.replace(`/quote/success?${qParams.toString()}`);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit quote request. Please try again.");
      toast({
        title: "Submission Error",
        description: err.message || "An error occurred during submission.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageShell>
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 bg-slate-50/20 min-h-[80vh]">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => {
              if (step === 2) setStep(1);
              else router.back();
            }}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-600 transition"
          >
            <ChevronLeft className="h-4 w-4" />
            {step === 2 ? "Back to Step 1" : "Cancel & Go Back"}
          </button>
          
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
            <span className={step === 1 ? "text-blue-600" : ""}>1. Profile & Map</span>
            <span>/</span>
            <span className={step === 2 ? "text-blue-600" : ""}>2. CCTV Requirements</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">Get a CCTV Quote</h1>
            <p className="mt-1.5 text-xs text-slate-500 font-medium leading-relaxed">
              Design a custom security system. Services are currently available only in Bangalore and metro zones.
            </p>
          </div>

          {/* Progress Step Indicator */}
          <div className="relative mb-8 flex justify-between max-w-md mx-auto">
            <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-slate-100" />
            <div
              className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-blue-600 transition-all duration-300"
              style={{ width: step === 1 ? "0%" : "100%" }}
            />
            
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                  step >= 1 ? "bg-blue-600 text-white shadow-md ring-4 ring-blue-50" : "bg-slate-100 text-slate-400"
                }`}
              >
                1
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Location</span>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                  step === 2 ? "bg-blue-600 text-white shadow-md ring-4 ring-blue-50" : "bg-slate-100 text-slate-400"
                }`}
              >
                2
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">CCTV Detail</span>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-6 rounded-2xl border border-rose-100 bg-rose-50/50 p-4 text-xs font-semibold text-rose-700">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* STEP 1: CUSTOMER DETAILS & LOCATION */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="h-10 w-full rounded-xl border border-slate-200 px-3.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Mobile Number *</label>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="Enter 10-digit mobile number"
                      className={`h-10 w-full rounded-xl border px-3.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50 ${
                        mobile && !isMobileValid(mobile) ? "border-rose-400" : "border-slate-200"
                      }`}
                      required
                    />
                    {mobile && !isMobileValid(mobile) && (
                      <span className="text-[10px] text-rose-500 font-medium mt-1 block">Invalid Indian mobile number format</span>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. name@domain.com"
                      className={`h-10 w-full rounded-xl border px-3.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50 ${
                        email && !isEmailValid(email) ? "border-rose-400" : "border-slate-200"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">WhatsApp Number</label>
                    <input
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="Optional (if different from mobile)"
                      className="h-10 w-full rounded-xl border border-slate-200 px-3.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50"
                    />
                  </div>
                </div>

                {/* Map Location Picker */}
                <div className="pt-4 border-t border-slate-50">
                  <div className="mb-4">
                    <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1">Select Map Location *</label>
                    <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                      Drag the marker to pinpoint your site or search using the text box. Pincode and Area are auto-extracted.
                    </p>
                  </div>
                  <QuoteLocationPicker
                    onLocationSelected={handleLocationSelected}
                    initialCoords={latitude && longitude ? { lat: latitude, lng: longitude } : null}
                    initialAddressData={{
                      formattedAddress: address,
                      area: locality,
                      pincode: pincode,
                    }}
                  />
                </div>

                {/* Step Navigation */}
                <div className="pt-6 border-t border-slate-50 flex justify-end">
                  <Button
                    type="button"
                    disabled={!isStep1Valid()}
                    onClick={() => setStep(2)}
                    className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-1.5 shadow-md shadow-blue-500/10"
                  >
                    Continue to Requirements
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2: CCTV REQUIREMENTS */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                {/* Property & Requirement Types */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Property Type *</label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50"
                    >
                      {["Home", "Apartment", "Office", "Shop", "Warehouse", "School", "Other"].map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Requirement Type *</label>
                    <select
                      value={requirementType}
                      onChange={(e) => setRequirementType(e.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50"
                    >
                      {["New CCTV Installation", "Existing CCTV Upgrade", "CCTV Repair", "CCTV Replacement", "AMC", "Other"].map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Camera Count & Placements */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Approximate Camera Count *</label>
                    <select
                      value={cameraCount}
                      onChange={(e) => setCameraCount(e.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50"
                    >
                      {["1–4", "5–8", "9–16", "16+", "Not Sure"].map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Camera Requirement *</label>
                    <select
                      value={cameraRequirement}
                      onChange={(e) => setCameraRequirement(e.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50"
                    >
                      {["Indoor", "Outdoor", "Both", "Not Sure"].map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Features Checklist */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Required Features (Select all that apply)</label>
                  <div className="grid gap-2.5 sm:grid-cols-3">
                    {["Night Vision", "Audio", "Mobile Remote Viewing", "Wi-Fi Camera", "4G Camera", "Other"].map((feat) => {
                      const isSelected = selectedFeatures.includes(feat);
                      return (
                        <button
                          key={feat}
                          type="button"
                          onClick={() => toggleFeature(feat)}
                          className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-150 text-left ${
                            isSelected
                              ? "bg-blue-50/50 border-blue-200 ring-1 ring-blue-100 text-blue-700 font-bold"
                              : "bg-slate-50/50 border-slate-100 hover:border-slate-200 text-slate-600 font-medium"
                          }`}
                        >
                          <span className="text-[11px]">{feat}</span>
                          <span
                            className={`h-4.5 w-4.5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-300"
                            }`}
                          >
                            {isSelected ? "✓" : "+"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Recorder & Storage (Show only if new installation / upgrade / replacements) */}
                {["New CCTV Installation", "Existing CCTV Upgrade", "CCTV Replacement", "Other"].includes(requirementType) && (
                  <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t border-slate-50 animate-fade-in">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Preferred Recorder *</label>
                      <select
                        value={recorder}
                        onChange={(e) => setRecorder(e.target.value)}
                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50"
                      >
                        {["DVR", "NVR", "Not Sure"].map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Storage Capacity *</label>
                      <select
                        value={storage}
                        onChange={(e) => setStorage(e.target.value)}
                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50"
                      >
                        {["500GB", "1TB", "2TB", "4TB", "6TB", "Not Sure"].map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Additional notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Additional Requirements</label>
                  <textarea
                    rows={3}
                    value={additionalRequirements}
                    onChange={(e) => setAdditionalRequirements(e.target.value)}
                    placeholder="Specify special requirements, brands (e.g. Hikvision, CP Plus), wiring paths, height, or brackets required..."
                    className="w-full rounded-xl border border-slate-200 p-3 text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50 resize-none"
                  />
                </div>

                {/* Visit details & Preferred contact */}
                <div className="pt-4 border-t border-slate-50 grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Contact Method *</label>
                    <select
                      value={preferredContact}
                      onChange={(e) => setPreferredContact(e.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-700 focus:outline-none bg-slate-50"
                    >
                      {["Call", "WhatsApp", "Email"].map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Preferred Visit Date</label>
                    <input
                      type="date"
                      value={preferredVisitDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setPreferredVisitDate(e.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-700 focus:outline-none bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Preferred Visit Time</label>
                    <select
                      value={preferredVisitTime}
                      onChange={(e) => setPreferredVisitTime(e.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-700 focus:outline-none bg-slate-50"
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

                {/* Navigation Buttons */}
                <div className="pt-6 border-t border-slate-50 flex items-center justify-between gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="h-11 px-5 rounded-xl border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                    disabled={submitting}
                  >
                    Back to Location
                  </Button>

                  <Button
                    type="submit"
                    disabled={submitting || !isStep1Valid()}
                    className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-1.5 shadow-md shadow-blue-500/10"
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
              </div>
            )}
          </form>
        </div>
      </main>
    </PageShell>
  );
}
