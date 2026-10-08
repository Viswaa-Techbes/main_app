"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  CheckCircle2,
  Phone,
  User,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  MessageSquare,
  Lock,
  Building,
} from "lucide-react";
import { DemoCategory, DemoSubCategory, DEMO_OFFICE_PHONE } from "./demo-data";

interface DemoFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: DemoCategory | null;
  selectedSubcategory: DemoSubCategory | null;
  initialFreeSiteVisit?: boolean;
}

export function DemoFlowModal({
  isOpen,
  onClose,
  selectedCategory,
  selectedSubcategory,
  initialFreeSiteVisit = false,
}: DemoFlowModalProps) {
  // Flow steps: 1 = Login Prompt, 2 = Lead Form, 3 = Confirmation
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form states
  const [phone, setPhone] = useState("98765 43210");
  const [otpSent, setOtpSent] = useState(false);
  const [name, setName] = useState("Rahul Sharma");
  const [locality, setLocality] = useState("Indiranagar, Bangalore");
  const [query, setQuery] = useState(
    selectedSubcategory
      ? `Looking for ${selectedSubcategory.name} for our 2-floor commercial property. Please inspect and advise.`
      : "Need consultation and site visit for our property."
  );
  const [freeSiteVisit, setFreeSiteVisit] = useState(initialFreeSiteVisit || selectedSubcategory?.slug === "free-site-survey");
  const [preferredDate, setPreferredDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [preferredTime, setPreferredTime] = useState("10:00 AM - 01:00 PM");
  const [generatedQuoteId, setGeneratedQuoteId] = useState("TB-QT-7492");

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setOtpSent(false);
      setFreeSiteVisit(initialFreeSiteVisit || selectedSubcategory?.slug === "free-site-survey");
      if (selectedSubcategory) {
        setQuery(`Looking for ${selectedSubcategory.name}. Please inspect and provide quotation.`);
      }
    }
  }, [isOpen, selectedSubcategory, initialFreeSiteVisit]);

  if (!isOpen) return null;

  const handleSimulateLogin = () => {
    setStep(2);
  };

  const handleSubmitLead = (e: React.FormEvent) => {
    e.preventDefault();
    const randomId = `TB-QT-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedQuoteId(randomId);
    setStep(3);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/60 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20">
              TB
            </div>
            <div>
              <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                Customer Request Flow Mockup
              </div>
              <h3 className="text-base font-bold text-white">
                {selectedCategory?.name || "TechBes Service"} • {selectedSubcategory?.name || "Service Selection"}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="px-6 py-2.5 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between text-xs">
          <div className={`flex items-center gap-2 font-medium ${step >= 1 ? "text-blue-400" : "text-slate-500"}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 1 ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400"}`}>
              1
            </span>
            <span>Customer Login</span>
          </div>
          <div className="w-8 h-px bg-slate-800" />
          <div className={`flex items-center gap-2 font-medium ${step >= 2 ? "text-blue-400" : "text-slate-500"}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 2 ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400"}`}>
              2
            </span>
            <span>Requirement & Lead Form</span>
          </div>
          <div className="w-8 h-px bg-slate-800" />
          <div className={`flex items-center gap-2 font-medium ${step === 3 ? "text-emerald-400" : "text-slate-500"}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 3 ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400"}`}>
              3
            </span>
            <span>Quotation Generated</span>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* ──────────────── STEP 1: LOGIN PROMPT MOCKUP ──────────────── */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center max-w-md mx-auto pt-2">
                <div className="inline-flex p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-3">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-white tracking-tight">
                  Sign In to Request Quotation
                </h4>
                <p className="text-sm text-slate-400 mt-1.5">
                  Verify your mobile number to track live quotation status, engineer dispatch, and warranty records.
                </p>
              </div>

              {/* Selected Subcategory Info Box */}
              {selectedSubcategory && (
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Selected Service</div>
                    <div className="text-sm font-semibold text-white">{selectedSubcategory.name}</div>
                  </div>
                  {selectedSubcategory.badge && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 font-medium border border-blue-500/30">
                      {selectedSubcategory.badge}
                    </span>
                  )}
                </div>
              )}

              {/* Mockup Mobile Form */}
              <div className="max-w-md mx-auto space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Enter Mobile Number
                  </label>
                  <div className="flex rounded-xl overflow-hidden border border-slate-700 focus-within:border-blue-500 transition">
                    <span className="inline-flex items-center px-3.5 bg-slate-800 text-slate-400 text-sm font-medium border-r border-slate-700">
                      +91
                    </span>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="98765 43210"
                      className="w-full px-3.5 py-2.5 bg-slate-900/90 text-white text-sm outline-none font-medium"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    We'll send a 6-digit verification code to confirm your request.
                  </p>
                </div>

                {/* Instant Verification Demo Actions */}
                <div className="pt-2 space-y-3">
                  <button
                    type="button"
                    onClick={handleSimulateLogin}
                    className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/25 transition flex items-center justify-center gap-2"
                  >
                    <span>Quick Demo Sign-In & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2 justify-center text-xs text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>OTP verified instantly in Investor Demo Mode</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────── STEP 2: LEAD FORM MOCKUP ──────────────── */}
          {step === 2 && (
            <form onSubmit={handleSubmitLead} className="space-y-5">
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between text-xs text-blue-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Logged in as <strong>{name}</strong> (+91 {phone})
                  </span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/20 font-medium">
                  Verified
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Your Full Name <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white outline-none focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Phone Number <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      required
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white outline-none focus:border-blue-500 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Location in Bangalore */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Service Location / Area in Bangalore <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    required
                    type="text"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="e.g. Indiranagar, Koramangala, Nagarbhavi, Bangalore"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              {/* Requirement Query */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Requirement Query / Notes
                </label>
                <textarea
                  rows={3}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Describe your requirement, camera count, cabling details..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white outline-none focus:border-blue-500 transition resize-none"
                />
              </div>

              {/* ── PROMINENT FREE SITE VISIT OPTION ── */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border-2 border-emerald-500/40 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="freeVisitToggle"
                  checked={freeSiteVisit}
                  onChange={(e) => setFreeSiteVisit(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
                <label htmlFor="freeVisitToggle" className="cursor-pointer select-none">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">
                      Include 100% Free On-Site Inspection & Property Survey
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Zero Cost
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    A certified TechBes engineer will visit your property in Bangalore, map camera coverage / network wiring pathways, and draft an itemized estimate with zero commitment.
                  </p>
                </label>
              </div>

              {/* Date & Time Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Preferred Visit Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white outline-none focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Preferred Time Slot
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white outline-none focus:border-blue-500 transition"
                    >
                      <option value="09:00 AM - 12:00 PM">Morning (09:00 AM - 12:00 PM)</option>
                      <option value="12:00 PM - 03:00 PM">Afternoon (12:00 PM - 03:00 PM)</option>
                      <option value="03:00 PM - 06:00 PM">Evening (03:00 PM - 06:00 PM)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  ← Back to Login
                </button>

                <button
                  type="submit"
                  className="py-3 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/25 transition flex items-center gap-2"
                >
                  <span>Submit & Request Quotation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* ──────────────── STEP 3: QUOTATION GENERATED CONFIRMATION ──────────────── */}
          {step === 3 && (
            <div className="space-y-6 py-2 text-center">
              <div className="inline-flex p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-2xl font-extrabold text-white tracking-tight">
                  Quotation Request Dispatched!
                </h4>
                <p className="text-sm text-slate-400 mt-1.5 max-w-md mx-auto">
                  Your request has been routed to the TechBes Central Dispatch Team. A technical estimate and engineer slot have been reserved.
                </p>
              </div>

              {/* Generated Request Details Card */}
              <div className="max-w-md mx-auto p-4 rounded-xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Quotation Request ID:</span>
                  <span className="font-mono font-bold text-blue-400">{generatedQuoteId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Customer Name:</span>
                  <span className="font-semibold text-white">{name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Mobile Number:</span>
                  <span className="font-semibold text-white">+91 {phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Service:</span>
                  <span className="font-semibold text-white">
                    {selectedCategory?.name} › {selectedSubcategory?.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Location:</span>
                  <span className="font-semibold text-white">{locality}</span>
                </div>
                {freeSiteVisit && (
                  <div className="flex items-center justify-between pt-1 text-emerald-400 font-semibold">
                    <span>Free Site Visit:</span>
                    <span>✓ Scheduled ({preferredDate}, {preferredTime.split(" ")[0]})</span>
                  </div>
                )}
              </div>

              {/* Workflow Pipeline Demonstration for Investors */}
              <div className="max-w-md mx-auto p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 text-left text-xs space-y-2">
                <div className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                  What Happens Next in the Customer Flow:
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="text-slate-300">
                    <strong className="text-white">Assigned to Local Bangalore Hub:</strong> Certified technician allocated within 15 minutes.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="text-slate-300">
                    <strong className="text-white">Digital Quotation on WhatsApp:</strong> Transparent itemized price sent directly to customer.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="text-slate-300">
                    <strong className="text-white">Free Site Survey & Setup:</strong> Engineer arrives at customer location on scheduled slot.
                  </div>
                </div>
              </div>

              {/* Close / New Demo Action */}
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    onClose();
                  }}
                  className="py-2.5 px-6 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white transition"
                >
                  Close & Explore More Services
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
